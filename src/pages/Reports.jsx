import heroImg from "../image/image.png";

export default function Reports({ house, estimate, rates }) {
  const formatMoney = (value) =>
    "₹ " + Math.round(value || 0).toLocaleString("en-IN");

  const builtUpArea = (Number(house?.area) || 0) * (Number(house?.floors) || (house?.area ? 1 : 0));
  const totalCost = estimate?.total || 0;
  const avgCostPerSqFt = builtUpArea > 0 ? Math.round(totalCost / builtUpArea) : 0;

  return (
    <div className="reports-page">
      {/* 1. Hero Banner */}
      <section className="reports-hero-banner">
        <div className="reports-hero-content">
          <span className="reports-badge-capsule">SMART HOME BUILDER</span>
          <h1 className="reports-hero-title">House Construction Estimate</h1>
          <p className="reports-hero-subtitle">
            Preliminary project report · Currency: INR
          </p>
        </div>
        <div className="reports-hero-image-wrap">
          <img src={heroImg} alt="Modern Villa 3D" className="reports-hero-image" />
        </div>
      </section>

      {/* 2. Top 3 KPI Summary Cards */}
      <section className="reports-kpi-grid">
        {/* Card 1: Total Estimated Cost */}
        <div className="reports-kpi-card">
          <div className="reports-kpi-icon icon-purple">
            <span className="kpi-rupee-symbol">₹</span>
          </div>
          <div className="reports-kpi-info">
            <span className="reports-kpi-label">Total Estimated Cost</span>
            <strong className="reports-kpi-value">{formatMoney(totalCost)}</strong>
          </div>
        </div>

        {/* Card 2: Total Built-up Area */}
        <div className="reports-kpi-card">
          <div className="reports-kpi-icon icon-blue">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
          <div className="reports-kpi-info">
            <span className="reports-kpi-label">Total Built-up Area</span>
            <strong className="reports-kpi-value">{builtUpArea > 0 ? `${builtUpArea.toLocaleString("en-IN")} sq ft` : "0 sq ft"}</strong>
          </div>
        </div>

        {/* Card 3: Average Cost / Sq Ft */}
        <div className="reports-kpi-card">
          <div className="reports-kpi-icon icon-orange">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="20" x2="18" y2="10" />
              <line x1="12" y1="20" x2="12" y2="4" />
              <line x1="6" y1="20" x2="6" y2="14" />
            </svg>
          </div>
          <div className="reports-kpi-info">
            <span className="reports-kpi-label">Average Cost / Sq Ft</span>
            <strong className="reports-kpi-value">₹ {avgCostPerSqFt.toLocaleString("en-IN")}</strong>
          </div>
        </div>
      </section>

      {/* 3. Project Specifications Card */}
      <section className="reports-card reports-specs-card">
        <div className="specs-card-header">
          <div className="specs-icon-box">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M9 3v18" />
              <path d="M14 9h4" />
              <path d="M14 15h4" />
            </svg>
          </div>
          <h2 className="specs-card-title">Project Specifications</h2>
        </div>

        <div className="specs-grid-2col">
          <div className="specs-column">
            <div className="spec-row">
              <span className="spec-label">Plot dimensions</span>
              <span className="spec-value">{house?.length && house?.width ? `${house.length} × ${house.width} ft` : "Not specified"}</span>
            </div>
            <div className="spec-row">
              <span className="spec-label">Built-up area per floor</span>
              <span className="spec-value">{house?.area ? `${Number(house.area).toLocaleString("en-IN")} sq ft` : "Not specified"}</span>
            </div>
            <div className="spec-row">
              <span className="spec-label">Number of floors</span>
              <span className="spec-value">{house?.floors ? `${house.floors} floor(s)` : "Not specified"}</span>
            </div>
            <div className="spec-row">
              <span className="spec-label">Bedrooms / bathrooms</span>
              <span className="spec-value">{house?.bedrooms ? `${house.bedrooms} Beds` : "Not specified"} / {house?.bathrooms ? `${house.bathrooms} Baths` : "Not specified"}</span>
            </div>
            <div className="spec-row">
              <span className="spec-label">Outer wall thickness</span>
              <span className="spec-value">{house?.outerWall ? `${house.outerWall} inches` : "Not specified"}</span>
            </div>
          </div>

          <div className="specs-column">
            <div className="spec-row">
              <span className="spec-label">Inner wall thickness</span>
              <span className="spec-value">{house?.innerWall ? `${house.innerWall} inches` : "Not specified"}</span>
            </div>
            <div className="spec-row">
              <span className="spec-label">Design style</span>
              <span className="spec-value">{house?.style || "Modern"}</span>
            </div>
            <div className="spec-row">
              <span className="spec-label">Finish quality</span>
              <span className="spec-value">{house?.quality || "Standard"}</span>
            </div>
            <div className="spec-row">
              <span className="spec-label">Car parking</span>
              <span className="spec-value">{house?.parking ? "Included" : "Not included"}</span>
            </div>
            <div className="spec-row">
              <span className="spec-label">Budget</span>
              <span className="spec-value">{house?.budget ? `₹ ${Number(house.budget).toLocaleString("en-IN")}` : "Not specified"}</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Cost Breakdown & Itemized Work */}
      <section className="reports-card reports-breakdown-card">
        <div className="specs-card-header">
          <div className="specs-icon-box bg-blue">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
          </div>
          <h2 className="specs-card-title">Cost Breakdown & Itemized Work</h2>
        </div>

        <div className="report-table-wrap">
          <table className="material-list-table">
            <thead>
              <tr>
                <th style={{ width: "26%", textAlign: "left" }}>Item / Work</th>
                <th style={{ width: "20%", textAlign: "left" }}>Estimated Quantity</th>
                <th style={{ width: "16%", textAlign: "left" }}>Unit</th>
                <th style={{ width: "18%", textAlign: "left" }}>Rate (₹)</th>
                <th style={{ width: "20%", textAlign: "right" }}>Total (₹)</th>
              </tr>
            </thead>
            <tbody>
              {estimate.rows.map((row) => (
                <tr key={row.key}>
                  <td className="cell-label">{row.label}</td>
                  <td className="cell-quantity">{Math.round(row.quantity).toLocaleString("en-IN")}</td>
                  <td className="cell-unit">{row.quantityUnit}</td>
                  <td>₹ {Math.round(rates[row.key] || 0).toLocaleString("en-IN")}</td>
                  <td className="cell-cost">{Math.round(row.total || 0).toLocaleString("en-IN")}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="tfoot-subtotal">
                <td colSpan="4">Base Material & Labour Estimate</td>
                <td style={{ textAlign: "right", fontWeight: 700 }}>
                  ₹ {Math.round(estimate.base || 0).toLocaleString("en-IN")}
                </td>
              </tr>
              <tr className="tfoot-contingency">
                <td colSpan="4">Contingency & Unforeseen Allowance ({estimate.extra ? Math.round((estimate.extra / Math.max(1, estimate.base)) * 100) : 5}%)</td>
                <td style={{ textAlign: "right" }}>
                  ₹ {Math.round(estimate.extra || 0).toLocaleString("en-IN")}
                </td>
              </tr>
              <tr className="tfoot-grand">
                <td colSpan="4">Total Estimated Construction Cost</td>
                <td style={{ textAlign: "right", fontWeight: 800, color: "#1e40af" }}>
                  ₹ {Math.round(estimate.total || 0).toLocaleString("en-IN")}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </section>

      {/* 5. Report Limitation Note */}
      <div className="report-limitations-notice">
        <strong>Report Limitations & Scope</strong>
        <p>
          This report uses preliminary quantity assumptions and user-entered unit rates. It is designed for preliminary budgeting and feasibility, not as an engineering tender document or signed contract. Verify with registered structural engineers and local authorities before commencement.
        </p>
      </div>
    </div>
  );
}
