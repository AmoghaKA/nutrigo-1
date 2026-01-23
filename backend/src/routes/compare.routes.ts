/**
 * Comparison Routes
 * Endpoints for product comparison functionality
 */

import express from "express"
import { supabase } from "../lib/supabase"
import { calculateHealthScore, calculateHealthScoreWithBreakdown } from "../utils/healthScoreCalculator"

const router = express.Router()

/**
 * POST /api/compare/save
 * Save a comparison between two scans to the database
 */
router.post("/save", async (req, res) => {
  try {
    const { userId, product1Id, product2Id, winnerId } = req.body

    if (!userId || !product1Id || !product2Id) {
      return res.status(400).json({
        error: "Missing required fields: userId, product1Id, product2Id",
      })
    }

    // Generate comparison ID
    const comparisonId = `comp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Save comparison to database
    const { data, error } = await supabase
      .from("comparisons")
      .insert([
        {
          id: comparisonId,
          user_id: userId,
          product_1_id: product1Id,
          product_2_id: product2Id,
          winner_id: winnerId || null,
          created_at: new Date().toISOString(),
        },
      ])
      .select()

    if (error) throw error

    res.status(201).json({
      success: true,
      data: data[0],
      message: "Comparison saved successfully",
    })
  } catch (err) {
    console.error("❌ Error saving comparison:", err)
    res.status(500).json({
      error: "Failed to save comparison",
      details: (err as Error).message,
    })
  }
})

/**
 * GET /api/compare/history
 * Get comparison history for a user
 */
router.get("/history", async (req, res) => {
  try {
    const { userId } = req.query

    if (!userId || typeof userId !== "string") {
      return res.status(400).json({
        error: "Missing required query parameter: userId",
      })
    }

    // Get comparisons with related scan data
    const { data, error } = await supabase
      .from("comparisons")
      .select(
        `
        id,
        user_id,
        product_1_id,
        product_2_id,
        winner_id,
        created_at,
        scans!product_1_id (id, name, brand, healthScore),
        scans!product_2_id (id, name, brand, healthScore)
      `
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(50)

    if (error) throw error

    res.status(200).json({
      success: true,
      data: data,
      count: data?.length || 0,
    })
  } catch (err) {
    console.error("❌ Error fetching comparison history:", err)
    res.status(500).json({
      error: "Failed to fetch comparison history",
      details: (err as Error).message,
    })
  }
})

/**
 * GET /api/compare/:comparisonId
 * Get a specific comparison by ID
 */
router.get("/:comparisonId", async (req, res) => {
  try {
    const { comparisonId } = req.params

    const { data, error } = await supabase
      .from("comparisons")
      .select(
        `
        id,
        user_id,
        product_1_id,
        product_2_id,
        winner_id,
        created_at,
        scans!product_1_id (*),
        scans!product_2_id (*)
      `
      )
      .eq("id", comparisonId)
      .single()

    if (error) {
      if (error.code === "PGRST116") {
        return res.status(404).json({ error: "Comparison not found" })
      }
      throw error
    }

    res.status(200).json({
      success: true,
      data: data,
    })
  } catch (err) {
    console.error("❌ Error fetching comparison:", err)
    res.status(500).json({
      error: "Failed to fetch comparison",
      details: (err as Error).message,
    })
  }
})

/**
 * DELETE /api/compare/:comparisonId
 * Delete a comparison record
 */
router.delete("/:comparisonId", async (req, res) => {
  try {
    const { comparisonId } = req.params
    const { userId } = req.body

    if (!userId) {
      return res.status(400).json({ error: "Missing userId in request body" })
    }

    // Verify the comparison belongs to the user before deleting
    const { data: comparisonData, error: fetchError } = await supabase
      .from("comparisons")
      .select("user_id")
      .eq("id", comparisonId)
      .single()

    if (fetchError || comparisonData?.user_id !== userId) {
      return res.status(403).json({ error: "Unauthorized to delete this comparison" })
    }

    const { error: deleteError } = await supabase
      .from("comparisons")
      .delete()
      .eq("id", comparisonId)

    if (deleteError) throw deleteError

    res.status(200).json({
      success: true,
      message: "Comparison deleted successfully",
    })
  } catch (err) {
    console.error("❌ Error deleting comparison:", err)
    res.status(500).json({
      error: "Failed to delete comparison",
      details: (err as Error).message,
    })
  }
})

/**
 * GET /api/compare/test
 * Debug endpoint to test comparison route
 */
router.get("/test", (req, res) => {
  res.json({ message: "Comparison route active ✅" })
})

/**
 * POST /api/compare/recalculate-scores
 * Recalculate health scores for two products using LLM-based calculation
 */
router.post("/recalculate-scores", async (req, res) => {
  try {
    const { productIds } = req.body

    console.log("📥 Recalculate-scores request received with IDs:", productIds)

    if (!productIds || !Array.isArray(productIds) || productIds.length !== 2) {
      console.error("❌ Invalid productIds format:", productIds)
      return res.status(400).json({
        error: "Missing or invalid productIds. Expected array of 2 product IDs.",
      })
    }

    const [product1Id, product2Id] = productIds

    console.log("🔍 Querying Supabase for products:", [product1Id, product2Id])

    // Fetch both products from Supabase
    const { data: products, error } = await supabase
      .from("scans")
      .select("*")
      .in("id", [product1Id, product2Id])

    if (error) {
      console.error("❌ Supabase query error:", error)
      throw error
    }

    console.log(`✅ Found ${products?.length || 0} products in database`)
    if (products && products.length > 0) {
      console.log("   Product names:", products.map((p: any) => p.name || p.detected_name))
    }

    if (!products || products.length !== 2) {
      console.warn("⚠️ Expected 2 products but found:", products?.length)
      console.warn("   Searched IDs:", [product1Id, product2Id])
      console.warn("   This usually means:")
      console.warn("   - Products haven't been saved to the database yet")
      console.warn("   - Product IDs don't match the database records")
      console.warn("   - Products may have been deleted")
      return res.status(404).json({
        error: "One or both products not found in database",
        details: {
          searched: [product1Id, product2Id],
          found: products?.length || 0,
        }
      })
    }

    // Recalculate health scores using the proper calculator
    const updatedProducts = products.map((product: any) => {
      const nutritionData = {
        name: product.detected_name || product.name || "Unknown",
        brand: product.brand || "",
        barcode: product.barcode || "",
        calories: product.nutrition?.calories || 0,
        sugar: product.nutrition?.sugar || 0,
        protein: product.nutrition?.protein || 0,
        fat: product.nutrition?.fat || 0,
        saturatedFat: product.nutrition?.saturatedFat || 0,
        transFat: product.nutrition?.transFat || 0,
        sodium: product.nutrition?.sodium || 0,
        fiber: product.nutrition?.fiber || 0,
        carbs: product.nutrition?.carbs || 0,
        servingSize: 100,
        category: product.nutrition?.category || "packaged_food",
        addedSugar: product.nutrition?.addedSugar,
        ingredients: product.ingredients || [],
        warnings: product.warnings || [],
      }

      const breakdown = calculateHealthScoreWithBreakdown(nutritionData)

      return {
        id: product.id,
        original_score: product.healthScore,
        calculated_score: breakdown.finalScore,
        name: product.detected_name || product.name,
        brand: product.brand,
        nutrition: product.nutrition,
        scoreBreakdown: {
          baseScore: breakdown.baseScore,
          finalScore: breakdown.finalScore,
          category: breakdown.category,
          penalties: breakdown.penalties,
          bonuses: breakdown.bonuses,
          summary: breakdown.summary
        }
      }
    })

    // Update scores in database
    for (const product of updatedProducts) {
      const { error: updateError } = await supabase
        .from("scans")
        .update({ healthScore: product.calculated_score })
        .eq("id", product.id)

      if (updateError) {
        console.error(`Error updating product ${product.id}:`, updateError)
      }
    }

    res.status(200).json({
      success: true,
      message: "Health scores recalculated successfully",
      data: {
        product1: {
          id: updatedProducts[0].id,
          name: updatedProducts[0].name,
          originalScore: updatedProducts[0].original_score,
          calculatedScore: updatedProducts[0].calculated_score,
          scoreBreakdown: updatedProducts[0].scoreBreakdown,
        },
        product2: {
          id: updatedProducts[1].id,
          name: updatedProducts[1].name,
          originalScore: updatedProducts[1].original_score,
          calculatedScore: updatedProducts[1].calculated_score,
          scoreBreakdown: updatedProducts[1].scoreBreakdown,
        },
      },
    })
  } catch (err) {
    console.error("❌ Error recalculating scores:", err)
    res.status(500).json({
      error: "Failed to recalculate health scores",
      details: (err as Error).message,
    })
  }
})

export default router
