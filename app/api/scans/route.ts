// app/api/scans/route.ts
import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Create Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

/**
 * ✅ GET /api/scans?userId=<uuid>
 * Fetch all scans belonging to a specific user
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Missing userId query parameter" },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from("scans")
      .select("*")
      .eq("user_id", userId)
      .order("scanned_at", { ascending: false })

    if (error) throw error

    return NextResponse.json({ success: true, data }, { status: 200 })
  } catch (error: any) {
    console.error("GET /api/scans error:", error.message)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

/**
 * ✅ POST /api/scans
 * Save a new scan record
 */
export async function POST(request: NextRequest) {
  try {
    const scanData = await request.json()
    const userId = scanData?.userId

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Missing userId in request body" },
        { status: 400 }
      )
    }

    // Ensure array & number safety
    const formatArray = (arr: any[] | undefined | null) =>
      Array.isArray(arr) ? arr : []

    const parseNum = (value: any) =>
      value !== undefined && !isNaN(parseFloat(value))
        ? parseFloat(value)
        : null

    const newScan = {
      id: crypto.randomUUID(), // your column type is uuid
      user_id: userId,
      product_name:
        scanData.productName ||
        scanData.detected_name ||
        scanData.name ||
        scanData.product_name ||
        scanData.brand ||
        "Unnamed Product",
      detected_name: scanData.detected_name || null,
      brand: scanData.brand || null,
      category: scanData.category || null,
      barcode: scanData.barcode || null,
      health_score:
        scanData.healthScore ??
        scanData.health_score ??
        scanData.healthScore ??
        0,
      calories: parseNum(scanData.calories),
      sugar: parseNum(scanData.sugar),
      protein: parseNum(scanData.protein),
      fat: parseNum(scanData.fat),
      carbs: parseNum(scanData.carbs),
      sodium: parseNum(scanData.sodium),
      fiber: parseNum(scanData.fiber),
      serving_size: parseNum(scanData.serving_size),
      ingredients: formatArray(scanData.ingredients),
      warnings: formatArray(scanData.warnings),
      nutrition: scanData.nutrition || null,
      image_url: scanData.image_url || null,
      source: scanData.source || "manual",
      scanned_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    }

    const { error } = await supabase.from("scans").insert([newScan])
    if (error) throw error

    return NextResponse.json({ success: true, data: newScan }, { status: 201 })
  } catch (error: any) {
    console.error("POST /api/scans error:", error.message)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

/**
 * ✅ DELETE /api/scans
 * Delete a scan by ID (only if user owns it)
 */
export async function DELETE(request: NextRequest) {
  try {
    const { id, userId } = await request.json()

    if (!id || !userId) {
      return NextResponse.json(
        { success: false, error: "Missing id or userId" },
        { status: 400 }
      )
    }

    // Verify ownership
    const { data: existing, error: fetchError } = await supabase
      .from("scans")
      .select("id, user_id")
      .eq("id", id)
      .single()

    if (fetchError) throw fetchError
    if (!existing)
      return NextResponse.json(
        { success: false, error: "Scan not found" },
        { status: 404 }
      )

    if (existing.user_id !== userId) {
      return NextResponse.json(
        { success: false, error: "Forbidden — not your scan" },
        { status: 403 }
      )
    }

    const { error } = await supabase.from("scans").delete().eq("id", id)
    if (error) throw error

    return NextResponse.json(
      { success: true, data: { id } },
      { status: 200 }
    )
  } catch (error: any) {
    console.error("DELETE /api/scans error:", error.message)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
