// Retries just the authors that failed (likely due to rate limiting or a
// missing exact-title match) from fetch-author-wiki-urls.mjs, with backoff.
import { readFile, writeFile } from "node:fs/promises";

const API = "https://en.wikipedia.org/api/rest_v1/page/summary/";
const USER_AGENT = "one-hundred-books-enrichment/1.0 (personal project)";
const DELAY_MS = 800;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchSummary(title, attempt = 1) {
  const res = await fetch(API + encodeURIComponent(title.replace(/ /g, "_")), {
    headers: { "User-Agent": USER_AGENT, Accept: "application/json" },
  });
  if (res.status === 429) {
    if (attempt > 4) return null;
    const backoff = 5000 * attempt;
    console.log(`  rate limited, backing off ${backoff}ms...`);
    await sleep(backoff);
    return fetchSummary(title, attempt + 1);
  }
  if (!res.ok) return null;
  const data = await res.json();
  if (data.type === "disambiguation") return null;
  return data;
}

// author name in books.js -> corrected Wikipedia title to try
const corrections = {
  "Kali dasa": "Kalidasa",
  Saadi: "Saadi Shirazi",
  "Denis Diderot": "Denis Diderot",
  Goethe: "Johann Wolfgang von Goethe",
  "Fernando Pessoa": "Fernando Pessoa",
  "Jorge Luis Borges": "Jorge Luis Borges",
  "Chinua Achebe": "Chinua Achebe",
  "Tayeb Salih": "Tayeb Salih",
  "José Saramago": "José Saramago",
  "Juan Rulfo": "Juan Rulfo",
  "João Guimarães Rosa": "João Guimarães Rosa",
  "Paul Celan": "Paul Celan",
  "Elsa Morante": "Elsa Morante",
};

async function main() {
  const path = new URL("./author-wiki-urls.json", import.meta.url);
  const results = JSON.parse(await readFile(path, "utf-8"));

  for (const [author, tryTitle] of Object.entries(corrections)) {
    const data = await fetchSummary(tryTitle);
    results[author] = data
      ? { wikiTitle: data.title, wikiUrl: data.content_urls?.desktop?.page ?? null }
      : { wikiTitle: null, wikiUrl: null };
    console.log(`${data ? "[ok]" : "[still no match]"} ${author} -> ${data?.title ?? "—"}`);
    await sleep(DELAY_MS);
  }

  await writeFile(path, JSON.stringify(results, null, 2));
  console.log("\nUpdated", path.pathname);
}

main();
