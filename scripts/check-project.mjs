import assert from 'node:assert/strict';
import { readFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import artworks from '../src/data/artworks.js';

const root = fileURLToPath(new URL('../', import.meta.url));
assert.equal(artworks.length, 184, 'Expected 184 selected paintings');
assert.equal(new Set(artworks.map(artwork => artwork.src)).size, artworks.length, 'Duplicate image paths');

for (const artwork of artworks) {
  assert.ok(artwork.src.startsWith('Малевич/1 — '), `Unexpected image: ${artwork.src}`);
  const file = statSync(join(root, artwork.src));
  assert.ok(file.size > 0 && file.size < 100 * 1024 * 1024, `Invalid image size: ${artwork.src}`);
}

const css = readFileSync(join(root, 'src/styles/base.css'), 'utf8');
const fontPaths = [...css.matchAll(/url\('\/(assets\/[^']+)'\)/g)].map(match => match[1]);
for (const file of ['assets/header.svg', 'assets/header phone.svg', 'assets/timeline-line.svg', ...fontPaths]) {
  assert.ok(statSync(join(root, file)).size > 0, `Missing asset: ${file}`);
}
console.log(`Checked ${artworks.length} paintings, SVGs and fonts.`);
