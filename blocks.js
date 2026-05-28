/**
 * blocks.js  — page orchestrator (EDS: this becomes scripts/scripts.js)
 *
 * Rules (from project structure):
 *  1. Each block exports one default function — plain ES modules, no bundlers
 *  2. HTML files are empty containers — this script fills them at runtime
 *  3. All content lives in data/ — never hardcoded in HTML or block JS
 *  4. CSS uses only :root variables — no hardcoded hex except --red
 *  5. localStorage keys all prefixed adobe_clubs_
 */

import { seedDefaultUser } from './utils/auth-helpers.js';

/** Load data from the JSON file */
async function loadData() {
  const res = await fetch('./data/data.json');
  if (!res.ok) throw new Error(`Failed to load data: ${res.status}`);
  return res.json();
}

/** Dynamically import a block's CSS and JS, then call its default export */
async function loadBlock(name, containerSelector, data) {
  const el = document.querySelector(containerSelector);
  if (!el) return;

  // Inject CSS
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = `./blocks/${name}/${name}.css`;
  document.head.appendChild(link);

  // Import JS and decorate
  const mod = await import(`./blocks/${name}/${name}.js`);
  await mod.default(el, data);
}

/** Main entry point */
async function init() {
  // Seed a default user for dev (no-op if user already exists)
  const data = await loadData();
  seedDefaultUser(data.user);

  // Decorate every block in order
  await loadBlock('nav',           '#block-nav',           { user: data.user });
  await loadBlock('hero',          '#block-hero',          { stats: data.stats, events: data.events });
  await loadBlock('clubs-grid',       '#block-clubs-grid',       { clubs: data.clubs });
  await loadBlock('upcoming-events',  '#block-upcoming-events',  { events: data.events });
  await loadBlock('activity-feed', '#block-activity-feed', { feed: data.feed });
  await loadBlock('announcements', '#block-announcements', { announcements: data.announcements });
  await loadBlock('merch-strip',   '#block-merch-strip',   { merch: data.merch });

  // Remove loading state
  document.body.classList.remove('loading');
  document.body.classList.add('loaded');
}

init().catch(err => {
  console.error('[blocks.js] init failed:', err);
});
