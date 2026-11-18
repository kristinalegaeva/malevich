import { copyFileSync, mkdirSync, readdirSync, statSync, unlinkSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));

// Keep original assets in place; public contains generated copies for Vite.
function copyDirectory(source, destination, filter = () => true) {
  mkdirSync(destination, { recursive: true });
  const entries = readdirSync(source, { withFileTypes: true });
  const copiedFiles = new Set();
  for (const entry of entries) {
    const from = join(source, entry.name);
    const to = join(destination, entry.name);
    if (entry.isDirectory()) {
      copyDirectory(from, to, filter);
    } else if (entry.isFile() && filter(entry.name)) {
      copiedFiles.add(entry.name);
      let target;
      try { target = statSync(to); } catch { /* First copy. */ }
      const original = statSync(from);
      if (!target || target.size !== original.size || target.mtimeMs < original.mtimeMs) {
        copyFileSync(from, to);
      }
    }
  }

  for (const entry of readdirSync(destination, { withFileTypes: true })) {
    if (entry.isFile() && !copiedFiles.has(entry.name)) {
      unlinkSync(join(destination, entry.name));
    }
  }
}

copyDirectory(join(root, 'assets'), join(root, 'public/assets'));

const artworkSource = join(root, 'Малевич');
const artworkOutput = join(root, 'public/Малевич');
const isSelectedArtwork = name => name.startsWith('1 — ') && name.endsWith('.jpg');

copyDirectory(artworkSource, artworkOutput, isSelectedArtwork);
