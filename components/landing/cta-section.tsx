"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, Zap } from "lucide-react"

export default function CTASection() {
  return (
    <section 
      id="contact" 
      className="scroll-mt-16 sm:scroll-mt-20 md:scroll-mt-24 py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-slate-950"
    >
      {/* Background Effect - Responsive sizing */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] md:w-[500px] md:h-[500px] lg:w-[600px] lg:h-[600px] bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-cyan-500/20 rounded-full blur-2xl md:blur-3xl animate-pulse-slow"></div>
      </div>

      <div className="w-full max-w-4xl mx-auto relative z-10">
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 rounded-2xl sm:rounded-2xl md:rounded-3xl blur-xl sm:blur-xl md:blur-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>

          <div className="relative p-6 sm:p-8 md:p-10 lg:p-12 rounded-2xl sm:rounded-2xl md:rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-2xl overflow-hidden">
            {/* Floating Emojis - Hidden on very small mobile */}
            <div className="hidden sm:block absolute top-6 right-6 sm:top-8 sm:right-8 text-3xl sm:text-4xl animate-float opacity-20">🧃</div>
            <div className="hidden sm:block absolute bottom-6 left-6 sm:bottom-8 sm:left-8 text-3xl sm:text-4xl animate-float opacity-20" style={{ animationDelay: "1s" }}>
              📱
            </div>

            <div className="relative text-center space-y-6 sm:space-y-7 md:space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/40 rounded-full">
                <Sparkles size={14} className="sm:w-4 sm:h-4 text-emerald-400 animate-pulse" />
                <span className="text-[10px] sm:text-xs font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                  Join Us On This Mission
                </span>
              </div>

              {/* Heading */}
              <div className="space-y-2.5 sm:space-y-3">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black leading-tight px-2 sm:px-0">
                  <span className="text-white">Ready to </span>
                  <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                    Decode
                  </span>
                  <br />
                  <span className="text-white">Your Packaged Foods?</span>
                </h2>
                <p className="text-sm sm:text-base md:text-lg text-slate-400 max-w-full sm:max-w-lg md:max-w-xl mx-auto leading-relaxed px-2 sm:px-4 md:px-0">
                  Transform your nutrition journey with AI-powered packaged food scanning. Start making smarter choices today.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-2 sm:px-0">
                <Link href="/auth/signup" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto group relative overflow-hidden bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:via-teal-400 hover:to-cyan-400 text-white font-bold px-6 sm:px-8 py-5 sm:py-6 text-sm sm:text-base shadow-2xl shadow-emerald-500/40 hover:shadow-emerald-500/60 transition-all duration-300 border-0 transform hover:scale-105 min-h-[44px]"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      Start Your Journey
                      <ArrowRight size={18} className="sm:w-5 sm:h-5 group-hover:translate-x-2 transition-transform duration-300" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </Button>
                </Link>
                <Link href="#features" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto px-6 sm:px-8 py-5 sm:py-6 text-sm sm:text-base border-2 border-emerald-500/50 hover:border-emerald-400 bg-emerald-500/5 hover:bg-emerald-500/15 text-emerald-400 font-bold backdrop-blur-xl transition-all duration-300 transform hover:scale-105 min-h-[44px]"
                  >
                    Explore Features
                  </Button>
                </Link>
              </div>

              {/* Feature Pills */}
              <div className="pt-4 sm:pt-6 flex flex-wrap justify-center items-center gap-3 sm:gap-4 md:gap-6 text-[10px] sm:text-xs text-slate-400 px-2">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <Zap size={12} className="sm:w-[14px] sm:h-[14px] text-emerald-400" />
                  <span>Instant Results</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="text-emerald-400">✓</span>
                  <span>No Credit Card</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="text-emerald-400">✓</span>
                  <span>Cancel Anytime</span>
                </div>
              </div>
            </div>

            {/* Corner Accents */}
            <div className="absolute top-0 left-0 w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 bg-gradient-to-br from-emerald-500/20 to-transparent rounded-tl-2xl sm:rounded-tl-2xl md:rounded-tl-3xl"></div>
            <div className="absolute bottom-0 right-0 w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 bg-gradient-to-tl from-cyan-500/20 to-transparent rounded-br-2xl sm:rounded-br-2xl md:rounded-br-3xl"></div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 md:gap-6 mt-6 sm:mt-8 md:mt-10">
          {[
            { icon: "🔒", title: "Secure & Private", desc: "Your data is protected" },
            { icon: "⚡", title: "Lightning Fast", desc: "Instant scan results" },
            { icon: "🎯", title: "Accurate AI", desc: "99.9% precision rate" },
          ].map((feature, idx) => (
            <div
              key={idx}
              className="p-4 sm:p-5 rounded-xl sm:rounded-xl md:rounded-2xl bg-slate-900/50 border border-emerald-500/20 backdrop-blur-xl hover:border-emerald-500/40 transition-all duration-300 text-center group"
            >
              <div className="text-2xl sm:text-3xl mb-1.5 sm:mb-2 group-hover:scale-125 transition-transform duration-300">
                {feature.icon}
              </div>
              <div className="text-white font-bold mb-1 text-xs sm:text-sm">{feature.title}</div>
              <div className="text-[10px] sm:text-xs text-slate-400">{feature.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
