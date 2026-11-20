# SignAI

Real-time hand-gesture recognition: React + TypeScript frontend, FastAPI backend (MediaPipe + ONNX Runtime).
Recognizes 7 static gestures: dislike, fist, like, ok, one, palm, peace. It is **not** sentence-level sign-language translation.

## Run (two terminals)
**Windows (single command)**
```powershell
start.bat
```
This creates a Python virtual environment, installs dependencies, and starts the backend and frontend in separate terminals.

**Backend** (Python 3.10-3.12; Python 3.12 is recommended)
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --port 8000
```
**Frontend** (Node 18+)
```bash
cd frontend
npm install
npm run dev        # http://localhost:5173
```
Set `VITE_API_HOST` (default `localhost:8000`) if the backend runs elsewhere. Use Chrome/Edge on localhost so camera access is allowed.

## How inference matches your original `predict.py`
Frame is mirrored -> MediaPipe Hand Landmarker (1 hand, 0.5 confidence) -> box +20px -> crop from the **BGR** frame -> resize 224x224 -> /255 -> ONNX.
The ONNX graph already ends in Softmax, so outputs are used as probabilities directly.

## Notes
- Models live in `backend/models/` (copies of your files; originals untouched).
- Add a gesture: retrain/export the model, update `class_indices.json`, add an entry in `frontend/src/gestures.ts`.
- Tune the confidence threshold and stability frames on the Live page.
