import { books } from "./data/books";
import MobileApp from "./components/MobileApp";

// DesktopApp (src/components/DesktopApp.jsx) holds the original
// Grid/Timeline/Map desktop experience, kept intact but unused for now.
function App() {
  return <MobileApp books={books} />;
}

export default App;
