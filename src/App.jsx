
import { useMemo, useState } from "react";
import { NavLink, Navigate, Route, Routes, useLocation } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import HomeDesign from "./pages/HomeDesign";
import CostCalculator from "./pages/CostCalculator";
import MaterialList from "./pages/MaterialList";
import Reports from "./pages/Reports";
import Setting from "./pages/Setting";
import MLPrediction from "./pages/MLPrediction";
import "./App.css";

export const blankHouse = {
  length: "",
  width: "",
  area: "",
  floors: 1,
  height: "",
  outerWall: "",
  innerWall: "",
  bedrooms: "",
  bathrooms: "",
  doors: "",
  windows: "",
  budget: "",
  style: "Modern",
  quality: "Standard",
  parking: false,
};

export const blankRates = {
  cement: "",
  sand: "",
  stone: "",
  bricks: "",
  steel: "",
  labour: "",
  plaster: "",
  flooring: "",
  painting: "",
  doors: "",
  windows: "",
  electrical: "",
  plumbing: "",
};

export const standardMarketRates = {
  cement: 380,
  sand: 55,
  stone: 65,
  bricks: 9,
  steel: 65,
  labour: 120,
  plaster: 45,
  flooring: 80,
  painting: 30,
  doors: 8000,
  windows: 5000,
  electrical: 60,
  plumbing: 70,
};

const materialList = [
  ["cement", "Cement", "₹ / bag", "bags"],
  ["sand", "Sand", "₹ / cu ft", "cu ft"],
  ["stone", "Stone chips", "₹ / cu ft", "cu ft"],
  ["bricks", "Bricks", "₹ / brick", "pieces"],
  ["steel", "Steel rods", "₹ / kg", "kg"],
  ["labour", "Labour", "₹ / sq ft", "sq ft"],
  ["plaster", "Plastering", "₹ / sq ft", "sq ft"],
  ["flooring", "Flooring", "₹ / sq ft", "sq ft"],
  ["painting", "Painting", "₹ / sq ft", "sq ft"],
  ["doors", "Doors", "₹ / door", "doors"],
  ["windows", "Windows", "₹ / window", "windows"],
  ["electrical", "Electrical", "₹ / sq ft", "sq ft"],
  ["plumbing", "Plumbing", "₹ / sq ft", "sq ft"],
];

function NavIcon({ name, icon }) {
  if (icon) {
    return <span style={{ fontSize: "16px", lineHeight: 1, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>{icon}</span>;
  }
  switch (name) {
    case "dashboard":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M4 13h6a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1zm0 8h6a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1zm10 0h6a1 1 0 0 0 1-1v-8a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1zm0-18a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1h-6z" />
        </svg>
      );
    case "design":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      );
    case "calculator":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="2" width="16" height="20" rx="2" />
          <line x1="8" x2="16" y1="6" y2="6" />
          <line x1="16" x2="16" y1="14" y2="18" />
          <path d="M16 10h.01" />
          <path d="M12 10h.01" />
          <path d="M8 10h.01" />
          <path d="M12 14h.01" />
          <path d="M8 14h.01" />
          <path d="M12 18h.01" />
          <path d="M8 18h.01" />
        </svg>
      );
    case "materials":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
          <path d="m3.3 7 8.7 5 8.7-5" />
          <path d="M12 22V12" />
        </svg>
      );
    case "reports":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" x2="8" y1="13" y2="13" />
          <line x1="16" x2="8" y1="17" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      );
    case "settings":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      );
    default:
      return null;
  }
}

const navItems = [
  { label: "Dashboard", path: "/dashboard", iconName: "dashboard" },
  { label: "Home Design", path: "/design", iconName: "design" },
  { label: "Cost Calculator", path: "/calculator", iconName: "calculator" },
  { label: "Material List", path: "/materials", iconName: "materials" },
  { label: "Reports", path: "/reports", iconName: "reports" },
  { label: "ML Prediction", path: "/ml-prediction", icon: "✦" },
  { label: "Settings", path: "/settings", iconName: "settings" },
];

