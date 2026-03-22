import { MapContainer, TileLayer, CircleMarker, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { regionColors } from "../data/books";

export default function MapView({ filtered, filter, setFilter, setSelected }) {
  return (
    <div style={{ padding: "1.5rem 2rem 2rem" }}>
      {/* Map */}
      <div
        style={{
          border: "1px solid #D5CFBF",
          overflow: "hidden",
          boxShadow: "0 2px 20px rgba(0,0,0,0.06)",
        }}
      >
        <MapContainer
          center={[30, 15]}
          zoom={2}
          style={{ height: "500px", width: "100%" }}
          scrollWheelZoom={true}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />

          {filtered.map((book) => (
            <CircleMarker
              key={book.id}
              center={[book.lat, book.lng]}
              radius={7}
              pathOptions={{
                fillColor: regionColors[book.region] || "#888",
                fillOpacity:
                  filter !== "all" && book.region !== filter ? 0.1 : 0.9,
                color: "#F7F4EE",
                weight: 1.5,
              }}
              eventHandlers={{
                click: () => setSelected(book),
              }}
            >
              <Tooltip direction="top" offset={[0, -8]}>
                <div style={{ fontFamily: "Georgia, serif" }}>
                  <div
                    style={{
                      fontSize: "0.6rem",
                      color: "#AAA",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      marginBottom: "0.2rem",
                    }}
                  >
                    {book.country} ·{" "}
                    {book.year < 0 ? `${Math.abs(book.year)} BC` : book.year}
                  </div>
                  <div
                    style={{
                      fontSize: "0.85rem",
                      fontWeight: "bold",
                      marginBottom: "0.15rem",
                    }}
                  >
                    {book.title}
                  </div>
                  <div
                    style={{
                      fontSize: "0.75rem",
                      fontStyle: "italic",
                      color: "#666",
                    }}
                  >
                    {book.author}
                  </div>
                </div>
              </Tooltip>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>

      {/* Region legend */}
      <div
        style={{
          display: "flex",
          gap: "1.5rem",
          marginTop: "1rem",
          flexWrap: "wrap",
        }}
      >
        {Object.entries(regionColors).map(([region, color]) => (
          <div
            key={region}
            onClick={() => setFilter(filter === region ? "all" : region)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              cursor: "pointer",
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: color,
                opacity: filter === "all" || filter === region ? 1 : 0.3,
              }}
            />
            <span
              style={{
                fontSize: "0.62rem",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: filter === "all" || filter === region ? "#555" : "#BBB",
              }}
            >
              {region}
            </span>
          </div>
        ))}
      </div>

      {/* Below map book list */}
      <div style={{ marginTop: "2rem" }}>
        <div
          style={{
            fontSize: "0.62rem",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#AAA",
            marginBottom: "1rem",
            borderBottom: "1px solid #E0DDD6",
            paddingBottom: "0.5rem",
          }}
        >
          {filter === "all"
            ? "All 100 works"
            : `${filter} · ${filtered.length} works`}
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(215px, 1fr))",
            gap: "6px",
          }}
        >
          {filtered.map((book) => (
            <div
              key={book.id}
              onClick={() => setSelected(book)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.6rem",
                padding: "0.5rem 0.75rem",
                cursor: "pointer",
                border: "1px solid #F0EDE5",
                background: "#FDFAF5",
                transition: "all 0.1s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = regionColors[book.region];
                e.currentTarget.style.background = "#FFF";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#F0EDE5";
                e.currentTarget.style.background = "#FDFAF5";
              }}
            >
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: regionColors[book.region],
                  flexShrink: 0,
                }}
              />
              <div>
                <div
                  style={{
                    fontSize: "0.73rem",
                    fontWeight: "bold",
                    lineHeight: 1.25,
                  }}
                >
                  {book.title}
                </div>
                <div style={{ fontSize: "0.58rem", color: "#999" }}>
                  {book.author} ·{" "}
                  {book.year < 0 ? `${Math.abs(book.year)} BC` : book.year}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
