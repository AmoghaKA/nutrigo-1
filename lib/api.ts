// API utility functions for NutriGo backend integration

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

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

export interface User {
  id: string
  name: string
  email: string
  createdAt: string
}

export interface ScanRecord {
  id: string
  userId: string
  productName: string
  brand: string
  healthScore: number
  calories: number
  sugar: number
  protein: number
  fat: number
  carbs: number
  ingredients: string[]
  warnings: string[]
  scannedAt: string
}

export interface HealthMetrics {
  totalScans: number
  healthyChoices: number
  averageScore: number
  currentStreak: number
}

async function parseJsonSafely<T>(response: Response): Promise<T> {
  const text = await response.text()
  const contentType = response.headers.get("content-type") || ""
  if (!contentType.includes("application/json")) {
    const errorMsg = text.includes("<!DOCTYPE") ? "Server returned HTML instead of JSON" : `Expected JSON but got ${contentType || "no content-type"}`
    throw new Error(`${errorMsg} (Status: ${response.status})`)
  }
  try {
    const parsed = JSON.parse(text) as T
    if (!response.ok) {
      // For non-200 responses, throw error with details for better logging
      const errMsg = (parsed as any)?.error || (parsed as any)?.message || `HTTP ${response.status}`
      console.warn(`⚠️ API Response Error (${response.status}):`, errMsg)
      throw new Error(errMsg)
    }
    return parsed
  } catch (e) {
    if (e instanceof Error) {
      throw e
    }
    throw new Error(`Failed to parse JSON response: ${text.slice(0, 300)}`)
  }
}

// ---------------- AUTH ----------------

export async function signUp(email: string, password: string, name: string): Promise<ApiResponse<User>> {
  try {
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name }),
    })
    return await parseJsonSafely<ApiResponse<User>>(res)
  } catch {
    return { success: false, error: "Failed to sign up" }
  }
}

export async function login(email: string, password: string): Promise<ApiResponse<User>> {
  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
    const parsed = await parseJsonSafely<ApiResponse<User>>(res)
    // Store user locally for non-Supabase mock flows
    if (parsed.success && parsed.data) {
      localStorage.setItem("currentUser", JSON.stringify(parsed.data))
    }
    return parsed
  } catch {
    return { success: false, error: "Failed to login" }
  }
}

export async function logout(): Promise<ApiResponse<null>> {
  try {
    localStorage.removeItem("currentUser")
    const res = await fetch("/api/auth/logout", { method: "POST" })
    return await parseJsonSafely<ApiResponse<null>>(res)
  } catch {
    return { success: false, error: "Failed to logout" }
  }
}

// ---------------- SCANS ----------------

export async function createScan(
  scanData: Omit<ScanRecord, "id" | "userId" | "scannedAt">,
  userId?: string
): Promise<ApiResponse<ScanRecord>> {
  try {
    const body = userId ? { ...scanData, userId } : scanData
    const res = await fetch("/api/scans", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    return await parseJsonSafely<ApiResponse<ScanRecord>>(res)
  } catch {
    return { success: false, error: "Failed to create scan" }
  }
}

export async function getScanHistory(userId?: string): Promise<ApiResponse<ScanRecord[]>> {
  try {
    const url = userId ? `/api/scans?userId=${encodeURIComponent(userId)}` : `/api/scans`
    const res = await fetch(url)
    return await parseJsonSafely<ApiResponse<ScanRecord[]>>(res)
  } catch {
    return { success: false, error: "Failed to fetch scan history" }
  }
}

export async function deleteScan(scanId: string, userId?: string): Promise<ApiResponse<null>> {
  try {
    const res = await fetch("/api/scans", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: scanId, userId }),
    })
    return await parseJsonSafely<ApiResponse<null>>(res)
  } catch {
    return { success: false, error: "Failed to delete scan" }
  }
}
// ---------------- COMPARISONS ----------------

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000"

export async function recalculateHealthScores(
  productIds: [string, string]
): Promise<ApiResponse<any>> {
  try {
    console.log("📤 Sending recalculate request with IDs:", productIds)
    const res = await fetch(`${BACKEND_URL}/api/compare/recalculate-scores`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productIds }),
    })
    
    const data = await parseJsonSafely<ApiResponse<any>>(res)
    console.log("✅ Recalculate response received:", data)
    return data
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : "Unknown error"
    console.error("❌ Failed to recalculate health scores:", errorMsg)
    console.error("   This typically means the products weren't found in the database.")
    console.error("   The comparison will continue with original scores.")
    return { 
      success: false, 
      error: `Failed to recalculate health scores: ${errorMsg}`
    }
  }
}