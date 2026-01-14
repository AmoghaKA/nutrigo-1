"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Package } from "lucide-react"
import { useEffect, useRef } from "react"

export default function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const setCanvasSize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    setCanvasSize()

    const particles: Array<{
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      opacity: number
    }> = []

    // Reduce particles on mobile for performance
    const particleCount = window.innerWidth < 768 ? 25 : 50

    // Create particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        speedX: Math.random() * 0.5 - 0.25,
        speedY: Math.random() * 0.5 - 0.25,
        opacity: Math.random() * 0.5 + 0.2,
      })
    }

    function animate() {
      if (!ctx || !canvas) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((particle) => {
        ctx.fillStyle = `rgba(52, 211, 153, ${particle.opacity})`
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fill()

        particle.x += particle.speedX
        particle.y += particle.speedY

        if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1
        if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1
      })

      requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      setCanvasSize()
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <section className="relative min-h-[85vh] sm:min-h-[90vh] md:min-h-screen flex items-center justify-center overflow-hidden pt-16 sm:pt-20 bg-slate-950">
      {/* Canvas background */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />

      {/* Animated Gradient Orbs - Responsive sizing */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[250px] h-[250px] sm:w-[350px] sm:h-[350px] md:w-[500px] md:h-[500px] bg-gradient-to-r from-emerald-500/30 to-teal-500/30 rounded-full blur-3xl animate-pulse-slow"></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] md:w-[600px] md:h-[600px] bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 rounded-full blur-3xl animate-pulse-slow"
          style={{ animationDelay: "1.5s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] md:w-[400px] md:h-[400px] bg-gradient-to-r from-teal-500/25 to-cyan-500/25 rounded-full blur-3xl animate-pulse-slow"
          style={{ animationDelay: "3s" }}
        ></div>
      </div>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 md:gap-16">
          {/* Left Content */}
          <div className="space-y-6 sm:space-y-8 md:space-y-10 flex flex-col justify-center text-center md:text-left">
            <div className="space-y-4 sm:space-y-5 md:space-y-6">
              <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black leading-tight">
                <span className="text-white">Smart Packaged Food</span>{" "}
                <span className="block bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent animate-gradient">
                  Scanning
                </span>{" "}
                <span className="text-white">Made Simple</span>
              </h1>

              <p className="text-base sm:text-lg md:text-xl text-slate-400 max-w-full md:max-w-lg mx-auto md:mx-0 leading-relaxed px-2 sm:px-0">
                Stop guessing what's in your packaged foods. Scan any packaged product with AI-powered precision to reveal hidden
                sugars, calories, and ingredients. Make informed choices instantly.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 items-center justify-center md:justify-start px-4 sm:px-0">
              <Link href="/auth/signup" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto group relative overflow-hidden bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:via-teal-400 hover:to-cyan-400 text-white font-bold px-6 sm:px-8 py-6 sm:py-7 text-base sm:text-lg shadow-2xl shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all duration-300 border-0 min-h-[44px]"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2 sm:gap-3">
                    Start Scanning
                    <ArrowRight size={20} className="sm:w-[22px] sm:h-[22px] group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Button>
              </Link>
              <Link href="#features" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto px-6 sm:px-8 py-6 sm:py-7 text-base sm:text-lg border-2 border-emerald-500/50 hover:border-emerald-400 bg-emerald-500/5 hover:bg-emerald-500/15 text-emerald-400 font-bold backdrop-blur-xl transition-all duration-300 min-h-[44px]"
                >
                  Learn More
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative flex items-center justify-center mt-8 md:mt-0 md:items-start md:pt-0">
            <div className="md:sticky md:top-24 w-full max-w-[320px] sm:max-w-[340px] md:max-w-none">
              <div className="relative mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/30 via-teal-500/30 to-cyan-500/30 rounded-[2rem] sm:rounded-[2.5rem] md:rounded-[3rem] blur-2xl sm:blur-3xl animate-pulse-slow"></div>

                <div className="relative perspective-1000">
                  <div className="relative w-full aspect-[4/5] sm:w-[280px] sm:h-[450px] md:w-80 md:h-[500px] mx-auto transform-gpu md:hover:rotate-y-6 transition-transform duration-700 ease-out">
                    {/* Phone Frame */}
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-[2rem] sm:rounded-[2.5rem] md:rounded-[3rem] border-2 sm:border-3 md:border-4 border-emerald-500/30 shadow-2xl shadow-emerald-500/20 backdrop-blur-xl overflow-hidden">
                      {/* Screen Content */}
                      <div className="p-4 sm:p-5 md:p-6 h-full flex flex-col items-center justify-center space-y-4 sm:space-y-5 md:space-y-6">
                        <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 bg-gradient-to-br from-emerald-400 via-teal-400 to-cyan-400 rounded-2xl sm:rounded-2xl md:rounded-3xl flex items-center justify-center shadow-2xl shadow-emerald-500/50 animate-float">
                          <Package size={36} className="sm:w-10 sm:h-10 md:w-12 md:h-12 text-white" />
                        </div>

                        <div className="space-y-2 sm:space-y-2.5 md:space-y-3 text-center">
                          <p className="text-lg sm:text-xl md:text-xl font-bold text-white">Scan & Analyze</p>
                          <p className="text-xs sm:text-sm md:text-sm text-slate-400">Real-time AI nutrition insights</p>
                        </div>

                        {/* Scan Animation */}
                        <div className="w-full h-24 sm:h-28 md:h-32 relative bg-slate-800/50 rounded-xl sm:rounded-xl md:rounded-2xl overflow-hidden border border-emerald-500/30">
                          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/30 to-transparent h-6 sm:h-7 md:h-8 animate-scan"></div>
                          <div className="flex items-center justify-center h-full">
                            <span className="text-3xl sm:text-3xl md:text-4xl">🧃</span>
                          </div>
                        </div>

                        {/* Health Score */}
                        <div className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/40 rounded-xl sm:rounded-xl md:rounded-2xl px-4 py-3 sm:px-5 sm:py-3.5 md:px-6 md:py-4 backdrop-blur-xl w-full max-w-[200px] sm:max-w-[220px] md:max-w-none">
                          <div className="flex items-center gap-2 sm:gap-2.5 md:gap-3 justify-center md:justify-start">
                            <div className="text-2xl sm:text-2xl md:text-3xl font-black text-emerald-400">92</div>
                            <div className="text-left">
                              <p className="text-[10px] sm:text-xs md:text-xs text-slate-400">Health Score</p>
                              <p className="text-xs sm:text-sm md:text-sm font-semibold text-white">Excellent Choice</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Glow */}
                      <div className="absolute inset-0 rounded-[2rem] sm:rounded-[2.5rem] md:rounded-[3rem] bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 opacity-0 md:hover:opacity-20 blur-xl transition-opacity duration-500"></div>
                    </div>

                    {/* Floating Icons - Hidden on very small mobile, shown on larger screens */}
                    <div
                      className="hidden sm:flex absolute -top-4 -right-4 sm:-top-5 sm:-right-5 md:-top-6 md:-right-6 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl sm:rounded-xl md:rounded-2xl items-center justify-center shadow-xl shadow-emerald-500/40 animate-float"
                      style={{ animationDelay: "0.5s" }}
                    >
                      <span className="text-xl sm:text-xl md:text-2xl">📊</span>
                    </div>

                    <div
                      className="hidden sm:flex absolute -bottom-4 -left-4 sm:-bottom-5 sm:-left-5 md:-bottom-6 md:-left-6 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-cyan-400 to-emerald-500 rounded-xl sm:rounded-xl md:rounded-2xl items-center justify-center shadow-xl shadow-cyan-500/40 animate-float"
                      style={{ animationDelay: "1s" }}
                    >
                      <span className="text-xl sm:text-xl md:text-2xl">🏷️</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
