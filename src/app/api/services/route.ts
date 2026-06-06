import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import ServiceLocatorCache from "@/models/ServiceLocatorCache";
import crypto from "crypto";

export const dynamic = "force-dynamic";

const OVERPASS_URL = "https://overpass-api.de/api/interpreter";

function buildOverpassQuery(lat: number, lng: number, radiusMeters: number, category: string) {
  let tags: string[] = [];
  
  switch (category) {
    case "Hospitals":
      tags = ['"amenity"="hospital"', '"healthcare"="hospital"', '"amenity"="clinic"'];
      break;
    case "Police Stations":
      tags = ['"amenity"="police"'];
      break;
    case "Fire Stations":
      tags = ['"amenity"="fire_station"'];
      break;
    case "Blood Banks":
      tags = ['"healthcare"="blood_donation"', '"amenity"="blood_bank"'];
      break;
    case "Pharmacies":
      tags = ['"amenity"="pharmacy"'];
      break;
    case "Shelters":
      tags = ['"amenity"="social_facility"]["social_facility"="shelter"', '"emergency"="disaster_response"', '"emergency"="assembly_point"'];
      break;
    default:
      // "All" or unknown
      tags = [
        '"amenity"="hospital"', 
        '"amenity"="police"', 
        '"amenity"="fire_station"', 
        '"amenity"="pharmacy"',
        '"healthcare"="blood_donation"',
        '"emergency"="assembly_point"'
      ];
  }

  const queryNodes = tags.map(tag => `node[${tag}](around:${radiusMeters},${lat},${lng});`).join('');
  const queryWays = tags.map(tag => `way[${tag}](around:${radiusMeters},${lat},${lng});`).join('');
  
  return `[out:json][timeout:25];(${queryNodes}${queryWays});out center;`;
}

// Distance calculation using Haversine formula
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const latStr = searchParams.get("lat");
    const lngStr = searchParams.get("lng");
    const radiusStr = searchParams.get("radius"); // in km
    const category = searchParams.get("category") || "All";

    if (!latStr || !lngStr || !radiusStr) {
      return NextResponse.json({ error: "Missing required parameters (lat, lng, radius)" }, { status: 400 });
    }

    const lat = parseFloat(latStr);
    const lng = parseFloat(lngStr);
    const radiusKm = parseFloat(radiusStr);
    const radiusMeters = Math.floor(radiusKm * 1000);

    await dbConnect();

    // Create a deterministic hash for the cache query
    // We round coordinates to 3 decimal places (~110m accuracy) to increase cache hits
    const roundedLat = lat.toFixed(3);
    const roundedLng = lng.toFixed(3);
    const queryHash = crypto.createHash("md5").update(`${roundedLat}_${roundedLng}_${radiusKm}_${category}`).digest("hex");

    // Check MongoDB Cache
    const cachedData = await ServiceLocatorCache.findOne({ queryHash });
    
    if (cachedData) {
      return NextResponse.json({
        success: true,
        source: "mongodb_cache",
        results: cachedData.results
      });
    }

    // Cache miss, call Overpass API
    const overpassQuery = buildOverpassQuery(lat, lng, radiusMeters, category);
    
    const response = await fetch(`${OVERPASS_URL}?_t=${Date.now()}`, {
      method: 'POST',
      body: `data=${encodeURIComponent(overpassQuery)}`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'NationalEmergencyAuthority/1.0 (contact@example.com)'
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Overpass API Error Status:", response.status, "Body:", errText);
      throw new Error(`Overpass API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Parse results
    const results = (data.elements || []).map((el: any) => {
      // For ways, Overpass out center provides center lat/lon
      const elementLat = el.lat || el.center?.lat;
      const elementLng = el.lon || el.center?.lon;
      
      const distance = calculateDistance(lat, lng, elementLat, elementLng);
      
      let type = "Unknown";
      if (el.tags?.amenity === "hospital" || el.tags?.healthcare === "hospital" || el.tags?.amenity === "clinic") type = "Hospital";
      else if (el.tags?.amenity === "police") type = "Police Station";
      else if (el.tags?.amenity === "fire_station") type = "Fire Station";
      else if (el.tags?.healthcare === "blood_donation" || el.tags?.amenity === "blood_bank") type = "Blood Bank";
      else if (el.tags?.amenity === "pharmacy") type = "Pharmacy";
      else if (el.tags?.social_facility === "shelter" || el.tags?.emergency === "disaster_response" || el.tags?.emergency === "assembly_point") type = "Shelter";

      return {
        id: el.id,
        name: el.tags?.name || `Unnamed ${type}`,
        type,
        address: el.tags?.['addr:full'] || el.tags?.['addr:street'] || el.tags?.['addr:city'] || "Address unavailable",
        phone: el.tags?.phone || el.tags?.['contact:phone'] || null,
        lat: elementLat,
        lng: elementLng,
        distance: distance.toFixed(1) // km
      };
    }).sort((a: any, b: any) => parseFloat(a.distance) - parseFloat(b.distance));

    // Store in MongoDB Cache
    await ServiceLocatorCache.create({
      queryHash,
      lat,
      lng,
      radius: radiusKm,
      category,
      results
    });

    return NextResponse.json({
      success: true,
      source: "overpass_api",
      results
    });

  } catch (error: any) {
    console.error("Service Locator API Error:", error);
    return NextResponse.json({ error: "Unable to retrieve nearby services right now. Please try again shortly." }, { status: 503 });
  }
}
