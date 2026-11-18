import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { figureViewBox, phoneFigureViewBox, phoneStoryFigures, storyFigures } from '../data/storyFigures.js';

gsap.registerPlugin(ScrollTrigger);

const clamp = gsap.utils.clamp(0, 1);
const mix = gsap.utils.interpolate;
const scrubTime = 0.45;

const restingPositions = [
  { x: 250, tilt: 9, on: 3, spin: 44 },
  { x: 568, tilt: -12, on: 4 },
  { x: 1180, tilt: -9, spin: -62 },
  { x: 182, tilt: -8, spin: 54 },
  { x: 650, tilt: 6 },
  { x: 420, tilt: 10 },
  { x: 930, tilt: -8, spin: 32 },
  { x: 1120, tilt: 13, on: 2 },
  { x: 124, tilt: 0, on: 3 },
  { x: 712, tilt: 0, on: 4 },
  { x: 1255, tilt: 0, on: 2 },
  { x: 845, tilt: 10, on: 6, spin: -45 },
  { x: 435, tilt: -13, on: 5, spin: 58 }
];

const phoneLandings = [
  [85, 8], [170, -12], [325, -20], [111, -33], [215, 15], [165, -11],
  [304, 9], [330, 13], [57, 0], [201, 0], [362, 0], [269, 10], [140, -13]
];

function verticalBounds(figure, tilt) {
  if (figure.radius) return { top: -figure.radiusY, bottom: figure.radiusY };

  const radians = tilt * Math.PI / 180;
  const vertices = figure.points
    ? figure.points.split(' ').map(point => point.split(',').map(Number))
    : [-1, 1].flatMap(x => [-1, 1].map(y => [x * figure.width / 2, y * figure.height / 2]));
  const heights = vertices.map(([x, y]) => x * Math.sin(radians) + y * Math.cos(radians));
  return { top: Math.min(...heights), bottom: Math.max(...heights) };
}

function pose(x, y, angle) {
  return `translate(${x} ${y}) rotate(${angle})`;
}

function getFigurePose(figure, index, progress, plane, settlingWindow, positions, restingBounds) {
  const rest = positions[index];
  const support = restingBounds[rest.on];
  const overlapHeight = support ? (support.bottom - support.top) * 0.53 : 0;
  const targetY = plane - restingBounds[index].bottom - overlapHeight;
  const contact = 1 - settlingWindow * ((support ? 0.3 : 0.65) + (index % 3) * 0.06);
  const descent = clamp(progress / contact);
  const travel = descent ** (1.2 + (index % 4) * 0.1) * (2 - descent);
  const drift = Math.sin(Math.PI * descent);
  const direction = index % 2 ? 1 : -1;
  const spin = (rest.spin ?? 0) * Math.sin(Math.PI * clamp(descent / 0.45));
  const flutter = Math.sin(Math.PI * descent * 3) * drift * (figure.radius ? 0 : 8);
  const settling = clamp((progress - contact) / (1 - contact));
  const lift = Math.sin(Math.PI * settling) ** 2 * (support ? 4 : 7);
  const x = mix(figure.x, rest.x, travel) + direction * 20 * drift;
  const y = mix(figure.y, targetY, travel) - lift;
  const angle = mix(figure.angle, rest.tilt, travel) + spin + flutter;
  return pose(x, y, angle);
}

function Figure({ figure }) {
  const { x, y, angle, fill, radius, radiusY, points, width, height } = figure;

  return (
    <g className="story-shape" transform={pose(x, y, angle)} fill={fill}>
      {radius ? <ellipse rx={radius} ry={radiusY} /> : points ? (
        <polygon points={points} />
      ) : (
        <rect x={-width / 2} y={-height / 2} width={width} height={height} />
      )}
    </g>
  );
}

function FigureArtwork({ className, viewBox, figures }) {
  return (
    <svg
      className={`story-shapes ${className}`}
      viewBox={`${viewBox.left} 0 ${viewBox.width} ${viewBox.height}`}
    >
      {figures.map(figure => <Figure key={figure.x} figure={figure} />)}
    </svg>
  );
}

