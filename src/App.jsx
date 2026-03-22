import { useState } from "react";
import { books } from "./data/books";
import GridView from "./components/GridView";
import Modal from "./components/Modal";
import TimelineView from "./components/TimelineView";
import MapView from "./components/MapView";
import Header from "./components/Header";

function App() {
  const [view, setView] = useState("grid");
  const [zoom, setZoom] = useState(1);
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");

  const filtered = books
    .filter((book) => filter === "all" || book.region === filter)
    .filter(
      (book) =>
        book.title.toLowerCase().includes(search.toLowerCase()) ||
        book.author.toLowerCase().includes(search.toLowerCase()),
    )
    .sort((a, b) => a.year - b.year);

  return (
    <div
      style={{
        fontFamily: "'Georgia','Times New Roman',serif",
        background: "#F7F4EE",
        minHeight: "100vh",
        color: "#1A1A1A",
      }}
    >
      <Header
        view={view}
        setView={setView}
        zoom={zoom}
        setZoom={setZoom}
        filter={filter}
        setFilter={setFilter}
        search={search}
        setSearch={setSearch}
        filteredCount={filtered.length}
      />

      {view === "grid" && (
        <GridView
          filtered={filtered}
          zoom={zoom}
          setSelected={setSelected}
          setZoom={setZoom}
        />
      )}

      {view === "timeline" && (
        <TimelineView filtered={filtered} setSelected={setSelected} />
      )}

      {view === "map" && (
        <MapView
          filtered={filtered}
          filter={filter}
          setFilter={setFilter}
          setSelected={setSelected}
        />
      )}
      <Modal selected={selected} onClose={() => setSelected(null)} />
    </div>
  );
}

export default App;
