// One-time enrichment: fetch a short Wikipedia summary for each book in
// src/data/books.js and write the results to a JSON file for review before
// merging the `summary` field into books.js by hand.
//
// Usage: node scripts/fetch-wikipedia-summaries.mjs
import { writeFile } from "node:fs/promises";
import { books } from "../src/data/books.js";

const API = "https://en.wikipedia.org/api/rest_v1/page/summary/";
const USER_AGENT =
  "one-hundred-books-enrichment/1.0 (https://github.com/; personal project data pass)";
const DELAY_MS = 150;
const MAX_SUMMARY_CHARS = 420;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function candidateTitles(book) {
  const t = book.title;
  return [t, `${t} (novel)`, `${t} (book)`, `${t} (play)`, `${t} (poem)`];
}

function normalize(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .split(/\s+/)
    .filter(Boolean);
}

function looksLikeMatch(bookTitle, wikiTitle) {
  const a = new Set(normalize(bookTitle));
  const b = new Set(normalize(wikiTitle));
  if (a.size === 0 || b.size === 0) return false;
  let overlap = 0;
  for (const word of a) if (b.has(word)) overlap++;
  return overlap / a.size >= 0.5;
}

function trimSummary(text) {
  if (!text) return null;
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= MAX_SUMMARY_CHARS) return clean;
  const cut = clean.slice(0, MAX_SUMMARY_CHARS);
  const lastPeriod = cut.lastIndexOf(". ");
  return lastPeriod > 100 ? cut.slice(0, lastPeriod + 1) : cut.trim() + "…";
}

async function fetchSummary(title) {
  const url = API + encodeURIComponent(title.replace(/ /g, "_"));
  const res = await fetch(url, {
    headers: { "User-Agent": USER_AGENT, Accept: "application/json" },
  });
  if (!res.ok) return null;
  const data = await res.json();
  if (data.type === "disambiguation") return null;
  return data;
}

async function resolveBook(book) {
  for (const candidate of candidateTitles(book)) {
    let data;
    try {
      data = await fetchSummary(candidate);
    } catch {
      data = null;
    }
    await sleep(DELAY_MS);
    if (data && data.extract) {
      const wikiTitle = data.title || candidate;
      return {
        id: book.id,
        title: book.title,
        summary: trimSummary(data.extract),
        wikiTitle,
        wikiUrl: data.content_urls?.desktop?.page ?? null,
        needsReview: !looksLikeMatch(book.title, wikiTitle),
      };
    }
  }
  return {
    id: book.id,
    title: book.title,
    summary: null,
    wikiTitle: null,
    wikiUrl: null,
    needsReview: true,
  };
}

async function main() {
  const results = [];
  for (const book of books) {
    const result = await resolveBook(book);
    results.push(result);
    const flag = result.summary === null ? "NO MATCH" : result.needsReview ? "REVIEW" : "ok";
    console.log(`[${flag}] #${book.id} ${book.title} -> ${result.wikiTitle ?? "—"}`);
  }

  const outPath = new URL("./wikipedia-summaries.json", import.meta.url);
  await writeFile(outPath, JSON.stringify(results, null, 2));

  const noMatch = results.filter((r) => r.summary === null);
  const review = results.filter((r) => r.summary !== null && r.needsReview);
  console.log(`\nDone. ${results.length} books processed.`);
  console.log(`${noMatch.length} with no match, ${review.length} flagged for review.`);
  console.log(`Written to ${outPath.pathname}`);
}

main();
