"use client"

import React from "react"
import { Card } from "@/components/ui/card"
import { TrendingUp } from "lucide-react"
import { ComparisonProduct, ComparisonMetrics } from "@/lib/comparisonContext"
import {
  calculateComparison,
  getHealthScoreColor,
  getHealthScoreBg,
} from "@/lib/comparisonUtils"
import ScoreBreakdownCard from "./ScoreBreakdownCard"

interface HealthScoreComparisonProps {
  firstProduct: ComparisonProduct
  secondProduct: ComparisonProduct
  winner: "first" | "second" | "tie"
}

export default function HealthScoreComparison({
  firstProduct,
  secondProduct,
  winner,
}: HealthScoreComparisonProps) {
  const metrics = calculateComparison(firstProduct, secondProduct)
  const scoreGap = metrics.healthScoreDiff

  return (
    <div className="space-y-6">
      <Card className="p-8 bg-gradient-to-br from-slate-900/80 via-slate-800/60 to-slate-900/80 border border-slate-700/50 rounded-2xl shadow-2xl">
        <div className="space-y-8">
          {/* Title Section */}
          <div className="space-y-2 pb-6 border-b border-slate-700/30">
            <h2 className="text-3xl font-bold text-white">Health Score Comparison</h2>
            <p className="text-sm text-slate-400">Side-by-side health score analysis with detailed breakdown</p>
          </div>

          {/* Scores and VS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* First Product */}
            <div className="space-y-4 group">
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wide">{firstProduct.brand || firstProduct.name}</p>
              <div
                className={`p-8 rounded-2xl ${getHealthScoreBg(firstProduct.healthScore)} border-2 border-slate-700/50 flex items-center justify-center relative overflow-hidden hover:border-slate-600/80 transition-all`}
              >
                <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-white to-transparent group-hover:opacity-20 transition-opacity"></div>
                <div
                  className={`text-6xl font-black bg-gradient-to-r ${getHealthScoreColor(firstProduct.healthScore)} bg-clip-text text-transparent relative z-10`}
                >
                  {firstProduct.healthScore}
                </div>
              </div>
              {winner === "first" && (
                <div className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/20 border border-emerald-500/40">
                  <span className="text-lg">🏆</span>
                  <span className="text-sm font-bold text-emerald-300">Winner</span>
                </div>
              )}
            </div>

            {/* VS Badge */}
            <div className="flex items-center justify-center md:py-12">
              <div className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-500/40 shadow-lg">
                <span className="text-xl font-black text-white">VS</span>
              </div>
            </div>

            {/* Second Product */}
            <div className="space-y-4 group">
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wide">{secondProduct.brand || secondProduct.name}</p>
              <div
                className={`p-8 rounded-2xl ${getHealthScoreBg(secondProduct.healthScore)} border-2 border-slate-700/50 flex items-center justify-center relative overflow-hidden hover:border-slate-600/80 transition-all`}
              >
                <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-white to-transparent group-hover:opacity-20 transition-opacity"></div>
                <div
                  className={`text-6xl font-black bg-gradient-to-r ${getHealthScoreColor(secondProduct.healthScore)} bg-clip-text text-transparent relative z-10`}
                >
                  {secondProduct.healthScore}
                </div>
              </div>
              {winner === "second" && (
                <div className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/20 border border-cyan-500/40">
                  <span className="text-lg">🏆</span>
                  <span className="text-sm font-bold text-cyan-300">Winner</span>
                </div>
              )}
            </div>
          </div>

          {/* Point Difference - Enhanced */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-800/80 to-slate-900/80 border border-slate-700/50 text-center">
            <p className="text-xs text-slate-400 mb-2 uppercase font-bold tracking-wide">Point Difference</p>
            <p className={`text-5xl font-black mb-2 ${
              winner === "first"
                ? "bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent"
                : winner === "second"
                ? "bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent"
                : "text-slate-400"
            }`}>
              {Math.abs(scoreGap).toFixed(1)}
            </p>
            <p className="text-sm text-slate-400">
              {winner === "first" ? "🟢 First product is healthier" : winner === "second" ? "🔵 Second product is healthier" : "Equal scores"}
            </p>
          </div>
        </div>
      </Card>

      {/* Score Breakdown Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ScoreBreakdownCard product={firstProduct} isWinner={winner === "first"} />
        <ScoreBreakdownCard product={secondProduct} isWinner={winner === "second"} />
      </div>
    </div>
  )
}
