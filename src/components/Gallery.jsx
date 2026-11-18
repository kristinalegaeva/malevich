import React, { useCallback, useEffect, useRef, useState } from 'react';
import { artworks } from '../data/catalog.js';
import Timeline from './Timeline.jsx';

export default function Gallery({ onOpenArtwork, isLightboxOpen }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef(null);
  const lastWheelTime = useRef(-Infinity);
  const artwork = artworks[activeIndex];
  const lastIndex = artworks.length - 1;

  const selectArtwork = useCallback(index => {
    if (index >= 0 && index <= lastIndex) {
      setActiveIndex(index);
    }
  }, [lastIndex]);

  useEffect(() => {
    function handleKeyDown(event) {
      if (isLightboxOpen || event.defaultPrevented) return;
      if (
        event.target instanceof Element &&
        event.target.closest('input, textarea, select, [contenteditable="true"]')
      ) return;

      const { top, bottom } = rootRef.current.getBoundingClientRect();
      const viewportCenter = window.innerHeight / 2;
      if (top >= viewportCenter || bottom <= viewportCenter) return;

      const destinations = {
        ArrowRight: activeIndex + 1,
        ArrowDown: activeIndex + 1,
        ArrowLeft: activeIndex - 1,
        ArrowUp: activeIndex - 1,
        Home: 0,
        End: lastIndex
      };
      if (!Object.hasOwn(destinations, event.key)) return;
      event.preventDefault();
      selectArtwork(destinations[event.key]);
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, isLightboxOpen, lastIndex, selectArtwork]);

  function handleWheel(event) {
    const delta = event.deltaY + event.deltaX;
    if (event.ctrlKey || Math.abs(delta) < 8) return;

    const now = performance.now();
    if (now - lastWheelTime.current < 220) return;

    lastWheelTime.current = now;
    selectArtwork(activeIndex + Math.sign(delta));
  }

  return (
    <section ref={rootRef} className="collection" id="collection" aria-label="Хронология произведений">
      <div className="gallery">
        <div className="gallery-counter">
          {String(activeIndex + 1).padStart(3, '0')} / {artworks.length}
        </div>

        <div className="gallery-stage" onWheel={handleWheel}>
          <button
            className="gallery-arrow"
            aria-label="Предыдущая картина"
            disabled={activeIndex === 0}
            onClick={() => selectArtwork(activeIndex - 1)}
          >
            &lt;
          </button>
          <button
            className="gallery-artwork"
            aria-label="Открыть картину на весь экран"
            onClick={() => onOpenArtwork(artwork)}
          >
            <img src={artwork.src} alt={`${artwork.title}, ${artwork.year}. Казимир Малевич`} />
            <span>Развернуть ↗</span>
          </button>
          <button
            className="gallery-arrow"
            aria-label="Следующая картина"
            disabled={activeIndex === lastIndex}
            onClick={() => selectArtwork(activeIndex + 1)}
          >
            &gt;
          </button>
        </div>
        <Timeline activeIndex={activeIndex} onSelectArtwork={selectArtwork} />
      </div>
    </section>
  );
}
