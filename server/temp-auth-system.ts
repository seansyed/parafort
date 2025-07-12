import express from "express";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { db } from "./db";
import { users } from "@shared/schema";
import { eq } from "drizzle-orm";
import nodemailer from "nodemailer";
import "./session-types";

// Temporary simplified auth system
export function setupTempAuth(app: express.Application) {
  
  // Register
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { email, password, firstName, lastName } = req.body;
      
      if (!email || !password || !firstName || !lastName) {
        return res.status(400).json({ error: "All fields are required" });
      }
      
      // Check if user exists
      const existingUser = await db.select().from(users).where(eq(users.email, email));
      if (existingUser.length > 0) {
        return res.status(400).json({ error: "User already exists" });
      }
      
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);
      
      // Create user - mark as verified for now
      const [newUser] = await db.insert(users).values({
        id: crypto.randomUUID(),
        email,
        firstName: firstName || null,
        lastName: lastName || null,
        isEmailVerified: true, // Auto-verify for now
        createdAt: new Date(),
        updatedAt: new Date()
      }).returning();
      
      // Set session
      req.session.userId = newUser.id;
      req.session.user = {
        id: newUser.id,
        email: newUser.email!,
        firstName: newUser.firstName!,
        lastName: newUser.lastName!,
        isEmailVerified: true
      };
      
      res.json({ 
        message: "Registration successful",
        user: req.session.user
      });
      
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ error: "Registration failed" });
    }
  });
  
  // Login
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
      }
      
      // Find user
      const [user] = await db.select().from(users).where(eq(users.email, email));
      
      if (!user || !user.password) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      
      // Check password
      const isValidPassword = await bcrypt.compare(password, user.password);
      
      if (!isValidPassword) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      
      // Set session
      req.session.userId = user.id;
      req.session.user = {
        id: user.id,
        email: user.email!,
        firstName: user.firstName!,
        lastName: user.lastName!,
        isEmailVerified: user.isEmailVerified || false
      };
      
      res.json({ 
        message: "Login successful",
        user: req.session.user
      });
      
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Login failed" });
    }
  });
  
  // Get current user
  app.get("/api/auth/user", (req, res) => {
    if (!req.session.userId || !req.session.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    
    res.json({ user: req.session.user });
  });
  
  // Logout
  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Logout failed" });
      }
      res.clearCookie('connect.sid');
      res.json({ message: "Logout successful" });
    });
  });
}