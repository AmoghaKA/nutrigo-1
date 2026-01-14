"use client"

import type React from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Mail, Phone, MapPin, Save, Edit2, Bell, Moon, FileText, Sparkles, Crown, ArrowRight, Check } from "lucide-react"
import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { toast } from "sonner"
import Link from "next/link"

export default function ProfilePage() {
  const supabase = createClientComponentClient()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [currentPlan, setCurrentPlan] = useState("nutrigo")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    bio: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser()
        
        if (error) {
          toast.error("Failed to load profile")
          return
        }

        if (user) {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single()

          const { data: { session } } = await supabase.auth.getSession()
          const userMetadata = session?.user?.user_metadata || {}

          setFormData({
            name: profile?.full_name || userMetadata.full_name || user.user_metadata?.full_name || user.email?.split('@')[0] || '',
            email: user.email || '',
            phone: profile?.phone || userMetadata.phone || '',
            location: profile?.location || userMetadata.location || '',
            bio: profile?.bio || userMetadata.bio || '',
          })
          
          setCurrentPlan(profile?.subscription_plan || userMetadata.subscription_plan || 'nutrigo')
        }
      } catch (err) {
        console.error('Error:', err)
        toast.error("Failed to load profile")
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserData()
  }, [supabase])

  const handleSave = async () => {
    try {
      setIsSaving(true)
      
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError || !user) throw userError || new Error('No user found')

      const [{ error: metadataError }, { error: profileError }] = await Promise.all([
        supabase.auth.updateUser({
          data: {
            full_name: formData.name,
            phone: formData.phone,
            location: formData.location,
            bio: formData.bio
          }
        }),
        supabase
          .from('profiles')
          .upsert({
            id: user.id,
            full_name: formData.name,
            phone: formData.phone,
            location: formData.location,
            bio: formData.bio,
            updated_at: new Date().toISOString(),
          })
      ])

      if (metadataError) throw metadataError
      if (profileError) throw profileError

      toast.success("Profile updated successfully")
      setIsEditing(false)
    } catch (err) {
      console.error('Error updating profile:', err)
      toast.error("Failed to update profile")
    } finally {
      setIsSaving(false)
    }
  }

  const plans = {
    nutrigo: { name: 'NutriGo', icon: '🌱', price: 'Free' },
    nutriplus: { name: 'NutriPlus', icon: '🍊', price: '₹249/month' },
    nutripro: { name: 'NutriPro', icon: '🏆', price: '₹499/month' }
  }

  const currentPlanDetails = plans[currentPlan as keyof typeof plans] || plans.nutrigo

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Enhanced Background Effects - Responsive */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 bg-emerald-500/20 rounded-full blur-2xl sm:blur-3xl animate-pulse"></div>
        <div
          className="absolute top-1/3 right-1/4 w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 lg:w-[500px] lg:h-[500px] bg-teal-500/15 rounded-full blur-2xl sm:blur-3xl animate-pulse"
          style={{ animationDelay: "1s", animationDuration: "4s" }}
        ></div>
        <div
          className="absolute bottom-0 left-1/2 w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 bg-cyan-500/10 rounded-full blur-2xl sm:blur-3xl animate-pulse"
          style={{ animationDelay: "2s", animationDuration: "5s" }}
        ></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12 space-y-6 sm:space-y-8 relative z-10">
        {/* Header - Responsive */}
        <div className="space-y-3 sm:space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 flex-shrink-0">
              <User className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight">
                Profile Settings
              </h1>
              <p className="text-slate-400 text-sm sm:text-base md:text-lg mt-1">Manage your account information</p>
            </div>
          </div>
        </div>

        {/* Profile Header Card - Responsive */}
        <Card className="p-5 sm:p-6 md:p-8 bg-gradient-to-br from-slate-900/90 via-slate-800/80 to-slate-900/90 backdrop-blur-xl border border-emerald-500/20 hover:border-emerald-500/30 transition-all duration-300 shadow-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
            {/* Avatar - Responsive */}
            <div className="relative flex-shrink-0">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-emerald-500/25">
                {isLoading ? (
                  <div className="w-8 h-8 sm:w-10 sm:h-10 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <User size={36} className="sm:w-10 sm:h-10 md:w-12 md:h-12 text-white" />
                )}
              </div>
              <div className="absolute -bottom-2 -right-2 w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-emerald-500 flex items-center justify-center border-2 border-slate-900 shadow-lg">
                <Sparkles size={14} className="sm:w-4 sm:h-4 text-white" />
              </div>
            </div>

            {/* Profile Info - Responsive */}
            <div className="flex-1 min-w-0 w-full sm:w-auto">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white truncate">
                {isLoading ? (
                  <div className="h-7 sm:h-8 w-40 sm:w-48 bg-slate-700 rounded animate-pulse" />
                ) : (
                  formData.name || "Set up your profile"
                )}
              </h2>
              <div className="text-slate-400 text-xs sm:text-sm mt-1">
                {isLoading ? (
                  <div className="h-4 sm:h-5 w-28 sm:w-32 bg-slate-700 rounded animate-pulse" />
                ) : (
                  <span className="break-all">{formData.email}</span>
                )}
              </div>
              <Button
                onClick={() => !isSaving && setIsEditing(!isEditing)}
                className="mt-3 sm:mt-4 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:via-teal-400 hover:to-cyan-400 text-white font-bold shadow-lg hover:shadow-emerald-500/40 transition-all duration-300 border-0 rounded-lg px-4 sm:px-6 py-2 h-9 sm:h-10 flex items-center gap-2 text-xs sm:text-sm md:text-base w-full sm:w-auto justify-center"
                disabled={isLoading || isSaving}
              >
                <Edit2 size={14} className="sm:w-4 sm:h-4" />
                <span>{isEditing ? "Cancel" : "Edit Profile"}</span>
              </Button>
            </div>
          </div>
        </Card>

        {/* Personal Information Form - Responsive */}
        <Card className="p-5 sm:p-6 md:p-8 bg-gradient-to-br from-slate-900/90 via-slate-800/80 to-slate-900/90 backdrop-blur-xl border border-teal-500/20 hover:border-teal-500/30 transition-all duration-300 shadow-xl space-y-5 sm:space-y-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center shadow-md flex-shrink-0">
              <User size={18} className="sm:w-5 sm:h-5 text-white" />
            </div>
            <h3 className="text-lg sm:text-xl font-black text-white">Personal Information</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-slate-300 font-semibold text-xs sm:text-sm">
                Full Name
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4 sm:w-[18px] sm:h-[18px]" />
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="pl-9 sm:pl-10 h-10 sm:h-11 md:h-12 bg-slate-800/50 border border-slate-700 hover:border-slate-600 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-white placeholder:text-slate-500 rounded-lg disabled:opacity-50 transition-all text-xs sm:text-sm"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-300 font-semibold text-xs sm:text-sm">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4 sm:w-[18px] sm:h-[18px]" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="pl-9 sm:pl-10 h-10 sm:h-11 md:h-12 bg-slate-800/50 border border-slate-700 hover:border-slate-600 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-white placeholder:text-slate-500 rounded-lg disabled:opacity-50 transition-all text-xs sm:text-sm"
                />
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-slate-300 font-semibold text-xs sm:text-sm">
                Phone Number
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4 sm:w-[18px] sm:h-[18px]" />
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="+91 XXXXX XXXXX"
                  className="pl-9 sm:pl-10 h-10 sm:h-11 md:h-12 bg-slate-800/50 border border-slate-700 hover:border-slate-600 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-white placeholder:text-slate-500 rounded-lg disabled:opacity-50 transition-all text-xs sm:text-sm"
                />
              </div>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location" className="text-slate-300 font-semibold text-xs sm:text-sm">
                Location
              </Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4 sm:w-[18px] sm:h-[18px]" />
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="City, Country"
                  className="pl-9 sm:pl-10 h-10 sm:h-11 md:h-12 bg-slate-800/50 border border-slate-700 hover:border-slate-600 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-white placeholder:text-slate-500 rounded-lg disabled:opacity-50 transition-all text-xs sm:text-sm"
                />
              </div>
            </div>
          </div>

          {/* Bio - Responsive */}
          <div className="space-y-2">
            <Label htmlFor="bio" className="text-slate-300 font-semibold text-xs sm:text-sm">
              Bio
            </Label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              disabled={!isEditing}
              className="w-full p-3 sm:p-4 rounded-lg bg-slate-800/50 border border-slate-700 hover:border-slate-600 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-white placeholder:text-slate-500 disabled:opacity-50 transition-all text-xs sm:text-sm resize-none"
              rows={3}
              placeholder="Tell us about yourself..."
            />
          </div>

          {/* Save Button - Responsive */}
          {isEditing && (
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="w-full h-10 sm:h-11 md:h-12 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:via-teal-400 hover:to-cyan-400 text-white font-bold shadow-lg hover:shadow-emerald-500/40 transition-all duration-300 border-0 rounded-lg flex items-center justify-center gap-2 text-xs sm:text-sm md:text-base"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save size={16} className="sm:w-[18px] sm:h-[18px]" />
                  <span>Save Changes</span>
                </>
              )}
            </Button>
          )}
        </Card>

        {/* Subscription Section - Fully Responsive */}
        {currentPlan !== 'nutripro' ? (
          <Card className="p-5 sm:p-6 md:p-8 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-red-500/10 backdrop-blur-xl border border-amber-500/30 hover:border-amber-500/40 transition-all duration-300 shadow-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
              <div className="flex items-start sm:items-center gap-3 sm:gap-4 min-w-0 flex-1">
                <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/25">
                  <Crown size={18} className="sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                    <span className="text-xs sm:text-sm md:text-base font-black text-white whitespace-nowrap">Current Plan:</span>
                    <span className="text-xs sm:text-sm md:text-base font-black text-amber-400 truncate">
                      {currentPlanDetails.icon} {currentPlanDetails.name}
                    </span>
                  </div>
                  <p className="text-[10px] sm:text-xs md:text-sm text-slate-400 leading-tight">
                    Upgrade to unlock unlimited scans and advanced features
                  </p>
                </div>
              </div>
              <Link href="/pricing" className="flex-shrink-0 w-full sm:w-auto">
                <Button className="w-full sm:w-auto bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-400 hover:via-orange-400 hover:to-red-400 text-white font-bold px-4 sm:px-6 py-2 sm:py-2.5 md:py-3 h-9 sm:h-10 md:h-11 shadow-lg hover:shadow-amber-500/40 transition-all duration-300 border-0 rounded-lg flex items-center justify-center gap-2 text-xs sm:text-sm md:text-base whitespace-nowrap">
                  <span>Upgrade Now</span>
                  <ArrowRight size={14} className="sm:w-4 sm:h-4" />
                </Button>
              </Link>
            </div>
          </Card>
        ) : (
          <Card className="p-5 sm:p-6 md:p-8 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 backdrop-blur-xl border border-emerald-500/30 hover:border-emerald-500/40 transition-all duration-300 shadow-xl">
            <div className="flex items-center justify-center gap-2 sm:gap-3">
              <Check size={18} className="sm:w-5 sm:h-5 md:w-6 md:h-6 text-emerald-400" />
              <p className="text-sm sm:text-base md:text-lg font-bold text-emerald-400">You're on the best plan! 🎉</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
