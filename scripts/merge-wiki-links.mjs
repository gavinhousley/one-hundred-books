// Merges book-page `wikiUrl` and author-page `authorWikiUrl` into books.js.
import { readFile, writeFile } from "node:fs/promises";
import { books } from "../src/data/books.js";

const summariesPath = new URL("./wikipedia-summaries.json", import.meta.url);
const authorUrlsPath = new URL("./author-wiki-urls.json", import.meta.url);
const booksPath = new URL("../src/data/books.js", import.meta.url);

const summaries = JSON.parse(await readFile(summariesPath, "utf-8"));
const authorUrls = JSON.parse(await readFile(authorUrlsPath, "utf-8"));

const summaryById = new Map(summaries.map((s) => [s.id, s]));

// Books with no dedicated work page (anthology-style titles) fall back to
// the author's own page for the title link too.
const NO_WORK_PAGE_IDS = new Set([31, 33, 54, 79, 85, 95]);

function escape(str) {
  return str.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

let source = await readFile(booksPath, "utf-8");

for (const book of books) {
  const authorEntry = authorUrls[book.author];
  const authorWikiUrl = authorEntry?.wikiUrl ?? null;

  const summaryEntry = summaryById.get(book.id);
  const wikiUrl = NO_WORK_PAGE_IDS.has(book.id)
    ? authorWikiUrl
    : (summaryEntry?.wikiUrl ?? authorWikiUrl);

  const blockRe = new RegExp(`(\\{\\s*\\n\\s*id: ${book.id},\\n)`);
  source = source.replace(blockRe, (match, idLine) => {
    let insert = idLine;
    if (wikiUrl) insert += `    wikiUrl: "${escape(wikiUrl)}",\n`;
    if (authorWikiUrl) insert += `    authorWikiUrl: "${escape(authorWikiUrl)}",\n`;
    return insert;
  });
}

await writeFile(booksPath, source);
console.log(`Merged wikiUrl/authorWikiUrl for ${books.length} books`);
