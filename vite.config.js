import { defineConfig } from 'vite';

// Relative assets work both at a domain root and at /repository/ on GitHub Pages.
export default defineConfig({ base: './' });
