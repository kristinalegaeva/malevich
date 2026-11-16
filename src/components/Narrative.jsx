import React from 'react';
import Story from './Story.jsx';
import Bridge from './Bridge.jsx';
import { storyParagraphs, bridgeText } from '../data/story.js';
import { assetUrl } from '../utils/assetUrl.js';

export default function Narrative() {
  return (
    <>
      <div className="narrative">
        <div className="spine" aria-hidden="true"></div>
        <header className="hero">
          <h1 className="visually-hidden">Казимир Малевич в Русском музее</h1>
          <picture>
            <source media="(max-width: 760px)" srcSet={assetUrl('assets/header phone.svg')} />
            <img className="header-art" src={assetUrl('assets/header.svg')} alt="" />
          </picture>
        </header>
        <Story paragraphs={storyParagraphs} />
      </div>
      <Bridge text={bridgeText} />
    </>
  );
}
