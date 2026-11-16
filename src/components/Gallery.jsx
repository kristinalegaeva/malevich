import React, { useCallback, useEffect, useRef, useState } from 'react';
import { artworks } from '../data/catalog.js';
import Timeline from './Timeline.jsx';

export default function Gallery({ onOpen, isLightboxOpen }) {
  const [current, setCurrent] = useState(0);
  const rootRef = useRef(null);
  const lastWheelTime = useRef(-Infinity);
  const artwork = artworks[current];
  const select = useCallback(index => {
    if (index >= 0 && index < artworks.length) setCurrent(index);
  }, []);

  useEffect(() => {
    function handleKeyDown(event) {
      if (isLightboxOpen || event.defaultPrevented) return;
      if (event.target instanceof Element && event.target.closest('input, textarea, select, [contenteditable="true"]')) return;
      const rect = rootRef.current.getBoundingClientRect();
      if (rect.top >= innerHeight / 2 || rect.bottom <= innerHeight / 2) return;
      const destinations = {
        ArrowRight: current + 1, ArrowDown: current + 1,
        ArrowLeft: current - 1, ArrowUp: current - 1,
        Home: 0, End: artworks.length - 1
      };
      if (!(event.key in destinations)) return;
      event.preventDefault();
      select(destinations[event.key]);
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [current, isLightboxOpen, select]);

  function handleWheel(event) {
    const delta = event.deltaY + event.deltaX;
    if (event.ctrlKey || Math.abs(delta) < 8) return;
    const now = performance.now();
    if (now - lastWheelTime.current < 220) return;
    lastWheelTime.current = now;
    select(current + Math.sign(delta));
  }

  return (
    <section ref={rootRef} className="collection" id="collection" aria-label="Хронология произведений">
      <div className="gallery">
        <div className="gallery-top"><span id="counter">{String(current + 1).padStart(3, '0')} / {artworks.length}</span></div>
        <div className="art-stage" onWheel={handleWheel}>
          <button className="arrow previous" aria-label="Предыдущая картина" disabled={current === 0} onClick={() => select(current - 1)}>&lt;</button>
          <button className="art-open" aria-label="Открыть картину на весь экран" onClick={() => onOpen(artwork)}>
            <img id="art-image" src={artwork.src} alt={`${artwork.title}, ${artwork.year}. Казимир Малевич`} />
            <span>Развернуть ↗</span>
          </button>
          <button className="arrow next" aria-label="Следующая картина" disabled={current === artworks.length - 1} onClick={() => select(current + 1)}>&gt;</button>
        </div>
        <Timeline current={current} onSelect={select} />
      </div>
    </section>
  );
}
