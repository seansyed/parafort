import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function setupProduction(app: express.Application) {
  console.log("Setting up production configuration...");
  
  // Always apply production settings when this function is called
  const isDeployment = process.env.NODE_ENV === "production" || process.env.REPLIT_DEPLOYMENT === "1";
  
  if (true) { // Force production setup
    // Security headers
    app.use((req, res, next) => {
      res.setHeader("X-Content-Type-Options", "nosniff");
      res.setHeader("X-Frame-Options", "DENY");
      res.setHeader("X-XSS-Protection", "1; mode=block");
      res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
      res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
      
      // Content Security Policy
      res.setHeader("Content-Security-Policy", [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' https://js.stripe.com https://www.googletagmanager.com",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "font-src 'self' https://fonts.gstatic.com",
        "img-src 'self' data: https:",
        "connect-src 'self' https://api.stripe.com https://www.google-analytics.com",
        "frame-src https://js.stripe.com",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'"
      ].join("; "));
      
      next();
    });

    // Serve static files from the built public directory
    const publicDir = path.resolve(process.cwd(), "dist/public");
    console.log(`Production static files from: ${publicDir}`);
    app.use(express.static(publicDir, {
      maxAge: "1h",
      etag: false,
      setHeaders: (res, filePath) => {
        if (filePath.endsWith(".css")) {
          res.setHeader("Content-Type", "text/css");
        }
        if (filePath.endsWith(".html")) {
          res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
        }
      }
    }));
    
    // Gzip compression
    app.get("*.js", (req, res, next) => {
      req.url = req.url + ".gz";
      res.set("Content-Encoding", "gzip");
      res.set("Content-Type", "text/javascript");
      next();
    });
    
    app.get("*.css", (req, res, next) => {
      req.url = req.url + ".gz";
      res.set("Content-Encoding", "gzip");
      res.set("Content-Type", "text/css");
      next();
    });

    // Handle client-side routing - serve index.html for all non-API routes
    app.get("*", (req, res) => {
      // Skip API routes
      if (req.path.startsWith("/api")) {
        return res.status(404).json({ error: "API endpoint not found" });
      }
      
      // Serve the main HTML file for client-side routing
      const indexPath = path.resolve(process.cwd(), "dist/public/index.html");
      console.log(`SPA fallback - serving index.html from: ${indexPath}`);
      res.sendFile(indexPath);
    });
  }
}