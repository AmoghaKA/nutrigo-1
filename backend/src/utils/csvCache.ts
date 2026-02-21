/**
 * csvCache.ts
 *
 * Supabase-backed product cache.
 *
 * WHY the old filesystem CSV broke on deployment:
 *   Local files are wiped on every deploy on Vercel, Railway, Render, Heroku, etc.
 *   Supabase is persistent across all deployments.
 *
 * Public API (unchanged — no other file needs editing):
 *   lookupInCSV(name, brand?)   → Promise<CachedProduct | null>
 *   saveToCSV(product)          → Promise<void>
 *   getAllCachedProducts()       → Promise<CachedProduct[]>
 *   generateCSVContent()        → Promise<string>   (for download route)
 *   getCSVPath()                → string            (legacy compat shim)
 */

import { supabase } from "../lib/supabase";

// ── Supabase table name ───────────────────────────────────────────────────────
const TABLE = "products_cache";

// ── Types ─────────────────────────────────────────────────────────────────────
export interface CachedProduct {
  name: string;
  brand: string;
  category: string;
  calories: number;
  fat: number;
  sugar: number;
  protein: number;
  carbs: number;
  sodium: number;
  fiber: number;
  ingredients: string[];
  warnings: string[];
  health_score: number;
  created_at: string;
}

// ── Internal helpers ──────────────────────────────────────────────────────────

function normalise(str: string): string {
  return str.trim().toLowerCase().replace(/\s+/g, " ");
}

/** Map a raw Supabase row → CachedProduct */
function rowToProduct(row: any): CachedProduct {
  return {
    name:         row.name         ?? "",
    brand:        row.brand        ?? "",
    category:     row.category     ?? "",
    calories:     Number(row.calories)   || 0,
    fat:          Number(row.fat)        || 0,
    sugar:        Number(row.sugar)      || 0,
    protein:      Number(row.protein)    || 0,
    carbs:        Number(row.carbs)      || 0,
    sodium:       Number(row.sodium)     || 0,
    fiber:        Number(row.fiber)      || 0,
    ingredients:  Array.isArray(row.ingredients) ? row.ingredients : [],
    warnings:     Array.isArray(row.warnings)    ? row.warnings    : [],
    health_score: Number(row.health_score)        || 0,
    created_at:   row.created_at ?? new Date().toISOString(),
  };
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Look up a product by name (case-insensitive) and optional brand.
 * Reads from Supabase — survives all deployments.
 */
export async function lookupInCSV(
  name: string,
  brand?: string
): Promise<CachedProduct | null> {
  try {
    const normName = normalise(name);

    let query = supabase
      .from(TABLE)
      .select("*")
      .ilike("name", normName)
      .limit(1);

    if (brand && brand.trim()) {
      query = query.ilike("brand", brand.trim());
    }

    const { data, error } = await query.maybeSingle();

    if (error) {
      console.error("❌ [csvCache] lookupInCSV error:", error.message);
      return null;
    }

    if (!data) return null;

    console.log(`📂 [csvCache] Cache HIT: "${name}" (${brand ?? "any brand"})`);
    return rowToProduct(data);
  } catch (err) {
    console.error("❌ [csvCache] lookupInCSV error:", err);
    return null;
  }
}

/**
 * Save/update a scanned product in Supabase.
 * Uses upsert on (name, brand) — re-scanning the same product updates the row.
 */
export async function saveToCSV(product: CachedProduct): Promise<void> {
  try {
    const row = {
      name:         product.name.trim(),
      brand:        product.brand.trim(),
      category:     product.category,
      calories:     product.calories,
      fat:          product.fat,
      sugar:        product.sugar,
      protein:      product.protein,
      carbs:        product.carbs,
      sodium:       product.sodium,
      fiber:        product.fiber,
      ingredients:  product.ingredients,
      warnings:     product.warnings,
      health_score: product.health_score,
      created_at:   product.created_at || new Date().toISOString(),
    };

    const { error } = await supabase
      .from(TABLE)
      .upsert([row], { onConflict: "name,brand" });

    if (error) {
      console.error("❌ [csvCache] saveToCSV error:", error.message);
    } else {
      console.log(
        `✅ [csvCache] Upserted: "${product.name}" (${product.brand}) → health_score: ${product.health_score}`
      );
    }
  } catch (err) {
    console.error("❌ [csvCache] saveToCSV error:", err);
  }
}

/**
 * Return all cached products (for admin / list endpoints).
 */
export async function getAllCachedProducts(): Promise<CachedProduct[]> {
  try {
    const { data, error } = await supabase
      .from(TABLE)
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("❌ [csvCache] getAllCachedProducts error:", error.message);
      return [];
    }

    return (data ?? []).map(rowToProduct);
  } catch (err) {
    console.error("❌ [csvCache] getAllCachedProducts error:", err);
    return [];
  }
}

/**
 * Generate CSV text on-the-fly from Supabase data.
 * Used by the /api/cache/download endpoint — no filesystem required.
 */
export async function generateCSVContent(): Promise<string> {
  const products = await getAllCachedProducts();

  const header =
    "name,brand,category,calories,fat,sugar,protein,carbs,sodium,fiber," +
    "ingredients,warnings,health_score,created_at\n";

  const q = (s: string) => `"${String(s).replace(/"/g, '""')}"`;

  const rows = products.map((p) =>
    [
      q(p.name),
      q(p.brand),
      q(p.category),
      p.calories,
      p.fat,
      p.sugar,
      p.protein,
      p.carbs,
      p.sodium,
      p.fiber,
      q(JSON.stringify(p.ingredients)),
      q(JSON.stringify(p.warnings)),
      p.health_score,
      q(p.created_at),
    ].join(",")
  );

  return header + rows.join("\n") + "\n";
}

/**
 * Legacy shim — callers expecting a file path will get an informational string.
 * The real data now lives in Supabase.
 */
export function getCSVPath(): string {
  return "[Supabase-backed — use /api/cache/download for the CSV]";
}
