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
  ArrowRight,
  Download
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"
import { useToast } from "@/hooks/use-toast"

interface ScanResultProps {
  data: {
    id?: string
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
  const router = useRouter()
  const supabase = createClientComponentClient()
  const reportRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()
  
  const [shareSuccess, setShareSuccess] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  const [favoriteLoading, setFavoriteLoading] = useState(false)
  const [downloadLoading, setDownloadLoading] = useState(false)

  // ✅ Log the data structure once — helps debug
  useEffect(() => {
    console.log("📦 ScanResult received data:", data)
    // Check if already in favorites
    checkIfFavorite()
  }, [data])

  // 🔖 Check if product is already in favorites
  const checkIfFavorite = async () => {
    try {
      const userId = await getCurrentUserId()
      console.log("🔍 Checking favorites for user:", userId)
      
      if (!userId) {
        console.warn("⚠️ No user ID - cannot check favorites")
        return
      }

      const favoritesKey = `favorites_${userId}`
      const storedFavorites = localStorage.getItem(favoritesKey)
      const favoriteIds: string[] = storedFavorites ? JSON.parse(storedFavorites) : []
      
      console.log("💾 Stored favorites:", favoriteIds)
      
      // Check if this scan's ID exists in favorites
      const exists = data.id && favoriteIds.includes(data.id)
      setIsFavorite(!!exists)
      console.log("❤️ Is favorite:", exists)
    } catch (error) {
      console.error("Error checking favorite status:", error)
    }
  }

  // Get current user ID
  const getCurrentUserId = async (): Promise<string | null> => {
    try {
      // First, try Supabase auth
      const { data: { user } } = await supabase.auth.getUser()
      if (user?.id) {
        console.log("✅ Found user from Supabase:", user.id)
        return user.id
      }
    } catch (err) {
      console.error("❌ Supabase auth check failed:", err)
    }

    // Fallback to localStorage
    if (typeof window !== "undefined") {
      const keys = ["nutrigo_current_user", "currentUser", "user"]
      for (const key of keys) {
        const raw = localStorage.getItem(key)
        if (!raw) continue
        try {
          const parsed = JSON.parse(raw)
          if (parsed?.id) {
            console.log(`✅ Found user from localStorage (${key}):`, parsed.id)
            return parsed.id
          }
        } catch {
          if (raw.startsWith("user_") || raw.length > 6) {
            console.log(`✅ Found user ID from localStorage (${key}):`, raw)
            return raw
          }
        }
      }
    }
    
    console.error("❌ No user ID found in Supabase or localStorage!")
    return null
  }

  // 💖 Toggle Favorite functionality
  const handleToggleFavorite = async () => {
    if (favoriteLoading) return
    setFavoriteLoading(true)

    try {
      const userId = await getCurrentUserId()
      if (!userId) {
        toast({
          title: "Login Required",
          description: "Please log in to add favorites",
          variant: "destructive",
        })
        setFavoriteLoading(false)
        return
      }

      if (!data.id) {
        toast({
          title: "Error",
          description: "Cannot favorite this scan - missing ID",
          variant: "destructive",
        })
        setFavoriteLoading(false)
        return
      }

      const favoritesKey = `favorites_${userId}`
      const storedFavorites = localStorage.getItem(favoritesKey)
      const favoriteIds: string[] = storedFavorites ? JSON.parse(storedFavorites) : []

      if (isFavorite) {
        // Remove from favorites
        const updatedFavorites = favoriteIds.filter((id: string) => id !== data.id)
        localStorage.setItem(favoritesKey, JSON.stringify(updatedFavorites))
        setIsFavorite(false)
        toast({
          title: "Removed from Favorites",
          description: "Scan has been removed from your favorites",
        })
      } else {
        // Add to favorites
        favoriteIds.unshift(data.id) // Add to beginning
        localStorage.setItem(favoritesKey, JSON.stringify(favoriteIds))
        setIsFavorite(true)
        toast({
          title: "Added to Favorites",
          description: "Scan has been added to your favorites",
        })
      }
    } catch (error) {
      console.error("Error toggling favorite:", error)
      toast({
        title: "Error",
        description: "Failed to update favorites. Please try again.",
        variant: "destructive",
      })
    } finally {
      setFavoriteLoading(false)
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
    if ((nutrition.sugar ?? 0) > 25) warnings.push("High sugar content — may contribute to weight gain.")
    if ((nutrition.fat ?? 0) > 17) warnings.push("High fat content — limit consumption if watching calories.")
    if ((nutrition.protein ?? 0) < 5) warnings.push("Low protein — may not be filling or nutritious.")
    if ((nutrition.calories ?? 0) > 400) warnings.push("High calorie product — consume in moderation.")
    if (warnings.length === 0) warnings.push("No significant health warnings detected ✅")
  }

  // 🌈 Score visuals
  const getScoreColor = (score: number): [number, number, number] => {
      if (!score) return [108, 117, 125] // Slate color
      if (score >= 70) return [34, 197, 94] // Emerald color
      if (score >= 50) return [6, 182, 212] // Cyan color
      return [239, 68, 68] // Red color
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
        toast({
          title: "Copied!",
          description: "Scan details copied to clipboard",
        })
      }
    } catch (error) {
      console.error("Error sharing:", error)
      // Final fallback: just copy product name
      try {
        await navigator.clipboard.writeText(`${data.name} - Health Score: ${data.healthScore}/100`)
        toast({
          title: "Copied!",
          description: "Product name copied to clipboard",
        })
      } catch {}
    }
  }

