import React from 'react';

export default function StoryParagraph({ title, text, highlight }) {
  return (
    <article className="story-panel" style={{ '--story-highlight': highlight.background, '--story-ink': highlight.foreground }}>
      <div className="paragraph">
        <h2><span className="story-highlight">{title}</span></h2>
        <p><span className="story-highlight">{text}</span></p>
      </div>
    </article>
  );
}
