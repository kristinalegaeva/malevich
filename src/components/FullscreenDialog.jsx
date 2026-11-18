import React, { useLayoutEffect, useRef } from 'react';

export default function FullscreenDialog({ className, label, children, onClose }) {
  const dialogRef = useRef(null);

  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    dialog.showModal();
    return () => dialog.close();
  }, []);

  function handleCancel(event) {
    event.preventDefault();
    onClose();
  }

  return (
    <dialog
      ref={dialogRef}
      className={`fullscreen-dialog ${className}`}
      aria-label={label}
      onCancel={handleCancel}
    >
      {children}
      <button className="fullscreen-close" aria-label="закрыть" onClick={onClose}>
        ×
      </button>
    </dialog>
  );
}
