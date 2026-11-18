import React, { useState } from 'react';
import Narrative from './components/Narrative.jsx';
import Gallery from './components/Gallery.jsx';
import Lightbox from './components/Lightbox.jsx';
import CollectionDialog from './components/CollectionDialog.jsx';

export default function App() {
  const [openArtwork, setOpenArtwork] = useState(null);
  const [isCollectionOpen, setCollectionOpen] = useState(false);

  function closeArtwork() {
    setOpenArtwork(null);
  }

  return (
    <>
      <main>
        <Narrative />
        <Gallery
          onOpenArtwork={setOpenArtwork}
          onOpenCollection={() => setCollectionOpen(true)}
          isDialogOpen={isCollectionOpen || openArtwork !== null}
        />
      </main>
      {isCollectionOpen && (
        <CollectionDialog
          onOpenArtwork={setOpenArtwork}
          onClose={() => setCollectionOpen(false)}
        />
      )}
      {openArtwork && <Lightbox artwork={openArtwork} onClose={closeArtwork} />}
    </>
  );
}
