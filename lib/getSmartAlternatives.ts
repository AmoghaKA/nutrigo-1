/**
 * Smart Alternatives Fetcher
 * 
 * TROUBLESHOOTING GUIDE:
 * 
 * If you see "Failed to fetch alternatives" error:
 * 
 * 1. CHECK BACKEND STATUS:
 *    - Ensure backend is running: npm run dev (from backend folder)
 *    - Check if port 3001 is not in use
 *    - Verify no firewall blocking localhost:3001
 * 
 * 2. CHECK ENVIRONMENT VARIABLES:
 *    - Set NEXT_PUBLIC_BACKEND_URL in .env.local (frontend)
 *    - Example: NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
 *    - Without this, defaults to http://localhost:3001
 * 
 * 3. CHECK BROWSER CONSOLE:
 *    - Look for "Backend connection failed" or specific error
 *    - Check Network tab for 404 or CORS errors
 * 
 * 4. CHECK BACKEND LOGS:
 *    - Look for "📥 Smart alternatives request" messages
 *    - Should see "✅ Returning X alternatives"
 *    - If missing, POST route may not be registered
 * 
 * 5. TEST ENDPOINT MANUALLY:
 *    - Run: curl -X POST http://localhost:3001/api/alternatives/health
 *    - Or use: fetch('http://localhost:3001/api/alternatives/health')
 * 
 * The system falls back to static alternatives if backend fails,
 * so you should always see some results, not errors.
 */

import { detectProductCategory, getSubCategory } from './categoryDetector';

interface ScannedProduct {
  detected_name: string;
  brand: string;
  health_score: number;
  ingredients: string[];
  nutrition: any;
}

interface Alternative {
  name: string;
  brand: string;
  health_score: number;
  nutrition: any;
  benefits: string[];
  description: string;
  purchaseLinks?: {
    blinkit?: string;
    zepto?: string;
    swiggy?: string;
    bigbasket?: string;
  };
  matchScore: number;
}

// Debug helper to test backend connectivity
async function testBackendConnection(backendUrl: string): Promise<boolean> {
  try {
    console.log(`🔍 Testing backend connection to ${backendUrl}/api/alternatives/health`);
    const response = await fetch(`${backendUrl}/api/alternatives/health`);
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Backend is reachable:', data);
      return true;
    }
    console.warn('⚠️ Backend returned:', response.status);
    return false;
  } catch (error) {
    console.error('❌ Backend connection failed:', error);
    return false;
  }
}

export async function getSmartAlternatives(
  scannedProduct: ScannedProduct
): Promise<Alternative[]> {
  
  // 1. Detect category
  const category = detectProductCategory(
    scannedProduct.detected_name, 
    scannedProduct.ingredients
  );
  const subCategory = getSubCategory(scannedProduct.detected_name, category);

  console.log(`Detected category: ${category}, subcategory: ${subCategory}`);

  // 2. Fetch alternatives from Next.js API route (which forwards to backend)
  try {
    const apiUrl = '/api/alternatives';
    console.log(`📡 Fetching alternatives from: ${apiUrl}`);
    console.log(`📦 Request payload:`, {
      category,
      subCategory,
      currentHealthScore: scannedProduct.health_score,
      currentProduct: scannedProduct.detected_name,
      currentBrand: scannedProduct.brand
    });
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        category,
        subCategory,
        currentHealthScore: scannedProduct.health_score,
        currentProduct: scannedProduct.detected_name,
        currentBrand: scannedProduct.brand
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ API Error - Status: ${response.status}, Message: ${errorText}`);
      throw new Error(`Failed to fetch alternatives: ${response.status} ${errorText}`);
    }

    const alternatives = await response.json();
    console.log(`✅ Fetched ${alternatives.length} alternatives from API`);

    // 3. Filter and rank alternatives
    // Don't filter too aggressively - show alternatives even if they're similar in health score
    return alternatives
      .map((alt: Alternative) => ({
        ...alt,
        matchScore: calculateMatchScore(alt, scannedProduct, subCategory)
      }))
      .sort((a: Alternative, b: Alternative) => b.matchScore - a.matchScore)
      .slice(0, 12); // Top 12 alternatives

  } catch (error) {
    console.error('❌ Error fetching alternatives:', error);
    console.log('📦 Falling back to static alternatives...');
    
    // Fallback to static alternatives
    try {
      const { healthyAlternatives } = await import('./mockAlternatives');
      const staticAlts = healthyAlternatives[category as keyof typeof healthyAlternatives] || [];
      console.log(`✅ Returning ${staticAlts.length} static alternatives for ${category}`);
      
      // Add matchScore to static alternatives
      return staticAlts.map((alt: any) => ({
        ...alt,
        matchScore: 50 // Default match score for static alternatives
      }));
    } catch (fallbackError) {
      console.error('❌ Fallback failed:', fallbackError);
      return [];
    }
  }
}

function calculateMatchScore(
  alternative: Alternative,
  scanned: ScannedProduct,
  subCategory: string
): number {
  let score = 0;

  // Health score improvement (40% weight)
  // Give points even if equal or slightly worse (more lenient)
  const scoreDiff = alternative.health_score - scanned.health_score;
  if (scoreDiff >= 10) {
    score += 40; // Much better
  } else if (scoreDiff >= 0) {
    score += 30; // Better or equal
  } else if (scoreDiff >= -10) {
    score += 20; // Slightly worse but close
  } else {
    score += 10; // Less healthy but still show
  }

  // Same subcategory (30% weight)
  const altSubCategory = getSubCategory(alternative.name, detectProductCategory(alternative.name, []));
  if (altSubCategory === subCategory) {
    score += 30;
  } else {
    score += 10; // Different subcategory but still relevant
  }

  // Similar calorie range (20% weight)
  const calorieDiff = Math.abs(
    (alternative.nutrition?.calories || 0) - (scanned.nutrition?.calories || 0)
  );
  if (calorieDiff < 50) score += 20;
  else if (calorieDiff < 100) score += 10;
  else score += 5;

  // Different brand (10% weight) - prefer alternatives from different brands
  if (alternative.brand !== scanned.brand) {
    score += 10;
  } else {
    score += 5; // Same brand is okay too
  }

  return score;
}
