import { NextRequest, NextResponse } from "next/server";

const BACKEND = process.env.BACKEND_URL || "http://localhost:4000";

// POST /api/feedback  — submit feedback
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const response = await fetch(`${BACKEND}/api/feedback`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const text = await response.text();
    if (!response.ok) {
      console.error("❌ [feedback proxy] Backend error:", text);
      return NextResponse.json(
        { error: "Backend error", details: text },
        { status: response.status }
      );
    }

    return NextResponse.json(JSON.parse(text));
  } catch (err) {
    console.error("❌ [feedback proxy] POST error:", err);
    return NextResponse.json(
      { error: "Failed to submit feedback" },
      { status: 500 }
    );
  }
}

// GET /api/feedback?product_name=<name>  — get aggregate feedback
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get("product_name") || "";

    const response = await fetch(
      `${BACKEND}/api/feedback?product_name=${encodeURIComponent(name)}`
    );

    const text = await response.text();
    if (!response.ok) {
      return NextResponse.json(
        { error: "Backend error", details: text },
        { status: response.status }
      );
    }

    return NextResponse.json(JSON.parse(text));
  } catch (err) {
    console.error("❌ [feedback proxy] GET error:", err);
    return NextResponse.json(
      { error: "Failed to fetch feedback" },
      { status: 500 }
    );
  }
}
