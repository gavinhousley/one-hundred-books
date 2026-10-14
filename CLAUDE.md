# one-hundred-books

Vite + React site listing the Norwegian Book Club's 2002 "100 Best Books" list. Data lives in `src/data/books.js` — one object per book (title, author, country, language, year, region, lat/lng, a Wikipedia `summary`, `wikiUrl`/`authorWikiUrl`, and a Bookshop.org `link`).

## Architecture

`App.jsx` renders `MobileApp` unconditionally — the site is mobile-only now, for every viewport. `MobileApp`/`MobileBookList`/`MobileBookCard`/`MobileModal`/`MobileHeader` (CSS Modules, not inline styles) are the entire live UI: a 3-column card grid, full-screen modal on tap, no search/filter/view-toggle.

`DesktopApp.jsx`, `GridView`/`MapView`/`TimelineView`, `BookCard`, `Modal`, `Header` still exist in the tree (as of the `c32e6d2` "complete redesign for mobile to simplify" commit, 2026-08-20) but are **orphaned — nothing imports or renders them**. Don't assume changes need mirroring there; check whether a component is actually reachable from `App.jsx` before editing it.

## Book cover art

`MobileBookCard` and `MobileModal` show real cover art via the `useBookCover(book)` hook (`src/hooks/useBookCover.js`), which chains through three free sources in order and falls back to a plain text card if all fail:

1. **Bookshop.org's own CDN** — `https://images-eu.bookshop.org/images/{isbn}.jpg`, the exact edition sold via the book's `link`. No auth/CORS wall. **Gotcha:** a missing cover returns HTTP 404 but with a real, renderable 200×300px SVG placeholder body — a plain `<img>` treats that as a successful load (fires `onLoad`, not `onError`), so it must be explicitly detected and rejected (`naturalWidth === 200 && naturalHeight === 300` in `useBookCover.js`). Repeatedly hitting this endpoint for a known-404 ISBN can also get slow (~5s, likely Cloudflare throttling repeated/automated requests) — see the `coverIsbn` note below for why that's avoided.
2. **Open Library ISBN cover** — `https://covers.openlibrary.org/b/isbn/{isbn}-{size}.jpg`. Also has a "success" gotcha: a missing cover returns a 200 with a 1×1 pixel placeholder gif, detected via `naturalWidth < 5`.
3. **Open Library title/author search** — free-text query against `https://openlibrary.org/search.json`, scanning results for the first one with a `cover_i` (not just the top hit — the best title match often lacks a cover, but a same-work record under an alternate/original-language title usually has one).

`getIsbn(link)` in `src/utils/helper.js` regex-extracts the trailing 13-digit ISBN from a book's Bookshop.org `link` — there's no separate `isbn` field.

**`coverIsbn` override:** an optional field on a book object, for the rare case where the purchase edition itself has no cover anywhere (e.g. out of print / not yet republished) but a different edition does. When set, `getCoverIsbn()` uses it instead of the link-derived ISBN for cover lookups only — `link`/the buy button still point at the real on-sale edition. When `coverIsbn` is set, `useBookCover` also **skips the Bookshop.org candidate entirely** and goes straight to Open Library, since setting the override means Bookshop's catalog was already manually checked and confirmed not to have it. This is a targeted per-book escape hatch, not a universal two-ISBN scheme — the 3-source chain resolves the other ~99/100 books automatically.

Nothing is downloaded or persisted anywhere — covers are plain `<img src>` tags computed per-render from data already in `books.js`; the only caching is the browser's normal HTTP image cache.

## Routing and SEO

Each book has its own real route, `/book/{slug}` (`getSlug(book)` in `helper.js`, a kebab-cased title — verified unique across all 100). `App.jsx` registers `/` and `/book/:slug` both pointing at `MobileApp`, which reads `useParams().slug`, looks the book up, and shows `MobileModal` as an overlay when it matches — same UX as before, just URL-driven instead of local state, via `react-router-dom` (`BrowserRouter` wraps `<App />` in `main.jsx`). `MobileBookCard` renders as a real `<Link>` (crawlable `<a href>`), not a `div`+`onClick`.

