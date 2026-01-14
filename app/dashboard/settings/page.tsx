"use client"

import type React from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Bell, Lock, Eye, Shield, Trash2, Clock, Mail, Smartphone, Moon, Key, Database, Sparkles, Settings as SettingsIcon, Save, X } from "lucide-react"
import { useState } from "react"

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    weeklyReports: true,
    pushNotifications: false,
    darkMode: true,
    dailyReminder: true,
    reminderTime: "09:00",
  })

  const handleToggle = (key: keyof typeof settings) => {
    setSettings((prev) => ({
      ...prev,
      [key]: typeof prev[key] === "boolean" ? !prev[key] : prev[key],
    }))
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setSettings((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

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
              <SettingsIcon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight">
                Settings
              </h1>
              <p className="text-slate-400 text-sm sm:text-base md:text-lg mt-1">Manage your preferences and account settings</p>
            </div>
          </div>
        </div>

        {/* Notifications Section - Responsive */}
        <Card className="p-5 sm:p-6 md:p-8 bg-gradient-to-br from-slate-900/90 via-slate-800/80 to-slate-900/90 backdrop-blur-xl border border-emerald-500/20 hover:border-emerald-500/30 transition-all duration-300 shadow-xl">
          <div className="flex items-center gap-2 sm:gap-3 mb-5 sm:mb-6">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/25 flex-shrink-0">
              <Bell size={18} className="sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
            </div>
            <h3 className="text-lg sm:text-xl md:text-2xl font-black text-white">Notifications</h3>
          </div>

          <div className="space-y-3">
            {[
              {
                icon: Mail,
                title: "Email Notifications",
                description: "Get updates about your health insights",
                key: "emailNotifications"
              },
              {
                icon: Bell,
                title: "Weekly Reports",
                description: "Receive weekly nutrition summaries",
                key: "weeklyReports"
              },
              {
                icon: Smartphone,
                title: "Push Notifications",
                description: "Get real-time alerts on your device",
                key: "pushNotifications"
              }
            ].map((item, idx) => (
              <div key={idx} className="group flex items-center justify-between gap-3 p-4 sm:p-5 rounded-lg border border-slate-700/50 bg-slate-800/50 hover:border-emerald-500/40 hover:bg-slate-800/70 transition-all duration-300">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center group-hover:bg-emerald-500/30 transition-colors">
                    <item.icon size={16} className="sm:w-[18px] sm:h-[18px] text-emerald-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-xs sm:text-sm md:text-base text-white truncate">{item.title}</p>
                    <p className="text-[10px] sm:text-xs md:text-sm text-slate-400 leading-tight">{item.description}</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                  <input 
                    type="checkbox" 
                    checked={settings[item.key as keyof typeof settings] as boolean}
                    onChange={() => handleToggle(item.key as keyof typeof settings)}
                    className="sr-only peer" 
                  />
                  <div className="w-10 h-5 sm:w-11 sm:h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 sm:after:h-5 sm:after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>
            ))}

            {/* Daily Reminder with Time Picker - Fully Responsive */}
            <div className="group flex flex-col gap-3 p-4 sm:p-5 rounded-lg border border-slate-700/50 bg-slate-800/50 hover:border-emerald-500/40 hover:bg-slate-800/70 transition-all duration-300">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center group-hover:bg-emerald-500/30 transition-colors">
                    <Clock size={16} className="sm:w-[18px] sm:h-[18px] text-emerald-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-xs sm:text-sm md:text-base text-white">Daily Reminder</p>
                    <p className="text-[10px] sm:text-xs md:text-sm text-slate-400 leading-tight">Get reminded to scan your meals</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                  <input 
                    type="checkbox" 
                    checked={settings.dailyReminder}
                    onChange={() => handleToggle("dailyReminder")}
                    className="sr-only peer" 
                  />
                  <div className="w-10 h-5 sm:w-11 sm:h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 sm:after:h-5 sm:after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>
              {settings.dailyReminder && (
                <div className="pl-0 sm:pl-[52px]">
                  <input
                    type="time"
                    name="reminderTime"
                    value={settings.reminderTime}
                    onChange={handleChange}
                    className="w-full sm:w-auto px-3 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white text-xs sm:text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                  />
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Privacy & Security Section - Responsive */}
        <Card className="p-5 sm:p-6 md:p-8 bg-gradient-to-br from-slate-900/90 via-slate-800/80 to-slate-900/90 backdrop-blur-xl border border-teal-500/20 hover:border-teal-500/30 transition-all duration-300 shadow-xl">
          <div className="flex items-center gap-2 sm:gap-3 mb-5 sm:mb-6">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-teal-500/25 flex-shrink-0">
              <Lock size={18} className="sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
            </div>
            <h3 className="text-lg sm:text-xl md:text-2xl font-black text-white">Privacy & Security</h3>
          </div>

          <div className="space-y-3">
            {/* Change Password - Responsive */}
            <div className="group p-4 sm:p-5 rounded-lg border border-slate-700/50 bg-slate-800/50 hover:border-teal-500/40 hover:bg-slate-800/70 transition-all duration-300">
              <div className="flex items-center gap-3 mb-3 sm:mb-4">
                <div className="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-teal-500/20 border border-teal-500/40 flex items-center justify-center">
                  <Key size={16} className="sm:w-[18px] sm:h-[18px] text-teal-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <Label htmlFor="password" className="text-white font-bold text-xs sm:text-sm md:text-base block">
                    Change Password
                  </Label>
                  <p className="text-[10px] sm:text-xs md:text-sm text-slate-400">Update your account password</p>
                </div>
              </div>
              <Button className="w-full sm:w-auto bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-400 hover:to-cyan-500 text-white font-semibold shadow-lg shadow-teal-500/30 transition-all rounded-lg text-xs sm:text-sm md:text-base py-2 h-9 sm:h-10 px-4 sm:px-6">
                Change Password
              </Button>
            </div>

            {/* Two-Factor Authentication - Responsive */}
            <div className="group flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 p-4 sm:p-5 rounded-lg border border-slate-700/50 bg-slate-800/50 hover:border-teal-500/40 hover:bg-slate-800/70 transition-all duration-300">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-teal-500/20 border border-teal-500/40 flex items-center justify-center">
                  <Shield size={16} className="sm:w-[18px] sm:h-[18px] text-teal-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-xs sm:text-sm md:text-base text-white">Two-Factor Authentication</p>
                  <p className="text-[10px] sm:text-xs md:text-sm text-slate-400 leading-tight">Add an extra layer of security</p>
                </div>
              </div>
              <Button variant="outline" className="w-full sm:w-auto border border-slate-600 hover:border-teal-500/50 bg-slate-700/50 hover:bg-teal-500/10 text-slate-300 hover:text-teal-400 transition-all rounded-lg text-xs sm:text-sm md:text-base py-2 h-9 sm:h-10 px-4 sm:px-6">
                Enable
              </Button>
            </div>

            {/* Data Privacy - Responsive */}
            <div className="group flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 p-4 sm:p-5 rounded-lg border border-slate-700/50 bg-slate-800/50 hover:border-teal-500/40 hover:bg-slate-800/70 transition-all duration-300">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-teal-500/20 border border-teal-500/40 flex items-center justify-center">
                  <Database size={16} className="sm:w-[18px] sm:h-[18px] text-teal-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-xs sm:text-sm md:text-base text-white">Data Privacy</p>
                  <p className="text-[10px] sm:text-xs md:text-sm text-slate-400 leading-tight">Manage your data sharing preferences</p>
                </div>
              </div>
              <Button variant="outline" className="w-full sm:w-auto border border-slate-600 hover:border-teal-500/50 bg-slate-700/50 hover:bg-teal-500/10 text-slate-300 hover:text-teal-400 transition-all rounded-lg text-xs sm:text-sm md:text-base py-2 h-9 sm:h-10 px-4 sm:px-6">
                Manage
              </Button>
            </div>
          </div>
        </Card>

        {/* Display Section - Responsive */}
        <Card className="p-5 sm:p-6 md:p-8 bg-gradient-to-br from-slate-900/90 via-slate-800/80 to-slate-900/90 backdrop-blur-xl border border-cyan-500/20 hover:border-cyan-500/30 transition-all duration-300 shadow-xl">
          <div className="flex items-center gap-2 sm:gap-3 mb-5 sm:mb-6">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/25 flex-shrink-0">
              <Eye size={18} className="sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
            </div>
            <h3 className="text-lg sm:text-xl md:text-2xl font-black text-white">Display</h3>
          </div>

          <div className="space-y-3">
            <div className="group flex items-center justify-between gap-3 p-4 sm:p-5 rounded-lg border border-slate-700/50 bg-slate-800/50 opacity-60">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
                  <Moon size={16} className="sm:w-[18px] sm:h-[18px] text-cyan-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-xs sm:text-sm md:text-base text-white">Dark Mode</p>
                  <p className="text-[10px] sm:text-xs md:text-sm text-slate-400 leading-tight">Always enabled for this account</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-not-allowed flex-shrink-0">
                <input 
                  type="checkbox" 
                  checked={true}
                  disabled
                  className="sr-only peer" 
                />
                <div className="w-10 h-5 sm:w-11 sm:h-6 bg-slate-700 rounded-full peer peer-checked:bg-cyan-500 opacity-50"></div>
              </label>
            </div>
          </div>
        </Card>

        {/* Danger Zone - Responsive */}
        <Card className="p-5 sm:p-6 md:p-8 bg-gradient-to-br from-red-950/40 to-red-900/20 backdrop-blur-xl border border-red-500/30 hover:border-red-500/40 transition-all duration-300 shadow-xl">
          <div className="flex items-center gap-2 sm:gap-3 mb-5 sm:mb-6">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-red-500/20 border border-red-500/40 flex items-center justify-center flex-shrink-0">
              <Trash2 size={18} className="sm:w-5 sm:h-5 md:w-6 md:h-6 text-red-400" />
            </div>
            <h3 className="text-lg sm:text-xl md:text-2xl font-black text-red-400">Danger Zone</h3>
          </div>

          <div className="group flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 p-4 sm:p-5 rounded-lg border border-red-500/20 bg-slate-900/50 hover:border-red-500/40 hover:bg-red-900/10 transition-all duration-300">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-red-500/20 border border-red-500/40 flex items-center justify-center">
                <Trash2 size={16} className="sm:w-[18px] sm:h-[18px] text-red-400" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-xs sm:text-sm md:text-base text-white">Delete Account</p>
                <p className="text-[10px] sm:text-xs md:text-sm text-slate-400 leading-tight">Permanently delete your account and all data</p>
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full sm:w-auto border border-red-500/50 text-red-400 hover:bg-red-500/10 hover:border-red-500 bg-transparent transition-all rounded-lg text-xs sm:text-sm md:text-base py-2 h-9 sm:h-10 px-4 sm:px-6"
            >
              Delete
            </Button>
          </div>
        </Card>

        {/* Action Buttons - Responsive */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 sm:pt-6">
          <Button className="flex-1 h-10 sm:h-11 md:h-12 px-4 sm:px-6 md:px-8 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:via-teal-400 hover:to-cyan-400 text-white font-bold shadow-lg hover:shadow-emerald-500/40 transition-all duration-300 border-0 rounded-lg flex items-center justify-center gap-2 text-xs sm:text-sm md:text-base">
            <Save size={16} className="sm:w-[18px] sm:h-[18px]" />
            <span>Save Changes</span>
          </Button>
          <Button variant="outline" className="flex-1 h-10 sm:h-11 md:h-12 px-4 sm:px-6 md:px-8 border-2 border-slate-700 hover:border-slate-600 bg-slate-800/50 hover:bg-slate-800 text-slate-300 hover:text-white transition-all rounded-lg flex items-center justify-center gap-2 text-xs sm:text-sm md:text-base">
            <X size={16} className="sm:w-[18px] sm:h-[18px]" />
            <span>Cancel</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
