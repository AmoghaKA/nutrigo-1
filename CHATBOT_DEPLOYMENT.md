# Chatbot Deployment Checklist

## Issues Fixed:
1. ✅ Changed route export from `module.exports` to `export default`
2. ✅ Added robust knowledge base path searching with fallback
3. ✅ Improved CORS configuration in app.ts
4. ✅ Added HTML response detection in frontend
5. ✅ Added detailed error logging
6. ✅ Created 404 handler for unmatched routes

## Deployment Steps:

### Backend (Render):

1. **Install Dependencies and Build:**
   ```bash
   cd backend
   npm install
   npm run build
   ```
   
   **Note**: The build script now automatically copies the `knowledge-base` folder to `dist/`.

2. **For Local Testing:**
   - Copy `.env.example` to `.env`
   - Fill in your actual values (GEMINI_API_KEY, SUPABASE_URL, etc.)
   - Run: `npm start`
   - Test: http://localhost:4000/api/chatbot/health

3. **Verify Environment Variables in Render:**
   - `GEMINI_API_KEY` - Your Gemini API key
   - `SUPABASE_URL` - Your Supabase URL
   - `SUPABASE_KEY` - Your Supabase service key
   - `JWT_SECRET` - Your JWT secret
   - `PORT` - 5000 (or your preferred port)
   - `NODE_ENV` - production
   - `FRONTEND_URL` - https://your-frontend-url.vercel.app

3. **Make sure these files/folders are included in deployment:**
   - `backend/src/knowledge-base/` (with faq.json, app-features.md, etc.)
   - All TypeScript files get compiled to `dist/`

4. **Test the health endpoint:**
   ```
   https://your-backend-url.onrender.com/api/chatbot/health
   ```
   Should return:
   ```json
   {
     "status": "ok",
     "message": "Chatbot service is running",
     "knowledgeBaseLoaded": true,
     "knowledgeBaseSize": <number>
   }
   ```

### Frontend (Vercel):

1. **Set Environment Variables in Vercel:**
   - `NEXT_PUBLIC_BACKEND_URL` - https://your-backend-url.onrender.com
   - `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon key
   - `NEXT_PUBLIC_SITE_URL` - https://your-app.vercel.app

2. **Redeploy from Vercel dashboard**

3. **Test the chatbot:**
   - Open browser console (F12)
   - Click on the chatbot widget
   - Send a test message
   - Check console logs for detailed debugging info

## Troubleshooting:

### If you still see "knowledgeBaseLoaded": false

Check backend logs on Render to see which paths it's searching. The logs will show:
```
🔍 Searching for knowledge base...
📁 Current directory: /path/to/app
📁 __dirname: /path/to/dist/services
❌ Not found: /path/1
❌ Not found: /path/2
✅ Found knowledge base at: /path/3
```

### If you get HTML instead of JSON:

This means the route isn't found. Check:
1. Backend logs show "✅ Chatbot routes mounted successfully"
2. The endpoint URL is correct (should NOT have trailing slash)
3. CORS is properly configured

### If "Failed to fetch":

1. Check NEXT_PUBLIC_BACKEND_URL is set correctly in Vercel
2. Check backend is actually running on Render
3. Check CORS allows your frontend domain

## Quick Test Commands:

Test backend directly with curl:
```bash
# Health check
curl https://your-backend-url.onrender.com/api/chatbot/health

# Chat test
curl -X POST https://your-backend-url.onrender.com/api/chatbot/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"What is NutriGo?"}'
```

Expected response:
```json
{
  "response": "NutriGo is a mobile application that helps users make healthier food choices...",
  "timestamp": "2025-11-29T..."
}
```
