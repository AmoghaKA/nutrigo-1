/**
 * Comparison Context Types & Constants
 * Manages state for product comparison feature
 */

export interface ScoreBreakdown {
  baseScore: number
  finalScore: number
  category: string
  penalties: {
    name: string
    amount: number
    reason: string
  }[]
  bonuses: {
    name: string
    amount: number
    reason: string
  }[]
  summary: string
}

export interface ComparisonProduct {
  id: string
  name: string
  brand: string
  healthScore: number
  scoreBreakdown?: ScoreBreakdown
  nutrition: {
    calories?: number
    sugar?: number
    protein?: number
    fat?: number
    carbs?: number
    sodium?: number
    fiber?: number
    serving_size?: number
  }
  ingredients: string[]
  warnings: string[]
  timestamp: string
  source?: string
}

export interface ComparisonState {
  firstProduct: ComparisonProduct | null
  secondProduct: ComparisonProduct | null
  isComparing: boolean
  isLoadingSecond: boolean
  error: string | null
  winner: "first" | "second" | null
}

export interface NutritionDiff {
  metric: string
  firstValue: number
  secondValue: number
  difference: number
  percentageDiff: number
  winner: "first" | "second" | "tie"
  unit: string
}

export interface ComparisonMetrics {
  healthScoreDiff: number
  healthScoreWinner: "first" | "second" | "tie"
  nutritionDiffs: NutritionDiff[]
}

export const COMPARISON_STORAGE_KEY = "nutrigo_comparison_state"
export const COMPARISON_FIRST_PRODUCT_KEY = "nutrigo_comparison_first_product"
export const COMPARISON_SECOND_PRODUCT_KEY = "nutrigo_comparison_second_product"

// Metrics configuration
export const NUTRITION_METRICS = [
  { key: "calories", label: "Calories", unit: "kcal", lowerIsBetter: true },
  { key: "sugar", label: "Sugar", unit: "g", lowerIsBetter: true },
  { key: "protein", label: "Protein", unit: "g", lowerIsBetter: false },
  { key: "fat", label: "Fat", unit: "g", lowerIsBetter: true },
  { key: "carbs", label: "Carbs", unit: "g", lowerIsBetter: false },
  { key: "sodium", label: "Sodium", unit: "mg", lowerIsBetter: true },
  { key: "fiber", label: "Fiber", unit: "g", lowerIsBetter: false },
]
