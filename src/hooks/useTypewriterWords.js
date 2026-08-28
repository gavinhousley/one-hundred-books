import { useEffect, useState } from "react";

const WORD_INTERVAL_MS = 160;

// Reveals `text` one word at a time, restarting whenever `text` changes.
// Returns the array of words revealed so far.
export function useTypewriterWords(text) {
  const [count, setCount] = useState(0);
  const [trackedText, setTrackedText] = useState(text);

  if (text !== trackedText) {
    setTrackedText(text);
    setCount(0);
  }

  useEffect(() => {
    if (!text) return;

    const words = text.split(" ");
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setCount(i);
      if (i >= words.length) clearInterval(id);
    }, WORD_INTERVAL_MS);

    return () => clearInterval(id);
  }, [text]);

  if (!text) return [];
  return text.split(" ").slice(0, count);
}
