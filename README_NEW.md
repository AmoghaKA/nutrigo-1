<div align="center">

![NutriGo Logo](./public/logo.png)

# NutriGo

### 🌱 Smart Packaged Food Scanning Made Simple

**Stop guessing what's in your packaged foods.** Decode hidden sugars, calories, and ingredients with AI-powered precision. Make informed nutrition choices instantly.

[![Live Demo](https://img.shields.io/badge/demo-online-green.svg)](https://nutrigo-kappa.vercel.app/)
[![GitHub](https://img.shields.io/badge/github-repository-blue.svg)](https://github.com/tung-programming/nutrigo)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

[Live Demo](https://nutrigo-kappa.vercel.app/) · [Report Bug](https://github.com/tung-programming/nutrigo/issues) · [Request Feature](https://github.com/tung-programming/nutrigo/issues)

</div>

---

## 📋 Table of Contents

- [🎯 About the Project](#-about-the-project)
- [✨ Features](#-features)
- [🛠️ Tech Stack](#-tech-stack)
- [🚀 Getting Started](#-getting-started)
- [💻 Usage](#-usage)
- [📱 Dashboard Features](#-dashboard-features)
- [🤖 AI-Powered Tools](#-ai-powered-tools)
- [💰 Pricing Plans](#-pricing-plans)
- [👥 Our Team](#-our-team)
- [📝 License](#-license)

---

## 🎯 About the Project

**NutriGo** is India's AI-powered nutrition companion, revolutionizing how people understand packaged foods. In a world where food labels confuse more than they clarify, we bring clarity through intelligent technology.

### Our Mission
To democratize nutrition knowledge through AI-powered technology, empowering every Indian to make informed food choices that improve their health and well-being.

### Our Vision
A future where food transparency is the norm. Where every Indian has instant access to clear, reliable nutrition information that helps them live healthier lives.

### Why NutriGo?
- **101 million** Indians living with diabetes
- **Rising childhood obesity** rates across the country
- **Confusing food labels** that lack transparency
- **Need for instant, reliable** nutrition insights

---

## ✨ Features

### 🔍 **AI-Powered Scanner**
Instantly scan any packaged food product with advanced AI to decode:
- Sugar levels and hidden additives
- Calorie breakdown and nutritional values
- Comprehensive ingredient analysis
- Crystal-clear visual insights at your fingertips

### 🎯 **Smart Health Score**
Every packaged product gets an intelligent Health Score based on:
- Comprehensive analysis of sugar content
- Calorie density and portion impact
- Additive identification and warnings
- Overall nutritional value assessment
- Know what's truly healthy for your diet

### 🌱 **Better Alternatives**
Discover healthier packaged food substitutes instantly:
- Compare products side-by-side
- See nutritional differences at a glance
- Access curated healthier options
- Make smarter swaps for your everyday nutrition goals
- Integration with major e-commerce platforms (Blinkit, Zepto, Swiggy, BigBasket)

### 📈 **Progress Tracking**
Monitor your nutrition journey with detailed analytics:
- Track scanning history and patterns
- Personalized recommendations based on preferences
- AI-driven insights from your dietary choices
- Weekly and monthly nutrition analytics
- Visual progress charts and statistics

### ⚡ **Instant Analysis**
Get real-time nutrition breakdown in milliseconds:
- Lightning-fast AI processing
- Complex data analyzed instantly
- Immediate actionable insights
- No waiting, instant results

### 🤖 **Smart AI Chatbot**
Ask questions about nutrition, ingredients, and healthy eating:
- 24/7 instant AI-powered answers
- Personalized recommendations
- Voice input support (speech-to-text)
- Voice output support (text-to-speech)
- Conversational AI that understands context

### 🎨 **Beautiful Dashboard**
Comprehensive user dashboard featuring:
- Recent scans overview
- Nutrition statistics
- Health trends visualization
- Quick access to all features
- Responsive design for all devices

### 💾 **Scan History**
Keep track of everything:
- Complete history of all scanned products
- Date and time of each scan
- Product details and health scores
- Quick re-access to previous analyses

### ⭐ **Favorites Management**
Create a personal collection:
- Save favorite products
- Quick access to frequently checked items
- Organize by category
- Track trending healthy options

### 🔐 **User Authentication**
Secure and easy account management:
- Sign up and login functionality
- User profile management
- Personalized preferences
- Secure data storage

### 🔄 **Product Comparisons**
Compare products side-by-side:
- Nutritional comparison charts
- Health score differences
- Ingredient variations
- Find the best option for your needs

### 📊 **Analytics Dashboard**
Advanced analytics for premium users:
- Daily, weekly, monthly nutrition trends
- Health goal progress tracking
- Detailed nutrient breakdowns
- Personalized health insights

### 🎯 **Health Goals**
Set and track personal health objectives:
- Customizable health goals
- Goal progress visualization
- AI recommendations aligned with goals
- Success tracking

### 📱 **Responsive Design**
Seamless experience across all devices:
- Mobile-optimized interface
- Tablet compatibility
- Desktop full experience
- Fast loading and smooth animations

### 🌍 **Multi-Platform Support**
Available on multiple platforms:
- Web application
- Mobile-responsive design
- Easy access from any device

---

## 🛠️ Tech Stack

### Frontend
- **Next.js 14+** - React framework for production
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Radix UI** - Accessible component library
- **Recharts** - Data visualization
- **React Hook Form** - Form management

### Backend
- **Express.js** - Node.js web framework
- **TypeScript** - Type safety
- **Tesseract.js/OCR** - Text recognition from images
- **Supabase** - PostgreSQL database and auth

### AI & ML
- **Google Generative AI** - Advanced AI processing
- **LangChain** - AI framework integration
- **Google Cloud Text-to-Speech** - Voice synthesis

### Infrastructure
- **Vercel** - Frontend deployment
- **Docker** - Containerization
- **Supabase** - Backend services

### APIs & Services
- **Google Cloud Vision** - Image analysis
- **Supabase Auth** - Authentication
- **E-commerce APIs** - Blinkit, Zepto, Swiggy, BigBasket

---

## 🚀 Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn
- Docker (optional, for backend)
- Google Cloud credentials
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/tung-programming/nutrigo.git
   cd nutrigo
   ```

2. **Install dependencies**
   ```bash
   # Frontend
   npm install
   
   # Backend
   cd backend
   npm install
   cd ..
   ```

3. **Set up environment variables**
   
   Create `.env.local` in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```
   
   Create `backend/.env`:
   ```env
   PORT=5000
   GOOGLE_API_KEY=your_google_api_key
   SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_KEY=your_service_key
   TTS_PROJECT_ID=your_gcp_project_id
   TTS_API_KEY=your_tts_api_key
   ```

4. **Run the application**
   
   **Backend** (Terminal 1):
   ```bash
   cd backend
   npm run dev
   ```
   
   **Frontend** (Terminal 2):
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

---

## 💻 Usage

### Basic Workflow

1. **Sign Up/Login** - Create an account or log in to access all features
2. **Scan Products** - Upload an image of any packaged food product
3. **View Analysis** - Get instant nutrition breakdown and health score
4. **Track Progress** - Monitor your nutrition journey over time
5. **Find Alternatives** - Discover healthier substitutes for your favorite products
6. **Ask Chatbot** - Get personalized nutrition advice 24/7

### For Different Users

**Health Conscious Users**
- Track daily nutrition intake
- Set health goals
- Get healthier alternative suggestions
- Monitor progress with analytics

**Busy Professionals**
- Quick product scans
- Instant health scores
- Fast alternative recommendations
- No-fuss interface

**Parents**
- Check kids' food safety
- Identify allergens
- Track family nutrition
- Get health recommendations

**Fitness Enthusiasts**
- Monitor macronutrients
- Track protein intake
- Compare supplement options
- Optimize nutrition for goals

---

## 📱 Dashboard Features

### Home Dashboard
- **Recent Scans** - Quick access to last scanned products
- **Nutrition Stats** - Overview of your nutrition metrics
- **Health Trends** - Visualize your nutrition journey
- **Quick Actions** - Scan, Compare, Ask Chatbot

### Scan History
- Complete list of all scanned products
- Filter by date, category, or health score
- Re-scan previous products
- Export scan data

### Favorites
- Save products you like
- Organize by category
- Quick reference collection
- Share with family

### Profile
- Manage account settings
- Update personal preferences
- View subscription plan
- Download data

### Settings
- Notification preferences
- Privacy controls
- Theme preferences (Dark/Light)
- Language settings

### Alternatives
- Browse healthier options
- Compare nutritional values
- See purchase links
- Save favorites

---

## 🤖 AI-Powered Tools

### Smart Scanner
- Advanced OCR technology
- Instant label reading
- Automatic data extraction
- High accuracy recognition

### Health Score Algorithm
- Multi-factor analysis
- Sugar content evaluation
- Calorie assessment
- Additive detection
- Overall healthiness rating

### AI Chatbot Assistant
- Natural language processing
- Contextual understanding
- 24/7 availability
- Voice interaction support
- Learning from interactions

### Recommendation Engine
- Personalized suggestions
- Based on scan history
- Aligned with health goals
- Smart alternatives matching

---

## 💰 Pricing Plans

### 🌱 **NutriGo (Free)**
- 10 scans per day
- Basic health score
- Scan history (30 days)
- AI chatbot access
- Perfect for: Getting started

### 🍊 **NutriPlus (₹249/month)**
- Unlimited scans
- Advanced health analysis
- 90-day scan history
- Priority support
- Advanced analytics dashboard
- Health goal modes
- Perfect for: Regular users

### 🏆 **NutriPro (₹499/month)**
- Everything in NutriPlus
- Early access to new features
- Priority support & feedback
- Hydration tracker
- Educational content
- Advanced analytics
- Personalized recommendations
- Perfect for: Power users

---

## 👥 Our Team

Meet the innovators building the future of food transparency:

| Name | Role | GitHub |
|------|------|--------|
| Arjun Bhat | Frontend Developer | [@github](https://github.com) |
| Pranav Rao K | Frontend Developer | [@github](https://github.com) |
| Tushar P | Backend Developer | [@github](https://github.com) |
| Amogha K A | Backend Developer | [@github](https://github.com) |

---

## 🌟 Key Highlights

✅ **AI-Powered** - Advanced machine learning algorithms  
✅ **Instant Results** - Get nutrition insights in milliseconds  
✅ **Beautiful UI** - Modern, intuitive interface  
✅ **Mobile Optimized** - Works seamlessly on all devices  
✅ **Secure** - Enterprise-grade security  
✅ **Free to Start** - Begin with our free tier  
✅ **India-Focused** - Built for Indian food products  
✅ **Growing Database** - Constantly updated product library  

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📞 Contact & Support

- **Website:** [nutrigo-kappa.vercel.app](https://nutrigo-kappa.vercel.app/)
- **GitHub:** [tung-programming/nutrigo](https://github.com/tung-programming/nutrigo)
- **Issues:** [Report a bug or request a feature](https://github.com/tung-programming/nutrigo/issues)

---

<div align="center">

### 🌟 Made with ❤️ by the NutriGo Team

**Decode Your Packaged Foods, Redefine Your Health**

Together, we're building a healthier India, one scan at a time. 🇮🇳

</div>
