import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from 'fs/promises';
import path from 'path';

class ChatbotService {
  private genAI: GoogleGenerativeAI;
  private model: any;
  public knowledgeBase: string;

  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
    this.model = this.genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    this.knowledgeBase = "";
  }

  async loadKnowledgeBase(): Promise<void> {
    try {
      // Try multiple possible paths for the knowledge base
      const possiblePaths = [
        path.join(__dirname, '../knowledge-base'),
        path.join(__dirname, '../../knowledge-base'),
        path.join(__dirname, '../../../knowledge-base'),
        path.join(process.cwd(), 'src/knowledge-base'),
        path.join(process.cwd(), 'knowledge-base'),
        path.join(process.cwd(), 'backend/knowledge-base'),
        path.join(process.cwd(), 'backend/src/knowledge-base'),
        path.join(process.cwd(), 'dist/knowledge-base'),
      ];

      console.log('🔍 Searching for knowledge base...');
      console.log('📁 Current directory:', process.cwd());
      console.log('📁 __dirname:', __dirname);

      let knowledgePath = '';
      let pathFound = false;

      for (const testPath of possiblePaths) {
        try {
          await fs.access(testPath);
          const stats = await fs.stat(testPath);
          if (stats.isDirectory()) {
            knowledgePath = testPath;
            pathFound = true;
            console.log(`✅ Found knowledge base at: ${testPath}`);
            break;
          }
        } catch (err) {
          // Path doesn't exist, continue
        }
      }

      if (!pathFound) {
        console.error('❌ Knowledge base directory not found in any location!');
        console.log('⚠️ Using default knowledge base');
        this.knowledgeBase = `
NutriGo - Food Scanning & Health App

Q: What is NutriGo?
A: NutriGo is a mobile application that helps users make healthier food choices by scanning food products and providing nutritional information, health scores, and healthier alternatives.

Q: How do I scan a product?
A: Open the app, tap the scan button, point your camera at the product barcode or take a photo of the product. The app will analyze it and show you the nutritional information.

Q: What information does NutriGo provide?
A: NutriGo provides detailed nutritional information, health scores, ingredient analysis, allergen warnings, and suggests healthier alternatives.
        `;
        return;
      }

      const files = await fs.readdir(knowledgePath);
      console.log(`📚 Found ${files.length} file(s) in knowledge base:`, files);
      
      if (files.length === 0) {
        console.warn('⚠️ Knowledge base folder is empty!');
        this.knowledgeBase = "NutriGo is a food scanning app. Please contact support for more information.";
        return;
      }

      let content = "";
      for (const file of files) {
        try {
          const filePath = path.join(knowledgePath, file);
          const fileContent = await fs.readFile(filePath, 'utf-8');
          console.log(`📄 Loaded: ${file} (${fileContent.length} chars)`);
          
          if (file.endsWith('.json')) {
            const jsonData = JSON.parse(fileContent);
            if (Array.isArray(jsonData)) {
              jsonData.forEach((item: any) => {
                if (item.question && item.answer) {
                  content += `\nQ: ${item.question}\nA: ${item.answer}\n`;
                }
              });
            } else if (typeof jsonData === 'object') {
              content += `\n\n--- ${file} ---\n${JSON.stringify(jsonData, null, 2)}`;
            }
          } else {
            content += `\n\n--- ${file} ---\n${fileContent}`;
          }
        } catch (err) {
          console.error(`❌ Error reading file ${file}:`, err);
        }
      }
      
      if (content.trim().length === 0) {
        console.warn('⚠️ No content loaded from knowledge base files');
        this.knowledgeBase = "NutriGo is a food scanning app. Please contact support for more information.";
      } else {
        this.knowledgeBase = content;
        console.log("✅ Knowledge base loaded successfully");
        console.log(`📊 Total size: ${content.length} characters`);
      }
    } catch (error) {
      console.error("❌ Error loading knowledge base:", error);
      this.knowledgeBase = "NutriGo is a food scanning app that helps you make healthier food choices.";
      console.log("⚠️ Using minimal fallback knowledge base");
    }
  }

  async chat(userMessage: string): Promise<string> {
    if (!this.knowledgeBase) {
      console.log('⚠️ Knowledge base empty, attempting to reload...');
      await this.loadKnowledgeBase();
    }

    const prompt = `You are NutriGo's helpful assistant. You ONLY answer questions based on the knowledge base provided below. 

IMPORTANT RULES:
- Only use information from the knowledge base below
- If the question is not covered in the knowledge base, respond with: "I don't have information about that. Please contact our support team or check the app documentation."
- Be friendly, helpful, and concise
- Never make up information

KNOWLEDGE BASE:
${this.knowledgeBase}

USER QUESTION: ${userMessage}

ANSWER (use only the knowledge base above):`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("❌ Error generating response:", error);
      throw new Error("Failed to generate response. Please try again.");
    }
  }
}

export default ChatbotService;
