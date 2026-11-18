import React, { Fragment } from 'react';
import { artworks, periods } from '../data/catalog.js';
import { assetUrl } from '../utils/assetUrl.js';

export default function Timeline({ activeIndex, onSelectArtwork }) {
  const artwork = artworks[activeIndex];
  const datePosition = (activeIndex + 0.5) / artworks.length * 100;

  return (
    <>
      <div className="timeline" aria-label="все произведения">
        <img className="timeline-rule" src={assetUrl('assets/timeline-line.svg')} alt="" />
        <div className="timeline-markers">
          {artworks.map((item, index) => (
            <button
              key={item.src}
              className="timeline-marker"
              title={`${item.year} · ${item.title}`}
              aria-label={`${item.year} · ${item.title}`}
              aria-current={index === activeIndex ? 'true' : 'false'}
              tabIndex={index === activeIndex ? 0 : -1}
              onClick={() => onSelectArtwork(index)}
            />
          ))}
        </div>
        <span className="timeline-date" aria-live="polite" style={{ left: `${datePosition}%` }}>
          {artwork.year}
        </span>
        <div className="timeline-years">
          <span>1900</span>
          <span>1935</span>
        </div>
      </div>

      <div className="gallery-caption artwork-caption" aria-live="polite">
        <h2>{artwork.title}</h2>
        <span className="artwork-caption-year">{artwork.year}</span>
      </div>

      <nav className="gallery-periods" aria-label="периоды творчества">
        {periods.map((period, index) => {
          const firstIndex = artworks.findIndex(item => item.period === index);
          return (
            <Fragment key={period.name}>
              {index > 0 && <span className="gallery-period-divider" aria-hidden="true">/</span>}
              <button
                className="text-action"
                title={period.dates}
                disabled={firstIndex < 0}
                aria-current={index === artwork.period ? 'true' : 'false'}
                onClick={() => onSelectArtwork(firstIndex)}
              >
                <span className="text-action-label">{period.name}</span>
              </button>
            </Fragment>
          );
        })}
      </nav>
    </>
  );
}
