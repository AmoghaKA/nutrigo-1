// app/dashboard/history/[id]/loading.tsx
import { Card } from "@/components/ui/card"

export default function LoadingScanDetail() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 sm:p-6 md:p-8 lg:p-12">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header Skeleton */}
        <div className="flex justify-between items-center">
          <div className="h-10 w-32 bg-slate-800/50 rounded-lg animate-pulse"></div>
          <div className="h-10 w-24 bg-slate-800/50 rounded-lg animate-pulse"></div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product Header Skeleton */}
            <Card className="p-6 bg-slate-900/90 border-slate-700/50">
              <div className="flex justify-between gap-4">
                <div className="flex-1 space-y-4">
                  <div className="h-6 w-32 bg-slate-800 rounded animate-pulse"></div>
                  <div className="h-10 w-3/4 bg-slate-800 rounded animate-pulse"></div>
                  <div className="h-6 w-1/2 bg-slate-800 rounded animate-pulse"></div>
                  <div className="h-4 w-2/3 bg-slate-800 rounded animate-pulse"></div>
                </div>
                <div className="w-24 h-24 bg-slate-800 rounded-2xl animate-pulse"></div>
              </div>
            </Card>

            {/* Nutrition Facts Skeleton */}
            <Card className="p-6 bg-slate-900/90 border-slate-700/50">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-slate-800 rounded-lg animate-pulse"></div>
                <div className="h-8 w-48 bg-slate-800 rounded animate-pulse"></div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                    <div className="h-4 w-20 bg-slate-700 rounded animate-pulse mb-2"></div>
                    <div className="h-8 w-16 bg-slate-700 rounded animate-pulse"></div>
                    <div className="h-3 w-12 bg-slate-700 rounded animate-pulse mt-2"></div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <Card className="p-6 bg-slate-900/90 border-slate-700/50">
              <div className="h-6 w-32 bg-slate-800 rounded animate-pulse mb-4"></div>
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-10 bg-slate-800/50 rounded-lg animate-pulse"></div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
