import BookCard from "./BookCard";
import { useRef, useEffect } from "react";

export default function GridView({ filtered, zoom, setZoom, setSelected }) {
  const containerRef = useRef(null);
  const MIN_ZOOM = 0.4;
  const MAX_ZOOM = 2;
  const ZOOM_SENSITIVITY = 0.002;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e) => {
      const isZoomGesture = e.ctrlKey || e.metaKey;
      if (!isZoomGesture) return;

      e.preventDefault();

      const zoomDelta = e.deltaY * ZOOM_SENSITIVITY;
      setZoom((currentZoom) => {
        const newZoom = currentZoom - zoomDelta;
        return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, newZoom));
      });
    };
    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      container.removeEventListener("wheel", handleWheel);
    };
  }, [setZoom]);

  return (
    <div ref={containerRef} style={{ padding: "2rem 3rem" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(auto-fill,minmax(${Math.round(160 * zoom)}px, 1fr))`,
          gap: `${Math.round(14 * zoom)}px`,
          transition: "grid-template-columns 0.2s ease",
        }}
      >
        {filtered.map((book) => (
          <BookCard
            key={book.id}
            book={book}
            zoom={zoom}
            onClick={() => setSelected(book)}
          />
        ))}
      </div>
    </div>
  );
}