  // 📥 Download PDF Report
  const handleDownloadReport = async () => {
    if (downloadLoading) return
    setDownloadLoading(true)

    try {
      // Create PDF directly with text content
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      })

      let yPosition = 10
      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()
      const margin = 15
      const contentWidth = pageWidth - 2 * margin

      // Professional color scheme
      const darkBlue: [number, number, number] = [25, 45, 85]
      const vibrantIndigo: [number, number, number] = [79, 70, 229]
      const accent: [number, number, number] = [99, 102, 241]
      const successGreen: [number, number, number] = [34, 197, 94]
      const warningRed: [number, number, number] = [239, 68, 68]
      const textDark: [number, number, number] = [20, 24, 82]
      const textGray: [number, number, number] = [75, 85, 99]
      const lightGray: [number, number, number] = [229, 231, 235]
      const white: [number, number, number] = [255, 255, 255]

      // 🎨 Header with brand and logo
      pdf.setFillColor(...darkBlue)
      pdf.rect(0, 0, pageWidth, 40, "F")
      
      // Draw NutriGo Logo (Package with magnifying glass)
      const logoX = margin
      const logoY = 6
      
      // Package box (left side of logo)
      pdf.setFillColor(34, 197, 94) // Green
      pdf.rect(logoX + 2, logoY + 5, 5, 6, "F") // Main box
      pdf.rect(logoX + 2, logoY + 5, 5, 1.5, "F") // Top flap
      
      // Package angled flap
      pdf.setFillColor(76, 175, 80) // Lighter green
      pdf.line(logoX + 4, logoY + 5, logoX + 6, logoY + 4)
      pdf.line(logoX + 6, logoY + 4, logoX + 7, logoY + 5.5)
      pdf.line(logoX + 7, logoY + 5.5, logoX + 5, logoY + 6.5)
      
      // Magnifying glass circle
      pdf.setDrawColor(76, 175, 80)
      pdf.setLineWidth(0.8)
      pdf.circle(logoX + 8, logoY + 8, 2.5)
      
      // Magnifying glass handle
      pdf.setLineWidth(0.6)
      pdf.line(logoX + 9.5, logoY + 9.5, logoX + 11, logoY + 11)
      
      // Brand text - "NutriGo"
      pdf.setFont("helvetica", "bold")
      pdf.setFontSize(24)
      pdf.setTextColor(...white)
      pdf.text("NutriGo", margin + 14, logoY + 8)
      
      // Tagline
      pdf.setFont("helvetica", "normal")
      pdf.setFontSize(9)
      pdf.setTextColor(180, 190, 220)
      pdf.text("Packaged Food Health Analysis", margin + 14, logoY + 14)
      
      yPosition = 48

      // 📋 Product Info Section - Improved alignment
      pdf.setFillColor(245, 245, 250)
      pdf.rect(margin, yPosition, contentWidth, 30, "F")
      pdf.setDrawColor(...vibrantIndigo)
      pdf.setLineWidth(1.2)
      pdf.rect(margin, yPosition, contentWidth, 30)

