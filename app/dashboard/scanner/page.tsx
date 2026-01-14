"use client"

import React, { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Camera, Upload, X, Sparkles, Zap, CheckCircle } from "lucide-react"
import ScanResult from "@/components/scanner/scan-result"
import ScanLoadingPortal from "@/components/scanner/scan-loading-portal"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

interface ScanData {
  name: string
  brand: string
  healthScore: number
  calories: number
  sugar: number
  protein: number
  fat: number
  carbs: number
  ingredients: string[]
  warnings: string[]
  timestamp: string
  productName?: string
  detected_name?: string
  product_name?: string
}

export default function ScannerPage() {
  const supabase = createClientComponentClient()
  const [scanMode, setScanMode] = useState<"camera" | "upload" | null>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [scanResult, setScanResult] = useState<ScanData | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const router = useRouter()

  const SCAN_API_URL = "/api/scan/image"
  const HISTORY_API_URL = "/api/scans"

  // ✅ Reset scanner state whenever you open this page
  useEffect(() => {
    try {
      localStorage.removeItem("lastScan")
      localStorage.removeItem("scanData")
      sessionStorage.removeItem("lastScan")
      setScanResult(null)
      setScanMode(null)
    } catch (err) {
      console.warn("Could not clear old scan data:", err)
    }
  }, [])

  // 🔑 Helper to get current user ID
  const getCurrentUserId = async (): Promise<string | null> => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user?.id) return user.id
    } catch {}
    if (typeof window !== "undefined") {
      const keys = ["nutrigo_current_user", "currentUser", "user"]
      for (const key of keys) {
        const raw = localStorage.getItem(key)
        if (!raw) continue
        try {
          const parsed = JSON.parse(raw)
          if (parsed?.id) return parsed.id
        } catch {
          if (raw.startsWith("user_") || raw.length > 6) return raw
        }
      }
    }
    return null
  }

  const saveScanToHistory = async (dataToSave: ScanData) => {
    if (isSaving) return
    setIsSaving(true)
    console.log("Attempting to save scan to history:", dataToSave)

    try {
      const resolvedName =
        dataToSave.productName ||
        dataToSave.name ||
        dataToSave.product_name ||
        dataToSave.detected_name ||
        dataToSave.brand ||
        ""

      const userId = await getCurrentUserId()
      if (!userId) {
        console.warn("⚠️ No userId found — scan not linked to any account.")
        localStorage.setItem("lastScan", JSON.stringify(dataToSave))
        return
      }

      const payload = {
        userId,
        productName: resolvedName,
        brand: dataToSave.brand || "",
        healthScore: dataToSave.healthScore,
        calories: dataToSave.calories,
        sugar: dataToSave.sugar,
        protein: dataToSave.protein,
        fat: dataToSave.fat,
        carbs: dataToSave.carbs,
        ingredients: dataToSave.ingredients || [],
        warnings: dataToSave.warnings || [],
      }

      const response = await fetch(HISTORY_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.text()
        throw new Error(`Failed to save scan. Status: ${response.status}. Details: ${errorData}`)
      }

      console.log("✅ Scan successfully saved to history.")
    } catch (error) {
      console.error("❌ Error saving scan to history:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleCameraStart = async () => {
    setScanMode("camera")
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
      if (videoRef.current) videoRef.current.srcObject = stream
    } catch (err) {
      console.error("Error accessing camera:", err)
      alert("Unable to access camera. Please check permissions.")
      setScanMode(null)
    }
  }

  const handleCapture = async () => {
    if (!videoRef.current || !canvasRef.current) return
    const context = canvasRef.current.getContext("2d")
    if (!context) return

    context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height)
    canvasRef.current.toBlob(async (blob) => {
      if (!blob) return
      setIsScanning(true)
      try {
        const formData = new FormData()
        formData.append("image", blob, "capture.jpg")

        const response = await fetch(SCAN_API_URL, { method: "POST", body: formData })
        const resText = await response.text()
        if (!response.ok) throw new Error(`Scan failed: ${resText}`)

        const data = JSON.parse(resText)
        setScanResult(data)
        localStorage.setItem("lastScan", JSON.stringify(data))
        await saveScanToHistory(data)
      } catch (err) {
        console.error("Error during capture or scan:", err)
        alert((err as Error).message || "Failed to process the image.")
      } finally {
        stopCamera()
        setIsScanning(false)
      }
    }, "image/jpeg")
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setScanMode("upload")
    setIsScanning(true)
    try {
      const formData = new FormData()
      formData.append("image", file)

      const response = await fetch(SCAN_API_URL, { method: "POST", body: formData })
      const resText = await response.text()
      if (!response.ok) throw new Error(`Upload failed: ${resText}`)
      const data = JSON.parse(resText)

      setScanResult(data)
      localStorage.setItem("lastScan", JSON.stringify(data))
      await saveScanToHistory(data)
    } catch (err) {
      console.error("Error during file upload or scan:", err)
      alert((err as Error).message || "Upload failed.")
    } finally {
      setIsScanning(false)
      setScanMode(null)
    }
  }

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach((track) => track.stop())
    }
  }

  const handleReset = () => {
    stopCamera()
    setScanResult(null)
    setScanMode(null)
    try {
      localStorage.removeItem("lastScan")
      sessionStorage.removeItem("lastScan")
    } catch {}
  }

  if (scanResult) {
    return <ScanResult data={scanResult} onReset={handleReset} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      <ScanLoadingPortal
        open={isScanning}
        message="Analyzing packaged food label..."
        submessage="AI is processing your image"
        onCancel={handleReset}
      />

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

      <div className="p-4 sm:p-6 md:p-8 lg:p-12 space-y-6 sm:space-y-8 relative z-10">
        {/* Header - Responsive */}
        <div className="space-y-3 sm:space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 flex items-center justify-center shadow-xl shadow-emerald-500/25 flex-shrink-0">
              <Zap size={24} className="sm:w-7 sm:h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight">
                Packaged Food Scanner
              </h1>
              <p className="text-slate-400 text-sm sm:text-base md:text-lg mt-1">
                Scan any packaged food product to get instant nutrition insights
              </p>
            </div>
          </div>
        </div>

        {/* Main Options - Responsive Grid */}
        {!scanMode ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto">
            {/* Camera Option */}
            <Card className="group relative p-6 sm:p-8 bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border border-emerald-500/20 hover:border-emerald-500/40 transition-all duration-300 shadow-xl cursor-pointer overflow-hidden active:scale-[0.98]">
              <button
                onClick={handleCameraStart}
                className="relative w-full h-full flex flex-col items-center justify-center space-y-4 sm:space-y-6 text-center"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/25 group-hover:scale-110 transition-transform duration-300">
                  <Camera size={32} className="sm:w-9 sm:h-9 md:w-10 md:h-10 text-white" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-white mb-2">Use Camera</h3>
                  <p className="text-slate-400 text-sm sm:text-base">Point your camera at the packaged food label</p>
                </div>
              </button>
            </Card>

            {/* Upload Option */}
            <Card className="group relative p-6 sm:p-8 bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border border-teal-500/20 hover:border-teal-500/40 transition-all duration-300 shadow-xl cursor-pointer overflow-hidden active:scale-[0.98]">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="relative w-full h-full flex flex-col items-center justify-center space-y-4 sm:space-y-6 text-center"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-teal-500/25 group-hover:scale-110 transition-transform duration-300">
                  <Upload size={32} className="sm:w-9 sm:h-9 md:w-10 md:h-10 text-white" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-white mb-2">Upload Image</h3>
                  <p className="text-slate-400 text-sm sm:text-base">Choose an image from your device</p>
                </div>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </Card>
          </div>
        ) : (
          // Camera Active View - Responsive
          <Card className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8 bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border border-emerald-500/20 shadow-xl space-y-4 sm:space-y-6">
            {scanMode === "camera" && (
              <div className="space-y-4 sm:space-y-6">
                {/* Camera Preview - Responsive */}
                <div className="relative w-full aspect-video bg-black rounded-xl sm:rounded-2xl overflow-hidden border-2 border-emerald-500/30">
                  <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                  <canvas ref={canvasRef} className="hidden" width={640} height={480} />
                  
                  {/* Frame Overlay - Responsive */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-[70%] h-[70%] sm:w-64 sm:h-80 border-4 border-emerald-400/50 rounded-xl sm:rounded-2xl shadow-lg shadow-emerald-500/25"></div>
                  </div>
                </div>

                {/* Action Buttons - Responsive */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <Button
                    onClick={handleCapture}
                    disabled={isScanning}
                    className="flex-1 h-12 sm:h-14 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:via-teal-400 hover:to-cyan-400 text-white font-bold text-base sm:text-lg shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Camera size={18} className="sm:w-5 sm:h-5 mr-2" /> 
                    Capture & Scan
                  </Button>
                  <Button
                    onClick={handleReset}
                    variant="outline"
                    className="h-12 sm:h-14 px-6 sm:px-8 border-2 border-slate-700 hover:border-red-500/50 bg-slate-800/50 hover:bg-red-500/10 text-slate-300 hover:text-red-400 transition-all"
                  >
                    <X size={18} className="sm:w-5 sm:h-5 mr-2" /> 
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </Card>
        )}

        {/* Tips Section - Responsive */}
        <Card className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8 bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border border-cyan-500/20 shadow-xl">
          <div className="flex items-center gap-3 mb-4 sm:mb-6">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center flex-shrink-0">
              <Sparkles size={18} className="sm:w-5 sm:h-5 text-white" />
            </div>
            <h3 className="text-lg sm:text-xl font-black text-white">Tips for Best Results</h3>
          </div>
          <ul className="space-y-3 sm:space-y-4">
            {[
              "Ensure the packaged food & nutrition label is clearly visible and well-lit",
              "Hold the camera steady for 2–3 seconds",
              "Make sure the entire label/product fits within the frame",
              "Avoid shadows and glare on the label/product",
            ].map((tip, idx) => (
              <li key={idx} className="flex items-start gap-3 sm:gap-4 group">
                <div className="shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center group-hover:bg-emerald-500/30 transition-colors mt-0.5">
                  <CheckCircle size={12} className="sm:w-[14px] sm:h-[14px] text-emerald-400" />
                </div>
                <span className="text-slate-300 leading-relaxed text-sm sm:text-base">{tip}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  )
}
