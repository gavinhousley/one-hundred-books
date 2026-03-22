import { regionColors } from "../data/books";
import { eraLabel } from "../utils/helper";
import styles from "./BookCard.module.css";

export default function BookCard({ book, zoom, onClick }) {
  const showDetails = zoom > 0.65;
  const showYear = zoom > 0.45;

  const titleTruncated =
    zoom < 0.6 && book.title.length > 20
      ? book.title.slice(0, 18) + "…"
      : zoom < 0.9 && book.title.length > 35
        ? book.title.slice(0, 33) + "…"
        : book.title;

  return (
    <div
      className={styles.card}
      onClick={onClick}
      style={{
        borderTopColor: regionColors[book.region],
        padding: zoom > 0.7 ? "1rem" : "0.6rem",
      }}
    >
      <div>
        {showYear && (
          <div
            className={styles.year}
            style={{ fontSize: `${Math.max(0.5, 0.6 * zoom)}rem` }}
          >
            {eraLabel(book.year)}
          </div>
        )}
        <div
          className={styles.title}
          style={{ fontSize: `${Math.max(0.6, 0.82 * zoom)}rem` }}
        >
          {titleTruncated}
        </div>
        {showDetails && (
          <div
            className={styles.author}
            style={{ fontSize: `${Math.max(0.5, 0.7 * zoom)}rem` }}
          >
            {book.author}
          </div>
        )}
      </div>

      {showDetails && (
        <div className={styles.footer}>
          <div
            className={styles.country}
            style={{ fontSize: `${Math.max(0.45, 0.6 * zoom)}rem` }}
          >
            {book.country}
          </div>
          <div
            className={styles.dot}
            style={{ background: regionColors[book.region] }}
          />
        </div>
      )}
    </div>
  );
}
