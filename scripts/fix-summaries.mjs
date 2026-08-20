// Manual corrections for entries fetch-wikipedia-summaries.mjs got wrong
// or missed. Run after the main script; merges fixes into the same
// wikipedia-summaries.json.
import { readFile, writeFile } from "node:fs/promises";

const API = "https://en.wikipedia.org/api/rest_v1/page/summary/";
const USER_AGENT =
  "one-hundred-books-enrichment/1.0 (https://github.com/; personal project data pass)";
const MAX_SUMMARY_CHARS = 420;

function trimSummary(text) {
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

// id -> corrected candidate Wikipedia title
const corrections = {
  13: "Njáls saga",
  15: "One Thousand and One Nights",
  18: "Masnavi",
  19: "Bustan (book)",
  21: "Essays (Montaigne)",
  28: "The Life and Opinions of Tristram Shandy, Gentleman",
  45: "Demons (Dostoevsky novel)",
  50: "Sentimental Education",
  53: "A Madman's Diary",
  56: "The Metamorphosis",
  92: "Blindness (novel)",
};

async function main() {
  const path = new URL("./wikipedia-summaries.json", import.meta.url);
  const results = JSON.parse(await readFile(path, "utf-8"));
  const byId = new Map(results.map((r) => [r.id, r]));

  for (const [idStr, title] of Object.entries(corrections)) {
    const id = Number(idStr);
    const data = await fetchSummary(title);
    if (data && data.extract) {
      byId.set(id, {
        ...byId.get(id),
        summary: trimSummary(data.extract),
        wikiTitle: data.title,
        wikiUrl: data.content_urls?.desktop?.page ?? null,
        needsReview: false,
      });
      console.log(`[fixed] #${id} -> ${data.title}`);
    } else {
      console.log(`[still no match] #${id} tried "${title}"`);
    }
    await new Promise((r) => setTimeout(r, 150));
  }

  const merged = [...byId.values()].sort((a, b) => a.id - b.id);
  await writeFile(path, JSON.stringify(merged, null, 2));
  console.log("Merged corrections into", path.pathname);
}

main();
