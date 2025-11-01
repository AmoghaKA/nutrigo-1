"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, TrendingUp, ShoppingCart, X, Sparkles, CheckCircle, ArrowRight, Lightbulb } from "lucide-react"
import { useState } from "react"

interface Alternative {
  id: number
  name: string
  brand: string
  score: number
  price: string
  calories: number
  sugar: number
  improvement: number
  category: string
  available: boolean
}

const mockAlternatives: Alternative[] = [
  {
    id: 1,
    name: "Almond Milk",
    brand: "Silk",
    score: 85,
    price: "₹120",
    calories: 30,
    sugar: 0,
    improvement: 60,
    category: "Beverage",
    available: true,
  },
  {
    id: 2,
    name: "Unsweetened Coconut Water",
    brand: "Coco Zen",
    score: 82,
    price: "₹80",
    calories: 45,
    sugar: 9,
    improvement: 57,
    category: "Beverage",
    available: true,
  },
  {
    id: 3,
    name: "Fresh Orange Juice",
    brand: "Local Farm",
    score: 78,
    price: "₹60",
    calories: 85,
    sugar: 21,
    improvement: 53,
    category: "Beverage",
    available: true,
  },
  {
    id: 4,
    name: "Green Tea",
    brand: "Organic Wellness",
    score: 88,
    price: "₹150",
    calories: 2,
    sugar: 0,
    improvement: 63,
    category: "Beverage",
    available: true,
  },
  {
    id: 5,
    name: "Protein Smoothie",
    brand: "NutriBlend",
    score: 84,
    price: "₹180",
    calories: 200,
    sugar: 8,
    improvement: 59,
    category: "Beverage",
    available: true,
  },
  {
    id: 6,
    name: "Sparkling Water",
    brand: "AquaFresh",
    score: 92,
    price: "₹40",
    calories: 0,
    sugar: 0,
    improvement: 67,
    category: "Beverage",
    available: true,
  },
]

