# one-hundred-books

Vite + React site listing the Norwegian Book Club's 2002 "100 Best Books" list. Data lives in `src/data/books.js` — one object per book (title, author, country, language, year, region, lat/lng, a Wikipedia `summary`, `wikiUrl`/`authorWikiUrl`, and a Bookshop.org `link`).

## Architecture

`App.jsx` branches on a `useIsMobile()` hook (matchMedia, 700px breakpoint) into two entirely separate component trees — they share `src/data/books.js` and `src/utils/helper.js` but nothing else:

- **Desktop** (`DesktopApp.jsx`, `GridView`/`MapView`/`TimelineView`, `BookCard`, `Modal`, `Header`) — grid/timeline/map views with search and region filtering.
- **Mobile** (`MobileApp.jsx`, `MobileBookList`, `MobileBookCard`, `MobileModal`, `MobileHeader`) — a 3-column card grid, full-screen modal on tap, no search/filter/view-toggle. All mobile components use CSS Modules (`*.module.css`), not inline styles.

A mobile-only visual rewrite is in progress (started 2026-08); desktop is deliberately untouched and may or may not be redesigned to match later.

## Book cover art

`MobileBookCard` and `MobileModal` show real cover art via the `useBookCover(book)` hook (`src/hooks/useBookCover.js`), which chains through three free sources in order and falls back to a plain text card if all fail:

1. **Bookshop.org's own CDN** — `https://images-eu.bookshop.org/images/{isbn}.jpg`, the exact edition sold via the book's `link`. No auth/CORS wall. **Gotcha:** a missing cover returns HTTP 404 but with a real, renderable 200×300px SVG placeholder body — a plain `<img>` treats that as a successful load (fires `onLoad`, not `onError`), so it must be explicitly detected and rejected (`naturalWidth === 200 && naturalHeight === 300` in `useBookCover.js`). Repeatedly hitting this endpoint for a known-404 ISBN can also get slow (~5s, likely Cloudflare throttling repeated/automated requests) — see the `coverIsbn` note below for why that's avoided.
2. **Open Library ISBN cover** — `https://covers.openlibrary.org/b/isbn/{isbn}-{size}.jpg`. Also has a "success" gotcha: a missing cover returns a 200 with a 1×1 pixel placeholder gif, detected via `naturalWidth < 5`.
3. **Open Library title/author search** — free-text query against `https://openlibrary.org/search.json`, scanning results for the first one with a `cover_i` (not just the top hit — the best title match often lacks a cover, but a same-work record under an alternate/original-language title usually has one).

`getIsbn(link)` in `src/utils/helper.js` regex-extracts the trailing 13-digit ISBN from a book's Bookshop.org `link` — there's no separate `isbn` field.

**`coverIsbn` override:** an optional field on a book object, for the rare case where the purchase edition itself has no cover anywhere (e.g. out of print / not yet republished) but a different edition does. When set, `getCoverIsbn()` uses it instead of the link-derived ISBN for cover lookups only — `link`/the buy button still point at the real on-sale edition. When `coverIsbn` is set, `useBookCover` also **skips the Bookshop.org candidate entirely** and goes straight to Open Library, since setting the override means Bookshop's catalog was already manually checked and confirmed not to have it. This is a targeted per-book escape hatch, not a universal two-ISBN scheme — the 3-source chain resolves the other ~99/100 books automatically.

Nothing is downloaded or persisted anywhere — covers are plain `<img src>` tags computed per-render from data already in `books.js`; the only caching is the browser's normal HTTP image cache.

## Data enrichment scripts

One-time scripts in `scripts/` (`fetch-wikipedia-summaries.mjs`, `fix-summaries.mjs`, `merge-summaries.mjs`, `reapply-summary-fixes.mjs`, `fetch-author-wiki-urls*.mjs`, `merge-wiki-links.mjs`) populated the `summary`/`wikiUrl`/`authorWikiUrl` fields from Wikipedia's public REST API. A handful of anthology-style titles with no single matching article (Andersen's fairy tales, Poe's complete tales, Chekhov's selected stories, the Beckett trilogy, Borges's collected fictions, Celan's poems) fall back to the *author's* Wikipedia summary instead of being left blank.
