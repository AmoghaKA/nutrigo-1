"use client"
import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"

export default function AlternativesPage() {
  const [alternatives, setAlternatives] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const lastScan = localStorage.getItem("lastScan")
    const scan = lastScan ? JSON.parse(lastScan) : null
    const minScore = scan?.healthScore || 50

    // ✅ call backend route
    fetch(`http://localhost:4000/api/scan/alternatives?minScore=${minScore}`)
      .then(res => res.json())
      .then(data => setAlternatives(data.alternatives || []))
      .catch(err => console.error("Failed to fetch alternatives:", err))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="text-center mt-24">
        <p className="text-slate-400 text-lg animate-pulse">Finding healthier alternatives...</p>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-4xl font-bold text-white mb-4">Healthier Alternatives</h1>

      {alternatives.length === 0 ? (
        <p className="text-slate-400 text-lg">No healthier options found for this scan.</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {alternatives.map((alt, i) => (
            <Card
              key={i}
              className="p-6 bg-slate-900/80 border border-emerald-500/20 hover:border-emerald-400/40 transition-all duration-300"
            >
              <h2 className="text-xl font-bold text-white">{alt.name}</h2>
              <p className="text-slate-400">{alt.brand}</p>
              <p className="mt-3 text-emerald-400 font-semibold">Health Score: {alt.health_score}</p>
              <p className="text-slate-300 mt-1">
                Calories: {alt.nutrition?.calories || "N/A"} kcal
              </p>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
