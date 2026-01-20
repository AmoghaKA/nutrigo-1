"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Calendar,
  Heart,
  Eye,
  HeartOff,
  Sparkles,
} from "lucide-react"

interface FavoriteScan {
  id: string
  name: string
  brand: string
  score: number
  category: string
  date: string
  calories: number
  sugar: number
  favorited_at: string
}

export default function FavoritesPage() {
  const supabase = createClientComponentClient()
  const router = useRouter()

  const [favorites, setFavorites] = useState<FavoriteScan[]>([])
  const [loading, setLoading] = useState(true)

  // Get current user ID
  const getCurrentUserId = async (): Promise<string | null> => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user?.id) return user.id
    } catch {}
    if (typeof window !== "undefined") {
      const keys = ["nutrigo_current_user", "currentUser", "user"]
      for (const key of keys) {
        const raw = localStorage.getItem(key)
        if (!raw) continue
        try {
          const parsed = JSON.parse(raw)
          if (parsed?.id) return parsed.id
        } catch {
          if (raw.startsWith("user_") || raw.length > 6) return raw
        }
      }
    }
    return null
  }

  // Fetch favorites from localStorage
  useEffect(() => {
    const fetchFavorites = async () => {
      setLoading(true)
      try {
        const userId = await getCurrentUserId()
        if (!userId) {
          console.warn("No user ID found — not fetching favorites")
          setFavorites([])
          return
        }

        // Get favorites from localStorage
        const favoritesKey = `favorites_${userId}`
        const storedFavorites = localStorage.getItem(favoritesKey)
        
        if (!storedFavorites) {
          setFavorites([])
          return
        }

        const favoriteIds: string[] = JSON.parse(storedFavorites)

        // Fetch scan details for each favorite
        const res = await fetch(`/api/scans?userId=${encodeURIComponent(userId)}`)
        if (!res.ok) throw new Error("Failed to fetch scans")

        const data = await res.json()
        if (data.success) {
          const allScans = data.data
          const favScans: FavoriteScan[] = favoriteIds
            .map((favId: string) => {
              const scan = allScans.find((s: any) => s.id === favId)
              if (!scan) return null

              const rawDate =
                scan.scanned_at ||
                scan.scannedAt ||
                scan.created_at ||
                scan.createdAt ||
                scan.timestamp ||
                null

              const parsedDate = rawDate ? new Date(rawDate) : null
              const date =
                parsedDate && !isNaN(parsedDate.getTime())
                  ? parsedDate.toISOString()
                  : new Date().toISOString()

              // ✅ Extract nutrition from nested object or flat fields
              const nutrition = scan.nutrition || {}
              const calories = nutrition.calories ?? scan.calories ?? 0
              const sugar = nutrition.sugar ?? scan.sugar ?? 0

              return {
                id: scan.id,
                name:
                  scan.productName ||
                  scan.detected_name ||
                  scan.name ||
                  scan.product_name ||
                  "Unnamed Product",
                brand: scan.brand || "",
                score: scan.health_score || scan.score || 0,
                category: scan.category || "General",
                date,
                calories,
                sugar,
                favorited_at: date,
              }
            })
            .filter(Boolean) as FavoriteScan[]

          setFavorites(favScans)
        }
      } catch (err) {
        console.error("Error fetching favorites:", err)
        setFavorites([])
      } finally {
        setLoading(false)
      }
    }

    fetchFavorites()
  }, [])

  const handleRemoveFavorite = async (id: string) => {
    try {
      const userId = await getCurrentUserId()
      if (!userId) {
        alert("Please log in to manage favorites.")
        return
      }

      const favoritesKey = `favorites_${userId}`
      const storedFavorites = localStorage.getItem(favoritesKey)
      const favoriteIds: string[] = storedFavorites ? JSON.parse(storedFavorites) : []

      // Remove from favorites
      const updatedFavorites = favoriteIds.filter((favId: string) => favId !== id)
      localStorage.setItem(favoritesKey, JSON.stringify(updatedFavorites))

      // Update state
      setFavorites((prev) => prev.filter((item) => item.id !== id))
    } catch (err) {
      console.error("Remove favorite failed:", err)
      alert("Could not remove favorite. Try again.")
    }
  }

  const handleViewDetails = (id: string) => {
    router.push(`/dashboard/history/${id}`)
  }

  const getScoreColor = (score: number) => {
    if (score >= 70) return "text-emerald-400"
    if (score >= 50) return "text-cyan-400"
    return "text-red-400"
  }

  const getScoreBg = (score: number) => {
    if (score >= 70) return "bg-emerald-500/20 border border-emerald-500/40"
    if (score >= 50) return "bg-cyan-500/20 border border-cyan-500/40"
    return "bg-red-500/20 border border-red-500/40"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Background Effects - Responsive */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 bg-pink-500/20 rounded-full blur-2xl sm:blur-3xl animate-pulse"></div>
        <div 
          className="absolute top-1/3 right-1/4 w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 lg:w-[500px] lg:h-[500px] bg-rose-500/15 rounded-full blur-2xl sm:blur-3xl animate-pulse"
          style={{ animationDelay: "1s", animationDuration: "4s" }}
        ></div>
        <div 
          className="absolute bottom-0 left-1/2 w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 bg-red-500/10 rounded-full blur-2xl sm:blur-3xl animate-pulse"
          style={{ animationDelay: "2s", animationDuration: "5s" }}
        ></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12 space-y-6 sm:space-y-8 relative z-10">
        {/* Header - Responsive */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-pink-400 via-rose-500 to-red-600 flex items-center justify-center shadow-lg shadow-pink-500/20 flex-shrink-0">
            <Heart className="text-white w-6 h-6 sm:w-7 sm:h-7 fill-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight">
              Your{" "}
              <span className="bg-gradient-to-r from-pink-400 via-rose-400 to-red-400 bg-clip-text text-transparent">
                Favorite Scans
              </span>
            </h1>
            <p className="text-slate-400 mt-1 text-xs sm:text-sm md:text-base">Quick access to your loved products</p>
          </div>
        </div>

        {/* Favorites List - Responsive */}
        <div className="space-y-3 sm:space-y-4">
          {loading ? (
            <Card className="p-8 sm:p-12 md:p-16 flex justify-center items-center bg-slate-900/60 backdrop-blur-md border border-slate-700/50">
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 border-4 border-pink-500/30 border-t-pink-500 rounded-full animate-spin"></div>
                <p className="text-slate-400 text-sm sm:text-base md:text-lg">Loading your favorites...</p>
              </div>
            </Card>
          ) : favorites.length > 0 ? (
            favorites.map((item) => (
              <Card
                key={item.id}
                className="p-4 sm:p-5 md:p-6 bg-slate-900/70 backdrop-blur-md border border-slate-700/50 hover:border-pink-500/40 hover:shadow-lg hover:shadow-pink-500/5 transition-all duration-300 group cursor-pointer"
                onClick={() => handleViewDetails(item.id)}
              >
                <div className="flex flex-col gap-3 sm:gap-4">
                  {/* Header Row */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1.5 sm:mb-2">
                        <h3 className="font-bold text-white text-sm sm:text-base md:text-lg truncate">
                          {item.name}
                        </h3>
                        <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md bg-slate-800/80 border border-slate-700/50 text-slate-400 text-[10px] sm:text-xs font-semibold whitespace-nowrap">
                          {item.category}
                        </span>
                      </div>
                      {item.brand && (
                        <p className="text-xs sm:text-sm text-slate-400 mb-2 sm:mb-3 truncate">{item.brand}</p>
                      )}
                    </div>

                    {/* Score and Action Buttons */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <div
                        className={`px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 md:py-2.5 rounded-lg font-black text-lg sm:text-xl md:text-2xl ${getScoreBg(
                          item.score
                        )} ${getScoreColor(item.score)} shadow-md`}
                      >
                        {item.score}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-slate-500 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all p-2 rounded-lg"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleViewDetails(item.id)
                        }}
                      >
                        <Eye size={16} className="sm:w-[18px] sm:h-[18px]" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-pink-400 hover:text-red-400 hover:bg-red-500/10 transition-all p-2 rounded-lg"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleRemoveFavorite(item.id)
                        }}
                      >
                        <HeartOff size={16} className="sm:w-[18px] sm:h-[18px]" />
                      </Button>
                    </div>
                  </div>

                  {/* Info Row */}
                  <div className="flex flex-wrap gap-3 sm:gap-4 text-[10px] sm:text-xs md:text-sm text-slate-400 pt-2 border-t border-slate-800/50">
                    <span className="flex items-center gap-1.5 sm:gap-2">
                      <Calendar size={12} className="sm:w-[14px] sm:h-[14px] text-pink-400 flex-shrink-0" />
                      <span className="whitespace-nowrap">
                        Added {new Date(item.favorited_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </span>
                    <span className="flex items-center gap-1.5 sm:gap-2">
                      <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-pink-400 flex-shrink-0"></span>
                      <span className="whitespace-nowrap">{item.calories} cal</span>
                    </span>
                    <span className="flex items-center gap-1.5 sm:gap-2">
                      <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-rose-400 flex-shrink-0"></span>
                      <span className="whitespace-nowrap">{item.sugar}g sugar</span>
                    </span>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <Card className="p-8 sm:p-12 md:p-16 flex flex-col justify-center items-center bg-slate-900/60 backdrop-blur-md border border-slate-700/50 text-center space-y-4 sm:space-y-6">
              <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-pink-500 via-rose-500 to-red-600 flex items-center justify-center shadow-lg shadow-pink-500/20">
                <Heart size={28} className="sm:w-8 sm:h-8 text-white fill-white" />
              </div>
              <div className="space-y-2">
                <p className="text-slate-300 text-base sm:text-lg md:text-xl font-semibold">
                  No favorites yet
                </p>
                <p className="text-slate-500 text-xs sm:text-sm md:text-base max-w-md px-4">
                  Start adding products to your favorites to quickly access your most loved scans!
                </p>
              </div>
              <Button
                onClick={() => router.push("/dashboard/scanner")}
                className="mt-4 bg-gradient-to-r from-pink-500 via-rose-500 to-red-500 hover:from-pink-400 hover:via-rose-400 hover:to-red-400 text-white font-bold shadow-lg shadow-pink-500/30"
              >
                <Sparkles size={16} className="mr-2" />
                Scan Your First Product
              </Button>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
