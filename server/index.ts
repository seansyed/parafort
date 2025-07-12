import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { startComplianceReminderService } from "./cron-service.js";
import { setupProduction } from "./production.js";
import { setupOTPAuth } from "./otp-auth-system.js";
import { setupOTPRoutes } from "./otp-routes";
import session from "express-session";
import connectPg from "connect-pg-simple";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Disable ETags globally to prevent 304 responses
app.set('etag', false);

// Setup session middleware for email auth with PostgreSQL store
const PostgresSessionStore = connectPg(session);

app.use(session({
  store: new PostgresSessionStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: true,
    ttl: 24 * 60 * 60, // 24 hours in seconds
    tableName: 'session',
  }),
  secret: process.env.SESSION_SECRET || 'fallback-secret-key-for-dev',
  resave: false, // Don't save session if unmodified (recommended)
  saveUninitialized: false, // Don't create session until something stored (recommended)
  rolling: true,
  name: 'sessionId', // Custom session name
  cookie: {
    secure: false, // Always false for development - HTTPS not required
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: 'lax' // Help with CSRF protection
  }
}));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  // Apply security middleware first to ensure authentication context is available
  const { securityMiddleware } = await import("./middleware/securityMiddleware");
  app.use(securityMiddleware.auditLogger);
  app.use(securityMiddleware.complianceMonitor);
  
  // Setup OTP authentication
  try {
    console.log("=== INITIALIZING OTP AUTHENTICATION ===");
    setupOTPAuth(app);
    console.log("✅ OTP Auth setup completed");
    
    console.log("=== INITIALIZING OTP ROUTES ===");
    setupOTPRoutes(app);
    console.log("✅ OTP Routes setup completed");
  } catch (error) {
    console.error("❌ Error setting up OTP system:", error);
  }
  
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // Setup static serving and routing based on environment
  const isProduction = process.env.NODE_ENV === "production" || process.env.REPLIT_DEPLOYMENT === "1";
  
  if (isProduction) {
    log("🔧 Production mode: Setting up static file serving");
    setupProduction(app);
  } else {
    log("🔧 Development mode: Setting up Vite middleware");
    await setupVite(app, server);
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
    
    // Start the compliance reminder service
    try {
      startComplianceReminderService();
      log("✅ Compliance reminder service started successfully");
    } catch (error) {
      log("❌ Failed to start compliance reminder service:", String(error));
    }
  });
})();