      pdf.setFont("helvetica", "bold")
      pdf.setFontSize(20)
      pdf.setTextColor(...textDark)
      pdf.text(`${data.name || "Product Name"}`, margin + 6, yPosition + 9)

      pdf.setFont("helvetica", "normal")
      pdf.setFontSize(11)
      pdf.setTextColor(...textGray)
      pdf.text(`Brand: ${data.brand || "Unknown"}`, margin + 6, yPosition + 18)
      pdf.text(`Scanned: ${data.timestamp || new Date().toLocaleString()}`, margin + 6, yPosition + 26)
      
      yPosition += 38

      // 💯 Health Score Section - Eye-catching with dynamic colors
      const healthScore = data.healthScore ?? 0
      const scoreStatus = 
        healthScore >= 70
          ? "⭐ Excellent Choice"
          : healthScore >= 50
          ? "⚠️ Moderate"
          : "❌ Not Recommended"

      const scoreColor: [number, number, number] = healthScore >= 70 ? successGreen : healthScore >= 50 ? [59, 130, 246] : warningRed
      
      // Dynamic background color based on score
      let scoreBoxBgColor: [number, number, number], scoreBoxBorderColor: [number, number, number]
      if (healthScore >= 70) {
        scoreBoxBgColor = [220, 252, 231] // Light green
        scoreBoxBorderColor = successGreen
      } else if (healthScore >= 50) {
        scoreBoxBgColor = [224, 242, 254] // Light blue
        scoreBoxBorderColor = [59, 130, 246]
      } else {
        scoreBoxBgColor = [254, 226, 226] // Light red
        scoreBoxBorderColor = warningRed
      }

      // Score box with dynamic colors
      pdf.setFillColor(...scoreBoxBgColor)
      pdf.rect(margin, yPosition, contentWidth, 38, "F")
      pdf.setDrawColor(...scoreBoxBorderColor)
      pdf.setLineWidth(2.5)
      pdf.rect(margin, yPosition, contentWidth, 38)

      // Left side - Status
      pdf.setFont("helvetica", "bold")
      pdf.setFontSize(12)
      pdf.setTextColor(...textGray)
      pdf.text("HEALTH SCORE", margin + 6, yPosition + 10)

      pdf.setFont("helvetica", "bold")
      pdf.setFontSize(15)
      pdf.setTextColor(...getScoreColor(healthScore))
      pdf.text(scoreStatus, margin + 6, yPosition + 22)

      // Right side - Score number (larger and more prominent)
      pdf.setFont("helvetica", "bold")
      pdf.setFontSize(48)
      pdf.setTextColor(...scoreColor)
      const scoreText = `${healthScore}/100`
      const scoreWidth = pdf.getTextWidth(scoreText)
      pdf.text(scoreText, pageWidth - margin - scoreWidth - 6, yPosition + 31)

      yPosition += 44

      // 🥗 Nutrition Facts Section
      pdf.setFont("helvetica", "bold")
      pdf.setFontSize(12)
      pdf.setTextColor(...white)
      pdf.setFillColor(...darkBlue)
      pdf.rect(margin, yPosition, contentWidth, 8, "F")
      pdf.text("NUTRITION FACTS", margin + 6, yPosition + 5.5)
      
      yPosition += 12

      const nutritionItems = [
        { label: "Calories", value: `${nutrition.calories ?? 0} kcal`, color: [249, 115, 22] },
        { label: "Sugar", value: `${nutrition.sugar ?? 0}g`, color: [239, 68, 68] },
        { label: "Protein", value: `${nutrition.protein ?? 0}g`, color: [34, 197, 94] },
        { label: "Fat", value: `${nutrition.fat ?? 0}g`, color: [245, 158, 11] },
        { label: "Carbs", value: `${nutrition.carbs ?? 0}g`, color: [59, 130, 246] },
      ]

