import styles from "./MobileHeader.module.css";

export default function MobileHeader() {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>100 BOOKS</h1>
      <p className={styles.subtitle}>
        100 greatest books of all time as voted by the Norwegian Book Club in
        2002
      </p>
    </header>
  );
}
