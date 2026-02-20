# AQ-Immune — Smart Air Pollution Intelligence Platform

This repository contains the AQ-Immune frontend (`frontend/web`) and an optional AI prediction service (`ai_service`). It's designed as a production-grade, scalable React + Vite application with Firebase integration and an AI LSTM prediction backend.

Quick start (frontend):

```bash
cd frontend/web
cp .env.example .env
# edit .env to add your Firebase project keys and API base
npm ci
npm run dev
```

Run AI service locally:

```bash
cd ai_service
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python train.py   # optional: trains LSTM and exports model
uvicorn app:app --host 0.0.0.0 --port 5000
```

Run both with Docker Compose:

```bash
docker-compose build
docker-compose up
```

CI / CD
- GitHub Actions CI builds the frontend and runs ai_service smoke checks.
- There's a Docker publishing workflow that can push images to Docker Hub (configure `DOCKERHUB_USERNAME` and `DOCKERHUB_TOKEN` secrets).

Next steps
- Add real historical sensor CSV to `ai_service/data.csv` and re-run `train.py` for production model.
- Configure Firebase project and add `VITE_FIREBASE_*` vars to `frontend/web/.env`.
- Optionally host frontend static build on CDN or static hosting; AI service can be deployed to any container host (Azure, AWS, GCP).
