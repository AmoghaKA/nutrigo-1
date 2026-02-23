/**
 * feedback.routes.ts
 *
 * Handles user feedback on scanned product nutritional values.
 *
 * POST /api/feedback
 *   Body: {
 *     product_name  : string          (required)
 *     brand         : string          (optional)
 *     scan_id       : string          (optional – Supabase row id)
 *     feedback_type : 'correct' | 'incorrect'
 *     corrections   ?: {             (only when feedback_type === 'incorrect')
 *       calories?: number
 *       fat?    : number
 *       sugar?  : number
 *       protein?: number
 *       carbs?  : number
 *       sodium? : number
 *       fiber?  : number
 *     }
 *     comment?: string               (optional free-text)
 *   }
 *
 * GET  /api/feedback?product_name=<name>
 *   Returns aggregate feedback for a product.
 */

import express, { Request, Response } from "express";
import { supabase } from "../lib/supabase";
import { lookupInCSV, saveToCSV, CachedProduct } from "../utils/csvCache";

const router = express.Router();

// ── Health Score Formula (shared) ─────────────────────────────────────────────
function calculateHealthScore(n: {
  calories?: number; sugar?: number; protein?: number;
  fat?: number; fiber?: number; sodium?: number;
}): number {
  let score = 100;
  const calories = n.calories ?? 0;
  const sugar    = n.sugar    ?? 0;
  const protein  = n.protein  ?? 0;
  const fiber    = n.fiber;
  const sodium   = n.sodium;

  if (sugar > 25)                    score -= Math.min(30, (sugar - 25) * 1.5);
  if (calories > 300)                score -= Math.min(20, (calories - 300) * 0.05);
  if (sodium != null && sodium > 500) score -= Math.min(15, (sodium - 500) * 0.02);
  if (protein > 5)                   score += Math.min(15, (protein - 5) * 2);
  if (fiber != null && fiber > 3)    score += Math.min(10, (fiber - 3) * 3);

  return Math.max(0, Math.min(100, Math.round(score)));
}

// ── POST /api/feedback ────────────────────────────────────────────────────────
router.post("/", async (req: Request, res: Response) => {
  try {
    const {
      product_name,
      brand = "",
      scan_id,
      feedback_type,
      corrections,
      comment = "",
    } = req.body;

    // ── Validation ────────────────────────────────────────────────────────────
    if (!product_name || typeof product_name !== "string") {
      return res.status(400).json({ error: "'product_name' is required" });
    }
    if (!["correct", "incorrect"].includes(feedback_type)) {
      return res.status(400).json({ error: "'feedback_type' must be 'correct' or 'incorrect'" });
    }

    // ── 1. Save raw feedback to Supabase ──────────────────────────────────────
    const feedbackRow = {
      product_name:  product_name.trim(),
      brand:         brand.trim(),
      scan_id:       scan_id ?? null,
      feedback_type,
      corrections:   corrections ?? null,
      comment:       comment.trim(),
      created_at:    new Date().toISOString(),
    };

    const { error: insertError } = await supabase
      .from("product_feedback")
      .insert([feedbackRow]);

    if (insertError) {
      console.error("❌ [feedback] Supabase insert error:", insertError.message);
      // Don't fail the request — still apply CSV correction below
    }

    // ── 2. If user supplied corrections → update CSV cache ────────────────────
    if (feedback_type === "incorrect" && corrections && typeof corrections === "object") {
      const existing = await lookupInCSV(product_name, brand || undefined);

      if (existing) {
        // Merge corrections on top of existing cached values
        const merged: CachedProduct = {
          ...existing,
          calories: corrections.calories  ?? existing.calories,
          fat:      corrections.fat       ?? existing.fat,
          sugar:    corrections.sugar     ?? existing.sugar,
          protein:  corrections.protein   ?? existing.protein,
          carbs:    corrections.carbs     ?? existing.carbs,
          sodium:   corrections.sodium    ?? existing.sodium,
          fiber:    corrections.fiber     ?? existing.fiber,
        };
        // Recalculate health score with corrected nutrition
        merged.health_score = calculateHealthScore(merged);

        await saveToCSV(merged);

        console.log(
          `🔄 [feedback] CSV cache updated for "${product_name}" with user corrections. ` +
          `New health_score: ${merged.health_score}`
        );

        return res.json({
          success: true,
          message: "Thank you! The nutritional data and health score have been updated.",
          updated_health_score: merged.health_score,
          action: "csv_updated",
        });
      } else {
        // Product not yet cached — nothing to correct, just acknowledge
        console.warn(`⚠️ [feedback] No CSV entry found to correct for "${product_name}"`);
        return res.json({
          success: true,
          message: "Thank you for your feedback! We'll use it for future scans.",
          action: "feedback_logged",
        });
      }
    }

    // ── 3. 'correct' feedback — just acknowledge ──────────────────────────────
    console.log(`✅ [feedback] "correct" vote for "${product_name}"`);
    return res.json({
      success: true,
      message: "Thank you! Your feedback helps us improve accuracy.",
      action: "feedback_logged",
    });
  } catch (err) {
    console.error("❌ [feedback] POST / error:", err);
    return res.status(500).json({ error: "Failed to process feedback" });
  }
});

// ── GET /api/feedback?product_name=<name> ─────────────────────────────────────
router.get("/", async (req: Request, res: Response) => {
  try {
    const name = (req.query.product_name as string || "").trim();
    if (!name) {
      return res.status(400).json({ error: "'product_name' query param is required" });
    }

    const { data, error } = await supabase
      .from("product_feedback")
      .select("feedback_type, corrections, created_at")
      .ilike("product_name", name)
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) throw error;

    const correctCount   = data?.filter((r) => r.feedback_type === "correct").length   ?? 0;
    const incorrectCount = data?.filter((r) => r.feedback_type === "incorrect").length ?? 0;
    const total          = data?.length ?? 0;
    const accuracyPct    = total > 0 ? Math.round((correctCount / total) * 100) : null;

    return res.json({
      product_name:  name,
      total_votes:   total,
      correct_votes: correctCount,
      incorrect_votes: incorrectCount,
      accuracy_pct:  accuracyPct,
      recent:        data?.slice(0, 5) ?? [],
    });
  } catch (err) {
    console.error("❌ [feedback] GET / error:", err);
    return res.status(500).json({ error: "Failed to fetch feedback" });
  }
});

export default router;
