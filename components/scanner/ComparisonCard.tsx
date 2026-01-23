"use client"

import React from "react"
import { Card } from "@/components/ui/card"
import { ComparisonProduct } from "@/lib/comparisonContext"

interface ComparisonCardProps {
  product: ComparisonProduct
  isWinner: boolean
  position: "first" | "second"
  isLoading: boolean
}

export default function ComparisonCard({
  product,
  isWinner,
  position,
  isLoading,
}: ComparisonCardProps) {
  return (
    <Card className="p-4 bg-slate-800 border border-slate-700 rounded-lg">
      {/* Add your comparison card content here */}
    </Card>
  )
}
