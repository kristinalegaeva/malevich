import { copyFileSync, mkdirSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));

// Keep original assets in place; public contains generated copies for Vite.
function copyDirectory(source, destination, filter = () => true) {
  mkdirSync(destination, { recursive: true });
  for (const entry of readdirSync(source, { withFileTypes: true })) {
    const from = join(source, entry.name);
    const to = join(destination, entry.name);
    if (entry.isDirectory()) {
      copyDirectory(from, to, filter);
    } else if (filter(entry.name)) {
      let target;
      try { target = statSync(to); } catch { /* First copy. */ }
      const original = statSync(from);
      if (!target || target.size !== original.size || target.mtimeMs < original.mtimeMs) {
        copyFileSync(from, to);
      }
    }
  }
}

copyDirectory(join(root, 'assets'), join(root, 'public/assets'));
copyDirectory(join(root, 'Малевич'), join(root, 'public/Малевич'), name => name.startsWith('1 — ') && name.endsWith('.jpg'));
