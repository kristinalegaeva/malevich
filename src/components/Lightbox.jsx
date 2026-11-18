import React, { useCallback, useEffect, useRef, useState } from 'react';

const initialView = { scale: 1, x: 0, y: 0 };

export default function Lightbox({ artwork, onClose }) {
  const dialogRef = useRef(null);
  const stageRef = useRef(null);
  const imageRef = useRef(null);
  const activePointers = useRef(new Map());
  const [view, setView] = useState(initialView);

  const constrainView = useCallback(next => {
    const image = imageRef.current;
    const stage = stageRef.current;
    const scale = Math.max(1, Math.min(8, next.scale));
    const limitX = Math.max(0, (image.clientWidth * scale - stage.clientWidth) / 2);
    const limitY = Math.max(0, (image.clientHeight * scale - stage.clientHeight) / 2);
    return {
      scale,
      x: Math.max(-limitX, Math.min(limitX, next.x)),
      y: Math.max(-limitY, Math.min(limitY, next.y))
    };
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    dialog.showModal();
    document.body.classList.add('modal-open');
    return () => {
      dialog.close();
      document.body.classList.remove('modal-open');
    };
  }, []);

  useEffect(() => {
    const stage = stageRef.current;
    function handleWheel(event) {
      event.preventDefault();
      const zoomFactor = Math.exp(-event.deltaY * 0.002);
      setView(previous => constrainView({ ...previous, scale: previous.scale * zoomFactor }));
    }

    function handleResize() {
      setView(constrainView);
    }

    stage.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('resize', handleResize);
    return () => {
      stage.removeEventListener('wheel', handleWheel);
      window.removeEventListener('resize', handleResize);
    };
  }, [constrainView]);

  function handlePointerDown(event) {
    if (event.button !== 0) return;
    activePointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event) {
    const previous = activePointers.current.get(event.pointerId);
    if (!previous) return;
    const next = { x: event.clientX, y: event.clientY };

    if (activePointers.current.size === 2) {
      const other = [...activePointers.current.entries()].find(([id]) => id !== event.pointerId)[1];
      const oldDistance = Math.hypot(previous.x - other.x, previous.y - other.y);
      const newDistance = Math.hypot(next.x - other.x, next.y - other.y);
      if (oldDistance > 0) {
        const zoomFactor = newDistance / oldDistance;
        setView(previousView => constrainView({ ...previousView, scale: previousView.scale * zoomFactor }));
      }
    } else {
      setView(previousView => constrainView({
        ...previousView,
        x: previousView.x + next.x - previous.x,
        y: previousView.y + next.y - previous.y
      }));
    }
    activePointers.current.set(event.pointerId, next);
  }

  function clearPointer(event) {
    activePointers.current.delete(event.pointerId);
  }

  function handleCancel(event) {
    event.preventDefault();
    onClose();
  }

  function toggleZoom() {
    setView(previous => previous.scale > 1
      ? initialView
      : constrainView({ ...initialView, scale: 2 })
    );
  }

  return (
    <dialog ref={dialogRef} className="lightbox" aria-label="Полноэкранный просмотр картины" onCancel={handleCancel}>
      <div
        ref={stageRef}
        className={`lightbox-stage${view.scale > 1 ? ' is-zoomed' : ''}`}
        onDoubleClick={toggleZoom}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={clearPointer}
        onPointerCancel={clearPointer}
        onLostPointerCapture={clearPointer}
      >
        <img
          ref={imageRef}
          className="lightbox-image"
          src={artwork.src}
          alt={`${artwork.title}, ${artwork.year}. Казимир Малевич`}
          draggable={false}
          onLoad={() => setView(initialView)}
          style={{ transform: `translate(${view.x}px, ${view.y}px) scale(${view.scale})` }}
        />
      </div>
      <button className="lightbox-close" aria-label="Закрыть просмотр" onClick={onClose}>×</button>
    </dialog>
  );
}
