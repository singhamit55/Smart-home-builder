import { Link } from "react-router-dom";
import houseImage from "../image/image.png";

export default function Dashboard({ house, estimate }) {
  const totalArea = (Number(house?.area) || 0) * (Number(house?.floors) || (house?.area ? 1 : 0));
  const totalCost = Math.round(estimate?.total || 0);
  const costPerSqFt = estimate?.area > 0 ? Math.round(estimate.total / estimate.area) : 0;
  const userBudget = Number(house?.budget) || 0;
  const hasBudget = userBudget > 0;
  const isWithinBudget = hasBudget ? totalCost <= userBudget : true;
  const budgetDiff = hasBudget ? Math.abs(userBudget - totalCost) : 0;

  return (
    <div className="dashboard-page">
      {/* Hero Banner */}
      <section className="hero-banner">
        <div className="hero-content">
          <span className="hero-badge">PLAN SMARTER. BUILD BETTER.</span>
          <h1 className="hero-title">Smart Home Builder</h1>
          <p className="hero-desc">
            Design your home, calculate material quantities, estimate costs, and
            plan your dream house — all in one place.
          </p>
        </div>
        <div className="hero-image-wrap">
          <img
            src={houseImage}
            alt="Modern luxury house"
            className="hero-house-img"
          />
        </div>
      </section>

      {/* 4 Metrics / Stats Cards */}
      <section className="stats-row">
        {/* Metric 1 */}
        <div className="metric-card">
          <div className="metric-header">
            <div className="metric-icon icon-blue">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 21h18" />
                <path d="M5 21V7l8-4 8 4v14" />
                <path d="M9 10a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v11" />
              </svg>
            </div>
            <span className="metric-label">Total Built-up Area</span>
          </div>
          <div className="metric-value">
            {totalArea > 0 ? `${totalArea.toLocaleString("en-IN")} sq ft` : "0 sq ft"}
          </div>
          <div className="metric-subtext">
            {house?.floors ? `${house.floors} floor(s)` : "Floors not specified"}
          </div>
        </div>

        {/* Metric 2 */}
        <div className="metric-card">
          <div className="metric-header">
            <div className="metric-icon icon-green">
              <span className="rupee-symbol">₹</span>
            </div>
            <span className="metric-label">Estimated Cost</span>
          </div>
          <div className="metric-value">
            ₹ {totalCost.toLocaleString("en-IN")}
          </div>
          <div className="metric-subtext">
            {totalCost > 0 ? "Based on current rates" : "Enter house details to estimate"}
          </div>
        </div>

        {/* Metric 3 */}
        <div className="metric-card">
          <div className="metric-header">
            <div className="metric-icon icon-orange">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 20V10" />
                <path d="M12 20V4" />
                <path d="M6 20v-6" />
              </svg>
            </div>
            <span className="metric-label">Cost per Sq Ft</span>
          </div>
          <div className="metric-value">
            ₹ {costPerSqFt.toLocaleString("en-IN")}
          </div>
          <div className="metric-subtext">
            {costPerSqFt > 0 ? "Estimated average" : "Awaiting area & specs"}
          </div>
        </div>

        {/* Metric 4 */}
        <div className="metric-card">
          <div className="metric-header">
            <div className="metric-icon icon-emerald">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </div>
            <span className="metric-label">Budget Status</span>
          </div>
          <div className={`metric-value ${!hasBudget ? "val-neutral" : isWithinBudget ? "val-success" : "val-danger"}`}>
            {!hasBudget ? "Budget Not Set" : isWithinBudget ? "Within budget" : "Over budget"}
          </div>
          <div className="metric-subtext">
            {hasBudget
              ? `₹ ${budgetDiff.toLocaleString("en-IN")} ${isWithinBudget ? "remaining" : "over"}`
              : "Set budget in design/calculator"}
          </div>
        </div>
      </section>

      {/* Quick Access Section */}
      <section className="quick-access-section">
        <h2 className="section-title">Quick Access</h2>

        <div className="quick-access-grid">
          {/* Card 1: Home Design */}
          <Link to="/design" className="qa-card">
            <div className="qa-icon-box qa-blue">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" x2="8" y1="13" y2="13" />
                <line x1="16" x2="8" y1="17" y2="17" />
              </svg>
            </div>
            <div className="qa-info">
              <h3 className="qa-title">Home Design</h3>
              <p className="qa-desc">Configure rooms, floors and dimensions</p>
            </div>
          </Link>

          {/* Card 2: Cost Calculator */}
          <Link to="/calculator" className="qa-card">
            <div className="qa-icon-box qa-green">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="4" y="2" width="16" height="20" rx="2" />
                <line x1="8" x2="16" y1="6" y2="6" />
                <circle cx="8.5" cy="11.5" r="1" fill="white" />
                <circle cx="15.5" cy="11.5" r="1" fill="white" />
                <circle cx="8.5" cy="16.5" r="1" fill="white" />
                <circle cx="15.5" cy="16.5" r="1" fill="white" />
              </svg>
            </div>
            <div className="qa-info">
              <h3 className="qa-title">Cost Calculator</h3>
              <p className="qa-desc">Review construction costs and budget</p>
            </div>
          </Link>

          {/* Card 3: Material List */}
          <Link to="/materials" className="qa-card">
            <div className="qa-icon-box qa-orange">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
                <path d="m3.3 7 8.7 5 8.7-5" />
                <path d="M12 22V12" />
              </svg>
            </div>
            <div className="qa-info">
              <h3 className="qa-title">Material List</h3>
              <p className="qa-desc">Edit material prices and quantities</p>
            </div>
          </Link>

          {/* Card 4: Reports */}
          <Link to="/reports" className="qa-card">
            <div className="qa-icon-box qa-purple">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <path d="M12 18v-6" />
                <path d="m9 15 3 3 3-3" />
              </svg>
            </div>
            <div className="qa-info">
              <h3 className="qa-title">Reports</h3>
              <p className="qa-desc">View and print your project estimate</p>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}
