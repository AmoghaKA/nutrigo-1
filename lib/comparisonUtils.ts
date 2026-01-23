/**
 * Comparison Utilities
 * Helper functions for product comparison logic and calculations
 */

import {
  ComparisonProduct,
  NutritionDiff,
  ComparisonMetrics,
  NUTRITION_METRICS,
} from "./comparisonContext"

/**
 * Calculate differences between two products
 */
export const calculateComparison = (
  first: ComparisonProduct,
  second: ComparisonProduct
): ComparisonMetrics => {
  const healthScoreDiff = first.healthScore - second.healthScore
  const healthScoreWinner = healthScoreDiff > 0 ? "first" : healthScoreDiff < 0 ? "second" : "tie"

  const nutritionDiffs: NutritionDiff[] = NUTRITION_METRICS
    .filter((metric) => {
      const firstVal = first.nutrition[metric.key as keyof typeof first.nutrition]
      const secondVal = second.nutrition[metric.key as keyof typeof second.nutrition]
      return firstVal !== undefined && secondVal !== undefined
    })
    .map((metric) => {
      const firstValue =
        (first.nutrition[metric.key as keyof typeof first.nutrition] as number) || 0
      const secondValue =
        (second.nutrition[metric.key as keyof typeof second.nutrition] as number) || 0

      const difference = firstValue - secondValue
      const percentageDiff = secondValue !== 0 ? (difference / secondValue) * 100 : 0

      // Determine winner based on metric preference
      let winner: "first" | "second" | "tie" = "tie"
      if (difference !== 0) {
        if (metric.lowerIsBetter) {
          winner = difference < 0 ? "first" : "second"
        } else {
          winner = difference > 0 ? "first" : "second"
        }
      }

      return {
        metric: metric.label,
        firstValue,
        secondValue,
        difference: Math.abs(difference),
        percentageDiff: Math.abs(percentageDiff),
        winner,
        unit: metric.unit,
      }
    })

  return {
    healthScoreDiff: Math.abs(healthScoreDiff),
    healthScoreWinner,
    nutritionDiffs,
  }
}

/**
 * Determine overall winner based on health metrics
 */
export const determineWinner = (
  first: ComparisonProduct,
  second: ComparisonProduct
): "first" | "second" | "tie" => {
  const metrics = calculateComparison(first, second)

  if (metrics.healthScoreDiff === 0) {
    return "tie"
  }

  return metrics.healthScoreWinner
}

/**
 * Format percentage difference for display
 */
export const formatPercentageDiff = (percentage: number, decimals = 1): string => {
  return `${percentage.toFixed(decimals)}%`
}

/**
 * Get comparison rating text
 */
export const getComparisonRatingText = (diff: number, product: "first" | "second"): string => {
  if (diff === 0) return "Equivalent"
  if (diff < 5) return "Slightly better"
  if (diff < 15) return "Moderately better"
  if (diff < 30) return "Significantly better"
  return "Much better"
}

/**
 * Get color for difference indicators
 */
export const getDiffColor = (winner: "first" | "second" | "tie", comparing: "first" | "second") => {
  if (winner === "tie") return "text-slate-400 bg-slate-500/10 border-slate-500/30"
  if (winner === comparing) return "text-emerald-400 bg-emerald-500/10 border-emerald-500/30"
  return "text-red-400 bg-red-500/10 border-red-500/30"
}

/**
 * Get health score color based on score value
 */
export const getHealthScoreColor = (score: number): string => {
  if (score >= 70) return "from-emerald-400 via-teal-400 to-cyan-400"
  if (score >= 50) return "from-cyan-400 via-blue-400 to-purple-400"
  return "from-red-400 via-orange-400 to-yellow-400"
}

/**
 * Get health score background
 */
export const getHealthScoreBg = (score: number): string => {
  if (score >= 70) return "bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border-emerald-500/40"
  if (score >= 50) return "bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border-cyan-500/40"
  return "bg-gradient-to-br from-red-500/20 to-orange-500/20 border-red-500/40"
}

/**
 * Format nutrition value for display
 */
export const formatNutritionValue = (value: number, decimals = 1): string => {
  if (value === 0) return "—"
  if (value < 1) return value.toFixed(2)
  return value.toFixed(decimals)
}

/**
 * Check if products are from same category (basic check)
 */
export const isSameCategory = (first: ComparisonProduct, second: ComparisonProduct): boolean => {
  // Simple heuristic: products with similar calorie range are likely same category
  const calorieRatio =
    (first.nutrition.calories || 0) / (second.nutrition.calories || 1)
  return calorieRatio > 0.5 && calorieRatio < 2
}

/**
 * Generate comparison summary text
 */
export const generateComparisonSummary = (
  first: ComparisonProduct,
  second: ComparisonProduct
): string => {
  const metrics = calculateComparison(first, second)
  const winner = determineWinner(first, second)

  if (winner === "tie") {
    return "Both products have similar health scores. Choose based on taste preference!"
  }

  const winnerProduct = winner === "first" ? first : second
  const healthDiff = metrics.healthScoreDiff.toFixed(0)

  return `${winnerProduct.name} is the healthier choice with a ${healthDiff} point advantage.`
}

/**
 * Export comparison data for sharing
 */
export const generateComparisonShareText = (
  first: ComparisonProduct,
  second: ComparisonProduct
): string => {
  const summary = generateComparisonSummary(first, second)
  const winner = determineWinner(first, second)
  const winnerName = winner === "first" ? first.name : winner === "second" ? second.name : "Draw"

  return `
🥗 Product Comparison via NutriGo 🥗

${first.name} (Score: ${first.healthScore}/100)
vs
${second.name} (Score: ${second.healthScore}/100)

🏆 Winner: ${winnerName}

${summary}

Compare products yourself: ${typeof window !== "undefined" ? window.location.href : "NutriGo App"}
`.trim()
}
