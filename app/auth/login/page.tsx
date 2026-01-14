"use client"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowRight, Eye, EyeOff, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [showSuccessPopup, setShowSuccessPopup] = useState(false)
  const [showErrorPopup, setShowErrorPopup] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  
  const [isPasswordFocused, setIsPasswordFocused] = useState(false)
  const [isEmailFocused, setIsEmailFocused] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHappy, setIsHappy] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const [stars] = useState(() => {
    if (typeof window === 'undefined') return []
    return Array.from({ length: 60 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 5,
      opacity: Math.random() * 0.7 + 0.3,
    }))
  })

  useEffect(() => {
    setIsMounted(true)

    // ✅ Listen for auth state changes (for OAuth redirects)
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth event:', event, 'Session:', session)

      if (event === 'SIGNED_IN' && session) {
        // ✅ Show success popup for OAuth login
        setShowSuccessPopup(true)
        
        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          router.push('/dashboard')
          router.refresh()
        }, 2000)
      }
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [router, supabase])
  // ✅ This guarantees redirect after Google login (and works locally + in prod)
useEffect(() => {
  const handleSession = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    console.log("Session check:", session)

    // If user already logged in → dashboard
    if (session) {
      router.replace("/dashboard")
      return
    }

    // Listen for sign-in events (email or Google)
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        router.replace("/dashboard")
      }
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }

  handleSession()
}, [router, supabase])


  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current && !isPasswordFocused) {
        const rect = containerRef.current.getBoundingClientRect()
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        })
      }
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [isPasswordFocused])

  useEffect(() => {
    if (formData.email && formData.password) {
      setIsHappy(true)
    } else {
      setIsHappy(false)
    }
  }, [formData])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setError("")
    setSuccess("")
  }

  // ✅ Enhanced manual user login with unregistered user detection
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    if (!formData.email || !formData.password) {
      setError("Email and password are required")
      setIsLoading(false)
      setIsHappy(false)
      return
    }

    const { error: signInError, data } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    })

    if (signInError) {
      // ✅ Handle different error scenarios
      if (signInError.message === 'Invalid login credentials') {
        // This could be wrong password OR user doesn't exist
        // Show error popup for unregistered user
        setShowErrorPopup(true)
        setIsLoading(false)
        setIsHappy(false)
        
        setTimeout(() => {
          router.push('/auth/signup')
        }, 3000)
        return
      } else if (signInError.message.includes('Email not confirmed')) {
        setError("Please verify your email address before logging in.")
        setIsLoading(false)
        setIsHappy(false)
        return
      } else {
        setError(signInError.message)
        setIsLoading(false)
        setIsHappy(false)
        return
      }
    }

    // ✅ Success! Show popup
    if (data.session) {
      setShowSuccessPopup(true)
      setIsLoading(false)
      
      // Store remember me preference
      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true')
      }
      
      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        router.push("/dashboard")
        router.refresh()
      }, 2000)
    }
  }

  // Google OAuth removed — using email/password auth only

  const calculateEyePosition = (centerX: number, centerY: number) => {
    if (isPasswordFocused) return { x: 0, y: 0 }
    
    const deltaX = mousePosition.x - centerX
    const deltaY = mousePosition.y - centerY
    const angle = Math.atan2(deltaY, deltaX)
    const distance = Math.min(Math.sqrt(deltaX * deltaX + deltaY * deltaY) / 60, 3)
    
    return {
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance
    }
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* ✅ Success Popup Modal - Responsive */}
      {showSuccessPopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-emerald-500/50 rounded-xl sm:rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl shadow-emerald-500/20 animate-in zoom-in duration-300">
            <div className="flex flex-col items-center text-center space-y-3 sm:space-y-4">
              {/* Success Icon */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-500/20 flex items-center justify-center animate-in zoom-in duration-500 delay-100">
                <CheckCircle2 size={40} className="sm:w-12 sm:h-12 text-emerald-400 animate-in zoom-in duration-500 delay-200" />
              </div>
              
              {/* Success Message */}
              <div className="space-y-1.5 sm:space-y-2">
                <h2 className="text-xl sm:text-2xl font-black text-white">Login Successful! 🎉</h2>
                <p className="text-slate-300 text-xs sm:text-sm">
                  Welcome back! You've been successfully logged in.
                </p>
                <p className="text-emerald-400 text-xs sm:text-sm font-semibold">
                  Redirecting to your dashboard...
                </p>
              </div>

              {/* Redirect Message */}
              <div className="pt-3 sm:pt-4">
                <div className="flex items-center gap-2 text-slate-400 text-xs">
                  <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin"></div>
                  <span>Taking you to dashboard...</span>
                </div>
              </div>

              {/* Manual Redirect Button */}
              <Button
                onClick={() => {
                  router.push('/dashboard')
                  router.refresh()
                }}
                className="mt-3 sm:mt-4 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:via-teal-400 hover:to-cyan-400 text-white font-semibold px-5 sm:px-6 py-2 rounded-lg shadow-lg shadow-emerald-500/25 transition-all duration-300 text-sm"
              >
                Go to Dashboard Now
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Error Popup Modal - Responsive */}
      {showErrorPopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-orange-500/50 rounded-xl sm:rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl shadow-orange-500/20 animate-in zoom-in duration-300">
            <div className="flex flex-col items-center text-center space-y-3 sm:space-y-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-orange-500/20 flex items-center justify-center animate-in zoom-in duration-500 delay-100">
                <AlertCircle size={40} className="sm:w-12 sm:h-12 text-orange-400 animate-in zoom-in duration-500 delay-200" />
              </div>
              
              <div className="space-y-1.5 sm:space-y-2">
                <h2 className="text-xl sm:text-2xl font-black text-white">User Not Registered!</h2>
                <p className="text-slate-300 text-xs sm:text-sm">
                  We couldn't find an account with these credentials.
                </p>
                <p className="text-orange-400 text-xs sm:text-sm font-semibold">
                  Please sign up to create an account.
                </p>
              </div>

              <div className="pt-3 sm:pt-4">
                <div className="flex items-center gap-2 text-slate-400 text-xs">
                  <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-orange-500/30 border-t-orange-500 rounded-full animate-spin"></div>
                  <span>Redirecting to signup page...</span>
                </div>
              </div>

              <Button
                onClick={() => router.push('/auth/signup')}
                className="mt-3 sm:mt-4 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 hover:from-orange-400 hover:via-amber-400 hover:to-yellow-400 text-white font-semibold px-5 sm:px-6 py-2 rounded-lg shadow-lg shadow-orange-500/25 transition-all duration-300 text-sm"
              >
                Go to Sign Up Now
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Back Button - Responsive positioning */}
      <Link 
        href="/"
        className="fixed top-4 left-4 sm:top-5 sm:left-5 md:top-6 md:left-6 z-50 flex items-center gap-1.5 sm:gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded-lg text-slate-300 hover:text-white transition-all duration-300 backdrop-blur-sm group min-h-[44px]"
      >
        <ArrowLeft size={16} className="sm:w-[18px] sm:h-[18px] group-hover:-translate-x-1 transition-transform duration-300" />
        <span className="text-xs sm:text-sm font-medium">Back</span>
      </Link>

      {/* Animated Background with Stars */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 sm:top-20 sm:left-20 w-48 h-48 sm:w-72 sm:h-72 bg-emerald-500/10 rounded-full blur-2xl sm:blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-10 right-10 sm:bottom-20 sm:right-20 w-64 h-64 sm:w-96 sm:h-96 bg-teal-500/10 rounded-full blur-2xl sm:blur-3xl animate-pulse-slow" style={{ animationDelay: "2s" }}></div>
        
        {isMounted && stars.map((star) => (
          <div
            key={star.id}
            className="absolute w-1 h-1 bg-emerald-400 rounded-full"
            style={{
              left: `${star.left}%`,
              top: `${star.top}%`,
              animation: `twinkle ${star.duration}s ease-in-out ${star.delay}s infinite`,
              opacity: star.opacity,
            }}
          />
        ))}
      </div>

      <style jsx>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        
        @keyframes sway {
          0%, 100% { transform: translateX(0) rotate(0deg); }
          33% { transform: translateX(2px) rotate(1deg); }
          66% { transform: translateX(-2px) rotate(-1deg); }
        }
        
        @keyframes breathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }
      `}</style>

      <div className="w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-0 items-center relative z-10">
        {/* Left Side - Characters (Hidden on mobile) */}
        <div className="hidden lg:flex items-center justify-center bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl rounded-l-3xl border-l border-t border-b border-emerald-500/20 p-12 relative overflow-visible h-[700px]">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 left-0 w-full h-full" style={{
              backgroundImage: `radial-gradient(circle, #34d399 1px, transparent 1px)`,
              backgroundSize: '30px 30px'
            }}></div>
          </div>

          <div className="relative w-full h-full flex items-center justify-center">
            <div className="relative w-[420px] h-[380px]">
              
              {/* Character 1: Orange Semicircle */}
              <div 
                className="absolute bottom-0 left-0 w-48 h-28 bg-gradient-to-b from-orange-400 to-orange-500 rounded-t-full shadow-2xl transition-all duration-500 z-40 flex flex-col items-center pt-7"
                style={{
                  transform: `translateY(${isHappy ? '-15px' : '0'})`,
                  animation: 'sway 4s ease-in-out infinite, breathe 3s ease-in-out infinite',
                }}
              >
                <div className="flex gap-7">
                  <div className="w-5 h-5 bg-slate-900 rounded-full relative overflow-hidden transition-all duration-300">
                    {isPasswordFocused ? (
                      <div className="absolute top-1/2 left-0 w-full h-1.5 bg-slate-900 rounded-full"></div>
                    ) : (
                      <div 
                        className="w-2.5 h-2.5 bg-white rounded-full absolute transition-transform duration-200"
                        style={{
                          transform: `translate(${1 + calculateEyePosition(100, 350).x * 3}px, ${1 + calculateEyePosition(100, 350).y * 3}px)`
                        }}
                      ></div>
                    )}
                  </div>
                  <div className="w-5 h-5 bg-slate-900 rounded-full relative overflow-hidden transition-all duration-300">
                    {isPasswordFocused ? (
                      <div className="absolute top-1/2 left-0 w-full h-1.5 bg-slate-900 rounded-full"></div>
                    ) : (
                      <div 
                        className="w-2.5 h-2.5 bg-white rounded-full absolute transition-transform duration-200"
                        style={{
                          transform: `translate(${1 + calculateEyePosition(100, 350).x * 3}px, ${1 + calculateEyePosition(100, 350).y * 3}px)`
                        }}
                      ></div>
                    )}
                  </div>
                </div>
                <div 
                  className={`transition-all duration-500 mt-4 ${
                    isHappy ? 'w-16 h-3 border-b-[3px] border-slate-900 rounded-b-full' : 'w-14 h-2 bg-slate-900 rounded-full'
                  }`}
                ></div>
              </div>

              {/* Character 2: Purple Rectangle */}
              <div 
                className="absolute bottom-0 left-20 w-32 h-80 bg-gradient-to-b from-purple-500 to-purple-600 rounded-t-3xl shadow-2xl transition-all duration-500 z-10 flex flex-col items-center pt-8"
                style={{
                  transform: `translateY(${isHappy ? '-20px' : '0'})`,
                  animation: 'sway 5s ease-in-out infinite 0.5s, breathe 4s ease-in-out infinite',
                }}
              >
                <div className="flex gap-5 mt-2">
                  <div className="w-5 h-5 bg-white rounded-full relative overflow-hidden transition-all duration-300">
                    {isPasswordFocused ? (
                      <div className="absolute top-1/2 left-0 w-full h-1.5 bg-slate-900 rounded-full"></div>
                    ) : (
                      <div 
                        className="w-2.5 h-2.5 bg-slate-900 rounded-full absolute transition-transform duration-200"
                        style={{
                          transform: `translate(${1 + calculateEyePosition(180, 240).x * 3}px, ${1 + calculateEyePosition(180, 240).y * 3}px)`
                        }}
                      ></div>
                    )}
                  </div>
                  <div className="w-5 h-5 bg-white rounded-full relative overflow-hidden transition-all duration-300">
                    {isPasswordFocused ? (
                      <div className="absolute top-1/2 left-0 w-full h-1.5 bg-slate-900 rounded-full"></div>
                    ) : (
                      <div 
                        className="w-2.5 h-2.5 bg-slate-900 rounded-full absolute transition-transform duration-200"
                        style={{
                          transform: `translate(${1 + calculateEyePosition(180, 240).x * 3}px, ${1 + calculateEyePosition(180, 240).y * 3}px)`
                        }}
                      ></div>
                    )}
                  </div>
                </div>
                <div 
                  className={`transition-all duration-500 mt-4 ${
                    isHappy ? 'w-12 h-2 bg-white rounded-full' : 'w-10 h-1 bg-white rounded-full'
                  }`}
                ></div>
              </div>

              {/* Character 3: WHITE Rectangle */}
              <div 
                className="absolute bottom-0 left-36 w-36 h-40 bg-gradient-to-b from-white to-gray-100 rounded-t-3xl shadow-2xl border-2 border-gray-200 transition-all duration-500 z-20 flex flex-col items-center pt-16"
                style={{
                  transform: `translateY(${isHappy ? '-16px' : '0'})`,
                  animation: 'sway 4.5s ease-in-out infinite 1s, breathe 3.5s ease-in-out infinite',
                }}
              >
                <div className="flex gap-5">
                  <div className="w-5 h-5 bg-slate-900 rounded-full relative overflow-hidden transition-all duration-300">
                    {isPasswordFocused ? (
                      <div className="absolute top-1/2 left-0 w-full h-1.5 bg-slate-900 rounded-full"></div>
                    ) : (
                      <div 
                        className="w-2.5 h-2.5 bg-white rounded-full absolute transition-transform duration-200"
                        style={{
                          transform: `translate(${1 + calculateEyePosition(270, 320).x * 3}px, ${1 + calculateEyePosition(270, 320).y * 3}px)`
                        }}
                      ></div>
                    )}
                  </div>
                  <div className="w-5 h-5 bg-slate-900 rounded-full relative overflow-hidden transition-all duration-300">
                    {isPasswordFocused ? (
                      <div className="absolute top-1/2 left-0 w-full h-1.5 bg-slate-900 rounded-full"></div>
                    ) : (
                      <div 
                        className="w-2.5 h-2.5 bg-white rounded-full absolute transition-transform duration-200"
                        style={{
                          transform: `translate(${1 + calculateEyePosition(270, 320).x * 3}px, ${1 + calculateEyePosition(270, 320).y * 3}px)`
                        }}
                      ></div>
                    )}
                  </div>
                </div>
                <div 
                  className={`transition-all duration-500 mt-5 ${
                    isHappy ? 'w-12 h-2 bg-slate-900 rounded-full' : 'w-10 h-1 bg-slate-900 rounded-full'
                  }`}
                ></div>
              </div>

              {/* Character 4: Yellow */}
              <div 
                className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-b from-yellow-400 to-yellow-500 rounded-t-3xl shadow-2xl transition-all duration-500 z-30 flex flex-col items-center pt-10"
                style={{
                  transform: `translateY(${isHappy ? '-14px' : '0'})`,
                  animation: 'sway 3.5s ease-in-out infinite 1.5s, breathe 3s ease-in-out infinite',
                }}
              >
                <div className="flex gap-5">
                  <div className="w-5 h-5 bg-slate-900 rounded-full relative overflow-hidden transition-all duration-300">
                    {isPasswordFocused ? (
                      <div className="absolute top-1/2 left-0 w-full h-1.5 bg-slate-900 rounded-full"></div>
                    ) : (
                      <div 
                        className="w-2.5 h-2.5 bg-yellow-200 rounded-full absolute transition-transform duration-200"
                        style={{
                          transform: `translate(${1 + calculateEyePosition(380, 340).x * 3}px, ${1 + calculateEyePosition(380, 340).y * 3}px)`
                        }}
                      ></div>
                    )}
                  </div>
                  <div className="w-5 h-5 bg-slate-900 rounded-full relative overflow-hidden transition-all duration-300">
                    {isPasswordFocused ? (
                      <div className="absolute top-1/2 left-0 w-full h-1.5 bg-slate-900 rounded-full"></div>
                    ) : (
                      <div 
                        className="w-2.5 h-2.5 bg-yellow-200 rounded-full absolute transition-transform duration-200"
                        style={{
                          transform: `translate(${1 + calculateEyePosition(380, 340).x * 3}px, ${1 + calculateEyePosition(380, 340).y * 3}px)`
                        }}
                      ></div>
                    )}
                  </div>
                </div>
                <div 
                  className={`transition-all duration-500 mt-5 ${
                    isHappy ? 'w-14 h-2 border-b-[3px] border-slate-900 rounded-b-full' : 'w-12 h-1 bg-slate-900 rounded-full'
                  }`}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form - Fully Responsive */}
        <div className="bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl rounded-2xl lg:rounded-r-3xl lg:rounded-l-none border border-emerald-500/20 p-6 sm:p-8 md:p-10 lg:p-12 shadow-2xl min-h-[600px] sm:min-h-[650px] lg:h-[700px] flex flex-col justify-center">
          <div className="space-y-5 sm:space-y-6 lg:space-y-7 max-w-md mx-auto w-full">
            <div className="text-center space-y-0">
              <h1 className="text-2xl sm:text-3xl font-black text-white">Welcome back!</h1>
              <p className="text-slate-400 text-xs sm:text-sm">Please enter your details</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              {error && (
                <div className="p-3 sm:p-4 rounded-lg sm:rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs sm:text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="email" className="text-slate-300 font-semibold text-xs sm:text-sm">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => setIsEmailFocused(true)}
                  onBlur={() => setIsEmailFocused(false)}
                  className="h-11 sm:h-12 bg-slate-800/50 border-slate-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-white placeholder:text-slate-500 rounded-lg sm:rounded-xl text-sm"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="password" className="text-slate-300 font-semibold text-xs sm:text-sm">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    onFocus={() => setIsPasswordFocused(true)}
                    onBlur={() => setIsPasswordFocused(false)}
                    className="h-11 sm:h-12 pr-12 bg-slate-800/50 border-slate-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-white placeholder:text-slate-500 rounded-lg sm:rounded-xl text-sm"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-emerald-400 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center -mr-2"
                  >
                    {showPassword ? <EyeOff size={16} className="sm:w-[18px] sm:h-[18px]" /> : <Eye size={16} className="sm:w-[18px] sm:h-[18px]" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <input
                    type="checkbox"
                    id="remember"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-emerald-500 focus:ring-2 focus:ring-emerald-500/20 cursor-pointer"
                    disabled={isLoading}
                  />
                  <Label htmlFor="remember" className="text-xs sm:text-sm text-slate-400 cursor-pointer">
                    Remember me
                  </Label>
                </div>
                <Link href="#" className="text-xs sm:text-sm text-emerald-400 hover:text-emerald-300 font-medium">
                  Forgot?
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full h-11 sm:h-12 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:via-teal-400 hover:to-cyan-400 text-white font-bold rounded-lg sm:rounded-xl shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all duration-300 border-0 text-sm sm:text-base"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Logging in...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <span>Log in</span> <ArrowRight size={18} className="sm:w-5 sm:h-5" />
                  </div>
                )}
              </Button>

              {/* Google sign-in removed; email/password is the only auth method */}
            </form>

            <p className="text-center text-xs sm:text-sm text-slate-400">
              Don't have an account?{" "}
              <Link href="/auth/signup" className="text-emerald-400 hover:text-emerald-300 font-semibold">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
