import MobileBookCard from "./MobileBookCard";
import { getSlug } from "../utils/helper";
import styles from "./MobileBookList.module.css";

export default function MobileBookList({ books }) {
  return (
    <div className={styles.grid}>
      {books.map((book) => (
        <MobileBookCard key={book.id} book={book} to={`/book/${getSlug(book)}`} />
      ))}
    </div>
  );
}
