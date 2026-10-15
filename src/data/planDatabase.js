// Pre-indexed Architectural Floor Plan Database for Indian Housing Standards
export const ARCHITECTURAL_PLANS_DATABASE = [
  {
    id: "plan-30x50-3bhk-east",
    title: "30×50 East-Facing Vastu 3 BHK Deluxe",
    plotLength: 50,
    plotWidth: 30,
    builtUpArea: 1500,
    floors: 2,
    bedrooms: 3,
    bathrooms: 3,
    facing: "East",
    parking: true,
    style: "Modern",
    quality: "Premium",
    vastuScore: 98,
    tags: ["Most Popular", "Vastu Compliant", "Car Porch"],
    description: "Standard 1500 sq ft duplex layout with East-facing entrance, Agni kitchen in SE, Master bedroom in SW, and private balcony on 1st floor.",
    roomSchedule: [
      { room: "Living Hall", size: "18' × 14'", area: 252, zone: "NE / Ishan" },
      { room: "Modular Kitchen", size: "10' × 12'", area: 120, zone: "SE / Agni" },
      { room: "Dining Room", size: "11' × 10'", area: 110, zone: "East" },
      { room: "Master Bedroom 1 (GF)", size: "14' × 12'", area: 168, zone: "SW / Nairutya" },
      { room: "Car Porch & Driveway", size: "12' × 16'", area: 192, zone: "NW / Front" },
      { room: "Bedroom 2 (1F Kids)", size: "13' × 12'", area: 156, zone: "North" },
      { room: "Bedroom 3 (1F Master)", size: "15' × 13'", area: 195, zone: "SW" },
      { room: "Sit-out Balcony (1F)", size: "12' × 6'", area: 72, zone: "NW" },
    ],
  },
  {
    id: "plan-30x40-2bhk-north",
    title: "30×40 North-Facing 2 BHK Compact Home",
    plotLength: 40,
    plotWidth: 30,
    builtUpArea: 1200,
    floors: 1,
    bedrooms: 2,
    bathrooms: 2,
    facing: "North",
    parking: true,
    style: "Contemporary",
    quality: "Standard",
    vastuScore: 95,
    tags: ["Compact 1200 sq ft", "Single Floor", "North Facing"],
    description: "Efficient single-floor 2 BHK layout ideal for 1200 sq ft plots. Kuber North entrance with combined drawing and dining hall.",
    roomSchedule: [
      { room: "Drawing & Living", size: "16' × 13'", area: 208, zone: "North / Ishan" },
      { room: "Kitchen", size: "10' × 10'", area: 100, zone: "SE (Agni)" },
      { room: "Master Bedroom", size: "13' × 12'", area: 156, zone: "SW (Nairutya)" },
      { room: "Guest Bedroom 2", size: "12' × 11'", area: 132, zone: "NW (Vayu)" },
      { room: "Car Porch", size: "11' × 15'", area: 165, zone: "North-West" },
      { room: "Common Bathroom", size: "8' × 5'", area: 40, zone: "West" },
    ],
  },
  {
    id: "plan-20x50-2bhk-east",
    title: "20×50 East-Facing Linear 2 BHK Townhouse",
    plotLength: 50,
    plotWidth: 20,
    builtUpArea: 1000,
    floors: 2,
    bedrooms: 2,
    bathrooms: 2,
    facing: "East",
    parking: true,
    style: "Minimalist",
    quality: "Standard",
    vastuScore: 92,
    tags: ["Narrow Plot", "Duplex", "Linear Flow"],
    description: "Smart space planning for narrow 20-foot frontage plots with internal ventilation shafts (OTs) and front covered parking.",
    roomSchedule: [
      { room: "Front Parking", size: "10' × 16'", area: 160, zone: "East Front" },
      { room: "Living Hall", size: "13' × 15'", area: 195, zone: "NE" },
      { room: "Kitchen", size: "8' × 10'", area: 80, zone: "SE" },
      { room: "Master Bedroom (GF)", size: "12' × 13'", area: 156, zone: "SW" },
      { room: "Upper Suite (1F)", size: "13' × 14'", area: 182, zone: "SW" },
      { room: "Open Terrace", size: "18' × 15'", area: 270, zone: "Front" },
    ],
  },
  {
    id: "plan-40x60-4bhk-east",
    title: "40×60 East-Facing 4 BHK Luxury Villa",
    plotLength: 60,
    plotWidth: 40,
    builtUpArea: 2400,
    floors: 2,
    bedrooms: 4,
    bathrooms: 4,
    facing: "East",
    parking: true,
    style: "Luxury",
    quality: "Luxury",
    vastuScore: 99,
    tags: ["4 BHK Luxury Villa", "Double Car Parking", "Puja & Lawn"],
    description: "Grand architectural villa with double-height living foyer, separate formal drawing room, lawn setback, and double car garage.",
    roomSchedule: [
      { room: "Double Car Porch", size: "18' × 18'", area: 324, zone: "NW / Front" },
      { room: "Formal Drawing Room", size: "16' × 15'", area: 240, zone: "North" },
      { room: "Grand Living Foyer", size: "20' × 16'", area: 320, zone: "Center / NE" },
      { room: "Modular Kitchen & Pantry", size: "14' × 12'", area: 168, zone: "SE (Agni)" },
      { room: "Puja Room", size: "6' × 8'", area: 48, zone: "NE (Ishan)" },
      { room: "Master Bedroom 1", size: "16' × 15'", area: 240, zone: "SW" },
      { room: "Bed 2 (Parents)", size: "14' × 14'", area: 196, zone: "West" },
      { room: "Bed 3 & 4 (1F Suites)", size: "15' × 14' each", area: 420, zone: "Upper Level" },
      { room: "Family Lounge (1F)", size: "16' × 14'", area: 224, zone: "Center" },
    ],
  },
  {
    id: "plan-25x50-3bhk-north",
    title: "25×50 North-Facing 3 BHK Duplex House",
    plotLength: 50,
    plotWidth: 25,
    builtUpArea: 1250,
    floors: 2,
    bedrooms: 3,
    bathrooms: 3,
    facing: "North",
    parking: true,
    style: "Modern",
    quality: "Standard",
    vastuScore: 96,
    tags: ["3 BHK Duplex", "Medium Plot", "Vastu North"],
    description: "Highly sought-after 1250 sq ft G+1 plan. 1 bedroom + living on Ground Floor, 2 bedrooms + private sit-out balcony on First Floor.",
    roomSchedule: [
      { room: "Car Porch", size: "11' × 16'", area: 176, zone: "North Front" },
      { room: "Living & Dining", size: "15' × 16'", area: 240, zone: "NE / Center" },
      { room: "Kitchen", size: "9' × 10'", area: 90, zone: "SE" },
      { room: "Master Bed 1", size: "13' × 13'", area: 169, zone: "SW" },
      { room: "Bed 2 (Kids)", size: "13' × 12'", area: 156, zone: "NW (1F)" },
      { room: "Bed 3 (Guest)", size: "12' × 12'", area: 144, zone: "East (1F)" },
    ],
  },
  {
    id: "plan-30x50-3bhk-west",
    title: "30×50 West-Facing 3 BHK Practical Plan",
    plotLength: 50,
    plotWidth: 30,
    builtUpArea: 1500,
    floors: 2,
    bedrooms: 3,
    bathrooms: 2,
    facing: "West",
    parking: true,
    style: "Contemporary",
    quality: "Standard",
    vastuScore: 93,
    tags: ["West Facing", "3 BHK", "Balanced Ventilation"],
    description: "Optimized West-facing layout with Main Entrance in auspicious West-North-West zone. Living hall faces morning East light.",
    roomSchedule: [
      { room: "Porch & Verandah", size: "12' × 15'", area: 180, zone: "West Front" },
      { room: "Living Hall", size: "16' × 14'", area: 224, zone: "Center" },
      { room: "Kitchen", size: "10' × 11'", area: 110, zone: "SE Corner" },
      { room: "Master Bedroom", size: "14' × 13'", area: 182, zone: "SW Zone" },
      { room: "Upper Bedrooms (2 & 3)", size: "13' × 12' each", area: 312, zone: "1F" },
    ],
  },
  {
    id: "plan-20x40-2bhk-compact",
    title: "20×40 South-Facing 2 BHK Budget Plan",
    plotLength: 40,
    plotWidth: 20,
    builtUpArea: 800,
    floors: 1,
    bedrooms: 2,
    bathrooms: 1,
    facing: "South",
    parking: false,
    style: "Minimalist",
    quality: "Economy",
    vastuScore: 90,
    tags: ["Budget Home", "800 sq ft", "Single Floor"],
    description: "Compact low-cost housing model designed for maximum efficiency in 800 sq ft with zero corridor wastage.",
    roomSchedule: [
      { room: "Drawing Room", size: "12' × 13'", area: 156, zone: "South" },
      { room: "Kitchen & Dining", size: "9' × 10'", area: 90, zone: "SE" },
      { room: "Master Bedroom", size: "11' × 12'", area: 132, zone: "SW" },
      { room: "Bedroom 2", size: "10' × 10'", area: 100, zone: "NW" },
      { room: "Common Toilet", size: "7' × 4'", area: 28, zone: "West" },
    ],
  },
  {
    id: "plan-60x30-3bhk-wide",
    title: "60×30 Wide-Frontage 3 BHK Bungalow",
    plotLength: 30,
    plotWidth: 60,
    builtUpArea: 1800,
    floors: 1,
    bedrooms: 3,
    bathrooms: 3,
    facing: "East",
    parking: true,
    style: "Modern",
    quality: "Premium",
    vastuScore: 97,
    tags: ["Wide Frontage", "Single Level Bungalow", "3 BHK"],
    description: "Spread-out single-level luxury bungalow layout for wide 60 ft plots. Every bedroom has direct garden view and exterior cross-ventilation.",
    roomSchedule: [
      { room: "Covered Car Porch", size: "15' × 16'", area: 240, zone: "East Front" },
      { room: "Grand Living Room", size: "22' × 15'", area: 330, zone: "NE" },
      { room: "Open Island Kitchen", size: "12' × 13'", area: 156, zone: "SE" },
      { room: "Master Suite", size: "16' × 14'", area: 224, zone: "SW" },
      { room: "Bedroom 2 (Guest)", size: "14' × 13'", area: 182, zone: "NW" },
      { room: "Bedroom 3 (Kids)", size: "13' × 13'", area: 169, zone: "North" },
    ],
  },
];

