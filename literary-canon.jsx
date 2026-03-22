import { useState, useRef } from "react";

const books = [
  { id: 1, title: "Gilgamesh", author: "Anonymous", country: "Iraq", language: "Sumerian", year: -1800, region: "Middle East", lat: 33.3, lng: 44.4 },
  { id: 2, title: "The Iliad", author: "Homer", country: "Greece", language: "Greek", year: -700, region: "Europe", lat: 37.9, lng: 23.7 },
  { id: 3, title: "The Odyssey", author: "Homer", country: "Greece", language: "Greek", year: -700, region: "Europe", lat: 37.5, lng: 22.5 },
  { id: 4, title: "The Book of Job", author: "Anonymous", country: "Israel", language: "Hebrew", year: -500, region: "Middle East", lat: 31.7, lng: 35.2 },
  { id: 5, title: "Mahabharata", author: "Vyasa", country: "India", language: "Sanskrit", year: -500, region: "Asia", lat: 28.6, lng: 77.2 },
  { id: 6, title: "Oedipus the King", author: "Sophocles", country: "Greece", language: "Greek", year: -430, region: "Europe", lat: 38.0, lng: 24.0 },
  { id: 7, title: "Medea", author: "Euripides", country: "Greece", language: "Greek", year: -431, region: "Europe", lat: 37.8, lng: 23.5 },
  { id: 8, title: "The Ramayana", author: "Valmiki", country: "India", language: "Sanskrit", year: -300, region: "Asia", lat: 26.8, lng: 80.9 },
  { id: 9, title: "The Aeneid", author: "Virgil", country: "Italy", language: "Latin", year: -19, region: "Europe", lat: 41.9, lng: 12.5 },
  { id: 10, title: "Metamorphoses", author: "Ovid", country: "Italy", language: "Latin", year: -43, region: "Europe", lat: 42.1, lng: 13.5 },
  { id: 11, title: "The Recognition of Sakuntala", author: "Kalidasa", country: "India", language: "Sanskrit", year: 400, region: "Asia", lat: 23.2, lng: 77.4 },
  { id: 12, title: "The Tale of Genji", author: "Murasaki Shikibu", country: "Japan", language: "Japanese", year: 1000, region: "Asia", lat: 35.0, lng: 135.8 },
  { id: 13, title: "Njaals Saga", author: "Anonymous", country: "Iceland", language: "Old Norse", year: 1300, region: "Europe", lat: 64.1, lng: -21.9 },
  { id: 14, title: "The Divine Comedy", author: "Dante Alighieri", country: "Italy", language: "Italian", year: 1321, region: "Europe", lat: 43.7, lng: 11.2 },
  { id: 15, title: "The Thousand and One Nights", author: "Anonymous", country: "Various", language: "Arabic", year: 1000, region: "Middle East", lat: 33.5, lng: 36.3 },
  { id: 16, title: "Decameron", author: "Giovanni Boccaccio", country: "Italy", language: "Italian", year: 1353, region: "Europe", lat: 43.8, lng: 11.1 },
  { id: 17, title: "Canterbury Tales", author: "Geoffrey Chaucer", country: "England", language: "English", year: 1400, region: "Europe", lat: 51.3, lng: 1.1 },
  { id: 18, title: "The Mathnawi", author: "Rumi", country: "Turkey", language: "Persian", year: 1273, region: "Middle East", lat: 37.9, lng: 32.5 },
  { id: 19, title: "The Orchard", author: "Saadi", country: "Iran", language: "Persian", year: 1257, region: "Middle East", lat: 29.6, lng: 52.5 },
  { id: 20, title: "Gargantua and Pantagruel", author: "François Rabelais", country: "France", language: "French", year: 1534, region: "Europe", lat: 47.4, lng: 0.7 },
  { id: 21, title: "Essays", author: "Michel de Montaigne", country: "France", language: "French", year: 1580, region: "Europe", lat: 44.8, lng: -0.3 },
  { id: 22, title: "Don Quixote", author: "Cervantes", country: "Spain", language: "Spanish", year: 1605, region: "Europe", lat: 39.4, lng: -3.7 },
  { id: 23, title: "Hamlet", author: "William Shakespeare", country: "England", language: "English", year: 1603, region: "Europe", lat: 52.2, lng: -1.7 },
  { id: 24, title: "King Lear", author: "William Shakespeare", country: "England", language: "English", year: 1606, region: "Europe", lat: 51.5, lng: -1.5 },
  { id: 25, title: "Othello", author: "William Shakespeare", country: "England", language: "English", year: 1603, region: "Europe", lat: 52.0, lng: -1.9 },
  { id: 26, title: "Gulliver's Travels", author: "Jonathan Swift", country: "Ireland", language: "English", year: 1726, region: "Europe", lat: 53.3, lng: -6.3 },
  { id: 27, title: "Jacques the Fatalist", author: "Denis Diderot", country: "France", language: "French", year: 1796, region: "Europe", lat: 48.5, lng: 5.0 },
  { id: 28, title: "The Life of Tristram Shandy", author: "Laurence Sterne", country: "Ireland", language: "English", year: 1759, region: "Europe", lat: 54.0, lng: -7.0 },
  { id: 29, title: "Faust", author: "Goethe", country: "Germany", language: "German", year: 1832, region: "Europe", lat: 50.1, lng: 8.7 },
  { id: 30, title: "Pride and Prejudice", author: "Jane Austen", country: "England", language: "English", year: 1813, region: "Europe", lat: 51.1, lng: -1.3 },
  { id: 31, title: "Fairy Tales and Stories", author: "H.C. Andersen", country: "Denmark", language: "Danish", year: 1837, region: "Europe", lat: 55.4, lng: 10.4 },
  { id: 32, title: "Dead Souls", author: "Nikolai Gogol", country: "Russia", language: "Russian", year: 1842, region: "Europe", lat: 55.7, lng: 37.6 },
  { id: 33, title: "The Complete Tales", author: "Edgar Allan Poe", country: "USA", language: "English", year: 1845, region: "Americas", lat: 39.3, lng: -76.6 },
  { id: 34, title: "Wuthering Heights", author: "Emily Brontë", country: "England", language: "English", year: 1847, region: "Europe", lat: 53.9, lng: -2.0 },
  { id: 35, title: "The Red and the Black", author: "Stendhal", country: "France", language: "French", year: 1830, region: "Europe", lat: 45.2, lng: 5.7 },
  { id: 36, title: "Leaves of Grass", author: "Walt Whitman", country: "USA", language: "English", year: 1855, region: "Americas", lat: 40.7, lng: -73.9 },
  { id: 37, title: "Madame Bovary", author: "Gustave Flaubert", country: "France", language: "French", year: 1857, region: "Europe", lat: 49.4, lng: 1.1 },
  { id: 38, title: "Great Expectations", author: "Charles Dickens", country: "England", language: "English", year: 1861, region: "Europe", lat: 51.4, lng: 0.5 },
  { id: 39, title: "Crime and Punishment", author: "Dostoyevsky", country: "Russia", language: "Russian", year: 1866, region: "Europe", lat: 59.9, lng: 30.3 },
  { id: 40, title: "War and Peace", author: "Leo Tolstoy", country: "Russia", language: "Russian", year: 1869, region: "Europe", lat: 54.2, lng: 37.6 },
  { id: 41, title: "Middlemarch", author: "George Eliot", country: "England", language: "English", year: 1872, region: "Europe", lat: 52.4, lng: -1.5 },
  { id: 42, title: "Huckleberry Finn", author: "Mark Twain", country: "USA", language: "English", year: 1884, region: "Americas", lat: 39.8, lng: -91.1 },
  { id: 43, title: "The Brothers Karamazov", author: "Dostoyevsky", country: "Russia", language: "Russian", year: 1880, region: "Europe", lat: 56.8, lng: 60.6 },
  { id: 44, title: "The Idiot", author: "Dostoyevsky", country: "Russia", language: "Russian", year: 1869, region: "Europe", lat: 59.7, lng: 30.1 },
  { id: 45, title: "The Possessed", author: "Dostoyevsky", country: "Russia", language: "Russian", year: 1872, region: "Europe", lat: 58.5, lng: 31.3 },
  { id: 46, title: "Anna Karenina", author: "Leo Tolstoy", country: "Russia", language: "Russian", year: 1878, region: "Europe", lat: 55.4, lng: 37.2 },
  { id: 47, title: "A Doll's House", author: "Henrik Ibsen", country: "Norway", language: "Norwegian", year: 1879, region: "Europe", lat: 59.9, lng: 10.7 },
  { id: 48, title: "Gypsy Ballads", author: "García Lorca", country: "Spain", language: "Spanish", year: 1928, region: "Europe", lat: 37.2, lng: -3.6 },
  { id: 49, title: "The Death of Ivan Ilyich", author: "Leo Tolstoy", country: "Russia", language: "Russian", year: 1886, region: "Europe", lat: 55.8, lng: 37.8 },
  { id: 50, title: "A Sentimental Education", author: "Gustave Flaubert", country: "France", language: "French", year: 1869, region: "Europe", lat: 48.8, lng: 2.3 },
  { id: 51, title: "Old Goriot", author: "Honoré de Balzac", country: "France", language: "French", year: 1835, region: "Europe", lat: 48.9, lng: 2.4 },
  { id: 52, title: "Hunger", author: "Knut Hamsun", country: "Norway", language: "Norwegian", year: 1890, region: "Europe", lat: 58.1, lng: 8.0 },
  { id: 53, title: "Diary of a Madman", author: "Lu Xun", country: "China", language: "Chinese", year: 1918, region: "Asia", lat: 30.0, lng: 120.2 },
  { id: 54, title: "Selected Stories", author: "Anton Chekhov", country: "Russia", language: "Russian", year: 1900, region: "Europe", lat: 45.0, lng: 38.9 },
  { id: 55, title: "Buddenbrooks", author: "Thomas Mann", country: "Germany", language: "German", year: 1901, region: "Europe", lat: 53.9, lng: 10.7 },
  { id: 56, title: "The Complete Stories", author: "Franz Kafka", country: "Bohemia", language: "German", year: 1924, region: "Europe", lat: 50.1, lng: 14.4 },
  { id: 57, title: "The Trial", author: "Franz Kafka", country: "Bohemia", language: "German", year: 1925, region: "Europe", lat: 50.0, lng: 14.3 },
  { id: 58, title: "The Castle", author: "Franz Kafka", country: "Bohemia", language: "German", year: 1926, region: "Europe", lat: 50.2, lng: 14.5 },
  { id: 59, title: "Sons and Lovers", author: "D.H. Lawrence", country: "England", language: "English", year: 1913, region: "Europe", lat: 53.1, lng: -1.2 },
  { id: 60, title: "Confessions of Zeno", author: "Italo Svevo", country: "Italy", language: "Italian", year: 1923, region: "Europe", lat: 45.6, lng: 13.8 },
  { id: 61, title: "Complete Poems", author: "Giacomo Leopardi", country: "Italy", language: "Italian", year: 1845, region: "Europe", lat: 43.1, lng: 13.2 },
  { id: 62, title: "Mrs Dalloway", author: "Virginia Woolf", country: "England", language: "English", year: 1925, region: "Europe", lat: 51.5, lng: -0.1 },
  { id: 63, title: "To the Lighthouse", author: "Virginia Woolf", country: "England", language: "English", year: 1927, region: "Europe", lat: 51.6, lng: -0.2 },
  { id: 64, title: "The Magic Mountain", author: "Thomas Mann", country: "Germany", language: "German", year: 1924, region: "Europe", lat: 52.5, lng: 13.4 },
  { id: 65, title: "Remembrance of Things Past", author: "Marcel Proust", country: "France", language: "French", year: 1927, region: "Europe", lat: 48.7, lng: 2.5 },
  { id: 66, title: "The Sound and the Fury", author: "William Faulkner", country: "USA", language: "English", year: 1929, region: "Americas", lat: 34.4, lng: -89.5 },
  { id: 67, title: "Absalom, Absalom!", author: "William Faulkner", country: "USA", language: "English", year: 1936, region: "Americas", lat: 34.3, lng: -89.4 },
  { id: 68, title: "Berlin Alexanderplatz", author: "Alfred Döblin", country: "Germany", language: "German", year: 1929, region: "Europe", lat: 52.5, lng: 13.5 },
  { id: 69, title: "The Man Without Qualities", author: "Robert Musil", country: "Austria", language: "German", year: 1930, region: "Europe", lat: 48.2, lng: 16.4 },
  { id: 70, title: "Moby-Dick", author: "Herman Melville", country: "USA", language: "English", year: 1851, region: "Americas", lat: 41.5, lng: -70.7 },
  { id: 71, title: "The Old Man and the Sea", author: "Ernest Hemingway", country: "USA", language: "English", year: 1952, region: "Americas", lat: 41.8, lng: -87.6 },
  { id: 72, title: "Journey to the End of the Night", author: "Louis-Ferdinand Céline", country: "France", language: "French", year: 1932, region: "Europe", lat: 48.6, lng: 2.1 },
  { id: 73, title: "Invisible Man", author: "Ralph Ellison", country: "USA", language: "English", year: 1952, region: "Americas", lat: 35.2, lng: -97.4 },
  { id: 74, title: "The Stranger", author: "Albert Camus", country: "Algeria/France", language: "French", year: 1942, region: "Africa", lat: 36.7, lng: 3.1 },
  { id: 75, title: "Independent People", author: "Halldór Laxness", country: "Iceland", language: "Icelandic", year: 1935, region: "Europe", lat: 65.0, lng: -19.0 },
  { id: 76, title: "Lolita", author: "Vladimir Nabokov", country: "Russia/USA", language: "English", year: 1955, region: "Americas", lat: 40.4, lng: -74.0 },
  { id: 77, title: "The Sound of the Mountain", author: "Yasunari Kawabata", country: "Japan", language: "Japanese", year: 1954, region: "Asia", lat: 35.3, lng: 139.5 },
  { id: 78, title: "Ulysses", author: "James Joyce", country: "Ireland", language: "English", year: 1922, region: "Europe", lat: 53.4, lng: -6.2 },
  { id: 79, title: "Molloy / Malone Dies / The Unnamable", author: "Samuel Beckett", country: "Ireland", language: "English/French", year: 1958, region: "Europe", lat: 53.1, lng: -6.0 },
  { id: 80, title: "Pippi Longstocking", author: "Astrid Lindgren", country: "Sweden", language: "Swedish", year: 1945, region: "Europe", lat: 57.8, lng: 14.2 },
  { id: 81, title: "The Book of Disquiet", author: "Fernando Pessoa", country: "Portugal", language: "Portuguese", year: 1982, region: "Europe", lat: 38.7, lng: -9.1 },
  { id: 82, title: "Beloved", author: "Toni Morrison", country: "USA", language: "English", year: 1987, region: "Americas", lat: 39.1, lng: -84.5 },
  { id: 83, title: "One Hundred Years of Solitude", author: "Gabriel García Márquez", country: "Colombia", language: "Spanish", year: 1967, region: "Americas", lat: 11.2, lng: -74.2 },
  { id: 84, title: "Love in the Time of Cholera", author: "Gabriel García Márquez", country: "Colombia", language: "Spanish", year: 1985, region: "Americas", lat: 10.4, lng: -75.5 },
  { id: 85, title: "Collected Fictions", author: "Jorge Luis Borges", country: "Argentina", language: "Spanish", year: 1944, region: "Americas", lat: -34.6, lng: -58.4 },
  { id: 86, title: "The Golden Notebook", author: "Doris Lessing", country: "England", language: "English", year: 1962, region: "Europe", lat: 51.6, lng: -0.3 },
  { id: 87, title: "The Tin Drum", author: "Günter Grass", country: "Germany", language: "German", year: 1959, region: "Europe", lat: 54.4, lng: 18.6 },
  { id: 88, title: "Things Fall Apart", author: "Chinua Achebe", country: "Nigeria", language: "English", year: 1958, region: "Africa", lat: 6.2, lng: 6.7 },
  { id: 89, title: "Season of Migration to the North", author: "Tayeb Salih", country: "Sudan", language: "Arabic", year: 1966, region: "Africa", lat: 15.6, lng: 32.5 },
  { id: 90, title: "Children of Gebelawi", author: "Naguib Mahfouz", country: "Egypt", language: "Arabic", year: 1959, region: "Africa", lat: 30.1, lng: 31.2 },
  { id: 91, title: "Midnight's Children", author: "Salman Rushdie", country: "India/Britain", language: "English", year: 1981, region: "Asia", lat: 18.9, lng: 72.8 },
  { id: 92, title: "Blindness", author: "José Saramago", country: "Portugal", language: "Portuguese", year: 1995, region: "Europe", lat: 38.6, lng: -9.2 },
  { id: 93, title: "Pedro Páramo", author: "Juan Rulfo", country: "Mexico", language: "Spanish", year: 1955, region: "Americas", lat: 19.4, lng: -103.3 },
  { id: 94, title: "The Devil to Pay in the Backlands", author: "João Guimarães Rosa", country: "Brazil", language: "Portuguese", year: 1956, region: "Americas", lat: -15.8, lng: -47.9 },
  { id: 95, title: "Poems", author: "Paul Celan", country: "Romania/France", language: "German", year: 1952, region: "Europe", lat: 48.3, lng: 25.9 },
  { id: 96, title: "History", author: "Elsa Morante", country: "Italy", language: "Italian", year: 1974, region: "Europe", lat: 41.8, lng: 12.6 },
  { id: 97, title: "Zorba the Greek", author: "Nikos Kazantzakis", country: "Greece", language: "Greek", year: 1946, region: "Europe", lat: 35.3, lng: 25.1 },
  { id: 98, title: "Memoirs of Hadrian", author: "Marguerite Yourcenar", country: "France", language: "French", year: 1951, region: "Europe", lat: 50.6, lng: 3.1 },
  { id: 99, title: "1984", author: "George Orwell", country: "England", language: "English", year: 1949, region: "Europe", lat: 51.5, lng: -0.0 },
  { id: 100, title: "The Book of Disquiet", author: "Fernando Pessoa", country: "Portugal", language: "Portuguese", year: 1982, region: "Europe", lat: 38.75, lng: -9.15 },
];

