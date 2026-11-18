import React, { useRef, useState } from 'react';
import { artworks } from '../data/catalog.js';
import FullscreenDialog from './FullscreenDialog.jsx';

function normalizeSearch(value) {
  return value.toLocaleLowerCase('ru').replaceAll('ё', 'е').trim();
}

const collection = artworks.map(artwork => {
  const title = `${artwork.title}, ${artwork.year}`;
  return { artwork, searchText: normalizeSearch(title) };
});

export default function CollectionDialog({ onOpenArtwork, onClose }) {
  const gridRef = useRef(null);
  const searchRef = useRef(null);
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);

  function handleQueryChange(event) {
    setQuery(event.target.value);
    setResult(null);
  }

  function handleSearch(event) {
    event.preventDefault();
    const search = normalizeSearch(query);
    if (!search) {
      searchRef.current.focus();
      return;
    }

    const words = search.split(/\s+/);
    const matches = collection.filter(item => words.every(word => item.searchText.includes(word)));

    if (matches.length === 0) {
      setResult({ item: null, position: 0, total: 0 });
      return;
    }

    const position = result ? (result.position + 1) % matches.length : 0;
    const item = matches[position];
    setResult({ item, position, total: matches.length });

    const tile = gridRef.current.children[collection.indexOf(item)];
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    tile.scrollIntoView({ block: 'center', behavior: reduceMotion ? 'instant' : 'smooth' });
  }

  return (
    <FullscreenDialog className="collection-dialog" label="вся коллекция" onClose={onClose}>
      <header className="collection-toolbar">
        <form className="collection-search" role="search" onSubmit={handleSearch}>
          <input
            ref={searchRef}
            type="search"
            aria-label="название или год картины"
            placeholder="название или год"
            value={query}
            onChange={handleQueryChange}
          />
          <button className="text-action" type="submit">
            <span className="text-action-label">{result?.total > 1 ? 'далее' : 'найти'}</span>
          </button>

          {result && (
            <p className="collection-search-status" role="status">
              {result.item ? `${result.position + 1} из ${result.total}` : 'не найдено'}
            </p>
          )}
        </form>
      </header>

      <div className="collection-scroll">
        <div className="collection-grid" ref={gridRef}>
          {collection.map(item => (
            <button
              key={item.artwork.src}
              type="button"
              className="collection-tile"
              data-highlighted={result?.item === item ? 'true' : undefined}
              onClick={() => onOpenArtwork(item.artwork)}
            >
              <img src={item.artwork.src} alt="" loading="lazy" decoding="async" />
              <span className="collection-tile-caption artwork-caption">
                <span>{item.artwork.title}</span>
                <span className="artwork-caption-year">{item.artwork.year}</span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </FullscreenDialog>
  );
}
