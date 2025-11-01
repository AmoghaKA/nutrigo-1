"use client"

import { supabase } from "@/lib/supabaseClient"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowRight, Eye, EyeOff, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export default function SignUpPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isMounted, setIsMounted] = useState(false)
  
  const [isPasswordFocused, setIsPasswordFocused] = useState(false)
  const [isConfirmPasswordFocused, setIsConfirmPasswordFocused] = useState(false)
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

    // Check if user is already logged in
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        // User is already logged in, redirect to dashboard
        router.push('/dashboard')
      }
    }

    checkSession()

    // ✅ Enhanced OAuth redirect handling with comprehensive checks
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth event:', event, 'Session:', session)

      // Handle successful sign-in from OAuth providers
      if (event === 'SIGNED_IN' && session) {
        try {
          const user = session.user
          const userCreationTime = new Date(user.created_at).getTime()
          const now = new Date().getTime()
          
          // Check if user was created in the last 60 seconds (new user)
          const isNewUser = (now - userCreationTime) < 60000

          // Get user's identities to check OAuth provider
          const isOAuthUser = user.app_metadata.provider !== 'email'

          if (isNewUser) {
            // New user - redirect to dashboard
            console.log('New user detected, redirecting to dashboard')
            router.push('/dashboard')
          } else {
            // Existing user trying to sign up again
            console.log('Existing user detected')
            setError("An account with this email already exists. Please log in instead.")
            await supabase.auth.signOut()
            setIsLoading(false)
          }
        } catch (err) {
          console.error('Error handling auth state change:', err)
          setError("An error occurred during authentication. Please try again.")
          await supabase.auth.signOut()
          setIsLoading(false)
        }
      }

      // Handle sign-out events
      if (event === 'SIGNED_OUT') {
        console.log('User signed out')
      }

      // Handle password recovery
      if (event === 'PASSWORD_RECOVERY') {
        console.log('Password recovery initiated')
      }

      // Handle token refresh
      if (event === 'TOKEN_REFRESHED') {
        console.log('Token refreshed')
      }

      // Handle user updated
      if (event === 'USER_UPDATED') {
        console.log('User updated')
      }
    })

    // Cleanup listener on unmount
    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [router])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current && !isPasswordFocused && !isConfirmPasswordFocused) {
        const rect = containerRef.current.getBoundingClientRect()
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        })
      }
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [isPasswordFocused, isConfirmPasswordFocused])

  useEffect(() => {
    if (formData.name && formData.email && formData.password && formData.confirmPassword) {
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

  // ✅ Email validation helper
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // ✅ Password strength validation
  const validatePasswordStrength = (password: string): { isValid: boolean; message: string } => {
    if (password.length < 8) {
      return { isValid: false, message: "Password must be at least 8 characters long" }
    }
    if (!/[A-Z]/.test(password)) {
      return { isValid: false, message: "Password must contain at least one uppercase letter" }
    }
    if (!/[a-z]/.test(password)) {
      return { isValid: false, message: "Password must contain at least one lowercase letter" }
    }
    if (!/[0-9]/.test(password)) {
      return { isValid: false, message: "Password must contain at least one number" }
    }
    return { isValid: true, message: "" }
  }

  // ✅ Check if user already exists
  const checkUserExists = async (email: string): Promise<boolean> => {
    try {
      // Attempt to sign in to check if user exists
      // This is a safe way to check without exposing user data
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: 'dummy-password-check-only-ignore-error',
      })
      
      // If we get any response other than "Invalid login credentials", user exists
      if (error && error.message !== 'Invalid login credentials') {
        return true
      }
      
      return false
    } catch (err) {
      console.error('Error checking user existence:', err)
      return false
    }
  }

  // ✅ Enhanced manual sign-up with comprehensive validation
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      // Trim whitespace from inputs
      const trimmedName = formData.name.trim()
      const trimmedEmail = formData.email.trim().toLowerCase()
      const trimmedPassword = formData.password.trim()
      const trimmedConfirmPassword = formData.confirmPassword.trim()

      // ✅ Comprehensive validation
      if (!trimmedName) {
        setError("Full name is required")
        setIsLoading(false)
        return
      }

      if (trimmedName.length < 2) {
        setError("Full name must be at least 2 characters long")
        setIsLoading(false)
        return
      }

      if (!trimmedEmail) {
        setError("Email address is required")
        setIsLoading(false)
        return
      }

      if (!isValidEmail(trimmedEmail)) {
        setError("Please enter a valid email address")
        setIsLoading(false)
        return
      }

      if (!trimmedPassword) {
        setError("Password is required")
        setIsLoading(false)
        return
      }

      // Validate password strength
      const passwordValidation = validatePasswordStrength(trimmedPassword)
      if (!passwordValidation.isValid) {
        setError(passwordValidation.message)
        setIsLoading(false)
        return
      }

      if (!trimmedConfirmPassword) {
        setError("Please confirm your password")
        setIsLoading(false)
        return
      }

      if (trimmedPassword !== trimmedConfirmPassword) {
        setError("Passwords do not match")
        setIsLoading(false)
        return
      }

      // ✅ Attempt to sign up the user
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: trimmedEmail,
        password: trimmedPassword,
        options: {
          data: { 
            full_name: trimmedName,
            display_name: trimmedName,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      // ✅ Handle sign-up errors comprehensively
      if (signUpError) {
        console.error('Sign-up error:', signUpError)
        
        // Handle specific error cases
        if (signUpError.message.includes('already registered') || 
            signUpError.message.includes('already been registered') ||
            signUpError.message.includes('User already registered')) {
          setError("An account with this email already exists. Please log in instead.")
          setIsLoading(false)
          return
        }

        if (signUpError.message.includes('rate limit')) {
          setError("Too many sign-up attempts. Please try again later.")
          setIsLoading(false)
          return
        }

        if (signUpError.message.includes('invalid email')) {
          setError("Invalid email address format")
          setIsLoading(false)
          return
        }

        if (signUpError.message.includes('password')) {
          setError("Password does not meet security requirements")
          setIsLoading(false)
          return
        }

        // Generic error fallback
        setError(signUpError.message || "An error occurred during sign-up. Please try again.")
        setIsLoading(false)
        return
      }

      // ✅ Handle successful sign-up
      if (data.user) {
        // Check if email confirmation is required
        if (data.user.identities && data.user.identities.length === 0) {
          // User already exists (sign-up returns user but no identities)
          setError("An account with this email already exists. Please log in instead.")
          setIsLoading(false)
          return
        }

        // Check if session was created (email confirmation disabled)
        if (data.session) {
          // Auto-confirmed, redirect to dashboard
          setSuccess("Account created successfully! Redirecting to dashboard...")
          setTimeout(() => {
            router.push('/dashboard')
          }, 1500)
        } else {
          // Email confirmation required
          setSuccess("Account created successfully! Please check your email to verify your account before logging in.")
          
          // Clear form
          setFormData({
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
          })
          
          // Redirect to login after showing success message
          setTimeout(() => {
            router.push('/auth/login')
          }, 3000)
        }
      } else {
        setError("An unexpected error occurred. Please try again.")
      }

      setIsLoading(false)

    } catch (err: any) {
      console.error('Unexpected error during sign-up:', err)
      setError("An unexpected error occurred. Please try again later.")
      setIsLoading(false)
    }
  }

  // ✅ Enhanced Google Sign-Up with comprehensive error handling
  const handleGoogleSignUp = async () => {
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          // Redirect back to this page for new user detection
          redirectTo: `${window.location.origin}/auth/signup`,
          // Request additional scopes if needed
          scopes: 'email profile',
          // Query params to help distinguish sign-up vs login
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      })

      if (error) {
        console.error('Google OAuth error:', error)
        
        // Handle specific OAuth errors
        if (error.message.includes('popup')) {
          setError("Popup was blocked. Please allow popups for this site and try again.")
        } else if (error.message.includes('network')) {
          setError("Network error. Please check your internet connection and try again.")
        } else {
          setError(error.message || "Failed to sign up with Google. Please try again.")
        }
        
        setIsLoading(false)
        return
      }

      // OAuth redirect will happen automatically
      // The onAuthStateChange listener will handle the rest

    } catch (err: any) {
      console.error('Unexpected error during Google sign-up:', err)
      setError("An unexpected error occurred. Please try again later.")
      setIsLoading(false)
    }
  }

  const calculateEyePosition = (centerX: number, centerY: number) => {
    if (isPasswordFocused || isConfirmPasswordFocused) return { x: 0, y: 0 }
    
    const deltaX = mousePosition.x - centerX
    const deltaY = mousePosition.y - centerY
    const angle = Math.atan2(deltaY, deltaX)
    const distance = Math.min(Math.sqrt(deltaX * deltaX + deltaY * deltaY) / 60, 3)
    
    return {
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance
    }
  }

  const areEyesClosed = isPasswordFocused || isConfirmPasswordFocused

  return (
    <div ref={containerRef} className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Back Button - Fixed Position */}
      <Link 
        href="/"
        className="fixed top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded-lg text-slate-300 hover:text-white transition-all duration-300 backdrop-blur-sm group"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform duration-300" />
        <span className="text-sm font-medium">Back</span>
      </Link>

      {/* Animated Background with Stars */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: "2s" }}></div>
        
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
        {/* Left Side - Animated Characters */}
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
                    {areEyesClosed ? (
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
                    {areEyesClosed ? (
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
                    {areEyesClosed ? (
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
                    {areEyesClosed ? (
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
                    {areEyesClosed ? (
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
                    {areEyesClosed ? (
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
                    {areEyesClosed ? (
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
                    {areEyesClosed ? (
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

        {/* Right Side - Form */}
        <div className="bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl rounded-r-3xl lg:rounded-l-none rounded-3xl border border-emerald-500/20 p-8 shadow-2xl h-[700px] flex flex-col justify-center">
          <div className="space-y-4 max-w-md mx-auto w-full">
            <div className="text-center space-y-1 mb-4">
              <h1 className="text-2xl font-black text-white">Create Account</h1>
              <p className="text-slate-400 text-xs">Join NutriGo today</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              {/* ✅ Enhanced error display */}
              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-start gap-2">
                  <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              {/* ✅ Success message display */}
              {success && (
                <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-start gap-2">
                  <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>{success}</span>
                </div>
              )}

              <div className="space-y-1">
                <Label htmlFor="name" className="text-slate-300 text-xs">
                  Full Name <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  className="h-10 bg-slate-800/50 border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 text-white placeholder:text-slate-500 rounded-lg text-sm"
                  disabled={isLoading}
                  required
                  minLength={2}
                  maxLength={100}
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="email" className="text-slate-300 text-xs">
                  Email <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="h-10 bg-slate-800/50 border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 text-white placeholder:text-slate-500 rounded-lg text-sm"
                  disabled={isLoading}
                  required
                  autoComplete="email"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="password" className="text-slate-300 text-xs">
                  Password <span className="text-red-400">*</span>
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
                    className="h-10 pr-10 bg-slate-800/50 border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 text-white placeholder:text-slate-500 rounded-lg text-sm"
                    disabled={isLoading}
                    required
                    minLength={8}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-emerald-400 transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <p className="text-[10px] text-slate-500 mt-1">
                  Must be 8+ characters with uppercase, lowercase, and number
                </p>
              </div>

              <div className="space-y-1">
                <Label htmlFor="confirmPassword" className="text-slate-300 text-xs">
                  Confirm Password <span className="text-red-400">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onFocus={() => setIsConfirmPasswordFocused(true)}
                    onBlur={() => setIsConfirmPasswordFocused(false)}
                    className="h-10 pr-10 bg-slate-800/50 border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 text-white placeholder:text-slate-500 rounded-lg text-sm"
                    disabled={isLoading}
                    required
                    minLength={8}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-emerald-400 transition-colors"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-10 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:via-teal-400 hover:to-cyan-400 text-white font-semibold rounded-lg shadow-lg shadow-emerald-500/25 transition-all duration-300 border-0 mt-3 text-sm"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Creating Account...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <span>Create Account</span>
                    <ArrowRight size={16} />
                  </div>
                )}
              </Button>

              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-700"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="px-2 text-[10px] text-slate-500 bg-slate-900">or continue with</span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full h-10 border border-slate-700 hover:border-slate-600 bg-slate-800/30 hover:bg-slate-800/50 text-white rounded-lg transition-all text-sm flex items-center justify-center"
                onClick={handleGoogleSignUp}
                disabled={isLoading}
              >
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span>Sign up with Google</span>
              </Button>
            </form>

            <p className="text-center text-xs text-slate-400 pt-2">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors">
                Sign In
              </Link>
            </p>

            <p className="text-center text-[10px] text-slate-500 pt-1">
              By signing up, you agree to our{" "}
              <Link href="/terms" className="text-slate-400 hover:text-slate-300 underline">
                Terms
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-slate-400 hover:text-slate-300 underline">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
