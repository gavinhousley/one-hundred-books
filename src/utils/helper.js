const eraLabel = (year) => {
  if (year < 0) return `${Math.abs(year)} BC`;
  if (year < 1000) return `${year} AD`;
  return `${year}`;
};

const getCentury = (year) => {
  const c = Math.ceil(Math.abs(year) / 100);
  const suffix = c === 1 ? "st" : c === 2 ? "nd" : c === 3 ? "rd" : "th";

  if (year < 0) return `${c}${suffix} Century BC`;
  return `${c}${suffix} Century`;
};

function project(lat, lng) {
  const x = ((lng + 180) / 360) * 1000;
  const y = ((90 - lat) / 180) * 507;
  return { x, y };
}

const getIsbn = (link) => {
  const match = link?.match(/(\d{13})$/);
  return match ? match[1] : null;
};

// A book's purchase-link ISBN is normally also the right one for cover art,
// but occasionally the edition on sale (e.g. not yet back in print) has no
// cover anywhere while another edition does. `coverIsbn`, when set on a book,
// overrides just the cover lookup — the `link` field (and buy button) still
// points at the real edition being sold.
const getCoverIsbn = (book) => book.coverIsbn || getIsbn(book.link);

const getCoverUrl = (book, size = "M") => {
  const isbn = getCoverIsbn(book);
  return isbn ? `https://covers.openlibrary.org/b/isbn/${isbn}-${size}.jpg` : null;
};

const getBookshopCoverUrl = (book) => {
  const isbn = getCoverIsbn(book);
  return isbn ? `https://images-eu.bookshop.org/images/${isbn}.jpg` : null;
};

const fetchSearchCoverUrl = async (title, author, size = "M") => {
  // Free-text query (rather than exact title/author fields) so a work indexed
  // under its original-language or alternate title (e.g. an Italian or Arabic
  // original) still turns up. Scan the top results for the first one that
  // actually has a cover, since the closest title match often doesn't.
  const q = author && author !== "Anonymous" ? `${title} ${author}` : title;
  const params = new URLSearchParams({ q, fields: "cover_i", limit: "5" });
  try {
    const res = await fetch(`https://openlibrary.org/search.json?${params}`);
    if (!res.ok) return null;
    const data = await res.json();
    const coverId = data.docs?.find((doc) => doc.cover_i)?.cover_i;
    return coverId ? `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg` : null;
  } catch {
    return null;
  }
};

export {
  eraLabel,
  getCentury,
  project,
  getIsbn,
  getCoverUrl,
  getBookshopCoverUrl,
  fetchSearchCoverUrl,
};