export default function StorySequence({ children }) {
  const sequenceRef = useRef(null);
  const layerRef = useRef(null);

  useLayoutEffect(() => {
    const sequence = sequenceRef.current;
    const layer = layerRef.current;
    const motion = gsap.matchMedia();

    motion.add({
      animate: '(prefers-reduced-motion: no-preference)',
      phone: '(max-width: 760px)'
    }, ({ conditions }) => {
      if (!conditions.animate) return;

      const { phone } = conditions;
      const artwork = layer.querySelector(phone ? '.story-shapes-phone' : '.story-shapes-desktop');
      const figures = [...artwork.children];
      const source = phone ? phoneStoryFigures : storyFigures;
      const viewBox = phone ? phoneFigureViewBox : figureViewBox;
      const positions = phone
        ? restingPositions.map((rest, index) => {
          const [x, tilt] = phoneLandings[index];
          return { ...rest, x, tilt };
        })
        : restingPositions;
      const bounds = source.map((figure, index) => verticalBounds(figure, positions[index].tilt));
      const playhead = { progress: 0 };
      let viewport;

      function drawFigures() {
        if (!viewport) return;
        const { plane, settlingWindow } = viewport;
        figures.forEach((element, index) => {
          const transform = getFigurePose(source[index], index, playhead.progress, plane, settlingWindow, positions, bounds);
          element.setAttribute('transform', transform);
        });
      }

      gsap.to(playhead, {
        progress: 1,
        ease: 'none',
        onUpdate: drawFigures,
        scrollTrigger: {
          trigger: sequence,
          start: 'top top',
          end: () => `bottom ${layer.offsetHeight}px`,
          scrub: scrubTime,
          onRefresh(trigger) {
            const unitsPerPixel = viewBox.width / artwork.getBoundingClientRect().width;
            viewport = {
              plane: layer.offsetHeight * unitsPerPixel,
              settlingWindow: Math.min(1, window.innerHeight * 0.85 / (trigger.end - trigger.start))
            };
            drawFigures();
          }
        }
      });

      for (const paragraph of sequence.querySelectorAll('.story-part')) {
        const copy = paragraph.querySelector('.story-copy');
        const panel = copy.querySelector('.story-panel');
        const reveal = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: paragraph,
            start: 'top 85%',
            end: 'top 25%',
            scrub: 0.3
          }
        });
        reveal.from(panel, { '--story-background-opacity': 0 }, 0);
        reveal.from(panel.children, { autoAlpha: 0 }, 0);

        if (phone) continue;

        gsap.to(copy, {
          keyframes: [
            { yPercent: -12, duration: 0.25, ease: 'sine.inOut' },
            { yPercent: 12, duration: 0.5, ease: 'sine.inOut' },
            { yPercent: 0, duration: 0.25, ease: 'sine.inOut' }
          ],
          scrollTrigger: {
            trigger: paragraph,
            start: 'top 55%',
            end: 'top -55%',
            scrub: true
          }
        });
      }

      const observer = new ResizeObserver(() => ScrollTrigger.refresh());
      observer.observe(sequence);

      return () => {
        observer.disconnect();
        figures.forEach((element, index) => {
          const { x, y, angle } = source[index];
          element.setAttribute('transform', pose(x, y, angle));
        });
      };
    });

    return () => motion.revert();
  }, []);

  return (
    <div className="story-sequence" ref={sequenceRef}>
      <div className="story-shape-overlay" aria-hidden="true">
        <div className="story-shape-layer" ref={layerRef}>
          <FigureArtwork className="story-shapes-desktop" viewBox={figureViewBox} figures={storyFigures} />
          <FigureArtwork className="story-shapes-phone" viewBox={phoneFigureViewBox} figures={phoneStoryFigures} />
        </div>
      </div>
      {children}
    </div>
  );
}
