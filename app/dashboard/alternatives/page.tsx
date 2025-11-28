"use client"
import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Leaf, Apple, Coffee, Cookie, Milk, Wheat, Fish, ExternalLink, ShoppingBag } from "lucide-react"
import Image from "next/image"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { healthyAlternatives } from "@/lib/mockAlternatives"


interface Alternative {
  name: string
  brand: string
  health_score: number
  nutrition: {
    calories: number
    [key: string]: any
  }
  benefits: string[]
  description: string
  purchaseLinks?: {
    blinkit?: string
    zepto?: string
    swiggy?: string
    bigbasket?: string
  }
}


export default function AlternativesPage() {
  const [currentCategory, setCurrentCategory] = useState("snacks")
  const [alternatives, setAlternatives] = useState<Alternative[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [openDialogs, setOpenDialogs] = useState<{ [key: string]: boolean }>({})

  useEffect(() => {
    try {
      const categoryAlternatives = healthyAlternatives[currentCategory as keyof typeof healthyAlternatives] || []
      setAlternatives(categoryAlternatives)
      setLoading(false)
    } catch (err) {
      console.error("Failed to get alternatives:", err)
      setError("Failed to load alternatives")
      setLoading(false)
    }
  }, [currentCategory])

  const CategoryIcon = {
    snacks: Apple,
    beverages: Coffee,
    sweets: Cookie,
    dairy: Milk,
    grains: Wheat,
    proteins: Fish,
    breakfast: Apple,
    condiments: Cookie,
  }

  const quickCommercePlatforms = [
    {
      name: "Blinkit",
      logo: "/logos/blinkit.png",
      color: "from-yellow-500 to-yellow-600",
      hoverColor: "hover:from-yellow-400 hover:to-yellow-500",
      tagline: "10-20 min delivery",
      bgColor: "bg-yellow-50",
      key: "blinkit" as const
    },
    {
      name: "Zepto",
      logo: "/logos/zepto.png",
      color: "from-purple-500 to-purple-600",
      hoverColor: "hover:from-purple-400 hover:to-purple-500",
      tagline: "10 min delivery",
      bgColor: "bg-purple-50",
      key: "zepto" as const
    },
    {
      name: "Swiggy Instamart",
      logo: "/logos/swiggy.png",
      color: "from-orange-500 to-orange-600",
      hoverColor: "hover:from-orange-400 hover:to-orange-500",
      tagline: "15-30 min delivery",
      bgColor: "bg-orange-50",
      key: "swiggy" as const
    },
    {
      name: "BigBasket",
      logo: "/logos/bigbasket.png",
      color: "from-green-500 to-green-600",
      hoverColor: "hover:from-green-400 hover:to-green-500",
      tagline: "Express delivery",
      bgColor: "bg-green-50",
      key: "bigbasket" as const
    }
  ]

  const getScoreColor = (score: number) => {
    if (score >= 90) return "from-emerald-400 to-teal-400"
    if (score >= 80) return "from-teal-400 to-cyan-400"
    return "from-cyan-400 to-blue-400"
  }

  const getScoreBgColor = (score: number) => {
    if (score >= 90) return "bg-emerald-500/20 border-emerald-500/40"
    if (score >= 80) return "bg-teal-500/20 border-teal-500/40"
    return "bg-cyan-500/20 border-cyan-500/40"
  }

  const getScoreTextColor = (score: number) => {
    if (score >= 90) return "text-emerald-400"
    if (score >= 80) return "text-teal-400"
    return "text-cyan-400"
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full border-4 border-emerald-500/30 border-t-emerald-500 animate-spin"></div>
          <p className="text-slate-400 text-lg">Finding healthier alternatives...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-teal-500/15 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s", animationDuration: "4s" }}
        ></div>
        <div
          className="absolute bottom-0 left-1/2 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s", animationDuration: "5s" }}
        ></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-12 space-y-8 relative z-10">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Leaf className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white">Healthy Alternatives</h1>
              <p className="text-slate-400 text-base sm:text-lg mt-1">Discover nutritious Indian packaged foods</p>
            </div>
          </div>
        </div>

        {error ? (
          <Card className="p-6 sm:p-8 text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl">
            <p className="font-semibold mb-2">Error: {error}</p>
            <p className="text-sm text-red-300">Please try again later or contact support if the issue persists.</p>
          </Card>
        ) : (
          <Tabs defaultValue={currentCategory} onValueChange={setCurrentCategory} className="space-y-8">
            {/* Tabs Navigation */}
            <div className="overflow-x-auto">
              <TabsList className="inline-flex gap-2 p-2 bg-slate-900/50 backdrop-blur-md border border-slate-700/50 rounded-xl w-full sm:w-auto">
                {Object.keys(healthyAlternatives).map((category) => {
                  const Icon = CategoryIcon[category as keyof typeof CategoryIcon]
                  return (
                    <TabsTrigger
                      key={category}
                      value={category}
                      className="whitespace-nowrap px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-emerald-500/20 transition-all duration-300 hover:text-emerald-400"
                    >
                      <Icon className="w-4 h-4 mr-1 sm:mr-2" />
                      <span className="hidden sm:inline">{category.charAt(0).toUpperCase() + category.slice(1)}</span>
                      <span className="sm:hidden">{category.charAt(0).toUpperCase()}</span>
                    </TabsTrigger>
                  )
                })}
              </TabsList>
            </div>

            {/* Tab Content */}
            {Object.keys(healthyAlternatives).map((category) => (
              <TabsContent key={category} value={category} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {alternatives.map((alt, i) => (
                    <Card
                      key={i}
                      className="group relative p-6 bg-gradient-to-br from-slate-900/90 via-slate-800/80 to-slate-900/90 backdrop-blur-xl border border-emerald-500/20 hover:border-emerald-500/40 transition-all duration-300 shadow-xl hover:shadow-emerald-500/20 overflow-hidden"
                    >
                      {/* Hover glow effect */}
                      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>

                      <div className="relative space-y-4">
                        {/* Header with score */}
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <h2 className="text-lg sm:text-xl font-black text-white group-hover:text-emerald-400 transition-colors truncate">{alt.name}</h2>
                            <p className="text-sm text-slate-400 mt-1">{alt.brand}</p>
                          </div>
                          <div className={`flex-shrink-0 w-14 h-14 rounded-xl ${getScoreBgColor(alt.health_score)} border flex items-center justify-center shadow-lg`}>
                            <span className={`text-2xl font-black ${getScoreTextColor(alt.health_score)}`}>{alt.health_score}</span>
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-sm text-slate-300 leading-relaxed line-clamp-2">{alt.description}</p>

                        {/* Nutrition Quick View */}
                        <div className="space-y-2 pt-2 border-t border-slate-700/50">
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0"></div>
                            <p className="text-sm text-slate-300">
                              <span className="text-slate-400">Calories:</span> <span className="text-emerald-400 font-bold">{alt.nutrition?.calories} kcal</span>
                            </p>
                          </div>
                          {Object.entries(alt.nutrition)
                            .filter(([key]) => key !== "calories")
                            .slice(0, 2)
                            .map(([key, value]) => (
                              <div key={key} className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-teal-500 flex-shrink-0"></div>
                                <p className="text-sm text-slate-300">
                                  <span className="text-slate-400 capitalize">{key}:</span> <span className="text-teal-400 font-bold">{value}</span>
                                </p>
                              </div>
                            ))}
                        </div>

                        {/* Benefits Tags */}
                        <div className="flex flex-wrap gap-2 pt-2">
                          {alt.benefits.slice(0, 3).map((benefit, idx) => (
                            <span
                              key={idx}
                              className="px-2.5 py-1 text-xs font-medium rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/30 transition-colors duration-200"
                            >
                              {benefit}
                            </span>
                          ))}
                          {alt.benefits.length > 3 && (
                            <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-slate-700/50 border border-slate-600/50 text-slate-300">
                              +{alt.benefits.length - 3} more
                            </span>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 pt-4 border-t border-slate-700/50">
                          {/* Learn More Dialog */}
                          <Dialog open={openDialogs[`learn-${i}`]} onOpenChange={(open) => setOpenDialogs({...openDialogs, [`learn-${i}`]: open})}>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                className="flex-1 border border-slate-700 bg-slate-800/50 text-slate-300 hover:text-emerald-400 hover:border-emerald-500/50 hover:bg-emerald-500/10 transition-all duration-300 rounded-lg font-semibold text-sm"
                              >
                                Learn More
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-slate-900/95 backdrop-blur-xl border border-emerald-500/20 max-w-md">
                              <DialogHeader>
                                <div className="flex items-start justify-between gap-3">
                                  <div className="flex-1">
                                    <DialogTitle className="text-xl font-black bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
                                      {alt.name}
                                    </DialogTitle>
                                    <DialogDescription className="text-slate-400 text-sm mt-0.5">
                                      {alt.brand}
                                    </DialogDescription>
                                  </div>
                                  <div className={`flex-shrink-0 w-12 h-12 rounded-lg ${getScoreBgColor(alt.health_score)} border flex items-center justify-center shadow-lg`}>
                                    <span className={`text-xl font-black ${getScoreTextColor(alt.health_score)}`}>{alt.health_score}</span>
                                  </div>
                                </div>
                              </DialogHeader>
                              <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                                <p className="text-sm text-slate-300">{alt.description}</p>

                                <div>
                                  <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">Nutrition</h4>
                                  <div className="grid grid-cols-2 gap-2">
                                    {Object.entries(alt.nutrition).map(([k, v]) => (
                                      <div key={k} className="p-2 rounded-lg bg-slate-800/50 border border-slate-700/50">
                                        <p className="text-xs text-slate-400 uppercase mb-0.5 capitalize">{k}</p>
                                        <p className="text-sm font-bold text-emerald-400">{String(v)}</p>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                <div>
                                  <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">Benefits</h4>
                                  <div className="flex flex-wrap gap-1.5">
                                    {alt.benefits.map((b, idx) => (
                                      <span key={idx} className="px-2 py-1 text-xs font-medium rounded-md bg-emerald-500/20 border border-emerald-500/30 text-emerald-300">
                                        ✓ {b}
                                      </span>
                                    ))}
                                  </div>
                                </div>

                                <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                                  <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">Score: {alt.health_score}/100</p>
                                  <p className="text-xs text-slate-300">
                                    {alt.health_score >= 90 ? "⭐ Top-rated option for regular consumption." : 
                                      alt.health_score >= 80 ? "⭐ Very healthy with great nutrition." :
                                      "✓ A solid healthy alternative."}
                                  </p>
                                </div>
                              </div>

                              <DialogFooter className="mt-4">
                                <Button 
                                  onClick={() => setOpenDialogs({...openDialogs, [`learn-${i}`]: false})}
                                  variant="outline"
                                  className="w-full border border-slate-700 bg-slate-800/50 text-slate-300 hover:text-white hover:bg-slate-700 transition-all duration-300 rounded-lg text-sm"
                                >
                                  Close
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>

                          {/* Buy Now - Platform Selection Dialog */}
                          <Dialog open={openDialogs[`buy-${i}`]} onOpenChange={(open) => setOpenDialogs({...openDialogs, [`buy-${i}`]: open})}>
                            <DialogTrigger asChild>
                              <Button className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold shadow-lg hover:shadow-emerald-500/30 transition-all duration-300 rounded-lg text-sm">
                                <ShoppingBag className="w-4 h-4 mr-1.5" />
                                Buy Now
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-slate-900/95 backdrop-blur-xl border border-emerald-500/20 max-w-lg">
                              <DialogHeader>
                                <DialogTitle className="text-2xl font-black bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
                                  Choose Your Platform
                                </DialogTitle>
                                <DialogDescription className="text-slate-400 text-sm">
                                  Select your preferred quick commerce platform to buy <span className="font-bold text-emerald-400">{alt.name}</span>
                                </DialogDescription>
                              </DialogHeader>
                              
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
                                {quickCommercePlatforms.map((platform) => (
                                  <a
                                    key={platform.key}
                                    href={alt.purchaseLinks?.[platform.key] || "#"}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={() => setOpenDialogs({...openDialogs, [`buy-${i}`]: false})}
                                    className="group"
                                  >
                                    <div className={`relative p-6 rounded-xl bg-gradient-to-br ${platform.color} ${platform.hoverColor} transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 cursor-pointer overflow-hidden`}>
                                      <div className="text-center space-y-3">
                                        {/* Logo */}
                                        <div className="flex justify-center">
                                          <div className={`w-16 h-16 ${platform.bgColor} rounded-xl flex items-center justify-center p-2`}>
                                            <Image
                                              src={platform.logo}
                                              alt={`${platform.name} logo`}
                                              width={48}
                                              height={48}
                                              className="object-contain"
                                            />
                                          </div>
                                        </div>
                                        
                                        <div>
                                          <h3 className="text-lg font-black text-white">{platform.name}</h3>
                                          <p className="text-xs text-white/80 mt-1">{platform.tagline}</p>
                                        </div>
                                        
                                        <div className="flex items-center justify-center gap-1.5 text-white/90 text-xs font-medium">
                                          <span>Shop Now</span>
                                          <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                        </div>
                                      </div>
                                      
                                      {/* Shimmer effect on hover */}
                                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"></div>
                                    </div>
                                  </a>
                                ))}
                              </div>

                              <DialogFooter>
                                <Button 
                                  onClick={() => setOpenDialogs({...openDialogs, [`buy-${i}`]: false})}
                                  variant="outline" 
                                  className="w-full border border-slate-700 bg-slate-800/50 text-slate-300 hover:text-white hover:bg-slate-700 transition-all duration-300 rounded-lg text-sm"
                                >
                                  Cancel
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                {alternatives.length === 0 && (
                  <Card className="p-12 text-center bg-slate-900/50 border border-slate-700/50 rounded-xl">
                    <p className="text-slate-400 text-lg">No alternatives available for this category yet.</p>
                  </Card>
                )}
              </TabsContent>
            ))}
          </Tabs>
        )}
      </div>
    </div>
  )
}
