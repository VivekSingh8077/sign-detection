// Add new gestures here; the Library page and labels update automatically.
export interface GestureInfo { id: string; emoji: string; description: string }
export const GESTURES: GestureInfo[] = [
  { id: "dislike", emoji: "👎", description: "I don't like it." },
  { id: "fist", emoji: "✊", description: "Please stop." },
  { id: "like", emoji: "👍", description: "That's great!" },
  { id: "ok", emoji: "👌", description: "Everything is fine." },
  { id: "one", emoji: "☝️", description: "Wait a minute, please." },
  { id: "palm", emoji: "🖐️", description: "Hello! Nice to meet you." },
  { id: "peace", emoji: "✌️", description: "See you later!" },
];
export const gestureLabel = (id: string) => {
  const gesture = GESTURES.find((g) => g.id === id);
  return gesture ? `${gesture.emoji} ${gesture.description}` : id;
};
export const gestureSpeechText = (label: string) =>
  GESTURES.find((g) => `${g.emoji} ${g.description}` === label)?.description ?? label;
