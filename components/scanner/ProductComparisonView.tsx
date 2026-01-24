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
    if (isDownloading || !comparisonRef.current) return
    setIsDownloading(true)

    try {
      const canvas = await html2canvas(comparisonRef.current, {
        backgroundColor: "#0f172a",
        scale: 2,
        logging: false,
      })

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      })

      const imgData = canvas.toDataURL("image/png")
      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()
      const margin = 10
      const imgWidth = pageWidth - 2 * margin
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      let yPosition = margin
      let remaining = imgHeight

      pdf.addImage(imgData, "PNG", margin, yPosition, imgWidth, imgHeight)

      while (remaining > pageHeight - 2 * margin) {
        remaining -= pageHeight - 2 * margin
        pdf.addPage()
        pdf.addImage(
          imgData,
          "PNG",
          margin,
          -remaining + imgHeight + margin,
          imgWidth,
          imgHeight
        )
      }

      pdf.save(
        `${products.first.name}-vs-${products.second.name}-comparison.pdf`
      )

      toast({
        title: "Downloaded!",
        description: "Comparison saved as PDF",
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
