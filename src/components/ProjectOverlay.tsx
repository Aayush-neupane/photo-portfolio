import { useCallback, useEffect, useRef, useState } from 'react';
import { PROJECTS, type GalleryImage } from '../data/projects';
import { mid } from '../lib/img';

interface ProjectOverlayProps {
  index: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
  onLightbox: (images: GalleryImage[], imageIndex: number) => void;
}

/** Gallery image that develops like a print in the tray once loaded. */
function DevImg({ im, eager, delay, onOpen }: { im: GalleryImage; eager: boolean; delay: number; onOpen: () => void }) {
  const [done, setDone] = useState(false);
  const mark = useCallback((): void => setDone(true), []);
  return (
    <img
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      src={mid(im.src)}
      alt={im.alt}
      tabIndex={0}
      className={done ? 'dev-in' : undefined}
      style={{ transitionDelay: `${delay}ms` }}
      ref={(el) => {
        if (el && el.complete && el.naturalWidth) mark();
      }}
      onLoad={mark}
      onError={mark}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpen();
        }
      }}
    />
  );
}

export default function ProjectOverlay({ index, onClose, onNavigate, onLightbox }: ProjectOverlayProps) {
  const p = PROJECTS[index];
  const scrollRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const prev = PROJECTS[(index + PROJECTS.length - 1) % PROJECTS.length];
  const next = PROJECTS[(index + 1) % PROJECTS.length];

  // Focus management: move focus in on mount, restore on unmount.
  useEffect(() => {
    const last = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    return () => { last?.focus(); };
  }, []);

  // Reset scroll position when navigating between projects.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [index]);

  const toggleFullscreen = (): void => {
    if (document.fullscreenElement) {
      void document.exitFullscreen().catch(() => {});
    } else {
      void document.documentElement.requestFullscreen().catch(() => {});
    }
  };

  return (
    <div className="overlay" role="dialog" aria-modal="true" aria-labelledby="pvTitle">
      <div className="pv-top">
        <button className="pv-back" ref={closeRef} type="button" onClick={onClose}>← <span>All work</span></button>
        <span className="mono pv-count">{String(index + 1).padStart(2, '0')} / 08</span>
        <span className="mono pv-tools"><button type="button" onClick={toggleFullscreen} aria-label="Toggle fullscreen">Fullscreen ⤢</button></span>
      </div>
      <div className="pv-scroll" ref={scrollRef} tabIndex={0}>
        <header className="wrap pv-head">
          <p className="mono-label">{p.n} / 08 — {p.catLabel} · {p.year}</p>
          <h2 className="pv-title" id="pvTitle">{p.title}</h2>
          <p className="pv-desc">{p.desc}</p>
          <dl className="pv-meta mono">
            <div><dt>Location</dt><dd>{p.loc}</dd></div>
            <div><dt>Light</dt><dd>{p.light}</dd></div>
            <div><dt>Frames</dt><dd>{p.count} photographs</dd></div>
          </dl>
        </header>
        <div className="wrap pv-gallery">
          {p.images.map((im, i) => (
            <figure className={`pv-fig ${im.o}`} key={im.src}>
              <DevImg im={im} eager={i < 2} delay={Math.min(i * 80, 480)} onOpen={() => onLightbox(p.images, i)} />
              <figcaption className="mono"><span>{im.cap}</span><span>{im.meta}</span></figcaption>
            </figure>
          ))}
        </div>
        <nav className="wrap pv-nav" aria-label="More projects">
          <button type="button" onClick={() => onNavigate((index + PROJECTS.length - 1) % PROJECTS.length)}>
            <span className="mono">← Previous</span><b>{prev.title}</b>
          </button>
          <button type="button" onClick={() => onNavigate((index + 1) % PROJECTS.length)}>
            <span className="mono">Next →</span><b>{next.title}</b>
          </button>
        </nav>
      </div>
    </div>
  );
}
