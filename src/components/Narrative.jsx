import React from 'react';
import Story from './Story.jsx';
import StorySequence from './StorySequence.jsx';
import { assetUrl } from '../utils/assetUrl.js';

export default function Narrative() {
  return (
    <>
      <StorySequence>
        <header className="hero">
          <h1 className="visually-hidden">Казимир Малевич в русском музее</h1>
          <picture>
            <source media="(max-width: 760px)" srcSet={assetUrl('assets/header phone.svg')} />
            <img className="hero-image" src={assetUrl('assets/header.svg')} alt="" />
          </picture>
        </header>

        <Story />
      </StorySequence>

      <p className="collection-intro">
        проследить эти изменения можно через сами произведения. расположенные в хронологическом порядке, они позволяют увидеть, как развивались идеи художника
      </p>
    </>
  );
}
