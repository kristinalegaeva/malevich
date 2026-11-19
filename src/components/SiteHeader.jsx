import React, { useEffect, useRef, useState } from 'react';

const revealDistance = 120;
const gesturePause = 250;

export default function SiteHeader({ dark, onThemeChange, onOpenCollection, onOpenAbout, isDialogOpen }) {
  const [visible, setVisible] = useState(false);
  const skipTopScroll = useRef(false);

  useEffect(() => {
    if (isDialogOpen) return;

    let scrollAnchor = Math.max(0, window.scrollY);
    let touchY = null;
    let upwardDistance = 0;
    let lastUpwardAt = 0;

    function trackUpward(distance) {
      const now = performance.now();
      if (now - lastUpwardAt > gesturePause) upwardDistance = 0;
      lastUpwardAt = now;
      upwardDistance += distance;
      if (upwardDistance >= revealDistance) setVisible(true);
    }

    function handleScroll() {
      const position = Math.max(0, window.scrollY);
      const delta = position - scrollAnchor;
      scrollAnchor = position;
      if (position === 0 && skipTopScroll.current) {
        skipTopScroll.current = false;
        upwardDistance = 0;
        return;
      }
      if (delta > 0) {
        upwardDistance = 0;
        setVisible(false);
      } else if (delta < 0) {
        trackUpward(-delta);
      }
    }

    function handleWheel(event) {
      if (event.ctrlKey || Math.abs(event.deltaX) >= Math.abs(event.deltaY)) return;
      if (event.deltaY > 0) {
        upwardDistance = 0;
        setVisible(false);
      } else if (window.scrollY <= 0) {
        const units = [1, 16, window.innerHeight];
        trackUpward(-event.deltaY * (units[event.deltaMode] ?? 1));
      }
    }

    function handleTouchStart(event) {
      touchY = event.touches.length === 1 && window.scrollY <= 0
        ? event.touches[0].clientY
        : null;
    }

    function handleTouchMove(event) {
      if (touchY === null || event.touches.length !== 1) return;
      const delta = event.touches[0].clientY - touchY;
      if (delta >= 72) setVisible(true);
      else if (delta <= -12) setVisible(false);
    }

    const listeners = {
      scroll: handleScroll,
      wheel: handleWheel,
      touchstart: handleTouchStart,
      touchmove: handleTouchMove
    };

    for (const [event, handler] of Object.entries(listeners)) {
      window.addEventListener(event, handler, { passive: true });
    }
    return () => {
      for (const [event, handler] of Object.entries(listeners)) {
        window.removeEventListener(event, handler);
      }
    };
  }, [isDialogOpen]);

  function openDialog(open) {
    setVisible(false);
    open();
  }

  function returnToTop() {
    skipTopScroll.current = window.scrollY > 0;
    setVisible(false);
  }

  return (
    <header className="site-header acrylic-surface" data-visible={visible}>
      <nav className="site-nav" aria-label="навигация по сайту">
        <button
          className="text-action"
          type="button"
          aria-label="тема"
          aria-pressed={dark}
          onClick={onThemeChange}
        >
          <span className="text-action-label">тема</span>
        </button>
        <span aria-hidden="true">/</span>
        <a className="text-action" href="#top" onClick={returnToTop}>
          <span className="text-action-label">в начало</span>
        </a>
        <span aria-hidden="true">/</span>
        <a className="text-action" href="#timeline" onClick={() => setVisible(false)}>
          <span className="text-action-label">таймлайн</span>
        </a>
        <span aria-hidden="true">/</span>
        <button className="text-action" type="button" onClick={() => openDialog(onOpenCollection)}>
          <span className="text-action-label">галерея</span>
        </button>
        <span aria-hidden="true">/</span>
        <button className="text-action" type="button" onClick={() => openDialog(onOpenAbout)}>
          <span className="text-action-label">о проекте</span>
        </button>
      </nav>
    </header>
  );
}
