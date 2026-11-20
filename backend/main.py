"""SignAI inference backend. Mirrors the preprocessing in the original predict.py:
mirror frame -> MediaPipe hand box (+20px) -> crop from BGR frame -> resize 224 -> /255 -> ONNX.
The ONNX graph already ends in Softmax, so outputs are probabilities (no second softmax)."""
import asyncio, json
from pathlib import Path
import cv2, numpy as np, onnxruntime as ort, mediapipe as mp
from fastapi import FastAPI, File, HTTPException, UploadFile, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from mediapipe.tasks import python as mpp
from mediapipe.tasks.python import vision

MODELS = Path(__file__).parent / "models"
IMG_SIZE, PAD = (224, 224), 20

for f in ("sign_model.onnx", "hand_landmarker.task", "class_indices.json"):
    if not (MODELS / f).exists():
        raise SystemExit(f"Missing model file: {MODELS / f}")

idx2class = {v: k for k, v in json.loads((MODELS / "class_indices.json").read_text()).items()}
session = ort.InferenceSession(str(MODELS / "sign_model.onnx"), providers=["CPUExecutionProvider"])
INPUT = session.get_inputs()[0].name
if session.get_outputs()[0].shape[-1] != len(idx2class):
    raise SystemExit("Model output size does not match class_indices.json")
detector = vision.HandLandmarker.create_from_options(vision.HandLandmarkerOptions(
    base_options=mpp.BaseOptions(model_asset_path=str(MODELS / "hand_landmarker.task")),
    num_hands=1, min_hand_detection_confidence=0.5))
lock = asyncio.Lock()  # MediaPipe detector is not thread-safe

def infer(frame: np.ndarray) -> dict:
    frame = cv2.flip(frame, 1)  # same mirroring as predict.py; returned coords are in mirrored space
    h, w, _ = frame.shape
    rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    res = detector.detect(mp.Image(image_format=mp.ImageFormat.SRGB, data=rgb))
    if not res.hand_landmarks:
        return {"hand": False}
    lms = res.hand_landmarks[0]
    xs, ys = [l.x for l in lms], [l.y for l in lms]
    x0, x1 = max(0, int(min(xs) * w) - PAD), min(w, int(max(xs) * w) + PAD)
    y0, y1 = max(0, int(min(ys) * h) - PAD), min(h, int(max(ys) * h) + PAD)
    out = {"hand": True, "landmarks": [[l.x, l.y] for l in lms],
           "box": [x0 / w, y0 / h, x1 / w, y1 / h]}
    crop = frame[y0:y1, x0:x1]  # BGR crop, exactly as predict.py (not converted to RGB)
    if crop.size == 0:
        return {**out, "hand": False}
    x = np.expand_dims(cv2.resize(crop, IMG_SIZE).astype("float32") / 255.0, 0)
    p = session.run(None, {INPUT: x})[0][0]
    top = np.argsort(p)[::-1][:3]
    return {**out, "label": idx2class[int(top[0])], "confidence": float(p[top[0]]),
            "top": [{"label": idx2class[int(i)], "confidence": float(p[i])} for i in top]}

def decode(data: bytes) -> np.ndarray:
    img = cv2.imdecode(np.frombuffer(data, np.uint8), cv2.IMREAD_COLOR)
    if img is None:
        raise ValueError("Could not decode image")
    return img

app = FastAPI(title="SignAI")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

@app.get("/api/health")
def health():
    return {"status": "ok", "classes": [idx2class[i] for i in sorted(idx2class)],
            "input_shape": [1, 224, 224, 3]}

@app.post("/api/predict")
async def predict(file: UploadFile = File(...)):
    try:
        img = decode(await file.read())
    except ValueError as e:
        raise HTTPException(400, str(e))
    async with lock:
        return await asyncio.to_thread(infer, img)

@app.websocket("/ws/predict")
async def ws_predict(ws: WebSocket):
    await ws.accept()
    try:
        while True:
            data = await ws.receive_bytes()
            try:
                async with lock:
                    result = await asyncio.to_thread(infer, decode(data))
            except Exception as e:  # keep the stream alive on a bad frame
                result = {"error": str(e)}
            await ws.send_text(json.dumps(result))
    except WebSocketDisconnect:
        pass
