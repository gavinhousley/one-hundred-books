// Re-applies corrected/fallback entries into books.js for ids that were
// already merged once. Two kinds of fix:
//  - `workFixes`: replace with the correct specific-work Wikipedia summary
//  - `authorFallback`: no dedicated Wikipedia page exists for the specific
//    anthology/collection title, so fall back to the author's own page
import { readFile, writeFile } from "node:fs/promises";

const summariesPath = new URL("./wikipedia-summaries.json", import.meta.url);
const booksPath = new URL("../src/data/books.js", import.meta.url);
const API = "https://en.wikipedia.org/api/rest_v1/page/summary/";
const USER_AGENT = "one-hundred-books-enrichment/1.0";
const MAX_SUMMARY_CHARS = 420;

const workFixes = {
  1: "Epic_of_Gilgamesh",
  7: "Medea_(play)",
  29: "Faust,_Part_One",
  52: "Hunger_(Hamsun_novel)",
  96: "History_(novel)",
  99: "Nineteen_Eighty-Four",
};

const authorFallback = {
  31: "Hans Christian Andersen",
  33: "Edgar Allan Poe",
  54: "Anton Chekhov",
  79: "Samuel Beckett",
  85: "Jorge Luis Borges",
  95: "Paul Celan",
};

function trimSummary(text) {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= MAX_SUMMARY_CHARS) return clean;
  const cut = clean.slice(0, MAX_SUMMARY_CHARS);
  const lastPeriod = cut.lastIndexOf(". ");
  return lastPeriod > 100 ? cut.slice(0, lastPeriod + 1) : cut.trim() + "…";
}

async function fetchSummary(title) {
  const res = await fetch(API + encodeURIComponent(title.replace(/ /g, "_")), {
    headers: { "User-Agent": USER_AGENT, Accept: "application/json" },
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.extract ? trimSummary(data.extract) : null;
}

const summaries = JSON.parse(await readFile(summariesPath, "utf-8"));
const byId = new Map(summaries.map((s) => [s.id, s.summary]));

for (const [idStr, wikiTitle] of Object.entries(workFixes)) {
  const summary = await fetchSummary(wikiTitle);
  byId.set(Number(idStr), summary);
  console.log(`[work] #${idStr} -> ${wikiTitle}: ${summary ? "ok" : "FAILED"}`);
  await new Promise((r) => setTimeout(r, 150));
}

for (const [idStr, authorName] of Object.entries(authorFallback)) {
  const summary = await fetchSummary(authorName);
  byId.set(Number(idStr), summary);
  console.log(`[author fallback] #${idStr} -> ${authorName}: ${summary ? "ok" : "FAILED"}`);
  await new Promise((r) => setTimeout(r, 150));
}

const idsToFix = [
  ...Object.keys(workFixes).map(Number),
  ...Object.keys(authorFallback).map(Number),
];

let source = await readFile(booksPath, "utf-8");
for (const id of idsToFix) {
  const summary = byId.get(id);
  const blockRe = new RegExp(
    `(\\{\\s*\\n\\s*id: ${id},\\n)(\\s*summary: "(?:[^"\\\\]|\\\\.)*",\\n)?`,
  );
  source = source.replace(blockRe, (match, idLine) => {
    if (!summary) return idLine;
    const escaped = summary.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
    return `${idLine}    summary: "${escaped}",\n`;
  });
}

await writeFile(booksPath, source);
console.log(`\nReapplied fixes for ids: ${idsToFix.join(", ")}`);
