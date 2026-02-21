/**
 * cache.routes.ts
 *
 * Exposes the Supabase-backed product cache over HTTP:
 *   GET  /api/cache              → paginated list of all cached products
 *   GET  /api/cache/download     → download products_cache.csv (generated on-the-fly)
 *   GET  /api/cache/lookup?name=<name>&brand=<brand>
 *                                → check whether a product is cached
 */

import express, { Request, Response } from "express";
import { getAllCachedProducts, lookupInCSV, generateCSVContent } from "../utils/csvCache";

const router = express.Router();

// ── GET /api/cache ─────────────────────────────────────────────────────────────
router.get("/", async (req: Request, res: Response) => {
  try {
    const products = await getAllCachedProducts();
    const page     = Math.max(1, parseInt(req.query.page  as string) || 1);
    const limit    = Math.min(200, parseInt(req.query.limit as string) || 50);
    const start    = (page - 1) * limit;
    const slice    = products.slice(start, start + limit);

    res.json({
      total:   products.length,
      page,
      limit,
      results: slice,
    });
  } catch (err) {
    console.error("❌ [cache] GET / error:", err);
    res.status(500).json({ error: "Failed to read product cache" });
  }
});

// ── GET /api/cache/lookup ─────────────────────────────────────────────────────
router.get("/lookup", async (req: Request, res: Response) => {
  const name  = (req.query.name  as string || "").trim();
  const brand = (req.query.brand as string || "").trim() || undefined;

  if (!name) {
    return res.status(400).json({ error: "Query param 'name' is required" });
  }

  const hit = await lookupInCSV(name, brand);

  if (hit) {
    return res.json({ cached: true, product: hit });
  }
  return res.json({ cached: false, product: null });
});

// ── GET /api/cache/download ───────────────────────────────────────────────────
// Generates the CSV on-the-fly from Supabase — no filesystem needed.
router.get("/download", async (_req: Request, res: Response) => {
  try {
    const csvContent = await generateCSVContent();
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", 'attachment; filename="products_cache.csv"');
    res.send(csvContent);
  } catch (err) {
    console.error("❌ [cache] CSV download error:", err);
    res.status(500).json({ error: "Failed to generate CSV" });
  }
});

export default router;
