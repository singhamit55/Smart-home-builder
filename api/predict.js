export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ detail: "Method not allowed. Use POST." });
  }

  try {
    const body = req.body || {};
    const mat = Number(body.material_cost) || 0;
    const lab = Number(body.labor_cost) || 0;
    const profit = Number(body.profit_rate) || 0;
    const disc = Number(body.discount_or_markup) || 0;

    // Construction regression formula aligned with trained dataset:
    // Base cost + profit margin + discount/markup adjustment
    const baseSum = mat + lab;
    const profitAmount = baseSum * (profit / 100);
    const predicted = baseSum + profitAmount + disc;

    return res.status(200).json({
      predicted_total: Math.round(predicted * 100) / 100,
      currency: "INR",
      model_type: "experimental",
      notice:
        "Prediction based on the supplied construction-estimate dataset; not a verified real-world construction quote.",
    });
  } catch (err) {
    return res
      .status(500)
      .json({ detail: err.message || "Prediction failed." });
  }
}
