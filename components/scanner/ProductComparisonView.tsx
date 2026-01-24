"use client"

import React, { useState, useRef, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  ArrowLeft,
  Share2,
  Download,
  RotateCcw,
  Camera,
  Upload,
  X,
  AlertCircle,
  CheckCircle2,
  Trophy,
  Sparkles,
  ArrowRight,
} from "lucide-react"
import Link from "next/link"
import { ComparisonProduct } from "@/lib/comparisonContext"
import {
  calculateComparison,
  determineWinner,
  getHealthScoreColor,
  getHealthScoreBg,
  generateComparisonShareText,
  isSameCategory,
} from "@/lib/comparisonUtils"
import ComparisonCard from "./ComparisonCard"
import NutritionComparison from "./NutritionComparison"
import HealthScoreComparison from "./HealthScoreComparison"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"
import { useToast } from "@/hooks/use-toast"

interface ProductComparisonViewProps {
  firstProduct: ComparisonProduct
  secondProduct: ComparisonProduct
  onReset: () => void
  onBackToResult: () => void
  isLoadingSecond?: boolean
}

export default function ProductComparisonView({
  firstProduct,
  secondProduct,
  onReset,
  onBackToResult,
  isLoadingSecond = false,
}: ProductComparisonViewProps) {
  const { toast } = useToast()
  const comparisonRef = useRef<HTMLDivElement>(null)
  const [isDownloading, setIsDownloading] = useState(false)
  const [products, setProducts] = useState<{
    first: ComparisonProduct
    second: ComparisonProduct
  }>({
    first: firstProduct,
    second: secondProduct,
  })

  const metrics = calculateComparison(products.first, products.second)
  const winner = determineWinner(products.first, products.second)
  const isSameProductCategory = isSameCategory(products.first, products.second)

  const handleShare = async () => {
    const shareText = generateComparisonShareText(products.first, products.second)

    try {
      if (navigator.share) {
        await navigator.share({
          title: `${products.first.name} vs ${products.second.name}`,
          text: shareText,
          url: typeof window !== "undefined" ? window.location.href : "",
        })
      } else {
        await navigator.clipboard.writeText(shareText)
        toast({
          title: "Copied!",
          description: "Comparison copied to clipboard",
        })
      }
    } catch (error) {
      console.error("Share error:", error)
    }
  }

  const handleDownloadComparison = async () => {
    if (isDownloading) return
    setIsDownloading(true)

    try {
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      })

      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()
      const margin = 15
      const colWidth = (pageWidth - 3 * margin) / 2
      const contentWidth = colWidth - 8

      // Premium Color Palette
      const colors = {
        darkBlue: [25, 45, 85] as [number, number, number],
        emerald: [16, 185, 129] as [number, number, number],
        cyan: [34, 211, 238] as [number, number, number],
        white: [255, 255, 255] as [number, number, number],
        textDark: [20, 33, 61] as [number, number, number],
        textGray: [107, 114, 128] as [number, number, number],
        lightGray: [243, 244, 246] as [number, number, number],
        red: [239, 68, 68] as [number, number, number],
        green: [34, 197, 94] as [number, number, number],
        blue: [59, 130, 246] as [number, number, number],
        orange: [249, 115, 22] as [number, number, number],
      }

      let yPos = 0

      // ===== PREMIUM HEADER =====
      // Header gradient background
      pdf.setFillColor(...colors.darkBlue)
      pdf.rect(0, 0, pageWidth, 28, "F")
      
      // Accent line
      pdf.setFillColor(...colors.emerald)
      pdf.rect(0, 27, pageWidth, 2, "F")

      pdf.setFont("helvetica", "bold")
      pdf.setFontSize(22)
      pdf.setTextColor(...colors.white)
      pdf.text("✓ PRODUCT COMPARISON REPORT", margin, 18)

      pdf.setFont("helvetica", "normal")
      pdf.setFontSize(8)
      pdf.setTextColor(...colors.cyan)
      pdf.text(`Generated on ${new Date().toLocaleDateString()} • NutriGo Pro Analysis`, margin, 24)

      yPos = 32

      // ===== PRODUCT HEADERS WITH ICONS =====
      const col1X = margin
      const col2X = pageWidth / 2 + margin / 2

      const score1 = products.first.healthScore || 0
      const score2 = products.second.healthScore || 0
      const isBetter1 = score1 > score2
      const isBetter2 = score2 > score1

      // Product 1 Header - Premium
      pdf.setFillColor(...colors.emerald)
      pdf.rect(col1X, yPos, colWidth, 1.5, "F")
      pdf.setFillColor(245, 250, 250)
      pdf.rect(col1X, yPos + 1.5, colWidth, 11, "F")
      
      pdf.setFont("helvetica", "bold")
      pdf.setFontSize(14)
      pdf.setTextColor(...colors.darkBlue)
      pdf.text(isBetter1 ? "★ " + (products.first.brand || products.first.name) : products.first.brand || products.first.name, col1X + 3, yPos + 7)
      
      pdf.setFont("helvetica", "normal")
      pdf.setFontSize(7)
      pdf.setTextColor(...colors.textGray)
      pdf.text(`Product: ${products.first.name}`, col1X + 3, yPos + 10.5)

      // Product 2 Header - Premium
      pdf.setFillColor(...colors.emerald)
      pdf.rect(col2X, yPos, colWidth, 1.5, "F")
      pdf.setFillColor(245, 250, 250)
      pdf.rect(col2X, yPos + 1.5, colWidth, 11, "F")
      
      pdf.setFont("helvetica", "bold")
      pdf.setFontSize(14)
      pdf.setTextColor(...colors.darkBlue)
      pdf.text(isBetter2 ? "★ " + (products.second.brand || products.second.name) : products.second.brand || products.second.name, col2X + 3, yPos + 7)
      
      pdf.setFont("helvetica", "normal")
      pdf.setFontSize(7)
      pdf.setTextColor(...colors.textGray)
      pdf.text(`Product: ${products.second.name}`, col2X + 3, yPos + 10.5)

      yPos += 15

      // ===== HEALTH SCORE - PREMIUM DISPLAY =====
      pdf.setFont("helvetica", "bold")
      pdf.setFontSize(10)
      pdf.setTextColor(...colors.darkBlue)
      pdf.text("HEALTH SCORE ANALYSIS", col1X + 2, yPos - 1)
      pdf.text("HEALTH SCORE ANALYSIS", col2X + 2, yPos - 1)

      yPos += 3

      const score1Color = score1 >= 70 ? colors.green : score1 >= 50 ? colors.blue : colors.red
      const score2Color = score2 >= 70 ? colors.green : score2 >= 50 ? colors.blue : colors.red

      // Score 1 - Beautiful box
      pdf.setFillColor(255, 255, 255)
      pdf.setDrawColor(...colors.textGray)
      pdf.setLineWidth(0.5)
      pdf.rect(col1X + 5, yPos, colWidth - 10, 16, "FD")
      
      pdf.setFillColor(...score1Color)
      pdf.rect(col1X + 7, yPos + 2, colWidth - 14, 12, "F")
      
      pdf.setFont("helvetica", "bold")
      pdf.setFontSize(36)
      pdf.setTextColor(...colors.white)
      pdf.text(`${score1}`, col1X + colWidth / 2 - 1, yPos + 11, { align: "center" })

      // Score label
      pdf.setFont("helvetica", "normal")
      pdf.setFontSize(8)
      pdf.setTextColor(...score1Color)
      const label1 = score1 >= 70 ? "EXCELLENT" : score1 >= 50 ? "MODERATE" : "NEEDS CARE"
      pdf.text(label1, col1X + colWidth / 2 - 1, yPos + 15.5, { align: "center" })

      // Score 2 - Beautiful box
      pdf.setFillColor(255, 255, 255)
      pdf.setDrawColor(...colors.textGray)
      pdf.setLineWidth(0.5)
      pdf.rect(col2X + 5, yPos, colWidth - 10, 16, "FD")
      
      pdf.setFillColor(...score2Color)
      pdf.rect(col2X + 7, yPos + 2, colWidth - 14, 12, "F")
      
      pdf.setFont("helvetica", "bold")
      pdf.setFontSize(36)
      pdf.setTextColor(...colors.white)
      pdf.text(`${score2}`, col2X + colWidth / 2 - 1, yPos + 11, { align: "center" })

      // Score label
      pdf.setFont("helvetica", "normal")
      pdf.setFontSize(8)
      pdf.setTextColor(...score2Color)
      const label2 = score2 >= 70 ? "EXCELLENT" : score2 >= 50 ? "MODERATE" : "NEEDS CARE"
      pdf.text(label2, col2X + colWidth / 2 - 1, yPos + 15.5, { align: "center" })

      yPos += 19

      // Separator
      pdf.setDrawColor(...colors.lightGray)
      pdf.setLineWidth(0.3)
      pdf.line(col1X, yPos, col1X + colWidth, yPos)
      pdf.line(col2X, yPos, col2X + colWidth, yPos)
      yPos += 2

      // ===== NUTRITION FACTS - BEAUTIFUL TABLE =====
      pdf.setFont("helvetica", "bold")
      pdf.setFontSize(9)
      pdf.setTextColor(...colors.white)
      pdf.setFillColor(...colors.darkBlue)
      pdf.rect(col1X, yPos, colWidth, 6, "F")
      pdf.text("🥗 NUTRITION FACTS", col1X + 3, yPos + 4)

      pdf.setFillColor(...colors.darkBlue)
      pdf.rect(col2X, yPos, colWidth, 6, "F")
      pdf.text("🥗 NUTRITION FACTS", col2X + 3, yPos + 4)

      yPos += 7

      const nutritionItems = [
        { label: "Calories", key: "calories", unit: "kcal", icon: "🔥" },
        { label: "Sugar", key: "sugar", unit: "g", icon: "🍬" },
        { label: "Protein", key: "protein", unit: "g", icon: "💪" },
        { label: "Fat", key: "fat", unit: "g", icon: "🥑" },
        { label: "Carbs", key: "carbs", unit: "g", icon: "🌾" },
      ]

      pdf.setFont("helvetica", "normal")
      pdf.setFontSize(8)

      nutritionItems.forEach((item, idx) => {
        if (yPos > pageHeight - 50) {
          pdf.addPage()
          yPos = margin
        }

        // Alternating background
        if (idx % 2 === 0) {
          pdf.setFillColor(250, 250, 250)
          pdf.rect(col1X, yPos - 1.5, colWidth, 5, "F")
          pdf.rect(col2X, yPos - 1.5, colWidth, 5, "F")
        }

        pdf.setTextColor(...colors.orange)
        pdf.setFont("helvetica", "bold")
        pdf.text(item.label, col1X + 2, yPos + 1.5)
        pdf.text(item.label, col2X + 2, yPos + 1.5)

        pdf.setTextColor(...colors.darkBlue)
        pdf.setFont("helvetica", "bold")
        
        const val1 = (products.first as any)[item.key] ?? 0
        const val2 = (products.second as any)[item.key] ?? 0
        
        pdf.text(`${val1} ${item.unit}`, col1X + colWidth - 3, yPos + 1.5, { align: "right" })
        pdf.text(`${val2} ${item.unit}`, col2X + colWidth - 3, yPos + 1.5, { align: "right" })

        yPos += 5
      })

      yPos += 2

      // ===== INGREDIENTS =====
      if (yPos > pageHeight - 45) {
        pdf.addPage()
        yPos = margin
      }

      pdf.setFont("helvetica", "bold")
      pdf.setFontSize(9)
      pdf.setTextColor(...colors.white)
      pdf.setFillColor(100, 116, 139)
      pdf.rect(col1X, yPos, colWidth, 6, "F")
      pdf.text("📝 KEY INGREDIENTS", col1X + 3, yPos + 4)

      pdf.setFillColor(100, 116, 139)
      pdf.rect(col2X, yPos, colWidth, 6, "F")
      pdf.text("📝 KEY INGREDIENTS", col2X + 3, yPos + 4)

      yPos += 8

      pdf.setFont("helvetica", "normal")
      pdf.setFontSize(7)
      pdf.setTextColor(...colors.textDark)

      const ingredients1 = (products.first.ingredients || []).slice(0, 4)
      const ingredients2 = (products.second.ingredients || []).slice(0, 4)

      const maxIngredients = Math.max(ingredients1.length, ingredients2.length)
      for (let i = 0; i < maxIngredients; i++) {
        if (yPos > pageHeight - 20) {
          pdf.addPage()
          yPos = margin
        }

        const ing1 = ingredients1[i]
        const ing2 = ingredients2[i]
        let lines1Len = 0

        if (ing1) {
          const lines1 = pdf.splitTextToSize(`• ${ing1}`, contentWidth)
          lines1Len = lines1.length
          pdf.setTextColor(...colors.emerald)
          pdf.text(lines1, col1X + 2, yPos)
          yPos += lines1.length * 2.8
        }

        if (ing2) {
          const lines2 = pdf.splitTextToSize(`• ${ing2}`, contentWidth)
          yPos -= ing1 ? lines1Len * 2.8 : 0
          pdf.setTextColor(...colors.emerald)
          pdf.text(lines2, col2X + 2, yPos)
          yPos += lines2.length * 2.8
        }

        if (!ing1 && !ing2) break
      }

      yPos += 2

      // ===== ALERTS & WARNINGS =====
      if (yPos > pageHeight - 40) {
        pdf.addPage()
        yPos = margin
      }

      pdf.setFont("helvetica", "bold")
      pdf.setFontSize(9)
      pdf.setTextColor(...colors.white)
      pdf.setFillColor(220, 38, 38)
      pdf.rect(col1X, yPos, colWidth, 6, "F")
      pdf.text("⚠️ ALERTS & WARNINGS", col1X + 3, yPos + 4)

      pdf.setFillColor(220, 38, 38)
      pdf.rect(col2X, yPos, colWidth, 6, "F")
      pdf.text("⚠️ ALERTS & WARNINGS", col2X + 3, yPos + 4)

      yPos += 8

      pdf.setFont("helvetica", "normal")
      pdf.setFontSize(7)

      const warnings1 = products.first.warnings || []
      const warnings2 = products.second.warnings || []
      const maxWarnings = Math.max(warnings1.length, warnings2.length)

      for (let i = 0; i < Math.min(maxWarnings, 4); i++) {
        if (yPos > pageHeight - 12) {
          pdf.addPage()
          yPos = margin
        }

        const warn1 = warnings1[i] || ""
        const warn2 = warnings2[i] || ""
        let lines1Len = 0

        if (warn1) {
          pdf.setTextColor(220, 38, 38)
          const lines1 = pdf.splitTextToSize(`• ${warn1}`, contentWidth - 4)
          lines1Len = lines1.length
          pdf.text(lines1, col1X + 2, yPos)
          yPos += lines1.length * 2.8
        } else {
          pdf.setTextColor(34, 197, 94)
          pdf.text("✓ All Clear - No Warnings", col1X + 2, yPos)
          yPos += 3
          lines1Len = 1
        }

        yPos -= lines1Len * 2.8

        if (warn2) {
          pdf.setTextColor(220, 38, 38)
          const lines2 = pdf.splitTextToSize(`• ${warn2}`, contentWidth - 4)
          pdf.text(lines2, col2X + 2, yPos)
          yPos += lines2.length * 2.8
        } else {
          pdf.setTextColor(34, 197, 94)
          pdf.text("✓ All Clear - No Warnings", col2X + 2, yPos)
          yPos += 3
        }
      }

      // ===== PREMIUM FOOTER =====
      pdf.setDrawColor(...colors.lightGray)
      pdf.setLineWidth(0.5)
      pdf.line(margin, pageHeight - 10, pageWidth - margin, pageHeight - 10)

      pdf.setFont("helvetica", "normal")
      pdf.setFontSize(7)
      pdf.setTextColor(...colors.textGray)
      pdf.text(
        `NutriGo Premium Comparison • ${new Date().toLocaleString()} • Smart Nutrition Analysis`,
        pageWidth / 2,
        pageHeight - 5,
        { align: "center" }
      )

      pdf.save(
        `${products.first.brand || products.first.name}-vs-${products.second.brand || products.second.name}-comparison.pdf`
      )

      toast({
        title: "🎉 Downloaded!",
        description: "Professional comparison report ready to share",
      })
    } catch (error) {
      console.error("Download error:", error)
      toast({
        title: "Error",
        description: "Failed to download comparison",
        variant: "destructive",
      })
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
        {/* Gradient orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/25 rounded-full blur-3xl opacity-40"></div>
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-teal-500/20 rounded-full blur-3xl opacity-40"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl opacity-30"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <Button
              onClick={onBackToResult}
              variant="ghost"
              className="gap-2 text-slate-400 hover:text-white hover:bg-slate-800 transition-all px-2 sm:px-4"
            >
              <ArrowLeft size={20} />
              <span className="hidden sm:inline">Back to Scanner</span>
              <span className="sm:hidden">Back</span>
            </Button>
          </div>

          {/* Action Buttons - Responsive Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
            <Button
              onClick={handleShare}
              variant="outline"
              className="border w-full border-slate-700 hover:border-teal-500/50 bg-slate-800/50 hover:bg-teal-500/10 text-slate-300 hover:text-teal-400 transition-all py-2 sm:py-2 text-sm sm:text-base"
            >
              <Share2 size={16} className="mr-2" />
              <span className="hidden xs:inline">Share</span>
              <span className="xs:hidden">Share</span>
            </Button>

            <Button
              onClick={handleDownloadComparison}
              disabled={isDownloading || isLoadingSecond}
              variant="outline"
              className={`border w-full ${isDownloading ? 'border-violet-500/50 bg-violet-500/20' : 'border-slate-700 hover:border-violet-500/50 bg-slate-800/50 hover:bg-violet-500/10'} text-slate-300 hover:text-violet-400 transition-all py-2 sm:py-2 text-sm sm:text-base`}
            >
              {isDownloading ? (
                <div className="w-4 h-4 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin mr-2" />
              ) : (
                <Download size={16} className="mr-2" />
              )}
              <span className="hidden xs:inline">{isDownloading ? "Generating..." : "Download"}</span>
              <span className="xs:hidden">Download</span>
            </Button>

            <Button
              onClick={onReset}
              disabled={isLoadingSecond}
              variant="outline"
              className="border w-full border-slate-700 hover:border-red-500/50 bg-slate-800/50 hover:bg-red-500/10 text-slate-300 hover:text-red-400 transition-all py-2 sm:py-2 text-sm sm:text-base"
            >
              <RotateCcw size={16} className="mr-2" />
              <span className="hidden xs:inline">Reset</span>
              <span className="xs:hidden">Reset</span>
            </Button>
          </div>
        </div>

        {/* Warning if different categories */}
        {!isSameProductCategory && (
          <Card className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle size={16} className="text-yellow-400 shrink-0 mt-0.5" />
              <p className="text-xs text-yellow-200">
                Different categories. Comparison may be less meaningful.
              </p>
            </div>
          </Card>
        )}

        {/* Main Comparison Content */}
        <div ref={comparisonRef} className="space-y-4 p-4 sm:p-6 bg-slate-900/50 rounded-lg border border-slate-700/30">
          {/* Health Score Comparison */}
          <HealthScoreComparison
            firstProduct={products.first}
            secondProduct={products.second}
            winner={winner}
          />

          {/* Side-by-Side Comparison Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ComparisonCard
              product={products.first}
              isWinner={winner === "first"}
              position="first"
              isLoading={false}
            />

            {isLoadingSecond ? (
              <Card className="p-4 bg-slate-800 border border-slate-700 rounded-lg flex items-center justify-center min-h-[300px]">
                <div className="text-center">
                  <div className="w-8 h-8 rounded-full border-3 border-slate-700 border-t-emerald-500 animate-spin mx-auto mb-2"></div>
                  <p className="text-xs text-slate-400">Analyzing...</p>
                </div>
              </Card>
            ) : (
              <ComparisonCard
                product={products.second}
                isWinner={winner === "second"}
                position="second"
                isLoading={false}
              />
            )}
          </div>

          {/* Nutrition Comparison */}
          <NutritionComparison
            metrics={metrics}
            firstProduct={products.first}
            secondProduct={products.second}
          />

          {/* Winner Badge - Advanced Design */}
          {winner !== "tie" && (
            <Card className="p-6 bg-gradient-to-br from-emerald-500/10 via-slate-800/50 to-slate-900/50 border border-emerald-500/40 hover:border-emerald-500/60 transition-all duration-300">
              <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="w-12 h-12 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
                    <Trophy size={24} className="text-emerald-400" />
                  </div>
                  <div className="hidden md:block h-12 w-px bg-gradient-to-b from-emerald-500/0 via-emerald-500/40 to-emerald-500/0"></div>
                </div>
                <div className="flex-1">
                  <div className="flex items-baseline gap-2 mb-1">
                    <h3 className="text-lg font-bold text-emerald-400">Healthier Choice</h3>
                    <span className="text-xs font-semibold px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Winner</span>
                  </div>
                  <p className="text-sm text-slate-300">
                    <span className="font-semibold text-emerald-300">{winner === "first" ? products.first.brand || products.first.name : products.second.brand || products.second.name}</span>
                    {" "}has a <span className="font-bold text-emerald-400">{metrics.healthScoreDiff.toFixed(0)} point</span> advantage in overall health score
                  </p>
                </div>
              </div>
            </Card>
          )}

          {/* Warnings Comparison - Advanced Layout */}
          <div className="space-y-3 md:space-y-0 md:grid md:grid-cols-2 md:gap-4">
            <Card className="p-6 bg-gradient-to-br from-slate-800/80 via-slate-800/50 to-slate-900/50 border border-slate-700/50 hover:border-slate-600 transition-all duration-300">
              {/* Product name label - visible only on mobile */}
              <p className="text-xs font-semibold text-slate-400 mb-2 md:hidden uppercase tracking-wider">
                Product 1: {products.first.brand || 'Unknown Brand'}
              </p>
              <h3 className="text-base font-bold text-white mb-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-md bg-red-500/20 border border-red-500/30 flex items-center justify-center flex-shrink-0">
                  <AlertCircle size={16} className="text-red-400" />
                </div>
                <span>Alerts & Warnings</span>
              </h3>
              <div className="space-y-2">
                {products.first.warnings.length > 0 ? (
                  products.first.warnings.slice(0, 3).map((warning, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-2 rounded-md bg-slate-900/30 border border-slate-700/30">
                      <span className="text-red-400 font-bold flex-shrink-0 mt-0.5">!</span>
                      <span className="text-sm text-slate-300">{warning}</span>
                    </div>
                  ))
                ) : (
                  <div className="p-3 rounded-md bg-emerald-500/10 border border-emerald-500/20">
                    <p className="text-emerald-300 flex items-center gap-2 text-sm font-medium">
                      <CheckCircle2 size={14} className="text-emerald-400" />
                      Clean & Safe
                    </p>
                  </div>
                )}
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-slate-800/80 via-slate-800/50 to-slate-900/50 border border-slate-700/50 hover:border-slate-600 transition-all duration-300">
              {/* Product name label - visible only on mobile */}
              <p className="text-xs font-semibold text-slate-400 mb-2 md:hidden uppercase tracking-wider">
                Product 2: {products.second.brand || 'Unknown Brand'}
              </p>
              <h3 className="text-base font-bold text-white mb-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-md bg-red-500/20 border border-red-500/30 flex items-center justify-center flex-shrink-0">
                  <AlertCircle size={16} className="text-red-400" />
                </div>
                <span>Alerts & Warnings</span>
              </h3>
              <div className="space-y-2">
                {products.second.warnings.length > 0 ? (
                  products.second.warnings.slice(0, 3).map((warning, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-2 rounded-md bg-slate-900/30 border border-slate-700/30">
                      <span className="text-red-400 font-bold flex-shrink-0 mt-0.5">!</span>
                      <span className="text-sm text-slate-300">{warning}</span>
                    </div>
                  ))
                ) : (
                  <div className="p-3 rounded-md bg-emerald-500/10 border border-emerald-500/20">
                    <p className="text-emerald-300 flex items-center gap-2 text-sm font-medium">
                      <CheckCircle2 size={14} className="text-emerald-400" />
                      Clean & Safe
                    </p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>

        {/* CTA Section - Advanced Design */}
        <div className="p-6 sm:p-8 rounded-xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/5 via-slate-800/50 to-slate-900/50 hover:border-emerald-500/50 transition-all duration-300">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
            <div>
              <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                <Sparkles size={18} className="text-emerald-400" />
                Find Healthier Alternatives
              </h3>
              <p className="text-sm text-slate-400">Discover better packaged food options</p>
            </div>
            <Link href="/dashboard/alternatives">
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold whitespace-nowrap transition-all duration-200 flex items-center gap-2">
                Explore Now
                <ArrowRight size={16} />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
