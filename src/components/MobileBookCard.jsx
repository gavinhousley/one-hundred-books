import { useRef } from "react";
import { useFitFontSize } from "../hooks/useFitFontSize";
import styles from "./MobileBookCard.module.css";

export default function MobileBookCard({ book, onClick }) {
  const titleRef = useRef(null);
  const authorRef = useRef(null);
  const hasAuthor = book.author !== "Anonymous";

  const titleFit = useFitFontSize(titleRef, book.title);
  const authorFit = useFitFontSize(authorRef, hasAuthor ? book.author : "");

  return (
    <div className={styles.card} onClick={onClick}>
      <div className={styles.content}>
        <div
          ref={titleRef}
          className={styles.title}
          style={titleFit ? { fontSize: `${titleFit}rem` } : undefined}
        >
          {book.title}
        </div>
        {hasAuthor && (
          <div
            ref={authorRef}
            className={styles.author}
            style={authorFit ? { fontSize: `${authorFit}rem` } : undefined}
          >
            {book.author}
          </div>
        )}
      </div>
    </div>
  );
}
