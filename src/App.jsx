import { Routes, Route } from "react-router-dom";
import { books } from "./data/books";
import MobileApp from "./components/MobileApp";

function App() {
  return (
    <Routes>
      <Route path="/" element={<MobileApp books={books} />} />
      <Route path="/book/:slug" element={<MobileApp books={books} />} />
    </Routes>
  );
}

export default App;
