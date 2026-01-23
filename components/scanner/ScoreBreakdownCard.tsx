"use client"

import React from "react"
import { Card } from "@/components/ui/card"
import { ChevronDown, ChevronUp } from "lucide-react"
import { ScoreBreakdown } from "@/lib/comparisonContext"

interface ScoreBreakdownCardProps {
  product: {
    name: string
    brand: string
    healthScore: number
    scoreBreakdown?: ScoreBreakdown
  }
  isWinner: boolean
}

export default function ScoreBreakdownCard({
  product,
  isWinner,
}: ScoreBreakdownCardProps) {
  const [isExpanded, setIsExpanded] = React.useState(false)
  const breakdown = product.scoreBreakdown

  if (!breakdown) {
    return null
  }

  const totalPenalties = breakdown.penalties.reduce((sum, p) => sum + p.amount, 0)
  const totalBonuses = breakdown.bonuses.reduce((sum, b) => sum + b.amount, 0)

  return (
    <Card className="p-4 bg-gradient-to-br from-slate-800/60 via-slate-800/40 to-slate-900/60 border border-slate-700/40 rounded-xl">
      <div
        className="cursor-pointer flex items-center justify-between"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex-1">
          <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
            Score Calculation Breakdown
            <span className="text-xs px-2 py-1 rounded-full bg-slate-700/50 text-slate-300">
              {breakdown.category.replace(/_/g, " ")}
            </span>
          </h3>
          <p className="text-xs text-slate-400">{breakdown.summary}</p>
        </div>
        {isExpanded ? (
          <ChevronUp size={16} className="text-slate-400 flex-shrink-0 ml-2" />
        ) : (
          <ChevronDown size={16} className="text-slate-400 flex-shrink-0 ml-2" />
        )}
      </div>

      {isExpanded && (
        <div className="mt-4 space-y-3 pt-4 border-t border-slate-700/30">
          {/* Base and Final Scores */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 rounded-lg bg-slate-900/50 border border-slate-700/30">
              <p className="text-slate-400 mb-1">Base Score</p>
              <p className="text-lg font-bold text-white">{breakdown.baseScore}</p>
            </div>
            <div className="p-2 rounded-lg bg-slate-900/50 border border-slate-700/30">
              <p className="text-slate-400 mb-1">Final Score</p>
              <p className="text-lg font-bold text-emerald-400">{breakdown.finalScore}</p>
            </div>
          </div>

          {/* Penalties Section */}
          {breakdown.penalties.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-red-300 uppercase tracking-wider">
                  Penalties
                </h4>
                <span className="text-xs font-bold text-red-400">-{totalPenalties}</span>
              </div>
              <div className="space-y-1">
                {breakdown.penalties.map((penalty, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 flex items-between justify-between gap-2"
                  >
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-red-300">{penalty.name}</p>
                      <p className="text-xs text-slate-400">{penalty.reason}</p>
                    </div>
                    <span className="text-xs font-bold text-red-400 flex-shrink-0">-{penalty.amount}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bonuses Section */}
          {breakdown.bonuses.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                  Bonuses
                </h4>
                <span className="text-xs font-bold text-emerald-400">+{totalBonuses}</span>
              </div>
              <div className="space-y-1">
                {breakdown.bonuses.map((bonus, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-between justify-between gap-2"
                  >
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-emerald-300">{bonus.name}</p>
                      <p className="text-xs text-slate-400">{bonus.reason}</p>
                    </div>
                    <span className="text-xs font-bold text-emerald-400 flex-shrink-0">+{bonus.amount}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Calculation Summary */}
          <div className="p-2 rounded-lg bg-slate-900/50 border border-slate-700/30 text-xs">
            <p className="text-slate-400 mb-1">Calculation</p>
            <p className="text-slate-300">
              {breakdown.baseScore} - {totalPenalties} + {totalBonuses} = <span className="font-bold text-emerald-400">{breakdown.finalScore}</span>
            </p>
          </div>
        </div>
      )}
    </Card>
  )
}