export default function AlternativesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState<"score" | "improvement" | "price">("score")
  const [selectedProduct, setSelectedProduct] = useState<Alternative | null>(null)

  const filteredAlternatives = mockAlternatives
    .filter((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "score") return b.score - a.score
      if (sortBy === "improvement") return b.improvement - a.improvement
      return 0
    })

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-400"
    if (score >= 60) return "text-cyan-400"
    return "text-red-400"
  }

  const getScoreBg = (score: number) => {
    if (score >= 80) return "bg-emerald-500/20 border border-emerald-500/40"
    if (score >= 60) return "bg-cyan-500/20 border border-cyan-500/40"
    return "bg-red-500/20 border border-red-500/40"
  }

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: "2s" }}></div>
      </div>

      <div className="p-4 md:p-8 lg:p-12 space-y-8 relative z-10">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 flex items-center justify-center shadow-xl shadow-emerald-500/25">
              <Sparkles size={28} className="text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-white">
                Healthier Alternatives
              </h1>
              <p className="text-slate-400 text-lg">Discover better options for your favorite products</p>
            </div>
          </div>
        </div>

        {/* Search and Sort */}
        <Card className="p-6 bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border border-emerald-500/20 shadow-xl space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-4 text-slate-500" size={20} />
              <Input
                placeholder="Search alternatives..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-14 bg-slate-800/50 border-slate-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-white placeholder:text-slate-500 rounded-xl text-base"
              />
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "score" | "improvement" | "price")}
              className="px-4 py-3.5 h-14 rounded-xl bg-slate-800/50 border border-slate-700 text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all appearance-none cursor-pointer"
            >
              <option value="score">Sort by Health Score</option>
              <option value="improvement">Sort by Improvement</option>
              <option value="price">Sort by Price</option>
            </select>
          </div>
        </Card>

        {/* Alternatives Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAlternatives.map((alt) => (
            <Card
              key={alt.id}
              className="group p-6 bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border border-slate-700 hover:border-emerald-500/40 shadow-xl transition-all duration-300 cursor-pointer"
              onClick={() => setSelectedProduct(alt)}
            >
              <div className="space-y-5">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1 flex-1">
                    <h3 className="font-bold text-white text-lg group-hover:text-emerald-400 transition">{alt.name}</h3>
                    <p className="text-sm text-slate-400">{alt.brand}</p>
                  </div>
                  <div
                    className={`px-4 py-2 rounded-xl font-black text-xl ${getScoreBg(alt.score)} ${getScoreColor(alt.score)} shadow-lg`}
                  >
                    {alt.score}
                  </div>
                </div>

                {/* Improvement Badge */}
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30">
                  <TrendingUp size={18} className="text-emerald-400" />
                  <span className="text-sm font-bold text-emerald-400">+{alt.improvement}% Better</span>
                </div>

                {/* Nutrition Info */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700">
                    <p className="text-slate-500 text-xs mb-1">Calories</p>
                    <p className="font-bold text-white text-lg">{alt.calories}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700">
                    <p className="text-slate-500 text-xs mb-1">Sugar</p>
                    <p className="font-bold text-white text-lg">{alt.sugar}g</p>
                  </div>
                </div>

                {/* Price and Action */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-700">
                  <span className="font-black text-white text-xl">{alt.price}</span>
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-semibold shadow-lg shadow-emerald-500/30 transition-all px-4 py-2"
                    onClick={(e) => {
                      e.stopPropagation()
                    }}
                  >
                    <ShoppingCart size={16} className="mr-1" /> Buy
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Comparison Section */}
        {selectedProduct && (
          <Card className="p-8 bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border border-teal-500/20 shadow-xl space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center">
                  <CheckCircle size={24} className="text-white" />
                </div>
                <h3 className="text-3xl font-black text-white">Detailed Comparison</h3>
              </div>
              <Button
                variant="ghost"
                onClick={() => setSelectedProduct(null)}
                className="text-slate-400 hover:text-white hover:bg-slate-800 p-3 rounded-xl"
              >
                <X size={24} />
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Original Product */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <p className="text-sm text-slate-500 font-semibold">Original Product</p>
                  <h4 className="text-2xl font-black text-white">Coca Cola</h4>
                  <p className="text-sm text-slate-400">The Coca-Cola Company</p>
                </div>

                <div className="space-y-3">
                  {[
                    { label: "Health Score", value: "25", color: "text-red-400" },
                    { label: "Calories", value: "140", color: "text-white" },
                    { label: "Sugar", value: "39g", color: "text-red-400" },
                    { label: "Price", value: "₹50", color: "text-white" }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 rounded-xl bg-slate-800/50 border border-slate-700">
                      <span className="text-slate-400">{item.label}</span>
                      <span className={`font-black text-lg ${item.color}`}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Alternative Product */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <p className="text-sm text-emerald-400 font-semibold">Recommended Alternative</p>
                  <h4 className="text-2xl font-black text-white">{selectedProduct.name}</h4>
                  <p className="text-sm text-slate-400">{selectedProduct.brand}</p>
                </div>

                <div className="space-y-3">
                  {[
                    { label: "Health Score", value: selectedProduct.score.toString(), color: getScoreColor(selectedProduct.score) },
                    { label: "Calories", value: selectedProduct.calories.toString(), color: "text-emerald-400" },
                    { label: "Sugar", value: `${selectedProduct.sugar}g`, color: "text-emerald-400" },
                    { label: "Price", value: selectedProduct.price, color: "text-white" }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 rounded-xl bg-slate-800/50 border border-emerald-500/30">
                      <span className="text-slate-400">{item.label}</span>
                      <span className={`font-black text-lg ${item.color}`}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Benefits */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/30 space-y-4">
              <h4 className="font-black text-white text-lg">Why This Alternative?</h4>
              <ul className="space-y-3">
                {[
                  `${selectedProduct.improvement}% healthier based on nutritional analysis`,
                  `Significantly lower sugar content (${selectedProduct.sugar}g vs 39g)`,
                  `Fewer calories (${selectedProduct.calories} vs 140)`,
                  "No artificial sweeteners or harmful additives"
                ].map((benefit, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle size={20} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-300">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Button className="w-full h-14 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:via-teal-400 hover:to-cyan-400 text-white font-bold shadow-xl shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all duration-300 border-0 text-lg">
              <ShoppingCart size={20} className="mr-2" /> Buy {selectedProduct.name} Now
              <ArrowRight size={20} className="ml-2" />
            </Button>
          </Card>
        )}

        {/* Tips Section */}
        <Card className="p-8 bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border border-cyan-500/20 shadow-xl space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <Lightbulb size={24} className="text-white" />
            </div>
            <h3 className="text-2xl font-black text-white">Tips for Choosing Healthier Alternatives</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                title: "Read Labels Carefully",
                description: "Check the nutrition facts panel for sugar, sodium, and calories"
              },
              {
                title: "Compare Serving Sizes",
                description: "Make sure you're comparing the same serving sizes"
              },
              {
                title: "Check Ingredients",
                description: "Fewer ingredients usually means a healthier product"
              },
              {
                title: "Look for Certifications",
                description: "Organic, non-GMO, and other certifications matter"
              }
            ].map((tip, idx) => (
              <div key={idx} className="group p-5 rounded-xl bg-slate-800/50 border border-slate-700 hover:border-cyan-500/40 transition-all duration-300 space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle size={18} className="text-cyan-400" />
                  <p className="font-bold text-white">{tip.title}</p>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed">{tip.description}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
