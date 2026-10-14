// Runs after `vite build`. Writes a static dist/book/{slug}/index.html per
// book — real crawlable title/meta/OG/JSON-LD tags plus a plain text
// snapshot of the content — so search engines see actual content instead of
// an empty SPA shell. The same built JS bundle still boots on top for real
// visitors and takes over with the normal interactive app. Also writes
// sitemap.xml and robots.txt.
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { books } from "../src/data/books.js";
import {
  getSlug,
  getCoverUrl,
  getBookshopCoverUrl,
  fetchSearchCoverUrl,
  eraLabel,
} from "../src/utils/helper.js";

const SITE_URL = "https://onehundredbooks.org";
const distDir = new URL("../dist/", import.meta.url);
const template = await readFile(new URL("index.html", distDir), "utf-8");

// Mirrors the client-side useBookCover chain, but verifies each candidate
// with a real fetch (cheap/safe at build time, run once) instead of a
// browser onLoad trick — so meta tags never point at a broken placeholder.
async function resolveCoverUrl(book) {
  const bookshopUrl = getBookshopCoverUrl(book);
  if (bookshopUrl) {
    const res = await fetch(bookshopUrl);
    const contentType = res.headers.get("content-type") || "";
    if (res.ok && contentType.startsWith("image/") && contentType !== "image/svg+xml") {
      return bookshopUrl;
    }
  }
  const openLibraryUrl = getCoverUrl(book);
  if (openLibraryUrl) {
    const res = await fetch(openLibraryUrl);
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length >= 1000) return openLibraryUrl;
  }
  return await fetchSearchCoverUrl(book.title, book.author);
}

const escapeHtml = (str) =>
  (str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const truncate = (str, max) =>
  !str || str.length <= max ? str || "" : str.slice(0, max - 1).trimEnd() + "…";

// Prevents a `</script>` (or any `<`) inside the data from breaking out of
// the inline JSON-LD script tag.
const toInlineJson = (obj) => JSON.stringify(obj).replace(/</g, "\\u003c");

function renderBookPage(book, coverUrl) {
  const url = `${SITE_URL}/book/${getSlug(book)}`;
  const description = truncate(book.summary, 155);

  const jsonLd = toInlineJson({
    "@context": "https://schema.org",
    "@type": "Book",
    name: book.title,
    author: { "@type": "Person", name: book.author },
    inLanguage: book.language,
    datePublished: String(book.year),
    ...(coverUrl ? { image: coverUrl } : {}),
    description: book.summary,
    url,
  });

  const head = `
    <title>${escapeHtml(book.title)} by ${escapeHtml(book.author)} — 100 Books</title>
    <meta name="description" content="${escapeHtml(description)}" />
    <link rel="canonical" href="${url}" />
    <meta property="og:type" content="book" />
    <meta property="og:title" content="${escapeHtml(book.title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:url" content="${url}" />
    ${coverUrl ? `<meta property="og:image" content="${coverUrl}" />` : ""}
    <meta name="twitter:card" content="summary_large_image" />
    <script type="application/ld+json">${jsonLd}</script>`;

  const content = `
      <a href="/" style="color:#999;font-family:Georgia,serif;font-size:0.85rem">&larr; All 100 Books</a>
      ${coverUrl ? `<img src="${coverUrl}" alt="${escapeHtml(book.title)} cover" width="180" style="display:block;margin:1rem 0" />` : ""}
      <h1 style="color:#f7f4ee;font-family:Georgia,serif;font-weight:normal">${escapeHtml(book.title)}</h1>
      <p style="color:#ccc;font-family:Georgia,serif;font-style:italic">${escapeHtml(book.author)} &middot; ${escapeHtml(book.country)} &middot; ${eraLabel(book.year)}</p>
      ${book.summary ? `<p style="color:#e5e1d8;font-family:Georgia,serif;line-height:1.6">${escapeHtml(book.summary)}</p>` : ""}
      ${book.link ? `<p><a href="${book.link}" style="color:#f7f4ee">Buy this book from Bookshop.org &rarr;</a></p>` : ""}`;

  return template
    .replace(/<!-- SEO:START -->[\s\S]*?<!-- SEO:END -->/, head.trim())
    .replace('<div id="root"></div>', `<div id="root" style="max-width:600px;margin:0 auto;padding:1rem">${content}</div>`);
}

const sitemapUrls = [`${SITE_URL}/`];

for (const book of books) {
  const coverUrl = await resolveCoverUrl(book);
  const slug = getSlug(book);
  const outDir = new URL(`book/${slug}/`, distDir);
  await mkdir(outDir, { recursive: true });
  await writeFile(new URL("index.html", outDir), renderBookPage(book, coverUrl), "utf-8");
  sitemapUrls.push(`${SITE_URL}/book/${slug}`);
  if (!coverUrl) console.log(`  (no cover found for "${book.title}")`);
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls.map((u) => `  <url><loc>${u}</loc></url>`).join("\n")}
</urlset>
`;
await writeFile(new URL("sitemap.xml", distDir), sitemap, "utf-8");

const robots = `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`;
await writeFile(new URL("robots.txt", distDir), robots, "utf-8");

console.log(`Prerendered ${books.length} book pages + sitemap.xml + robots.txt`);
