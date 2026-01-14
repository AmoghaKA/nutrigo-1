"use client"

import Link from "next/link"
import { Mail, Linkedin, Twitter, Github, Heart } from "lucide-react"
import Image from "next/image"

export default function Footer() {
  return (
    <footer className="relative bg-slate-950 py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Effects - Responsive sizing */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 bg-emerald-500/10 rounded-full blur-2xl md:blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 bg-teal-500/10 rounded-full blur-2xl md:blur-3xl"></div>
      </div>

      {/* Top Gradient Line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent"></div>

      <div className="w-full max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8 sm:gap-10 md:gap-12 mb-10 sm:mb-12 md:mb-16">
          {/* Brand */}
          <div className="sm:col-span-2 md:col-span-2 space-y-4 sm:space-y-5 md:space-y-6 text-center sm:text-left">
            <Link href="/" className="flex items-center gap-3 group w-fit mx-auto sm:mx-0">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-xl sm:rounded-xl md:rounded-2xl blur-lg sm:blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <Image
                  src="/logo.png"
                  alt="NutriGo Logo"
                  width={140}
                  height={140}
                  className="relative transform group-hover:scale-105 transition-transform duration-300 sm:w-[160px] sm:h-[160px] md:w-[180px] md:h-[180px]"
                />
              </div>
            </Link>
            <p className="text-slate-400 leading-relaxed max-w-full sm:max-w-sm text-sm sm:text-base mx-auto sm:mx-0 px-4 sm:px-0">
              Decode Your Packaged Foods, Redefine Your Health. AI-powered nutrition insights for smarter, healthier choices.
            </p>
            <div className="flex gap-3 sm:gap-4 justify-center sm:justify-start">
              {[
                { Icon: Twitter, href: "#", color: "hover:text-cyan-400", bgColor: "hover:bg-cyan-500/10" },
                { Icon: Linkedin, href: "#", color: "hover:text-emerald-400", bgColor: "hover:bg-emerald-500/10" },
                { Icon: Github, href: "#", color: "hover:text-teal-400", bgColor: "hover:bg-teal-500/10" },
                { Icon: Mail, href: "#", color: "hover:text-emerald-400", bgColor: "hover:bg-emerald-500/10" },
              ].map(({ Icon, href, color, bgColor }, idx) => (
                <Link
                  key={idx}
                  href={href}
                  className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl sm:rounded-xl md:rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-emerald-500/20 flex items-center justify-center text-slate-400 ${color} ${bgColor} hover:border-emerald-500/40 transition-all duration-300 hover:scale-110 hover:shadow-xl hover:shadow-emerald-500/20 min-h-[44px] min-w-[44px]`}
                >
                  <Icon size={18} className="sm:w-5 sm:h-5" />
                </Link>
              ))}
            </div>
          </div>

          {/* Product */}
          <div className="space-y-4 sm:space-y-5 text-center sm:text-left">
            <h4 className="font-black text-white text-sm sm:text-base uppercase tracking-wider bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              Product
            </h4>
            <ul className="space-y-3 sm:space-y-4">
              {["Features", "Pricing", "Security", "Integrations", "API"].map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="text-slate-400 hover:text-emerald-400 transition-all duration-300 text-xs sm:text-sm flex items-center gap-3 group justify-center sm:justify-start min-h-[44px] sm:min-h-0 py-2 sm:py-0"
                  >
                    <span className="hidden sm:block w-0 h-0.5 bg-gradient-to-r from-emerald-400 to-teal-400 group-hover:w-6 transition-all duration-300 rounded-full"></span>
                    <span className="group-hover:translate-x-1 transition-transform duration-300">{item}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4 sm:space-y-5 text-center sm:text-left">
            <h4 className="font-black text-white text-sm sm:text-base uppercase tracking-wider bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              Company
            </h4>
            <ul className="space-y-3 sm:space-y-4">
              {["About", "Blog", "Careers", "Press", "Partners"].map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="text-slate-400 hover:text-emerald-400 transition-all duration-300 text-xs sm:text-sm flex items-center gap-3 group justify-center sm:justify-start min-h-[44px] sm:min-h-0 py-2 sm:py-0"
                  >
                    <span className="hidden sm:block w-0 h-0.5 bg-gradient-to-r from-emerald-400 to-teal-400 group-hover:w-6 transition-all duration-300 rounded-full"></span>
                    <span className="group-hover:translate-x-1 transition-transform duration-300">{item}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4 sm:space-y-5 text-center sm:text-left">
            <h4 className="font-black text-white text-sm sm:text-base uppercase tracking-wider bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              Legal
            </h4>
            <ul className="space-y-3 sm:space-y-4">
              {["Privacy", "Terms", "Contact", "Support", "Refunds"].map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="text-slate-400 hover:text-emerald-400 transition-all duration-300 text-xs sm:text-sm flex items-center gap-3 group justify-center sm:justify-start min-h-[44px] sm:min-h-0 py-2 sm:py-0"
                  >
                    <span className="hidden sm:block w-0 h-0.5 bg-gradient-to-r from-emerald-400 to-teal-400 group-hover:w-6 transition-all duration-300 rounded-full"></span>
                    <span className="group-hover:translate-x-1 transition-transform duration-300">{item}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 sm:pt-10 border-t border-emerald-500/20 flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-5 md:gap-6">
          <p className="text-xs sm:text-sm md:text-base text-slate-400 flex items-center gap-2 text-center">
            © 2025 NutriGo. Made with{" "}
            <Heart size={14} className="sm:w-4 sm:h-4 text-emerald-400 fill-emerald-400 animate-pulse" />{" "}
            in India
          </p>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8 text-xs sm:text-sm text-slate-400">
            <Link
              href="#"
              className="hover:text-emerald-400 transition-colors duration-300 font-medium min-h-[44px] flex items-center md:min-h-0"
            >
              Privacy Policy
            </Link>
            <Link
              href="#"
              className="hover:text-emerald-400 transition-colors duration-300 font-medium min-h-[44px] flex items-center md:min-h-0"
            >
              Terms of Service
            </Link>
            <Link
              href="#"
              className="hover:text-emerald-400 transition-colors duration-300 font-medium min-h-[44px] flex items-center md:min-h-0"
            >
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
