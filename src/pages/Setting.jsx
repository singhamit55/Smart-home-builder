export default function Setting({
  contingency,
  setContingency,
  rates,
  updateRate,
  handleResetAll,
  handleResetHouseOnly,
  handleResetRatesOnly,
  handleLoadMarketRates,
}) {
  const materialRateFields = [
    ["cement", "Cement (₹ / bag)"],
    ["sand", "Sand (₹ / cu ft)"],
    ["stone", "Stone chips (₹ / cu ft)"],
    ["bricks", "Bricks (₹ / piece)"],
    ["steel", "Steel rods (₹ / kg)"],
    ["labour", "Labour (₹ / sq ft)"],
    ["plaster", "Plastering (₹ / sq ft)"],
    ["flooring", "Flooring (₹ / sq ft)"],
    ["painting", "Painting (₹ / sq ft)"],
    ["doors", "Doors (₹ / door)"],
    ["windows", "Windows (₹ / window)"],
    ["electrical", "Electrical (₹ / sq ft)"],
    ["plumbing", "Plumbing (₹ / sq ft)"],
  ];

  return (
    <div className="settings-page">
      {/* Top 2-Column Row: Cost Estimate Settings & Currency Info */}
      <div className="settings-top-row">
        {/* Left: Cost Estimate Settings Card */}
        <section className="settings-card">
          <div className="settings-card-header">
            <div className="settings-icon-badge">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M3 9h18" />
                <path d="M9 21V9" />
              </svg>
            </div>
            <h2 className="settings-card-title">Cost Estimate Settings</h2>
          </div>

          <div className="settings-field-group">
            <label className="settings-input-group">
              <span className="settings-label">Extra allowance / contingency (%)</span>
              <input
                type="number"
                min="0"
                max="50"
                value={contingency}
                onChange={(e) =>
                  setContingency(Math.min(50, Math.max(0, Number(e.target.value))))
                }
              />
            </label>
            <p className="settings-hint">
              Covers an additional planning allowance. It is not a guarantee of actual cost.
            </p>
          </div>
        </section>

        {/* Right: Currency: Indian Rupee (INR) Notice Card */}
        <section className="settings-currency-notice">
          <div className="currency-notice-header">
            <div className="currency-info-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" fill="#2563eb" />
                <line x1="12" y1="10.5" x2="12" y2="16.5" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" />
                <circle cx="12" cy="7.2" r="1.3" fill="#ffffff" />
              </svg>
            </div>
            <strong className="currency-notice-title">Currency: Indian Rupee (INR)</strong>
          </div>
          <p className="currency-notice-desc">
            The app uses ₹ for all rates and cost reports. Update prices below to reflect your local supplier quotes.
          </p>
        </section>
      </div>

      {/* Middle Card: System Data & Reset Management */}
      <section className="settings-card settings-reset-card">
        <div className="settings-card-header">
          <div className="settings-icon-badge badge-amber">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18" />
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
            </svg>
          </div>
          <h2 className="settings-card-title">System Data & Reset Management</h2>
        </div>
        <p className="settings-reset-desc">
          Manage system state, remove all test values to start completely fresh, or load standard reference benchmarks.
        </p>

        <div className="settings-reset-actions-grid">
          {/* Action 1: Make System Fresh (All) */}
          <div className="reset-action-box">
            <div>
              <h4>Fresh Start (Wipe All Data)</h4>
              <p>Clears all plot dimensions, rooms, rates, and saved user plans to fresh blank values.</p>
            </div>
            <button
              type="button"
              className="btn-danger-reset"
              onClick={handleResetAll}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 6h18" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
              </svg>
              <span>Wipe & Make Fresh</span>
            </button>
          </div>

          {/* Action 2: Reset House Measurements Only */}
          <div className="reset-action-box">
            <div>
              <h4>Clear Measurements Only</h4>
              <p>Empties plot length, width, area, bedroom and bathroom inputs without changing rates.</p>
            </div>
            <button
              type="button"
              className="btn-amber-outline"
              onClick={handleResetHouseOnly}
            >
              <span>Clear Measurements</span>
            </button>
          </div>

          {/* Action 3: Load Standard Market Rates */}
          <div className="reset-action-box">
            <div>
              <h4>Load Standard Rates</h4>
              <p>Populate current Indian construction material and labor market rates into the system.</p>
            </div>
            <button
              type="button"
              className="btn-blue-outline"
              onClick={handleLoadMarketRates}
            >
              <span>Load Market Rates</span>
            </button>
          </div>

          {/* Action 4: Clear Rates to Blank */}
          <div className="reset-action-box">
            <div>
              <h4>Clear Rates to Blank</h4>
              <p>Set all material and labor rates to blank (₹ 0) to input your own supplier prices.</p>
            </div>
            <button
              type="button"
              className="btn-slate-outline"
              onClick={handleResetRatesOnly}
            >
              <span>Clear Rates</span>
            </button>
          </div>
        </div>
      </section>

      {/* Bottom: Default Material Rates Card */}
      <section className="settings-card settings-rates-card">
        <div className="settings-card-header">
          <div className="settings-icon-badge">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
          </div>
          <h2 className="settings-card-title">Default Material Rates</h2>
        </div>

        <div className="settings-rates-grid-4">
          {materialRateFields.map(([key, label]) => (
            <label className="rate-field-box" key={key}>
              <span className="rate-field-label">{label}</span>
              <input
                type="number"
                min="0"
                placeholder="0"
                value={rates[key] ?? ""}
                onChange={(e) => updateRate(key, e.target.value)}
              />
            </label>
          ))}
        </div>
      </section>
    </div>
  );
}

