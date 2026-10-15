import { useState, useMemo, useEffect } from "react";
import {
  ARCHITECTURAL_PLANS_DATABASE,
  getSavedUserPlans,
  saveUserPlanToDB,
  deleteUserPlanFromDB,
} from "../data/planDatabase";

export default function HomeDesign({ house, updateHouse }) {
  const update = (key, value) => updateHouse(key, value);

  // Main View Mode: "preview" (2D Floor Plan) | "database" (Architectural Database) | "saved" (My Saved Plans)
  const [mainView, setMainView] = useState("preview");

  // User Map Controls & Features State
  const [activeFloor, setActiveFloor] = useState("GF"); // "GF", "1F", "2F", "ROOF"
  const [mapTheme, setMapTheme] = useState("color"); // "color", "blueprint", "vastu"
  const [plotFacing, setPlotFacing] = useState("East"); // "East", "North", "West", "South"
  const [isGenerating, setIsGenerating] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [activeTabFeature, setActiveTabFeature] = useState("schedule"); // "schedule", "vastu", "openings"

  // Database Search & Filter State
  const [dbSearch, setDbSearch] = useState("");
  const [dbBhkFilter, setDbBhkFilter] = useState("all");
  const [dbFacingFilter, setDbFacingFilter] = useState("all");
  const [savedPlans, setSavedPlans] = useState([]);
  const [savePlanName, setSavePlanName] = useState("");
  const [showSaveInput, setShowSaveInput] = useState(false);

  // Load saved plans from database on mount & sync on storage updates
  useEffect(() => {
    const refreshPlans = () => setSavedPlans(getSavedUserPlans());
    refreshPlans();
    window.addEventListener("storage", refreshPlans);
    window.addEventListener("plans-updated", refreshPlans);
    return () => {
      window.removeEventListener("storage", refreshPlans);
      window.removeEventListener("plans-updated", refreshPlans);
    };
  }, []);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3800);
  };

  // Handle "Create Floor Plan Map"
  const handleCreateMap = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      triggerToast(`✓ Custom ${house.bedrooms} BHK floor plan map generated for ${house.length}×${house.width} ft plot!`);
    }, 400);
  };

  // Download SVG Blueprint Map
  const handleDownloadMap = () => {
    const svgEl = document.getElementById("architectural-floorplan-svg");
    if (!svgEl) return;
    const svgData = new XMLSerializer().serializeToString(svgEl);
    const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `house-map-${house.length || 50}x${house.width || 30}-${house.bedrooms}BHK-${activeFloor}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Save current design to database
  const handleSaveCurrentDesign = (e) => {
    e.preventDefault();
    const name = savePlanName.trim() || `${house.length}×${house.width} ${house.bedrooms}BHK ${plotFacing} Custom`;
    const newPlan = saveUserPlanToDB({
      title: name,
      plotLength: house.length,
      plotWidth: house.width,
      builtUpArea: house.area,
      floors: house.floors,
      bedrooms: house.bedrooms,
      bathrooms: house.bathrooms,
      facing: plotFacing,
      parking: house.parking,
      style: house.style,
      quality: house.quality,
      budget: house.budget,
    });
    if (newPlan) {
      setSavedPlans(getSavedUserPlans());
      setSavePlanName("");
      setShowSaveInput(false);
      triggerToast(`✓ Design "${name}" saved to Database!`);
    }
  };

  // Delete saved design from database
  const handleDeletePlan = (id, title) => {
    if (window.confirm(`Delete "${title}" from your database?`)) {
      deleteUserPlanFromDB(id);
      setSavedPlans(getSavedUserPlans());
      triggerToast(`✓ Removed "${title}" from database.`);
    }
  };

  // Apply a database plan to current house project
  const handleApplyPlan = (plan) => {
    update("length", plan.plotLength);
    update("width", plan.plotWidth);
    update("area", plan.builtUpArea);
    update("floors", plan.floors);
    update("bedrooms", plan.bedrooms);
    update("bathrooms", plan.bathrooms);
    update("parking", Boolean(plan.parking));
    if (plan.style) update("style", plan.style);
    if (plan.quality) update("quality", plan.quality);
    if (plan.facing) setPlotFacing(plan.facing);
    setMainView("preview");
    triggerToast(`✓ Loaded "${plan.title}" (${plan.plotLength}×${plan.plotWidth} ft) into your active design!`);
  };

  // Web Search Trigger (Google Images / Architectural search)
  const handleSearchWeb = (customQuery) => {
    const q = customQuery || `${house.length}x${house.width} feet ${house.bedrooms} BHK ${plotFacing} facing house floor plan blueprint`;
    window.open(`https://www.google.com/search?tbm=isch&q=${encodeURIComponent(q)}`, "_blank");
  };

  const plotW = Number(house.width) || 0;
  const plotL = Number(house.length) || 0;
  const totalBeds = Number(house.bedrooms) || 0;
  const totalBaths = Number(house.bathrooms) || 0;
  const totalFloors = Number(house.floors) || 1;
  const hasParking = Boolean(house.parking);
  const builtUpArea = Number(house.area) || (plotW && plotL ? plotW * plotL : 0);
  const hasPlotDimensions = plotW > 0 && plotL > 0;

  // Filter Architectural Database Plans
  const filteredDbPlans = useMemo(() => {
    return ARCHITECTURAL_PLANS_DATABASE.filter((plan) => {
      const q = dbSearch.toLowerCase().trim();
      const matchesSearch =
        !q ||
        plan.title.toLowerCase().includes(q) ||
        `${plan.plotLength}x${plan.plotWidth}`.includes(q) ||
        `${plan.plotWidth}x${plan.plotLength}`.includes(q) ||
        plan.facing.toLowerCase().includes(q) ||
        plan.tags.some((t) => t.toLowerCase().includes(q));

      const matchesBhk =
        dbBhkFilter === "all" ||
        (dbBhkFilter === "4" ? plan.bedrooms >= 4 : plan.bedrooms === Number(dbBhkFilter));

      const matchesFacing =
        dbFacingFilter === "all" || plan.facing.toLowerCase() === dbFacingFilter.toLowerCase();

      return matchesSearch && matchesBhk && matchesFacing;
    });
  }, [dbSearch, dbBhkFilter, dbFacingFilter]);

  // -------------------------------------------------------------
  // PROCEDURAL FLOOR PLAN COMPUTATION ENGINE
  // -------------------------------------------------------------
  const layout = useMemo(() => {
    const effectiveW = plotW > 0 ? plotW : 30;
    const effectiveL = plotL > 0 ? plotL : 50;
    const effectiveBeds = totalBeds > 0 ? totalBeds : 3;

    const maxCanvasW = 460;
    const maxCanvasH = 270;
    const centerSvgX = 280;
    const centerSvgY = 185;

    const ratio = Math.max(0.65, Math.min(1.65, effectiveW / effectiveL));
    let svgW, svgH;

    if (ratio >= 1) {
      svgW = Math.min(maxCanvasW, Math.max(350, Math.round(maxCanvasH * ratio)));
      svgH = Math.min(maxCanvasH, Math.max(220, Math.round(svgW / ratio)));
    } else {
      svgH = Math.min(maxCanvasH, Math.max(250, Math.round(350 / ratio)));
      svgW = Math.min(maxCanvasW, Math.max(310, Math.round(svgH * ratio)));
    }

    const plotX = Math.round(centerSvgX - svgW / 2);
    const plotY = Math.round(centerSvgY - svgH / 2);

    const wallThick = 6;
    const slabX = plotX + wallThick;
    const slabY = plotY + wallThick;
    const slabW = svgW - wallThick * 2;
    const slabH = svgH - wallThick * 2;

    const getDim = (relW, relH) => {
      const wFt = Math.max(7, Math.round((relW / slabW) * effectiveW));
      const lFt = Math.max(6, Math.round((relH / slabH) * effectiveL));
      return { str: `${wFt}' × ${lFt}'`, area: wFt * lFt };
    };

    const rooms = [];

    // =========================================================
    // FLOOR A: ROOF / TERRACE
    // =========================================================
    if (activeFloor === "ROOF") {
      const mumtyW = Math.round(slabW * 0.32);
      const mumtyH = Math.round(slabH * 0.38);
      const mumtyX = slabX + slabW - mumtyW;
      const mumtyY = slabY + slabH - mumtyH;

      rooms.push({
        id: "roof-terrace",
        name: "Open Terrace (Rooftop)",
        subName: "Weatherproof Anti-skid Flooring",
        dim: `${plotW}' × ${plotL}'`,
        area: builtUpArea,
        x: slabX,
        y: slabY,
        w: slabW,
        h: slabH,
        type: "terrace",
        vastu: "Universal Sun Zone",
      });

      rooms.push({
        id: "roof-mumty",
        name: "Staircase Mumty",
        subName: "Headroom Cabin",
        dim: "10' × 8'",
        area: 80,
        x: mumtyX,
        y: mumtyY,
        w: mumtyW,
        h: mumtyH,
        type: "mumty",
        vastu: "South-West Stability",
      });

      return { plotX, plotY, svgW, svgH, slabX, slabY, slabW, slabH, rooms };
    }

    // =========================================================
    // FLOOR B: GROUND FLOOR ("GF")
    // =========================================================
    if (activeFloor === "GF") {
      if (totalFloors === 1) {
        if (totalBeds === 1) {
          const colW = Math.round(slabW * 0.48);
          const topH = Math.round(slabH * 0.52);

          const d1 = getDim(colW, topH);
          rooms.push({ id: "gf-mbed", name: "Master Bedroom", subName: d1.str, vastu: "SW (Nairutya)", x: slabX, y: slabY, w: colW, h: topH, type: "bedroom", icon: "bed" });

          const d2 = getDim(slabW - colW, topH);
          rooms.push({ id: "gf-kit", name: "Modular Kitchen", subName: d2.str, vastu: "SE (Agni)", x: slabX + colW, y: slabY, w: slabW - colW, h: topH, type: "kitchen", icon: "kitchen" });

          const d3 = getDim(colW, slabH - topH);
          rooms.push({ id: "gf-porch", name: hasParking ? "Car Porch" : "Drawing Room", subName: d3.str, vastu: "NW (Vayu)", x: slabX, y: slabY + topH, w: colW, h: slabH - topH, type: hasParking ? "porch" : "living", icon: hasParking ? "car" : "sofa" });

          const d4 = getDim(slabW - colW, slabH - topH);
          rooms.push({ id: "gf-living", name: "Living & Dining", subName: d4.str, vastu: "Center / East", x: slabX + colW, y: slabY + topH, w: slabW - colW, h: slabH - topH, type: "living", icon: "dining" });
        } else if (totalBeds === 2) {
          const col1W = Math.round(slabW * 0.42);
          const col2W = slabW - col1W;
          const row1H = Math.round(slabH * 0.50);
          const row2H = slabH - row1H;

          const d1 = getDim(col1W, row1H);
          rooms.push({ id: "gf-mbed", name: "Master Bedroom 1", subName: d1.str, vastu: "SW (Nairutya)", x: slabX, y: slabY, w: col1W, h: row1H, type: "bedroom", icon: "bed" });

          const d2 = getDim(col2W, row1H);
          rooms.push({ id: "gf-kit", name: "Kitchen & Dining", subName: d2.str, vastu: "SE (Agni)", x: slabX + col1W, y: slabY, w: col2W, h: row1H, type: "kitchen", icon: "kitchen" });

          const d3 = getDim(col1W, row2H);
          rooms.push({ id: "gf-bed2", name: "Bedroom 2 (Guest)", subName: d3.str, vastu: "NW (Vayu)", x: slabX, y: slabY + row1H, w: col1W, h: row2H, type: "bedroom", icon: "bed" });

          const d4 = getDim(col2W, row2H);
          rooms.push({ id: "gf-living", name: hasParking ? "Living & Porch" : "Living Hall", subName: d4.str, vastu: "Center / Ishan", x: slabX + col1W, y: slabY + row1H, w: col2W, h: row2H, type: "living", icon: hasParking ? "car" : "sofa" });
        } else {
          const colW = Math.round(slabW * 0.35);
          const midW = Math.round(slabW * 0.35);
          const eastW = slabW - colW - midW;
          const topH = Math.round(slabH * 0.50);
          const btmH = slabH - topH;

          const d1 = getDim(colW, topH);
          rooms.push({ id: "gf-mbed", name: "Master Bed 1", subName: d1.str, vastu: "SW Zone", x: slabX, y: slabY, w: colW, h: topH, type: "bedroom", icon: "bed" });

          const d2 = getDim(colW, btmH);
          rooms.push({ id: "gf-bed2", name: "Bedroom 2", subName: d2.str, vastu: "NW Zone", x: slabX, y: slabY + topH, w: colW, h: btmH, type: "bedroom", icon: "bed" });

          const d3 = getDim(midW, topH);
          rooms.push({ id: "gf-bed3", name: totalBeds >= 3 ? "Bedroom 3" : "Study Room", subName: d3.str, vastu: "West Zone", x: slabX + colW, y: slabY, w: midW, h: topH, type: "bedroom", icon: "bed" });

          const d4 = getDim(midW, btmH);
          rooms.push({ id: "gf-living", name: "Living Hall", subName: d4.str, vastu: "Brahmasthan", x: slabX + colW, y: slabY + topH, w: midW, h: btmH, type: "living", icon: "sofa" });

          const d5 = getDim(eastW, topH);
          rooms.push({ id: "gf-kit", name: "Modular Kitchen", subName: d5.str, vastu: "SE (Agni)", x: slabX + colW + midW, y: slabY, w: eastW, h: topH, type: "kitchen", icon: "kitchen" });

          const d6 = getDim(eastW, btmH);
          rooms.push({ id: "gf-porch", name: hasParking ? "Car Porch" : "Dining & Foyer", subName: d6.str, vastu: "East Entrance", x: slabX + colW + midW, y: slabY + topH, w: eastW, h: btmH, type: hasParking ? "porch" : "dining", icon: hasParking ? "car" : "dining" });
        }
      } else {
        const leftW = Math.round(slabW * 0.38);
        const centerW = Math.round(slabW * 0.34);
        const rightW = slabW - leftW - centerW;
        const topH = Math.round(slabH * 0.48);
        const btmH = slabH - topH;

        const d1 = getDim(leftW, topH);
        rooms.push({ id: "gf-mbed", name: leftW < 120 ? "Master Bed 1" : "Master Bedroom 1", subName: d1.str, vastu: "SW Zone", x: slabX, y: slabY, w: leftW, h: topH, type: "bedroom", icon: "bed" });

        const d2 = getDim(leftW, btmH);
        rooms.push({ id: "gf-porch", name: hasParking ? "Car Porch" : "Drawing Room", subName: d2.str, vastu: "NW Zone", x: slabX, y: slabY + topH, w: leftW, h: btmH, type: hasParking ? "porch" : "living", icon: hasParking ? "car" : "sofa" });

        const bathH = Math.round(topH * 0.65);
        const d3 = getDim(centerW, bathH);
        rooms.push({ id: "gf-bath", name: centerW < 115 ? "Bath 1" : "Bath 1 & Powder", subName: d3.str, vastu: "West Zone", x: slabX + leftW, y: slabY, w: centerW, h: bathH, type: "bath", icon: "bath" });

        const d4 = getDim(centerW, slabH - bathH);
        rooms.push({ id: "gf-living", name: centerW < 115 ? "Living Hall" : "Living & Family", subName: d4.str, vastu: "Center", x: slabX + leftW, y: slabY + bathH, w: centerW, h: slabH - bathH, type: "living", icon: "sofa" });

        const d5 = getDim(rightW, topH);
        rooms.push({ id: "gf-kit", name: rightW < 115 ? "Kitchen" : "Modular Kitchen", subName: d5.str, vastu: "SE (Agni)", x: slabX + leftW + centerW, y: slabY, w: rightW, h: topH, type: "kitchen", icon: "kitchen" });

        const d6 = getDim(rightW, btmH);
        rooms.push({ id: "gf-dining", name: rightW < 115 ? "Dining / Stairs" : "Dining & Stairs", subName: d6.str, vastu: "East Entry", x: slabX + leftW + centerW, y: slabY + topH, w: rightW, h: btmH, type: "dining", icon: "stairs" });
      }

      return { plotX, plotY, svgW, svgH, slabX, slabY, slabW, slabH, rooms };
    }

    // =========================================================
    // FLOOR C: FIRST FLOOR ("1F")
    // =========================================================
    if (activeFloor === "1F") {
      const leftW = Math.round(slabW * 0.42);
      const rightW = slabW - leftW;
      const topH = Math.round(slabH * 0.52);
      const btmH = slabH - topH;

      const d1 = getDim(leftW, topH);
      rooms.push({ id: "1f-bed2", name: "Bedroom 2 (Master Suite)", subName: d1.str, vastu: "SW Zone", x: slabX, y: slabY, w: leftW, h: topH, type: "bedroom", icon: "bed" });

      const d2 = getDim(leftW, btmH);
      rooms.push({ id: "1f-balcony", name: "Open Sit-out Balcony", subName: d2.str, vastu: "NW (Vayu)", x: slabX, y: slabY + topH, w: leftW, h: btmH, type: "balcony", icon: "balcony" });

      const d3 = getDim(rightW, topH);
      rooms.push({ id: "1f-bed3", name: totalBeds >= 3 ? "Bedroom 3 (Kids Room)" : "Study & Library", subName: d3.str, vastu: "North / East", x: slabX + leftW, y: slabY, w: rightW, h: topH, type: "bedroom", icon: "bed" });

      const d4 = getDim(rightW, btmH);
      rooms.push({ id: "1f-lounge", name: "Family TV Lounge & Stairs", subName: d4.str, vastu: "Center / Ishan", x: slabX + leftW, y: slabY + topH, w: rightW, h: btmH, type: "living", icon: "sofa" });

      return { plotX, plotY, svgW, svgH, slabX, slabY, slabW, slabH, rooms };
    }

    // =========================================================
    // FLOOR D: SECOND FLOOR ("2F")
    // =========================================================
    if (activeFloor === "2F") {
      const leftW = Math.round(slabW * 0.45);
      const rightW = slabW - leftW;

      const d1 = getDim(leftW, slabH);
      rooms.push({ id: "2f-suite", name: totalBeds >= 4 ? "Bedroom 4 / Penthouse" : "Home Theatre & Gym", subName: d1.str, vastu: "SW Zone", x: slabX, y: slabY, w: leftW, h: slabH, type: "bedroom", icon: "bed" });

      const d2 = getDim(rightW, slabH);
      rooms.push({ id: "2f-terrace", name: "Semi-covered Terrace Garden", subName: d2.str, vastu: "East Zone", x: slabX + leftW, y: slabY, w: rightW, h: slabH, type: "terrace", icon: "balcony" });

      return { plotX, plotY, svgW, svgH, slabX, slabY, slabW, slabH, rooms };
    }

    return { plotX, plotY, svgW, svgH, slabX, slabY, slabW, slabH, rooms: [] };
  }, [plotW, plotL, totalBeds, totalBaths, totalFloors, hasParking, activeFloor, builtUpArea]);

  // Dynamic Room schedule & carpet area calculated based on user's exact requirements
  const roomSchedule = useMemo(() => {
    const list = [];
    const area = builtUpArea;

    const livingArea = Math.round(area * 0.22);
    list.push({
      name: "Living & Drawing Hall",
      dim: `18' × ${Math.max(12, Math.round(livingArea / 18))}'`,
      area: livingArea,
      vastu: "North-East / Center",
      floor: "Italian Marble / Vitrified",
    });

    const kitchenArea = Math.round(area * 0.10);
    list.push({
      name: "Modular Kitchen",
      dim: `10' × ${Math.max(10, Math.round(kitchenArea / 10))}'`,
      area: kitchenArea,
      vastu: "South-East (Agni Corner)",
      floor: "Granite Anti-skid",
    });

    const diningArea = Math.round(area * 0.09);
    list.push({
      name: "Dining Area",
      dim: `11' × ${Math.max(8, Math.round(diningArea / 11))}'`,
      area: diningArea,
      vastu: "East / Center",
      floor: "Vitrified Tiles",
    });

    const masterBedArea = Math.round(area * 0.16);
    list.push({
      name: "Master Bedroom 1",
      dim: `14' × ${Math.max(12, Math.round(masterBedArea / 14))}'`,
      area: masterBedArea,
      vastu: "South-West (Nairutya)",
      floor: "Wooden Laminate",
    });

    for (let b = 2; b <= totalBeds; b++) {
      const bArea = Math.round(area * 0.12);
      const bDim = `12' × ${Math.max(10, Math.round(bArea / 12))}'`;
      const vZone = b === 2 ? "North-West (Vayu)" : b === 3 ? "West Zone" : "North Zone";
      list.push({
        name: `Bedroom ${b} ${b === 2 ? "(Kids/Guest)" : b === 3 ? "(Parents)" : "(Study Room)"}`,
        dim: bDim,
        area: bArea,
        vastu: vZone,
        floor: "Vitrified Tiles",
      });
    }

    for (let bt = 1; bt <= totalBaths; bt++) {
      const btArea = bt === 1 ? 40 : 35;
      list.push({
        name: bt === 1 ? "Common Bathroom" : `Attached Bathroom ${bt - 1}`,
        dim: bt === 1 ? "8' × 5'" : "7' × 5'",
        area: btArea,
        vastu: "North-West / West",
        floor: "Anti-skid Ceramic Tiles",
      });
    }

    if (hasParking) {
      list.push({
        name: "Car Porch & Driveway",
        dim: "12' × 16'",
        area: 192,
        vastu: "North-West / South-East",
        floor: "Heavy Duty Paver Tiles",
      });
    }

    if (totalFloors > 1) {
      list.push({
        name: "Staircase & Passage Lobby",
        dim: "10' × 8'",
        area: 80,
        vastu: "South / West",
        floor: "Granite Stone Steps",
      });
    }

    const totalCarpet = list.reduce((sum, r) => sum + r.area, 0);
    const efficiency = area > 0 ? Math.min(88, Math.round((totalCarpet / (area * (totalFloors > 1 && activeFloor !== "GF" ? 1 : 1))) * 100)) : 0;

    return { list, totalCarpet, efficiency };
  }, [builtUpArea, hasParking, totalBeds, totalBaths, totalFloors, activeFloor]);

  const vastuAudit = useMemo(() => {
    return [
      { rule: "Main Entrance", status: `${plotFacing} Facing`, compliant: plotFacing === "East" || plotFacing === "North", tip: "East and North entrance doors attract prosperity and positive morning sunlight." },
      { rule: "Kitchen Placement", status: "South-East (Agni)", compliant: true, tip: "Cooking facing East ensures health and culinary energy." },
      { rule: "Master Bedroom", status: "South-West (Nairutya)", compliant: true, tip: "Master suite in SW grants stability, sound sleep, and decision-making power." },
      { rule: "Water Tank / Puja", status: "North-East (Ishan)", compliant: true, tip: "Lightweight, clean water and meditation altar in Ishan zone." },
      { rule: "Toilets & Sewage", status: "North-West / West", compliant: true, tip: "Waste disposal in Vayu/West prevents negative energy flow." },
    ];
  }, [plotFacing]);

  const getRoomColor = (type) => {
    if (mapTheme === "blueprint") {
      switch (type) {
        case "bedroom": return { fill: "#112a4a", stroke: "#38bdf8", text: "#e0f2fe", sub: "#7dd3fc" };
        case "kitchen": return { fill: "#17365d", stroke: "#38bdf8", text: "#fde047", sub: "#93c5fd" };
        case "living": return { fill: "#0f2c4e", stroke: "#38bdf8", text: "#bae6fd", sub: "#7dd3fc" };
        case "dining": return { fill: "#133156", stroke: "#38bdf8", text: "#86efac", sub: "#7dd3fc" };
        case "bath": return { fill: "#0d2847", stroke: "#38bdf8", text: "#67e8f9", sub: "#93c5fd" };
        case "porch": return { fill: "#0a192e", stroke: "#38bdf8", text: "#cbd5e1", sub: "#94a3b8" };
        case "balcony": return { fill: "#0c1d33", stroke: "#38bdf8", text: "#6ee7b7", sub: "#6ee7b7" };
        case "terrace": return { fill: "#091729", stroke: "#38bdf8", text: "#94a3b8", sub: "#64748b" };
        case "mumty": return { fill: "#153357", stroke: "#38bdf8", text: "#f1f5f9", sub: "#cbd5e1" };
        default: return { fill: "#0f233d", stroke: "#38bdf8", text: "#ffffff", sub: "#93c5fd" };
      }
    }
    if (mapTheme === "vastu") {
      switch (type) {
        case "bedroom": return { fill: "#fff1f2", stroke: "#f43f5e", text: "#881337", sub: "#e11d48" };
        case "kitchen": return { fill: "#fffbeb", stroke: "#f59e0b", text: "#78350f", sub: "#d97706" };
        case "living": return { fill: "#fefce8", stroke: "#eab308", text: "#713f12", sub: "#ca8a04" };
        case "dining": return { fill: "#f0fdf4", stroke: "#22c55e", text: "#14532d", sub: "#16a34a" };
        case "bath": return { fill: "#f8fafc", stroke: "#94a3b8", text: "#334155", sub: "#64748b" };
        case "porch": return { fill: "#f1f5f9", stroke: "#64748b", text: "#1e293b", sub: "#475569" };
        case "balcony": return { fill: "#ecfdf5", stroke: "#10b981", text: "#065f46", sub: "#059669" };
        case "terrace": return { fill: "#fafaf9", stroke: "#78716c", text: "#44403c", sub: "#78716c" };
        case "mumty": return { fill: "#f5f5f4", stroke: "#57534e", text: "#292524", sub: "#57534e" };
        default: return { fill: "#ffffff", stroke: "#94a3b8", text: "#0f172a", sub: "#64748b" };
      }
    }
    switch (type) {
      case "bedroom": return { fill: "#ffe4e6", stroke: "#475569", text: "#1e293b", sub: "#475569" };
      case "kitchen": return { fill: "#fef3c7", stroke: "#475569", text: "#1e293b", sub: "#475569" };
      case "living": return { fill: "#fef9c3", stroke: "#475569", text: "#1e293b", sub: "#475569" };
      case "dining": return { fill: "#dcfce7", stroke: "#475569", text: "#1e293b", sub: "#475569" };
      case "bath": return { fill: "#e0f2fe", stroke: "#475569", text: "#1e293b", sub: "#475569" };
      case "porch": return { fill: "#f1f5f9", stroke: "#475569", text: "#1e293b", sub: "#475569" };
      case "balcony": return { fill: "#ecfdf5", stroke: "#059669", text: "#065f46", sub: "#059669" };
      case "terrace": return { fill: "#fafaf9", stroke: "#a8a29e", text: "#44403c", sub: "#78716c" };
      case "mumty": return { fill: "#e7e5e4", stroke: "#44403c", text: "#1c1917", sub: "#44403c" };
      default: return { fill: "#ffffff", stroke: "#475569", text: "#0f172a", sub: "#64748b" };
    }
  };

  return (
    <div className="home-design-page">
      {/* GLOBAL TOAST NOTIFICATION */}
      {showToast && <div className="map-floating-toast">{toastMessage}</div>}

      <div className="design-layout-grid">
        {/* ========================================================
            LEFT COLUMN: House Measurements & Requirements Form
            ======================================================== */}
        <section className="design-card">
          <div className="card-header">
            <div className="card-header-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M3 9h18" />
                <path d="M9 21V9" />
              </svg>
            </div>
            <div>
              <h2 className="card-title">House Measurements</h2>
              <p className="card-subtitle">Enter your dimensions and preferences</p>
            </div>
          </div>

          <div className="measurements-form">
            {/* Row 1: Plot length & width */}
            <div className="form-row-2">
              <label className="input-group">
                <span>Plot length (ft)</span>
                <input
                  type="number"
                  min="1"
                  max="500"
                  placeholder="e.g. 50"
                  value={house.length}
                  onChange={(e) => update("length", e.target.value === "" ? "" : Number(e.target.value))}
                />
              </label>

              <label className="input-group">
                <span>Plot width (ft)</span>
                <input
                  type="number"
                  min="1"
                  max="500"
                  placeholder="e.g. 30"
                  value={house.width}
                  onChange={(e) => update("width", e.target.value === "" ? "" : Number(e.target.value))}
                />
              </label>
            </div>

            {/* Row 2: Built-up area & Wall height */}
            <div className="form-row-2">
              <label className="input-group">
                <span>Built-up area (sq ft)</span>
                <input
                  type="number"
                  min="1"
                  placeholder="e.g. 1200"
                  value={house.area}
                  onChange={(e) => update("area", e.target.value === "" ? "" : Number(e.target.value))}
                />
              </label>

              <label className="input-group">
                <span>Wall height (ft)</span>
                <input
                  type="number"
                  min="1"
                  max="30"
                  placeholder="e.g. 10"
                  value={house.height}
                  onChange={(e) => update("height", e.target.value === "" ? "" : Number(e.target.value))}
                />
              </label>
            </div>

            {/* Row 3: Outer & Inner wall thickness */}
            <div className="form-row-2">
              <label className="input-group">
                <span>Outer wall (in)</span>
                <input
                  type="number"
                  step="0.5"
                  min="1"
                  max="24"
                  placeholder="e.g. 9"
                  value={house.outerWall}
                  onChange={(e) => update("outerWall", e.target.value === "" ? "" : Number(e.target.value))}
                />
              </label>

              <label className="input-group">
                <span>Inner wall (in)</span>
                <input
                  type="number"
                  step="0.5"
                  min="1"
                  max="24"
                  placeholder="e.g. 4.5"
                  value={house.innerWall}
                  onChange={(e) => update("innerWall", e.target.value === "" ? "" : Number(e.target.value))}
                />
              </label>
            </div>

            {/* Row 4: Floors & Bedrooms */}
            <div className="form-row-2">
              <label className="input-group">
                <span>Number of floors</span>
                <select
                  value={house.floors || 1}
                  onChange={(e) => update("floors", Number(e.target.value))}
                >
                  <option value={1}>1 floor (Ground)</option>
                  <option value={2}>2 floors (G+1)</option>
                  <option value={3}>3 floors (G+2)</option>
                  <option value={4}>4 floors (G+3)</option>
                </select>
              </label>

              <label className="input-group">
                <span>Bedrooms</span>
                <input
                  type="number"
                  min="1"
                  max="10"
                  placeholder="e.g. 3"
                  value={house.bedrooms}
                  onChange={(e) => update("bedrooms", e.target.value === "" ? "" : Number(e.target.value))}
                />
              </label>
            </div>

            {/* Row 5: Bathrooms & Budget */}
            <div className="form-row-2">
              <label className="input-group">
                <span>Bathrooms</span>
                <input
                  type="number"
                  min="1"
                  max="8"
                  placeholder="e.g. 2"
                  value={house.bathrooms}
                  onChange={(e) => update("bathrooms", e.target.value === "" ? "" : Number(e.target.value))}
                />
              </label>

              <label className="input-group">
                <span>Budget (₹)</span>
                <input
                  type="number"
                  step="50000"
                  min="0"
                  placeholder="e.g. 4500000"
                  value={house.budget}
                  onChange={(e) => update("budget", e.target.value === "" ? "" : Number(e.target.value))}
                />
              </label>
            </div>

            {/* Row 6: Doors & Windows per floor */}
            <div className="form-row-2">
              <label className="input-group">
                <span>Doors per floor</span>
                <input
                  type="number"
                  min="0"
                  placeholder="e.g. 6"
                  value={house.doors}
                  onChange={(e) => update("doors", e.target.value === "" ? "" : Number(e.target.value))}
                />
              </label>

              <label className="input-group">
                <span>Windows per floor</span>
                <input
                  type="number"
                  min="0"
                  placeholder="e.g. 8"
                  value={house.windows}
                  onChange={(e) => update("windows", e.target.value === "" ? "" : Number(e.target.value))}
                />
              </label>
            </div>

            {/* Row 7: Design style & Finish quality */}
            <div className="form-row-2">
              <label className="input-group">
                <span>Design style</span>
                <select
                  value={house.style}
                  onChange={(e) => update("style", e.target.value)}
                >
                  <option value="Modern">Modern</option>
                  <option value="Contemporary">Contemporary</option>
                  <option value="Traditional">Traditional</option>
                  <option value="Minimalist">Minimalist</option>
                </select>
              </label>

              <label className="input-group">
                <span>Finish quality</span>
                <select
                  value={house.quality}
                  onChange={(e) => update("quality", e.target.value)}
                >
                  <option value="Economy">Economy</option>
                  <option value="Standard">Standard</option>
                  <option value="Premium">Premium</option>
                  <option value="Luxury">Luxury</option>
                </select>
              </label>
            </div>

            {/* Row 8: Plot Facing & Parking */}
            <div className="form-row-2" style={{ alignItems: "center" }}>
              <label className="input-group">
                <span>Plot Facing (Vastu)</span>
                <select
                  value={plotFacing}
                  onChange={(e) => setPlotFacing(e.target.value)}
                >
                  <option value="East">East (Auspicious)</option>
                  <option value="North">North (Kuber Wealth)</option>
                  <option value="West">West Facing</option>
                  <option value="South">South Facing</option>
                </select>
              </label>

              <div className="parking-row" style={{ marginTop: "18px" }}>
                <label className="custom-checkbox-label">
                  <input
                    type="checkbox"
                    checked={house.parking}
                    onChange={(e) => update("parking", e.target.checked)}
                  />
                  <span className="checkbox-box">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                  <span className="checkbox-text">Include car parking</span>
                </label>
              </div>
            </div>

            {/* PRIMARY ACTION BAR */}
            <div className="design-action-bar">
              <button
                type="button"
                className="create-map-btn"
                onClick={handleCreateMap}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <span className="spinner-icon">⏳</span>
                    <span>Generating Custom House Map...</span>
                  </>
                ) : (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3">
                      <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
                      <line x1="9" y1="3" x2="9" y2="18" />
                      <line x1="15" y1="6" x2="15" y2="21" />
                    </svg>
                    <span>Create Floor Plan Map ({totalBeds}BHK · {plotL}×{plotW} ft)</span>
                  </>
                )}
              </button>

              {/* SAVE TO DATABASE / SEARCH WEB ACTION ROW */}
              <div className="db-aux-actions-row">
                <button
                  type="button"
                  className="db-aux-btn"
                  onClick={() => setShowSaveInput(!showSaveInput)}
                  title="Save current custom design into your local database"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                    <polyline points="17 21 17 13 7 13 7 21" />
                    <polyline points="7 3 7 8 15 8" />
                  </svg>
                  <span>Save to Database</span>
                </button>

                <button
                  type="button"
                  className="db-aux-btn btn-search-web"
                  onClick={() => handleSearchWeb()}
                  title="Search Google Images for real blueprints matching this plot"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  <span>Search Web Plans</span>
                </button>
              </div>

              {/* INLINE SAVE TO DATABASE FORM */}
              {showSaveInput && (
                <form className="db-inline-save-card" onSubmit={handleSaveCurrentDesign}>
                  <input
                    type="text"
                    placeholder="Enter design name (e.g. My Dream 3 BHK)"
                    value={savePlanName}
                    onChange={(e) => setSavePlanName(e.target.value)}
                    autoFocus
                  />
                  <button type="submit" className="db-save-confirm-btn">
                    Save
                  </button>
                  <button
                    type="button"
                    className="db-save-cancel-btn"
                    onClick={() => setShowSaveInput(false)}
                  >
                    Cancel
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>

        {/* ========================================================
            RIGHT COLUMN: Floor Plan Preview & Database Catalog
            ======================================================== */}
        <section className="design-card">
          {/* TOP VIEW NAVIGATION TABS */}
          <div className="view-mode-tabs-header">
            <div className="view-mode-pills">
              <button
                type="button"
                className={`view-mode-pill ${mainView === "preview" ? "active" : ""}`}
                onClick={() => setMainView("preview")}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <path d="M3 9h18" />
                  <path d="M9 21V9" />
                </svg>
                <span>Interactive 2D Plan</span>
              </button>

              <button
                type="button"
                className={`view-mode-pill ${mainView === "database" ? "active" : ""}`}
                onClick={() => setMainView("database")}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <ellipse cx="12" cy="5" rx="9" ry="3" />
                  <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
                  <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
                </svg>
                <span>Plan Database ({ARCHITECTURAL_PLANS_DATABASE.length})</span>
              </button>

              <button
                type="button"
                className={`view-mode-pill ${mainView === "saved" ? "active" : ""}`}
                onClick={() => setMainView("saved")}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                </svg>
                <span>My Saved Plans ({savedPlans.length})</span>
              </button>
            </div>
          </div>

          {/* ======================================================
              VIEW 1: INTERACTIVE 2D FLOOR PLAN PREVIEW
              ====================================================== */}
          {mainView === "preview" && (
            <>
              {/* Map Controls: Floor Tabs + View Themes + Download */}
              <div className="map-controls-toolbar">
                <div className="floor-tabs-group">
                  <button
                    type="button"
                    className={`floor-tab-btn ${activeFloor === "GF" ? "active" : ""}`}
                    onClick={() => setActiveFloor("GF")}
                  >
                    Ground Floor
                  </button>
                  {totalFloors >= 2 && (
                    <button
                      type="button"
                      className={`floor-tab-btn ${activeFloor === "1F" ? "active" : ""}`}
                      onClick={() => setActiveFloor("1F")}
                    >
                      1st Floor
                    </button>
                  )}
                  {totalFloors >= 3 && (
                    <button
                      type="button"
                      className={`floor-tab-btn ${activeFloor === "2F" ? "active" : ""}`}
                      onClick={() => setActiveFloor("2F")}
                    >
                      2nd Floor
                    </button>
                  )}
                  <button
                    type="button"
                    className={`floor-tab-btn ${activeFloor === "ROOF" ? "active" : ""}`}
                    onClick={() => setActiveFloor("ROOF")}
                  >
                    Terrace
                  </button>
                </div>

                <div className="map-actions-group">
                  <div className="map-theme-pills">
                    <button
                      type="button"
                      className={`theme-pill ${mapTheme === "color" ? "active" : ""}`}
                      onClick={() => setMapTheme("color")}
                      title="2D Colored Architectural Layout"
                    >
                      Color
                    </button>
                    <button
                      type="button"
                      className={`theme-pill ${mapTheme === "blueprint" ? "active" : ""}`}
                      onClick={() => setMapTheme("blueprint")}
                      title="CAD Blueprint Mode"
                    >
                      Blueprint
                    </button>
                    <button
                      type="button"
                      className={`theme-pill ${mapTheme === "vastu" ? "active" : ""}`}
                      onClick={() => setMapTheme("vastu")}
                      title="Vastu Shastra Directions Map"
                    >
                      Vastu
                    </button>
                  </div>

                  <button
                    type="button"
                    className="map-action-icon-btn"
                    onClick={handleDownloadMap}
                    title="Download Vector SVG Map"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    <span>Export SVG</span>
                  </button>
                </div>
              </div>

              {/* DYNAMIC ARCHITECTURAL SVG FLOOR PLAN */}
              <div className={`floorplan-container theme-${mapTheme}`}>
                <svg
                  id="architectural-floorplan-svg"
                  className="floorplan-svg"
                  viewBox="0 0 560 360"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <pattern id="cadGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(56, 189, 248, 0.12)" strokeWidth="0.8" />
                    </pattern>
                  </defs>

                  {mapTheme === "blueprint" ? (
                    <rect x="0" y="0" width="560" height="360" fill="#081426" />
                  ) : mapTheme === "vastu" ? (
                    <rect x="0" y="0" width="560" height="360" fill="#fcfcfc" />
                  ) : null}

                  {mapTheme === "blueprint" && (
                    <rect x="0" y="0" width="560" height="360" fill="url(#cadGrid)" />
                  )}

                  {!hasPlotDimensions ? (
                    <g className="fresh-empty-canvas">
                      <rect
                        x="45"
                        y="35"
                        width="470"
                        height="290"
                        rx="12"
                        fill={mapTheme === "blueprint" ? "rgba(12, 31, 54, 0.75)" : "rgba(255, 255, 255, 0.96)"}
                        stroke={mapTheme === "blueprint" ? "#1e3a5f" : "#cbd5e1"}
                        strokeWidth="1.5"
                        strokeDasharray="6 4"
                      />
                      <circle
                        cx="280"
                        cy="130"
                        r="34"
                        fill={mapTheme === "blueprint" ? "#112a4a" : "#eff6ff"}
                        stroke={mapTheme === "blueprint" ? "#38bdf8" : "#3b82f6"}
                        strokeWidth="2"
                      />
                      <path
                        d="M266 122h28M266 138h28M280 114v32"
                        stroke={mapTheme === "blueprint" ? "#38bdf8" : "#2563eb"}
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />
                      <text
                        x="280"
                        y="195"
                        textAnchor="middle"
                        fontSize="16"
                        fontWeight="800"
                        fill={mapTheme === "blueprint" ? "#f8fafc" : "#0f172a"}
                      >
                        Fresh Canvas — Plot Dimensions Awaiting
                      </text>
                      <text
                        x="280"
                        y="222"
                        textAnchor="middle"
                        fontSize="12"
                        fill={mapTheme === "blueprint" ? "#94a3b8" : "#64748b"}
                      >
                        Enter plot length & width on the left (e.g. 50 × 30 ft) to draft your floor plan
                      </text>
                      <text
                        x="280"
                        y="250"
                        textAnchor="middle"
                        fontSize="12"
                        fontWeight="700"
                        fill={mapTheme === "blueprint" ? "#38bdf8" : "#2563eb"}
                      >
                        ✦ Or pick a ready layout from "Plan Database" tab above ↗
                      </text>
                    </g>
                  ) : (
                    <>
                      {/* DYNAMIC PLOT DIMENSION CALLOUTS */}
                      <g className="dimension-callouts">
                    <line
                      x1={layout.plotX}
                      y1={layout.plotY - 14}
                      x2={layout.plotX + layout.svgW}
                      y2={layout.plotY - 14}
                      stroke={mapTheme === "blueprint" ? "#38bdf8" : "#2563eb"}
                      strokeWidth="1.5"
                    />
                    <path
                      d={`M ${layout.plotX} ${layout.plotY - 17} L ${layout.plotX} ${layout.plotY - 11} M ${layout.plotX + layout.svgW} ${layout.plotY - 17} L ${layout.plotX + layout.svgW} ${layout.plotY - 11}`}
                      stroke={mapTheme === "blueprint" ? "#38bdf8" : "#2563eb"}
                      strokeWidth="1.5"
                    />
                    <rect
                      x={layout.plotX + layout.svgW / 2 - 45}
                      y={layout.plotY - 22}
                      width="90"
                      height="16"
                      fill={mapTheme === "blueprint" ? "#081426" : "#ffffff"}
                      rx="3"
                    />
                    <text
                      x={layout.plotX + layout.svgW / 2}
                      y={layout.plotY - 10}
                      textAnchor="middle"
                      fontSize="10"
                      fontWeight="800"
                      fill={mapTheme === "blueprint" ? "#38bdf8" : "#1e40af"}
                    >
                      WIDTH: {plotW}'-0"
                    </text>

                    <line
                      x1={layout.plotX - 14}
                      y1={layout.plotY}
                      x2={layout.plotX - 14}
                      y2={layout.plotY + layout.svgH}
                      stroke={mapTheme === "blueprint" ? "#38bdf8" : "#2563eb"}
                      strokeWidth="1.5"
                    />
                    <path
                      d={`M ${layout.plotX - 17} ${layout.plotY} L ${layout.plotX - 11} ${layout.plotY} M ${layout.plotX - 17} ${layout.plotY + layout.svgH} L ${layout.plotX - 11} ${layout.plotY + layout.svgH}`}
                      stroke={mapTheme === "blueprint" ? "#38bdf8" : "#2563eb"}
                      strokeWidth="1.5"
                    />
                    <rect
                      x={layout.plotX - 26}
                      y={layout.plotY + layout.svgH / 2 - 18}
                      width="24"
                      height="36"
                      fill={mapTheme === "blueprint" ? "#081426" : "#ffffff"}
                      rx="3"
                    />
                    <text
                      x={layout.plotX - 14}
                      y={layout.plotY + layout.svgH / 2 + 3}
                      textAnchor="middle"
                      fontSize="9.5"
                      fontWeight="800"
                      fill={mapTheme === "blueprint" ? "#38bdf8" : "#1e40af"}
                      transform={`rotate(-90 ${layout.plotX - 14} ${layout.plotY + layout.svgH / 2})`}
                    >
                      {plotL}'-0"
                    </text>
                  </g>

                  {/* OUTER BOUNDARY WALL */}
                  <rect
                    x={layout.plotX}
                    y={layout.plotY}
                    width={layout.svgW}
                    height={layout.svgH}
                    rx="4"
                    fill={mapTheme === "blueprint" ? "#0f233d" : "#546575"}
                    stroke={mapTheme === "blueprint" ? "#38bdf8" : "#334155"}
                    strokeWidth={house.outerWall >= 9 ? "4" : "3"}
                  />

                  {/* INNER USABLE FLOOR SLAB */}
                  <rect
                    x={layout.slabX}
                    y={layout.slabY}
                    width={layout.slabW}
                    height={layout.slabH}
                    fill={mapTheme === "blueprint" ? "#0a1b30" : "#fdfbf7"}
                  />

                  {/* DYNAMIC ROOM PARTITIONS */}
                  {layout.rooms.map((room) => {
                    const colors = getRoomColor(room.type);
                    return (
                      <g key={room.id} className="svg-room-group">
                        <rect
                          x={room.x}
                          y={room.y}
                          width={room.w}
                          height={room.h}
                          fill={colors.fill}
                          stroke={colors.stroke}
                          strokeWidth={room.type === "balcony" ? "2" : "2.5"}
                          strokeDasharray={room.type === "balcony" ? "4 2" : room.type === "terrace" ? "6 3" : undefined}
                        />

                        {room.icon === "bed" && room.w > 60 && room.h > 50 && (
                          <rect
                            x={room.x + 8}
                            y={room.y + 8}
                            width={Math.min(50, room.w * 0.38)}
                            height={Math.min(42, room.h * 0.38)}
                            rx="3"
                            fill={mapTheme === "blueprint" ? "#1e3a5f" : "#fecdd3"}
                            stroke={mapTheme === "blueprint" ? "#67e8f9" : "#fda4af"}
                            strokeWidth="1.2"
                          />
                        )}

                        {room.icon === "kitchen" && room.w > 60 && (
                          <path
                            d={`M ${room.x + 8} ${room.y + 8} L ${room.x + room.w - 8} ${room.y + 8} L ${room.x + room.w - 8} ${room.y + Math.min(38, room.h * 0.45)} L ${room.x + room.w - 24} ${room.y + Math.min(38, room.h * 0.45)} L ${room.x + room.w - 24} ${room.y + 20} L ${room.x + 8} ${room.y + 20} Z`}
                            fill={mapTheme === "blueprint" ? "#1e40af" : "#fde68a"}
                            stroke={mapTheme === "blueprint" ? "#60a5fa" : "#f59e0b"}
                            strokeWidth="1"
                          />
                        )}

                        {room.icon === "car" && room.w > 60 && (
                          <g transform={`translate(${room.x + room.w / 2 - 25}, ${room.y + room.h / 2 - 22})`}>
                            <rect x="0" y="0" width="50" height="28" rx="6" fill="#94a3b8" opacity="0.8" />
                            <circle cx="10" cy="28" r="3.5" fill="#1e293b" />
                            <circle cx="40" cy="28" r="3.5" fill="#1e293b" />
                          </g>
                        )}

                        {room.icon === "sofa" && room.w > 70 && (
                          <rect
                            x={room.x + room.w / 2 - 24}
                            y={room.y + room.h - 26}
                            width="48"
                            height="18"
                            rx="3"
                            fill={mapTheme === "blueprint" ? "#1e3a5f" : "#fef08a"}
                            stroke={mapTheme === "blueprint" ? "#38bdf8" : "#eab308"}
                            strokeWidth="1"
                          />
                        )}

                        {room.icon === "stairs" && (
                          <g className="fp-staircase" transform={`translate(${room.x + room.w - 55}, ${room.y + room.h - 45})`}>
                            <line x1="0" y1="8" x2="45" y2="8" stroke="#94a3b8" strokeWidth="1.8" />
                            <line x1="0" y1="16" x2="45" y2="16" stroke="#94a3b8" strokeWidth="1.8" />
                            <line x1="0" y1="24" x2="45" y2="24" stroke="#94a3b8" strokeWidth="1.8" />
                            <line x1="0" y1="32" x2="45" y2="32" stroke="#94a3b8" strokeWidth="1.8" />
                            <text x="22" y="3" textAnchor="middle" fontSize="7.5" fill="#2563eb" fontWeight="800">
                              STAIRS ➔
                            </text>
                          </g>
                        )}

                        <text
                          x={room.x + room.w / 2}
                          y={room.y + room.h / 2 - (room.h > 65 ? 8 : 2)}
                          textAnchor="middle"
                          className="fp-room-name"
                          fill={colors.text}
                          fontSize={room.w < 110 ? "11" : "13"}
                          fontWeight="700"
                        >
                          {room.name}
                        </text>
                        <text
                          x={room.x + room.w / 2}
                          y={room.y + room.h / 2 + (room.h > 65 ? 9 : 11)}
                          textAnchor="middle"
                          className="fp-room-dim"
                          fill={colors.sub}
                          fontSize={room.w < 110 ? "9.5" : "10.5"}
                          fontWeight="600"
                        >
                          {room.subName}
                        </text>

                        {mapTheme === "vastu" && room.vastu && room.h > 75 && (
                          <text
                            x={room.x + room.w / 2}
                            y={room.y + room.h - 9}
                            textAnchor="middle"
                            fontSize="9"
                            fill="#b45309"
                            fontWeight="800"
                          >
                            [ {room.vastu} ]
                          </text>
                        )}
                      </g>
                    );
                  })}

                  {activeFloor === "ROOF" && (
                    <g transform={`translate(${layout.slabX + layout.slabW * 0.8}, ${layout.slabY + 55})`}>
                      <circle cx="0" cy="0" r="26" fill={mapTheme === "blueprint" ? "#0284c7" : "#38bdf8"} stroke="#0369a1" strokeWidth="2.5" />
                      <text x="0" y="-3" textAnchor="middle" fontSize="8.5" fill="#ffffff" fontWeight="800">WATER TANK</text>
                      <text x="0" y="9" textAnchor="middle" fontSize="7.5" fill="#ffffff">1,000 Litres</text>
                    </g>
                  )}

                  {/* ENTRANCE DOOR */}
                  {activeFloor === "GF" && (
                    <g className="fp-entrance-door">
                      {plotFacing === "East" && (
                        <>
                          <path
                            d={`M ${layout.plotX + layout.svgW} ${layout.plotY + layout.svgH * 0.7} A 24 24 0 0 1 ${layout.plotX + layout.svgW - 24} ${layout.plotY + layout.svgH * 0.7 + 24}`}
                            fill="none"
                            stroke="#2563eb"
                            strokeWidth="2"
                            strokeDasharray="3 2"
                          />
                          <line
                            x1={layout.plotX + layout.svgW}
                            y1={layout.plotY + layout.svgH * 0.7}
                            x2={layout.plotX + layout.svgW - 24}
                            y2={layout.plotY + layout.svgH * 0.7 + 24}
                            stroke="#2563eb"
                            strokeWidth="2.5"
                          />
                          <text
                            x={layout.plotX + layout.svgW - 48}
                            y={layout.plotY + layout.svgH * 0.7 + 30}
                            fontSize="8.5"
                            fill="#2563eb"
                            fontWeight="800"
                          >
                            ENTRY (EAST) ➔
                          </text>
                        </>
                      )}
                      {plotFacing === "North" && (
                        <>
                          <path
                            d={`M ${layout.plotX + layout.svgW * 0.6} ${layout.plotY} A 24 24 0 0 1 ${layout.plotX + layout.svgW * 0.6 + 24} ${layout.plotY + 24}`}
                            fill="none"
                            stroke="#2563eb"
                            strokeWidth="2"
                            strokeDasharray="3 2"
                          />
                          <line
                            x1={layout.plotX + layout.svgW * 0.6}
                            y1={layout.plotY}
                            x2={layout.plotX + layout.svgW * 0.6 + 24}
                            y2={layout.plotY + 24}
                            stroke="#2563eb"
                            strokeWidth="2.5"
                          />
                          <text
                            x={layout.plotX + layout.svgW * 0.6 + 30}
                            y={layout.plotY + 16}
                            fontSize="8.5"
                            fill="#2563eb"
                            fontWeight="800"
                          >
                            ENTRY (NORTH) ⬇
                          </text>
                        </>
                      )}
                      {plotFacing === "West" && (
                        <>
                          <path
                            d={`M ${layout.plotX} ${layout.plotY + layout.svgH * 0.6} A 24 24 0 0 1 ${layout.plotX + 24} ${layout.plotY + layout.svgH * 0.6 + 24}`}
                            fill="none"
                            stroke="#2563eb"
                            strokeWidth="2"
                            strokeDasharray="3 2"
                          />
                          <line
                            x1={layout.plotX}
                            y1={layout.plotY + layout.svgH * 0.6}
                            x2={layout.plotX + 24}
                            y2={layout.plotY + layout.svgH * 0.6 + 24}
                            stroke="#2563eb"
                            strokeWidth="2.5"
                          />
                          <text
                            x={layout.plotX + 8}
                            y={layout.plotY + layout.svgH * 0.6 + 32}
                            fontSize="8.5"
                            fill="#2563eb"
                            fontWeight="800"
                          >
                            ENTRY (WEST) ➔
                          </text>
                        </>
                      )}
                      {plotFacing === "South" && (
                        <>
                          <path
                            d={`M ${layout.plotX + layout.svgW * 0.5} ${layout.plotY + layout.svgH} A 24 24 0 0 1 ${layout.plotX + layout.svgW * 0.5 + 24} ${layout.plotY + layout.svgH - 24}`}
                            fill="none"
                            stroke="#2563eb"
                            strokeWidth="2"
                            strokeDasharray="3 2"
                          />
                          <line
                            x1={layout.plotX + layout.svgW * 0.5}
                            y1={layout.plotY + layout.svgH}
                            x2={layout.plotX + layout.svgW * 0.5 + 24}
                            y2={layout.plotY + layout.svgH - 24}
                            stroke="#2563eb"
                            strokeWidth="2.5"
                          />
                          <text
                            x={layout.plotX + layout.svgW * 0.5 + 32}
                            y={layout.plotY + layout.svgH - 10}
                            fontSize="8.5"
                            fill="#2563eb"
                            fontWeight="800"
                          >
                            ENTRY (SOUTH) ⬆
                          </text>
                        </>
                      )}
                    </g>
                  )}
                  </>
                )}

                  <g className="fp-compass" transform="translate(525, 45)">
                    <circle cx="0" cy="0" r="16" fill={mapTheme === "blueprint" ? "#0c1f36" : "#ffffff"} stroke="#2563eb" strokeWidth="1.5" />
                    <polygon points="0,-12 3.5,-2 0,0 -3.5,-2" fill="#ef4444" />
                    <polygon points="0,12 3.5,2 0,0 -3.5,2" fill="#64748b" />
                    <text x="0" y="-14" textAnchor="middle" fontSize="9" fontWeight="900" fill="#ef4444">N</text>
                    <text x="15" y="3" textAnchor="middle" fontSize="7.5" fontWeight="700" fill="#64748b">E</text>
                  </g>

                  <g className="fp-scale" transform={`translate(${layout.plotX + 10}, ${layout.plotY + layout.svgH - 12})`}>
                    <line x1="0" y1="0" x2="50" y2="0" stroke={mapTheme === "blueprint" ? "#38bdf8" : "#334155"} strokeWidth="1.8" />
                    <line x1="0" y1="-2.5" x2="0" y2="2.5" stroke={mapTheme === "blueprint" ? "#38bdf8" : "#334155"} strokeWidth="1.8" />
                    <line x1="50" y1="-2.5" x2="50" y2="2.5" stroke={mapTheme === "blueprint" ? "#38bdf8" : "#334155"} strokeWidth="1.8" />
                    <text x="25" y="-4" textAnchor="middle" fontSize="8" fill={mapTheme === "blueprint" ? "#38bdf8" : "#475569"} fontWeight="700">SCALE: 1" = 10'</text>
                  </g>
                </svg>
              </div>

              {/* Design Summary Grid */}
              <div className="design-summary-wrap">
                <h3 className="summary-section-title">Design Summary</h3>
                <div className="summary-grid">
                  <div className="summary-item">
                    <div className="summary-icon-box">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                      </svg>
                    </div>
                    <div className="summary-text">
                      <span className="summary-label">Built-up area / floor</span>
                      <strong className="summary-value">{builtUpArea > 0 ? `${builtUpArea.toLocaleString("en-IN")} sq ft` : "Not specified"}</strong>
                    </div>
                  </div>

                  <div className="summary-item">
                    <div className="summary-icon-box">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2">
                        <rect x="4" y="2" width="16" height="20" rx="2" />
                        <line x1="8" y1="6" x2="16" y2="6" />
                        <line x1="8" y1="10" x2="16" y2="10" />
                        <line x1="8" y1="14" x2="16" y2="14" />
                      </svg>
                    </div>
                    <div className="summary-text">
                      <span className="summary-label">Total floors</span>
                      <strong className="summary-value">{totalFloors} {totalFloors === 1 ? "(Ground)" : `(G+${totalFloors - 1})`}</strong>
                    </div>
                  </div>

                  <div className="summary-item">
                    <div className="summary-icon-box">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2">
                        <path d="M2 4v16" />
                        <path d="M2 8h18a2 2 0 0 1 2 2v10" />
                        <path d="M2 17h20" />
                      </svg>
                    </div>
                    <div className="summary-text">
                      <span className="summary-label">Bedrooms</span>
                      <strong className="summary-value">{totalBeds > 0 ? `${totalBeds} BHK` : "Not specified"}</strong>
                    </div>
                  </div>

                  <div className="summary-item">
                    <div className="summary-icon-box">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2">
                        <circle cx="17.5" cy="6.5" r="3.5" />
                        <path d="m11 10-7 7a2 2 0 0 0 0 3l1 1a2 2 0 0 0 3 0l7-7" />
                      </svg>
                    </div>
                    <div className="summary-text">
                      <span className="summary-label">Bathrooms</span>
                      <strong className="summary-value">{totalBaths > 0 ? totalBaths : "Not specified"}</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Architectural Feature Tabs */}
              <div className="map-features-tabs-card">
                <div className="feature-nav-bar">
                  <button
                    type="button"
                    className={`feature-nav-btn ${activeTabFeature === "schedule" ? "active" : ""}`}
                    onClick={() => setActiveTabFeature("schedule")}
                  >
                    Room Schedule ({roomSchedule.list.length} Zones)
                  </button>
                  <button
                    type="button"
                    className={`feature-nav-btn ${activeTabFeature === "vastu" ? "active" : ""}`}
                    onClick={() => setActiveTabFeature("vastu")}
                  >
                    Vastu Audit (94% Match)
                  </button>
                  <button
                    type="button"
                    className={`feature-nav-btn ${activeTabFeature === "openings" ? "active" : ""}`}
                    onClick={() => setActiveTabFeature("openings")}
                  >
                    Schedule of Openings ({house.doors || 6} Doors · {house.windows || 8} Windows)
                  </button>
                </div>

                {activeTabFeature === "schedule" && (
                  <div className="room-schedule-table-wrap">
                    <table className="schedule-table">
                      <thead>
                        <tr>
                          <th>Room / Zone</th>
                          <th>Dimensions</th>
                          <th>Carpet Area</th>
                          <th>Vastu Zone</th>
                        </tr>
                      </thead>
                      <tbody>
                        {roomSchedule.list.map((r, idx) => (
                          <tr key={idx}>
                            <td className="cell-room-name">{r.name}</td>
                            <td>{r.dim}</td>
                            <td>{r.area} sq ft</td>
                            <td>{r.vastu}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="schedule-total-row">
                      <span>Total Calculated Usable Carpet Area:</span>
                      <strong>{roomSchedule.totalCarpet} sq ft ({roomSchedule.efficiency}% space efficiency)</strong>
                    </div>
                  </div>
                )}

                {activeTabFeature === "vastu" && (
                  <div className="vastu-audit-content">
                    <div className="vastu-scorecard-banner">
                      <div className="vastu-score-badge">94% Vastu Score</div>
                      <div className="vastu-score-details">
                        <strong>Vastu Compliant Layout:</strong> Main Entrance in {plotFacing} · Kitchen in Agni (SE) · Master Bedroom in Nairutya (SW)
                      </div>
                    </div>
                    <div className="vastu-items-list">
                      {vastuAudit.map((item, idx) => (
                        <div className="vastu-item-row" key={idx}>
                          <div className="vastu-item-header">
                            <span className="vastu-check-icon">{item.compliant ? "✓" : "⚠"}</span>
                            <strong>{item.rule}: {item.status}</strong>
                          </div>
                          <p className="vastu-item-tip">{item.tip}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTabFeature === "openings" && (
                  <div className="openings-schedule-content">
                    <table className="schedule-table">
                      <thead>
                        <tr>
                          <th>Opening Type</th>
                          <th>Size (W × H)</th>
                          <th>Quantity</th>
                          <th>Specification</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="cell-room-name">Main Door (D1)</td>
                          <td>3'6" × 7'0"</td>
                          <td>1</td>
                          <td>Teak Wood Carved Frame & Brass Fittings</td>
                        </tr>
                        <tr>
                          <td className="cell-room-name">Room Doors (D2)</td>
                          <td>3'0" × 7'0"</td>
                          <td>{Math.max(1, (house.doors || 6) - (house.bathrooms || 2) - 1)}</td>
                          <td>Laminated Flush Doors with Mortise Lock</td>
                        </tr>
                        <tr>
                          <td className="cell-room-name">Toilet Doors (D3)</td>
                          <td>2'6" × 7'0"</td>
                          <td>{house.bathrooms || 2}</td>
                          <td>Waterproof PVC / WPC Doors</td>
                        </tr>
                        <tr>
                          <td className="cell-room-name">Wide Windows (W1)</td>
                          <td>5'0" × 4'6"</td>
                          <td>{Math.max(1, Math.round((house.windows || 8) * 0.6))}</td>
                          <td>UPVC 3-Track Sliding with Mosquito Mesh</td>
                        </tr>
                        <tr>
                          <td className="cell-room-name">Ventilators (V1)</td>
                          <td>2'0" × 1'6"</td>
                          <td>{house.bathrooms || 2}</td>
                          <td>Louvered Glass with Exhaust Provision</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}

          {/* ======================================================
              VIEW 2: ARCHITECTURAL FLOOR PLAN DATABASE (CATALOG)
              ====================================================== */}
          {mainView === "database" && (
            <div className="plan-db-view-container">
              {/* Database Search & Filter Toolbar */}
              <div className="db-filter-toolbar">
                <div className="db-search-box-wrap">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2.2">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search plot (e.g. 30x50, 40x60, East, Duplex)..."
                    value={dbSearch}
                    onChange={(e) => setDbSearch(e.target.value)}
                  />
                  {dbSearch && (
                    <button type="button" className="db-clear-search-btn" onClick={() => setDbSearch("")}>
                      ✕
                    </button>
                  )}
                </div>

                <div className="db-filter-selects">
                  <select value={dbBhkFilter} onChange={(e) => setDbBhkFilter(e.target.value)}>
                    <option value="all">All BHKs</option>
                    <option value="2">2 BHK</option>
                    <option value="3">3 BHK</option>
                    <option value="4">4+ BHK</option>
                  </select>

                  <select value={dbFacingFilter} onChange={(e) => setDbFacingFilter(e.target.value)}>
                    <option value="all">All Facing</option>
                    <option value="East">East</option>
                    <option value="North">North</option>
                    <option value="West">West</option>
                    <option value="South">South</option>
                  </select>
                </div>
              </div>

              {/* Database Stats & Web Search Callout */}
              <div className="db-info-bar">
                <span>
                  Showing <strong>{filteredDbPlans.length}</strong> matching architectural plans from database
                </span>
                <button
                  type="button"
                  className="db-web-search-link"
                  onClick={() => handleSearchWeb(`house plans for ${plotL}x${plotW} feet ${totalBeds} BHK`)}
                >
                  🔍 Search Google Images for More
                </button>
              </div>

              {/* Catalog Cards Grid */}
              <div className="db-plans-grid">
                {filteredDbPlans.map((plan) => (
                  <div className="db-plan-card" key={plan.id}>
                    <div className="db-plan-card-header">
                      <div>
                        <h4 className="db-plan-title">{plan.title}</h4>
                        <div className="db-plan-meta">
                          <span className="db-badge-size">{plan.plotWidth}' × {plan.plotLength}'</span>
                          <span className="db-badge-bhk">{plan.bedrooms} BHK · {plan.builtUpArea} sq ft</span>
                          <span className="db-badge-facing">{plan.facing} Facing</span>
                          <span className="db-badge-vastu">{plan.vastuScore}% Vastu</span>
                        </div>
                      </div>
                    </div>

                    <p className="db-plan-desc">{plan.description}</p>

                    {/* Room Schedule Mini Grid */}
                    <div className="db-room-schedule-mini">
                      {plan.roomSchedule.slice(0, 4).map((r, i) => (
                        <div className="db-room-mini-chip" key={i}>
                          <strong>{r.room}:</strong> {r.size} ({r.zone})
                        </div>
                      ))}
                      {plan.roomSchedule.length > 4 && (
                        <div className="db-room-mini-more">+{plan.roomSchedule.length - 4} more rooms</div>
                      )}
                    </div>

                    {/* Tags */}
                    <div className="db-tags-row">
                      {plan.tags.map((tag, idx) => (
                        <span className="db-tag-pill" key={idx}>
                          #{tag}
                        </span>
                      ))}
                    </div>

                    {/* Action Bar */}
                    <div className="db-card-actions">
                      <button
                        type="button"
                        className="btn-apply-plan"
                        onClick={() => handleApplyPlan(plan)}
                      >
                        ✓ Apply to My Design
                      </button>
                      <button
                        type="button"
                        className="btn-search-similar-web"
                        onClick={() => handleSearchWeb(`${plan.plotWidth}x${plan.plotLength} feet ${plan.bedrooms} BHK ${plan.facing} facing floor plan`)}
                        title="Search web for similar blueprints"
                      >
                        Web Images ➔
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================
              VIEW 3: MY SAVED PLANS (USER'S PERSONAL DATABASE)
              ====================================================== */}
          {mainView === "saved" && (
            <div className="plan-db-view-container">
              <div className="db-info-bar">
                <span>
                  You have <strong>{savedPlans.length}</strong> custom saved plans in your personal database
                </span>
                <button
                  type="button"
                  className="db-aux-btn"
                  onClick={() => setShowSaveInput(true)}
                >
                  + Save Current Design
                </button>
              </div>

              {savedPlans.length === 0 ? (
                <div className="db-empty-state">
                  <div className="empty-icon-circle">📂</div>
                  <h4>No Saved Plans in Database Yet</h4>
                  <p>Configure your measurements on the left and click "Save to Database" to store your custom architectural plans here!</p>
                  <button
                    type="button"
                    className="create-map-btn"
                    style={{ width: "fit-content", margin: "14px auto 0" }}
                    onClick={() => {
                      setMainView("preview");
                      setShowSaveInput(true);
                    }}
                  >
                    Save Current ({plotL}×{plotW} ft) Design
                  </button>
                </div>
              ) : (
                <div className="db-plans-grid">
                  {savedPlans.map((plan) => (
                    <div className="db-plan-card" key={plan.id}>
                      <div className="db-plan-card-header">
                        <div>
                          <h4 className="db-plan-title">{plan.title}</h4>
                          <div className="db-plan-meta">
                            <span className="db-badge-size">{plan.plotWidth}' × {plan.plotLength}'</span>
                            <span className="db-badge-bhk">{plan.bedrooms} BHK</span>
                            <span className="db-badge-facing">{plan.facing} Facing</span>
                            <span className="db-badge-date">
                              Saved: {new Date(plan.savedAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="db-saved-details-row">
                        <div>Area: <strong>{plan.builtUpArea} sq ft</strong></div>
                        <div>Floors: <strong>{plan.floors}</strong></div>
                        <div>Bathrooms: <strong>{plan.bathrooms}</strong></div>
                        <div>Parking: <strong>{plan.parking ? "Yes" : "No"}</strong></div>
                      </div>

                      <div className="db-card-actions">
                        <button
                          type="button"
                          className="btn-apply-plan"
                          onClick={() => handleApplyPlan(plan)}
                        >
                          ✓ Load This Design
                        </button>
                        <button
                          type="button"
                          className="btn-delete-saved-plan"
                          onClick={() => handleDeletePlan(plan.id, plan.title)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Bottom Note */}
          <div className="design-notice-card">
            <span className="notice-bold">Architectural Database & Web Engine:</span> Browse pre-indexed Indian plot plans, save your custom layouts to local database, or click <strong>Search Web Plans</strong> to fetch real blueprints from Google Images.
          </div>
        </section>
      </div>
    </div>
  );
}
