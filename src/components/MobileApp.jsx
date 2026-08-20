import { useState, useEffect } from "react";
import MobileHeader from "./MobileHeader";
import MobileBookList from "./MobileBookList";
import MobileModal from "./MobileModal";
import styles from "./MobileApp.module.css";

export default function MobileApp({ books }) {
  const [selected, setSelected] = useState(null);
  const sorted = [...books].sort((a, b) => a.year - b.year);

  useEffect(() => {
    document.body.style.overflow = selected ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [selected]);

  return (
    <div className={styles.page}>
      <MobileHeader />
      <MobileBookList books={sorted} onSelect={setSelected} />
      {selected && (
        <MobileModal book={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
