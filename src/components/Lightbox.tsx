import { useEffect, useRef, useState } from 'react';
import type { GalleryImage } from '../data/projects';
import { thumb } from '../lib/img';

interface LightboxProps {
  images: GalleryImage[];
  index: number;
  onClose: () => void;
  onStep: (dir: 1 | -1) => void;
  onJump: (i: number) => void;
  onEnquire: (im: GalleryImage) => void;
}

export default function Lightbox({ images, index, onClose, onStep, onJump, onEnquire }: LightboxProps) {
  const im = images[index];
  const closeRef = useRef<HTMLButtonElement>(null);
  const touchX = useRef<number | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const loupeRef = useRef<HTMLDivElement>(null);
  const fineRef = useRef(false);

  useEffect(() => {
    const last = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    fineRef.current = window.matchMedia('(hover:hover) and (pointer:fine)').matches;
    return () => { last?.focus(); };
  }, []);

  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!playing) return;
    const t = window.setInterval(() => onStep(1), 3000);
    return () => window.clearInterval(t);
  }, [playing, index, onStep]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === ' ') {
        e.preventDefault();
        setPlaying((v) => !v);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  if (!im) return null;

  const hideLoupe = (): void => {
    if (loupeRef.current) loupeRef.current.style.opacity = '0';
  };

  const moveLoupe = (e: React.MouseEvent): void => {
    const img = imgRef.current;
    const loupe = loupeRef.current;
    if (!img || !loupe || !fineRef.current) return;
    const r = img.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    if (px < 0 || px > 1 || py < 0 || py > 1 || r.width === 0) {
      loupe.style.opacity = '0';
      return;
    }
    loupe.style.opacity = '1';
    loupe.style.left = `${e.clientX}px`;
    loupe.style.top = `${e.clientY}px`;
    loupe.style.backgroundImage = `url("${im.src}")`;
    loupe.style.backgroundSize = `${r.width * 2}px ${r.height * 2}px`;
    loupe.style.backgroundPosition = `${px * 100}% ${py * 100}%`;
  };

  return (
    <div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label="Fullscreen image viewer"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      onTouchStart={(e) => { touchX.current = e.touches[0]?.clientX ?? null; }}
      onTouchEnd={(e) => {
        if (touchX.current == null) return;
        const dx = (e.changedTouches[0]?.clientX ?? touchX.current) - touchX.current;
        if (Math.abs(dx) > 48) onStep(dx < 0 ? 1 : -1);
        touchX.current = null;
      }}
    >
      <button className="lb-btn lb-close" ref={closeRef} type="button" onClick={onClose} aria-label="Close viewer">✕</button>
      <button className="lb-btn lb-prev" type="button" onClick={(e) => { e.stopPropagation(); onStep(-1); }} aria-label="Previous image">←</button>
      <figure className="lb-fig" onMouseMove={moveLoupe} onMouseLeave={hideLoupe}>
        <img ref={imgRef} src={im.src} alt={im.alt} />
        <figcaption><span>{im.cap}</span><span className="mono">{index + 1} / {images.length} — {im.details}</span></figcaption>
      </figure>
      <button className="lb-btn lb-next" type="button" onClick={(e) => { e.stopPropagation(); onStep(1); }} aria-label="Next image">→</button>
      <button
        className="lb-btn lb-play"
        type="button"
        onClick={(e) => { e.stopPropagation(); setPlaying((v) => !v); }}
        aria-pressed={playing}
        aria-label={playing ? 'Pause slideshow' : 'Play slideshow'}
      >
        {playing ? '❚❚' : '▶'}
      </button>
      <button className="lb-enquire" type="button" onClick={(e) => { e.stopPropagation(); onEnquire(im); }}>
        Enquire about this frame <span aria-hidden="true">→</span>
      </button>
      <div className="lb-rail" role="tablist" aria-label="Jump to frame">
        {images.map((t, i) => (
          <button
            key={t.src}
            type="button"
            role="tab"
            aria-selected={i === index}
            aria-label={`Frame ${i + 1}: ${t.alt}`}
            className={i === index ? 'is-active' : undefined}
            onClick={(e) => { e.stopPropagation(); onJump(i); }}
          >
            <img src={thumb(t.src)} alt="" aria-hidden="true" loading="lazy" decoding="async" draggable={false} />
          </button>
        ))}
      </div>
      <div className="loupe" ref={loupeRef} aria-hidden="true" />
    </div>
  );
}
