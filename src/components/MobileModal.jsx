import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { eraLabel } from "../utils/helper";
import styles from "./MobileModal.module.css";

export default function MobileModal({ book, onClose }) {
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
          <div className={styles.meta}>
            {book.region} · {book.language} · {eraLabel(book.year)}
          </div>
          <h2 className={styles.title}>{book.title}</h2>
          <div className={styles.author}>
            {book.author} · {book.country}
          </div>
          {book.summary && <p className={styles.summary}>{book.summary}</p>}
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
          <p className={styles.disclosure}>
            please note: I will receive a small affiliate fee for the
            forwarding of this book.
          </p>
        </div>
      </div>
    </div>
  );
}
