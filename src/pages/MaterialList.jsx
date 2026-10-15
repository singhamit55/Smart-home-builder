import { useState } from "react";

export default function MaterialList({ estimate, rates, updateRate, searchQuery = "", onLoadMarketRates }) {
  // Toggle between core 8 materials (exact match to screenshot) and full list
  const [showAllItems, setShowAllItems] = useState(false);

  const formatCost = (value) =>
    Math.round(value || 0).toLocaleString("en-IN");

  const formatTotalMoney = (value) =>
    "₹ " + Math.round(value || 0).toLocaleString("en-IN");

  const coreKeys = [
    "cement",
    "sand",
    "stone",
    "bricks",
    "steel",
    "labour",
    "plaster",
    "flooring",
  ];

  const baseRows = showAllItems
    ? estimate.rows
    : estimate.rows.filter((row) => coreKeys.includes(row.key));

  const displayRows = searchQuery
    ? baseRows.filter((row) =>
        row.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : baseRows;

  return (
    <div className="material-list-page">
      {/* Informational Alert Box */}
      <div className="material-alert-box" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div className="alert-icon-circle">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" fill="#2563eb" />
              <line x1="12" y1="10.5" x2="12" y2="16.5" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" />
              <circle cx="12" cy="7.2" r="1.3" fill="#ffffff" />
            </svg>
          </div>
          <div className="alert-text">
            Enter local supplier prices for accurate estimates. All amounts are in Indian Rupees (₹).
            Rate changes update the construction estimate automatically.
          </div>
        </div>
        {onLoadMarketRates && (
          <button
            type="button"
            className="btn-blue-outline"
            style={{ padding: "6px 12px", fontSize: "11.5px" }}
            onClick={onLoadMarketRates}
            title="Auto-fill with standard Indian market rates"
          >
            Load Market Rates
          </button>
        )}
      </div>

      {/* Main Table Card */}
      <div className="material-table-card">
        <div className="material-table-wrap">
          <table className="material-list-table">
            <thead>
              <tr>
                <th className="th-material">Material / Work</th>
                <th className="th-quantity">Estimated Quantity</th>
                <th className="th-unit">Unit</th>
                <th className="th-rate">Rate (₹)</th>
                <th className="th-cost">Estimated Cost</th>
              </tr>
            </thead>
            <tbody>
              {displayRows.map((row) => (
                <tr key={row.key}>
                  <td className="cell-label">{row.label}</td>
                  <td className="cell-quantity">
                    {Math.round(row.quantity).toLocaleString("en-IN")}
                  </td>
                  <td className="cell-unit">{row.quantityUnit}</td>
                  <td className="cell-rate">
                    <input
                      className="material-rate-input"
                      type="number"
                      min="0"
                      placeholder="0"
                      value={rates[row.key] ?? ""}
                      onChange={(e) => updateRate(row.key, e.target.value)}
                    />
                  </td>
                  <td className="cell-cost">{formatCost(row.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* View toggle if additional items are available */}
        {estimate.rows.length > 8 && (
          <div className="material-card-footer-toggle">
            <button
              type="button"
              className="toggle-items-btn"
              onClick={() => setShowAllItems(!showAllItems)}
            >
              {showAllItems
                ? "Show Core Materials (8 Items)"
                : `Show Additional Works (+${estimate.rows.length - 8} Items: Painting, Doors, Electrical...)`}
            </button>
          </div>
        )}
      </div>

      {/* Bottom Summary Bar */}
      <div className="material-summary-bar">
        <span className="summary-bar-label">Estimated cost before extra allowance</span>
        <span className="summary-bar-amount">{formatTotalMoney(estimate.base)}</span>
      </div>
    </div>
  );
}