const uniqueBooks = books.filter((b, i, arr) => arr.findIndex(x => x.id === b.id) === i);

const regionColors = {
  "Europe": "#2C3E7A",
  "Americas": "#2A6E4A",
  "Asia": "#8B3A1A",
  "Middle East": "#7A5C1A",
  "Africa": "#5A7A2E",
};

function project(lat, lng) {
  const x = ((lng + 180) / 360) * 1000;
  const y = ((90 - lat) / 180) * 507;
  return { x, y };
}

const eraLabel = (year) => {
  if (year < 0) return `${Math.abs(year)} BC`;
  if (year < 1000) return `${year} AD`;
  return `${year}`;
};

const getCentury = (year) => {
  if (year < 0) return `${Math.ceil(Math.abs(year) / 100)}th c. BC`;
  const c = Math.ceil(year / 100);
  const suffix = c === 1 ? "st" : c === 2 ? "nd" : c === 3 ? "rd" : "th";
  return `${c}${suffix} c.`;
};

export default function LiteraryCanon() {
  const [view, setView] = useState("grid");
  const [zoom, setZoom] = useState(1);
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [mapHover, setMapHover] = useState(null);
  const containerRef = useRef(null);

  const regions = ["all", ...Array.from(new Set(uniqueBooks.map(b => b.region))).sort()];

  const filtered = uniqueBooks
    .filter(b => filter === "all" || b.region === filter)
    .filter(b =>
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.author.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => a.year - b.year);

  const handleWheel = (e) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      setZoom(z => Math.min(2, Math.max(0.4, z - e.deltaY * 0.002)));
    }
  };

  const centuries = [...new Set(filtered.map(b => getCentury(b.year)))];

  const groupedPins = filtered.reduce((acc, book) => {
    const key = `${Math.round(book.lat * 3)}_${Math.round(book.lng * 3)}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(book);
    return acc;
  }, {});

  return (
    <div style={{ fontFamily: "'Georgia','Times New Roman',serif", background: "#F7F4EE", minHeight: "100vh", color: "#1A1A1A" }}>

      {/* HEADER */}
      <header style={{ borderBottom: "2px solid #1A1A1A", padding: "1.5rem 3rem 1rem", background: "#F7F4EE", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <div style={{ fontSize: "0.62rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "#999", marginBottom: "0.2rem" }}>The Norwegian Book Club · 2002</div>
            <h1 style={{ margin: 0, fontSize: "clamp(1.3rem,3vw,2rem)", fontWeight: "normal", letterSpacing: "-0.02em", lineHeight: 1 }}>One Hundred Books</h1>
            <div style={{ fontSize: "0.7rem", color: "#888", marginTop: "0.2rem" }}>The greatest works of world literature</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
            <input placeholder="Search…" value={search} onChange={e => setSearch(e.target.value)} style={{ border: "1px solid #CCC", borderRadius: 0, padding: "0.35rem 0.7rem", fontFamily: "Georgia,serif", fontSize: "0.78rem", background: "transparent", outline: "none", width: "145px" }} />
            <div style={{ display: "flex" }}>
              {[{ id: "grid", label: "Grid" }, { id: "timeline", label: "Timeline" }, { id: "map", label: "Map" }].map((v, i) => (
                <button key={v.id} onClick={() => setView(v.id)} style={{ padding: "0.35rem 0.85rem", background: view === v.id ? "#1A1A1A" : "transparent", color: view === v.id ? "#F7F4EE" : "#1A1A1A", border: "1px solid #1A1A1A", borderLeft: i > 0 ? "none" : "1px solid #1A1A1A", cursor: "pointer", fontFamily: "Georgia,serif", fontSize: "0.73rem", letterSpacing: "0.05em" }}>{v.label}</button>
              ))}
            </div>
            <select value={filter} onChange={e => setFilter(e.target.value)} style={{ border: "1px solid #CCC", padding: "0.35rem 0.7rem", fontFamily: "Georgia,serif", fontSize: "0.73rem", background: "transparent", cursor: "pointer", outline: "none" }}>
              {regions.map(r => <option key={r} value={r}>{r === "all" ? "All Regions" : r}</option>)}
            </select>
            {view === "grid" && (
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <button onClick={() => setZoom(z => Math.max(0.4, z - 0.15))} style={{ background: "none", border: "1px solid #CCC", width: 26, height: 26, cursor: "pointer", fontSize: "1rem" }}>−</button>
                <span style={{ fontSize: "0.62rem", color: "#999", minWidth: "3ch", textAlign: "center" }}>{Math.round(zoom * 100)}%</span>
                <button onClick={() => setZoom(z => Math.min(2, z + 0.15))} style={{ background: "none", border: "1px solid #CCC", width: 26, height: 26, cursor: "pointer", fontSize: "1rem" }}>+</button>
              </div>
            )}
          </div>
        </div>
        <div style={{ display: "flex", gap: "1.2rem", marginTop: "0.75rem", flexWrap: "wrap" }}>
          {Object.entries(regionColors).map(([region, color]) => (
            <div key={region} style={{ display: "flex", alignItems: "center", gap: "0.35rem", cursor: "pointer" }} onClick={() => setFilter(filter === region ? "all" : region)}>
              <div style={{ width: 8, height: 8, background: color, borderRadius: "50%", opacity: filter === "all" || filter === region ? 1 : 0.25 }} />
              <span style={{ fontSize: "0.6rem", letterSpacing: "0.08em", textTransform: "uppercase", color: filter === "all" || filter === region ? "#555" : "#CCC" }}>{region}</span>
            </div>
          ))}
        </div>
      </header>

      <div style={{ padding: "0.5rem 3rem", borderBottom: "1px solid #E0DDD6", fontSize: "0.62rem", color: "#AAA", letterSpacing: "0.1em" }}>
        {filtered.length} of 100 works
      </div>

      {/* GRID VIEW */}
      {view === "grid" && (
        <div ref={containerRef} onWheel={handleWheel} style={{ padding: "2rem 3rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill,minmax(${Math.round(160 * zoom)}px,1fr))`, gap: `${Math.round(14 * zoom)}px`, transition: "grid-template-columns 0.2s ease" }}>
            {filtered.map(book => <BookCard key={book.id} book={book} zoom={zoom} onClick={() => setSelected(book)} />)}
          </div>
        </div>
      )}

      {/* TIMELINE VIEW */}
      {view === "timeline" && (
        <div style={{ overflowX: "auto", padding: "2rem 0" }}>
          <div style={{ minWidth: `${filtered.length * 120 + 200}px`, padding: "0 3rem" }}>
            <div style={{ display: "flex", marginBottom: "1rem", position: "relative", height: "1.4rem" }}>
              {centuries.map(c => {
                const idx = filtered.findIndex(b => getCentury(b.year) === c);
                return <div key={c} style={{ position: "absolute", left: `${idx * 120}px`, fontSize: "0.56rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#AAA", borderLeft: "1px solid #DDD", paddingLeft: "0.4rem", paddingTop: "0.2rem" }}>{c}</div>;
              })}
            </div>
            <div style={{ height: 1, background: "#CCC", marginBottom: "1.5rem" }} />
            <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
              {filtered.map(book => (
                <div key={book.id} onClick={() => setSelected(book)} style={{ width: 108, minWidth: 108, cursor: "pointer", transition: "transform 0.15s ease" }}
                  onMouseEnter={e => e.currentTarget.style.transform = "translateY(-4px)"}
                  onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
                  <div style={{ display: "flex", alignItems: "center", marginBottom: "0.5rem" }}>
                    <div style={{ width: 7, height: 7, borderRadius: "50%", background: regionColors[book.region] || "#888", flexShrink: 0 }} />
                    <div style={{ height: 1, background: "#DDD", flex: 1, marginLeft: 4 }} />
                  </div>
                  <div style={{ background: "#FFF", border: "1px solid #E0DDD6", padding: "0.75rem", borderTop: `3px solid ${regionColors[book.region] || "#888"}`, minHeight: 100 }}>
                    <div style={{ fontSize: "0.52rem", color: "#AAA", letterSpacing: "0.1em", marginBottom: "0.3rem" }}>{eraLabel(book.year)}</div>
                    <div style={{ fontSize: "0.68rem", fontWeight: "bold", lineHeight: 1.3, marginBottom: "0.25rem" }}>{book.title.length > 28 ? book.title.slice(0, 26) + "…" : book.title}</div>
                    <div style={{ fontSize: "0.58rem", color: "#888", fontStyle: "italic" }}>{book.author.split(" ").slice(-1)[0]}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ height: 1, background: "#CCC", marginTop: "1.5rem" }} />
          </div>
        </div>
      )}

      {/* MAP VIEW */}
      {view === "map" && (
        <div style={{ padding: "1.5rem 2rem 2rem" }}>
          <p style={{ fontSize: "0.65rem", color: "#AAA", letterSpacing: "0.08em", textAlign: "center", marginBottom: "1rem" }}>
            Hover to preview · Click a pin to open · Numbers show clustered works
          </p>

          <div style={{ position: "relative", border: "1px solid #D5CFBF", overflow: "hidden", boxShadow: "0 2px 20px rgba(0,0,0,0.06)" }}>
            <svg viewBox="0 0 1000 507" style={{ width: "100%", display: "block" }} preserveAspectRatio="xMidYMid meet">
              {/* Ocean */}
              <rect width="1000" height="507" fill="#C8DBE8" />

              {/* Latitude bands for visual warmth */}
              <rect x="0" y={project(23.5,0).y} width="1000" height={project(-23.5,0).y - project(23.5,0).y} fill="rgba(255,235,180,0.12)" />

              {/* Grid lines */}
              {[-60,-30,0,30,60].map(lat => {
                const {y} = project(lat,0);
                return <line key={lat} x1="0" y1={y} x2="1000" y2={y} stroke="rgba(255,255,255,0.35)" strokeWidth="0.6" />;
              })}
              {[-150,-120,-90,-60,-30,0,30,60,90,120,150].map(lng => {
                const {x} = project(0,lng);
                return <line key={lng} x1={x} y1="0" x2={x} y2="507" stroke="rgba(255,255,255,0.25)" strokeWidth="0.5" />;
              })}

              {/* Land masses */}
              {landPaths.map((d, i) => <path key={i} d={d} fill="#E6DFD0" stroke="#C8BEA8" strokeWidth="0.5" />)}

              {/* Equator label */}
              <text x="8" y={project(0,0).y - 3} fontSize="4.5" fill="rgba(255,255,255,0.5)" letterSpacing="1.5">EQUATOR</text>

              {/* Pins */}
              {Object.values(groupedPins).map(group => {
                const book = group[0];
                const {x,y} = project(book.lat, book.lng);
                const color = regionColors[book.region] || "#888";
                const count = group.length;
                const r = count === 1 ? 5.5 : count <= 3 ? 7.5 : 10;
                const isHov = mapHover && group.some(b => b.id === mapHover.id);
                const dim = filter !== "all" && book.region !== filter;
                return (
                  <g key={book.id}
                    onClick={() => { if (group.length === 1) setSelected(group[0]); else setMapHover(group[0]); }}
                    onMouseEnter={() => setMapHover(group[0])}
                    onMouseLeave={() => setMapHover(null)}
                    style={{ cursor: "pointer" }}
                    opacity={dim ? 0.12 : 1}>
                    {isHov && <circle cx={x} cy={y} r={r+6} fill="none" stroke={color} strokeWidth="1.5" opacity="0.5" />}
                    <circle cx={x} cy={y} r={isHov ? r+2 : r} fill={color} stroke="#F7F4EE" strokeWidth={isHov ? 2 : 1.2} style={{ transition: "r 0.12s ease" }} />
                    {count > 1 && <text x={x} y={y+3.5} textAnchor="middle" fontSize="6" fill="white" fontWeight="bold" style={{ pointerEvents: "none" }}>{count}</text>}
                  </g>
                );
              })}
            </svg>

            {/* Hover tooltip */}
            {mapHover && (() => {
              const group = Object.values(groupedPins).find(g => g.some(b => b.id === mapHover.id));
              if (!group) return null;
              return (
                <div style={{ position: "absolute", bottom: "1rem", left: "1rem", background: "rgba(247,244,238,0.97)", border: "1px solid #E0DDD6", borderLeft: `4px solid ${regionColors[mapHover.region]}`, padding: "0.9rem 1.1rem", maxWidth: 290, boxShadow: "0 4px 24px rgba(0,0,0,0.12)", pointerEvents: "none" }}>
                  {group.length > 1 ? (
                    <>
                      <div style={{ fontSize: "0.58rem", color: "#AAA", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "0.6rem" }}>{mapHover.country} · {group.length} works</div>
                      {group.map(b => (
                        <div key={b.id} style={{ padding: "0.25rem 0", borderBottom: "1px solid #EEE", display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "0.5rem" }}>
                          <span style={{ fontSize: "0.75rem", fontWeight: "bold" }}>{b.title.length > 30 ? b.title.slice(0,28)+"…" : b.title}</span>
                          <span style={{ fontSize: "0.6rem", color: "#AAA", flexShrink: 0 }}>{eraLabel(b.year)}</span>
                        </div>
                      ))}
                    </>
                  ) : (
                    <>
                      <div style={{ fontSize: "0.58rem", color: "#AAA", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "0.35rem" }}>{mapHover.country} · {eraLabel(mapHover.year)}</div>
                      <div style={{ fontSize: "1rem", fontWeight: "bold", lineHeight: 1.25 }}>{mapHover.title}</div>
                      <div style={{ fontSize: "0.78rem", color: "#777", fontStyle: "italic", marginTop: "0.25rem" }}>{mapHover.author}</div>
                      <div style={{ fontSize: "0.62rem", color: "#AAA", marginTop: "0.5rem", letterSpacing: "0.08em" }}>{mapHover.language}</div>
                    </>
                  )}
                </div>
              );
            })()}

            {/* Map legend */}
            <div style={{ position: "absolute", top: "1rem", right: "1rem", background: "rgba(247,244,238,0.93)", border: "1px solid #E0DDD6", padding: "0.75rem 0.9rem" }}>
              {Object.entries(regionColors).map(([region, color]) => (
                <div key={region} style={{ display: "flex", alignItems: "center", gap: "0.45rem", marginBottom: "0.35rem", cursor: "pointer" }} onClick={() => setFilter(filter === region ? "all" : region)}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: color, opacity: filter === "all" || filter === region ? 1 : 0.3 }} />
                  <span style={{ fontSize: "0.58rem", letterSpacing: "0.08em", textTransform: "uppercase", color: filter === "all" || filter === region ? "#555" : "#BBB" }}>{region}</span>
                </div>
              ))}
              <div style={{ borderTop: "1px solid #EEE", marginTop: "0.5rem", paddingTop: "0.45rem", fontSize: "0.52rem", color: "#BBB" }}>Numbers = clustered works</div>
            </div>
          </div>

          {/* Below-map list */}
          <div style={{ marginTop: "2rem" }}>
            <div style={{ fontSize: "0.62rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "#AAA", marginBottom: "1rem", borderBottom: "1px solid #E0DDD6", paddingBottom: "0.5rem" }}>
              {filter === "all" ? "All 100 works" : `${filter} · ${filtered.length} works`}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(215px,1fr))", gap: "6px" }}>
              {filtered.map(book => (
                <div key={book.id} onClick={() => setSelected(book)}
                  style={{ display: "flex", alignItems: "center", gap: "0.6rem", padding: "0.5rem 0.75rem", cursor: "pointer", border: "1px solid #F0EDE5", background: "#FDFAF5", transition: "all 0.1s ease" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = regionColors[book.region]; e.currentTarget.style.background = "#FFF"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "#F0EDE5"; e.currentTarget.style.background = "#FDFAF5"; }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: regionColors[book.region], flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: "0.73rem", fontWeight: "bold", lineHeight: 1.25 }}>{book.title}</div>
                    <div style={{ fontSize: "0.58rem", color: "#999" }}>{book.author} · {eraLabel(book.year)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL */}
      {selected && (
        <div onClick={() => setSelected(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
          <div onClick={e => e.stopPropagation()} style={{ background: "#F7F4EE", maxWidth: 520, width: "100%", padding: "2.5rem", borderTop: `5px solid ${regionColors[selected.region] || "#888"}`, position: "relative", boxShadow: "0 8px 48px rgba(0,0,0,0.2)" }}>
            <button onClick={() => setSelected(null)} style={{ position: "absolute", top: "1rem", right: "1rem", background: "none", border: "none", fontSize: "1.2rem", cursor: "pointer", color: "#999" }}>×</button>
            <div style={{ fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#AAA", marginBottom: "0.5rem" }}>{selected.region} · {selected.language} · {eraLabel(selected.year)}</div>
            <h2 style={{ margin: "0 0 0.25rem", fontSize: "1.5rem", fontWeight: "normal", lineHeight: 1.2 }}>{selected.title}</h2>
            <div style={{ fontSize: "0.9rem", color: "#666", fontStyle: "italic", marginBottom: "1.5rem" }}>{selected.author} · {selected.country}</div>
            <div style={{ borderTop: "1px solid #E0DDD6", paddingTop: "1.2rem" }}>
              <div style={{ fontSize: "0.68rem", color: "#AAA", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.5rem" }}>Editor's note</div>
              <p style={{ fontSize: "0.85rem", lineHeight: 1.75, color: "#444", fontStyle: "italic", margin: 0 }}>Your personal notes and preferred edition will appear here — observations from a first or fifth reading, the translation you trust, the edition you love.</p>
            </div>
            <div style={{ marginTop: "1.5rem", display: "flex", gap: "0.75rem" }}>
              <button style={{ padding: "0.6rem 1.2rem", background: "#1A1A1A", color: "#F7F4EE", border: "none", fontFamily: "Georgia,serif", fontSize: "0.75rem", cursor: "pointer", letterSpacing: "0.05em" }}>Buy this book →</button>
              <button style={{ padding: "0.6rem 1.2rem", background: "transparent", color: "#1A1A1A", border: "1px solid #CCC", fontFamily: "Georgia,serif", fontSize: "0.75rem", cursor: "pointer", letterSpacing: "0.05em" }}>Add to reading list</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function BookCard({ book, zoom, onClick }) {
  const [hovered, setHovered] = useState(false);
  const showDetails = zoom > 0.65;
  const showYear = zoom > 0.45;
  return (
    <div onClick={onClick} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={{ background: hovered ? "#FFF" : "#FDFAF5", border: "1px solid #E0DDD6", borderTop: `3px solid ${regionColors[book.region] || "#888"}`, padding: zoom > 0.7 ? "1rem" : "0.6rem", cursor: "pointer", height: Math.round(180 * zoom), overflow: "hidden", transition: "all 0.15s ease", transform: hovered ? "translateY(-2px)" : "none", boxShadow: hovered ? "0 4px 16px rgba(0,0,0,0.08)" : "none", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
      <div>
        {showYear && <div style={{ fontSize: `${Math.max(0.5, 0.6 * zoom)}rem`, color: "#AAA", letterSpacing: "0.1em", marginBottom: "0.2rem" }}>{eraLabel(book.year)}</div>}
        <div style={{ fontSize: `${Math.max(0.6, 0.82 * zoom)}rem`, fontWeight: "bold", lineHeight: 1.3 }}>
          {zoom < 0.6 && book.title.length > 20 ? book.title.slice(0, 18) + "…" : zoom < 0.9 && book.title.length > 35 ? book.title.slice(0, 33) + "…" : book.title}
        </div>
        {showDetails && <div style={{ fontSize: `${Math.max(0.5, 0.7 * zoom)}rem`, color: "#888", fontStyle: "italic", marginTop: "0.25rem" }}>{book.author}</div>}
      </div>
      {showDetails && (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: `${Math.max(0.45, 0.6 * zoom)}rem`, color: "#BBB", textTransform: "uppercase", letterSpacing: "0.08em" }}>{book.country}</div>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: regionColors[book.region] || "#888", opacity: 0.7 }} />
        </div>
      )}
    </div>
  );
}

// SVG land paths — equirectangular projection, 1000×507 viewBox
const landPaths = [
  // North America
  "M 80,60 L 95,55 L 130,58 L 160,52 L 185,60 L 200,72 L 215,70 L 232,78 L 242,95 L 238,118 L 225,132 L 215,148 L 202,165 L 192,182 L 180,200 L 168,220 L 155,242 L 142,258 L 132,268 L 120,265 L 108,255 L 102,240 L 96,222 L 90,205 L 84,188 L 78,170 L 72,152 L 67,135 L 64,118 L 63,100 L 65,82 Z",
  // Alaska
  "M 50,55 L 72,48 L 85,52 L 82,64 L 68,68 L 52,65 Z",
  // Greenland
  "M 185,28 L 208,22 L 228,26 L 240,35 L 242,46 L 230,54 L 210,55 L 192,48 Z",
  // Central America
  "M 175,218 L 188,212 L 196,220 L 197,232 L 190,242 L 180,244 L 172,238 L 170,226 Z",
  // South America
  "M 195,255 L 218,248 L 240,252 L 260,262 L 272,282 L 276,305 L 268,330 L 256,355 L 240,375 L 225,390 L 212,398 L 200,394 L 190,378 L 183,358 L 180,335 L 182,310 L 188,285 L 192,268 Z",
  // Western Europe
  "M 448,80 L 465,72 L 480,70 L 498,72 L 512,78 L 520,88 L 515,100 L 502,106 L 488,108 L 472,106 L 458,100 L 448,92 Z",
  // Iberian Peninsula
  "M 445,105 L 462,98 L 478,100 L 483,112 L 478,124 L 462,128 L 448,122 L 443,112 Z",
  // UK
  "M 455,68 L 470,62 L 480,67 L 478,78 L 466,82 L 454,77 Z",
  // Ireland
  "M 445,72 L 456,68 L 458,76 L 450,80 L 443,76 Z",
  // Scandinavia
  "M 488,42 L 510,35 L 530,38 L 538,50 L 530,64 L 515,70 L 500,67 L 488,58 Z",
  // Main Europe / Eastern Europe
  "M 462,82 L 545,76 L 575,82 L 598,92 L 600,108 L 588,122 L 568,128 L 545,130 L 520,126 L 498,122 L 475,118 L 458,112 L 452,100 Z",
  // Italy
  "M 498,115 L 515,110 L 522,118 L 524,132 L 518,145 L 510,150 L 500,144 L 497,130 Z",
  // Greece
  "M 530,122 L 542,117 L 550,124 L 548,136 L 538,142 L 528,138 L 525,128 Z",
  // Africa
  "M 460,150 L 502,143 L 545,148 L 575,158 L 596,174 L 602,200 L 594,230 L 578,260 L 558,285 L 535,305 L 510,315 L 488,316 L 465,308 L 448,290 L 435,268 L 428,242 L 428,215 L 436,190 L 446,170 L 452,158 Z",
  // Middle East
  "M 592,118 L 630,110 L 658,118 L 672,134 L 670,152 L 655,168 L 635,174 L 612,168 L 596,155 L 590,138 Z",
  // Arabian Peninsula
  "M 600,150 L 640,145 L 665,155 L 672,175 L 665,195 L 648,205 L 625,200 L 608,188 L 600,170 Z",
  // Iran/Persia
  "M 620,105 L 662,98 L 695,104 L 708,118 L 702,134 L 682,140 L 658,138 L 632,130 L 620,118 Z",
  // Central Asia
  "M 660,80 L 730,75 L 780,80 L 808,92 L 805,108 L 785,115 L 755,118 L 722,115 L 695,110 L 668,105 Z",
  // Russia
  "M 495,38 L 640,28 L 760,30 L 845,40 L 868,58 L 860,76 L 828,90 L 785,95 L 740,96 L 700,94 L 658,92 L 615,93 L 575,92 L 538,90 L 510,85 L 492,76 L 485,58 Z",
  // India
  "M 668,132 L 705,127 L 730,135 L 745,152 L 748,175 L 740,195 L 720,210 L 698,215 L 676,210 L 660,196 L 655,178 L 655,158 L 658,142 Z",
  // China
  "M 718,80 L 805,74 L 845,82 L 862,98 L 858,118 L 838,132 L 810,138 L 780,136 L 755,130 L 736,118 L 724,102 Z",
  // Japan
  "M 850,88 L 863,82 L 872,90 L 870,103 L 858,108 L 848,100 Z",
  // Southeast Asia
  "M 745,150 L 780,144 L 805,152 L 815,168 L 808,185 L 785,192 L 762,188 L 745,174 Z",
  // Australia
  "M 778,295 L 830,284 L 878,290 L 910,310 L 915,336 L 902,360 L 875,372 L 840,374 L 808,362 L 785,340 L 776,315 Z",
  // New Zealand
  "M 920,355 L 932,348 L 938,360 L 930,372 L 918,368 Z",
  // Iceland
  "M 428,48 L 450,42 L 462,48 L 460,60 L 445,64 L 430,58 Z",
  // Madagascar
  "M 560,272 L 570,265 L 578,272 L 578,292 L 568,302 L 558,295 Z",
  // Japan (Hokkaido)
  "M 858,78 L 870,74 L 878,80 L 874,90 L 862,90 Z",
];
