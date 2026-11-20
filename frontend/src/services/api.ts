const HOST = import.meta.env.VITE_API_HOST ?? "localhost:8000";
export const API_URL = `http://${HOST}`;
export const WS_URL = `ws://${HOST}/ws/predict`;
export async function getHealth(): Promise<{ classes: string[] }> {
  const r = await fetch(`${API_URL}/api/health`);
  if (!r.ok) throw new Error("Backend unavailable");
  return r.json();
}
