import dotenv from "dotenv";
import path from "path";

// CRITICAL: Initialize dotenv before any other imports that might depend on env vars
dotenv.config({ path: path.join(__dirname, ".env") });
console.log("Backend Environment Status Check:");
console.log("- ADMIN_EMAIL:", process.env.ADMIN_EMAIL ? "Loaded" : "MISSING");
console.log("- JWT_SECRET_ADMIN:", process.env.JWT_SECRET_ADMIN ? "Loaded" : "MISSING");

import Database from "./Config/DB";
import cookieParser from "cookie-parser";
import UserRoutes from "./Routes/UserRoutes";
import AdminRoutes from "./Routes/AdminRoutes";
import TheaterRoutes from "./Routes/TheaterRoutes";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import morgan from "morgan";
import { app, server, io } from "./Config/Socket";

app.set("io", io);

Database.connectDB();

const port = process.env.PORT || 5000;

app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      "http://localhost:3000",
      "https://ticket-hive-awft.vercel.app"
    ];

    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    // Remove trailing slash for comparison
    const normalizedOrigin = origin.replace(/\/$/, '');

    if (allowedOrigins.includes(normalizedOrigin)) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));

// Configure cookie settings for cross-origin
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

const staticPath = path.join(__dirname, process.env.NODE_ENV === 'production' ? '../public' : 'public');
app.use(express.static(staticPath));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage()
  });
});

app.use("/api/users", UserRoutes);
app.use("/api/admin", AdminRoutes);
app.use("/api/theater", TheaterRoutes);

// Global Error Handler - captures all errors thrown in routes
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("Caught error in Global Error Handler:", err);
  const status = err.status || 500;
  res.status(status).json({
    message: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
});

server.listen(port, () => console.log(`Server Is Running On Port http://localhost:${port}/`));