      nutritionItems.forEach((item, idx) => {
        if (yPosition > pageHeight - 50) {
          pdf.addPage()
          // Re-add header on new page
          pdf.setFillColor(...darkBlue)
          pdf.rect(0, 0, pageWidth, 20, "F")
          pdf.setFont("helvetica", "bold")
          pdf.setFontSize(16)
          pdf.setTextColor(...white)
          pdf.text("NutriGo Report (continued)", margin, 12)
          yPosition = 25
        }

        // Alternate row background
        if (idx % 2 === 0) {
          pdf.setFillColor(249, 250, 251)
          pdf.rect(margin, yPosition - 3.5, contentWidth, 9, "F")
        }

        // Label
        pdf.setFont("helvetica", "normal")
        pdf.setFontSize(11)
        pdf.setTextColor(...textDark)
        pdf.text(`${item.label}:`, margin + 6, yPosition + 2)

        // Value
        pdf.setFont("helvetica", "bold")
        pdf.setFontSize(12)
        pdf.setTextColor(...(item.color as [number, number, number]))
        pdf.text(item.value, pageWidth - margin - 25, yPosition + 2)

        yPosition += 9
      })

      yPosition += 6

      // ⚠️ Health Warnings Section
      if (warnings.length > 0) {
        if (yPosition > pageHeight - 55) {
          pdf.addPage()
          pdf.setFillColor(...darkBlue)
          pdf.rect(0, 0, pageWidth, 20, "F")
          pdf.setFont("helvetica", "bold")
          pdf.setFontSize(16)
          pdf.setTextColor(...white)
          pdf.text("NutriGo Report (continued)", margin, 12)
          yPosition = 25
        }

        pdf.setFont("helvetica", "bold")
        pdf.setFontSize(12)
        pdf.setTextColor(...white)
        pdf.setFillColor(...warningRed)
        pdf.rect(margin, yPosition, contentWidth, 8, "F")
        pdf.text("HEALTH WARNINGS", margin + 6, yPosition + 5.5)
        
        yPosition += 11

        pdf.setFont("helvetica", "normal")
        pdf.setFontSize(10)
        pdf.setTextColor(...textDark)

        warnings.forEach((warning) => {
          if (yPosition > pageHeight - 30) {
            pdf.addPage()
            pdf.setFillColor(...darkBlue)
            pdf.rect(0, 0, pageWidth, 20, "F")
            pdf.setFont("helvetica", "bold")
            pdf.setFontSize(16)
            pdf.setTextColor(...white)
            pdf.text("NutriGo Report (continued)", margin, 12)
            yPosition = 25
          }

          // Warning box
          pdf.setFillColor(254, 242, 242)
          pdf.rect(margin, yPosition - 2.5, contentWidth, 8, "F")
          pdf.setDrawColor(...warningRed)
          pdf.setLineWidth(0.4)
          pdf.rect(margin, yPosition - 2.5, contentWidth, 8)

          const splitWarning = pdf.splitTextToSize(`⚠ ${warning}`, contentWidth - 8)
          pdf.text(splitWarning, margin + 5, yPosition + 2)
          
          yPosition += 9
        })
      }

      yPosition += 6

      // 📝 Ingredients Section
      if (ingredients.length > 0) {
        if (yPosition > pageHeight - 45) {
          pdf.addPage()
          pdf.setFillColor(...darkBlue)
          pdf.rect(0, 0, pageWidth, 20, "F")
          pdf.setFont("helvetica", "bold")
          pdf.setFontSize(16)
          pdf.setTextColor(...white)
          pdf.text("NutriGo Report (continued)", margin, 12)
          yPosition = 25
        }

        pdf.setFont("helvetica", "bold")
        pdf.setFontSize(12)
        pdf.setTextColor(...white)
        pdf.setFillColor(...vibrantIndigo)
        pdf.rect(margin, yPosition, contentWidth, 8, "F")
        pdf.text("INGREDIENTS", margin + 6, yPosition + 5.5)
        
        yPosition += 11

        // Ingredients box
        pdf.setFillColor(248, 250, 255)
        const ingredientText = ingredients.join(", ")
        const splitIngredients = pdf.splitTextToSize(ingredientText, contentWidth - 8)
        const ingredientBoxHeight = splitIngredients.length * 4.5 + 5
        
        pdf.setDrawColor(...accent)
        pdf.setLineWidth(0.6)
        pdf.rect(margin + 2, yPosition - 2, contentWidth - 4, ingredientBoxHeight, "F")
        pdf.rect(margin + 2, yPosition - 2, contentWidth - 4, ingredientBoxHeight)

        pdf.setFont("helvetica", "normal")
        pdf.setFontSize(10)
        pdf.setTextColor(...textDark)
        pdf.text(splitIngredients, margin + 5, yPosition + 1)
      }

