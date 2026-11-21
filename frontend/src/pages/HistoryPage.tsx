import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Card, Page } from "../components/Ui";
import { GESTURES, gestureLabel } from "../gestures";
import { clearHistory, useHistory } from "../services/history";
export default function HistoryPage() {
  const history = useHistory(); const [q, setQ] = useState(""); const [f, setF] = useState("all");
  const rows = history.filter((h) => (f === "all" || h.label === f) && gestureLabel(h.label).toLowerCase().includes(q.toLowerCase()));
  return (<Page title="Recognition History" sub="Stored locally in your browser.">
    <Card><div className="mb-4 flex flex-wrap gap-3">
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search…" className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm outline-none focus:border-brand" />
      <select value={f} onChange={(e) => setF(e.target.value)} className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm">
        <option value="all">All gestures</option>{GESTURES.map((g) => <option key={g.id} value={g.id}>{g.emoji} {g.description}</option>)}</select>
      <button className="btn-ghost ml-auto" onClick={clearHistory} disabled={!history.length}><Trash2 size={14} />Clear history</button></div>
      {rows.length === 0 ? <p className="text-sm text-slate-400">No entries.</p> : <div className="overflow-x-auto"><table className="w-full text-left text-sm">
        <thead className="text-slate-400"><tr><th className="py-2">Time</th><th>Gesture</th><th>Confidence</th></tr></thead>
        <tbody>{rows.map((h) => <tr key={h.id} className="border-t border-white/5"><td className="py-2">{new Date(h.timestamp).toLocaleString()}</td><td>{gestureLabel(h.label)}</td><td>{(h.confidence * 100).toFixed(1)}%</td></tr>)}</tbody></table></div>}
    </Card></Page>);
}
