// Merges the reviewed wikipedia-summaries.json into src/data/books.js by
// inserting a `summary` field right after each entry's `id:` line.
import { readFile, writeFile } from "node:fs/promises";

const summariesPath = new URL("./wikipedia-summaries.json", import.meta.url);
const booksPath = new URL("../src/data/books.js", import.meta.url);

const summaries = JSON.parse(await readFile(summariesPath, "utf-8"));
const byId = new Map(summaries.map((s) => [s.id, s.summary]));

let source = await readFile(booksPath, "utf-8");

source = source.replace(/(\{\s*\n\s*id: (\d+),)/g, (match, prefix, idStr) => {
  const id = Number(idStr);
  const summary = byId.get(id);
  if (!summary) return match;
  const escaped = summary.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
  return `${prefix}\n    summary: "${escaped}",`;
});

await writeFile(booksPath, source);
console.log(`Merged ${[...byId.values()].filter(Boolean).length} summaries into books.js`);