      // 📌 Professional Footer
      pdf.setFont("helvetica", "italic")
      pdf.setFontSize(8)
      pdf.setTextColor(120, 130, 150)
      
      // Divider line
      pdf.setDrawColor(200, 200, 200)
      pdf.setLineWidth(0.4)
      pdf.line(margin, pageHeight - 13, pageWidth - margin, pageHeight - 13)
      
      // Footer content
      pdf.setFont("helvetica", "normal")
      pdf.text("NutriGo - Your Packaged Food Scanner", margin, pageHeight - 8)
      pdf.setFontSize(7)
      pdf.text(`Report generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`, margin, pageHeight - 4)

      // Download the PDF
      const fileName = `${data.name || "Scan-Report"}_${new Date().toLocaleDateString()}.pdf`
      pdf.save(fileName)

      console.log("✅ PDF downloaded successfully!")
      toast({
        title: "Success!",
        description: "Your professional report has been downloaded",
      })
    } catch (error) {
      console.error("❌ Error generating PDF:", error)
      toast({
        title: "Error",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive",
      })
    } finally {
      setDownloadLoading(false)
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
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <Button onClick={onReset} variant="ghost" className="gap-2 text-slate-400 hover:text-white hover:bg-slate-800 transition-all px-2 sm:px-4">
              <ArrowLeft size={20} />
              <span className="hidden sm:inline">Back to Scanner</span>
              <span className="sm:hidden">Back</span>
            </Button>
          </div>
          
          {/* Action Buttons - Responsive Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
            <Button 
              onClick={handleDownloadReport}
              disabled={downloadLoading}
              variant="outline" 
              className={`border w-full ${downloadLoading ? 'border-violet-500/50 bg-violet-500/20' : 'border-slate-700 hover:border-violet-500/50 bg-slate-800/50 hover:bg-violet-500/10'} text-slate-300 hover:text-violet-400 transition-all py-2 sm:py-2 text-sm sm:text-base`}
            >
              {downloadLoading ? (
                <div className="w-4 h-4 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin mr-2" />
              ) : (
                <Download size={16} className="mr-2" />
              )}
              <span>{downloadLoading ? "Generating..." : "Download"}</span>
            </Button>
            
            <Button 
              onClick={handleToggleFavorite}
              disabled={favoriteLoading}
              variant="outline" 
              className={`border w-full ${isFavorite ? 'border-pink-500/50 bg-pink-500/20 text-pink-400' : 'border-slate-700 hover:border-pink-500/50 bg-slate-800/50 hover:bg-pink-500/10 text-slate-300 hover:text-pink-400'} transition-all py-2 sm:py-2 text-sm sm:text-base`}
            >
              {favoriteLoading ? (
                <div className="w-4 h-4 border-2 border-pink-500/30 border-t-pink-500 rounded-full animate-spin mr-2" />
              ) : (
                <Heart size={16} className={`mr-2 ${isFavorite ? "fill-pink-400" : ""}`} />
              )}
              <span className="hidden xs:inline">{isFavorite ? "In Favorites" : "Add to Favorites"}</span>
              <span className="xs:hidden">{isFavorite ? "Saved" : "Save"}</span>
            </Button>
            
            <Button 
              onClick={handleShare}
              variant="outline" 
              className={`border w-full border-slate-700 ${shareSuccess ? 'border-teal-500/50 bg-teal-500/20' : 'hover:border-teal-500/50 bg-slate-800/50 hover:bg-teal-500/10'} text-slate-300 hover:text-teal-400 transition-all py-2 sm:py-2 text-sm sm:text-base`}
            >
              {shareSuccess ? <CheckCircle size={16} className="mr-2" /> : <Share2 size={16} className="mr-2" />}
              <span>{shareSuccess ? "Shared!" : "Share"}</span>
            </Button>
          </div>
        </div>

        {/* Report Content - Wrapped in ref for PDF export */}
        <div ref={reportRef} className="space-y-8">

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
        {/* End Report Content */}
      </div>
    </div>
  )
}
