import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import StoryParagraph from './StoryParagraph.jsx';
import { assetUrl } from '../utils/assetUrl.js';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function Story({ paragraphs }) {
  const storyRef = useRef(null);

  useGSAP(() => {
    const media = gsap.matchMedia();
    let disposed = false;

    media.add('(prefers-reduced-motion: no-preference)', () => {
      const panels = gsap.utils.toArray('.story-panel', storyRef.current);
      const getLead = () => -parseFloat(getComputedStyle(storyRef.current.querySelector('.story-stage')).marginTop);
      gsap.set(panels, { autoAlpha: 0 });
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: storyRef.current,
          start: () => `top ${getLead()}px`,
          end: () => `bottom ${window.innerHeight + getLead()}px`,
          scrub: 0.25,
          invalidateOnRefresh: true
        }
      });

      // Each panel occupies one scroll interval: reveal, reading pause, disappear.
      // The stage is held by CSS sticky; the SVG is outside it and scrolls normally.
      panels.forEach((panel, index) => {
        timeline
          .to(panel, { autoAlpha: 1, duration: 0.18, ease: 'power1.inOut' }, index)
          .to(panel, { autoAlpha: 1, duration: 0.64, ease: 'none' }, index + 0.18)
          .to(panel, { autoAlpha: 0, duration: 0.18, ease: 'power1.inOut' }, index + 0.82);
      });
    });

    document.fonts.ready.then(() => {
      if (!disposed) ScrollTrigger.refresh();
    });

    return () => {
      disposed = true;
      media.revert();
    };
  }, { scope: storyRef, dependencies: [paragraphs], revertOnUpdate: true });

  return (
    <section ref={storyRef} className="story" id="story" aria-label="Путь художника">
      <img className="circles" src={assetUrl('assets/ellipses.svg')} alt="" />
      <div className="story-stage">
        {paragraphs.map(paragraph => (
          <StoryParagraph key={paragraph.title} {...paragraph} />
        ))}
      </div>
    </section>
  );
}
