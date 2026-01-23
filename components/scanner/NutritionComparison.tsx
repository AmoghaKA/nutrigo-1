"use client"

import React from "react"
import { Card } from "@/components/ui/card"
import { ArrowUp, ArrowDown, Minus } from "lucide-react"
import { ComparisonProduct, NutritionDiff, ComparisonMetrics } from "@/lib/comparisonContext"
import { getDiffColor, formatNutritionValue, formatPercentageDiff } from "@/lib/comparisonUtils"

interface NutritionComparisonProps {
  metrics: ComparisonMetrics
  firstProduct: ComparisonProduct
  secondProduct: ComparisonProduct
}

export default function NutritionComparison({
  metrics,
  firstProduct,
  secondProduct,
}: NutritionComparisonProps) {
  const renderDiffIndicator = (diff: NutritionDiff) => {
    if (diff.winner === "tie") {
      return (
        <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-slate-500/10 border border-slate-500/30">
          <Minus size={16} className="text-slate-400" />
          <span className="text-xs font-medium text-slate-400">Equal</span>
        </div>
      )
    }

    const isFirst = diff.winner === "first"
    return (
      <div
        className={`flex items-center gap-2 px-3 py-1 rounded-md border ${getDiffColor(diff.winner, "first")}`}
      >
        {isFirst ? (
          <ArrowDown size={16} className="text-emerald-400" />
        ) : (
          <ArrowUp size={16} className="text-red-400" />
        )}
        <span className="text-xs font-medium">
          {formatPercentageDiff(diff.percentageDiff)} {isFirst ? "better" : "worse"}
        </span>
      </div>
    )
  }

  return (
    <Card className="p-6 md:p-8 bg-gradient-to-br from-slate-900/90 via-slate-800/80 to-slate-900/90 border border-teal-500/20">
      <div className="space-y-6">
        {/* Title */}
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Nutrition Facts Breakdown
          </h2>
          <p className="text-slate-400 text-sm">
            Compare nutritional values side-by-side
          </p>
        </div>

        {/* Nutrition Metrics Grid */}
        <div className="space-y-4">
          {metrics.nutritionDiffs.map((diff, idx) => (
            <div
              key={idx}
              className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:border-slate-700 transition-all"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                {/* Metric Name */}
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-slate-300 mb-3">{diff.metric}</h4>

                  {/* Mobile: Stacked Values */}
                  <div className="md:hidden space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500">{firstProduct.name}</span>
                      <span className="text-lg font-bold text-emerald-400">
                        {formatNutritionValue(diff.firstValue)} {diff.unit}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500">{secondProduct.name}</span>
                      <span className="text-lg font-bold text-cyan-400">
                        {formatNutritionValue(diff.secondValue)} {diff.unit}
                      </span>
                    </div>
                  </div>

                  {/* Desktop: Side by Side */}
                  <div className="hidden md:grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">{firstProduct.name}</p>
                      <p className="text-lg font-bold text-emerald-400">
                        {formatNutritionValue(diff.firstValue)} {diff.unit}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">{secondProduct.name}</p>
                      <p className="text-lg font-bold text-cyan-400">
                        {formatNutritionValue(diff.secondValue)} {diff.unit}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Difference Badge */}
                <div className="flex-shrink-0">{renderDiffIndicator(diff)}</div>
              </div>

              {/* Visual Bar Comparison */}
              <div className="mt-4 space-y-2">
                <div className="h-2 rounded-full bg-slate-700/50 overflow-hidden flex">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-teal-500"
                    style={{
                      width: `${Math.min(
                        (diff.firstValue / Math.max(diff.firstValue, diff.secondValue)) * 100,
                        100
                      )}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          ))}

          {/* Empty State */}
          {metrics.nutritionDiffs.length === 0 && (
            <div className="p-8 rounded-lg bg-slate-800/30 border border-slate-700/30 text-center">
              <p className="text-slate-400 text-sm">
                Complete nutrition data not available for comparison
              </p>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
