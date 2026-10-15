
import { useState } from "react";

export default function MLPrediction() {
    const [form, setForm] = useState({
        material_cost: 45000,
        labor_cost: 15000,
        profit_rate: 15,
        discount_or_markup: 2500,
        policy_reason:
            "Market conditions require competitive pricing for this project.",
    });

    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    function updateField(event) {
        const { name, value } = event.target;
        setForm((previous) => ({ ...previous, [name]: value }));
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setLoading(true);
        setError("");
        setResult(null);

        const apiUrl = import.meta.env.VITE_API_URL
            ? `${import.meta.env.VITE_API_URL.replace(/\/+$/, "")}/predict`
            : (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
                ? "http://127.0.0.1:8000/predict"
                : "/api/predict";

        try {
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...form,
                    material_cost: Number(form.material_cost),
                    labor_cost: Number(form.labor_cost),
                    profit_rate: Number(form.profit_rate),
                    discount_or_markup: Number(form.discount_or_markup),
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || "Prediction failed.");
            }

            setResult(data);
        } catch (err) {
            setError(
                err.message ||
                "Cannot connect to the ML API. Check that the Python server is running."
            );
        } finally {
            setLoading(false);
        }
    }

    const money = (amount) =>
        new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 2,
        }).format(amount);

    return (
        <div className="page-content">
            <div className="page-heading">
                <div>
                    <p className="eyebrow">MACHINE LEARNING</p>
                    <h1>ML Cost Prediction</h1>
                    <p>
                        Predict a construction estimate using your trained regression
                        model.
                    </p>
                </div>
            </div>

            <div className="content-grid">
                <section className="card">
                    <h2>Project cost inputs</h2>
                    <p className="muted">
                        Enter the estimate components used by the trained model.
                    </p>

                    <form onSubmit={handleSubmit}>
                        <div className="form-grid">
                            <label className="form-field">
                                Material cost (₹)
                                <input
                                    name="material_cost"
                                    type="number"
                                    min="0"
                                    required
                                    value={form.material_cost}
                                    onChange={updateField}
                                />
                            </label>

                            <label className="form-field">
                                Labour cost (₹)
                                <input
                                    name="labor_cost"
                                    type="number"
                                    min="0"
                                    required
                                    value={form.labor_cost}
                                    onChange={updateField}
                                />
                            </label>

                            <label className="form-field">
                                Profit rate (%)
                                <input
                                    name="profit_rate"
                                    type="number"
                                    min="0"
                                    max="100"
                                    step="0.1"
                                    required
                                    value={form.profit_rate}
                                    onChange={updateField}
                                />
                            </label>

                            <label className="form-field">
                                Discount / markup (₹)
                                <input
                                    name="discount_or_markup"
                                    type="number"
                                    required
                                    value={form.discount_or_markup}
                                    onChange={updateField}
                                />
                            </label>
                        </div>

                        <label className="form-field">
                            Pricing reason
                            <textarea
                                name="policy_reason"
                                rows="3"
                                maxLength="500"
                                required
                                value={form.policy_reason}
                                onChange={updateField}
                            />
                        </label>

                        <button
                            className="button button-primary"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? "Predicting..." : "Predict construction estimate"}
                        </button>
                    </form>
                </section>

                <section className="card">
                    <h2>Prediction result</h2>

                    {!result && !error && (
                        <div className="empty-state">
                            <span className="result-icon">₹</span>
                            <h3>Your estimate will appear here</h3>
                            <p>Enter the values and run the prediction.</p>
                        </div>
                    )}

                    {loading && <p>Running the ML model...</p>}

                    {error && <p className="error-message">{error}</p>}

                    {result && (
                        <div className="prediction-result">
                            <p className="muted">Predicted total</p>
                            <h2>{money(result.predicted_total)}</h2>
                            <p>
                                Model type: {result.model_type || "experimental"}
                            </p>
                            <p className="muted">
                                {result.notice}
                            </p>
                        </div>
                    )}
                </section>
            </div>

            <p className="muted">
                This model predicts estimates from cost components. It does not yet
                predict actual house construction costs from floor area or room layout.
                Treat results as experimental until validated on real projects.
            </p>
        </div>
    );
}
