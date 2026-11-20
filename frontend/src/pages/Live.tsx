import { useEffect, useRef, useState } from "react";
import { Camera, CameraOff, Copy, Trash2, Volume2 } from "lucide-react";
import { Card, Dot, Page } from "../components/Ui";
import { useRecognizer } from "../hooks/useRecognizer";
import { gestureName } from "../gestures";
import type { Settings } from "../types";
const CONNECTIONS = [[0,1],[1,2],[2,3],[3,4],[0,5],[5,6],[6,7],[7,8],[5,9],[9,10],[10,11],[11,12],[9,13],[13,14],[14,15],[15,16],[13,17],[17,18],[18,19],[19,20],[0,17]];
export default function Live() {
  const [settings, setSettings] = useState<Settings>({ threshold: 0.7, stableFrames: 4 });
  const { videoRef, conn, cameraOn, error, result, text, setText, start, stop } = useRecognizer(settings);
  const canvas = useRef<HTMLCanvasElement>(null);
  const hand = !!result?.hand;
  useEffect(() => { // overlay is drawn in the mirrored coordinate space returned by the backend; video is CSS-mirrored to match
    const c = canvas.current; if (!c) return;
    const ctx = c.getContext("2d")!; c.width = 640; c.height = 480; ctx.clearRect(0, 0, 640, 480);
    if (!result?.hand || !result.landmarks || !result.box) return;
    const [x0, y0, x1, y1] = result.box;
    ctx.strokeStyle = "#7c5cff"; ctx.lineWidth = 2; ctx.strokeRect(x0 * 640, y0 * 480, (x1 - x0) * 640, (y1 - y0) * 480);
    ctx.strokeStyle = "#38bdf8"; ctx.beginPath();
    CONNECTIONS.forEach(([a, b]) => { ctx.moveTo(result.landmarks![a][0] * 640, result.landmarks![a][1] * 480); ctx.lineTo(result.landmarks![b][0] * 640, result.landmarks![b][1] * 480); });
    ctx.stroke(); ctx.fillStyle = "#fff";
    result.landmarks.forEach(([x, y]) => { ctx.beginPath(); ctx.arc(x * 640, y * 480, 3, 0, 7); ctx.fill(); });
  }, [result]);
  const joined = text.join(" ");
  const status = conn === "connecting" ? "Connecting…" : conn === "error" ? "Error" : !cameraOn ? "Camera off" : !hand ? "No hand detected" : (result?.confidence ?? 0) < settings.threshold ? "Low confidence" : "Recognizing";
  return (
    <Page title="Live Recognition" sub="Single-hand static gestures. This is not sentence-level sign language translation.">
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-black/50">
            <video ref={videoRef} muted playsInline className="h-full w-full -scale-x-100 object-cover" />
            <canvas ref={canvas} className="absolute inset-0 h-full w-full" />
            {!cameraOn && <div className="absolute inset-0 grid place-items-center text-slate-400">Camera is off</div>}
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button className="btn-primary" onClick={start} disabled={cameraOn || conn === "connecting"}><Camera size={16} />Start Camera</button>
            <button className="btn-ghost" onClick={stop} disabled={!cameraOn}><CameraOff size={16} />Stop Camera</button>
            <span className="flex items-center gap-2 text-sm"><Dot ok={cameraOn} />Camera</span>
            <span className="flex items-center gap-2 text-sm"><Dot ok={conn === "connected"} />Backend</span>
            <span className="flex items-center gap-2 text-sm"><Dot ok={hand} />Hand</span>
          </div>
          {error && <p role="alert" className="mt-3 rounded-lg bg-red-500/10 p-3 text-sm text-red-300">{error}</p>}
        </Card>
        <div className="space-y-6">
          <Card>
            <div className="text-sm text-slate-400">Current gesture</div>
            <div className="mt-1 text-3xl font-semibold">{hand && result?.label ? gestureName(result.label) : "—"}</div>
            <div className="mt-1 text-sm text-slate-400">Model confidence: {hand && result?.confidence !== undefined ? `${(result.confidence * 100).toFixed(1)}%` : "—"}</div>
            <div className="mt-1 text-sm">Status: {status}</div>
            <div className="mt-4 space-y-2">{result?.top?.map((p) => (
              <div key={p.label}><div className="flex justify-between text-xs"><span>{gestureName(p.label)}</span><span>{(p.confidence * 100).toFixed(0)}%</span></div>
                <div className="h-1.5 rounded bg-white/10"><div className="h-full rounded bg-gradient-to-r from-brand to-brand-blue" style={{ width: `${p.confidence * 100}%` }} /></div></div>))}</div>
          </Card>
          <Card className="space-y-3 text-sm">
            <label className="block">Confidence threshold: {Math.round(settings.threshold * 100)}%
              <input type="range" min={0.3} max={0.99} step={0.01} value={settings.threshold} className="w-full accent-brand" onChange={(e) => setSettings({ ...settings, threshold: +e.target.value })} /></label>
            <label className="block">Stable frames required: {settings.stableFrames}
              <input type="range" min={1} max={12} value={settings.stableFrames} className="w-full accent-brand" onChange={(e) => setSettings({ ...settings, stableFrames: +e.target.value })} /></label>
          </Card>
        </div>
      </div>
      <Card>
        <div className="mb-2 flex items-center justify-between"><h2 className="font-medium">Recognized text</h2>
          <div className="flex gap-2">
            <button className="btn-ghost" onClick={() => navigator.clipboard?.writeText(joined)} disabled={!joined}><Copy size={14} />Copy</button>
            <button className="btn-ghost" onClick={() => speechSynthesis.speak(new SpeechSynthesisUtterance(joined))} disabled={!joined}><Volume2 size={14} />Speak</button>
            <button className="btn-ghost" onClick={() => setText([])} disabled={!joined}><Trash2 size={14} />Clear</button></div></div>
        <p className="min-h-[3rem] rounded-xl bg-black/30 p-3">{joined || <span className="text-slate-500">Recognized gestures appear here once stable and above the threshold.</span>}</p>
      </Card>
    </Page>);
}