function App() {
  const [house, setHouse] = useState(blankHouse);
  const [rates, setRates] = useState(blankRates);
  const [contingency, setContingency] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();

  const updateHouse = (key, value) => {
    setHouse((previous) => ({ ...previous, [key]: value }));
  };

  const updateRate = (key, value) => {
    const amount = value === "" ? "" : Math.max(0, Number(value) || 0);
    setRates((previous) => ({ ...previous, [key]: amount }));
  };

  const handleResetAll = () => {
    if (window.confirm("Make system fresh? This will clear all house measurements, custom plans, and rates.")) {
      setHouse({ ...blankHouse });
      setRates({ ...blankRates });
      setContingency(0);
      try {
        localStorage.clear();
        window.dispatchEvent(new Event("plans-updated"));
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleResetHouseOnly = () => {
    setHouse({ ...blankHouse });
  };

  const handleResetRatesOnly = () => {
    setRates({ ...blankRates });
  };

  const handleLoadMarketRates = () => {
    setRates({ ...standardMarketRates });
  };

  const estimate = useMemo(() => {
    const rawArea = Number(house.area) || 0;
    const rawFloors = Number(house.floors) || (rawArea > 0 ? 1 : 0);
    const area = Math.max(0, rawArea * (rawFloors || 1));
    const wallArea = area * 2.7;

    const numDoors = (Number(house.doors) || 0) * (rawFloors || 1);
    const numWindows = (Number(house.windows) || 0) * (rawFloors || 1);

    const quantities = {
      cement: area * 0.35,
      sand: area * 0.27,
      stone: area * 0.3,
      bricks: wallArea * 4.5,
      steel: area * 3.5,
      labour: area,
      plaster: wallArea * 2,
      flooring: area,
      painting: wallArea * 2,
      doors: numDoors,
      windows: numWindows,
      electrical: area,
      plumbing: area,
    };

    const rows = materialList.map(([key, label, unit, quantityUnit]) => {
      const q = quantities[key] || 0;
      const r = Number(rates[key]) || 0;
      return {
        key,
        label,
        unit,
        quantityUnit,
        quantity: q,
        rate: r,
        total: q * r,
      };
    });

    const base = rows.reduce((sum, row) => sum + row.total, 0);
    const extra = base * ((Number(contingency) || 0) / 100);

    return { area, wallArea, rows, base, extra, total: base + extra };
  }, [house, rates, contingency]);

  const activeItem =
    navItems.find((item) => item.path === location.pathname) || navItems[0];

  return (
    <div className="app-shell">
      {/* Left Full-Height Dark Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-logo-box">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
              <path d="M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3z" />
            </svg>
          </div>
          <span className="brand-title">Smart Home Builder</span>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
            >
              <span className="nav-icon">
                <NavIcon name={item.iconName} icon={item.icon} />
              </span>
              <span className="nav-text">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Bottom promo / badge card */}
        <div className="sidebar-footer-card">
          <div className="footer-card-badge">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="m9 12 2 2 4-4" />
            </svg>
          </div>
          <h4>Plan Smarter<br />Build Better</h4>
          <p>Your complete home planning solution.</p>
        </div>
      </aside>

      {/* Main App Body */}
      <div className="main-wrapper">
        <header className="main-header">
          <h1 className="header-page-title">{activeItem.label}</h1>

          <div className="header-right">
            <button
              type="button"
              className="header-fresh-btn"
              onClick={handleResetAll}
              title="Clear all project data and make system fresh"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 6h18" />
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
              </svg>
              <span>Fresh Start</span>
            </button>

            <div className="search-box">
              <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {location.pathname === "/reports" ? (
              <button
                type="button"
                className="print-pdf-header-btn"
                onClick={() => window.print()}
              >
                Print / Save PDF
              </button>
            ) : (
              <>
                <button className="header-icon-btn" title="Notifications">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2">
                    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                  </svg>
                  <span className="notification-dot" />
                </button>

                <div className="user-avatar" title="Smart Home User">
                  SH
                </div>
              </>
            )}
          </div>
        </header>

        <main className="main-content">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          <Route
            path="/dashboard"
            element={<Dashboard house={house} estimate={estimate} />}
          />

          <Route
            path="/design"
            element={<HomeDesign house={house} updateHouse={updateHouse} />}
          />

          <Route
            path="/calculator"
            element={
              <CostCalculator
                house={house}
                updateHouse={updateHouse}
                estimate={estimate}
                rates={rates}
                updateRate={updateRate}
                contingency={contingency}
                setContingency={setContingency}
              />
            }
          />

          <Route
            path="/materials"
            element={
              <MaterialList
                rates={rates}
                updateRate={updateRate}
                estimate={estimate}
                searchQuery={searchQuery}
                onLoadMarketRates={handleLoadMarketRates}
              />
            }
          />

          <Route
            path="/reports"
            element={
              <Reports house={house} estimate={estimate} rates={rates} />
            }
          />

          <Route
            path="/settings"
            element={
              <Setting
                rates={rates}
                updateRate={updateRate}
                contingency={contingency}
                setContingency={setContingency}
                handleResetAll={handleResetAll}
                handleResetHouseOnly={handleResetHouseOnly}
                handleResetRatesOnly={handleResetRatesOnly}
                handleLoadMarketRates={handleLoadMarketRates}
              />
            }
          />

          <Route path="/ml-prediction" element={<MLPrediction />} />

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;

