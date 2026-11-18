import React, { useState } from 'react';
import Narrative from './components/Narrative.jsx';
import Gallery from './components/Gallery.jsx';
import Lightbox from './components/Lightbox.jsx';

export default function App() {
  const [openArtwork, setOpenArtwork] = useState(null);

  function closeArtwork() {
    setOpenArtwork(null);
  }

  return (
    <>
      <main>
        <Narrative />
        <Gallery
          onOpenArtwork={setOpenArtwork}
          isLightboxOpen={openArtwork !== null}
        />
      </main>
      {openArtwork && <Lightbox artwork={openArtwork} onClose={closeArtwork} />}
    </>
  );
}
