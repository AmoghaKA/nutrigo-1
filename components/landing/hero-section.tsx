"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
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
          <div className="relative flex items-center justify-center mt-8 md:mt-0">
            <div className="md:sticky md:top-24 w-full max-w-[290px] sm:max-w-[320px] md:max-w-[310px] mx-auto">

              {/* Glow behind phone */}
              <div className="absolute inset-4 bg-gradient-to-br from-emerald-500/40 via-teal-500/40 to-cyan-500/40 rounded-[3rem] blur-3xl animate-pulse-slow"></div>

              {/* Phone wrapper with 3D hover */}
              <div className="relative group transition-transform duration-500 ease-out hover:-translate-y-3 hover:[transform:perspective(800px)_rotateY(-8deg)_rotateX(3deg)_translateY(-12px)]">

                {/* Metallic outer frame */}
                <div className="relative rounded-[3rem] p-[3px] bg-gradient-to-br from-slate-300 via-slate-500 to-slate-800 shadow-[0_30px_60px_-10px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.6)]">

                  {/* Left buttons */}
                  <div className="absolute -left-[4px] top-[90px] w-[4px] h-7 bg-gradient-to-b from-slate-400 to-slate-600 rounded-l-sm"></div>
                  <div className="absolute -left-[4px] top-[130px] w-[4px] h-12 bg-gradient-to-b from-slate-400 to-slate-600 rounded-l-sm"></div>
                  <div className="absolute -left-[4px] top-[190px] w-[4px] h-12 bg-gradient-to-b from-slate-400 to-slate-600 rounded-l-sm"></div>
                  {/* Right button */}
                  <div className="absolute -right-[4px] top-[130px] w-[4px] h-16 bg-gradient-to-b from-slate-400 to-slate-600 rounded-r-sm"></div>

                  {/* Black glass inner bezel */}
                  <div className="rounded-[2.8rem] overflow-hidden bg-black p-[5px]">

                    {/* Screen */}
                    <div className="relative rounded-[2.4rem] overflow-hidden bg-slate-900" style={{ aspectRatio: '9/19' }}>

                      {/* THE IMAGE */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="/phone-screen.png"
                        alt="Nutrigo app screen"
                        style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0 }}
                      />

                      {/* Dynamic Island */}
                      <div className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-full z-30"></div>

                      {/* Screen glare */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/0 to-white/10 z-20 pointer-events-none group-hover:via-white/5 group-hover:to-white/20 transition-all duration-700"></div>
                    </div>
                  </div>
                </div>

                {/* Drop shadow underneath */}
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-emerald-500/20 blur-2xl rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
