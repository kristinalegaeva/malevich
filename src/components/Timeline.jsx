import React, { Fragment } from 'react';
import { artworks, periods } from '../data/catalog.js';
import { assetUrl } from '../utils/assetUrl.js';

export default function Timeline({ current, onSelect }) {
  const artwork = artworks[current];

  return (
    <>
      <div className="timeline" aria-label="Все произведения">
        <img className="timeline-rule" src={assetUrl('assets/timeline-line.svg')} alt="" />
        <div className="dots" id="dots">
          {artworks.map((item, index) => (
            <button
              key={item.src}
              className="dot"
              title={`${item.year} · ${item.title}`}
              aria-label={`${item.year} · ${item.title}`}
              aria-current={index === current ? 'true' : 'false'}
              tabIndex={index === current ? 0 : -1}
              onClick={() => onSelect(index)}
            />
          ))}
        </div>
        <span id="active-date" className="active-date" aria-live="polite" style={{ left: `${(current + 0.5) / artworks.length * 100}%` }}>
          {artwork.year}
        </span>
        <div className="timeline-years"><span>1900</span><span>1935</span></div>
      </div>
      <div className="caption" aria-live="polite"><h2 id="art-title">{artwork.title}</h2></div>
      <nav className="periods" aria-label="Периоды творчества">
        {periods.map((period, index) => {
          const firstIndex = artworks.findIndex(item => item.period === index);
          return (
            <Fragment key={period.name}>
              {index > 0 && <span className="period-separator" aria-hidden="true">/</span>}
              <button
                title={period.dates}
                disabled={firstIndex < 0}
                aria-current={index === artwork.period ? 'true' : 'false'}
                onClick={() => onSelect(firstIndex)}
              >
                {period.name}
              </button>
            </Fragment>
          );
        })}
      </nav>
    </>
  );
}
