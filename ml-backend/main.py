
from pathlib import Path

import joblib
import pandas as pd

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

BASE_DIR = Path(__file__).resolve().parent
MODEL_FILE = BASE_DIR / "construction_model.joblib"

app = FastAPI(title="Smart Home Builder ML API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_methods=["*"],
    allow_headers=["*"],
)

model = joblib.load(MODEL_FILE)


class CostRequest(BaseModel):
    material_cost: float = Field(ge=0)
    labor_cost: float = Field(ge=0)
    profit_rate: float = Field(ge=0, le=100)
    discount_or_markup: float
    policy_reason: str = Field(min_length=1, max_length=500)


@app.get("/")
def home():
    return {"message": "Smart Home Builder ML API is running"}


@app.post("/predict")
def predict_cost(request: CostRequest):
    try:
        input_data = pd.DataFrame([{
            "Material_Cost": request.material_cost,
            "Labor_Cost": request.labor_cost,
            "Profit_Rate": request.profit_rate,
            "Discount_or_Markup": request.discount_or_markup,
            "Policy_Reason": request.policy_reason,
        }])

        prediction = float(model.predict(input_data)[0])

        return {
            "predicted_total": round(prediction, 2),
            "currency": "INR",
            "model_type": "experimental",
            "notice": (
                "Prediction based on the supplied construction-estimate "
                "dataset; not a verified real-world construction quote."
            ),
        }
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail="Prediction failed. Check the input values and model.",
        ) from exc
