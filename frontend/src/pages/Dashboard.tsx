import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Play } from "lucide-react";
import { Card, Dot, Page, Stat } from "../components/Ui";
import { GESTURES, gestureName } from "../gestures";
import { getHealth } from "../services/api";
import { useHistory } from "../services/history";
export default function Dashboard() {
  const [online, setOnline] = useState<boolean | null>(null);
  const history = useHistory();
  useEffect(() => { getHealth().then(() => setOnline(true)).catch(() => setOnline(false)); }, []);
  return (
    <Page title="SignAI" sub="Real-time hand-gesture recognition powered by MediaPipe and an ONNX classifier.">
      <Link to="/live" className="btn-primary w-fit"><Play size={16} /> Start Recognition</Link>
      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Supported gestures" value={GESTURES.length} />
        <Stat label="Backend status" value={<span className="flex items-center gap-2 text-lg"><Dot ok={!!online} />{online === null ? "Checking…" : online ? "Online" : "Offline"}</span>} />
        <Stat label="Recognitions logged" value={history.length} />
      </div>
      <Card><h2 className="mb-3 font-medium">Recent gestures</h2>
        {history.length === 0 ? <p className="text-sm text-slate-400">Nothing yet. Start a live session.</p> :
          <div className="flex flex-wrap gap-2">{history.slice(0, 8).map((h) => <span key={h.id} className="rounded-full bg-white/10 px-3 py-1 text-sm">{gestureName(h.label)} · {(h.confidence * 100).toFixed(0)}%</span>)}</div>}
      </Card>
      <div className="grid gap-4 sm:grid-cols-3">
        {[["/gestures", "Gesture Library"], ["/history", "Recognition History"], ["/about", "About the Project"]].map(([to, l]) =>
          <Link key={to} to={to} className="glass p-5 font-medium hover:bg-white/[0.08]">{l} →</Link>)}
      </div>
    </Page>);
}
