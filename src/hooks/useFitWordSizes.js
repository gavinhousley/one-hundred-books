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

// Measures each word in `text` against the container's available width and
// returns a parallel array of font-size overrides (in rem, or null to keep
// the natural CSS size) — only words too wide for the card shrink, in
// STEP_REM increments down to MIN_FONT_REM.
export function useFitWordSizes(ref, text) {
  const [sizes, setSizes] = useState(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !text) return;

    function recalc() {
      const style = getComputedStyle(el);
      const rootPx = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
      const naturalPx = parseFloat(style.fontSize);
      const available = el.clientWidth;
      const minPx = MIN_FONT_REM * rootPx;
      const stepPx = STEP_REM * rootPx;

      const words = text.split(/\s+/);
      const result = words.map((word) => {
        let px = naturalPx;
        while (px > minPx) {
          const font = `${style.fontStyle} ${style.fontWeight} ${px}px ${style.fontFamily}`;
          if (measureTextWidth(word, font) <= available) break;
          px -= stepPx;
        }
        return px < naturalPx ? px / rootPx : null;
      });
      setSizes(result);
    }

    recalc();
    window.addEventListener("resize", recalc);
    return () => window.removeEventListener("resize", recalc);
  }, [ref, text]);

  return sizes;
}
