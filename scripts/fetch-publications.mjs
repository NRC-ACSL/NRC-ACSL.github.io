#!/usr/bin/env node
// Regenerates src/content/publications.yaml from a Google Scholar profile via SerpApi.
//
//   SERPAPI_KEY=... node scripts/fetch-publications.mjs
//
// Design notes:
// - Google Scholar has no official API; SerpApi is the reliable, CI-friendly way to read it.
// - Paginates with start/num so it keeps working as the profile grows past 100 papers.
// - On ANY error (missing key, HTTP error, no papers) it exits non-zero WITHOUT writing,
//   so a bad fetch can never blank out the committed list — the last good file stays.

import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const AUTHOR_ID = process.env.SCHOLAR_AUTHOR_ID || 'cXS5b4sAAAAJ';
const API_KEY = process.env.SERPAPI_KEY;
// SerpApi Scholar Author API max is 100; overridable (e.g. PAGE_SIZE=20) to test pagination.
const PAGE_SIZE = Math.min(parseInt(process.env.PAGE_SIZE, 10) || 100, 100);
const OUT = resolve(dirname(fileURLToPath(import.meta.url)), '../src/content/publications.yaml');
const VALID_TYPES = ['Conference', 'Journal', 'Preprint', 'Workshop', 'Report', 'Thesis'];

if (!API_KEY) {
  console.error('ERROR: SERPAPI_KEY environment variable is not set. Aborting (file left unchanged).');
  process.exit(1);
}

/** Fetch every article across all pages. */
async function fetchAllArticles() {
  const articles = [];
  for (let start = 0; ; start += PAGE_SIZE) {
    const url = new URL('https://serpapi.com/search.json');
    url.searchParams.set('engine', 'google_scholar_author');
    url.searchParams.set('author_id', AUTHOR_ID);
    url.searchParams.set('num', String(PAGE_SIZE));
    url.searchParams.set('start', String(start));
    url.searchParams.set('sort', 'pubdate'); // newest first
    url.searchParams.set('api_key', API_KEY);

    const res = await fetch(url);
    if (!res.ok) throw new Error(`SerpApi HTTP ${res.status} ${res.statusText}`);
    const data = await res.json();
    if (data.error) throw new Error(`SerpApi error: ${data.error}`);

    const page = data.articles ?? [];
    articles.push(...page);

    // Stop when there is no next page or the page wasn't full.
    if (!data.serpapi_pagination?.next || page.length < PAGE_SIZE) break;
    if (start > 2000) break; // hard safety stop
  }
  return articles;
}

function slugify(s) {
  return s.toLowerCase().normalize('NFKD').replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-').slice(0, 60);
}

/** Best-effort type inference from the venue/publication string (Scholar gives no type). */
function inferType(venue, title) {
  const v = `${venue} ${title}`.toLowerCase();
  if (/\barxiv\b|preprint/.test(v)) return 'Preprint';
  if (/\b(thesis|dissertation)\b/.test(v)) return 'Thesis';
  if (/\b(tech(nical)? report|white ?paper)\b/.test(v)) return 'Report';
  if (/\bworkshop\b/.test(v)) return 'Workshop';
  if (/\b(proceedings|conference|symposium|congress)\b/.test(v)) return 'Conference';
  if (/\b(journal|transactions|letters|surveys|magazine)\b/.test(v)) return 'Journal';
  return 'Journal'; // sensible fallback
}

function yamlStr(s) {
  // JSON string escaping is a valid YAML double-quoted scalar.
  return JSON.stringify(String(s));
}

function toYaml(pubs) {
  const lines = [
    '# AUTO-GENERATED from Google Scholar via scripts/fetch-publications.mjs',
    '# Do not edit by hand — changes are overwritten on the next refresh.',
    `# Last generated: ${new Date().toISOString()}`,
    '',
  ];
  for (const p of pubs) {
    lines.push(`- id: ${p.id}`);
    lines.push(`  title: ${yamlStr(p.title)}`);
    lines.push(`  authors: [${p.authors.map(yamlStr).join(', ')}]`);
    lines.push(`  venue: ${yamlStr(p.venue)}`);
    lines.push(`  year: ${p.year}`);
    lines.push(`  type: ${p.type}`);
    if (p.link) lines.push(`  link: ${yamlStr(p.link)}`);
    if (typeof p.citations === 'number') lines.push(`  citations: ${p.citations}`);
    lines.push('');
  }
  return lines.join('\n');
}

async function main() {
  console.log(`Fetching Google Scholar articles for author ${AUTHOR_ID} …`);
  const raw = await fetchAllArticles();
  if (raw.length === 0) throw new Error('No articles returned — refusing to overwrite the existing list.');

  const seen = new Set();
  const pubs = [];
  for (const a of raw) {
    const title = (a.title || '').trim();
    const year = parseInt(a.year, 10);
    if (!title || !Number.isFinite(year)) continue; // skip entries we can't place

    const venue = (a.publication || '').trim() || 'Unknown venue';
    let id = `${slugify(title)}-${year}`;
    while (seen.has(id)) id += '-x';
    seen.add(id);

    const citations = parseInt(a.cited_by?.value, 10);
    pubs.push({
      id,
      title,
      authors: (a.authors || '').split(',').map((s) => s.trim()).filter(Boolean),
      venue,
      year,
      type: inferType(venue, title),
      link: a.link || undefined,
      citations: Number.isFinite(citations) ? citations : undefined,
    });
  }

  if (pubs.length === 0) throw new Error('No usable articles (all missing title/year) — refusing to overwrite.');
  pubs.sort((a, b) => b.year - a.year || a.title.localeCompare(b.title));

  writeFileSync(OUT, toYaml(pubs), 'utf8');
  console.log(`Wrote ${pubs.length} publications to ${OUT}`);
}

main().catch((err) => {
  console.error(`ERROR: ${err.message}`);
  console.error('publications.yaml was NOT modified.');
  process.exit(1);
});
