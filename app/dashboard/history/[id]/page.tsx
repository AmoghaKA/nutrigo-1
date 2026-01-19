"use client"

import React, { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  ArrowLeft,
  Calendar,
  Flame,
  Droplet,
  Beef,
  Apple,
  Wheat,
  AlertTriangle,
  List,
  Package,
  Sparkles,
  Trash2,
  Loader2,
} from "lucide-react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

interface ScanData {
  id: string
  user_id: string
  product_name?: string
  detected_name?: string
  brand?: string
  category?: string
  barcode?: string
  health_score?: number
  healthScore?: number
  calories?: number
  sugar?: number
  protein?: number
  fat?: number
  carbs?: number
  sodium?: number
  fiber?: number
  serving_size?: number
  ingredients?: string[]
  warnings?: string[]
  nutrition?: {
    calories?: number
    sugar?: number
    protein?: number
    fat?: number
    carbs?: number
    sodium?: number
    fiber?: number
    serving_size?: number
  }
  image_url?: string
  source?: string
  scanned_at?: string
  created_at?: string
}

export default function ScanDetailPage() {
  const params = useParams()
  const router = useRouter()
  const supabase = createClientComponentClient()
  const scanId = params.id as string

  const [scan, setScan] = useState<ScanData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    if (scanId) {
      fetchScanDetails()
    }
  }, [scanId])

  const fetchScanDetails = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/scans/${scanId}`)
      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to fetch scan details")
      }

      setScan(result.data)
    } catch (err: any) {
      console.error("Error fetching scan:", err)
      setError(err.message || "Failed to load scan details")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!scan) return

    const confirmed = window.confirm(
      "Are you sure you want to delete this scan? This action cannot be undone."
    )

    if (!confirmed) return

    try {
      setIsDeleting(true)

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      const response = await fetch(`/api/scans/${scanId}?userId=${user.id}`, {
        method: "DELETE",
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to delete scan")
      }

      router.push("/dashboard/history")
    } catch (err: any) {
      console.error("Error deleting scan:", err)
      alert(err.message || "Failed to delete scan")
    } finally {
      setIsDeleting(false)
    }
  }

  // ✅ HELPER TO GET NUTRITION VALUES (supports both formats)
  const getNutritionValue = (field: string): number | null => {
    if (!scan) return null
    
    // Check nested nutrition object first
    if (scan.nutrition && scan.nutrition[field as keyof typeof scan.nutrition] !== undefined) {
      return scan.nutrition[field as keyof typeof scan.nutrition] ?? null
    }
    
    // Fallback to flat fields
    return scan[field as keyof ScanData] as number ?? null
  }

  const getHealthScore = (data: ScanData): number => {
    return data.health_score ?? data.healthScore ?? 0
  }

  const getHealthScoreColor = (score: number) => {
    if (score >= 70) return { bg: "bg-emerald-500/20", text: "text-emerald-400", border: "border-emerald-500/40" }
    if (score >= 50) return { bg: "bg-yellow-500/20", text: "text-yellow-400", border: "border-yellow-500/40" }
    return { bg: "bg-red-500/20", text: "text-red-400", border: "border-red-500/40" }
  }

  const getHealthScoreLabel = (score: number) => {
    if (score >= 70) return "Healthy"
    if (score >= 50) return "Moderate"
    return "Unhealthy"
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
        <Card className="p-8 bg-slate-900/90 border-slate-700/50">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />
            <p className="text-slate-400 text-lg">Loading scan details...</p>
          </div>
        </Card>
      </div>
    )
  }

  if (error || !scan) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
        <Card className="p-8 bg-slate-900/90 border-red-500/30 max-w-md w-full">
          <div className="flex flex-col items-center gap-4 text-center">
            <AlertTriangle className="w-16 h-16 text-red-400" />
            <h2 className="text-2xl font-bold text-white">Scan Not Found</h2>
            <p className="text-slate-400">{error || "Unable to load scan details"}</p>
            <Button
              onClick={() => router.push("/dashboard/history")}
              className="mt-4 bg-emerald-500 hover:bg-emerald-600"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to History
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  const healthScore = getHealthScore(scan)
  const healthColors = getHealthScoreColor(healthScore)

  // ✅ GET NUTRITION VALUES
  const calories = getNutritionValue('calories')
  const sugar = getNutritionValue('sugar')
  const protein = getNutritionValue('protein')
  const fat = getNutritionValue('fat')
  const carbs = getNutritionValue('carbs')
  const fiber = getNutritionValue('fiber')
  const sodium = getNutritionValue('sodium')
  const serving_size = getNutritionValue('serving_size')

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
      </div>

      <div className="p-4 sm:p-6 md:p-8 lg:p-12 space-y-6 relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <Button
            onClick={() => router.push("/dashboard/history")}
            variant="outline"
            className="border-slate-700 hover:border-emerald-500/50 bg-slate-800/50 hover:bg-slate-800 text-slate-300"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to History
          </Button>

          <div className="flex gap-2">
            <Button
              onClick={handleDelete}
              disabled={isDeleting}
              variant="outline"
              className="border-red-500/30 hover:border-red-500/50 bg-red-500/10 hover:bg-red-500/20 text-red-400 disabled:opacity-50"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product Header Card */}
            <Card className="p-6 bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border-slate-700/50 shadow-xl">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Package className="w-5 h-5 text-emerald-400" />
                    <span className="text-sm text-slate-400">
                      {scan.category || "Food Product"}
                    </span>
                  </div>
                  <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">
                    {scan.product_name || scan.detected_name || "Unknown Product"}
                  </h1>
                  {scan.brand && scan.brand !== "—" && scan.brand !== "" && (
                    <p className="text-lg text-slate-400">
                      by <span className="text-emerald-400 font-semibold">{scan.brand}</span>
                    </p>
                  )}
                  {scan.scanned_at && (
                    <div className="flex items-center gap-2 mt-4 text-slate-500 text-sm">
                      <Calendar className="w-4 h-4" />
                      <span>
                        Scanned on{" "}
                        {new Date(scan.scanned_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}{" "}
                        at{" "}
                        {new Date(scan.scanned_at).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  )}
                </div>

                {/* Health Score Badge */}
                <div className={`flex-shrink-0 w-24 h-24 rounded-2xl flex flex-col items-center justify-center font-black border-2 ${healthColors.bg} ${healthColors.text} ${healthColors.border}`}>
                  <span className="text-3xl">{healthScore}</span>
                  <span className="text-xs font-semibold mt-1">
                    {getHealthScoreLabel(healthScore)}
                  </span>
                </div>
              </div>
            </Card>

            {/* Nutrition Facts Card */}
            <Card className="p-6 bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border-slate-700/50 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-black text-white">Nutrition Facts</h2>
              </div>

              {/* ✅ Check if ANY nutrition data exists */}
              {(calories !== null || sugar !== null || protein !== null || fat !== null || carbs !== null || fiber !== null || sodium !== null) ? (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {/* Calories */}
                    {calories !== null && (
                      <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-emerald-500/30 transition-colors">
                        <div className="flex items-center gap-2 mb-2">
                          <Flame className="w-5 h-5 text-orange-400" />
                          <span className="text-slate-400 text-sm">Calories</span>
                        </div>
                        <p className="text-2xl font-bold text-white">{calories}</p>
                        <p className="text-xs text-slate-500 mt-1">kcal</p>
                      </div>
                    )}

                    {/* Sugar */}
                    {sugar !== null && (
                      <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-pink-500/30 transition-colors">
                        <div className="flex items-center gap-2 mb-2">
                          <Droplet className="w-5 h-5 text-pink-400" />
                          <span className="text-slate-400 text-sm">Sugar</span>
                        </div>
                        <p className="text-2xl font-bold text-white">{sugar}g</p>
                        <p className="text-xs text-slate-500 mt-1">per serving</p>
                      </div>
                    )}

                    {/* Protein */}
                    {protein !== null && (
                      <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-red-500/30 transition-colors">
                        <div className="flex items-center gap-2 mb-2">
                          <Beef className="w-5 h-5 text-red-400" />
                          <span className="text-slate-400 text-sm">Protein</span>
                        </div>
                        <p className="text-2xl font-bold text-white">{protein}g</p>
                        <p className="text-xs text-slate-500 mt-1">per serving</p>
                      </div>
                    )}

                    {/* Fat */}
                    {fat !== null && (
                      <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-yellow-500/30 transition-colors">
                        <div className="flex items-center gap-2 mb-2">
                          <Apple className="w-5 h-5 text-yellow-400" />
                          <span className="text-slate-400 text-sm">Fat</span>
                        </div>
                        <p className="text-2xl font-bold text-white">{fat}g</p>
                        <p className="text-xs text-slate-500 mt-1">per serving</p>
                      </div>
                    )}

                    {/* Carbs */}
                    {carbs !== null && (
                      <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-amber-500/30 transition-colors">
                        <div className="flex items-center gap-2 mb-2">
                          <Wheat className="w-5 h-5 text-amber-400" />
                          <span className="text-slate-400 text-sm">Carbs</span>
                        </div>
                        <p className="text-2xl font-bold text-white">{carbs}g</p>
                        <p className="text-xs text-slate-500 mt-1">per serving</p>
                      </div>
                    )}

                    {/* Fiber */}
                    {fiber !== null && (
                      <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-green-500/30 transition-colors">
                        <div className="flex items-center gap-2 mb-2">
                          <Wheat className="w-5 h-5 text-green-400" />
                          <span className="text-slate-400 text-sm">Fiber</span>
                        </div>
                        <p className="text-2xl font-bold text-white">{fiber}g</p>
                        <p className="text-xs text-slate-500 mt-1">per serving</p>
                      </div>
                    )}

                    {/* Sodium */}
                    {sodium !== null && (
                      <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-purple-500/30 transition-colors">
                        <div className="flex items-center gap-2 mb-2">
                          <Droplet className="w-5 h-5 text-purple-400" />
                          <span className="text-slate-400 text-sm">Sodium</span>
                        </div>
                        <p className="text-2xl font-bold text-white">{sodium}mg</p>
                        <p className="text-xs text-slate-500 mt-1">per serving</p>
                      </div>
                    )}
                  </div>

                  {serving_size && (
                    <div className="mt-4 p-3 rounded-lg bg-slate-800/30 border border-slate-700/30">
                      <p className="text-sm text-slate-400">
                        Serving Size: <span className="text-white font-semibold">{serving_size}g</span>
                      </p>
                    </div>
                  )}
                </>
              ) : (
                /* Empty State when no nutrition data */
                <div className="py-12 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-800/50 border border-slate-700/50 flex items-center justify-center">
                    <AlertTriangle className="w-8 h-8 text-slate-500" />
                  </div>
                  <p className="text-slate-400 text-lg font-semibold mb-2">
                    No Nutrition Data Available
                  </p>
                  <p className="text-slate-500 text-sm max-w-md mx-auto">
                    This scan doesn't contain detailed nutrition information. The AI may not have detected a nutrition label in the image.
                  </p>
                </div>
              )}
            </Card>
          </div>

          {/* Right Column - Additional Info */}
          <div className="space-y-6">
            {/* Warnings Card */}
            {scan.warnings && scan.warnings.length > 0 && (
              <Card className="p-6 bg-gradient-to-br from-red-900/20 to-red-800/20 backdrop-blur-xl border-red-500/30 shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                  <AlertTriangle className="w-6 h-6 text-red-400" />
                  <h3 className="text-xl font-black text-white">Warnings</h3>
                </div>
                <ul className="space-y-2">
                  {scan.warnings.map((warning, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-red-300">
                      <span className="text-red-400 mt-1">•</span>
                      <span>{warning}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {/* Ingredients Card */}
            {scan.ingredients && scan.ingredients.length > 0 && (
              <Card className="p-6 bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border-slate-700/50 shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                  <List className="w-6 h-6 text-emerald-400" />
                  <h3 className="text-xl font-black text-white">Ingredients</h3>
                </div>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {scan.ingredients.map((ingredient, index) => (
                    <div
                      key={index}
                      className="px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700/30 text-sm text-slate-300 hover:border-emerald-500/30 transition-colors"
                    >
                      {ingredient}
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Additional Details */}
            <Card className="p-6 bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border-slate-700/50 shadow-xl">
              <h3 className="text-lg font-black text-white mb-4">Additional Details</h3>
              <div className="space-y-3 text-sm">
                {scan.barcode && (
                  <div>
                    <span className="text-slate-500">Barcode:</span>
                    <span className="text-white ml-2 font-mono">{scan.barcode}</span>
                  </div>
                )}
                {scan.source && (
                  <div>
                    <span className="text-slate-500">Source:</span>
                    <span className="text-white ml-2 capitalize">{scan.source}</span>
                  </div>
                )}
                <div>
                  <span className="text-slate-500">Scan ID:</span>
                  <span className="text-white ml-2 font-mono text-xs break-all">{scan.id}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
