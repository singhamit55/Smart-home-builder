
import json
from pathlib import Path

import joblib
import numpy as np
import pandas as pd

from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.linear_model import Ridge
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score


BASE_DIR = Path(__file__).resolve().parent
CSV_FILE = BASE_DIR / "construction_estimates.csv"
MODEL_FILE = BASE_DIR / "construction_model.joblib"
METADATA_FILE = BASE_DIR / "model_metadata.json"

NUM_FEATURES = [
    "Material_Cost",
    "Labor_Cost",
    "Profit_Rate",
    "Discount_or_Markup",
]
CAT_FEATURES = ["Policy_Reason"]
TARGET = "Total_Estimate"


def main():
    if not CSV_FILE.exists():
        raise FileNotFoundError(
            f"Dataset not found: {CSV_FILE}\n"
            "Put construction_estimates.csv in the ml-backend folder."
        )

    df = pd.read_csv(CSV_FILE)

    required = NUM_FEATURES + CAT_FEATURES + [TARGET]
    missing = [col for col in required if col not in df.columns]

    if missing:
        raise ValueError(
            f"Missing columns: {missing}\n"
            f"Available columns: {df.columns.tolist()}"
        )

    df = df[required].copy()

    for col in NUM_FEATURES + [TARGET]:
        df[col] = pd.to_numeric(df[col], errors="coerce")

    df = df.dropna(subset=required)

    if len(df) < 20:
        raise ValueError(
            f"Only {len(df)} valid records found. "
            "At least 20 are required for this demo."
        )

    X = df[NUM_FEATURES + CAT_FEATURES]
    y = df[TARGET]

    print(f"Loaded {len(df)} valid records.")
    print("\nDataset preview:")
    print(df.head())

    preprocessor = ColumnTransformer(
        transformers=[
            ("numeric", StandardScaler(), NUM_FEATURES),
            (
                "category",
                OneHotEncoder(handle_unknown="ignore"),
                CAT_FEATURES,
            ),
        ]
    )

    model = Pipeline(
        steps=[
            ("preprocessor", preprocessor),
            ("regressor", Ridge(alpha=1.0)),
        ]
    )

    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=0.20,
        random_state=42,
    )

    print(f"\nTraining rows: {len(X_train)}")
    print(f"Testing rows: {len(X_test)}")

    model.fit(X_train, y_train)
    predictions = model.predict(X_test)

    mae = mean_absolute_error(y_test, predictions)
    rmse = np.sqrt(mean_squared_error(y_test, predictions))
    r2 = r2_score(y_test, predictions)

    print("\n--- MODEL EVALUATION ---")
    print(f"R-squared: {r2:.4f}")
    print(f"Mean absolute error: {mae:,.2f}")
    print(f"Root mean squared error: {rmse:,.2f}")

    # Save a final model trained on all available records.
    model.fit(X, y)
    joblib.dump(model, MODEL_FILE)

    metadata = {
        "records_trained": int(len(df)),
        "r2_score": float(r2),
        "mae": float(mae),
        "rmse": float(rmse),
        "features": NUM_FEATURES + CAT_FEATURES,
        "target": TARGET,
        "dataset_type": "Verify whether records are synthetic or real.",
    }

    METADATA_FILE.write_text(json.dumps(metadata, indent=2))

    print(f"\nModel saved: {MODEL_FILE}")
    print(f"Metadata saved: {METADATA_FILE}")
    print("\nTraining complete.")


if __name__ == "__main__":
    main()
