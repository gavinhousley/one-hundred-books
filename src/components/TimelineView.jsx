import BookCard from "./BookCard";
import { getCentury } from "../utils/helper";

const TIMELINE_ZOOM = 1.2;
const CARD_WIDTH = 140;
const CARD_GAP = 12;
const SLOT_WIDTH = CARD_WIDTH + CARD_GAP;

export default function TimelineView({ filtered, setSelected }) {
  const centuries = [...new Set(filtered.map((book) => getCentury(book.year)))];

  return (
    <div style={{ overflowX: "auto", padding: "2rem 0" }}>
      <div
        style={{
          minWidth: `${filtered.length * SLOT_WIDTH + 200}px`,
          padding: "0 3rem",
        }}
      >
        <div
          style={{
            display: "flex",
            marginBottom: "1rem",
            position: "relative",
            height: "1.4rem",
          }}
        >
          {centuries.map((century) => {
            const idx = filtered.findIndex(
              (book) => getCentury(book.year) === century,
            );
            return (
              <div
                key={century}
                style={{
                  position: "absolute",
                  left: `${idx * SLOT_WIDTH}px`,
                  fontSize: "0.7rem",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "#555",
                  borderLeft: "1px solid #999",
                  paddingLeft: "0.4rem",
                  paddingTop: "0.2rem",
                }}
              >
                {century}
              </div>
            );
          })}
        </div>

        {/* Timeline line */}
        <div
          style={{
            height: 1,
            background: "#CCC",
            marginBottom: "1.5rem",
          }}
        />

        {/* Books */}
        <div
          style={{
            display: "flex",
            gap: `${CARD_GAP}px`,
            alignItems: "flex-start",
          }}
        >
          {filtered.map((book) => (
            <div
              key={book.id}
              style={{
                width: `${CARD_WIDTH}px`, // fixed width prevents flex growing
                flexShrink: 0,
              }} // this prevents flex shrinking
            >
              <BookCard
                book={book}
                zoom={TIMELINE_ZOOM}
                onClick={() => setSelected(book)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
