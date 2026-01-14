"use client"

import { Scan, Target, Leaf, TrendingUp, Zap, MessageCircle, ArrowRight } from "lucide-react"
import { useState } from "react"

const features = [
  {
    icon: Scan,
    title: "AI-Powered Scanner",
    description:
      "Instantly scan any packaged food product with advanced AI to decode sugar levels, calories, and hidden ingredients. Crystal-clear visual insights at your fingertips.",
    color: "from-emerald-400 to-teal-500",
    emoji: "🔍",
  },
  {
    icon: Target,
    title: "Smart Health Score",
    description:
      "Every packaged product gets an intelligent Health Score based on comprehensive analysis of sugar, calories, additives, and nutritional value. Know what's truly healthy.",
    color: "from-teal-400 to-cyan-500",
    emoji: "🎯",
  },
  {
    icon: Leaf,
    title: "Better Alternatives",
    description:
      "Discover healthier packaged food substitutes instantly. Compare products side-by-side and make smarter swaps for your everyday nutrition goals.",
    color: "from-cyan-400 to-emerald-500",
    emoji: "🌱",
  },
  {
    icon: TrendingUp,
    title: "Progress Tracking",
    description:
      "Monitor your nutrition journey with detailed analytics, personalized recommendations, and AI-driven insights based on your dietary preferences.",
    color: "from-emerald-500 to-teal-400",
    emoji: "📈",
  },
  {
    icon: Zap,
    title: "Instant Analysis",
    description:
      "Get real-time nutrition breakdown of packaged products in milliseconds. Our AI processes complex data instantly, giving you immediate actionable insights.",
    color: "from-teal-500 to-cyan-400",
    emoji: "⚡",
  },
  {
    icon: MessageCircle,
    title: "Smart AI Chatbot",
    description:
      "Ask questions about nutrition, ingredients, and healthy eating. Get instant AI-powered answers and personalized recommendations 24/7.",
    color: "from-cyan-500 to-emerald-400",
    emoji: "🤖",
  },
]

export default function FeaturesSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <section id="features" className="py-16 sm:py-20 md:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 bg-slate-950 relative overflow-hidden">
      {/* Background Effects - Responsive sizing */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/3 w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 bg-emerald-500/10 rounded-full blur-2xl md:blur-3xl"></div>
        <div className="absolute bottom-0 right-1/3 w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 bg-teal-500/10 rounded-full blur-2xl md:blur-3xl"></div>
      </div>

      <div className="w-full max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="text-center space-y-4 sm:space-y-5 md:space-y-6 mb-12 sm:mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full">
            <Zap size={14} className="sm:w-4 sm:h-4 text-emerald-400" />
            <span className="text-xs sm:text-sm font-semibold text-emerald-400">Powered by AI</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black px-4 sm:px-0">
            <span className="text-white">Powerful Features </span>
            <span className="block sm:inline bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
              for Better Health
            </span>
          </h2>
          
          <p className="text-base sm:text-lg md:text-xl text-slate-400 max-w-full sm:max-w-2xl md:max-w-3xl mx-auto leading-relaxed px-4 sm:px-6 md:px-0">
            From intelligent packaged food scanning to smarter nutrition choices — NutriGo transforms how you understand packaged products
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-6 md:gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className="group relative"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Glow Effect */}
                <div
                  className={`absolute -inset-0.5 bg-gradient-to-r ${feature.color} rounded-2xl sm:rounded-2xl md:rounded-3xl blur-md sm:blur-lg opacity-0 group-hover:opacity-30 transition-all duration-500`}
                ></div>

                {/* Card */}
                <div className="relative h-full p-6 sm:p-7 md:p-8 rounded-2xl sm:rounded-2xl md:rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl hover:border-emerald-500/40 transition-all duration-500 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-emerald-500/20">
                  {/* Emoji Background */}
                  <div className="absolute top-3 right-3 sm:top-4 sm:right-4 text-4xl sm:text-5xl md:text-6xl opacity-5 group-hover:opacity-10 transition-opacity duration-300">
                    {feature.emoji}
                  </div>

                  <div className="relative space-y-4 sm:space-y-4 md:space-y-5">
                    {/* Icon */}
                    <div className="relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16">
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${feature.color} rounded-xl sm:rounded-xl md:rounded-2xl blur-sm sm:blur-md opacity-50 group-hover:opacity-75 transition-opacity`}
                      ></div>
                      <div
                        className={`relative w-full h-full bg-gradient-to-br ${feature.color} rounded-xl sm:rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}
                      >
                        <Icon size={22} className="sm:w-6 sm:h-6 md:w-7 md:h-7 text-white" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="space-y-2 sm:space-y-2.5 md:space-y-3">
                      <h3 className="text-xl sm:text-xl md:text-2xl font-bold text-white group-hover:text-emerald-400 transition-colors duration-300">
                        {feature.title}
                      </h3>
                      <p className="text-sm sm:text-base md:text-base text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors duration-300">
                        {feature.description}
                      </p>
                    </div>

                    {/* Hover Indicator */}
                    <div className="flex items-center gap-2 text-xs sm:text-sm md:text-sm font-semibold text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span>Learn more</span>
                      <ArrowRight size={14} className="sm:w-4 sm:h-4 transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>

                  {/* Animated Corner Accent */}
                  <div
                    className={`absolute bottom-0 right-0 w-20 h-20 sm:w-24 sm:h-24 md:w-24 md:h-24 bg-gradient-to-tl ${feature.color} opacity-0 group-hover:opacity-20 rounded-tl-full transition-opacity duration-500`}
                  ></div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 sm:mt-16 md:mt-20 text-center px-4">
          <p className="text-sm sm:text-base md:text-base text-slate-400 mb-4 sm:mb-5 md:mb-6">
            Ready to experience the future of packaged food nutrition?
          </p>
          <button className="w-full sm:w-auto px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:via-teal-400 hover:to-cyan-400 rounded-xl sm:rounded-xl md:rounded-2xl font-bold text-white text-sm sm:text-base shadow-xl shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all duration-300 transform hover:scale-105 min-h-[44px]">
            Start Free Trial
          </button>
        </div>
      </div>
    </section>
  )
}
