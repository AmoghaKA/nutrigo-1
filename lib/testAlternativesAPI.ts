/**
 * Test Utility for Alternatives API
 * 
 * Usage in browser console:
 * import { testAlternativesAPI } from '@/lib/testAlternativesAPI';
 * await testAlternativesAPI();
 */

export async function testAlternativesAPI() {
  console.log('🧪 Testing Alternatives API...\n');
  
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';
  
  console.log(`📍 Backend URL: ${backendUrl}`);
  console.log(`📍 Endpoint: ${backendUrl}/api/alternatives\n`);
  
  // Test 1: Check if backend is reachable
  console.log('✅ Test 1: Backend Health Check');
  try {
    const healthRes = await fetch(`${backendUrl}/api/health`);
    if (healthRes.ok) {
      const data = await healthRes.json();
      console.log('✅ Backend is reachable', data);
    } else {
      console.error('❌ Backend returned:', healthRes.status);
    }
  } catch (error) {
    console.error('❌ Backend is NOT reachable:', error);
    console.log('\n💡 Make sure to:');
    console.log('   1. Start backend: cd backend && npm run dev');
    console.log('   2. Check port 3001 is available');
    console.log('   3. Set NEXT_PUBLIC_BACKEND_URL if using different port');
    return;
  }
  
  // Test 2: Check alternatives endpoint
  console.log('\n✅ Test 2: Alternatives Endpoint Health');
  try {
    const altRes = await fetch(`${backendUrl}/api/alternatives/health`);
    if (altRes.ok) {
      const data = await altRes.json();
      console.log('✅ Alternatives endpoint is ready', data);
    } else {
      console.error('❌ Endpoint returned:', altRes.status);
    }
  } catch (error) {
    console.error('❌ Could not reach alternatives endpoint:', error);
  }
  
  // Test 3: Test with sample request
  console.log('\n✅ Test 3: Sample Request');
  try {
    const testProduct = {
      category: 'snacks',
      subCategory: 'chips',
      currentHealthScore: 50,
      currentProduct: 'Lay\'s Classic Chips',
      currentBrand: 'Lay\'s'
    };
    
    console.log('📤 Sending:', testProduct);
    
    const response = await fetch(`${backendUrl}/api/alternatives`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testProduct)
    });
    
    if (response.ok) {
      const alternatives = await response.json();
      console.log(`✅ Received ${alternatives.length} alternatives:`, alternatives);
    } else {
      const error = await response.text();
      console.error(`❌ API Error: ${response.status}`, error);
    }
  } catch (error) {
    console.error('❌ Request failed:', error);
  }
  
  console.log('\n✅ Testing complete!');
}

// Auto-run if in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  (window as any).testAlternativesAPI = testAlternativesAPI;
  console.log('💡 Type testAlternativesAPI() in console to test the alternatives API');
}
