from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Optional
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
from model import predict as model_predict

app = FastAPI(title="AQ-Immune AI Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class PredictRequest(BaseModel):
    deviceId: Optional[str]
    history: List[float]

class PredictResponse(BaseModel):
    deviceId: Optional[str]
    predictions6: List[float]
    predictions24: List[float]
    confidence: float


@app.post('/api/predict', response_model=PredictResponse)
async def predict(req: PredictRequest):
    # For production, replace naive_predict with a TF model loader and inference
    hist = np.array(req.history, dtype=float)
    if hist.size == 0:
        preds6 = [0.0]*6
        preds24 = [0.0]*24
        conf = 0.0
    else:
        preds6 = model_predict(hist.tolist(), steps=6)
        preds24 = model_predict(hist.tolist(), steps=24)
        # confidence heuristic: more history -> higher confidence
        conf = min(0.99, 0.3 + min(1.0, hist.size / 200.0))

    return PredictResponse(deviceId=req.deviceId, predictions6=[float(x) for x in preds6], predictions24=[float(x) for x in preds24], confidence=float(conf))
