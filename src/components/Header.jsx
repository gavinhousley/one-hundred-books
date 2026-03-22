import { regionColors } from "../data/books";
import { books } from "../data/books";

export default function Header({
  view,
  setView,
  zoom,
  setZoom,
  filter,
  setFilter,
  search,
  setSearch,
  filteredCount,
}) {
  const regions = [
    "all",
    ...Array.from(new Set(books.map((book) => book.region))).sort(),
  ];

  return (
    <>
      <header
        style={{
          borderBottom: "2px solid #1A1A1A",
          padding: "1.5rem 3rem 1rem",
          background: "#F7F4EE",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "0.62rem",
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                color: "#999",
                marginBottom: "0.2rem",
              }}
            >
              The Norwegian Book Club · 2002
            </div>
            <h1
              style={{
                margin: 0,
                fontSize: "clamp(1.3rem,3vw,2rem)",
                fontWeight: "normal",
                letterSpacing: "-0.02em",
                lineHeight: 1,
              }}
            >
              One Hundred Books
            </h1>
            <div
              style={{
                fontSize: "0.7rem",
                color: "#888",
                marginTop: "0.2rem",
              }}
            >
              The greatest works of world literature
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              flexWrap: "wrap",
            }}
          >
            <input
              placeholder="Search…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                border: "1px solid #CCC",
                borderRadius: 0,
                padding: "0.35rem 0.7rem",
                fontFamily: "Georgia,serif",
                fontSize: "0.78rem",
                background: "transparent",
                outline: "none",
                width: "145px",
              }}
            />
            <div style={{ display: "flex" }}>
              {[
                { id: "grid", label: "Grid" },
                { id: "timeline", label: "Timeline" },
                { id: "map", label: "Map" },
              ].map((v, i) => (
                <button
                  key={v.id}
                  onClick={() => setView(v.id)}
                  style={{
                    padding: "0.35rem 0.85rem",
                    background: view === v.id ? "#1A1A1A" : "transparent",
                    color: view === v.id ? "#F7F4EE" : "#1A1A1A",
                    border: "1px solid #1A1A1A",
                    borderLeft: i > 0 ? "none" : "1px solid #1A1A1A",
                    cursor: "pointer",
                    fontFamily: "Georgia,serif",
                    fontSize: "0.73rem",
                    letterSpacing: "0.05em",
                  }}
                >
                  {v.label}
                </button>
              ))}
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              style={{
                border: "1px solid #CCC",
                padding: "0.35rem 0.7rem",
                fontFamily: "Georgia,serif",
                fontSize: "0.73rem",
                background: "transparent",
                cursor: "pointer",
                outline: "none",
              }}
            >
              {regions.map((r) => (
                <option key={r} value={r}>
                  {r === "all" ? "All Regions" : r}
                </option>
              ))}
            </select>
            {view === "grid" && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                }}
              >
                <button
                  onClick={() => setZoom((z) => Math.max(0.4, z - 0.15))}
                  style={{
                    background: "none",
                    border: "1px solid #CCC",
                    width: 26,
                    height: 26,
                    cursor: "pointer",
                    fontSize: "1rem",
                  }}
                >
                  −
                </button>
                <span
                  style={{
                    fontSize: "0.62rem",
                    color: "#999",
                    minWidth: "3ch",
                    textAlign: "center",
                  }}
                >
                  {Math.round(zoom * 100)}%
                </span>
                <button
                  onClick={() => setZoom((z) => Math.min(2, z + 0.15))}
                  style={{
                    background: "none",
                    border: "1px solid #CCC",
                    width: 26,
                    height: 26,
                    cursor: "pointer",
                    fontSize: "1rem",
                  }}
                >
                  +
                </button>
              </div>
            )}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            gap: "1.2rem",
            marginTop: "0.75rem",
            flexWrap: "wrap",
          }}
        >
          {Object.entries(regionColors).map(([region, color]) => (
            <div
              key={region}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.35rem",
                cursor: "pointer",
              }}
              onClick={() => setFilter(filter === region ? "all" : region)}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  background: color,
                  borderRadius: "50%",
                  opacity: filter === "all" || filter === region ? 1 : 0.25,
                }}
              />
              <span
                style={{
                  fontSize: "0.6rem",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color:
                    filter === "all" || filter === region ? "#555" : "#CCC",
                }}
              >
                {region}
              </span>
            </div>
          ))}
        </div>
      </header>

      <div
        style={{
          padding: "0.5rem 3rem",
          borderBottom: "1px solid #E0DDD6",
          fontSize: "0.62rem",
          color: "#AAA",
          letterSpacing: "0.1em",
        }}
      >
        {filteredCount} of 100 works
      </div>
    </>
  );
}
