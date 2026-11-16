import React, { useState } from 'react';
import Narrative from './components/Narrative.jsx';
import Gallery from './components/Gallery.jsx';
import Lightbox from './components/Lightbox.jsx';

export default function App() {
  const [openedArtwork, setOpenedArtwork] = useState(null);

  return (
    <>
      <main>
        <Narrative />
        <Gallery onOpen={setOpenedArtwork} isLightboxOpen={openedArtwork !== null} />
      </main>
      {openedArtwork && <Lightbox artwork={openedArtwork} onClose={() => setOpenedArtwork(null)} />}
    </>
  );
}
