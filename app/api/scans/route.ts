
import { type NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Define the path to the file where scans will be stored
const dataFilePath = path.join(process.cwd(), "data", "scans.json");

/**
 * Reads the existing scan data from the JSON file.
 */
const readScansFromFile = () => {
  try {
    if (fs.existsSync(dataFilePath)) {
      const fileContent = fs.readFileSync(dataFilePath, "utf8");
      return fileContent ? JSON.parse(fileContent) : [];
    }
  } catch (error) {
    console.error("Error reading from scans data file:", error);
  }
  return [];
};

/**
 * Writes the provided scan data to the JSON file.
 */
const writeScansToFile = (data: any[]) => {
  try {
    const dir = path.dirname(dataFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error writing to scans data file:", error);
  }
};

/**
 * Handles GET requests to fetch the entire scan history.
 */
export async function GET() {
  const scans = readScansFromFile();
  return NextResponse.json({ success: true, data: scans });
}

/**
 * Handles DELETE requests to remove a scan by id.
 * Expects a JSON body: { id: string }
 */
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const idToDelete = body?.id;
    if (!idToDelete) {
      return NextResponse.json({ success: false, error: 'Missing id' }, { status: 400 });
    }

    const allScans = readScansFromFile();
    const filtered = allScans.filter((s: any) => s.id !== idToDelete);

    if (filtered.length === allScans.length) {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    }

    writeScansToFile(filtered);
    return NextResponse.json({ success: true, data: { id: idToDelete } });
  } catch (error) {
    console.error('Error deleting scan:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete' }, { status: 500 });
  }
}

/**
 * Handles POST requests to add a new scan to the history.
 */
export async function POST(request: NextRequest) {
  try {
    const scanData = await request.json();
    const allScans = readScansFromFile();

    // Ensure arrays are properly formatted for PostgreSQL
    const formatArray = (arr: any[] | undefined | null) => {
      return Array.isArray(arr) ? arr : [];
    };

    const newScan = {
      id: `scan_${Date.now()}`,
      userId: "user_123", // In a real app, this would be dynamic
      // Normalize incoming scan data to always include productName
      ...scanData,
      productName: scanData.productName || scanData.detected_name || scanData.name || scanData.product_name || scanData.brand || "",
      ingredients: formatArray(scanData.ingredients),
      warnings: formatArray(scanData.warnings),
      scannedAt: new Date().toISOString(),
    };

    // Add the new scan to the beginning of the array
    allScans.unshift(newScan);
    writeScansToFile(allScans);

    return NextResponse.json({ success: true, data: newScan }, { status: 201 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error";
    return NextResponse.json(
      { success: false, error: `Failed to create scan: ${errorMessage}` },
      { status: 500 }
    );
  }
}