**Static prerendering** (`scripts/prerender.mjs`, run as part of `npm run build` — i.e. `vite build && node scripts/prerender.mjs`): for each of the 100 books, writes `dist/book/{slug}/index.html` — a copy of the built `dist/index.html` with per-book `<title>`/meta description/OG tags/canonical/JSON-LD swapped in, plus a plain static text+image snapshot dropped into `#root` (so crawlers see real content immediately). The same built JS bundle still loads and `createRoot().render()`s over it for real visitors — this is a full client replace, not `hydrateRoot`, so there's no hydration-mismatch risk from the snapshot markup differing from what React actually renders. Also writes `dist/sitemap.xml` and `dist/robots.txt`.

**Head tag replacement uses explicit markers**, not a blind `</head>` append — `index.html` wraps the site-wide title/description/canonical/OG block in `<!-- SEO:START -->...<!-- SEO:END -->`, and the script regex-replaces everything between them. Learned the hard way: an earlier version just appended per-book tags before `</head>`, leaving two `<title>` and two conflicting `<link rel="canonical">` tags in every generated page — browsers honor the *first* `<title>` in document order, so the per-book one was being silently ignored, and the duplicate canonicals risked search engines treating every book page as a duplicate of the homepage. If editing these markers, keep them as the *exact* literal strings `<!-- SEO:START -->` / `<!-- SEO:END -->` with nothing else inside the comment — the script's regex won't match otherwise, and `String.replace` fails silently (returns the input unchanged) rather than erroring, so a bad marker is easy to ship unnoticed. After any change here, verify with a real rebuild + grep, not just that the build succeeds (e.g. `npm run build && grep "<title>" dist/book/some-slug/index.html` should show the per-book title, not the site-wide one).

The script's `resolveCoverUrl()` mirrors the client-side `useBookCover` chain (Bookshop.org → Open Library ISBN → Open Library search) but verifies each candidate with a real `fetch` at build time (checking content-type / byte size) rather than the browser `onLoad`/`onError` tricks `useBookCover` needs — safe since this runs once at build time, not per-visitor.

**`vercel.json`** (`{"cleanUrls": true, "trailingSlash": false}`) was added because `vite preview`'s local static server does *not* resolve `/book/the-iliad` (no trailing slash/filename) to the nested `dist/book/the-iliad/index.html` — it falls back to serving the root `index.html` instead, which would silently defeat all the prerendering if Vercel's auto-detected Vite preset does the same thing by default. This was **not fully verified against a real Vercel deployment** as of 2026-10-13 — `vite preview`'s behavior isn't a reliable proxy for Vercel's actual edge routing. If covers/content for `/book/*` pages ever look wrong in production (e.g. social share previews showing the homepage), check this first — push a branch, check Vercel's automatic preview deployment URL for a `/book/*` path directly, and compare `view-source:` output against what `scripts/prerender.mjs` generates locally in `dist/`.

**Deployment environment note:** this machine's shell has `NODE_ENV=production` set, which makes plain `npm install` silently skip all `devDependencies` (including `vite` itself — "vite: command not found" if hit). Use `npm install --include=dev` when installing anything here.

## Data enrichment scripts

One-time scripts in `scripts/` (`fetch-wikipedia-summaries.mjs`, `fix-summaries.mjs`, `merge-summaries.mjs`, `reapply-summary-fixes.mjs`, `fetch-author-wiki-urls*.mjs`, `merge-wiki-links.mjs`) populated the `summary`/`wikiUrl`/`authorWikiUrl` fields from Wikipedia's public REST API. A handful of anthology-style titles with no single matching article (Andersen's fairy tales, Poe's complete tales, Chekhov's selected stories, the Beckett trilogy, Borges's collected fictions, Celan's poems) fall back to the *author's* Wikipedia summary instead of being left blank.
