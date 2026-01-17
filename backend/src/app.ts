import express from "express";
import cors from "cors";
import scanRoutes from "./routes/scan.routes";
import alternativesRoutes from "./routes/alternatives.routes";
import chatbotRoutes from "./routes/chatbot.routes";

const app = express();

// Enable CORS first with explicit configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Parse JSON bodies
app.use(express.json());

// Debug middleware to log all requests
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.url}`);
  next();
});

// Mount API routes with debug logging
console.log("📍 Mounting /api/scan routes...");
app.use("/api/scan", scanRoutes);

console.log("📍 Mounting /api/alternatives routes...");
app.use("/api/alternatives", alternativesRoutes);

console.log("📍 Mounting /api/chatbot routes...");
app.use("/api/chatbot", chatbotRoutes);
console.log("✅ Chatbot routes mounted successfully");

// Test route to verify Express is working
app.get("/api/health", (req: express.Request, res: express.Response) => {
  res.json({ status: "ok", routes: ["/api/scan", "/api/alternatives", "/api/chatbot"] });
});

// 404 handler for unmatched routes
app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.log(`❌ 404 - Route not found: ${req.method} ${req.url}`);
  res.status(404).json({
    error: "Route not found",
    path: req.url,
    method: req.method,
    availableRoutes: ["/api/scan", "/api/alternatives", "/api/chatbot", "/api/health"]
  });
});

// Global error handler
app.use((error: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("❌ Server error:", error);
  res.status(500).json({
    error: "Internal server error",
    details: error.message,
    path: req.path
  });
});

export default app;
