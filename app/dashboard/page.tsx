"use client"

import { useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  ArrowRight,
  Target,
  Sparkles,
  Activity,
  Flame,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"
import Link from "next/link"
import { RecentScans } from "./RecentScans"

interface ScanHistory {
  id: string
  productName: string
  brand: string
  healthScore: number
  category: string
  scannedAt: string
  calories: number
  sugar: number
}

interface DashboardStats {
  totalScans: number
  healthyChoices: number
  averageScore: number
  streak: number
  weeklyData: Array<{
    day: string
    scans: number
    healthy: number
    avgScore: number
  }>
  recentScans: ScanHistory[]
}

// --- FIXED: streak calculation that properly checks continuous days ---
function calculateStreak(scans: ScanHistory[]): number {
  if (!scans.length) return 0

  // normalize and sort unique scan days
  const uniqueDays = Array.from(
    new Set(
      scans.map((scan) => {
        const d = new Date(scan.scannedAt)
        d.setHours(0, 0, 0, 0)
        return d.getTime()
      })
    )
  ).sort((a, b) => b - a)

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  let streak = 0
  let currentDate = today.getTime()

  for (let i = 0; i < uniqueDays.length; i++) {
    if (uniqueDays[i] === currentDate) {
      streak++
      currentDate -= 86400000 // move to previous day
    } else if (uniqueDays[i] === currentDate - 86400000) {
      streak++
      currentDate -= 86400000
    } else if (uniqueDays[i] < currentDate - 86400000) {
      break // gap found
    }
  }

  return streak
}

// --- Weekly chart helper ---
function processWeeklyData(scans: ScanHistory[]) {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  const today = new Date()
  const weekData = new Array(7).fill(null).map((_, i) => {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    date.setHours(0, 0, 0, 0)

    const dayScans = scans.filter((scan) => {
      const scanDate = new Date(scan.scannedAt)
      scanDate.setHours(0, 0, 0, 0)
      return scanDate.getTime() === date.getTime()
    })

    const totalHealth = dayScans.reduce((sum, s) => sum + (s.healthScore || 0), 0)
    const avgScore = dayScans.length > 0 ? Math.round(totalHealth / dayScans.length) : 0

    return {
      day: days[date.getDay()],
      scans: dayScans.length,
      healthy: dayScans.filter((s) => s.healthScore >= 70).length,
      avgScore,
    }
  })
  return weekData.reverse()
}

export default function DashboardPage() {
  const supabase = createClientComponentClient()
  const router = useRouter()
  const [userName, setUserName] = useState("User")
  const [authError, setAuthError] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    totalScans: 0,
    healthyChoices: 0,
    averageScore: 0,
    streak: 0,
    weeklyData: [],
    recentScans: [],
  })

  // ✅ Responsive chart height based on screen size
  const [isMobile, setIsMobile] = useState(false)
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    const fetchDashboardData = async (userId: string) => {
      try {
        const response = await fetch(`/api/scans?userId=${encodeURIComponent(userId)}`)
        if (!response.ok) throw new Error("Failed to fetch scan data")
        const data = await response.json()
        if (!data.success) throw new Error("Invalid scan data response")

        // ✅ Normalize Supabase data and fix timestamps
        const scans: ScanHistory[] = data.data.map((s: any) => {
          const rawDate =
            s.scanned_at ||
            s.scannedAt ||
            s.created_at ||
            s.createdAt ||
            s.timestamp ||
            s.updated_at ||
            s.updatedAt ||
            null
          const parsedDate = rawDate ? new Date(rawDate) : new Date()
          const scannedAt =
            parsedDate && !isNaN(parsedDate.getTime())
              ? parsedDate.toISOString()
              : new Date().toISOString()

          return {
            id: s.id,
            productName:
              s.product_name ||
              s.detected_name ||
              s.name ||
              s.brand ||
              "Unnamed Product",
            brand: s.brand || "—",
            healthScore: s.health_score || s.healthScore || 0,
            category: s.category || "General",
            scannedAt,
            calories: s.calories || 0,
            sugar: s.sugar || 0,
          }
        })

        const totalScans = scans.length
        const healthyChoices = scans.filter((s) => s.healthScore >= 70).length
        const averageScore =
          totalScans > 0
            ? Math.round(scans.reduce((sum, s) => sum + s.healthScore, 0) / totalScans)
            : 0

        setDashboardStats({
          totalScans,
          healthyChoices,
          averageScore,
          streak: calculateStreak(scans), // ✅ fixed streak logic
          weeklyData: processWeeklyData(scans),
          recentScans: scans
            .sort(
              (a, b) =>
                new Date(b.scannedAt).getTime() - new Date(a.scannedAt).getTime()
            )
            .slice(0, 4),
        })
      } catch (err) {
        console.error("Error fetching dashboard data:", err)
        setDashboardStats({
          totalScans: 0,
          healthyChoices: 0,
          averageScore: 0,
          streak: 0,
          weeklyData: [],
          recentScans: [],
        })
      }
    }

    const fetchUser = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()
        if (!session) {
          router.push("/auth/login")
          return
        }

        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (!user) {
          setAuthError("User not found. Please log in again.")
          router.push("/auth/login")
          return
        }

        const fullName =
          user.user_metadata?.full_name || user.user_metadata?.display_name
        if (fullName) {
          setUserName(fullName)
        } else if (user.email) {
          const namePart = user.email.split("@")[0]
          setUserName(namePart.charAt(0).toUpperCase() + namePart.slice(1))
        }

        await fetchDashboardData(user.id)
      } catch (err) {
        console.error("Auth error:", err)
        setAuthError("Authentication failed. Please log in again.")
        router.push("/auth/login")
      } finally {
        setIsLoading(false)
      }
    }

    fetchUser()
  }, [supabase, router])

  if (authError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
        <Card className="p-6 sm:p-8 border border-red-500/40 bg-slate-900/80 backdrop-blur-md rounded-xl shadow-xl max-w-md w-full">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-red-500/20 flex items-center justify-center">
              <Activity className="text-red-400" size={28} />
            </div>
            <div>
              <p className="text-white text-base sm:text-lg font-semibold mb-2">{authError}</p>
              <p className="text-slate-400 text-xs sm:text-sm">Redirecting to login...</p>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 sm:w-16 sm:h-16 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin"></div>
          <p className="text-slate-300 text-base sm:text-lg">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Enhanced Background Effects - Responsive */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 bg-emerald-500/20 rounded-full blur-2xl sm:blur-3xl animate-pulse"></div>
        <div
          className="absolute top-1/3 right-1/4 w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 lg:w-[500px] lg:h-[500px] bg-teal-500/15 rounded-full blur-2xl sm:blur-3xl animate-pulse"
          style={{ animationDelay: "1s", animationDuration: "4s" }}
        ></div>
        <div
          className="absolute bottom-0 left-1/2 w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 bg-cyan-500/10 rounded-full blur-2xl sm:blur-3xl animate-pulse"
          style={{ animationDelay: "2s", animationDuration: "5s" }}
        ></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12 space-y-6 sm:space-y-8 relative z-10">
        {/* Enhanced Header - Responsive */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Sparkles className="text-white" size={20} />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight">
              Welcome back,{" "}
              <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                {userName}
              </span>
              !
            </h1>
            <p className="text-slate-400 mt-1 text-xs sm:text-sm md:text-base">Here's your health journey overview</p>
          </div>
        </div>

        {/* Enhanced Stats Grid - Fully Responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          <StatCard 
            title="Total Scans" 
            value={dashboardStats.totalScans}
            mainStat="Scanned Items"
            description="Products tracked"
            icon={<Zap />} 
            color="emerald"
            trend={dashboardStats.totalScans > 0 ? "up" : "neutral"}
            trendValue={dashboardStats.totalScans}
          />
          <StatCard
            title="Healthy Choices"
            value={dashboardStats.healthyChoices}
            mainStat="Nutritious Picks"
            description={`${Math.round(
              (dashboardStats.healthyChoices / (dashboardStats.totalScans || 1)) * 100
            )}% success rate`}
            icon={<Target />}
            color="teal"
            trend="up"
            trendValue={Math.round(
              (dashboardStats.healthyChoices / (dashboardStats.totalScans || 1)) * 100
            )}
          />
          <StatCard
            title="Avg Health Score"
            value={dashboardStats.averageScore}
            mainStat="Health Metric"
            description="Out of 100 points"
            icon={<Activity />}
            color="cyan"
            trend={dashboardStats.averageScore >= 70 ? "up" : dashboardStats.averageScore >= 50 ? "neutral" : "down"}
            trendValue={dashboardStats.averageScore}
          />
          <StatCard
            title="Current Streak"
            value={dashboardStats.streak}
            mainStat={dashboardStats.streak > 0 ? "Days in a Row" : "No Streak Yet"}
            description={dashboardStats.streak > 0 ? "Keep it going! 🔥" : "Start scanning"}
            icon={<Flame />}
            color="emerald"
            trend={dashboardStats.streak > 0 ? "up" : "neutral"}
            trendValue={dashboardStats.streak}
          />
        </div>

        {/* Enhanced Charts Section - Mobile Optimized */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <ChartCard title="Weekly Activity" subtitle="Scan patterns over the last 7 days">
            <ResponsiveContainer width="100%" height={isMobile ? 220 : 280}>
              <BarChart 
                data={dashboardStats.weeklyData}
                margin={{ 
                  top: 10, 
                  right: isMobile ? 5 : 10, 
                  left: isMobile ? -25 : -20, 
                  bottom: 5 
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.5} />
                <XAxis 
                  dataKey="day" 
                  stroke="#94a3b8" 
                  fontSize={isMobile ? 10 : 11} 
                  tickLine={false}
                />
                <YAxis 
                  stroke="#94a3b8" 
                  fontSize={isMobile ? 10 : 11} 
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip 
                  contentStyle={{ 
                    background: "rgba(15, 23, 42, 0.95)", 
                    borderRadius: 8,
                    border: "1px solid rgba(148, 163, 184, 0.2)",
                    backdropFilter: "blur(10px)",
                    fontSize: isMobile ? 11 : 12
                  }}
                  cursor={{ fill: "rgba(16, 185, 129, 0.1)" }}
                />
                <Bar 
                  dataKey="scans" 
                  fill="#10b981" 
                  radius={[6, 6, 0, 0]}
                  name="Total Scans"
                />
                <Bar 
                  dataKey="healthy" 
                  fill="#06b6d4" 
                  radius={[6, 6, 0, 0]}
                  name="Healthy"
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Health Score Trend" subtitle="Your average health score over time">
            <ResponsiveContainer width="100%" height={isMobile ? 220 : 280}>
              <LineChart 
                data={dashboardStats.weeklyData}
                margin={{ 
                  top: 10, 
                  right: isMobile ? 5 : 10, 
                  left: isMobile ? -25 : -20, 
                  bottom: 5 
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.5} />
                <XAxis 
                  dataKey="day" 
                  stroke="#94a3b8" 
                  fontSize={isMobile ? 10 : 11}
                  tickLine={false}
                />
                <YAxis 
                  stroke="#94a3b8" 
                  fontSize={isMobile ? 10 : 11}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip 
                  contentStyle={{ 
                    background: "rgba(15, 23, 42, 0.95)", 
                    borderRadius: 8,
                    border: "1px solid rgba(148, 163, 184, 0.2)",
                    backdropFilter: "blur(10px)",
                    fontSize: isMobile ? 11 : 12
                  }}
                  cursor={{ stroke: "rgba(20, 184, 166, 0.3)", strokeWidth: 2 }}
                />
                <Line
                  type="monotone"
                  dataKey="avgScore"
                  stroke="#14b8a6"
                  strokeWidth={isMobile ? 2 : 3}
                  dot={{ fill: "#14b8a6", r: isMobile ? 3 : 5, strokeWidth: 2, stroke: "#0f172a" }}
                  activeDot={{ r: isMobile ? 5 : 7, strokeWidth: 2 }}
                  name="Avg Score"
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <RecentScans scans={dashboardStats.recentScans} />

        {/* CTA Banner - Fully Responsive */}
        <div className="relative p-6 sm:p-8 md:p-10 rounded-xl sm:rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 overflow-hidden shadow-xl">
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-0 right-0 w-48 h-48 sm:w-64 sm:h-64 bg-emerald-500/20 rounded-full blur-2xl sm:blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 sm:w-64 sm:h-64 bg-cyan-500/20 rounded-full blur-2xl sm:blur-3xl"></div>
          </div>
          <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-6">
            <div className="space-y-1.5 sm:space-y-2 flex-1">
              <h3 className="text-2xl sm:text-3xl font-black text-white">Ready to scan now?</h3>
              <p className="text-slate-400 text-sm sm:text-base md:text-lg">Start analyzing your packaged food instantly for nutrition insights</p>
            </div>
            <Link href="/dashboard/scanner" className="w-full md:w-auto">
              <Button className="w-full md:w-auto bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:via-teal-400 hover:to-cyan-400 text-white font-bold px-6 sm:px-8 py-3 sm:py-4 md:py-6 shadow-xl shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all duration-300 border-0 text-base sm:text-lg whitespace-nowrap">
                Scan Now
                <ArrowRight size={18} className="sm:w-5 sm:h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

// 🧩 Enhanced Stat Card Component - Mobile Optimized
function StatCard({ 
  title, 
  value, 
  mainStat,
  description,
  icon, 
  color,
  trend,
  trendValue
}: {
  title: string
  value: number
  mainStat: string
  description: string
  icon: React.ReactNode
  color: "emerald" | "teal" | "cyan"
  trend: "up" | "down" | "neutral"
  trendValue: number
}) {
  const colorMap: any = {
    emerald: {
      gradient: "from-emerald-500 to-teal-600",
      glow: "group-hover:shadow-emerald-500/20",
      border: "group-hover:border-emerald-500/30",
      bg: "bg-emerald-500/10",
      text: "text-emerald-400"
    },
    teal: {
      gradient: "from-teal-500 to-cyan-600",
      glow: "group-hover:shadow-teal-500/20",
      border: "group-hover:border-teal-500/30",
      bg: "bg-teal-500/10",
      text: "text-teal-400"
    },
    cyan: {
      gradient: "from-cyan-500 to-blue-600",
      glow: "group-hover:shadow-cyan-500/20",
      border: "group-hover:border-cyan-500/30",
      bg: "bg-cyan-500/10",
      text: "text-cyan-400"
    },
  }

  return (
    <Card className={`group p-4 sm:p-5 md:p-6 bg-slate-900/70 backdrop-blur-md border border-slate-700/50 ${colorMap[color].border} ${colorMap[color].glow} hover:shadow-lg transition-all duration-300 relative overflow-hidden`}>
      {/* Card Background Glow */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${colorMap[color].bg} -z-10`}></div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <span className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-widest">{title}</span>
          <div className={`w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-lg bg-gradient-to-br ${colorMap[color].gradient} flex items-center justify-center shadow-md`}>
            <div className="text-white [&>svg]:w-4 [&>svg]:h-4 sm:[&>svg]:w-5 sm:[&>svg]:h-5">
              {icon}
            </div>
          </div>
        </div>

        {/* Main Value and Stat Name */}
        <div className="mb-2 sm:mb-3">
          <p className="text-3xl sm:text-4xl md:text-5xl font-black bg-gradient-to-br from-white to-slate-300 bg-clip-text text-transparent mb-1">
            {value}
          </p>
          <p className="text-xs sm:text-sm font-semibold text-slate-300">{mainStat}</p>
        </div>

        {/* Description and Trend */}
        <div className="flex items-center justify-between pt-2 sm:pt-3 border-t border-slate-700/50">
          <p className="text-[10px] sm:text-xs text-slate-400 truncate pr-2">{description}</p>
          <div className={`flex items-center gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md text-[10px] sm:text-xs font-semibold flex-shrink-0 ${
            trend === "up" ? "bg-emerald-500/20 text-emerald-400" :
            trend === "down" ? "bg-red-500/20 text-red-400" :
            "bg-slate-500/20 text-slate-400"
          }`}>
            {trend === "up" && <ArrowUpRight size={12} className="sm:w-[14px] sm:h-[14px]" />}
            {trend === "down" && <ArrowDownRight size={12} className="sm:w-[14px] sm:h-[14px]" />}
            {trend === "neutral" && <Activity size={12} className="sm:w-[14px] sm:h-[14px]" />}
            <span>{trendValue}</span>
          </div>
        </div>
      </div>
    </Card>
  )
}

// 🧩 Enhanced Chart Card Component - Mobile Optimized
function ChartCard({ 
  title, 
  subtitle,
  children 
}: { 
  title: string
  subtitle?: string
  children: React.ReactNode 
}) {
  return (
    <Card className="p-4 sm:p-5 md:p-6 bg-slate-900/70 backdrop-blur-md border border-slate-700/50 hover:border-emerald-500/20 shadow-lg hover:shadow-emerald-500/5 transition-all duration-300">
      <div className="mb-3 sm:mb-4">
        <h3 className="text-base sm:text-lg md:text-xl font-bold text-white">{title}</h3>
        {subtitle && (
          <p className="text-[10px] sm:text-xs md:text-sm text-slate-400 mt-1">{subtitle}</p>
        )}
      </div>
      {children}
    </Card>
  )
}

