"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Scan } from "lucide-react"
import Link from "next/link"

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

interface RecentScansProps {
  scans: ScanHistory[]
}

export function RecentScans({ scans }: RecentScansProps) {
  // ✅ Clear last scan before scanning again
  const handleOpenScanner = () => {
    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem("lastScanResult")
        localStorage.removeItem("scanData")
        sessionStorage.removeItem("lastScan")
      }
    } catch (err) {
      console.warn("Could not clear previous scan:", err)
    }
  }

  return (
    <Card className="p-4 sm:p-5 md:p-6 bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border border-slate-700/50 hover:border-emerald-500/20 shadow-xl transition-all duration-300">
      <div className="space-y-4 sm:space-y-5 md:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white">
            Recent Scans
          </h3>
          
          {/* Action Buttons - Mobile Responsive */}
          <div className="flex flex-wrap gap-2 sm:gap-3 w-full sm:w-auto">
            <Link href="/dashboard/history" className="flex-1 sm:flex-none">
              <Button className="w-full sm:w-auto bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:border-emerald-500/50 rounded-lg px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-1.5 sm:gap-2 shadow-lg shadow-emerald-500/10">
                View All 
                <ArrowRight size={14} className="sm:w-4 sm:h-4" />
              </Button>
            </Link>

            {/* ✅ "Scan Again" button that clears old data */}
            <Link 
              href="/dashboard/scanner" 
              onClick={handleOpenScanner}
              className="flex-1 sm:flex-none"
            >
              <Button className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:via-teal-400 hover:to-cyan-400 text-white border-0 rounded-lg px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-300 flex items-center justify-center gap-1.5 sm:gap-2">
                Scan Again
                <ArrowRight size={14} className="sm:w-4 sm:h-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Scan Items or Empty State */}
        {scans.length === 0 ? (
          // Empty State - Mobile Responsive
          <div className="text-center py-8 sm:py-10 md:py-12">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 rounded-full bg-slate-800/50 border border-slate-700/50 flex items-center justify-center">
              <Scan size={28} className="sm:w-8 sm:h-8 text-slate-500" />
            </div>
            <p className="text-slate-400 text-sm sm:text-base font-semibold mb-1">
              No scans yet
            </p>
            <p className="text-slate-500 text-xs sm:text-sm">
              Start scanning your food items to see them here!
            </p>
            
            <Link href="/dashboard/scanner" onClick={handleOpenScanner} className="inline-block mt-4 sm:mt-6">
              <Button className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:via-teal-400 hover:to-cyan-400 text-white border-0 px-5 sm:px-6 py-2 sm:py-2.5 text-sm font-bold shadow-lg shadow-emerald-500/25 transition-all duration-300 flex items-center gap-2">
                Start Your First Scan
                <ArrowRight size={16} />
              </Button>
            </Link>
          </div>
        ) : (
          // Scan Items List - Mobile Responsive
          <div className="space-y-3 sm:space-y-4">
            {scans.map((scan) => (
              <Link 
                key={scan.id} 
                href={`/dashboard/history/${scan.id}`}
                className="block"
              >
                <div className="group flex items-center justify-between p-3 sm:p-4 rounded-lg sm:rounded-xl border border-slate-700/50 hover:border-emerald-500/40 bg-slate-800/40 hover:bg-slate-800/70 transition-all duration-300 cursor-pointer">
                  <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                    {/* Health Score Badge - Mobile Responsive */}
                    <div
                      className={`flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl flex items-center justify-center font-black text-base sm:text-lg md:text-xl border-2 ${
                        scan.healthScore >= 70
                          ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                          : scan.healthScore >= 50
                          ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/40"
                          : "bg-red-500/20 text-red-400 border-red-500/40"
                      }`}
                    >
                      {scan.healthScore}
                    </div>

                    {/* Product Info - Mobile Responsive */}
                    <div className="flex-1 min-w-0 space-y-0.5 sm:space-y-1">
                      <p className="font-bold text-sm sm:text-base md:text-lg text-white group-hover:text-emerald-400 transition-colors truncate">
                        {scan.productName}
                      </p>
                      <div className="flex flex-wrap items-center gap-1 sm:gap-1.5 text-slate-400 text-[10px] sm:text-xs">
                        <span className="font-medium">{scan.category}</span>
                        <span className="text-slate-600">•</span>
                        <span>
                          {new Date(scan.scannedAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                        <span className="text-slate-600 hidden sm:inline">•</span>
                        <span className="hidden sm:inline">
                          {new Date(scan.scannedAt).toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      
                      {/* Brand (if available) - Mobile Hidden on very small screens */}
                      {scan.brand && scan.brand !== "—" && (
                        <p className="text-slate-500 text-[10px] sm:text-xs truncate hidden sm:block">
                          Brand: {scan.brand}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Arrow Icon - Mobile Responsive */}
                  <ArrowRight
                    className="flex-shrink-0 text-slate-600 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all ml-2"
                    size={16}
                  />
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Show More Link (if 4+ scans) */}
        {scans.length >= 4 && (
          <div className="pt-4 sm:pt-5 border-t border-slate-700/50">
            <Link href="/dashboard/history">
              <Button 
                variant="ghost"
                className="w-full text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2"
              >
                View All Scans
                <ArrowRight size={16} />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </Card>
  )
}
