#!/usr/bin/env node

/**
 * Simple script to test the TripAdvisor API
 * 
 * Usage:
 *   TRIPADVISOR_API_KEY=your_key node scripts/test-tripadvisor.mjs
 */

const TRIPADVISOR_BASE_URL = 'https://api.content.tripadvisor.com/api/v1';

async function searchLocations(query, category, latLong) {
  const apiKey = process.env.TRIPADVISOR_API_KEY;
  
  if (!apiKey) {
    console.error('❌ TRIPADVISOR_API_KEY is not set');
    console.log('\nTo get an API key:');
    console.log('1. Go to https://www.tripadvisor.com/developers');
    console.log('2. Sign up for a TripAdvisor Content API account');
    console.log('3. Create an API key');
    console.log('\nThen run this script with:');
    console.log('TRIPADVISOR_API_KEY=your_key node scripts/test-tripadvisor.mjs');
    process.exit(1);
  }

  const params = new URLSearchParams({
    key: apiKey,
    searchQuery: query,
    language: 'en',
  });

  if (category) {
    params.set('category', category);
  }

  if (latLong) {
    params.set('latLong', latLong);
  }

  const url = `${TRIPADVISOR_BASE_URL}/location/search?${params}`;
  
  console.log(`\n🔍 Searching for: "${query}"`);
  if (category) console.log(`   Category: ${category}`);
  if (latLong) console.log(`   Location: ${latLong}`);
  console.log(`\n📡 Making request to TripAdvisor API...`);

  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`\n❌ API Error (${response.status}):`, errorText);
      return;
    }

    const data = await response.json();
    
    console.log('\n✅ Response received!\n');
    console.log('='.repeat(60));
    console.log(JSON.stringify(data, null, 2));
    console.log('='.repeat(60));
    
    if (data.data && data.data.length > 0) {
      console.log(`\n📍 Found ${data.data.length} locations:\n`);
      data.data.forEach((loc, i) => {
        console.log(`${i + 1}. ${loc.name}`);
        if (loc.address_obj?.address_string) {
          console.log(`   📌 ${loc.address_obj.address_string}`);
        }
        if (loc.rating) {
          console.log(`   ⭐ Rating: ${loc.rating}`);
        }
        console.log(`   🔗 ID: ${loc.location_id}`);
        console.log();
      });
    } else {
      console.log('\n⚠️ No locations found');
    }
  } catch (error) {
    console.error('\n❌ Request failed:', error);
  }
}

// Example search: pizza restaurants near New York
const query = process.argv[2] || 'pizza';
const category = process.argv[3] || 'restaurants';
const latLong = process.argv[4] || '40.7128,-74.0060';

console.log('🍕 TripAdvisor API Test Script');
console.log('================================');

searchLocations(query, category, latLong);




