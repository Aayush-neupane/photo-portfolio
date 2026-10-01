import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { PROJECTS, type GalleryImage } from '../data/projects';
import { packBento } from '../lib/bento';
import { mid } from '../lib/img';

// Bento layout is experimental: flip to false to fall back to the stacked pv-fig list below.
const USE_BENTO = true;

const GAP = 14;

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

  // Measure the gallery so tiles can be sized from real pixel dimensions.
  const galleryRef = useRef<HTMLDivElement>(null);
  const [gw, setGw] = useState(0);

  useLayoutEffect(() => {
    const el = galleryRef.current;
    if (!el) return;
    const update = (): void => setGw(el.clientWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const bento = useMemo(
    () => (USE_BENTO ? packBento(p.images, gw, GAP) : []),
    [p.images, gw]
  );

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
        <div ref={galleryRef}>
        {USE_BENTO && bento.length ? (
          <div className="pv-gallery is-bento">
            {bento.map((band, bi) => (
              <div
                key={bi}
                className="pv-band"
                style={{
                  height: band.h,
                  gap: GAP,
                  justifyContent: band.centered ? 'center' : 'flex-start',
                  marginTop: bi > 0 ? GAP * 1.25 : 0,
                }}
              >
                {band.cells.map((cell) => {
                  const key = cell.kind === 'single' ? cell.tile.im.src : `${cell.top.im.src}+${cell.bottom.im.src}`;
                  if (cell.kind === 'single') {
                    const { tile } = cell;
                    return (
                      <figure className="pv-fig" key={key} style={{ width: tile.w, height: tile.h }}>
                        <div className="pv-media" style={{ width: tile.w, height: tile.h }}>
                          <DevImg im={tile.im} eager={tile.index < 2} delay={Math.min(tile.index * 80, 480)} onOpen={() => onLightbox(p.images, tile.index)} />
                        </div>
                        <span className="pv-cap"><b>{tile.im.cap}</b><i>{tile.im.meta}</i></span>
                      </figure>
                    );
                  }
                  return (
                    <div className="pv-stack" key={key} style={{ width: cell.w, height: cell.h, gap: GAP }}>
                      {[cell.top, cell.bottom].map((tile) => (
                        <figure className="pv-fig" key={tile.im.src} style={{ width: tile.w, height: tile.h }}>
                          <div className="pv-media" style={{ width: tile.w, height: tile.h }}>
                            <DevImg im={tile.im} eager={tile.index < 2} delay={Math.min(tile.index * 80, 480)} onOpen={() => onLightbox(p.images, tile.index)} />
                          </div>
                          <span className="pv-cap"><b>{tile.im.cap}</b><i>{tile.im.meta}</i></span>
                        </figure>
                      ))}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        ) : (
          <div className="wrap pv-gallery">
            {p.images.map((im, i) => (
              <figure className={`pv-fig ${im.o}`} key={im.src}>
                <DevImg im={im} eager={i < 2} delay={Math.min(i * 80, 480)} onOpen={() => onLightbox(p.images, i)} />
                <figcaption className="mono"><span>{im.cap}</span><span>{im.meta}</span></figcaption>
              </figure>
            ))}
          </div>
        )}
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
