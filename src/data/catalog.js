import sourceArtworks from './artworks.js';
import { assetUrl } from '../utils/assetUrl.js';

export const periods = [
  { name: 'Ранние поиски', dates: '1900–1909' },
  { name: 'Неопримитивизм', dates: '1910–1912' },
  { name: 'Кубофутуризм', dates: '1913–1915' },
  { name: 'Супрематизм', dates: '1915 — начало 1920-х' },
  { name: 'Постсупрематизм', dates: 'конец 1920-х — начало 1930-х' },
  { name: 'Поздняя фигуративная живопись', dates: '1932–1935' }
];

// Preliminary grouping from filenames, not a scholarly attribution.
export function getPeriod(artwork) {
  if (artwork.year >= 1932) return 5;
  if (artwork.year >= 1928) return 4;
  if (artwork.year > 1915 || (
    artwork.year === 1915 && /супрем|квадрат|круг|крест/i.test(artwork.title)
  )) return 3;
  if (artwork.year >= 1913) return 2;
  return artwork.year >= 1910 ? 1 : 0;
}

export const artworks = sourceArtworks.map(artwork => ({
  ...artwork,
  src: assetUrl(artwork.src),
  period: getPeriod(artwork)
}));
