"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const scan_routes_1 = __importDefault(require("./routes/scan.routes"));
const alternatives_routes_1 = __importDefault(require("./routes/alternatives.routes"));
const chatbot_routes_1 = __importDefault(require("./routes/chatbot.routes"));
const app = (0, express_1.default)();
// Enable CORS first with explicit configuration
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
// Parse JSON bodies
app.use(express_1.default.json());
// Debug middleware to log all requests
app.use((req, res, next) => {
    console.log(`📥 ${req.method} ${req.url}`);
    next();
});
// Mount API routes with debug logging
console.log("📍 Mounting /api/scan routes...");
app.use("/api/scan", scan_routes_1.default);
console.log("📍 Mounting /api/alternatives routes...");
app.use("/api/alternatives", alternatives_routes_1.default);
console.log("📍 Mounting /api/chatbot routes...");
app.use("/api/chatbot", chatbot_routes_1.default);
console.log("✅ Chatbot routes mounted successfully");
// Test route to verify Express is working
app.get("/api/health", (req, res) => {
    res.json({ status: "ok", routes: ["/api/scan", "/api/alternatives", "/api/chatbot"] });
});
// 404 handler for unmatched routes
app.use((req, res, next) => {
    console.log(`❌ 404 - Route not found: ${req.method} ${req.url}`);
    res.status(404).json({
        error: "Route not found",
        path: req.url,
        method: req.method,
        availableRoutes: ["/api/scan", "/api/alternatives", "/api/chatbot", "/api/health"]
    });
});
// Global error handler
app.use((error, req, res, next) => {
    console.error("❌ Server error:", error);
    res.status(500).json({
        error: "Internal server error",
        details: error.message,
        path: req.path
    });
});
exports.default = app;
