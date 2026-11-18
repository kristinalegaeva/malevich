import sourceArtworks from './artworks.js';
import { assetUrl } from '../utils/assetUrl.js';

export const periods = [
  { name: 'ранние поиски', dates: '1900–1909' },
  { name: 'неопримитивизм', dates: '1910–1912' },
  { name: 'кубофутуризм', dates: '1913–1915' },
  { name: 'супрематизм', dates: '1915 — начало 1920-х' },
  { name: 'постсупрематизм', dates: 'конец 1920-х — начало 1930-х' },
  { name: 'поздняя фигуративная живопись', dates: '1932–1935' }
];

// Preliminary grouping from filenames, not a scholarly attribution.
function getPeriod({ year, title }) {
  if (year >= 1932) return 5;
  if (year >= 1928) return 4;
  const isEarlySuprematism = year === 1915 && /супрем|квадрат|круг|крест/i.test(title);
  if (year > 1915 || isEarlySuprematism) return 3;

  if (year >= 1913) return 2;
  return year >= 1910 ? 1 : 0;
}

export const artworks = sourceArtworks.map(artwork => ({
  ...artwork,
  src: assetUrl(artwork.src),
  period: getPeriod(artwork)
}));
