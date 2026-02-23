"use client"

import { useEffect, useRef, useState } from "react"

interface AuthCharactersProps {
  isPasswordFocused: boolean
  isEmailFocused?: boolean
  isHappy: boolean
  mousePosition: { x: number; y: number }
  containerRef: React.RefObject<HTMLDivElement>
}

export function AuthCharacters({
  isPasswordFocused,
  isEmailFocused,
  isHappy,
  mousePosition,
  containerRef,
}: AuthCharactersProps) {
  const calculateEyePosition = (centerX: number, centerY: number) => {
    if (isPasswordFocused) return { x: 0, y: 0 }

    const deltaX = mousePosition.x - centerX
    const deltaY = mousePosition.y - centerY
    const angle = Math.atan2(deltaY, deltaX)
    const distance = Math.min(Math.sqrt(deltaX * deltaX + deltaY * deltaY) / 40, 3)

    return {
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance
    }
  }

  const calculateTilt = (centerX: number, centerY: number) => {
    if (isPasswordFocused) return { x: 0, y: 0 }
    const deltaX = mousePosition.x - centerX
    const deltaY = mousePosition.y - centerY
    const tiltX = Math.max(-25, Math.min(25, -(deltaY / 20)))
    const tiltY = Math.max(-25, Math.min(25, (deltaX / 20)))
    return { x: tiltX, y: tiltY }
  }

  // Helper for 3D eye rendering
  const renderEye = (centerX: number, centerY: number, eyeBg: string, pupilBg: string) => {
    const pos = calculateEyePosition(centerX, centerY)
    return (
      <div className={`w-6 h-6 ${eyeBg} rounded-full relative overflow-hidden transition-all duration-300 shadow-[inset_0_3px_6px_rgba(0,0,0,0.4),_0_2px_4px_rgba(255,255,255,0.2)] flex items-center justify-center`}>
        {isPasswordFocused ? (
          <div className="absolute top-1/2 left-0 w-full h-1.5 bg-slate-900 rounded-full shadow-[0_2px_2px_rgba(0,0,0,0.5)]"></div>
        ) : (
          <div
            className={`w-3 h-3 ${pupilBg} rounded-full absolute transition-transform duration-200 shadow-[inset_0_-2px_4px_rgba(0,0,0,0.5)]`}
            style={{
              transform: `translate(${pos.x * 3.5}px, ${pos.y * 3.5}px)`
            }}
          >
            {/* Catchlight for 3D effect */}
            <div className="absolute top-[10%] left-[10%] w-1.5 h-1.5 bg-white rounded-full opacity-90"></div>
          </div>
        )}
      </div>
    )
  }

  // Helper for 3D mouth rendering
  const renderMouth = (baseWidth: string, happyWidth: string) => {
    if (isHappy) {
      return (
        <div className={`transition-all duration-500 mt-4 ${happyWidth} h-6 bg-slate-900 rounded-b-full overflow-hidden relative shadow-[inset_0_4px_6px_rgba(0,0,0,0.6)]`}>
          {/* Tongue */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-3 bg-red-500 rounded-t-full shadow-[inset_0_-2px_4px_rgba(0,0,0,0.3)]"></div>
          {/* Teeth */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1.5 bg-white rounded-b-sm"></div>
        </div>
      )
    }
    if (isEmailFocused) {
      return (
        <div className={`transition-all duration-500 mt-4 w-4 h-4 bg-slate-900 rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]`}></div>
      )
    }
    if (isPasswordFocused) {
      return (
        <div className={`transition-all duration-500 mt-4 ${baseWidth} h-1 bg-slate-900 rounded-full shadow-[inset_0_1px_2px_rgba(0,0,0,0.6)]`}></div>
      )
    }
    return (
      <div className={`transition-all duration-500 mt-4 ${baseWidth} h-1.5 bg-slate-900 rounded-full shadow-[inset_0_1px_2px_rgba(0,0,0,0.6)]`}></div>
    )
  }

  return (
    <div className="hidden lg:flex items-center justify-center bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl rounded-l-3xl border-l border-t border-b border-emerald-500/20 p-12 relative overflow-visible h-[700px]" style={{ perspective: '1000px' }}>
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full" style={{
          backgroundImage: `radial-gradient(circle, #34d399 1px, transparent 1px)`,
          backgroundSize: '30px 30px'
        }}></div>
      </div>

      <div className="relative w-full h-full flex items-center justify-center" style={{ transformStyle: 'preserve-3d' }}>
        <div className="relative w-[420px] h-[380px]" style={{ transformStyle: 'preserve-3d' }}>

          {/* Character 1: Orange Semicircle (Dome) */}
          <div
            className="absolute bottom-0 left-0 w-48 h-28 rounded-t-full transition-all duration-500 z-40 flex flex-col items-center pt-7"
            style={{
              background: 'radial-gradient(circle at 50% 20%, #fb923c, #ea580c 60%, #9a3412)',
              boxShadow: 'inset 0 -10px 20px rgba(0,0,0,0.5), inset 0 10px 20px rgba(255,255,255,0.4), 0 20px 30px rgba(0,0,0,0.5)',
              transform: `translateY(${isHappy ? '-15px' : '0'}) rotateX(${calculateTilt(100, 350).x}deg) rotateY(${calculateTilt(100, 350).y}deg)`,
              animation: 'sway 4s ease-in-out infinite, breathe 3s ease-in-out infinite',
              transformStyle: 'preserve-3d',
            }}
          >
            <div className="flex gap-7" style={{ transform: 'translateZ(20px)' }}>
              {renderEye(100, 350, 'bg-slate-900', 'bg-white')}
              {renderEye(100, 350, 'bg-slate-900', 'bg-white')}
            </div>
            <div style={{ transform: 'translateZ(25px)' }}>
              {renderMouth('w-14', 'w-16')}
            </div>
          </div>

          {/* Character 2: Purple Rectangle (Tall Cylinder) */}
          <div
            className="absolute bottom-0 left-20 w-32 h-80 rounded-t-3xl transition-all duration-500 z-10 flex flex-col items-center pt-8"
            style={{
              background: 'linear-gradient(to right, #8b5cf6, #a78bfa 20%, #7c3aed 80%, #4c1d95)',
              boxShadow: 'inset 0 10px 20px rgba(255,255,255,0.3), inset 0 -20px 30px rgba(0,0,0,0.5), 0 25px 35px rgba(0,0,0,0.6)',
              transform: `translateY(${isHappy ? '-20px' : '0'}) rotateX(${calculateTilt(180, 240).x}deg) rotateY(${calculateTilt(180, 240).y}deg)`,
              animation: 'sway 5s ease-in-out infinite 0.5s, breathe 4s ease-in-out infinite',
              transformStyle: 'preserve-3d',
            }}
          >
            <div className="flex gap-5 mt-2" style={{ transform: 'translateZ(20px)' }}>
              {renderEye(180, 240, 'bg-white', 'bg-slate-900')}
              {renderEye(180, 240, 'bg-white', 'bg-slate-900')}
            </div>
            <div style={{ transform: 'translateZ(25px)' }}>
              {renderMouth('w-10', 'w-12')}
            </div>
          </div>

          {/* Character 3: WHITE Rectangle (Box) */}
          <div
            className="absolute bottom-0 left-36 w-36 h-40 rounded-t-3xl transition-all duration-500 z-20 flex flex-col items-center pt-16"
            style={{
              background: 'linear-gradient(to right, #f3f4f6, #ffffff 20%, #e5e7eb 80%, #9ca3af)',
              boxShadow: 'inset 0 10px 20px rgba(255,255,255,0.9), inset 0 -20px 30px rgba(0,0,0,0.2), 0 20px 30px rgba(0,0,0,0.4)',
              transform: `translateY(${isHappy ? '-16px' : '0'}) rotateX(${calculateTilt(270, 320).x}deg) rotateY(${calculateTilt(270, 320).y}deg)`,
              animation: 'sway 4.5s ease-in-out infinite 1s, breathe 3.5s ease-in-out infinite',
              transformStyle: 'preserve-3d',
            }}
          >
            <div className="flex gap-5" style={{ transform: 'translateZ(20px)' }}>
              {renderEye(270, 320, 'bg-slate-900', 'bg-white')}
              {renderEye(270, 320, 'bg-slate-900', 'bg-white')}
            </div>
            <div style={{ transform: 'translateZ(25px)' }}>
              {renderMouth('w-10', 'w-12')}
            </div>
          </div>

          {/* Character 4: Yellow (Short Cylinder) */}
          <div
            className="absolute bottom-0 right-0 w-32 h-32 rounded-t-3xl transition-all duration-500 z-30 flex flex-col items-center pt-10"
            style={{
              background: 'linear-gradient(to right, #eab308, #fef08a 20%, #ca8a04 80%, #854d0e)',
              boxShadow: 'inset 0 10px 20px rgba(255,255,255,0.6), inset 0 -20px 30px rgba(0,0,0,0.4), 0 20px 30px rgba(0,0,0,0.5)',
              transform: `translateY(${isHappy ? '-14px' : '0'}) rotateX(${calculateTilt(380, 340).x}deg) rotateY(${calculateTilt(380, 340).y}deg)`,
              animation: 'sway 3.5s ease-in-out infinite 1.5s, breathe 3s ease-in-out infinite',
              transformStyle: 'preserve-3d',
            }}
          >
            <div className="flex gap-5" style={{ transform: 'translateZ(20px)' }}>
              {renderEye(380, 340, 'bg-slate-900', 'bg-yellow-200')}
              {renderEye(380, 340, 'bg-slate-900', 'bg-yellow-200')}
            </div>
            <div style={{ transform: 'translateZ(25px)' }}>
              {renderMouth('w-12', 'w-14')}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
