import { useEffect, useState } from "react";

const MIN_FONT_REM = 0.5;
const STEP_REM = 0.1;

let measureCanvas;
function measureTextWidth(text, font) {
  measureCanvas ??= document.createElement("canvas");
  const ctx = measureCanvas.getContext("2d");
  ctx.font = font;
  return ctx.measureText(text).width;
}

function longestWord(text) {
  return text
    .split(/\s+/)
    .reduce((longest, word) => (word.length > longest.length ? word : longest), "");
}

// Shrinks an element's font-size in STEP_REM increments (down to MIN_FONT_REM)
// until its single longest word fits without being clipped or split.
export function useFitFontSize(ref, text) {
  const [overrideRem, setOverrideRem] = useState(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !text) return;

    function recalc() {
      el.style.fontSize = "";
      const style = getComputedStyle(el);
      const rootPx = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
      const naturalPx = parseFloat(style.fontSize);
      const word = longestWord(text);
      const available = el.clientWidth;

      let px = naturalPx;
      const minPx = MIN_FONT_REM * rootPx;
      const stepPx = STEP_REM * rootPx;
      while (px > minPx) {
        const font = `${style.fontStyle} ${style.fontWeight} ${px}px ${style.fontFamily}`;
        if (measureTextWidth(word, font) <= available) break;
        px -= stepPx;
      }
      setOverrideRem(px < naturalPx ? px / rootPx : null);
    }

    recalc();
    window.addEventListener("resize", recalc);
    return () => window.removeEventListener("resize", recalc);
  }, [ref, text]);

  return overrideRem;
}
