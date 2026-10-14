import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MobileHeader from "./MobileHeader";
import MobileBookList from "./MobileBookList";
import MobileModal from "./MobileModal";
import { getSlug } from "../utils/helper";
import styles from "./MobileApp.module.css";

export default function MobileApp({ books }) {
  const { slug } = useParams();
  const navigate = useNavigate();
  const sorted = [...books].sort((a, b) => a.year - b.year);
  const selected = slug ? sorted.find((book) => getSlug(book) === slug) : null;

  useEffect(() => {
    document.body.style.overflow = selected ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [selected]);

  return (
    <div className={styles.page}>
      <MobileHeader />
      <MobileBookList books={sorted} />
      {selected && (
        <MobileModal book={selected} onClose={() => navigate("/")} />
      )}
    </div>
  );
}
