"use client"

import { useState } from "react"
import { ThumbsUp, ThumbsDown, Send, RotateCcw, CheckCircle2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

interface NutritionValues {
  calories?: number
  fat?:      number
  sugar?:    number
  protein?:  number
  carbs?:    number
  sodium?:   number
  fiber?:    number
}

interface NutritionFeedbackWidgetProps {
  productName: string
  brand?:      string
  scanId?:     string
  nutrition:   NutritionValues
}

type WidgetState = "idle" | "loading" | "voted_correct" | "editing_incorrect" | "submitted"

const FIELDS: { key: keyof NutritionValues; label: string; unit: string; icon: string }[] = [
  { key: "calories", label: "Calories",  unit: "kcal", icon: "⚡" },
  { key: "fat",      label: "Fat",       unit: "g",    icon: "🧈" },
  { key: "sugar",    label: "Sugar",     unit: "g",    icon: "🍬" },
  { key: "protein",  label: "Protein",   unit: "g",    icon: "💪" },
  { key: "carbs",    label: "Carbs",     unit: "g",    icon: "🌾" },
  { key: "sodium",   label: "Sodium",    unit: "mg",   icon: "🧂" },
  { key: "fiber",    label: "Fiber",     unit: "g",    icon: "🥦" },
]

export default function NutritionFeedbackWidget({
  productName,
  brand = "",
  scanId,
  nutrition,
}: NutritionFeedbackWidgetProps) {
  const { toast } = useToast()

  const [state,            setState]           = useState<WidgetState>("idle")
  const [updatedScore,     setUpdatedScore]    = useState<number | null>(null)

  // Editable correction fields — pre-filled with current values
  const [corrections, setCorrections] = useState<NutritionValues>({ ...nutrition })

  // ── Handlers ────────────────────────────────────────────────────────────────

  const submitFeedback = async (payload: object) => {
    setState("loading")
    try {
      const resp = await fetch("/api/feedback", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(payload),
      })
      if (!resp.ok) throw new Error(await resp.text())
      const json = await resp.json()
      return json
    } catch (err) {
      console.error("❌ [NutritionFeedback] submit error:", err)
      throw err
    }
  }

  const handleCorrect = async () => {
    try {
      await submitFeedback({
        product_name:  productName,
        brand,
        scan_id:       scanId,
        feedback_type: "correct",
      })
      setState("voted_correct")
      toast({
        title: "Thanks! 🎉",
        description: "Your feedback helps us stay accurate.",
      })
    } catch {
      setState("idle")
      toast({
        title:   "Error",
        description: "Could not save feedback. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleSubmitCorrections = async () => {
    // Build only the fields that actually changed
    const changed: NutritionValues = {}
    let anyChanged = false

    for (const { key } of FIELDS) {
      const original = nutrition[key] ?? 0
      const corrected = Number(corrections[key] ?? original)
      if (corrected !== original) {
        (changed as any)[key] = corrected
        anyChanged = true
      }
    }

    if (!anyChanged) {
      toast({
        title:       "No changes",
        description: "Adjust at least one value before submitting.",
      })
      setState("editing_incorrect")
      return
    }

    try {
      const json = await submitFeedback({
        product_name:  productName,
        brand,
        scan_id:       scanId,
        feedback_type: "incorrect",
        corrections:   changed,
      })
      if (json.updated_health_score != null) {
        setUpdatedScore(json.updated_health_score)
      }
      setState("submitted")
      toast({
        title: "Corrections saved! 🙌",
        description:
          json.updated_health_score != null
            ? `Health score updated to ${json.updated_health_score}/100 based on your values.`
            : "Our model will use your corrections for future scans.",
      })
    } catch {
      setState("idle")
      toast({
        title:       "Error",
        description: "Could not save corrections. Please try again.",
        variant:     "destructive",
      })
    }
  }

  const handleFieldChange = (key: keyof NutritionValues, val: string) => {
    setCorrections((prev) => ({ ...prev, [key]: val === "" ? undefined : parseFloat(val) || 0 }))
  }

  // ── Render ───────────────────────────────────────────────────────────────────

  // ― Loading spinner ―
  if (state === "loading") {
    return (
      <div className="flex items-center justify-center gap-2 py-4 text-slate-400">
        <Loader2 size={18} className="animate-spin" />
        <span className="text-sm">Saving your feedback…</span>
      </div>
    )
  }

  // ― Voted correct ―
  if (state === "voted_correct") {
    return (
      <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
        <CheckCircle2 size={20} className="text-emerald-400 flex-shrink-0" />
        <div>
          <p className="text-sm font-semibold text-emerald-300">Thanks for confirming! ✅</p>
          <p className="text-xs text-emerald-400/70 mt-0.5">
            This data is marked as accurate in our database.
          </p>
        </div>
      </div>
    )
  }

  // ― Submitted corrections ―
  if (state === "submitted") {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-3 p-4 rounded-xl bg-teal-500/10 border border-teal-500/30">
          <CheckCircle2 size={20} className="text-teal-400 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-teal-300">Corrections saved! 🙌</p>
            <p className="text-xs text-teal-400/70 mt-0.5">
              Our model has learned from your input.{" "}
              {updatedScore != null && (
                <span className="font-bold text-teal-300">
                  Revised health score: {updatedScore}/100
                </span>
              )}
            </p>
          </div>
        </div>
        <button
          onClick={() => { setState("idle"); setCorrections({ ...nutrition }) }}
          className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors"
        >
          <RotateCcw size={12} />
          Edit again
        </button>
      </div>
    )
  }

  // ― Correction form ―
  if (state === "editing_incorrect") {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-amber-300">
            ✏️ Enter the correct values (per 100g)
          </p>
          <button
            onClick={() => setState("idle")}
            className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
          >
            Cancel
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {FIELDS.map(({ key, label, unit, icon }) => {
            const original = nutrition[key]
            const hasValue = original != null && original !== 0
            if (!hasValue && key !== "calories" && key !== "fat" && key !== "sugar" && key !== "protein" && key !== "carbs") {
              // Only show sodium/fiber if they have existing values (otherwise they might not have been scanned)
              if (original == null) return null
            }
            return (
              <div key={key} className="space-y-1">
                <label className="text-xs text-slate-400 flex items-center gap-1">
                  {icon} {label} <span className="text-slate-600">({unit})</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={0}
                    step={key === "calories" ? 1 : 0.1}
                    value={corrections[key] ?? ""}
                    onChange={(e) => handleFieldChange(key, e.target.value)}
                    placeholder={`${original ?? 0}`}
                    className="
                      w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-600
                      focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30 outline-none
                      text-white text-sm font-medium
                      [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none
                      [&::-webkit-inner-spin-button]:appearance-none
                    "
                  />
                  <span className="text-xs text-slate-500 w-10 flex-shrink-0">{unit}</span>
                </div>
                {original != null && (
                  <p className="text-[11px] text-slate-600">
                    Current: {original} {unit}
                  </p>
                )}
              </div>
            )
          })}
        </div>

        <Button
          onClick={handleSubmitCorrections}
          className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-bold shadow-lg shadow-amber-500/20"
        >
          <Send size={15} className="mr-2" />
          Submit Corrections
        </Button>
      </div>
    )
  }

  // ― Idle (default) — show the question ―
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="w-1.5 h-5 rounded-full bg-gradient-to-b from-amber-400 to-orange-500" />
        <p className="text-sm font-semibold text-slate-300">
          Are these nutritional values approximately correct?
        </p>
      </div>

      <p className="text-xs text-slate-500 pl-3.5">
        Your feedback helps NutriGo improve accuracy for everyone.
      </p>

      <div className="flex gap-3 pl-3.5">
        <button
          onClick={handleCorrect}
          className="
            flex items-center gap-2 px-4 py-2.5 rounded-xl
            bg-emerald-500/15 border border-emerald-500/30
            hover:bg-emerald-500/25 hover:border-emerald-500/50
            text-emerald-300 text-sm font-semibold
            transition-all active:scale-95
          "
        >
          <ThumbsUp size={15} />
          Yes, looks right
        </button>

        <button
          onClick={() => setState("editing_incorrect")}
          className="
            flex items-center gap-2 px-4 py-2.5 rounded-xl
            bg-amber-500/15 border border-amber-500/30
            hover:bg-amber-500/25 hover:border-amber-500/50
            text-amber-300 text-sm font-semibold
            transition-all active:scale-95
          "
        >
          <ThumbsDown size={15} />
          No, they&apos;re off
        </button>
      </div>
    </div>
  )
}
