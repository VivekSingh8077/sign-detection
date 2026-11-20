import { useSyncExternalStore } from "react";
import type { HistoryEntry } from "../types";
const KEY = "signai-history";
const read = (): HistoryEntry[] => { try { return JSON.parse(localStorage.getItem(KEY) ?? "[]"); } catch { return []; } };
let cache = read();
const subs = new Set<() => void>();
const set = (v: HistoryEntry[]) => { cache = v; try { localStorage.setItem(KEY, JSON.stringify(v)); } catch { /* storage unavailable */ } subs.forEach((f) => f()); };
export const addHistory = (label: string, confidence: number) =>
  set([{ id: crypto.randomUUID(), label, confidence, timestamp: Date.now() }, ...cache].slice(0, 500));
export const clearHistory = () => set([]);
export const useHistory = () => useSyncExternalStore((f) => { subs.add(f); return () => subs.delete(f); }, () => cache);
