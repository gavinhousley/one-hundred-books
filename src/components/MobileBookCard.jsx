import { Fragment, useRef } from "react";
import { useFitWordSizes } from "../hooks/useFitWordSizes";
import styles from "./MobileBookCard.module.css";

function Words({ text, sizes }) {
  return text.split(/\s+/).map((word, i) => (
    <Fragment key={i}>
      <span style={sizes?.[i] ? { fontSize: `${sizes[i]}rem` } : undefined}>
        {word}
      </span>{" "}
    </Fragment>
  ));
}

export default function MobileBookCard({ book, onClick }) {
  const titleRef = useRef(null);
  const authorRef = useRef(null);
  const hasAuthor = book.author !== "Anonymous";

  const titleSizes = useFitWordSizes(titleRef, book.title);
  const authorSizes = useFitWordSizes(authorRef, hasAuthor ? book.author : "");

  return (
    <div className={styles.card} onClick={onClick}>
      <div className={styles.content}>
        <div ref={titleRef} className={styles.title}>
          <Words text={book.title} sizes={titleSizes} />
        </div>
        {hasAuthor && (
          <div ref={authorRef} className={styles.author}>
            <Words text={book.author} sizes={authorSizes} />
          </div>
        )}
      </div>
    </div>
  );
}
