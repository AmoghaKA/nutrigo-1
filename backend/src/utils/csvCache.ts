/**
 * csvCache.ts
 *
 * CSV-based product cache.
 * Every scanned product (from any user) is stored here with its full nutritional
 * data and computed health score. The next scan of the same product hits the CSV
 * first, skipping the LLM call entirely.
 *
 * CSV columns (all quoted when written):
 *   name | brand | category | calories | fat | sugar | protein | carbs |
 *   sodium | fiber | ingredients | warnings | health_score | created_at
 */

import fs from "fs";
import path from "path";

// ── File path ─────────────────────────────────────────────────────────────────
const DATA_DIR  = path.join(__dirname, "../../data");
const CSV_PATH  = path.join(DATA_DIR, "products_cache.csv");

const CSV_HEADER =
  "name,brand,category,calories,fat,sugar,protein,carbs,sodium,fiber,ingredients,warnings,health_score,created_at\n";

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

/** Normalise a product identifier for case-insensitive matching. */
function normalise(str: string): string {
  return str.trim().toLowerCase().replace(/\s+/g, " ");
}

/** Wrap a value in double-quotes (escaping any embedded quotes). */
function csvQuote(value: string): string {
  const escaped = value.replace(/"/g, '""');
  return `"${escaped}"`;
}

/** Parse one CSV row, respecting quoted fields that may contain commas. */
function parseCSVRow(row: string): string[] {
  const result: string[] = [];
  let current = "";
  let insideQuotes = false;

  for (let i = 0; i < row.length; i++) {
    const ch = row[i];
    if (ch === '"') {
      if (insideQuotes && row[i + 1] === '"') {
        // Escaped double-quote inside a quoted field
        current += '"';
        i++;
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (ch === "," && !insideQuotes) {
      result.push(current);
      current = "";
    } else {
      current += ch;
    }
  }
  result.push(current);
  return result;
}

/** Parse all CSV rows into CachedProduct objects (skips header). */
function parseCSV(): CachedProduct[] {
  ensureFile();
  const raw = fs.readFileSync(CSV_PATH, "utf-8");
  const lines = raw.split("\n").filter((l) => l.trim() !== "");
  const products: CachedProduct[] = [];

  // Skip the header row
  for (let i = 1; i < lines.length; i++) {
    const cols = parseCSVRow(lines[i]);
    if (cols.length < 14) continue; // corrupted row — skip
    try {
      products.push({
        name:         cols[0],
        brand:        cols[1],
        category:     cols[2],
        calories:     parseFloat(cols[3]) || 0,
        fat:          parseFloat(cols[4]) || 0,
        sugar:        parseFloat(cols[5]) || 0,
        protein:      parseFloat(cols[6]) || 0,
        carbs:        parseFloat(cols[7]) || 0,
        sodium:       parseFloat(cols[8]) || 0,
        fiber:        parseFloat(cols[9]) || 0,
        ingredients:  safeParseArray(cols[10]),
        warnings:     safeParseArray(cols[11]),
        health_score: parseFloat(cols[12]) || 0,
        created_at:   cols[13],
      });
    } catch {
      // Skip malformed rows silently
    }
  }
  return products;
}

function safeParseArray(val: string): string[] {
  try {
    const parsed = JSON.parse(val);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return val ? [val] : [];
  }
}

/** Ensure the data directory and CSV file (with header) exist. */
function ensureFile(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(CSV_PATH)) {
    fs.writeFileSync(CSV_PATH, CSV_HEADER, "utf-8");
  }
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Look up a product by name (and optionally brand) in the CSV cache.
 * Returns the cached entry or null if not found.
 */
export function lookupInCSV(
  name: string,
  brand?: string
): CachedProduct | null {
  try {
    const products = parseCSV();
    const normName  = normalise(name);
    const normBrand = brand ? normalise(brand) : null;

    const match = products.find((p) => {
      const nameMatch  = normalise(p.name) === normName;
      const brandMatch = normBrand
        ? normalise(p.brand) === normBrand
        : true; // if no brand supplied, match on name only
      return nameMatch && brandMatch;
    });

    return match ?? null;
  } catch (err) {
    console.error("❌ [csvCache] lookupInCSV error:", err);
    return null;
  }
}

/**
 * Save a scanned product to the CSV cache.
 * If a row with the same normalised name+brand already exists, it is updated
 * in-place; otherwise a new row is appended.
 */
export function saveToCSV(product: CachedProduct): void {
  try {
    ensureFile();
    const products  = parseCSV();
    const normName  = normalise(product.name);
    const normBrand = normalise(product.brand);

    const existingIdx = products.findIndex(
      (p) =>
        normalise(p.name) === normName &&
        normalise(p.brand) === normBrand
    );

    if (existingIdx !== -1) {
      // Update existing entry
      products[existingIdx] = {
        ...products[existingIdx],
        ...product,
        created_at: products[existingIdx].created_at, // keep original timestamp
      };
      rewriteCSV(products);
      console.log(`✅ [csvCache] Updated cache entry: ${product.name} (${product.brand})`);
    } else {
      // Append new entry
      const row = buildRow(product);
      fs.appendFileSync(CSV_PATH, row, "utf-8");
      console.log(`✅ [csvCache] Saved new cache entry: ${product.name} (${product.brand})`);
    }
  } catch (err) {
    console.error("❌ [csvCache] saveToCSV error:", err);
  }
}

/** Build a single CSV row string from a CachedProduct. */
function buildRow(p: CachedProduct): string {
  const cols = [
    csvQuote(p.name),
    csvQuote(p.brand),
    csvQuote(p.category),
    String(p.calories),
    String(p.fat),
    String(p.sugar),
    String(p.protein),
    String(p.carbs),
    String(p.sodium),
    String(p.fiber),
    csvQuote(JSON.stringify(p.ingredients)),
    csvQuote(JSON.stringify(p.warnings)),
    String(p.health_score),
    csvQuote(p.created_at || new Date().toISOString()),
  ];
  return cols.join(",") + "\n";
}

/** Rewrite the entire CSV file (used when updating an existing row). */
function rewriteCSV(products: CachedProduct[]): void {
  let content = CSV_HEADER;
  for (const p of products) {
    content += buildRow(p);
  }
  fs.writeFileSync(CSV_PATH, content, "utf-8");
}

/**
 * Return the path of the CSV cache file (useful for serving/downloading).
 */
export function getCSVPath(): string {
  ensureFile();
  return CSV_PATH;
}

/**
 * Return all cached products as an array (for admin/debug routes).
 */
export function getAllCachedProducts(): CachedProduct[] {
  try {
    return parseCSV();
  } catch {
    return [];
  }
}
