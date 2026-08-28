// One-time enrichment: fetch each unique author's own Wikipedia page URL
// (separate from the book/work page already stored as `wikiUrl`).
import { writeFile } from "node:fs/promises";
import { books } from "../src/data/books.js";

const API = "https://en.wikipedia.org/api/rest_v1/page/summary/";
const USER_AGENT = "one-hundred-books-enrichment/1.0";
const DELAY_MS = 150;

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

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  const uniqueAuthors = [...new Set(books.map((b) => b.author))].filter(
    (a) => a !== "Anonymous",
  );

  const results = {};
  for (const author of uniqueAuthors) {
    const data = await fetchSummary(author);
    results[author] = data
      ? { wikiTitle: data.title, wikiUrl: data.content_urls?.desktop?.page ?? null }
      : { wikiTitle: null, wikiUrl: null };
    console.log(`${data ? "[ok]" : "[NO MATCH]"} ${author} -> ${data?.title ?? "—"}`);
    await sleep(DELAY_MS);
  }

  const outPath = new URL("./author-wiki-urls.json", import.meta.url);
  await writeFile(outPath, JSON.stringify(results, null, 2));
  console.log(`\nWritten to ${outPath.pathname}`);
}

main();
