import { useState, useMemo, useEffect } from "react";

export default function CostCalculator({
  house,
  updateHouse,
  estimate,
  rates,
  updateRate,
  contingency,
  setContingency,
}) {
  const TRAILER_CUFT = 120; // 1 trailer (tailor) = 120 cu ft

  // Raw Material Unit Modes
  const [sandUnitMode, setSandUnitMode] = useState("trailer"); // 'trailer' or 'cuft'
  const [stoneUnitMode, setStoneUnitMode] = useState("trailer"); // 'trailer' or 'cuft'
  const [brickUnitMode, setBrickUnitMode] = useState("trailer"); // 'trailer' or 'piece'
  const [steelUnitMode, setSteelUnitMode] = useState("kg"); // 'kg' or 'quintal'

  // Input states for Core Raw Materials
  const [rawRates, setRawRates] = useState({
    cement: rates?.cement ?? "",
    sandTrailer: rates?.sand ? Math.round(rates.sand * TRAILER_CUFT) : "",
    sandCuft: rates?.sand ?? "",
    stoneTrailer: rates?.stone ? Math.round(rates.stone * TRAILER_CUFT) : "",
    stoneCuft: rates?.stone ?? "",
    brickTrailer: rates?.bricks ? Math.round(rates.bricks * 2800) : "",
    brickPiece: rates?.bricks ?? "",
    steelKg: rates?.steel ?? "",
  });

  useEffect(() => {
    setRawRates({
      cement: rates?.cement ?? "",
      sandTrailer: rates?.sand ? Math.round(rates.sand * TRAILER_CUFT) : "",
      sandCuft: rates?.sand ?? "",
      stoneTrailer: rates?.stone ? Math.round(rates.stone * TRAILER_CUFT) : "",
      stoneCuft: rates?.stone ?? "",
      brickTrailer: rates?.bricks ? Math.round(rates.bricks * 2800) : "",
      brickPiece: rates?.bricks ?? "",
      steelKg: rates?.steel ?? "",
    });
  }, [rates]);

  // Comprehensive Labour, Finishing & Fixtures (Default: sq/ft, toggle to per day)
  const defaultTrades = [
    {
      id: "labour",
      name: "Labour rate",
      category: "Structure",
      unitMode: "sqft", // 'sqft' or 'day'
      rateSqft: 175,
      rateDay: 950,
      daysRatio: 0.18, // days per sq ft of built-up area
    },
    {
      id: "plaster",
      name: "Plastering",
      category: "Finishing",
      unitMode: "sqft",
      rateSqft: 55,
      rateDay: 850,
      daysRatio: 0.08,
    },
    {
      id: "flooring",
      name: "Flooring",
      category: "Finishing",
      unitMode: "sqft",
      rateSqft: 110,
      rateDay: 850,
      daysRatio: 0.06,
    },
    {
      id: "painting",
      name: "Painting",
      category: "Finishing",
      unitMode: "sqft",
      rateSqft: 38,
      rateDay: 750,
      daysRatio: 0.06,
    },
    {
      id: "electrical",
      name: "Electrical",
      category: "Services",
      unitMode: "sqft",
      rateSqft: 85,
      rateDay: 850,
      daysRatio: 0.05,
    },
    {
      id: "plumbing",
      name: "Plumbing",
      category: "Services",
      unitMode: "sqft",
      rateSqft: 95,
      rateDay: 850,
      daysRatio: 0.05,
    },
    {
      id: "waterproofing",
      name: "Roof Waterproofing",
      category: "Finishing",
      unitMode: "sqft",
      rateSqft: 35,
      rateDay: 750,
      daysRatio: 0.03,
    },
    {
      id: "carpentry",
      name: "Doors & Windows",
      category: "Fixtures",
      unitMode: "sqft",
      rateSqft: 65,
      rateDay: 900,
      daysRatio: 0.05,
    },
    {
      id: "kitchenSlab",
      name: "Kitchen Counter",
      category: "Fixtures",
      unitMode: "sqft",
      rateSqft: 45,
      rateDay: 850,
      daysRatio: 0.03,
    },
    {
      id: "railing",
      name: "Railing & Balcony",
      category: "Fixtures",
      unitMode: "sqft",
      rateSqft: 40,
      rateDay: 800,
      daysRatio: 0.03,
    },
    {
      id: "falseCeiling",
      name: "False Ceiling & POP",
      category: "Finishing",
      unitMode: "sqft",
      rateSqft: 75,
      rateDay: 800,
      daysRatio: 0.04,
    },
    {
      id: "excavation",
      name: "Earthwork & Excavation",
      category: "Foundation",
      unitMode: "sqft",
      rateSqft: 25,
      rateDay: 650,
      daysRatio: 0.03,
    },
    {
      id: "shuttering",
      name: "Centering & Shuttering",
      category: "Structure",
      unitMode: "sqft",
      rateSqft: 45,
      rateDay: 900,
      daysRatio: 0.04,
    },
    {
      id: "barBending",
      name: "Steel Rods Binding",
      category: "Structure",
      unitMode: "sqft",
      rateSqft: 28,
      rateDay: 850,
      daysRatio: 0.03,
    },
    {
      id: "termite",
      name: "Anti-Termite Treatment",
      category: "Protection",
      unitMode: "sqft",
      rateSqft: 18,
      rateDay: 700,
      daysRatio: 0.02,
    },
  ];

  const [trades, setTrades] = useState(defaultTrades);
  const [masterUnit, setMasterUnit] = useState("sqft"); // 'sqft' or 'day'
  const [localArea, setLocalArea] = useState(house?.area ?? "");
  const [localFloors, setLocalFloors] = useState(house?.floors || 1);
  const [localBudget, setLocalBudget] = useState(house?.budget ?? "");
  const [localContingency, setLocalContingency] = useState(contingency ?? 0);
  const [calculatedAt, setCalculatedAt] = useState(Date.now());
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  useEffect(() => {
    setLocalArea(house?.area ?? "");
    setLocalFloors(house?.floors || 1);
    setLocalBudget(house?.budget ?? "");
  }, [house?.area, house?.floors, house?.budget]);

  useEffect(() => {
    setLocalContingency(contingency ?? 0);
  }, [contingency]);

  // Quick Master toggle for all trades: "sqft" or "day"
  const setAllTradesUnit = (unit) => {
    setMasterUnit(unit);
    setTrades((prev) =>
      prev.map((t) => ({
        ...t,
        unitMode: unit,
      }))
    );
  };

  // Update single trade unit
  const toggleTradeUnit = (id, unit) => {
    setTrades((prev) => {
      const updated = prev.map((t) => (t.id === id ? { ...t, unitMode: unit } : t));
      const allSqft = updated.every((t) => t.unitMode === "sqft");
      const allDay = updated.every((t) => t.unitMode === "day");
      if (allSqft) setMasterUnit("sqft");
      else if (allDay) setMasterUnit("day");
      else setMasterUnit("mixed");
      return updated;
    });
  };

  // Update single trade rate
  const updateTradeRate = (id, val) => {
    const num = val === "" ? "" : Math.max(0, Number(val) || 0);
    setTrades((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          return t.unitMode === "sqft"
            ? { ...t, rateSqft: num }
            : { ...t, rateDay: num };
        }
        return t;
      })
    );
  };

  // Handle core raw rate changes
  const handleRawRateChange = (key, value) => {
    if (value === "") {
      setRawRates((prev) => ({ ...prev, [key]: "" }));
      return;
    }
    const num = Math.max(0, Number(value) || 0);
    setRawRates((prev) => {
      const updated = { ...prev, [key]: num };
      if (key === "sandTrailer") updated.sandCuft = Math.round(num / TRAILER_CUFT);
      if (key === "sandCuft") updated.sandTrailer = Math.round(num * TRAILER_CUFT);
      if (key === "stoneTrailer") updated.stoneCuft = Math.round(num / TRAILER_CUFT);
      if (key === "stoneCuft") updated.stoneTrailer = Math.round(num * TRAILER_CUFT);
      if (key === "brickTrailer") updated.brickPiece = Number((num / 2800).toFixed(1));
      if (key === "brickPiece") updated.brickTrailer = Math.round(num * 2800);
      return updated;
    });
  };

  // Calculate & synchronize with global App state
  const handleCalculate = () => {
    const effectiveSand = sandUnitMode === "trailer" ? rawRates.sandTrailer / TRAILER_CUFT : rawRates.sandCuft;
    const effectiveStone = stoneUnitMode === "trailer" ? rawRates.stoneTrailer / TRAILER_CUFT : rawRates.stoneCuft;
    const effectiveBrick = brickUnitMode === "trailer" ? rawRates.brickTrailer / 2800 : rawRates.brickPiece;

    if (updateRate) {
      updateRate("cement", rawRates.cement);
      updateRate("sand", effectiveSand);
      updateRate("stone", effectiveStone);
      updateRate("bricks", effectiveBrick);
      updateRate("steel", rawRates.steelKg);

      const labourTrade = trades.find((t) => t.id === "labour");
      if (labourTrade) updateRate("labour", labourTrade.rateSqft);
      const plasterTrade = trades.find((t) => t.id === "plaster");
      if (plasterTrade) updateRate("plaster", plasterTrade.rateSqft);
      const flooringTrade = trades.find((t) => t.id === "flooring");
      if (flooringTrade) updateRate("flooring", flooringTrade.rateSqft);
      const paintingTrade = trades.find((t) => t.id === "painting");
      if (paintingTrade) updateRate("painting", paintingTrade.rateSqft);
      const electricalTrade = trades.find((t) => t.id === "electrical");
      if (electricalTrade) updateRate("electrical", electricalTrade.rateSqft);
      const plumbingTrade = trades.find((t) => t.id === "plumbing");
      if (plumbingTrade) updateRate("plumbing", plumbingTrade.rateSqft);
    }

    if (updateHouse) {
      updateHouse("area", localArea);
      updateHouse("floors", localFloors);
      updateHouse("budget", localBudget);
    }

    if (setContingency) {
      setContingency(localContingency);
    }

    setCalculatedAt(Date.now());
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
  };

  // Comprehensive calculation
  const calculation = useMemo(() => {
    const rawArea = Number(localArea) || 0;
    const rawFloors = Number(localFloors) || (rawArea > 0 ? 1 : 0);
    const totalBuiltUp = Math.max(0, rawArea * (rawFloors || 1));
    const wallArea = totalBuiltUp * 2.7;

    // Core Quantities
    const cementBags = Math.round(totalBuiltUp * 0.35);
    const sandCuft = Math.round(totalBuiltUp * 0.27);
    const sandTrailers = (sandCuft / TRAILER_CUFT).toFixed(1);
    const stoneCuft = Math.round(totalBuiltUp * 0.3);
    const stoneTrailers = (stoneCuft / TRAILER_CUFT).toFixed(1);
    const bricksCount = Math.round(wallArea * 4.5);
    const brickTrailers = (bricksCount / 2800).toFixed(1);
    const steelKg = Math.round(totalBuiltUp * 3.5);
    const steelQuintals = (steelKg / 100).toFixed(1);

    // Core Costs
    const sandRatePerCuft = sandUnitMode === "trailer" ? (Number(rawRates.sandTrailer) || 0) / TRAILER_CUFT : (Number(rawRates.sandCuft) || 0);
    const stoneRatePerCuft = stoneUnitMode === "trailer" ? (Number(rawRates.stoneTrailer) || 0) / TRAILER_CUFT : (Number(rawRates.stoneCuft) || 0);
    const brickRatePerPiece = brickUnitMode === "trailer" ? (Number(rawRates.brickTrailer) || 0) / 2800 : (Number(rawRates.brickPiece) || 0);

    const cementCost = cementBags * (Number(rawRates.cement) || 0);
    const sandCost = Math.round(sandCuft * sandRatePerCuft);
    const stoneCost = Math.round(stoneCuft * stoneRatePerCuft);
    const brickCost = Math.round(bricksCount * brickRatePerPiece);
    const steelCost = Math.round(steelKg * (Number(rawRates.steelKg) || 0));

    const rawMaterialsSubtotal = cementCost + sandCost + stoneCost + brickCost + steelCost;

    // Trades & Finishing calculations
    const tradeRows = trades.map((trade) => {
      let quantity = 0;
      let unitLabel = "";
      let rateApplied = 0;
      let cost = 0;

      if (trade.unitMode === "sqft") {
        quantity = totalBuiltUp;
        unitLabel = "sq ft";
        rateApplied = Number(trade.rateSqft) || 0;
        cost = Math.round(quantity * rateApplied);
      } else {
        // Daily wage calculation: days based on built-up area and trade days ratio
        const days = totalBuiltUp > 0 ? Math.max(1, Math.round(totalBuiltUp * trade.daysRatio)) : 0;
        quantity = days;
        unitLabel = "days";
        rateApplied = Number(trade.rateDay) || 0;
        cost = Math.round(days * rateApplied);
      }

      return {
        ...trade,
        quantity,
        unitLabel,
        rateApplied,
        cost,
      };
    });

    const tradesSubtotal = tradeRows.reduce((sum, item) => sum + item.cost, 0);
    const baseCost = rawMaterialsSubtotal + tradesSubtotal;
    const extraAllowance = Math.round(baseCost * ((Number(localContingency) || 0) / 100));
    const totalCost = baseCost + extraAllowance;
    const costPerSqFt = totalBuiltUp > 0 ? Math.round(totalCost / totalBuiltUp) : 0;
    const userBudget = Number(localBudget) || 0;
    const budgetDifference = userBudget > 0 ? Math.abs(userBudget - totalCost) : 0;
    const isWithinBudget = userBudget > 0 ? totalCost <= userBudget : true;
    const budgetPercent = userBudget > 0 ? Math.min(100, Math.round((totalCost / userBudget) * 100)) : 0;

    return {
      totalBuiltUp,
      wallArea,
      cementBags,
      sandCuft,
      sandTrailers,
      stoneCuft,
      stoneTrailers,
      bricksCount,
      brickTrailers,
      steelKg,
      steelQuintals,
      cementCost,
      sandCost,
      stoneCost,
      brickCost,
      steelCost,
      rawMaterialsSubtotal,
      tradeRows,
      tradesSubtotal,
      baseCost,
      extraAllowance,
      totalCost,
      costPerSqFt,
      isWithinBudget,
      budgetDifference,
      budgetPercent,
    };
  }, [rawRates, trades, localArea, localFloors, localBudget, localContingency, sandUnitMode, stoneUnitMode, brickUnitMode, steelUnitMode, calculatedAt]);

  const money = (val) => "₹ " + Math.round(val || 0).toLocaleString("en-IN");

  return (
    <div className="calculator-page">
      <div className="calc-layout-grid">
        {/* Left Column: Local Area Rates Input Panel */}
        <section className="calc-card">
          <div className="card-header">
            <div className="card-header-icon calc-badge-blue">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="4" y="2" width="16" height="20" rx="2" />
                <line x1="8" x2="16" y1="6" y2="6" />
                <line x1="16" x2="16" y1="14" y2="18" />
                <path d="M16 10h.01" />
                <path d="M12 10h.01" />
                <path d="M8 10h.01" />
                <path d="M12 14h.01" />
                <path d="M8 14h.01" />
              </svg>
            </div>
            <div>
              <h2 className="card-title">Local Area Cost Rates</h2>
              <p className="card-subtitle">
                Set rates for Sand, Stone & Bricks per trailer (120 cu ft), Rods per kg, and Labour (sq ft / per day)
              </p>
            </div>
          </div>

          <div className="calc-form-scrollable">
            {/* Section 1: Dimensions & Budget */}
            <div className="calc-field-group">
              <span className="group-title">1. Built-up Area & Budget</span>
              <div className="form-row-3">
                <label className="input-group">
                  <span>Built-up area (sq ft)</span>
                  <input
                    type="number"
                    min="1"
                    placeholder="e.g. 1200"
                    value={localArea}
                    onChange={(e) => setLocalArea(e.target.value === "" ? "" : Number(e.target.value))}
                  />
                </label>

                <label className="input-group">
                  <span>Number of floors</span>
                  <select
                    value={localFloors}
                    onChange={(e) => setLocalFloors(Number(e.target.value))}
                  >
                    <option value={1}>1 floor</option>
                    <option value={2}>2 floors (G+1)</option>
                    <option value={3}>3 floors (G+2)</option>
                    <option value={4}>4 floors (G+3)</option>
                  </select>
                </label>

                <label className="input-group">
                  <span>Total Budget (₹)</span>
                  <input
                    type="number"
                    step="50000"
                    min="0"
                    placeholder="e.g. 4500000"
                    value={localBudget}
                    onChange={(e) => setLocalBudget(e.target.value === "" ? "" : Number(e.target.value))}
                  />
                </label>
              </div>
            </div>

            {/* Section 2: Core Materials (Per Trailer / Per Kg / Per Bag) */}
            <div className="calc-field-group">
              <span className="group-title">2. Core Raw Materials (Per Trailer = 120 cu ft / Per Kg / Per Bag)</span>

              {/* Sand Rate Row */}
              <div className="rate-input-row">
                <div className="rate-label-box">
                  <strong>Sand (Reti / Balu)</strong>
                  <div className="unit-toggle-pill">
                    <button
                      type="button"
                      className={`pill-btn ${sandUnitMode === "trailer" ? "active" : ""}`}
                      onClick={() => setSandUnitMode("trailer")}
                    >
                      Per Trailer
                    </button>
                    <button
                      type="button"
                      className={`pill-btn ${sandUnitMode === "cuft" ? "active" : ""}`}
                      onClick={() => setSandUnitMode("cuft")}
                    >
                      Per cu ft
                    </button>
                  </div>
                </div>
                <div className="rate-value-box">
                  {sandUnitMode === "trailer" ? (
                    <label className="unit-input-wrap">
                      <span className="currency-prefix">₹</span>
                      <input
                        type="number"
                        min="0"
                        value={rawRates.sandTrailer}
                        onChange={(e) => handleRawRateChange("sandTrailer", e.target.value)}
                        placeholder="7200"
                      />
                      <span className="unit-suffix">/ trailer</span>
                    </label>
                  ) : (
                    <label className="unit-input-wrap">
                      <span className="currency-prefix">₹</span>
                      <input
                        type="number"
                        min="0"
                        value={rawRates.sandCuft}
                        onChange={(e) => handleRawRateChange("sandCuft", e.target.value)}
                        placeholder="60"
                      />
                      <span className="unit-suffix">/ cu ft</span>
                    </label>
                  )}
                  <small className="hint-text">1 trailer (tailor) = 120 cu ft</small>
                </div>
              </div>

              {/* Stone Chips (Aggregate) Rate Row */}
              <div className="rate-input-row">
                <div className="rate-label-box">
                  <strong>Stone Chips (Gitti)</strong>
                  <div className="unit-toggle-pill">
                    <button
                      type="button"
                      className={`pill-btn ${stoneUnitMode === "trailer" ? "active" : ""}`}
                      onClick={() => setStoneUnitMode("trailer")}
                    >
                      Per Trailer
                    </button>
                    <button
                      type="button"
                      className={`pill-btn ${stoneUnitMode === "cuft" ? "active" : ""}`}
                      onClick={() => setStoneUnitMode("cuft")}
                    >
                      Per cu ft
                    </button>
                  </div>
                </div>
                <div className="rate-value-box">
                  {stoneUnitMode === "trailer" ? (
                    <label className="unit-input-wrap">
                      <span className="currency-prefix">₹</span>
                      <input
                        type="number"
                        min="0"
                        value={rawRates.stoneTrailer}
                        onChange={(e) => handleRawRateChange("stoneTrailer", e.target.value)}
                        placeholder="8400"
                      />
                      <span className="unit-suffix">/ trailer</span>
                    </label>
                  ) : (
                    <label className="unit-input-wrap">
                      <span className="currency-prefix">₹</span>
                      <input
                        type="number"
                        min="0"
                        value={rawRates.stoneCuft}
                        onChange={(e) => handleRawRateChange("stoneCuft", e.target.value)}
                        placeholder="70"
                      />
                      <span className="unit-suffix">/ cu ft</span>
                    </label>
                  )}
                  <small className="hint-text">1 trailer (tailor) = 120 cu ft</small>
                </div>
              </div>

              {/* Bricks Rate Row */}
              <div className="rate-input-row">
                <div className="rate-label-box">
                  <strong>Red Bricks (Eent)</strong>
                  <div className="unit-toggle-pill">
                    <button
                      type="button"
                      className={`pill-btn ${brickUnitMode === "trailer" ? "active" : ""}`}
                      onClick={() => setBrickUnitMode("trailer")}
                    >
                      Per Trailer
                    </button>
                    <button
                      type="button"
                      className={`pill-btn ${brickUnitMode === "piece" ? "active" : ""}`}
                      onClick={() => setBrickUnitMode("piece")}
                    >
                      Per Piece
                    </button>
                  </div>
                </div>
                <div className="rate-value-box">
                  {brickUnitMode === "trailer" ? (
                    <label className="unit-input-wrap">
                      <span className="currency-prefix">₹</span>
                      <input
                        type="number"
                        min="0"
                        value={rawRates.brickTrailer}
                        onChange={(e) => handleRawRateChange("brickTrailer", e.target.value)}
                        placeholder="28000"
                      />
                      <span className="unit-suffix">/ trailer</span>
                    </label>
                  ) : (
                    <label className="unit-input-wrap">
                      <span className="currency-prefix">₹</span>
                      <input
                        type="number"
                        step="0.5"
                        min="0"
                        value={rawRates.brickPiece}
                        onChange={(e) => handleRawRateChange("brickPiece", e.target.value)}
                        placeholder="10"
                      />
                      <span className="unit-suffix">/ brick</span>
                    </label>
                  )}
                  <small className="hint-text">1 trailer ≈ 2,800 bricks</small>
                </div>
              </div>

              {/* Steel Rods Rate Row */}
              <div className="rate-input-row">
                <div className="rate-label-box">
                  <strong>Steel Rods (TMT Sariya)</strong>
                  <div className="unit-toggle-pill">
                    <button
                      type="button"
                      className={`pill-btn ${steelUnitMode === "kg" ? "active" : ""}`}
                      onClick={() => setSteelUnitMode("kg")}
                    >
                      Per Kg
                    </button>
                    <button
                      type="button"
                      className={`pill-btn ${steelUnitMode === "quintal" ? "active" : ""}`}
                      onClick={() => setSteelUnitMode("quintal")}
                    >
                      Per Quintal
                    </button>
                  </div>
                </div>
                <div className="rate-value-box">
                  {steelUnitMode === "kg" ? (
                    <label className="unit-input-wrap">
                      <span className="currency-prefix">₹</span>
                      <input
                        type="number"
                        min="0"
                        value={rawRates.steelKg}
                        onChange={(e) => handleRawRateChange("steelKg", e.target.value)}
                        placeholder="72"
                      />
                      <span className="unit-suffix">/ kg</span>
                    </label>
                  ) : (
                    <label className="unit-input-wrap">
                      <span className="currency-prefix">₹</span>
                      <input
                        type="number"
                        min="0"
                        value={rawRates.steelKg * 100}
                        onChange={(e) => handleRawRateChange("steelKg", Number(e.target.value) / 100)}
                        placeholder="7200"
                      />
                      <span className="unit-suffix">/ quintal</span>
                    </label>
                  )}
                  <small className="hint-text">Fe 500D / 550D TMT</small>
                </div>
              </div>

              {/* Cement Rate Row */}
              <div className="rate-input-row">
                <div className="rate-label-box">
                  <strong>Cement (PPC / OPC)</strong>
                  <span className="badge-tag">Standard 50 kg</span>
                </div>
                <div className="rate-value-box">
                  <label className="unit-input-wrap">
                    <span className="currency-prefix">₹</span>
                    <input
                      type="number"
                      min="0"
                      value={rawRates.cement}
                      onChange={(e) => handleRawRateChange("cement", e.target.value)}
                      placeholder="400"
                    />
                    <span className="unit-suffix">/ bag</span>
                  </label>
                  <small className="hint-text">50 kg bag</small>
                </div>
              </div>
            </div>

            {/* Section 3: Labour & Finishing Work (All default to sq/ft with per day toggle) */}
            <div className="calc-field-group">
              <div className="group-header-with-action">
                <span className="group-title">3. LABOUR & FINISHING WORK (DEFAULT: SQ/FT, PER DAY)</span>
                <div className="master-unit-pills">
                  <span className="master-unit-label">Switch All:</span>
                  <button
                    type="button"
                    className={`pill-btn ${masterUnit === "sqft" ? "active" : ""}`}
                    onClick={() => setAllTradesUnit("sqft")}
                  >
                    All sq/ft
                  </button>
                  <button
                    type="button"
                    className={`pill-btn ${masterUnit === "day" ? "active" : ""}`}
                    onClick={() => setAllTradesUnit("day")}
                  >
                    All per day
                  </button>
                </div>
              </div>

              <div className="trades-input-grid">
                {trades.map((trade) => {
                  const isSqft = trade.unitMode === "sqft";
                  const currentValue = isSqft ? trade.rateSqft : trade.rateDay;

                  return (
                    <div className="trade-card-item" key={trade.id}>
                      <div className="trade-title-row">
                        <span className="trade-name-title" title={trade.name}>{trade.name}</span>
                        <span className="trade-unit-badge">
                          {isSqft ? "₹/sq ft" : "₹/day"}
                        </span>
                      </div>

                      <div className="trade-toggle-row">
                        <div className="unit-toggle-pill small-toggle full-width-toggle">
                          <button
                            type="button"
                            className={`pill-btn ${isSqft ? "active" : ""}`}
                            onClick={() => toggleTradeUnit(trade.id, "sqft")}
                            title="Calculate by sqr/ft"
                          >
                            sqr/ft
                          </button>
                          <button
                            type="button"
                            className={`pill-btn ${!isSqft ? "active" : ""}`}
                            onClick={() => toggleTradeUnit(trade.id, "day")}
                            title="Calculate per day"
                          >
                            per day
                          </button>
                        </div>
                      </div>

                      <div className="trade-input-row">
                        <label className="unit-input-wrap trade-input-wrap">
                          <span className="currency-prefix">₹</span>
                          <input
                            type="number"
                            min="0"
                            value={currentValue}
                            onChange={(e) => updateTradeRate(trade.id, e.target.value)}
                          />
                          <span className="unit-suffix">{isSqft ? "/ sq ft" : "/ day"}</span>
                        </label>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Primary Action Button to Calculate */}
          <div className="calc-action-bar">
            <button
              type="button"
              className="calculate-btn"
              onClick={handleCalculate}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="4" y="2" width="16" height="20" rx="2" />
                <line x1="8" x2="16" y1="6" y2="6" />
                <line x1="16" x2="16" y1="14" y2="18" />
                <path d="M16 10h.01" />
                <path d="M12 10h.01" />
                <path d="M8 10h.01" />
                <path d="M12 14h.01" />
                <path d="M8 14h.01" />
              </svg>
              <span>Calculate Construction Cost</span>
            </button>

            {showSuccessToast && (
              <div className="calc-toast">
                ✓ Cost calculated and updated successfully!
              </div>
            )}
          </div>
        </section>

        {/* Right Column: Calculated Cost Breakdown & Summary */}
        <section className="calc-card">
          <div className="card-header">
            <div className="card-header-icon calc-badge-green">
              <span className="header-rupee">₹</span>
            </div>
            <div>
              <h2 className="card-title">Estimated Cost Breakdown</h2>
              <p className="card-subtitle">
                Total Built-up: {calculation.totalBuiltUp.toLocaleString("en-IN")} sq ft ({localFloors} floor{localFloors > 1 ? "s" : ""})
              </p>
            </div>
          </div>

          {/* Key Metric Highlights */}
          <div className="calc-kpi-grid">
            <div className="calc-kpi-box kpi-highlight">
              <span className="kpi-label">Total Estimated Cost</span>
              <strong className="kpi-val-primary">{money(calculation.totalCost)}</strong>
              <small className="kpi-subtext">Includes {localContingency}% buffer</small>
            </div>

            <div className="calc-kpi-box">
              <span className="kpi-label">Cost per Sq Ft</span>
              <strong className="kpi-val-secondary">{money(calculation.costPerSqFt)}</strong>
              <small className="kpi-subtext">Estimated average</small>
            </div>

            <div className={`calc-kpi-box ${calculation.isWithinBudget ? "kpi-box-success" : "kpi-box-danger"}`}>
              <span className="kpi-label">Budget Status</span>
              <strong className={`kpi-status ${calculation.isWithinBudget ? "text-green" : "text-red"}`}>
                {calculation.isWithinBudget ? "Within Budget" : "Over Budget"}
              </strong>
              <small className="kpi-subtext">
                {money(calculation.budgetDifference)} {calculation.isWithinBudget ? "remaining" : "over"}
              </small>
            </div>
          </div>

          {/* Budget Progress Bar */}
          <div className="budget-progress-container">
            <div className="progress-labels">
              <span>Budget Usage ({calculation.budgetPercent}%)</span>
              <span>Budget: {money(localBudget)}</span>
            </div>
            <div className="progress-track">
              <div
                className={`progress-fill ${calculation.isWithinBudget ? "fill-green" : "fill-red"}`}
                style={{ width: `${calculation.budgetPercent}%` }}
              />
            </div>
          </div>

          {/* Key Raw Material Quantity & Cost Cards (Per Trailer/Kg/Bag) */}
          <div className="materials-quantities-section">
            <span className="section-small-title">Materials Required for Your Area</span>
            <div className="quantities-grid">
              {/* Sand */}
              <div className="qty-card">
                <div className="qty-header">
                  <span className="qty-material">Sand (Reti)</span>
                  <span className="qty-amount">{money(calculation.sandCost)}</span>
                </div>
                <div className="qty-unit-pill">
                  <strong>{calculation.sandTrailers} Trailers</strong>
                  <span>({calculation.sandCuft.toLocaleString("en-IN")} cu ft)</span>
                </div>
              </div>

              {/* Stone Chips */}
              <div className="qty-card">
                <div className="qty-header">
                  <span className="qty-material">Stone Chips (Gitti)</span>
                  <span className="qty-amount">{money(calculation.stoneCost)}</span>
                </div>
                <div className="qty-unit-pill">
                  <strong>{calculation.stoneTrailers} Trailers</strong>
                  <span>({calculation.stoneCuft.toLocaleString("en-IN")} cu ft)</span>
                </div>
              </div>

              {/* Bricks */}
              <div className="qty-card">
                <div className="qty-header">
                  <span className="qty-material">Red Bricks</span>
                  <span className="qty-amount">{money(calculation.brickCost)}</span>
                </div>
                <div className="qty-unit-pill">
                  <strong>{calculation.brickTrailers} Trailers</strong>
                  <span>({calculation.bricksCount.toLocaleString("en-IN")} pcs)</span>
                </div>
              </div>

              {/* Steel Rods */}
              <div className="qty-card">
                <div className="qty-header">
                  <span className="qty-material">Steel Rods (Sariya)</span>
                  <span className="qty-amount">{money(calculation.steelCost)}</span>
                </div>
                <div className="qty-unit-pill">
                  <strong>{calculation.steelKg.toLocaleString("en-IN")} kg</strong>
                  <span>({calculation.steelQuintals} quintals)</span>
                </div>
              </div>

              {/* Cement */}
              <div className="qty-card">
                <div className="qty-header">
                  <span className="qty-material">Cement Bags</span>
                  <span className="qty-amount">{money(calculation.cementCost)}</span>
                </div>
                <div className="qty-unit-pill">
                  <strong>{calculation.cementBags.toLocaleString("en-IN")} Bags</strong>
                  <span>(50 kg each)</span>
                </div>
              </div>

              {/* Labour & Trades */}
              <div className="qty-card">
                <div className="qty-header">
                  <span className="qty-material">Labour & Finishing</span>
                  <span className="qty-amount">{money(calculation.tradesSubtotal)}</span>
                </div>
                <div className="qty-unit-pill">
                  <strong>{trades.length} Work Trades</strong>
                  <span>(Civil, Finishing & Fittings)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Full Itemized Cost Table - Dynamically Fills Remaining Height */}
          <div className="calc-table-wrap">
            <table className="calc-table">
              <thead>
                <tr>
                  <th>Item / Work</th>
                  <th>Quantity</th>
                  <th>Unit Rate</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {/* Core Materials */}
                <tr>
                  <td>Sand (Balu)</td>
                  <td>{calculation.sandTrailers} trailers ({calculation.sandCuft} cu ft)</td>
                  <td>{sandUnitMode === "trailer" ? `${money(rawRates.sandTrailer)}/trailer` : `${money(rawRates.sandCuft)}/cu ft`}</td>
                  <td>{money(calculation.sandCost)}</td>
                </tr>
                <tr>
                  <td>Stone Aggregate</td>
                  <td>{calculation.stoneTrailers} trailers ({calculation.stoneCuft} cu ft)</td>
                  <td>{stoneUnitMode === "trailer" ? `${money(rawRates.stoneTrailer)}/trailer` : `${money(rawRates.stoneCuft)}/cu ft`}</td>
                  <td>{money(calculation.stoneCost)}</td>
                </tr>
                <tr>
                  <td>Red Bricks</td>
                  <td>{calculation.brickTrailers} trailers ({calculation.bricksCount.toLocaleString("en-IN")} pcs)</td>
                  <td>{brickUnitMode === "trailer" ? `${money(rawRates.brickTrailer)}/trailer` : `${money(rawRates.brickPiece)}/brick`}</td>
                  <td>{money(calculation.brickCost)}</td>
                </tr>
                <tr>
                  <td>Steel Rods (TMT)</td>
                  <td>{calculation.steelKg.toLocaleString("en-IN")} kg ({calculation.steelQuintals} qtl)</td>
                  <td>{money(rawRates.steelKg)} / kg</td>
                  <td>{money(calculation.steelCost)}</td>
                </tr>
                <tr>
                  <td>Cement (PPC/OPC)</td>
                  <td>{calculation.cementBags} bags (50kg)</td>
                  <td>{money(rawRates.cement)} / bag</td>
                  <td>{money(calculation.cementCost)}</td>
                </tr>

                {/* All Labour & Trades */}
                {calculation.tradeRows.map((trade) => (
                  <tr key={trade.id}>
                    <td>{trade.name}</td>
                    <td>{trade.quantity.toLocaleString("en-IN")} {trade.unitLabel}</td>
                    <td>{money(trade.rateApplied)} / {trade.unitMode === "sqft" ? "sq ft" : "day"}</td>
                    <td>{money(trade.cost)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="tfoot-subtotal">
                  <td colSpan="3">Base Material & Labour Total</td>
                  <td>{money(calculation.baseCost)}</td>
                </tr>
                <tr className="tfoot-contingency">
                  <td colSpan="3">Contingency & Unforeseen ({localContingency}%)</td>
                  <td>{money(calculation.extraAllowance)}</td>
                </tr>
                <tr className="tfoot-grand">
                  <td colSpan="3">Total Estimated Construction Cost</td>
                  <td>{money(calculation.totalCost)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
