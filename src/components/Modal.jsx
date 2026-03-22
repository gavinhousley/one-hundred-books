import { regionColors } from "../data/books";
import { eraLabel } from "../utils/helper";

export default function Modal({ selected, onClose }) {
  return (
    selected && (
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.5)",
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
        }}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            background: "#F7F4EE",
            maxWidth: 520,
            width: "100%",
            padding: "2.5rem",
            borderTop: `5px solid ${regionColors[selected.region] || "#888"}`,
            position: "relative",
            boxShadow: "0 8px 48px rgba(0,0,0,0.2)",
          }}
        >
          <button
            onClick={onClose}
            style={{
              position: "absolute",
              top: "1rem",
              right: "1rem",
              background: "none",
              border: "none",
              fontSize: "1.2rem",
              cursor: "pointer",
              color: "#999",
            }}
          >
            ×
          </button>
          <div
            style={{
              fontSize: "0.6rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#AAA",
              marginBottom: "0.5rem",
            }}
          >
            {selected.region} · {selected.language} · {eraLabel(selected.year)}
          </div>
          <h2
            style={{
              margin: "0 0 0.25rem",
              fontSize: "1.5rem",
              fontWeight: "normal",
              lineHeight: 1.2,
            }}
          >
            {selected.title}
          </h2>
          <div
            style={{
              fontSize: "0.9rem",
              color: "#666",
              fontStyle: "italic",
              marginBottom: "1.5rem",
            }}
          >
            {selected.author} · {selected.country}
          </div>
          {/* <div style={{ borderTop: "1px solid #E0DDD6", paddingTop: "1.2rem" }}>
             <div
              style={{
                fontSize: "0.68rem",
                color: "#AAA",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: "0.5rem",
              }}
            >
              Editor's note
            </div>
            <p
              style={{
                fontSize: "0.85rem",
                lineHeight: 1.75,
                color: "#444",
                fontStyle: "italic",
                margin: 0,
              }}
            >
               {selected.notes } // this is where the variable (props from data will come in)
              Your personal notes and preferred edition will appear here —
              observations from a first or fifth reading, the translation you
              trust, the edition you love.
            </p>
          </div> */}
          <div style={{ marginTop: "1.5rem", display: "flex", gap: "0.75rem" }}>
            <a
              href={selected.link}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: "0.6rem 1.2rem",
                background: "#1A1A1A",
                color: "#F7F4EE",
                fontFamily: "Georgia, serif",
                fontSize: "0.75rem",
                letterSpacing: "0.05em",
                textDecoration: "none",
                display: "inline-block",
              }}
            >
              Buy this book →
            </a>

            {/* <button
              style={{
                padding: "0.6rem 1.2rem",
                background: "transparent",
                color: "#1A1A1A",
                border: "1px solid #CCC",
                fontFamily: "Georgia,serif",
                fontSize: "0.75rem",
                cursor: "pointer",
                letterSpacing: "0.05em",
              }}
            >
              Add to reading list
            </button> */}
          </div>
          <p
            style={{ fontStyle: "italic", fontSize: "0.70rem", color: "#AAA" }}
          >
            please note: I will receive a small affiliate fee for the forwarding
            of this book.
          </p>
        </div>
      </div>
    )
  );
}
