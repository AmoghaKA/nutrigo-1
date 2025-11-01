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
    <div className="min-h-screen bg-slate-950 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: "2s" }}></div>
      </div>

      <div className="p-4 md:p-8 lg:p-12 space-y-8 relative z-10">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 flex items-center justify-center shadow-xl shadow-emerald-500/25">
              <SettingsIcon size={28} className="text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-white">
                Settings
              </h1>
              <p className="text-slate-400 text-lg">Manage your preferences and account settings</p>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <Card className="p-8 bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border border-emerald-500/20 shadow-xl space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/25">
              <Bell size={24} className="text-white" />
            </div>
            <h3 className="text-2xl font-black text-white">Notifications</h3>
          </div>

          <div className="space-y-4">
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
              <div key={idx} className="group flex items-center justify-between p-5 rounded-xl border border-slate-700 bg-slate-800/50 hover:border-emerald-500/40 transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center group-hover:bg-emerald-500/30 transition-colors">
                    <item.icon size={20} className="text-emerald-400" />
                  </div>
                  <div>
                    <p className="font-bold text-white">{item.title}</p>
                    <p className="text-sm text-slate-400">{item.description}</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={settings[item.key as keyof typeof settings] as boolean}
                    onChange={() => handleToggle(item.key as keyof typeof settings)}
                    className="sr-only peer" 
                  />
                  <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>
            ))}

            {/* Daily Reminder with Time Picker */}
            <div className="group flex items-center justify-between p-5 rounded-xl border border-slate-700 bg-slate-800/50 hover:border-emerald-500/40 transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center group-hover:bg-emerald-500/30 transition-colors">
                  <Clock size={20} className="text-emerald-400" />
                </div>
                <div>
                  <p className="font-bold text-white">Daily Reminder</p>
                  <p className="text-sm text-slate-400">Get reminded to scan your meals</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="time"
                  name="reminderTime"
                  value={settings.reminderTime}
                  onChange={handleChange}
                  disabled={!settings.dailyReminder}
                  className="px-3 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white text-sm disabled:opacity-50 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                />
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={settings.dailyReminder}
                    onChange={() => handleToggle("dailyReminder")}
                    className="sr-only peer" 
                  />
                  <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>
            </div>
          </div>
        </Card>

        {/* Privacy & Security */}
        <Card className="p-8 bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border border-teal-500/20 shadow-xl space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-teal-500/25">
              <Lock size={24} className="text-white" />
            </div>
            <h3 className="text-2xl font-black text-white">Privacy & Security</h3>
          </div>

          <div className="space-y-4">
            <div className="group p-5 rounded-xl border border-slate-700 bg-slate-800/50 hover:border-teal-500/40 transition-all duration-300">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-lg bg-teal-500/20 border border-teal-500/40 flex items-center justify-center">
                  <Key size={20} className="text-teal-400" />
                </div>
                <div>
                  <Label htmlFor="password" className="text-white font-bold text-base">
                    Change Password
                  </Label>
                  <p className="text-sm text-slate-400">Update your account password</p>
                </div>
              </div>
              <Button className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-400 hover:to-cyan-500 text-white font-semibold shadow-lg shadow-teal-500/30 transition-all">
                Change Password
              </Button>
            </div>

            <div className="group flex items-center justify-between p-5 rounded-xl border border-slate-700 bg-slate-800/50 hover:border-teal-500/40 transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-teal-500/20 border border-teal-500/40 flex items-center justify-center">
                  <Shield size={20} className="text-teal-400" />
                </div>
                <div>
                  <p className="font-bold text-white">Two-Factor Authentication</p>
                  <p className="text-sm text-slate-400">Add an extra layer of security</p>
                </div>
              </div>
              <Button variant="outline" className="border-slate-600 hover:border-teal-500/50 bg-slate-700/50 hover:bg-teal-500/10 text-slate-300 hover:text-teal-400 transition-all">
                Enable
              </Button>
            </div>

            <div className="group flex items-center justify-between p-5 rounded-xl border border-slate-700 bg-slate-800/50 hover:border-teal-500/40 transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-teal-500/20 border border-teal-500/40 flex items-center justify-center">
                  <Database size={20} className="text-teal-400" />
                </div>
                <div>
                  <p className="font-bold text-white">Data Privacy</p>
                  <p className="text-sm text-slate-400">Manage your data sharing preferences</p>
                </div>
              </div>
              <Button variant="outline" className="border-slate-600 hover:border-teal-500/50 bg-slate-700/50 hover:bg-teal-500/10 text-slate-300 hover:text-teal-400 transition-all">
                Manage
              </Button>
            </div>
          </div>
        </Card>

        {/* Display */}
        <Card className="p-8 bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border border-cyan-500/20 shadow-xl space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/25">
              <Eye size={24} className="text-white" />
            </div>
            <h3 className="text-2xl font-black text-white">Display</h3>
          </div>

          <div className="space-y-4">
            <div className="group flex items-center justify-between p-5 rounded-xl border border-slate-700 bg-slate-800/50 opacity-60">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
                  <Moon size={20} className="text-cyan-400" />
                </div>
                <div>
                  <p className="font-bold text-white">Dark Mode</p>
                  <p className="text-sm text-slate-400">Always enabled for this account</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-not-allowed">
                <input 
                  type="checkbox" 
                  checked={true}
                  disabled
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-slate-700 rounded-full peer peer-checked:bg-cyan-500 opacity-50"></div>
              </label>
            </div>
          </div>
        </Card>

        {/* Danger Zone */}
        <Card className="p-8 bg-gradient-to-br from-red-950/50 to-red-900/30 backdrop-blur-xl border border-red-500/30 shadow-xl shadow-red-500/10 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-red-500/20 border border-red-500/40 flex items-center justify-center">
              <Trash2 size={24} className="text-red-400" />
            </div>
            <h3 className="text-2xl font-black text-red-400">Danger Zone</h3>
          </div>

          <div className="space-y-4">
            <div className="group flex items-center justify-between p-5 rounded-xl border border-red-500/20 bg-slate-900/50 hover:border-red-500/40 transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-red-500/20 border border-red-500/40 flex items-center justify-center">
                  <Trash2 size={20} className="text-red-400" />
                </div>
                <div>
                  <p className="font-bold text-white">Delete Account</p>
                  <p className="text-sm text-slate-400">Permanently delete your account and all data</p>
                </div>
              </div>
              <Button
                variant="outline"
                className="border-red-500/50 text-red-400 hover:bg-red-500/10 hover:border-red-500 bg-transparent transition-all"
              >
                Delete
              </Button>
            </div>
          </div>
        </Card>

        {/* Save Buttons */}
        <div className="flex gap-4 pt-4">
          <Button className="flex-1 md:flex-none h-12 px-8 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:via-teal-400 hover:to-cyan-400 text-white font-bold shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all duration-300 border-0">
            <Save size={18} className="mr-2" />
            Save Changes
          </Button>
          <Button variant="outline" className="h-12 px-8 border-2 border-slate-700 hover:border-slate-600 bg-slate-800/50 hover:bg-slate-800 text-slate-300 hover:text-white transition-all">
            <X size={18} className="mr-2" />
            Cancel
          </Button>
        </div>
      </div>
    </div>
  )
}
