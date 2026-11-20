export interface Prediction { label: string; confidence: number }
export interface InferenceResult { hand: boolean; landmarks?: [number, number][]; box?: [number, number, number, number];
  label?: string; confidence?: number; top?: Prediction[]; error?: string }
export interface HistoryEntry { id: string; label: string; confidence: number; timestamp: number }
export type Connection = "idle" | "connecting" | "connected" | "error";
export interface Settings { threshold: number; stableFrames: number }
