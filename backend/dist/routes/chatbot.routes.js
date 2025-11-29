"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const chatbot_service_1 = __importDefault(require("../services/chatbot.service"));
const router = express_1.default.Router();
const chatbot = new chatbot_service_1.default();
// Initialize knowledge base when server starts
chatbot.loadKnowledgeBase().catch(error => {
    console.error('❌ Failed to load knowledge base on startup:', error);
});
// POST /api/chatbot/chat
router.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;
        if (!message || typeof message !== 'string' || message.trim() === '') {
            return res.status(400).json({
                error: 'Message is required and must be a non-empty string'
            });
        }
        const response = await chatbot.chat(message.trim());
        res.json({
            response,
            timestamp: new Date().toISOString()
        });
    }
    catch (error) {
        console.error('❌ Chatbot error:', error);
        res.status(500).json({
            error: 'Failed to process message. Please try again later.',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});
// GET /api/chatbot/health
router.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        message: 'Chatbot service is running',
        knowledgeBaseLoaded: chatbot.knowledgeBase.length > 0,
        knowledgeBaseSize: chatbot.knowledgeBase.length
    });
});
exports.default = router;
