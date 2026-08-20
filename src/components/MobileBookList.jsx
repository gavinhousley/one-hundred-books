import MobileBookCard from "./MobileBookCard";
import styles from "./MobileBookList.module.css";

export default function MobileBookList({ books, onSelect }) {
  return (
    <div className={styles.grid}>
      {books.map((book) => (
        <MobileBookCard
          key={book.id}
          book={book}
          onClick={() => onSelect(book)}
        />
      ))}
    </div>
  );
}
