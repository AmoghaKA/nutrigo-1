"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Share2, Heart, AlertCircle, CheckCircle, Sparkles, TrendingUp, ArrowRight, Zap } from "lucide-react"
import Link from "next/link"

interface ScanResultProps {
  data: {
    name: string
    brand: string
    healthScore: number
    nutrition?: {
      calories?: number
      sugar?: number
      protein?: number
      fat?: number
      carbs?: number
    }
    ingredients: string[]
    warnings: string[]
    timestamp?: string
  }
  onReset: () => void
}

export default function ScanResult({ data, onReset }: ScanResultProps) {
  const getScoreColor = (score: number) => {
    if (score >= 70) return "text-emerald-400"
    if (score >= 50) return "text-cyan-400"
    return "text-red-400"
  }

  const getScoreBg = (score: number) => {
    if (score >= 70) return "bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border-emerald-500/40"
    if (score >= 50) return "bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border-cyan-500/40"
    return "bg-gradient-to-br from-red-500/20 to-orange-500/20 border-red-500/40"
  }

  const getScoreGradient = (score: number) => {
    if (score >= 70) return "from-emerald-400 via-teal-400 to-cyan-400"
    if (score >= 50) return "from-cyan-400 via-blue-400 to-purple-400"
    return "from-red-400 via-orange-400 to-yellow-400"
  }

  const getScoreBgGradient = (score: number) => {
    if (score >= 70) return "from-emerald-500/20 via-teal-500/15 to-cyan-500/20"
    if (score >= 50) return "from-cyan-500/20 via-blue-500/15 to-purple-500/20"
    return "from-red-500/20 via-orange-500/15 to-yellow-500/20"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-teal-500/15 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s", animationDuration: "4s" }}
        ></div>
        <div
          className="absolute bottom-0 left-1/2 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s", animationDuration: "5s" }}
        ></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-12 space-y-8 relative z-10">
        {/* Header with Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <Button 
            onClick={onReset} 
            variant="ghost" 
            className="gap-2 text-slate-400 hover:text-white hover:bg-slate-800 transition-all px-4 py-2 rounded-lg"
          >
            <ArrowLeft size={20} /> Back
          </Button>
          <div className="flex gap-2 sm:gap-3">
            <Button 
              variant="outline" 
              className="border border-slate-700 hover:border-emerald-500/50 bg-slate-800/50 hover:bg-emerald-500/10 text-slate-300 hover:text-emerald-400 gap-2 transition-all px-4 py-2.5 rounded-lg text-sm"
            >
              <Heart size={16} /> Save
            </Button>
            <Button 
              variant="outline" 
              className="border border-slate-700 hover:border-teal-500/50 bg-slate-800/50 hover:bg-teal-500/10 text-slate-300 hover:text-teal-400 gap-2 transition-all px-4 py-2.5 rounded-lg text-sm"
            >
              <Share2 size={16} /> Share
            </Button>
          </div>
        </div>

        {/* Product Info Card */}
        <Card className="p-6 sm:p-8 lg:p-10 bg-gradient-to-br from-slate-900/90 via-slate-800/80 to-slate-900/90 backdrop-blur-xl border border-emerald-500/20 hover:border-emerald-500/30 transition-all duration-300 shadow-xl">
          <div className="space-y-6 sm:space-y-8">
            {/* Product Header */}
            <div className="space-y-2 sm:space-y-3">
              <p className="text-xs sm:text-sm text-slate-500 font-semibold uppercase tracking-widest">{data.brand}</p>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight">{data.name}</h1>
              <p className="text-xs sm:text-sm text-slate-400 flex items-center gap-2">
                <Sparkles size={14} className="text-emerald-400" />
                Scanned {data.timestamp}
              </p>
            </div>

            {/* Health Score Section */}
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6 lg:gap-8">
              {/* Score Box */}
              <div className={`relative w-36 h-36 sm:w-40 sm:h-40 rounded-2xl ${getScoreBg(data.healthScore)} border-2 flex items-center justify-center shadow-lg flex-shrink-0`}>
                <div className="text-center">
                  <div className={`text-5xl sm:text-6xl font-black bg-gradient-to-r ${getScoreGradient(data.healthScore)} bg-clip-text text-transparent`}>
                    {data.healthScore}
                  </div>
                  <p className="text-xs text-slate-400 mt-2 font-semibold">Score</p>
                </div>
              </div>

              {/* Rating Info */}
              <div className="space-y-4 flex-1">
                <div className="space-y-2">
                  <p className="text-xs sm:text-sm text-slate-500 font-semibold uppercase tracking-wide">Overall Rating</p>
                  <p className={`text-xl sm:text-2xl font-black ${getScoreColor(data.healthScore)}`}>
                    {data.healthScore >= 70
                      ? "Excellent Choice ⭐"
                      : data.healthScore >= 50
                        ? "Moderate ⚠️"
                        : "Not Recommended ❌"}
                  </p>
                </div>
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                  {data.healthScore >= 70
                    ? "This product is a great choice for your health! It meets high nutritional standards."
                    : data.healthScore >= 50
                      ? "This product has some nutritional concerns. Consider limiting consumption."
                      : "Consider healthier alternatives for this product. High in unhealthy ingredients."}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Nutrition Facts & Warnings Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Nutrition Facts */}
          <Card className="p-6 sm:p-8 bg-gradient-to-br from-slate-900/90 via-slate-800/80 to-slate-900/90 backdrop-blur-xl border border-teal-500/20 hover:border-teal-500/30 transition-all duration-300 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center shadow-md">
                <TrendingUp size={20} className="text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-black text-white">Nutrition Facts</h3>
            </div>
            <div className="space-y-3">
              {[
                { label: "Calories", value: `${data.nutrition?.calories ?? "N/A"} kcal`, color: "text-slate-200", icon: "⚡" },
                { label: "Sugar", value: `${data.nutrition?.sugar ?? "N/A"}g`, color: "text-red-400", icon: "🍬" },
                { label: "Protein", value: `${data.nutrition?.protein ?? "N/A"}g`, color: "text-emerald-400", icon: "💪" },
                { label: "Fat", value: `${data.nutrition?.fat ?? "N/A"}g`, color: "text-amber-400", icon: "🧈" },
                { label: "Carbs", value: `${data.nutrition?.carbs ?? "N/A"}g`, color: "text-blue-400", icon: "🌾" },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:border-teal-500/30 hover:bg-slate-800/80 transition-all duration-200"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{item.icon}</span>
                    <span className="text-sm sm:text-base text-slate-400">{item.label}</span>
                  </div>
                  <span className={`font-black text-lg sm:text-xl ${item.color}`}>{item.value}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Warnings */}
          <Card className="p-6 sm:p-8 bg-gradient-to-br from-slate-900/90 via-slate-800/80 to-slate-900/90 backdrop-blur-xl border border-red-500/20 hover:border-red-500/30 transition-all duration-300 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-red-500/20 border border-red-500/40 flex items-center justify-center shadow-md">
                <AlertCircle size={20} className="text-red-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-black text-white">Health Warnings</h3>
            </div>
            <div className="space-y-3">
              {Array.isArray(data.warnings) && data.warnings.length > 0 ? (
                data.warnings.map((warning: string, index: number) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-4 rounded-lg bg-red-500/10 border border-red-500/30 hover:border-red-500/50 hover:bg-red-500/15 transition-all duration-200"
                  >
                    <span className="text-red-400 font-bold text-lg flex-shrink-0 mt-0.5">⚠</span>
                    <span className="text-sm sm:text-base text-red-200 font-medium">{warning}</span>
                  </div>
                ))
              ) : typeof data.warnings === "string" && data.warnings.length > 0 ? (
                (data.warnings as string)
                  .split(",")
                  .map((warning: string, index: number) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-4 rounded-lg bg-red-500/10 border border-red-500/30 hover:border-red-500/50 hover:bg-red-500/15 transition-all duration-200"
                    >
                      <span className="text-red-400 font-bold text-lg flex-shrink-0 mt-0.5">⚠</span>
                      <span className="text-sm sm:text-base text-red-200 font-medium">{warning.trim()}</span>
                    </div>
                  ))
              ) : (
                <div className="flex items-center gap-3 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                  <CheckCircle size={20} className="text-emerald-400 flex-shrink-0" />
                  <span className="text-sm sm:text-base text-emerald-300 font-medium">No significant warnings</span>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Ingredients */}
        <Card className="p-6 sm:p-8 bg-gradient-to-br from-slate-900/90 via-slate-800/80 to-slate-900/90 backdrop-blur-xl border border-cyan-500/20 hover:border-cyan-500/30 transition-all duration-300 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-md">
              <CheckCircle size={20} className="text-white" />
            </div>
            <h3 className="text-lg sm:text-xl font-black text-white">Ingredients</h3>
          </div>
          <div className="flex flex-wrap gap-3">
            {(data.ingredients ?? []).length > 0 ? (
              data.ingredients.map((ingredient, index) => (
                <span
                  key={index}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-cyan-500/20 border border-cyan-500/40 hover:border-cyan-500/60 hover:bg-cyan-500/30 text-cyan-300 text-xs sm:text-sm font-medium transition-all duration-200 cursor-default"
                >
                  {ingredient}
                </span>
              ))
            ) : (
              <span className="text-slate-400 italic text-sm sm:text-base">No ingredients info available</span>
            )}
          </div>
        </Card>

        {/* CTA Banner */}
        <div className="relative p-6 sm:p-8 lg:p-10 rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 overflow-hidden shadow-xl hover:border-emerald-500/50 transition-all duration-300">
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-0 right-0 w-48 sm:w-64 h-48 sm:h-64 bg-emerald-500/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-48 sm:w-64 h-48 sm:h-64 bg-cyan-500/20 rounded-full blur-3xl"></div>
          </div>
          <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 flex-1">
              <h3 className="text-2xl sm:text-3xl font-black text-white">Looking for healthier alternatives?</h3>
              <p className="text-sm sm:text-base text-slate-300">Discover similar products with better nutritional value</p>
            </div>
            <Link href="/dashboard/alternatives" className="flex-shrink-0 w-full md:w-auto">
              <Button className="w-full md:w-auto bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:via-teal-400 hover:to-cyan-400 text-white font-bold px-6 sm:px-8 py-3 sm:py-4 shadow-xl hover:shadow-emerald-500/40 transition-all duration-300 border-0 text-base sm:text-lg rounded-lg flex items-center justify-center gap-2">
                Find Alternatives
                <ArrowRight size={20} />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
