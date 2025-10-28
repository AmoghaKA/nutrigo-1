"use client"

import { Check, X, Sparkles, Zap } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Navigation from "@/components/landing/navigation"

const pricingPlans = [
  {
    name: "NutriGo",
    tagline: "For users seeking quick nutrition awareness.",
    icon: "🌱",
    color: "from-emerald-400 to-teal-500",
    bgColor: "from-emerald-500/10 to-teal-500/10",
    borderColor: "border-emerald-500/30",
    priceMonthly: 0,
    priceYearly: 0,
    popular: false,
    features: [
      { text: "Scan up to 5 items/day", included: true },
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
    tagline: "For users who want detailed food insights.",
    icon: "🍊",
    color: "from-amber-400 to-orange-500",
    bgColor: "from-amber-500/10 to-orange-500/10",
    borderColor: "border-amber-500/40",
    priceMonthly: 249,
    priceYearly: 2490,
    popular: true,
    features: [
      { text: "Unlimited scans per day", included: true },
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
    tagline: "For professionals, fitness enthusiasts, and advanced users.",
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
      {/* Add Navigation Component Here */}
      <Navigation />
      
      <div className="min-h-screen bg-slate-950 pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: "2s" }}></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Header */}
          <div className="text-center space-y-6 mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full backdrop-blur-xl">
              <Zap size={16} className="text-emerald-400 animate-pulse" />
              <span className="text-sm font-semibold text-emerald-400">Simple, Transparent Pricing</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-black">
              <span className="text-white">Choose Your </span>
              <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                Perfect Plan
              </span>
            </h1>

            <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
              Start free, upgrade when you need more. All plans include AI-powered nutrition insights.
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-4 mt-8">
              <span className={`text-sm font-semibold transition-colors ${billingCycle === "monthly" ? "text-emerald-400" : "text-slate-400"}`}>
                Monthly
              </span>
              <button
                onClick={() => setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")}
                className="relative w-16 h-8 bg-slate-800 rounded-full border border-emerald-500/30 transition-all duration-300 hover:border-emerald-500/50"
              >
                <div
                  className={`absolute top-1 w-6 h-6 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full transition-all duration-300 shadow-lg ${
                    billingCycle === "yearly" ? "left-9" : "left-1"
                  }`}
                ></div>
              </button>
              <span className={`text-sm font-semibold transition-colors ${billingCycle === "yearly" ? "text-emerald-400" : "text-slate-400"}`}>
                Yearly
              </span>
              {billingCycle === "yearly" && (
                <span className="ml-2 px-3 py-1 bg-emerald-500/20 border border-emerald-500/40 rounded-full text-xs font-bold text-emerald-400">
                  Save 17%
                </span>
              )}
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`relative group ${plan.popular ? "md:-mt-4" : ""}`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                    <div className="flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full text-xs font-bold text-white shadow-lg">
                      <Sparkles size={14} />
                      MOST POPULAR
                    </div>
                  </div>
                )}

                {/* Glow Effect */}
                <div
                  className={`absolute -inset-0.5 bg-gradient-to-r ${plan.color} rounded-3xl blur-lg opacity-0 group-hover:opacity-40 transition-all duration-500`}
                ></div>

                {/* Card */}
                <div
                  className={`relative h-full rounded-3xl border ${plan.borderColor} bg-gradient-to-br ${plan.bgColor} backdrop-blur-xl overflow-hidden transition-all duration-500 ${
                    plan.popular ? "border-2 shadow-2xl shadow-amber-500/20" : "hover:border-emerald-500/40"
                  } transform hover:-translate-y-2`}
                >
                  {/* Card Header */}
                  <div className="p-8 text-center border-b border-emerald-500/20">
                    <div className="text-5xl mb-4">{plan.icon}</div>
                    <h3 className={`text-2xl font-black bg-gradient-to-r ${plan.color} bg-clip-text text-transparent mb-2`}>
                      {plan.name}
                    </h3>
                    <p className="text-sm text-slate-400 leading-relaxed mb-6">{plan.tagline}</p>

                    {/* Price */}
                    <div className="space-y-2">
                      {plan.priceMonthly === 0 ? (
                        <div className="text-5xl font-black text-white">Free</div>
                      ) : (
                        <>
                          <div className="text-5xl font-black text-white">
                            ₹{billingCycle === "monthly" ? plan.priceMonthly : Math.floor(plan.priceYearly / 12)}/-
                          </div>
                          <div className="text-sm text-slate-400">
                            {billingCycle === "monthly" ? "per month" : "per month, billed yearly"}
                          </div>
                          {billingCycle === "yearly" && (
                            <div className="text-xs text-emerald-400 font-semibold">
                              ₹{plan.priceYearly}/year (Save ₹{plan.priceMonthly * 12 - plan.priceYearly})
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  {/* Features List */}
                  <div className="p-8">
                    <ul className="space-y-4">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <div
                            className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                              feature.included
                                ? "bg-emerald-500/20 border border-emerald-500/40"
                                : "bg-slate-800 border border-slate-700"
                            }`}
                          >
                            {feature.included ? (
                              <Check size={14} className="text-emerald-400" />
                            ) : (
                              <X size={14} className="text-slate-600" />
                            )}
                          </div>
                          <span
                            className={`text-sm ${
                              feature.included ? "text-slate-300" : "text-slate-500 line-through"
                            }`}
                          >
                            {feature.text}
                          </span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA Button */}
                    <Link href={plan.priceMonthly === 0 ? "/auth/signup" : "/auth/signup?plan=" + plan.name.toLowerCase()}>
                      <Button
                        className={`w-full mt-8 py-6 text-base font-bold transition-all duration-300 ${
                          plan.popular
                            ? "bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-400 hover:via-orange-400 hover:to-red-400 text-white shadow-xl shadow-amber-500/30 hover:shadow-amber-500/50"
                            : plan.priceMonthly === 0
                            ? "bg-slate-800 hover:bg-slate-700 text-white border border-emerald-500/30 hover:border-emerald-500/50"
                            : "bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:via-teal-400 hover:to-cyan-400 text-white shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50"
                        } transform hover:scale-105 border-0`}
                      >
                        {plan.priceMonthly === 0 ? "Start Free" : "Get Started"}
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="mt-32 max-w-4xl mx-auto">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl md:text-4xl font-black text-white">
                Frequently Asked Questions
              </h2>
              <p className="text-slate-400">Everything you need to know about our pricing</p>
            </div>

            <div className="space-y-4">
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
                  className="p-6 rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-slate-900/50 to-slate-800/50 backdrop-blur-xl hover:border-emerald-500/40 transition-all duration-300"
                >
                  <h3 className="text-lg font-bold text-white mb-2">{faq.q}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="mt-24 text-center">
            <div className="inline-block p-8 rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-slate-900/50 to-slate-800/50 backdrop-blur-xl">
              <h3 className="text-2xl font-black text-white mb-3">Still have questions?</h3>
              <p className="text-slate-400 mb-6">Our team is here to help you choose the right plan</p>
              <Link href="#contact">
                <Button className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:via-teal-400 hover:to-cyan-400 text-white font-bold px-8 py-6 shadow-xl shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all duration-300 border-0">
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
