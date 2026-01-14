"use client"

import { Check, X, Sparkles, Zap, Package, TrendingUp, Crown } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Navigation from "@/components/landing/navigation"

const pricingPlans = [
  {
    name: "NutriGo",
    tagline: "For users seeking quick packaged food awareness",
    icon: "🌱",
    color: "from-emerald-400 to-teal-500",
    bgColor: "from-emerald-500/10 to-teal-500/10",
    borderColor: "border-emerald-500/30",
    priceMonthly: 0,
    priceYearly: 0,
    popular: false,
    features: [
      { text: "Scan up to 5 packaged products/day", included: true },
      { text: "Get basic nutrition info", included: true },
      { text: "View basic health score", included: true },
      { text: "Access to food comparisons", included: true },
      { text: "Ad-supported experience", included: true },
      { text: "Detailed nutrient breakdown", included: false },
      { text: "Health summaries or insights", included: false },
    ],
  },
  {
    name: "NutriPlus",
    tagline: "For users who want detailed packaged food insights",
    icon: "🍊",
    color: "from-amber-400 to-orange-500",
    bgColor: "from-amber-500/10 to-orange-500/10",
    borderColor: "border-amber-500/40",
    priceMonthly: 249,
    priceYearly: 2490,
    popular: true,
    features: [
      { text: "Unlimited packaged food scans per day", included: true },
      { text: "Detailed breakdown of nutrients", included: true },
      { text: "Food history tracking", included: true },
      { text: "Weekly health summary reports", included: true },
      { text: "Access to AI-powered insights", included: true },
      { text: "No ads", included: true },
      { text: "Advanced analytics dashboard", included: true },
      { text: "Priority feature access", included: false },
    ],
  },
  {
    name: "NutriPro",
    tagline: "For professionals, fitness enthusiasts, and advanced users",
    icon: "🏆",
    color: "from-orange-400 to-red-500",
    bgColor: "from-orange-500/10 to-red-500/10",
    borderColor: "border-orange-500/40",
    priceMonthly: 499,
    priceYearly: 4990,
    popular: false,
    features: [
      { text: "Everything in NutriPlus", included: true },
      { text: "Health goal modes", included: true },
      { text: "Advanced analytics dashboard", included: true },
      { text: "Early access to new features", included: true },
      { text: "Priority support & feedback", included: true },
      { text: "Hydration tracker", included: true },
      { text: "Educational contents", included: true },
      { text: "Expert consultation", included: true },
    ],
  },
]

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly")

  return (
    <>
      <Navigation />
      
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 pt-20 sm:pt-24 md:pt-32 pb-12 sm:pb-16 md:pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Enhanced Background Effects - Responsive */}
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 bg-emerald-500/20 rounded-full blur-2xl sm:blur-3xl animate-pulse"></div>
          <div className="absolute top-1/3 right-1/4 w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 lg:w-[500px] lg:h-[500px] bg-teal-500/15 rounded-full blur-2xl sm:blur-3xl animate-pulse" style={{ animationDelay: "1s", animationDuration: "4s" }}></div>
          <div className="absolute bottom-0 left-1/2 w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 bg-cyan-500/10 rounded-full blur-2xl sm:blur-3xl animate-pulse" style={{ animationDelay: "2s", animationDuration: "5s" }}></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Header - Responsive */}
          <div className="text-center space-y-4 sm:space-y-6 mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/40 rounded-full backdrop-blur-xl shadow-lg shadow-emerald-500/10">
              <Package size={16} className="sm:w-[18px] sm:h-[18px] text-emerald-400 animate-pulse" />
              <span className="text-xs sm:text-sm font-bold text-emerald-400">Simple, Transparent Pricing</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black leading-tight px-4">
              <span className="text-white">Choose Your </span>
              <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                Perfect Plan
              </span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-slate-400 max-w-3xl mx-auto leading-relaxed px-4">
              Start free, upgrade when you need more. All plans include AI-powered packaged food nutrition insights.
            </p>

            {/* Enhanced Billing Toggle - Responsive */}
            <div className="flex items-center justify-center gap-3 sm:gap-6 mt-8 sm:mt-10 p-1.5 sm:p-2 bg-slate-900/80 backdrop-blur-xl border border-emerald-500/20 rounded-xl sm:rounded-2xl inline-flex shadow-xl mx-4">
              <button
                onClick={() => setBillingCycle("monthly")}
                className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm transition-all duration-300 ${
                  billingCycle === "monthly"
                    ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle("yearly")}
                className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm transition-all duration-300 relative ${
                  billingCycle === "yearly"
                    ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Yearly
                <span className="absolute -top-1.5 sm:-top-2 -right-1.5 sm:-right-2 px-1.5 sm:px-2 py-0.5 bg-amber-500 text-white text-[9px] sm:text-[10px] font-black rounded-full animate-pulse">
                  -17%
                </span>
              </button>
            </div>
          </div>

          {/* Pricing Cards - Fully Responsive */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-7xl mx-auto mb-16 sm:mb-20">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`relative group ${plan.popular ? "md:-mt-4 md:scale-105" : ""}`}
              >
                {/* Popular Badge - Responsive */}
                {plan.popular && (
                  <div className="absolute -top-4 sm:-top-5 left-1/2 -translate-x-1/2 z-20">
                    <div className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-1.5 sm:py-2 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 rounded-full text-[10px] sm:text-xs font-black text-white shadow-2xl shadow-amber-500/40 animate-pulse whitespace-nowrap">
                      <Crown size={14} className="sm:w-4 sm:h-4" />
                      MOST POPULAR
                    </div>
                  </div>
                )}

                {/* Glow Effect */}
                <div
                  className={`absolute -inset-1 bg-gradient-to-r ${plan.color} rounded-2xl sm:rounded-3xl blur-xl opacity-0 group-hover:opacity-50 transition-all duration-500`}
                ></div>

                {/* Card - Responsive */}
                <div
                  className={`relative h-full rounded-2xl sm:rounded-3xl border-2 ${plan.borderColor} bg-gradient-to-br from-slate-900/95 via-slate-800/90 to-slate-900/95 backdrop-blur-2xl overflow-hidden transition-all duration-500 ${
                    plan.popular ? "border-amber-500/50 shadow-2xl shadow-amber-500/20" : "hover:border-emerald-500/50"
                  } transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-emerald-500/10`}
                >
                  {/* Decorative corner gradient */}
                  <div className={`absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-bl ${plan.color} opacity-10 rounded-bl-full`}></div>

                  {/* Card Header - Responsive */}
                  <div className="p-5 sm:p-6 md:p-8 text-center border-b border-emerald-500/20 relative">
                    <div className="text-4xl sm:text-5xl md:text-6xl mb-3 sm:mb-4 transform group-hover:scale-110 transition-transform duration-300">{plan.icon}</div>
                    <h3 className={`text-2xl sm:text-3xl font-black bg-gradient-to-r ${plan.color} bg-clip-text text-transparent mb-2 sm:mb-3`}>
                      {plan.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-6 sm:mb-8 min-h-[2.5rem] sm:min-h-[3rem] px-2">{plan.tagline}</p>

                    {/* Price - Responsive */}
                    <div className="space-y-2 sm:space-y-3">
                      {plan.priceMonthly === 0 ? (
                        <div>
                          <div className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-2">Free</div>
                          <div className="text-xs sm:text-sm text-slate-500">Forever</div>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-baseline justify-center gap-1 sm:gap-2">
                            <span className="text-xl sm:text-2xl text-slate-500 font-bold">₹</span>
                            <span className="text-4xl sm:text-5xl md:text-6xl font-black bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                              {billingCycle === "monthly" ? plan.priceMonthly : Math.floor(plan.priceYearly / 12)}
                            </span>
                            <span className="text-slate-500 text-base sm:text-lg font-semibold">/mo</span>
                          </div>
                          <div className="text-xs sm:text-sm text-slate-400">
                            {billingCycle === "monthly" ? "Billed monthly" : "Billed yearly"}
                          </div>
                          {billingCycle === "yearly" && (
                            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-emerald-500/20 border border-emerald-500/40 rounded-full">
                              <TrendingUp size={12} className="sm:w-[14px] sm:h-[14px] text-emerald-400" />
                              <span className="text-[10px] sm:text-xs font-black text-emerald-400">
                                Save ₹{plan.priceMonthly * 12 - plan.priceYearly}/year
                              </span>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  {/* Features List - Responsive */}
                  <div className="p-5 sm:p-6 md:p-8">
                    <div className="mb-4 sm:mb-6 text-center">
                      <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">What's included</span>
                    </div>
                    <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2 sm:gap-3 group/item">
                          <div
                            className={`flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-lg flex items-center justify-center transition-all duration-300 ${
                              feature.included
                                ? "bg-gradient-to-br from-emerald-500/30 to-teal-500/30 border border-emerald-500/50 group-hover/item:scale-110"
                                : "bg-slate-800/50 border border-slate-700/50"
                            }`}
                          >
                            {feature.included ? (
                              <Check size={12} className="sm:w-[14px] sm:h-[14px] text-emerald-400 font-bold" />
                            ) : (
                              <X size={12} className="sm:w-[14px] sm:h-[14px] text-slate-600" />
                            )}
                          </div>
                          <span
                            className={`text-xs sm:text-sm leading-relaxed transition-colors ${
                              feature.included ? "text-slate-300 group-hover/item:text-white" : "text-slate-600 line-through"
                            }`}
                          >
                            {feature.text}
                          </span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA Button - Responsive */}
                    <Link href={plan.priceMonthly === 0 ? "/auth/signup" : "/auth/signup?plan=" + plan.name.toLowerCase()}>
                      <Button
                        className={`w-full py-5 sm:py-6 md:py-7 text-base sm:text-lg font-black transition-all duration-300 relative overflow-hidden group/btn ${
                          plan.popular
                            ? "bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-400 hover:via-orange-400 hover:to-red-400 text-white shadow-2xl shadow-amber-500/40 hover:shadow-amber-500/60"
                            : plan.priceMonthly === 0
                            ? "bg-slate-800 hover:bg-slate-700 text-white border-2 border-emerald-500/40 hover:border-emerald-500/60 shadow-lg shadow-emerald-500/10"
                            : "bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:via-teal-400 hover:to-cyan-400 text-white shadow-2xl shadow-emerald-500/40 hover:shadow-emerald-500/60"
                        } transform hover:scale-105 border-0`}
                      >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                          {plan.priceMonthly === 0 ? (
                            <>
                              <Sparkles size={18} className="sm:w-5 sm:h-5" />
                              Start Free
                            </>
                          ) : (
                            <>
                              <Zap size={18} className="sm:w-5 sm:h-5" />
                              Get Started
                            </>
                          )}
                        </span>
                        <div className="absolute inset-0 bg-white opacity-0 group-hover/btn:opacity-10 transition-opacity duration-300"></div>
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* FAQ Section - Responsive */}
          <div className="mt-20 sm:mt-24 md:mt-32 max-w-4xl mx-auto">
            <div className="text-center space-y-3 sm:space-y-4 mb-8 sm:mb-12 px-4">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white">
                Frequently Asked Questions
              </h2>
              <p className="text-base sm:text-lg text-slate-400">Everything you need to know about our pricing</p>
            </div>

            <div className="grid gap-4 sm:gap-6">
              {[
                {
                  q: "Can I switch plans anytime?",
                  a: "Yes! You can upgrade, downgrade, or cancel your plan at any time. Changes take effect immediately.",
                },
                {
                  q: "What payment methods do you accept?",
                  a: "We accept all major credit/debit cards, UPI, net banking, and digital wallets.",
                },
                {
                  q: "Is there a free trial for paid plans?",
                  a: "NutriPlus and NutriPro come with a 7-day free trial. No credit card required to start.",
                },
                {
                  q: "What happens to my data if I cancel?",
                  a: "Your data remains accessible for 30 days after cancellation. You can export it anytime.",
                },
              ].map((faq, idx) => (
                <div
                  key={idx}
                  className="group p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-slate-900/70 to-slate-800/70 backdrop-blur-xl hover:border-emerald-500/50 hover:bg-slate-900/90 transition-all duration-300"
                >
                  <h3 className="text-sm sm:text-base md:text-lg font-black text-white mb-2 sm:mb-3 group-hover:text-emerald-400 transition-colors flex items-center gap-2">
                    <span className="text-emerald-400 flex-shrink-0">→</span>
                    <span>{faq.q}</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom CTA - Responsive */}
          <div className="mt-16 sm:mt-20 md:mt-24 text-center px-4">
            <div className="inline-block p-6 sm:p-8 md:p-10 rounded-2xl sm:rounded-3xl border-2 border-emerald-500/40 bg-gradient-to-br from-emerald-500/10 via-teal-500/10 to-cyan-500/10 backdrop-blur-xl shadow-2xl shadow-emerald-500/20 max-w-2xl">
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 mx-auto mb-4 sm:mb-6 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-xl shadow-emerald-500/30">
                <Sparkles size={24} className="sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-white mb-3 sm:mb-4">Still have questions?</h3>
              <p className="text-slate-400 mb-6 sm:mb-8 text-sm sm:text-base md:text-lg max-w-md mx-auto">Our team is here to help you choose the right plan</p>
              <Link href="/#contact">
                <Button className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:via-teal-400 hover:to-cyan-400 text-white font-bold px-6 sm:px-8 md:px-10 py-5 sm:py-6 md:py-7 text-sm sm:text-base md:text-lg shadow-2xl shadow-emerald-500/40 hover:shadow-emerald-500/60 transition-all duration-300 border-0 transform hover:scale-105 w-full sm:w-auto">
                  <Zap size={18} className="sm:w-5 sm:h-5 mr-2" />
                  Contact Sales
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
