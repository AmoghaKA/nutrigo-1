"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { useState, useEffect } from "react"
import Image from "next/image"

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState("")

  useEffect(() => {
    const handleScroll = () => {
      if (typeof window !== "undefined") {
        setScrolled(window.scrollY > 20)

        // Active section logic
        const sections = ["features", "about", "contact"]
        let currentSection = ""

        // Check if we are on the home page for hash scrolling
        if (window.location.pathname === "/") {
          for (const section of sections) {
            const element = document.getElementById(section)
            if (element) {
              const rect = element.getBoundingClientRect()
              // If top of section is within viewport (with some offset)
              if (rect.top <= 150 && rect.bottom >= 150) {
                currentSection = section
                break
              }
            }
          }
        }

        // Special case for separate pages like Pricing
        if (window.location.pathname === "/pricing") {
          currentSection = "pricing"
        }

        setActiveSection(currentSection)
      }
    }

    // Initial check
    handleScroll()

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close mobile menu on window resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsOpen(false)
      }
    }
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const menuItems = [
    { name: "Features", href: "/#features", id: "features" },
    { name: "About Us", href: "/#about", id: "about" },
    { name: "Pricing", href: "/pricing", id: "pricing" },
    { name: "Contact", href: "/#contact", id: "contact" }, // Contact likely footer or specific section
  ]

  return (
    <nav className="fixed top-0 w-full z-50 px-4 sm:px-6 lg:px-8">
      <div className={`max-w-6xl mx-auto mt-4 sm:mt-6 transition-all duration-500 rounded-full ${scrolled
        ? "bg-slate-950/90 backdrop-blur-xl border border-emerald-500/20 shadow-2xl shadow-emerald-500/10"
        : "bg-slate-950/50 backdrop-blur-md border border-emerald-500/10 shadow-lg shadow-emerald-500/5"
        }`}
      >
        <div className="flex justify-between items-center h-16 sm:h-18 md:h-20 lg:h-20 px-4 sm:px-6 lg:px-8">
          {/* Logo Section - Floating Navbar Design */}
          <div
            onClick={() => window.location.href = '/'}
            className="flex items-center gap-3 group cursor-pointer"
          >
            <div className="relative w-[120px] h-[38px] sm:w-[140px] sm:h-[44px] md:w-[160px] md:h-[50px] lg:w-[180px] lg:h-[56px]">
              <Image
                src="/logo.png"
                alt="NutriGo Logo"
                fill
                className="object-contain transform group-hover:scale-105 transition-transform duration-300"
                priority
              />
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-4 xl:gap-6">
            {menuItems.map((item) => {
              const isActive = activeSection === item.id || (item.id === 'pricing' && typeof window !== 'undefined' && window.location.pathname === '/pricing');

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`relative transition-colors duration-300 font-medium group text-sm xl:text-base ${isActive ? "text-emerald-400" : "text-slate-300 hover:text-emerald-400"
                    }`}
                >
                  {item.name}
                  <span className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-emerald-400 to-teal-400 transition-all duration-300 ${isActive ? "w-full" : "w-0 group-hover:w-full"
                    }`}></span>
                </Link>
              )
            })}
          </div>

          {/* Desktop Buttons */}
          <div className="hidden lg:flex items-center gap-2 xl:gap-3">
            <Link href="/auth/login">
              <Button
                variant="ghost"
                className="text-slate-300 hover:text-emerald-400 hover:bg-emerald-500/10 border border-transparent hover:border-emerald-500/30 transition-all duration-300 text-sm px-4 py-2"
              >
                Sign In
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button className="relative overflow-hidden bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:via-teal-400 hover:to-cyan-400 text-white font-semibold shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all duration-300 border-0 text-sm px-5 py-2 rounded-full">
                <span className="relative z-10">Get Started</span>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-emerald-500 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Toggle - Touch friendly */}
          <button
            className="lg:hidden p-3 text-emerald-400 hover:text-emerald-300 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Menu"
            aria-expanded={isOpen}
          >
            {isOpen ? <X size={26} className="sm:w-7 sm:h-7" /> : <Menu size={26} className="sm:w-7 sm:h-7" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu - Floating Design */}
      <div
        className={`lg:hidden mt-2 mx-4 sm:mx-6 overflow-hidden transition-all duration-300 ease-in-out rounded-3xl ${isOpen 
          ? "max-h-[500px] opacity-100 translate-y-0 bg-slate-950/95 backdrop-blur-xl border border-emerald-500/20 shadow-2xl shadow-emerald-500/10" 
          : "max-h-0 opacity-0 -translate-y-5"
          }`}
      >
        <div className="pb-5 sm:pb-6 pt-3 sm:pt-4 px-2 space-y-1 sm:space-y-2">
          {menuItems.map((item) => {
            const isActive = activeSection === item.id || (item.id === 'pricing' && typeof window !== 'undefined' && window.location.pathname === '/pricing');
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`block transition-all duration-300 py-3 px-3 sm:px-4 text-base sm:text-lg font-medium rounded-2xl min-h-[44px] flex items-center ${isActive
                  ? "text-emerald-400 bg-emerald-500/10"
                  : "text-slate-300 hover:text-emerald-400 hover:bg-emerald-500/10"
                  }`}
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            )
          })}


          <div className="flex flex-col gap-3 pt-4 px-2 sm:px-0">
            <Link href="/auth/login" onClick={() => setIsOpen(false)} className="w-full">
              <Button
                variant="ghost"
                className="w-full border border-emerald-500/30 hover:bg-emerald-500/10 text-slate-200 text-sm sm:text-base min-h-[44px] py-3 rounded-xl"
              >
                Sign In
              </Button>
            </Link>
            <Link href="/auth/signup" onClick={() => setIsOpen(false)} className="w-full">
              <Button className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white text-sm sm:text-base py-3 min-h-[44px] shadow-lg shadow-emerald-500/30 rounded-xl">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
