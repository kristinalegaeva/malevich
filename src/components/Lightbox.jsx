import React, { useCallback, useEffect, useRef, useState } from 'react';

const initialView = { scale: 1, x: 0, y: 0 };

export default function Lightbox({ artwork, onClose }) {
  const dialogRef = useRef(null);
  const stageRef = useRef(null);
  const imageRef = useRef(null);
  const pointers = useRef(new Map());
  const [view, setView] = useState(initialView);

  const constrain = useCallback(next => {
    const image = imageRef.current;
    const stage = stageRef.current;
    const scale = Math.max(1, Math.min(8, next.scale));
    const limitX = Math.max(0, (image.clientWidth * scale - stage.clientWidth) / 2);
    const limitY = Math.max(0, (image.clientHeight * scale - stage.clientHeight) / 2);
    return { scale, x: Math.max(-limitX, Math.min(limitX, next.x)), y: Math.max(-limitY, Math.min(limitY, next.y)) };
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
      setView(previous => constrain({ ...previous, scale: previous.scale * Math.exp(-event.deltaY * 0.002) }));
    }
    function handleResize() { setView(previous => constrain(previous)); }
    stage.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('resize', handleResize);
    return () => {
      stage.removeEventListener('wheel', handleWheel);
      window.removeEventListener('resize', handleResize);
    };
  }, [constrain]);

  function handlePointerDown(event) {
    if (event.button !== 0) return;
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event) {
    const previous = pointers.current.get(event.pointerId);
    if (!previous) return;
    const next = { x: event.clientX, y: event.clientY };
    if (pointers.current.size === 2) {
      const other = [...pointers.current.entries()].find(([id]) => id !== event.pointerId)[1];
      const oldDistance = Math.hypot(previous.x - other.x, previous.y - other.y);
      const newDistance = Math.hypot(next.x - other.x, next.y - other.y);
      if (oldDistance > 0) setView(value => constrain({ ...value, scale: value.scale * newDistance / oldDistance }));
    } else {
      setView(value => constrain({ ...value, x: value.x + next.x - previous.x, y: value.y + next.y - previous.y }));
    }
    pointers.current.set(event.pointerId, next);
  }

  function clearPointer(event) { pointers.current.delete(event.pointerId); }

  return (
    <dialog ref={dialogRef} id="lightbox" aria-label="Полноэкранный просмотр картины" onCancel={event => { event.preventDefault(); onClose(); }}>
      <div
        ref={stageRef}
        className={`zoom-stage${view.scale > 1 ? ' is-zoomed' : ''}`}
        onDoubleClick={() => setView(value => value.scale > 1 ? initialView : constrain({ ...initialView, scale: 2 }))}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={clearPointer}
        onPointerCancel={clearPointer}
        onLostPointerCapture={clearPointer}
      >
        <img
          ref={imageRef}
          id="full-image"
          src={artwork.src}
          alt={`${artwork.title}, ${artwork.year}. Казимир Малевич`}
          draggable={false}
          onLoad={() => setView(initialView)}
          style={{ transform: `translate(${view.x}px, ${view.y}px) scale(${view.scale})` }}
        />
      </div>
      <button className="close" aria-label="Закрыть просмотр" onClick={onClose}>×</button>
    </dialog>
  );
}
