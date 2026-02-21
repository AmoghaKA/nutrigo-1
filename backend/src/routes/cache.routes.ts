/**
 * cache.routes.ts
 *
 * Exposes the CSV product cache over HTTP:
 *   GET  /api/cache              → paginated list of all cached products
 *   GET  /api/cache/download     → download the raw products_cache.csv file
 *   GET  /api/cache/lookup?name=<name>&brand=<brand>
 *                                → check whether a product is cached
 */

import express, { Request, Response } from "express";
import path from "path";
import { getAllCachedProducts, lookupInCSV, getCSVPath } from "../utils/csvCache";

const router = express.Router();

// ── GET /api/cache ─────────────────────────────────────────────────────────────
// Returns all cached products with optional pagination.
router.get("/", (req: Request, res: Response) => {
  try {
    const products = getAllCachedProducts();
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
// Check if a specific product is already cached.
// Query params: name (required), brand (optional)
router.get("/lookup", (req: Request, res: Response) => {
  const name  = (req.query.name  as string || "").trim();
  const brand = (req.query.brand as string || "").trim() || undefined;

  if (!name) {
    return res.status(400).json({ error: "Query param 'name' is required" });
  }

  const hit = lookupInCSV(name, brand);

  if (hit) {
    return res.json({ cached: true, product: hit });
  }
  return res.json({ cached: false, product: null });
});

// ── GET /api/cache/download ───────────────────────────────────────────────────
// Download the raw CSV file.
router.get("/download", (_req: Request, res: Response) => {
  const csvPath = getCSVPath();
  res.download(csvPath, "products_cache.csv", (err) => {
    if (err) {
      console.error("❌ [cache] CSV download error:", err);
      if (!res.headersSent) {
        res.status(500).json({ error: "Failed to download CSV" });
      }
    }
  });
});

export default router;
