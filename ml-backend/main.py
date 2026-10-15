
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
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

def load_or_train_model():
    if MODEL_FILE.exists():
        try:
            return joblib.load(MODEL_FILE)
        except Exception as e:
            print(f"Warning: Failed to load {MODEL_FILE}: {e}")

    try:
        from train_model import main as run_train
        print("Training model on startup...")
        run_train()
        if MODEL_FILE.exists():
            return joblib.load(MODEL_FILE)
    except Exception as e:
        print(f"Warning: Could not train model on startup: {e}")

    return None

model = load_or_train_model()



class CostRequest(BaseModel):
    material_cost: float = Field(ge=0)
    labor_cost: float = Field(ge=0)
    profit_rate: float = Field(ge=0, le=100)
    discount_or_markup: float
    policy_reason: str = Field(min_length=1, max_length=500)


@app.get("/")
@app.get("/api")
def home():
    return {"message": "Smart Home Builder ML API is running"}


@app.post("/predict")
@app.post("/api/predict")
def predict_cost(request: CostRequest):
    try:
        input_data = pd.DataFrame([{
            "Material_Cost": request.material_cost,
            "Labor_Cost": request.labor_cost,
            "Profit_Rate": request.profit_rate,
            "Discount_or_Markup": request.discount_or_markup,
            "Policy_Reason": request.policy_reason,
        }])

        if model is not None:
            prediction = float(model.predict(input_data)[0])
        else:
            base_sum = request.material_cost + request.labor_cost
            prediction = float(base_sum * (1 + request.profit_rate / 100) + request.discount_or_markup)

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
