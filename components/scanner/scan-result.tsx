"use client"


import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  ArrowLeft,
  Share2,
  Heart,
  AlertCircle,
  CheckCircle,
  Sparkles,
  TrendingUp,
  ArrowRight
} from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"


interface ScanResultProps {
  data: {
    name?: string
    brand?: string
    healthScore?: number
    nutrition?: {
      calories?: number
      sugar?: number
      protein?: number
      fat?: number
      carbs?: number
    } | null
    calories?: number
    sugar?: number
    protein?: number
    fat?: number
    carbs?: number
    ingredients?: string[] | string
    warnings?: string[] | string
    timestamp?: string
  }
  onReset: () => void
}


export default function ScanResult({ data, onReset }: ScanResultProps) {
  const [shareSuccess, setShareSuccess] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [saveLoading, setSaveLoading] = useState(false)

  // ✅ Log the data structure once — helps debug
  useEffect(() => {
    console.log("📦 ScanResult received data:", data)
    // Check if already saved
    checkIfSaved()
  }, [data])

  // 🔖 Check if product is already saved
  const checkIfSaved = () => {
    try {
      const savedScans = JSON.parse(localStorage.getItem("savedScans") || "[]")
      const exists = savedScans.some((scan: any) => 
        scan.name === data.name && scan.brand === data.brand
      )
      setIsSaved(exists)
    } catch (error) {
      console.error("Error checking saved status:", error)
    }
  }

  // 💾 Save functionality
  const handleSave = async () => {
    if (saveLoading) return
    setSaveLoading(true)

    try {
      // Get existing saved scans from localStorage
      const savedScans = JSON.parse(localStorage.getItem("savedScans") || "[]")
      
      // Check if already saved
      const alreadySaved = savedScans.some((scan: any) => 
        scan.name === data.name && scan.brand === data.brand
      )

      if (alreadySaved) {
        // Remove from saved (unsave)
        const filtered = savedScans.filter((scan: any) => 
          !(scan.name === data.name && scan.brand === data.brand)
        )
        localStorage.setItem("savedScans", JSON.stringify(filtered))
        setIsSaved(false)
        alert("❌ Removed from saved scans!")
      } else {
        // Add to saved
        const scanToSave = {
          ...data,
          savedAt: new Date().toISOString(),
          id: Date.now().toString()
        }
        savedScans.unshift(scanToSave) // Add to beginning
        localStorage.setItem("savedScans", JSON.stringify(savedScans))
        setIsSaved(true)
        alert("✅ Scan saved successfully!")
      }
    } catch (error) {
      console.error("Error saving scan:", error)
      alert("❌ Failed to save scan. Please try again.")
    } finally {
      setSaveLoading(false)
    }
  }


  // 🧠 Normalize nutrition
  const nutrition = data.nutrition ?? {
    calories: data.calories ?? 0,
    sugar: data.sugar ?? 0,
    protein: data.protein ?? 0,
    fat: data.fat ?? 0,
    carbs: data.carbs ?? 0,
  }


  // 🧩 Extract or infer ingredients
  let ingredients: string[] = []


  if (Array.isArray(data.ingredients)) {
    ingredients = data.ingredients
  } else if (typeof data.ingredients === "string") {
    ingredients = data.ingredients.split(/[.,;•\n]/).map(i => i.trim()).filter(Boolean)
  } else if (typeof data.warnings === "string" && data.warnings.toLowerCase().includes("contains")) {
    // 🧪 extract "Contains: ..." portion
    const match = data.warnings.match(/contains[:\s]+([^.!]+)/i)
    if (match && match[1]) {
      ingredients = match[1]
        .split(/[.,;•\n]/)
        .map(i => i.replace(/(and|or)/gi, "").trim())
        .filter(Boolean)
    }
  }


  // 🚨 Normalize warnings
  let warnings: string[] = []
  if (typeof data.warnings === "string") {
    warnings = data.warnings
      .split(/[.\n]/)
      .map(w => w.trim())
      .filter(Boolean)
  } else if (Array.isArray(data.warnings)) {
    warnings = data.warnings
  }


  // 🧮 Generate auto warnings if needed
  if (warnings.length === 0) {
    if (nutrition.sugar > 25) warnings.push("High sugar content — may contribute to weight gain.")
    if (nutrition.fat > 17) warnings.push("High fat content — limit consumption if watching calories.")
    if (nutrition.protein < 5) warnings.push("Low protein — may not be filling or nutritious.")
    if (nutrition.calories > 400) warnings.push("High calorie product — consume in moderation.")
    if (warnings.length === 0) warnings.push("No significant health warnings detected ✅")
  }


  // 🌈 Score visuals
  const getScoreColor = (score: number) => {
    if (!score) return "text-slate-400"
    if (score >= 70) return "text-emerald-400"
    if (score >= 50) return "text-cyan-400"
    return "text-red-400"
  }


  const getScoreBg = (score: number) => {
    if (!score) return "bg-slate-700/40"
    if (score >= 70) return "bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border-emerald-500/40"
    if (score >= 50) return "bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border-cyan-500/40"
    return "bg-gradient-to-br from-red-500/20 to-orange-500/20 border-red-500/40"
  }


  const getScoreGradient = (score: number) => {
    if (!score) return "from-slate-500 to-slate-700"
    if (score >= 70) return "from-emerald-400 via-teal-400 to-cyan-400"
    if (score >= 50) return "from-cyan-400 via-blue-400 to-purple-400"
    return "from-red-400 via-orange-400 to-yellow-400"
  }

  // 📤 Share functionality
  const handleShare = async () => {
    const shareData = {
      title: `${data.name || "Packaged Food Product"} - Health Score: ${data.healthScore || "N/A"}`,
      text: `I just scanned ${data.name || "a packaged food product"} with NutriGo!\n\nHealth Score: ${data.healthScore || "N/A"}/100\nCalories: ${nutrition.calories}kcal\nSugar: ${nutrition.sugar}g\nProtein: ${nutrition.protein}g\n\nCheck it out on NutriGo - Your Packaged Food Scanner!`,
      url: typeof window !== "undefined" ? window.location.href : "",
    }

    try {
      // Check if Web Share API is available
      if (navigator.share) {
        await navigator.share(shareData)
        setShareSuccess(true)
        setTimeout(() => setShareSuccess(false), 3000)
      } else {
        // Fallback: Copy to clipboard
        const textToShare = `${shareData.title}\n\n${shareData.text}\n\n${shareData.url}`
        await navigator.clipboard.writeText(textToShare)
        setShareSuccess(true)
        setTimeout(() => setShareSuccess(false), 3000)
        alert("✅ Scan details copied to clipboard!")
      }
    } catch (error) {
      console.error("Error sharing:", error)
      // Final fallback: just copy product name
      try {
        await navigator.clipboard.writeText(`${data.name} - Health Score: ${data.healthScore}/100`)
        alert("✅ Product name copied to clipboard!")
      } catch {}
    }
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-teal-500/15 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>


      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <Button onClick={onReset} variant="ghost" className="gap-2 text-slate-400 hover:text-white hover:bg-slate-800 transition-all">
            <ArrowLeft size={20} /> Back to Scanner
          </Button>
          <div className="flex gap-2 sm:gap-3">
            <Button 
              onClick={handleSave}
              disabled={saveLoading}
              variant="outline" 
              className={`border ${isSaved ? 'border-emerald-500/50 bg-emerald-500/20 text-emerald-400' : 'border-slate-700 hover:border-emerald-500/50 bg-slate-800/50 hover:bg-emerald-500/10 text-slate-300 hover:text-emerald-400'} transition-all`}
            >
              {saveLoading ? (
                <div className="w-4 h-4 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
              ) : (
                <Heart size={16} className={isSaved ? "fill-emerald-400" : ""} />
              )}
              {isSaved ? "Saved" : "Save"}
            </Button>
            <Button 
              onClick={handleShare}
              variant="outline" 
              className={`border border-slate-700 ${shareSuccess ? 'border-teal-500/50 bg-teal-500/20' : 'hover:border-teal-500/50 bg-slate-800/50 hover:bg-teal-500/10'} text-slate-300 hover:text-teal-400 transition-all`}
            >
              {shareSuccess ? <CheckCircle size={16} /> : <Share2 size={16} />} 
              {shareSuccess ? "Shared!" : "Share"}
            </Button>
          </div>
        </div>


        {/* Product Info */}
        <Card className="p-6 sm:p-8 bg-gradient-to-br from-slate-900/90 via-slate-800/80 to-slate-900/90 border border-emerald-500/20">
          <div className="space-y-4">
            <p className="text-xs text-slate-500 uppercase tracking-wider">{data.brand || "Unknown Brand"}</p>
            <h1 className="text-4xl md:text-5xl font-black text-white">{data.name}</h1>
            <p className="text-sm text-slate-400 flex items-center gap-2">
              <Sparkles size={14} className="text-emerald-400" /> Scanned {data.timestamp ?? "just now"}
            </p>


            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className={`relative w-36 h-36 rounded-2xl ${getScoreBg(data.healthScore ?? 0)} border flex items-center justify-center`}>
                <div className={`text-6xl font-black bg-gradient-to-r ${getScoreGradient(data.healthScore ?? 0)} bg-clip-text text-transparent`}>
                  {data.healthScore ?? "—"}
                </div>
              </div>
              <div className="space-y-2 text-slate-300">
                <p className={`text-xl font-bold ${getScoreColor(data.healthScore ?? 0)}`}>
                  {data.healthScore && data.healthScore >= 70
                    ? "Excellent Choice ⭐"
                    : data.healthScore && data.healthScore >= 50
                    ? "Moderate ⚠️"
                    : "Not Recommended ❌"}
                </p>
              </div>
            </div>
          </div>
        </Card>


        {/* Nutrition + Warnings */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Nutrition */}
          <Card className="p-6 bg-gradient-to-br from-slate-900/90 via-slate-800/80 to-slate-900/90 border border-teal-500/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center">
                <TrendingUp size={20} className="text-white" />
              </div>
              <h3 className="text-xl font-black text-white">Nutrition Facts</h3>
            </div>
            <div className="space-y-3">
              {[
                { label: "Calories", value: `${nutrition.calories ?? 0} kcal`, color: "text-slate-200", icon: "⚡" },
                { label: "Sugar", value: `${nutrition.sugar ?? 0}g`, color: "text-red-400", icon: "🍬" },
                { label: "Protein", value: `${nutrition.protein ?? 0}g`, color: "text-emerald-400", icon: "💪" },
                { label: "Fat", value: `${nutrition.fat ?? 0}g`, color: "text-amber-400", icon: "🧈" },
                { label: "Carbs", value: `${nutrition.carbs ?? 0}g`, color: "text-blue-400", icon: "🌾" },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{item.icon}</span>
                    <span className="text-sm text-slate-400">{item.label}</span>
                  </div>
                  <span className={`font-black text-lg ${item.color}`}>{item.value}</span>
                </div>
              ))}
            </div>
          </Card>


          {/* Warnings */}
          <Card className="p-6 bg-gradient-to-br from-slate-900/90 via-slate-800/80 to-slate-900/90 border border-red-500/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-red-500/20 border border-red-500/40 flex items-center justify-center">
                <AlertCircle size={20} className="text-red-400" />
              </div>
              <h3 className="text-xl font-black text-white">Health Warnings</h3>
            </div>
            <div className="space-y-3">
              {warnings.map((warning, i) => (
                <div key={i} className="flex items-start gap-3 p-4 rounded-lg bg-red-500/10 border border-red-500/30">
                  <span className="text-red-400 font-bold text-lg">⚠</span>
                  <span className="text-sm text-red-200">{warning}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>


        {/* Ingredients */}
        <Card className="p-6 bg-gradient-to-br from-slate-900/90 via-slate-800/80 to-slate-900/90 border border-cyan-500/20">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <CheckCircle size={20} className="text-white" />
            </div>
            <h3 className="text-xl font-black text-white">Ingredients</h3>
          </div>


          {ingredients.length > 0 ? (
            <div className="flex flex-wrap gap-3">
              {ingredients.map((ing, i) => (
                <span key={i} className="px-3 py-1.5 rounded-lg bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-sm font-medium">
                  {ing}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-slate-400 italic">No ingredients info available for this packaged product</p>
          )}
        </Card>


        {/* CTA */}
        <div className="p-8 rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 shadow-xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold text-white">Want healthier packaged food alternatives?</h3>
              <p className="text-slate-400">Discover packaged products with better nutritional value.</p>
            </div>
            <Link href="/dashboard/alternatives">
              <Button className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white font-bold px-6 py-4">
                Find Alternatives <ArrowRight size={18} />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
