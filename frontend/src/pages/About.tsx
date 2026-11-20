import { Card, Page } from "../components/Ui";
const sections: [string, string][] = [
  ["Overview", "SignAI classifies seven static hand gestures from a webcam and shows the result as text. It is a gesture classifier, not a sign-language sentence translator."],
  ["Pipeline", "Browser webcam → JPEG frames over WebSocket → FastAPI → MediaPipe Hand Landmarker finds one hand → hand box (+20px) is cropped and resized to 224×224 → ONNX classifier → class probabilities → stability and threshold buffer → text."],
  ["Model", "sign_model.onnx takes a 224×224×3 float image scaled to 0–1 and outputs softmax probabilities for 7 classes. Confidence is the model's own probability, not a guarantee of real-world accuracy."],
  ["Technologies", "React, TypeScript, Vite, Tailwind CSS, Lucide, FastAPI, ONNX Runtime, MediaPipe, OpenCV."],
  ["Extending", "Add new classes to the model and class_indices.json, then add an entry in src/gestures.ts. Word and sentence recognition would need a sequence model."],
];
export default function About() {
  return (<Page title="About SignAI"><div className="grid gap-4 md:grid-cols-2">{sections.map(([t, b]) =>
    <Card key={t}><h2 className="mb-2 font-medium">{t}</h2><p className="text-sm leading-relaxed text-slate-300">{b}</p></Card>)}</div></Page>);
}
