import { Page, Card } from "../components/Ui";
import { GESTURES } from "../gestures";
export default function Gestures() {
  return (<Page title="Gesture Library" sub="Gestures the current model can classify.">
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{GESTURES.map((g) => (
      <Card key={g.id} className="hover:-translate-y-0.5"><div className="text-5xl">{g.emoji}</div><h3 className="mt-3 text-lg font-medium">{g.name}</h3>
        <p className="mt-1 text-sm text-slate-400">{g.description}</p><span className="mt-3 inline-block rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs text-emerald-300">Supported</span></Card>))}</div>
  </Page>);
}