// LocalStorage Database Helper for User Custom Saved Plans
const USER_PLANS_KEY = "smart_home_user_plans_db";

export function getSavedUserPlans() {
  try {
    const data = localStorage.getItem(USER_PLANS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Failed to read user plans DB", e);
    return [];
  }
}

export function saveUserPlanToDB(plan) {
  try {
    const existing = getSavedUserPlans();
    const newPlan = {
      ...plan,
      id: "user-" + Date.now(),
      savedAt: new Date().toISOString(),
    };
    const updated = [newPlan, ...existing];
    localStorage.setItem(USER_PLANS_KEY, JSON.stringify(updated));
    return newPlan;
  } catch (e) {
    console.error("Failed to save plan to DB", e);
    return null;
  }
}

export function deleteUserPlanFromDB(planId) {
  try {
    const existing = getSavedUserPlans();
    const filtered = existing.filter((p) => p.id !== planId);
    localStorage.setItem(USER_PLANS_KEY, JSON.stringify(filtered));
    return true;
  } catch (e) {
    console.error("Failed to delete plan from DB", e);
    return false;
  }
}

export function clearAllUserPlansFromDB() {
  try {
    localStorage.removeItem(USER_PLANS_KEY);
    return true;
  } catch (e) {
    console.error("Failed to clear user plans DB", e);
    return false;
  }
}

