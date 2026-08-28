import { Fragment } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { eraLabel } from "../utils/helper";
import { useTypewriterWords } from "../hooks/useTypewriterWords";
import styles from "./MobileModal.module.css";

export default function MobileModal({ book, onClose }) {
  const revealedWords = useTypewriterWords(book.summary);

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.dialog}>
        <div className={styles.backdrop}>
          <MapContainer
            center={[book.lat, book.lng]}
            zoom={5}
            zoomControl={false}
            dragging={false}
            scrollWheelZoom={false}
            doubleClickZoom={false}
            touchZoom={false}
            boxZoom={false}
            keyboard={false}
            attributionControl={false}
            className={styles.map}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          </MapContainer>
          <div className={styles.scrim} />
          <div className={styles.pin}>
            <span className={styles.pinPulse} />
            <span className={styles.pinDot} />
          </div>
        </div>

        <button className={styles.close} onClick={onClose} aria-label="Close">
          ×
        </button>

        <div className={styles.panel} onClick={(e) => e.stopPropagation()}>
          <h2 className={styles.title}>
            {book.wikiUrl ? (
              <a
                href={book.wikiUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
              >
                {book.title}
              </a>
            ) : (
              book.title
            )}
          </h2>
          <div className={styles.author}>
            {book.authorWikiUrl ? (
              <a
                href={book.authorWikiUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
              >
                {book.author}
              </a>
            ) : (
              book.author
            )}{" "}
            · {book.country} · {eraLabel(book.year)}
          </div>
          {book.summary && (
            <p className={styles.summary}>
              {revealedWords.map((word, i) => (
                <Fragment key={i}>
                  <span className={styles.word}>{word}</span>{" "}
                </Fragment>
              ))}
            </p>
          )}
          <div className={styles.actions}>
            <a
              href={book.link}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.buyLink}
            >
              Buy this book →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
