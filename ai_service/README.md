# AQ-Immune AI Prediction Service

This small FastAPI service exposes a `/api/predict` endpoint used by the web frontend.

Features:
- Accepts JSON payload with `deviceId` and `history` (array of recent PM2.5 values)
- Returns `predictions` for next 6 and 24 hours plus confidence score
- If a TensorFlow/Keras model is provided in `models/`, it will be used; otherwise a fallback predictor is used for demo purposes

Run locally:

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app:app --host 0.0.0.0 --port 5000
```

Docker:

```bash
docker build -t aq-immune-ai:latest .
docker run -p 5000:5000 aq-immune-ai:latest
```
