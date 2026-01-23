// ============================================
// NutriGo Health Score Calculator v3
// ============================================
// Author: NutriGo AI Core
// Purpose: Advanced, category-based nutrition health scoring logic.
// Works seamlessly with productDataHandler.ts and scan.controller.ts
// ============================================

export type FoodCategory =
  | 'beverage'
  | 'snack'
  | 'dairy'
  | 'packaged_food'
  | 'breakfast_cereal'
  | 'frozen_food'
  | 'condiment'
  | 'dessert'

export interface NutritionData {
  name?: string
  brand?: string
  barcode?: string
  calories: number
  sugar: number
  protein: number
  fat: number
  saturatedFat?: number
  transFat?: number
  sodium: number
  fiber?: number
  carbs: number
  servingSize: number
  category: FoodCategory
  addedSugar?: number
  ingredients?: string[]
  warnings?: string[]
}

// ============================================
// SCORING BREAKDOWN INTERFACE
// ============================================

export interface ScoreBreakdown {
  baseScore: number
  finalScore: number
  category: FoodCategory
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

// ============================================
// MAIN ENTRY: calculateHealthScore()
// ============================================

export function calculateHealthScore(data: NutritionData): number {
  const breakdown = calculateHealthScoreWithBreakdown(data)
  return breakdown.finalScore
}

// ============================================
// ADVANCED ENTRY: calculateHealthScoreWithBreakdown()
// Returns detailed breakdown of scoring
// ============================================

export function calculateHealthScoreWithBreakdown(
  data: NutritionData
): ScoreBreakdown {
  const category = data.category
  const normalized = normalizeData(data)

  let breakdown: ScoreBreakdown

  // Select scoring logic by category
  switch (category) {
    case 'beverage':
      breakdown = calculateBeverageScoreWithBreakdown(normalized)
      break
    case 'snack':
      breakdown = calculateSnackScoreWithBreakdown(normalized)
      break
    case 'dairy':
      breakdown = calculateDairyScoreWithBreakdown(normalized)
      break
    case 'packaged_food':
      breakdown = calculatePackagedFoodScoreWithBreakdown(normalized)
      break
    case 'breakfast_cereal':
      breakdown = calculateCerealScoreWithBreakdown(normalized)
      break
    case 'frozen_food':
      breakdown = calculateFrozenFoodScoreWithBreakdown(normalized)
      break
    case 'condiment':
      breakdown = calculateCondimentScoreWithBreakdown(normalized)
      break
    case 'dessert':
      breakdown = calculateDessertScoreWithBreakdown(normalized)
      break
    default:
      breakdown = calculateGeneralScoreWithBreakdown(normalized)
  }

  // Generate summary
  breakdown.summary = generateScoreSummary(breakdown)

  return breakdown
}

// ============================================
// NORMALIZATION
// Ensures consistent units (mg, g, kcal)
// ============================================

function normalizeData(data: NutritionData): NutritionData {
  return {
    ...data,
    calories: data.calories || 0,
    sugar: data.sugar || 0,
    protein: data.protein || 0,
    fat: data.fat || 0,
    saturatedFat: data.saturatedFat || 0,
    transFat: data.transFat || 0,
    sodium: data.sodium || 0, // should already be mg
    fiber: data.fiber || 0,
    carbs: data.carbs || 0,
    servingSize: data.servingSize || 100,
  }
}

// ============================================
// SCORING HELPERS
// ============================================

function clampScore(s: number): number {
  return Math.max(0, Math.min(100, Math.round(s)))
}

function applyBonus(s: number, amount: number): number {
  return clampScore(s + amount)
}

function applyPenalty(s: number, amount: number): number {
  return clampScore(s - amount)
}

// ============================================
// BEVERAGE SCORING
// ============================================

function calculateBeverageScore(d: NutritionData): number {
  let s = 100

  const sugarPer100ml = (d.sugar / d.servingSize) * 100
  const caloriesPer100ml = (d.calories / d.servingSize) * 100

  // Sugar penalties
  if (sugarPer100ml > 15) s -= 50
  else if (sugarPer100ml > 10) s -= 35
  else if (sugarPer100ml > 5) s -= 20
  else if (sugarPer100ml > 2) s -= 10

  // Calories
  if (caloriesPer100ml > 60) s -= 20
  else if (caloriesPer100ml > 40) s -= 10

  // Sodium (per 100ml)
  if (d.sodium > 100) s -= 10

  // Protein bonus (milk drinks)
  if (d.protein > 5) s += 10
  else if (d.protein > 3) s += 5

  // Artificial sweetener suspicion
  if (d.addedSugar === 0 && d.calories > 5) s -= 5

  return clampScore(s)
}

// ============================================
// SNACK SCORING
// ============================================

function calculateSnackScore(d: NutritionData): number {
  let s = 100

  // Calories per serving
  if (d.calories > 300) s -= 25
  else if (d.calories > 200) s -= 15
  else if (d.calories > 150) s -= 8

  // Fat penalty
  if (d.fat > 20) s -= 20
  else if (d.fat > 15) s -= 12
  else if (d.fat > 10) s -= 6

  // Saturated + Trans fats
  if (d.saturatedFat && d.saturatedFat > 5) s -= 10
  if (d.transFat && d.transFat > 0) s -= 20

  // Sugar
  if (d.sugar > 15) s -= 20
  else if (d.sugar > 10) s -= 12
  else if (d.sugar > 5) s -= 6

  // Sodium (mg)
  if (d.sodium > 600) s -= 15
  else if (d.sodium > 400) s -= 10
  else if (d.sodium > 200) s -= 6

  // Protein & Fiber bonuses
  if (d.protein > 8) s += 10
  else if (d.protein > 5) s += 5

  if (d.fiber && d.fiber > 4) s += 10

  return clampScore(s)
}

// ============================================
// DAIRY SCORING
// ============================================

function calculateDairyScore(d: NutritionData): number {
  let s = 100

  // Sugar (per 100g)
  if (d.sugar > 20) s -= 30
  else if (d.sugar > 12) s -= 18
  else if (d.sugar > 8) s -= 10

  // Fat
  if (d.fat > 10) s -= 12
  else if (d.fat < 1) s -= 5

  // Saturated fat
  if (d.saturatedFat && d.saturatedFat > 8) s -= 15

  // Protein bonus
  if (d.protein > 15) s += 20
  else if (d.protein > 10) s += 15
  else if (d.protein > 6) s += 10
  else if (d.protein < 3) s -= 10

  // Sodium
  if (d.sodium > 200) s -= 10

  return clampScore(s)
}

// ============================================
// PACKAGED FOOD SCORING
// ============================================

function calculatePackagedFoodScore(d: NutritionData): number {
  let s = 100

  if (d.calories > 400) s -= 25
  else if (d.calories > 300) s -= 15

  if (d.sodium > 800) s -= 25
  else if (d.sodium > 500) s -= 15

  if (d.fat > 25) s -= 20
  if (d.saturatedFat && d.saturatedFat > 8) s -= 10
  if (d.transFat && d.transFat > 0) s -= 25

  if (d.sugar > 12) s -= 18
  else if (d.sugar > 8) s -= 10

  if (d.protein > 15) s += 10
  if (d.fiber && d.fiber > 6) s += 10

  return clampScore(s)
}

// ============================================
// BREAKFAST CEREAL SCORING
// ============================================

function calculateCerealScore(d: NutritionData): number {
  let s = 100

  // Sugar
  if (d.sugar > 15) s -= 40
  else if (d.sugar > 10) s -= 25
  else if (d.sugar > 6) s -= 15
  else if (d.sugar > 3) s -= 8

  // Fiber
  if (d.fiber && d.fiber > 8) s += 20
  else if (d.fiber && d.fiber > 5) s += 15
  else if (d.fiber && d.fiber > 3) s += 10
  else if (d.fiber && d.fiber < 2) s -= 10

  // Protein
  if (d.protein > 8) s += 15
  else if (d.protein > 5) s += 10

  // Sodium
  if (d.sodium > 300) s -= 15
  else if (d.sodium > 200) s -= 8

  return clampScore(s)
}

// ============================================
// FROZEN FOOD SCORING
// ============================================

function calculateFrozenFoodScore(d: NutritionData): number {
  let s = 100

  if (d.sodium > 1000) s -= 35
  else if (d.sodium > 700) s -= 25
  else if (d.sodium > 500) s -= 15

  if (d.calories > 500) s -= 20
  else if (d.calories > 350) s -= 12

  if (d.fat > 25) s -= 18
  if (d.saturatedFat && d.saturatedFat > 10) s -= 15
  if (d.sugar > 10) s -= 15

  if (d.protein > 20) s += 15
  else if (d.protein > 12) s += 10

  if (d.fiber && d.fiber > 5) s += 10

  return clampScore(s)
}

// ============================================
// CONDIMENT SCORING
// ============================================

function calculateCondimentScore(d: NutritionData): number {
  let s = 100

  if (d.sodium > 1000) s -= 35
  else if (d.sodium > 600) s -= 25
  else if (d.sodium > 400) s -= 15

  if (d.sugar > 10) s -= 25
  else if (d.sugar > 5) s -= 15
  else if (d.sugar > 2) s -= 8

  if (d.calories > 100) s -= 10
  if (d.fat > 15) s -= 10

  return clampScore(s)
}

// ============================================
// DESSERT SCORING
// ============================================

function calculateDessertScore(d: NutritionData): number {
  let s = 70

  if (d.sugar > 30) s -= 30
  else if (d.sugar > 20) s -= 20
  else if (d.sugar > 15) s -= 12

  if (d.calories > 400) s -= 20
  else if (d.calories > 300) s -= 12

  if (d.fat > 20) s -= 15
  if (d.saturatedFat && d.saturatedFat > 12) s -= 15
  if (d.transFat && d.transFat > 0) s -= 20

  if (d.protein > 5) s += 10

  return clampScore(s)
}

// ============================================
// GENERAL / FALLBACK SCORING
// ============================================

function calculateGeneralScore(d: NutritionData): number {
  let s = 100

  if (d.calories > 300) s -= 15
  if (d.sugar > 15) s -= 20
  if (d.sodium > 500) s -= 20
  if (d.fat > 15) s -= 15
  if (d.protein > 10) s += 10
  if (d.fiber && d.fiber > 5) s += 10

  return clampScore(s)
}

// ============================================
// BEVERAGE SCORING WITH BREAKDOWN
// ============================================

function calculateBeverageScoreWithBreakdown(d: NutritionData): ScoreBreakdown {
  let s = 100
  const penalties: ScoreBreakdown['penalties'] = []
  const bonuses: ScoreBreakdown['bonuses'] = []

  const sugarPer100ml = (d.sugar / d.servingSize) * 100
  const caloriesPer100ml = (d.calories / d.servingSize) * 100

  // Sugar penalties
  if (sugarPer100ml > 15) {
    penalties.push({ name: 'High Sugar', amount: 50, reason: `${sugarPer100ml.toFixed(1)}g per 100ml` })
    s -= 50
  } else if (sugarPer100ml > 10) {
    penalties.push({ name: 'High Sugar', amount: 35, reason: `${sugarPer100ml.toFixed(1)}g per 100ml` })
    s -= 35
  } else if (sugarPer100ml > 5) {
    penalties.push({ name: 'Moderate Sugar', amount: 20, reason: `${sugarPer100ml.toFixed(1)}g per 100ml` })
    s -= 20
  } else if (sugarPer100ml > 2) {
    penalties.push({ name: 'Some Sugar', amount: 10, reason: `${sugarPer100ml.toFixed(1)}g per 100ml` })
    s -= 10
  }

  // Calories
  if (caloriesPer100ml > 60) {
    penalties.push({ name: 'High Calories', amount: 20, reason: `${caloriesPer100ml.toFixed(0)} kcal per 100ml` })
    s -= 20
  } else if (caloriesPer100ml > 40) {
    penalties.push({ name: 'Moderate Calories', amount: 10, reason: `${caloriesPer100ml.toFixed(0)} kcal per 100ml` })
    s -= 10
  }

  // Sodium
  if (d.sodium > 100) {
    penalties.push({ name: 'High Sodium', amount: 10, reason: `${d.sodium}mg per serving` })
    s -= 10
  }

  // Protein bonus
  if (d.protein > 5) {
    bonuses.push({ name: 'Good Protein', amount: 10, reason: `${d.protein}g protein per serving` })
    s += 10
  } else if (d.protein > 3) {
    bonuses.push({ name: 'Moderate Protein', amount: 5, reason: `${d.protein}g protein per serving` })
    s += 5
  }

  // Artificial sweetener suspicion
  if (d.addedSugar === 0 && d.calories > 5) {
    penalties.push({ name: 'Artificial Sweetener', amount: 5, reason: 'Low sugar but calories present' })
    s -= 5
  }

  return {
    baseScore: 100,
    finalScore: clampScore(s),
    category: 'beverage',
    penalties,
    bonuses,
    summary: ''
  }
}

// ============================================
// SNACK SCORING WITH BREAKDOWN
// ============================================

function calculateSnackScoreWithBreakdown(d: NutritionData): ScoreBreakdown {
  let s = 100
  const penalties: ScoreBreakdown['penalties'] = []
  const bonuses: ScoreBreakdown['bonuses'] = []

  if (d.calories > 300) {
    penalties.push({ name: 'High Calories', amount: 25, reason: `${d.calories} kcal per serving` })
    s -= 25
  } else if (d.calories > 200) {
    penalties.push({ name: 'Moderate Calories', amount: 15, reason: `${d.calories} kcal per serving` })
    s -= 15
  } else if (d.calories > 150) {
    penalties.push({ name: 'Some Calories', amount: 8, reason: `${d.calories} kcal per serving` })
    s -= 8
  }

  if (d.fat > 20) {
    penalties.push({ name: 'High Fat', amount: 20, reason: `${d.fat}g fat per serving` })
    s -= 20
  } else if (d.fat > 15) {
    penalties.push({ name: 'Moderate Fat', amount: 12, reason: `${d.fat}g fat per serving` })
    s -= 12
  } else if (d.fat > 10) {
    penalties.push({ name: 'Some Fat', amount: 6, reason: `${d.fat}g fat per serving` })
    s -= 6
  }

  if (d.saturatedFat && d.saturatedFat > 5) {
    penalties.push({ name: 'High Saturated Fat', amount: 10, reason: `${d.saturatedFat}g saturated fat` })
    s -= 10
  }
  if (d.transFat && d.transFat > 0) {
    penalties.push({ name: 'Trans Fat Present', amount: 20, reason: `${d.transFat}g trans fat detected` })
    s -= 20
  }

  if (d.sugar > 15) {
    penalties.push({ name: 'High Sugar', amount: 20, reason: `${d.sugar}g sugar per serving` })
    s -= 20
  } else if (d.sugar > 10) {
    penalties.push({ name: 'Moderate Sugar', amount: 12, reason: `${d.sugar}g sugar per serving` })
    s -= 12
  } else if (d.sugar > 5) {
    penalties.push({ name: 'Some Sugar', amount: 6, reason: `${d.sugar}g sugar per serving` })
    s -= 6
  }

  if (d.sodium > 600) {
    penalties.push({ name: 'High Sodium', amount: 15, reason: `${d.sodium}mg sodium per serving` })
    s -= 15
  } else if (d.sodium > 400) {
    penalties.push({ name: 'Moderate Sodium', amount: 10, reason: `${d.sodium}mg sodium per serving` })
    s -= 10
  } else if (d.sodium > 200) {
    penalties.push({ name: 'Some Sodium', amount: 6, reason: `${d.sodium}mg sodium per serving` })
    s -= 6
  }

  if (d.protein > 8) {
    bonuses.push({ name: 'High Protein', amount: 10, reason: `${d.protein}g protein per serving` })
    s += 10
  } else if (d.protein > 5) {
    bonuses.push({ name: 'Good Protein', amount: 5, reason: `${d.protein}g protein per serving` })
    s += 5
  }

  if (d.fiber && d.fiber > 4) {
    bonuses.push({ name: 'Good Fiber', amount: 10, reason: `${d.fiber}g fiber per serving` })
    s += 10
  }

  return {
    baseScore: 100,
    finalScore: clampScore(s),
    category: 'snack',
    penalties,
    bonuses,
    summary: ''
  }
}

// ============================================
// DAIRY SCORING WITH BREAKDOWN
// ============================================

function calculateDairyScoreWithBreakdown(d: NutritionData): ScoreBreakdown {
  let s = 100
  const penalties: ScoreBreakdown['penalties'] = []
  const bonuses: ScoreBreakdown['bonuses'] = []

  if (d.sugar > 20) {
    penalties.push({ name: 'High Sugar', amount: 30, reason: `${d.sugar}g sugar per serving` })
    s -= 30
  } else if (d.sugar > 12) {
    penalties.push({ name: 'Moderate Sugar', amount: 18, reason: `${d.sugar}g sugar per serving` })
    s -= 18
  } else if (d.sugar > 8) {
    penalties.push({ name: 'Some Sugar', amount: 10, reason: `${d.sugar}g sugar per serving` })
    s -= 10
  }

  if (d.fat > 10) {
    penalties.push({ name: 'High Fat', amount: 12, reason: `${d.fat}g fat per serving` })
    s -= 12
  } else if (d.fat < 1) {
    penalties.push({ name: 'Very Low Fat', amount: 5, reason: 'May indicate additive reliance' })
    s -= 5
  }

  if (d.saturatedFat && d.saturatedFat > 8) {
    penalties.push({ name: 'High Saturated Fat', amount: 15, reason: `${d.saturatedFat}g saturated fat` })
    s -= 15
  }

  if (d.sodium > 200) {
    penalties.push({ name: 'High Sodium', amount: 10, reason: `${d.sodium}mg sodium per serving` })
    s -= 10
  }

  if (d.protein > 15) {
    bonuses.push({ name: 'Excellent Protein', amount: 20, reason: `${d.protein}g protein per serving` })
    s += 20
  } else if (d.protein > 10) {
    bonuses.push({ name: 'High Protein', amount: 15, reason: `${d.protein}g protein per serving` })
    s += 15
  } else if (d.protein > 6) {
    bonuses.push({ name: 'Good Protein', amount: 10, reason: `${d.protein}g protein per serving` })
    s += 10
  } else if (d.protein < 3) {
    penalties.push({ name: 'Low Protein', amount: 10, reason: `Only ${d.protein}g protein per serving` })
    s -= 10
  }

  return {
    baseScore: 100,
    finalScore: clampScore(s),
    category: 'dairy',
    penalties,
    bonuses,
    summary: ''
  }
}

// ============================================
// PACKAGED FOOD SCORING WITH BREAKDOWN
// ============================================

function calculatePackagedFoodScoreWithBreakdown(d: NutritionData): ScoreBreakdown {
  let s = 100
  const penalties: ScoreBreakdown['penalties'] = []
  const bonuses: ScoreBreakdown['bonuses'] = []

  if (d.calories > 400) {
    penalties.push({ name: 'Very High Calories', amount: 25, reason: `${d.calories} kcal per serving` })
    s -= 25
  } else if (d.calories > 300) {
    penalties.push({ name: 'High Calories', amount: 15, reason: `${d.calories} kcal per serving` })
    s -= 15
  }

  if (d.sodium > 800) {
    penalties.push({ name: 'Very High Sodium', amount: 25, reason: `${d.sodium}mg sodium per serving` })
    s -= 25
  } else if (d.sodium > 500) {
    penalties.push({ name: 'High Sodium', amount: 15, reason: `${d.sodium}mg sodium per serving` })
    s -= 15
  }

  if (d.fat > 25) {
    penalties.push({ name: 'High Fat', amount: 20, reason: `${d.fat}g fat per serving` })
    s -= 20
  }
  if (d.saturatedFat && d.saturatedFat > 8) {
    penalties.push({ name: 'High Saturated Fat', amount: 10, reason: `${d.saturatedFat}g saturated fat` })
    s -= 10
  }
  if (d.transFat && d.transFat > 0) {
    penalties.push({ name: 'Trans Fat Present', amount: 25, reason: `${d.transFat}g trans fat detected` })
    s -= 25
  }

  if (d.sugar > 12) {
    penalties.push({ name: 'High Sugar', amount: 18, reason: `${d.sugar}g sugar per serving` })
    s -= 18
  } else if (d.sugar > 8) {
    penalties.push({ name: 'Moderate Sugar', amount: 10, reason: `${d.sugar}g sugar per serving` })
    s -= 10
  }

  if (d.protein > 15) {
    bonuses.push({ name: 'High Protein', amount: 10, reason: `${d.protein}g protein per serving` })
    s += 10
  }
  if (d.fiber && d.fiber > 6) {
    bonuses.push({ name: 'Good Fiber', amount: 10, reason: `${d.fiber}g fiber per serving` })
    s += 10
  }

  return {
    baseScore: 100,
    finalScore: clampScore(s),
    category: 'packaged_food',
    penalties,
    bonuses,
    summary: ''
  }
}

// ============================================
// CEREAL SCORING WITH BREAKDOWN
// ============================================

function calculateCerealScoreWithBreakdown(d: NutritionData): ScoreBreakdown {
  let s = 100
  const penalties: ScoreBreakdown['penalties'] = []
  const bonuses: ScoreBreakdown['bonuses'] = []

  if (d.sugar > 15) {
    penalties.push({ name: 'Very High Sugar', amount: 40, reason: `${d.sugar}g sugar per serving` })
    s -= 40
  } else if (d.sugar > 10) {
    penalties.push({ name: 'High Sugar', amount: 25, reason: `${d.sugar}g sugar per serving` })
    s -= 25
  } else if (d.sugar > 6) {
    penalties.push({ name: 'Moderate Sugar', amount: 15, reason: `${d.sugar}g sugar per serving` })
    s -= 15
  } else if (d.sugar > 3) {
    penalties.push({ name: 'Some Sugar', amount: 8, reason: `${d.sugar}g sugar per serving` })
    s -= 8
  }

  if (d.fiber && d.fiber > 8) {
    bonuses.push({ name: 'Excellent Fiber', amount: 20, reason: `${d.fiber}g fiber per serving` })
    s += 20
  } else if (d.fiber && d.fiber > 5) {
    bonuses.push({ name: 'High Fiber', amount: 15, reason: `${d.fiber}g fiber per serving` })
    s += 15
  } else if (d.fiber && d.fiber > 3) {
    bonuses.push({ name: 'Good Fiber', amount: 10, reason: `${d.fiber}g fiber per serving` })
    s += 10
  } else if (d.fiber && d.fiber < 2) {
    penalties.push({ name: 'Low Fiber', amount: 10, reason: `Only ${d.fiber}g fiber per serving` })
    s -= 10
  }

  if (d.protein > 8) {
    bonuses.push({ name: 'High Protein', amount: 15, reason: `${d.protein}g protein per serving` })
    s += 15
  } else if (d.protein > 5) {
    bonuses.push({ name: 'Good Protein', amount: 10, reason: `${d.protein}g protein per serving` })
    s += 10
  }

  if (d.sodium > 300) {
    penalties.push({ name: 'High Sodium', amount: 15, reason: `${d.sodium}mg sodium per serving` })
    s -= 15
  } else if (d.sodium > 200) {
    penalties.push({ name: 'Moderate Sodium', amount: 8, reason: `${d.sodium}mg sodium per serving` })
    s -= 8
  }

  return {
    baseScore: 100,
    finalScore: clampScore(s),
    category: 'breakfast_cereal',
    penalties,
    bonuses,
    summary: ''
  }
}

// ============================================
// FROZEN FOOD SCORING WITH BREAKDOWN
// ============================================

function calculateFrozenFoodScoreWithBreakdown(d: NutritionData): ScoreBreakdown {
  let s = 100
  const penalties: ScoreBreakdown['penalties'] = []
  const bonuses: ScoreBreakdown['bonuses'] = []

  if (d.sodium > 1000) {
    penalties.push({ name: 'Very High Sodium', amount: 35, reason: `${d.sodium}mg sodium per serving` })
    s -= 35
  } else if (d.sodium > 700) {
    penalties.push({ name: 'High Sodium', amount: 25, reason: `${d.sodium}mg sodium per serving` })
    s -= 25
  } else if (d.sodium > 500) {
    penalties.push({ name: 'Moderate Sodium', amount: 15, reason: `${d.sodium}mg sodium per serving` })
    s -= 15
  }

  if (d.calories > 500) {
    penalties.push({ name: 'High Calories', amount: 20, reason: `${d.calories} kcal per serving` })
    s -= 20
  } else if (d.calories > 350) {
    penalties.push({ name: 'Moderate Calories', amount: 12, reason: `${d.calories} kcal per serving` })
    s -= 12
  }

  if (d.fat > 25) {
    penalties.push({ name: 'High Fat', amount: 18, reason: `${d.fat}g fat per serving` })
    s -= 18
  }
  if (d.saturatedFat && d.saturatedFat > 10) {
    penalties.push({ name: 'High Saturated Fat', amount: 15, reason: `${d.saturatedFat}g saturated fat` })
    s -= 15
  }
  if (d.sugar > 10) {
    penalties.push({ name: 'High Sugar', amount: 15, reason: `${d.sugar}g sugar per serving` })
    s -= 15
  }

  if (d.protein > 20) {
    bonuses.push({ name: 'Excellent Protein', amount: 15, reason: `${d.protein}g protein per serving` })
    s += 15
  } else if (d.protein > 12) {
    bonuses.push({ name: 'High Protein', amount: 10, reason: `${d.protein}g protein per serving` })
    s += 10
  }

  if (d.fiber && d.fiber > 5) {
    bonuses.push({ name: 'Good Fiber', amount: 10, reason: `${d.fiber}g fiber per serving` })
    s += 10
  }

  return {
    baseScore: 100,
    finalScore: clampScore(s),
    category: 'frozen_food',
    penalties,
    bonuses,
    summary: ''
  }
}

// ============================================
// CONDIMENT SCORING WITH BREAKDOWN
// ============================================

function calculateCondimentScoreWithBreakdown(d: NutritionData): ScoreBreakdown {
  let s = 100
  const penalties: ScoreBreakdown['penalties'] = []
  const bonuses: ScoreBreakdown['bonuses'] = []

  if (d.sodium > 1000) {
    penalties.push({ name: 'Very High Sodium', amount: 35, reason: `${d.sodium}mg sodium per serving` })
    s -= 35
  } else if (d.sodium > 600) {
    penalties.push({ name: 'High Sodium', amount: 25, reason: `${d.sodium}mg sodium per serving` })
    s -= 25
  } else if (d.sodium > 400) {
    penalties.push({ name: 'Moderate Sodium', amount: 15, reason: `${d.sodium}mg sodium per serving` })
    s -= 15
  }

  if (d.sugar > 10) {
    penalties.push({ name: 'High Sugar', amount: 25, reason: `${d.sugar}g sugar per serving` })
    s -= 25
  } else if (d.sugar > 5) {
    penalties.push({ name: 'Moderate Sugar', amount: 15, reason: `${d.sugar}g sugar per serving` })
    s -= 15
  } else if (d.sugar > 2) {
    penalties.push({ name: 'Some Sugar', amount: 8, reason: `${d.sugar}g sugar per serving` })
    s -= 8
  }

  if (d.calories > 100) {
    penalties.push({ name: 'High Calories', amount: 10, reason: `${d.calories} kcal per serving` })
    s -= 10
  }
  if (d.fat > 15) {
    penalties.push({ name: 'High Fat', amount: 10, reason: `${d.fat}g fat per serving` })
    s -= 10
  }

  return {
    baseScore: 100,
    finalScore: clampScore(s),
    category: 'condiment',
    penalties,
    bonuses,
    summary: ''
  }
}

// ============================================
// DESSERT SCORING WITH BREAKDOWN
// ============================================

function calculateDessertScoreWithBreakdown(d: NutritionData): ScoreBreakdown {
  let s = 70
  const penalties: ScoreBreakdown['penalties'] = []
  const bonuses: ScoreBreakdown['bonuses'] = []

  if (d.sugar > 30) {
    penalties.push({ name: 'Very High Sugar', amount: 30, reason: `${d.sugar}g sugar per serving` })
    s -= 30
  } else if (d.sugar > 20) {
    penalties.push({ name: 'High Sugar', amount: 20, reason: `${d.sugar}g sugar per serving` })
    s -= 20
  } else if (d.sugar > 15) {
    penalties.push({ name: 'Moderate Sugar', amount: 12, reason: `${d.sugar}g sugar per serving` })
    s -= 12
  }

  if (d.calories > 400) {
    penalties.push({ name: 'High Calories', amount: 20, reason: `${d.calories} kcal per serving` })
    s -= 20
  } else if (d.calories > 300) {
    penalties.push({ name: 'Moderate Calories', amount: 12, reason: `${d.calories} kcal per serving` })
    s -= 12
  }

  if (d.fat > 20) {
    penalties.push({ name: 'High Fat', amount: 15, reason: `${d.fat}g fat per serving` })
    s -= 15
  }
  if (d.saturatedFat && d.saturatedFat > 12) {
    penalties.push({ name: 'High Saturated Fat', amount: 15, reason: `${d.saturatedFat}g saturated fat` })
    s -= 15
  }
  if (d.transFat && d.transFat > 0) {
    penalties.push({ name: 'Trans Fat Present', amount: 20, reason: `${d.transFat}g trans fat detected` })
    s -= 20
  }

  if (d.protein > 5) {
    bonuses.push({ name: 'Good Protein', amount: 10, reason: `${d.protein}g protein per serving` })
    s += 10
  }

  return {
    baseScore: 70,
    finalScore: clampScore(s),
    category: 'dessert',
    penalties,
    bonuses,
    summary: ''
  }
}

// ============================================
// GENERAL SCORING WITH BREAKDOWN
// ============================================

function calculateGeneralScoreWithBreakdown(d: NutritionData): ScoreBreakdown {
  let s = 100
  const penalties: ScoreBreakdown['penalties'] = []
  const bonuses: ScoreBreakdown['bonuses'] = []

  if (d.calories > 300) {
    penalties.push({ name: 'High Calories', amount: 15, reason: `${d.calories} kcal per serving` })
    s -= 15
  }
  if (d.sugar > 15) {
    penalties.push({ name: 'High Sugar', amount: 20, reason: `${d.sugar}g sugar per serving` })
    s -= 20
  }
  if (d.sodium > 500) {
    penalties.push({ name: 'High Sodium', amount: 20, reason: `${d.sodium}mg sodium per serving` })
    s -= 20
  }
  if (d.fat > 15) {
    penalties.push({ name: 'High Fat', amount: 15, reason: `${d.fat}g fat per serving` })
    s -= 15
  }
  if (d.protein > 10) {
    bonuses.push({ name: 'High Protein', amount: 10, reason: `${d.protein}g protein per serving` })
    s += 10
  }
  if (d.fiber && d.fiber > 5) {
    bonuses.push({ name: 'Good Fiber', amount: 10, reason: `${d.fiber}g fiber per serving` })
    s += 10
  }

  return {
    baseScore: 100,
    finalScore: clampScore(s),
    category: 'packaged_food',
    penalties,
    bonuses,
    summary: ''
  }
}

// ============================================
// GENERATE SUMMARY
// ============================================

function generateScoreSummary(breakdown: ScoreBreakdown): string {
  const changeAmount = breakdown.baseScore - breakdown.finalScore
  const topPenalty = breakdown.penalties[0]?.name || 'None'
  const topBonus = breakdown.bonuses[0]?.name || 'None'

  if (breakdown.finalScore >= 85) {
    return `Excellent score! Penalties: ${topPenalty || 'None'}. Bonuses: ${topBonus || 'None'}.`
  } else if (breakdown.finalScore >= 70) {
    return `Good nutritional profile. Reduced by ${changeAmount} points. Main concerns: ${topPenalty}.`
  } else if (breakdown.finalScore >= 50) {
    return `Moderate nutrition. ${breakdown.penalties.length} concerns identified. Consider alternatives.`
  } else {
    return `Poor nutritional profile. ${breakdown.penalties.length} major concerns. Limit consumption.`
  }
}

// ============================================
// INTERPRETATION: Text + Color
// ============================================

export function getScoreInterpretation(score: number): {
  rating: string
  message: string
  color: string
} {
  if (score >= 85)
    return {
      rating: 'Excellent',
      message: 'This product meets excellent nutritional standards.',
      color: 'emerald',
    }
  if (score >= 70)
    return {
      rating: 'Good',
      message: 'A good nutritional choice overall.',
      color: 'teal',
    }
  if (score >= 50)
    return {
      rating: 'Moderate',
      message: 'Has moderate nutrition balance; consume occasionally.',
      color: 'cyan',
    }
  if (score >= 30)
    return {
      rating: 'Poor',
      message: 'High sugar, fat, or sodium. Consider limiting intake.',
      color: 'orange',
    }
  return {
    rating: 'Very Poor',
    message: 'Unhealthy. Contains excessive fats, sugar, or sodium.',
    color: 'red',
  }
}

// ============================================
// CONFIDENCE BOOST (Optional Integration)
// If product data completeness < 70%, reduce score reliability
// ============================================

export function adjustScoreByConfidence(score: number, confidence?: number): number {
  if (!confidence) return score
  const penalty = confidence < 80 ? (80 - confidence) * 0.3 : 0
  return clampScore(score - penalty)
}
