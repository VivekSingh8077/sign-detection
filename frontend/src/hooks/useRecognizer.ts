import { useCallback, useEffect, useRef, useState } from "react";
import { WS_URL } from "../services/api";
import { addHistory } from "../services/history";
import { gestureLabel } from "../gestures";
import type { Connection, InferenceResult, Settings } from "../types";

const SEND_INTERVAL = 120; // ms between frames sent to the backend
export function useRecognizer(settings: Settings) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timer = useRef<number>();
  const busy = useRef(false);
  const cfg = useRef(settings); cfg.current = settings;
  const streak = useRef({ label: "", n: 0 });
  const lastAccepted = useRef<string | null>(null);
  const [conn, setConn] = useState<Connection>("idle");
  const [cameraOn, setCameraOn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<InferenceResult | null>(null);
  const [text, setText] = useState<string[]>([]);

  const handle = useCallback((r: InferenceResult) => {
    setResult(r);
    if (!r.hand || !r.label || r.confidence === undefined) { streak.current = { label: "", n: 0 }; lastAccepted.current = null; return; }
    if (r.confidence < cfg.current.threshold) { streak.current = { label: "", n: 0 }; return; }
    streak.current = streak.current.label === r.label ? { label: r.label, n: streak.current.n + 1 } : { label: r.label, n: 1 };
    // Accept after N stable frames; the same gesture repeats only after the hand leaves or the gesture changes.
    if (streak.current.n >= cfg.current.stableFrames && lastAccepted.current !== r.label) {
      lastAccepted.current = r.label;
      setText((t) => [...t, gestureLabel(r.label!)]);
      addHistory(r.label, r.confidence);
    }
  }, []);

  const stop = useCallback(() => {
    window.clearInterval(timer.current);
    wsRef.current?.close(); wsRef.current = null;
    streamRef.current?.getTracks().forEach((t) => t.stop()); streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    busy.current = false; setCameraOn(false); setConn("idle"); setResult(null);
  }, []);

  const start = useCallback(async () => {
    setError(null); setConn("connecting");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 }, audio: false });
      streamRef.current = stream;
      const v = videoRef.current!; v.srcObject = stream; await v.play();
      setCameraOn(true);
    } catch (e) {
      setConn("error");
      setError(e instanceof DOMException && e.name === "NotAllowedError" ? "Camera permission denied. Allow camera access in your browser." : "Could not access a camera.");
      return;
    }
    const ws = new WebSocket(WS_URL); wsRef.current = ws;
    ws.onopen = () => {
      setConn("connected");
      const canvas = document.createElement("canvas");
      timer.current = window.setInterval(() => {
        const v = videoRef.current;
        if (busy.current || ws.readyState !== WebSocket.OPEN || !v || !v.videoWidth) return;
        canvas.width = v.videoWidth; canvas.height = v.videoHeight;
        canvas.getContext("2d")!.drawImage(v, 0, 0); // un-mirrored; backend mirrors like predict.py
        busy.current = true;
        canvas.toBlob((b) => (b ? ws.send(b) : (busy.current = false)), "image/jpeg", 0.8);
      }, SEND_INTERVAL);
    };
    ws.onmessage = (ev) => {
      busy.current = false;
      const r: InferenceResult = JSON.parse(ev.data);
      if (r.error) setError(r.error); else { setError(null); handle(r); }
    };
    ws.onerror = () => { setConn("error"); setError("Cannot reach the inference backend. Is it running on port 8000?"); };
    ws.onclose = () => { window.clearInterval(timer.current); setConn((c) => (c === "error" ? c : "idle")); };
  }, [handle]);

  useEffect(() => stop, [stop]);
  return { videoRef, conn, cameraOn, error, result, text, setText, start, stop };
}
