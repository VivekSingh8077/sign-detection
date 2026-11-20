// Add new gestures here; the Library page and labels update automatically.
export interface GestureInfo { id: string; name: string; emoji: string; description: string }
export const GESTURES: GestureInfo[] = [
  { id: "dislike", name: "Dislike", emoji: "👎", description: "Thumb pointing down, other fingers curled." },
  { id: "fist", name: "Fist", emoji: "✊", description: "All fingers closed into a fist." },
  { id: "like", name: "Like", emoji: "👍", description: "Thumb pointing up, other fingers curled." },
  { id: "ok", name: "OK", emoji: "👌", description: "Thumb and index finger form a circle." },
  { id: "one", name: "One", emoji: "☝️", description: "Index finger raised, others closed." },
  { id: "palm", name: "Palm", emoji: "🖐️", description: "Open hand with fingers extended." },
  { id: "peace", name: "Peace", emoji: "✌️", description: "Index and middle fingers raised in a V." },
];
export const gestureName = (id: string) => GESTURES.find((g) => g.id === id)?.name ?? id;
