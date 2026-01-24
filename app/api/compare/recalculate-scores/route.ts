import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:4000';
    const url = `${backendUrl}/api/compare/recalculate-scores`;
    
    console.log(`🔄 Forwarding compare request to backend:`);
    console.log(`   URL: ${url}`);
    console.log(`   BACKEND_URL env: ${process.env.BACKEND_URL || 'not set'}`);
    console.log(`   Body:`, body);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    
    // Get response body as text first
    const responseText = await response.text();
    
    if (!response.ok) {
      console.error(`❌ Backend error (${response.status}):`, responseText);
      throw new Error(`Backend returned ${response.status}: ${responseText}`);
    }

    try {
      // Try to parse the response as JSON
      const data = JSON.parse(responseText);
      return NextResponse.json(data);
    } catch (parseError) {
      console.error("❌ Failed to parse backend response:", responseText);
      throw new Error("Invalid JSON response from backend");
    }
  } catch (error) {
    console.error("❌ Error in compare API route:", error);
    return NextResponse.json(
      { 
        error: "Failed to recalculate health scores",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
