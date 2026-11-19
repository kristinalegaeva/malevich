import React, { useLayoutEffect, useState } from 'react';
import Narrative from './components/Narrative.jsx';
import Gallery from './components/Gallery.jsx';
import Lightbox from './components/Lightbox.jsx';
import CollectionDialog from './components/CollectionDialog.jsx';
import FullscreenDialog from './components/FullscreenDialog.jsx';
import SiteHeader from './components/SiteHeader.jsx';

function getSavedTheme() {
  try {
    return localStorage.getItem('malevich-theme') === 'dark';
  } catch {
    return false;
  }
}

export default function App() {
  const [openArtwork, setOpenArtwork] = useState(null);
  const [isCollectionOpen, setCollectionOpen] = useState(false);
  const [isAboutOpen, setAboutOpen] = useState(false);
  const [dark, setDark] = useState(getSavedTheme);
  const isDialogOpen = isCollectionOpen || isAboutOpen || openArtwork !== null;

  useLayoutEffect(() => {
    const theme = dark ? 'dark' : 'light';
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem('malevich-theme', theme);
    } catch {
      // The current theme still works when storage is unavailable.
    }
  }, [dark]);

  function closeArtwork() {
    setOpenArtwork(null);
  }

  return (
    <>
      <SiteHeader
        dark={dark}
        onThemeChange={() => setDark(value => !value)}
        onOpenCollection={() => setCollectionOpen(true)}
        onOpenAbout={() => setAboutOpen(true)}
        isDialogOpen={isDialogOpen}
      />
      <main id="top">
        <Narrative />
        <Gallery
          onOpenArtwork={setOpenArtwork}
          onOpenCollection={() => setCollectionOpen(true)}
          isDialogOpen={isDialogOpen}
        />
      </main>
      {isCollectionOpen && (
        <CollectionDialog
          onOpenArtwork={setOpenArtwork}
          onClose={() => setCollectionOpen(false)}
        />
      )}
      {openArtwork && <Lightbox artwork={openArtwork} onClose={closeArtwork} />}
      {isAboutOpen && (
        <FullscreenDialog className="about-dialog" label="о проекте" onClose={() => setAboutOpen(false)}>
          <article className="about-copy">
            <h1>о проекте</h1>
            <p>
              этот сайт — реализация части концепции модернизации ресурса русского музея{' '}
              <a href="https://rusmuseumvrm.ru/data/mediateka/kazimir_malevich/index.php?lang=ru">
                «Казимир Малевич в русском музее»
              </a>.
              в каталоге представлены цифровые копии работ Казимира Малевича из собрания русского музея.
            </p>
            <p>
              история художника раскрывается при прокрутке, а геометрические фигуры отсылают к его
              супрематическим композициям. работы можно изучать по хронологии, искать по названию
              или году и рассматривать в полноэкранном режиме.
            </p>
          </article>
        </FullscreenDialog>
      )}
    </>
  );
}
