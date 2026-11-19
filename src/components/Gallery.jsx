import React, { useCallback, useEffect, useRef, useState } from 'react';
import { artworks } from '../data/catalog.js';
import Timeline from './Timeline.jsx';

export default function Gallery({ onOpenArtwork, onOpenCollection, isDialogOpen }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef(null);
  const lastWheelTime = useRef(-Infinity);
  const touchStart = useRef(null);
  const swiped = useRef(false);
  const artwork = artworks[activeIndex];
  const lastIndex = artworks.length - 1;

  const selectArtwork = useCallback(index => {
    if (index >= 0 && index <= lastIndex) {
      setActiveIndex(index);
    }
  }, [lastIndex]);

  useEffect(() => {
    function handleKeyDown(event) {
      if (isDialogOpen || event.defaultPrevented) return;
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
  }, [activeIndex, isDialogOpen, lastIndex, selectArtwork]);

  function handleWheel(event) {
    const delta = event.deltaY + event.deltaX;
    if (event.ctrlKey || Math.abs(delta) < 8) return;

    const now = performance.now();
    if (now - lastWheelTime.current < 220) return;

    lastWheelTime.current = now;
    selectArtwork(activeIndex + Math.sign(delta));
  }

  function handlePointerDown(event) {
    swiped.current = false;
    if (event.pointerType !== 'touch' || !event.isPrimary) return;
    touchStart.current = { id: event.pointerId, x: event.clientX, y: event.clientY };
  }

  function handlePointerUp(event) {
    const start = touchStart.current;
    if (start?.id !== event.pointerId) return;
    touchStart.current = null;

    const x = event.clientX - start.x;
    const y = event.clientY - start.y;
    if (Math.abs(x) < 40 || Math.abs(x) < Math.abs(y) * 1.3) return;

    swiped.current = true;
    selectArtwork(activeIndex - Math.sign(x));
  }

  function handleStageClick(event) {
    if (!swiped.current || event.detail === 0) return;
    swiped.current = false;
    event.stopPropagation();
  }

  return (
    <section ref={rootRef} className="collection" id="collection" aria-label="хронология произведений">
      <div className="gallery">
        <div className="gallery-toolbar">
          <button className="gallery-collection-button text-action" onClick={onOpenCollection}>
            <span className="text-action-label">коллекция</span>
          </button>
          <span className="gallery-counter">
            {String(activeIndex + 1).padStart(3, '0')} / {artworks.length}
          </span>
        </div>

        <div
          className="gallery-stage"
          onWheel={handleWheel}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerCancel={() => { touchStart.current = null; }}
          onClickCapture={handleStageClick}
        >
          <button
            className="gallery-arrow"
            aria-label="предыдущая картина"
            disabled={activeIndex === 0}
            onClick={() => selectArtwork(activeIndex - 1)}
          >
            &lt;
          </button>
          <button
            className="gallery-artwork"
            aria-label="открыть картину на весь экран"
            onClick={() => onOpenArtwork(artwork)}
          >
            <img src={artwork.src} alt={`${artwork.title}, ${artwork.year}. Казимир Малевич`} />
          </button>
          <button
            className="gallery-arrow"
            aria-label="следующая картина"
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
