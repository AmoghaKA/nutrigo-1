"use client"

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'

export default function AuthCallbackPage() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [error, setError] = useState<string>("")
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // ✅ Check for error in URL params (OAuth errors)
        const urlParams = new URLSearchParams(window.location.search)
        const errorParam = urlParams.get('error')
        const errorDescription = urlParams.get('error_description')

        if (errorParam) {
          console.error('OAuth error from URL:', errorParam, errorDescription)
          setError(errorDescription || errorParam || "Authentication failed")
          setStatus('error')
          setTimeout(() => router.push('/auth/login'), 3000)
          return
        }

        // ✅ CRITICAL FIX: Let Supabase handle the entire callback automatically
        // This handles PKCE flow properly
        const { data, error: authError } = await supabase.auth.getSession()

        if (authError) {
          console.error('Auth error:', authError)
          
          // Handle specific error types
          if (authError.message.includes('Email not confirmed')) {
            setError("Please verify your email address before logging in. Check your inbox for the verification link.")
          } else if (authError.message.includes('Invalid')) {
            setError("Invalid authentication credentials. Please try logging in again.")
          } else {
            setError(authError.message)
          }
          
          setStatus('error')
          setTimeout(() => router.push('/auth/login'), 4000)
          return
        }

        if (data.session) {
          // ✅ Session exists - successful login!
          console.log('✅ Authentication successful, session:', data.session)
          setStatus('success')
          
          // Store session info if needed
          try {
            await supabase.auth.setSession({
              access_token: data.session.access_token,
              refresh_token: data.session.refresh_token
            })
          } catch (sessionError) {
            console.warn('Session storage warning:', sessionError)
            // Continue anyway - session already exists
          }

          setTimeout(() => {
            router.push('/dashboard')
            router.refresh()
          }, 1500)
        } else {
          // No session found - could be expired or invalid
          console.warn('⚠️ No session found in callback')
          setError("No active session found. Please try logging in again.")
          setStatus('error')
          setTimeout(() => router.push('/auth/login'), 3000)
        }
      } catch (err: any) {
        console.error('❌ Unexpected error in auth callback:', err)
        
        // Provide user-friendly error messages
        let userMessage = "An unexpected error occurred during authentication."
        
        if (err.message?.includes('network')) {
          userMessage = "Network error. Please check your connection and try again."
        } else if (err.message?.includes('timeout')) {
          userMessage = "Authentication timed out. Please try again."
        } else if (err.message) {
          userMessage = err.message
        }
        
        setError(userMessage)
        setStatus('error')
        setTimeout(() => router.push('/auth/login'), 4000)
      }
    }

    // Add a small delay to ensure URL params are loaded
    const timer = setTimeout(() => {
      handleCallback()
    }, 100)

    return () => clearTimeout(timer)
  }, [router, supabase])

  // ❌ Error State - Responsive
  if (status === 'error') {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-red-500/50 rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-2xl shadow-red-500/20">
            <div className="text-center space-y-4 sm:space-y-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full bg-red-500/20 flex items-center justify-center animate-in zoom-in duration-500">
                <AlertCircle size={40} className="sm:w-12 sm:h-12 text-red-400 animate-pulse" />
              </div>
              
              <div className="space-y-2">
                <h2 className="text-xl sm:text-2xl font-black text-white">Authentication Failed</h2>
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 sm:p-4">
                  <p className="text-red-400 text-xs sm:text-sm leading-relaxed">{error}</p>
                </div>
                <p className="text-slate-400 text-xs sm:text-sm pt-2">Redirecting to login page...</p>
              </div>

              <div className="flex items-center justify-center gap-2 text-slate-400 text-xs sm:text-sm">
                <div className="w-4 h-4 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin"></div>
                <span>Redirecting...</span>
              </div>

              {/* Manual redirect button */}
              <button
                onClick={() => router.push('/auth/login')}
                className="w-full mt-4 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-400 hover:to-rose-400 text-white font-semibold px-5 sm:px-6 py-2 sm:py-2.5 rounded-lg shadow-lg shadow-red-500/25 transition-all duration-300 text-sm"
              >
                Go to Login Now
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ✅ Success State - Responsive
  if (status === 'success') {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-emerald-500/50 rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-2xl shadow-emerald-500/20">
            <div className="text-center space-y-4 sm:space-y-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full bg-emerald-500/20 flex items-center justify-center animate-in zoom-in duration-500">
                <CheckCircle2 size={40} className="sm:w-12 sm:h-12 text-emerald-400 animate-in zoom-in duration-700 delay-100" />
              </div>
              
              <div className="space-y-2">
                <h2 className="text-xl sm:text-2xl font-black text-white">Authentication Successful! 🎉</h2>
                <p className="text-emerald-400 text-sm sm:text-base font-semibold">Welcome to NutriGo!</p>
                <p className="text-slate-400 text-xs sm:text-sm">Taking you to your dashboard...</p>
              </div>

              <div className="flex items-center justify-center gap-2 text-slate-400 text-xs sm:text-sm">
                <div className="w-4 h-4 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin"></div>
                <span>Loading dashboard...</span>
              </div>

              {/* Manual redirect button */}
              <button
                onClick={() => {
                  router.push('/dashboard')
                  router.refresh()
                }}
                className="w-full mt-4 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:via-teal-400 hover:to-cyan-400 text-white font-semibold px-5 sm:px-6 py-2 sm:py-2.5 rounded-lg shadow-lg shadow-emerald-500/25 transition-all duration-300 text-sm"
              >
                Go to Dashboard Now
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // 🔄 Loading State - Responsive
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-48 h-48 sm:w-72 sm:h-72 bg-cyan-500/10 rounded-full blur-2xl sm:blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 sm:w-72 sm:h-72 bg-teal-500/10 rounded-full blur-2xl sm:blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="max-w-md w-full relative z-10">
        <div className="bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl border border-cyan-500/30 rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-2xl shadow-cyan-500/20">
          <div className="text-center space-y-4 sm:space-y-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full bg-gradient-to-br from-cyan-500/20 to-teal-500/20 flex items-center justify-center animate-pulse border border-cyan-500/30">
              <Loader2 size={32} className="sm:w-10 sm:h-10 text-cyan-400 animate-spin" />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-black text-white">Authenticating...</h2>
              <p className="text-slate-400 text-xs sm:text-sm">Please wait while we verify your credentials</p>
            </div>

            <div className="flex flex-col gap-2 text-slate-500 text-xs">
              <div className="flex items-center justify-center gap-2 animate-pulse">
                <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                <span>Verifying session...</span>
              </div>
              <div className="flex items-center justify-center gap-2 animate-pulse" style={{ animationDelay: '0.3s' }}>
                <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                <span>Setting up your account...</span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-slate-800 rounded-full h-1.5 sm:h-2 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 animate-[shimmer_2s_ease-in-out_infinite]"></div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  )
}
