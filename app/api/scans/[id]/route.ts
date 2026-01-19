// app/api/scans/[id]/route.ts
import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Create Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

/**
 * ✅ GET /api/scans/[id]
 * Fetch a single scan by ID
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> } // ✅ Fixed: params is Promise
) {
  try {
    // ✅ IMPORTANT: Await params in Next.js 15+
    const params = await context.params
    const scanId = params.id

    if (!scanId) {
      return NextResponse.json(
        { success: false, error: "Missing scan ID" },
        { status: 400 }
      )
    }

    console.log("📥 Fetching scan with ID:", scanId)

    // Fetch the scan from database
    const { data: scan, error } = await supabase
      .from("scans")
      .select("*")
      .eq("id", scanId)
      .single()

    if (error) {
      console.error("❌ Database error:", error)
      return NextResponse.json(
        { success: false, error: "Scan not found" },
        { status: 404 }
      )
    }

    if (!scan) {
      return NextResponse.json(
        { success: false, error: "Scan not found" },
        { status: 404 }
      )
    }

    // ✅ LOG WHAT WE'RE RETURNING
    console.log("📊 Scan data being returned:", {
      product_name: scan.product_name,
      detected_name: scan.detected_name,
      nutrition: scan.nutrition,
      flat_calories: scan.calories,
      flat_sugar: scan.sugar
    })

    // ✅ Normalize the response to handle both healthScore and health_score
    const normalizedScan = {
      ...scan,
      health_score: scan.health_score ?? scan.healthScore ?? 0,
      healthScore: scan.healthScore ?? scan.health_score ?? 0,
    }

    console.log("✅ Scan found:", normalizedScan.product_name || normalizedScan.detected_name)

    return NextResponse.json(
      { success: true, data: normalizedScan },
      { status: 200 }
    )
  } catch (error: any) {
    console.error("❌ GET /api/scans/[id] error:", error.message)
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    )
  }
}

/**
 * ✅ DELETE /api/scans/[id]
 * Delete a specific scan
 */
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const scanId = params.id
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!scanId) {
      return NextResponse.json(
        { success: false, error: "Missing scan ID" },
        { status: 400 }
      )
    }

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Missing userId parameter" },
        { status: 400 }
      )
    }

    console.log("🗑️ Deleting scan:", scanId)

    // Verify ownership before deleting
    const { data: existing, error: fetchError } = await supabase
      .from("scans")
      .select("user_id")
      .eq("id", scanId)
      .single()

    if (fetchError || !existing) {
      return NextResponse.json(
        { success: false, error: "Scan not found" },
        { status: 404 }
      )
    }

    if (existing.user_id !== userId) {
      return NextResponse.json(
        { success: false, error: "Forbidden - not your scan" },
        { status: 403 }
      )
    }

    const { error } = await supabase
      .from("scans")
      .delete()
      .eq("id", scanId)

    if (error) throw error

    console.log("✅ Scan deleted successfully")

    return NextResponse.json(
      { success: true, message: "Scan deleted successfully" },
      { status: 200 }
    )
  } catch (error: any) {
    console.error("❌ DELETE /api/scans/[id] error:", error.message)
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    )
  }
}
