"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Camera, Upload, X, Loader, Sparkles, Zap, CheckCircle } from "lucide-react"
import ScanResult from "@/components/scanner/scan-result"

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
}

export default function ScannerPage() {
  const [scanMode, setScanMode] = useState<"camera" | "upload" | null>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [scanResult, setScanResult] = useState<ScanData | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const mockScanResult: ScanData = {
    name: "Coca Cola",
    brand: "The Coca-Cola Company",
    healthScore: 25,
    calories: 140,
    sugar: 39,
    protein: 0,
    fat: 0,
    carbs: 39,
    ingredients: [
      "Carbonated Water",
      "High Fructose Corn Syrup",
      "Caramel Color",
      "Phosphoric Acid",
      "Natural Flavors",
    ],
    warnings: ["High Sugar Content", "Contains Caffeine", "High Calorie Density"],
    timestamp: new Date().toLocaleString(),
  }

  const handleCameraStart = async () => {
    setScanMode("camera")
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (err) {
      console.error("Error accessing camera:", err)
      alert("Unable to access camera. Please check permissions.")
      setScanMode(null)
    }
  }

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d")
      if (context) {
        context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height)
        setIsScanning(true)

        setTimeout(() => {
          setScanResult(mockScanResult)
          setIsScanning(false)
          setScanMode(null)
          if (videoRef.current?.srcObject) {
            const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
            tracks.forEach((track) => track.stop())
          }
        }, 2000)
      }
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setScanMode("upload")
      setIsScanning(true)

      setTimeout(() => {
        setScanResult(mockScanResult)
        setIsScanning(false)
        setScanMode(null)
      }, 2000)
    }
  }

  const handleReset = () => {
    setScanResult(null)
    setScanMode(null)
  }

  if (scanResult) {
    return <ScanResult data={scanResult} onReset={handleReset} />
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
              <Zap size={28} className="text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-white">
                Food Scanner
              </h1>
              <p className="text-slate-400 text-lg">Scan any food or beverage to get instant nutrition insights</p>
            </div>
          </div>
        </div>

        {/* Scanner Interface */}
        {!scanMode ? (
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Camera Option */}
            <Card className="group relative p-8 bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border border-emerald-500/20 hover:border-emerald-500/40 transition-all duration-300 shadow-xl hover:shadow-emerald-500/20 cursor-pointer overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <button
                onClick={handleCameraStart}
                className="relative w-full h-full flex flex-col items-center justify-center space-y-6 text-center"
              >
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/25 group-hover:scale-110 transition-transform duration-300">
                  <Camera size={40} className="text-white" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-white">Use Camera</h3>
                  <p className="text-slate-400">Point your camera at the food label</p>
                </div>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 text-emerald-400 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                  <Sparkles size={16} />
                  <span>Click to start</span>
                </div>
              </button>
            </Card>

            {/* Upload Option */}
            <Card className="group relative p-8 bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border border-teal-500/20 hover:border-teal-500/40 transition-all duration-300 shadow-xl hover:shadow-teal-500/20 cursor-pointer overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="relative w-full h-full flex flex-col items-center justify-center space-y-6 text-center"
              >
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-teal-500/25 group-hover:scale-110 transition-transform duration-300">
                  <Upload size={40} className="text-white" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-white">Upload Image</h3>
                  <p className="text-slate-400">Choose an image from your device</p>
                </div>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 text-teal-400 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                  <Sparkles size={16} />
                  <span>Click to upload</span>
                </div>
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            </Card>
          </div>
        ) : (
          /* Camera/Upload View */
          <Card className="max-w-4xl mx-auto p-8 bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border border-emerald-500/20 shadow-xl space-y-6">
            {scanMode === "camera" && (
              <div className="space-y-6">
                <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden border-2 border-emerald-500/30">
                  <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                  <canvas ref={canvasRef} className="hidden" width={640} height={480} />

                  {/* Scan Frame Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-64 h-80 border-4 border-emerald-400/50 rounded-2xl shadow-lg shadow-emerald-500/25">
                      <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-emerald-400 rounded-tl-2xl"></div>
                      <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-emerald-400 rounded-tr-2xl"></div>
                      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-emerald-400 rounded-bl-2xl"></div>
                      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-emerald-400 rounded-br-2xl"></div>
                    </div>
                  </div>

                  {/* Loading Indicator */}
                  {isScanning && (
                    <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center">
                      <div className="space-y-6 text-center">
                        <div className="relative">
                          <div className="w-20 h-20 rounded-full border-4 border-emerald-500/20 border-t-emerald-400 animate-spin mx-auto"></div>
                          <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-emerald-400 animate-pulse" />
                        </div>
                        <div className="space-y-2">
                          <p className="text-white text-xl font-bold">Analyzing label...</p>
                          <p className="text-emerald-400 text-sm">AI is processing your image</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-4">
                  <Button
                    onClick={handleCapture}
                    disabled={isScanning}
                    className="flex-1 h-14 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:via-teal-400 hover:to-cyan-400 text-white font-bold shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all duration-300 border-0 text-lg"
                  >
                    <Camera size={20} className="mr-2" />
                    Capture & Scan
                  </Button>
                  <Button
                    onClick={() => {
                      setScanMode(null)
                      if (videoRef.current?.srcObject) {
                        const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
                        tracks.forEach((track) => track.stop())
                      }
                    }}
                    variant="outline"
                    className="h-14 px-8 border-2 border-slate-700 hover:border-red-500/50 bg-slate-800/50 hover:bg-red-500/10 text-slate-300 hover:text-red-400 transition-all"
                  >
                    <X size={20} className="mr-2" />
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </Card>
        )}

        {/* Tips Section */}
        <Card className="max-w-4xl mx-auto p-8 bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border border-cyan-500/20 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <Sparkles size={20} className="text-white" />
            </div>
            <h3 className="text-xl font-black text-white">Tips for Best Results</h3>
          </div>
          <ul className="space-y-4">
            {[
              "Ensure the nutrition label is clearly visible and well-lit",
              "Hold the camera steady for 2-3 seconds",
              "Make sure the entire label fits within the frame",
              "Avoid shadows and glare on the label"
            ].map((tip, idx) => (
              <li key={idx} className="flex items-start gap-4 group">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center group-hover:bg-emerald-500/30 transition-colors">
                  <CheckCircle size={14} className="text-emerald-400" />
                </div>
                <span className="text-slate-300 leading-relaxed">{tip}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  )
}
