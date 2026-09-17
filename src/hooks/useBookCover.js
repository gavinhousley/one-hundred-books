import { useEffect, useState } from "react";
import {
  getCoverUrl,
  getBookshopCoverUrl,
  fetchSearchCoverUrl,
} from "../utils/helper";

// Tries Bookshop.org's own cover (exact edition), then Open Library's ISBN
// cover, then an Open Library title/author search, in order — returns the
// first that resolves, and null once every source has failed.
export function useBookCover(book) {
  const [candidateIndex, setCandidateIndex] = useState(0);
  const [searchCoverUrl, setSearchCoverUrl] = useState(undefined);

  // When a book has a manual `coverIsbn` override, it's because we already
  // confirmed the purchase edition has no cover anywhere — skip straight to
  // Open Library for that known-good edition rather than wasting a request
  // (and a visible delay) on Bookshop.org's catalog, which won't have it.
  const syncCandidates = book.coverIsbn
    ? [getCoverUrl(book)].filter(Boolean)
    : [getBookshopCoverUrl(book), getCoverUrl(book)].filter(Boolean);
  const exhaustedSync = candidateIndex >= syncCandidates.length;
  const needsSearch = exhaustedSync && searchCoverUrl === undefined;

  useEffect(() => {
    if (!needsSearch) return;
    let cancelled = false;
    fetchSearchCoverUrl(book.title, book.author).then((url) => {
      if (!cancelled) setSearchCoverUrl(url);
    });
    return () => {
      cancelled = true;
    };
  }, [needsSearch, book.title, book.author]);

  const src = exhaustedSync ? searchCoverUrl : syncCandidates[candidateIndex];

  const handleFail = () => {
    if (!exhaustedSync) setCandidateIndex((i) => i + 1);
    else setSearchCoverUrl(null);
  };

  return {
    src: src || null,
    onError: handleFail,
    onLoad: (e) => {
      const { naturalWidth: w, naturalHeight: h } = e.target;
      // Open Library returns a 1x1 gif on a "found" 200 when it has no cover.
      // Bookshop.org returns a fixed 200x300 placeholder icon (as a real,
      // renderable SVG) on a 404, so it loads "successfully" too.
      const isOpenLibraryPlaceholder = w < 5;
      const isBookshopPlaceholder = w === 200 && h === 300;
      if (isOpenLibraryPlaceholder || isBookshopPlaceholder) handleFail();
    },
  };
}
