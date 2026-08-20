import styles from "./MobileBookCard.module.css";

export default function MobileBookCard({ book, onClick }) {
  return (
    <div className={styles.card} onClick={onClick}>
      <div className={styles.content}>
        <div className={styles.title}>{book.title}</div>
        {book.author !== "Anonymous" && (
          <div className={styles.author}>{book.author}</div>
        )}
      </div>
    </div>
  );
}
