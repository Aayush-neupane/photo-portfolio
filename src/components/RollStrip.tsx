import { useEffect, useRef } from 'react';
import { PROJECTS, type GalleryImage } from '../data/projects';
import { thumb } from '../lib/img';

interface RollStripProps {
  onZoom: (images: GalleryImage[], index: number) => void;
}

/** Every frame on one roll, deduplicated, in series order. */
const ROLL: GalleryImage[] = (() => {
  const seen = new Set<string>();
  const out: GalleryImage[] = [];
  PROJECTS.forEach((p) => {
    p.images.forEach((im) => {
      if (seen.has(im.src)) return;
      seen.add(im.src);
      out.push(im);
    });
  });
  return out;
})();

/** Pixels per second of the endless drift. */
const SPEED = 120;

export default function RollStrip({ onZoom }: RollStripProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const secRef = useRef<HTMLElement>(null);
  const drag = useRef({ down: false, x: 0, sl: 0, moved: false });
  const inViewRef = useRef(false);

  // Endless slideshow: the duplicated strip drifts forward and wraps
  // seamlessly at the halfway mark. Any touch pauses, then resumes.
  // Still fully draggable, and still off when reduced motion is set.
  useEffect(() => {
    const sec = secRef.current;
    const track = trackRef.current;
    if (!sec || !track) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => {
        inViewRef.current = e.isIntersecting;
      }),
      { threshold: 0.05 },
    );
    io.observe(sec);
    let raf = 0;
    let last = performance.now();
    const tick = (now: number): void => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      if (!inViewRef.current || document.hidden) return;
      const half = track.scrollWidth / 2;
      if (half <= 0) return;
      let sl = track.scrollLeft + SPEED * dt;
      if (sl >= half) sl -= half;
      track.scrollLeft = sl;
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, []);

  const down = (e: React.PointerEvent): void => {
    const t = trackRef.current;
    if (!t) return;
    drag.current = { down: true, x: e.clientX, sl: t.scrollLeft, moved: false };
  };
  const move = (e: React.PointerEvent): void => {
    const d = drag.current;
    const t = trackRef.current;
    if (!d.down || !t) return;
    const dx = e.clientX - d.x;
    if (Math.abs(dx) > 6) d.moved = true;
    t.scrollLeft = d.sl - dx;
  };
  const up = (): void => {
    drag.current.down = false;
  };
  const pick = (i: number): void => {
    if (drag.current.moved) {
      drag.current.moved = false;
      return;
    }
    onZoom(ROLL, i % ROLL.length);
  };

  const half = (copy: number, hidden: boolean) => (
    <div className="roll-half" aria-hidden={hidden || undefined}>
      {ROLL.map((im, i) => (
        <button
          key={`${copy}-${im.src}`}
          type="button"
          tabIndex={hidden ? -1 : undefined}
          className={`roll-frame ${im.o}`}
          onClick={() => pick(i)}
          aria-label={hidden ? undefined : `Enlarge: ${im.alt}`}
        >
          <img loading="lazy" decoding="async" src={thumb(im.src)} alt="" aria-hidden="true" draggable={false} />
          <span>{String(i + 1).padStart(2, '0')}</span>
        </button>
      ))}
    </div>
  );

  return (
    <section className="roll" ref={secRef} aria-label="Every frame on one roll">
      <div className="wrap roll-head">
        <p className="mono-label">The whole roll</p>
        <p className="roll-hint mono" aria-hidden="true">Plays on its own · drag anytime</p>
      </div>
      <div
        className="roll-track"
        ref={trackRef}
        tabIndex={0}
        role="region"
        aria-label="Endless filmstrip of every frame. Arrow keys scroll."
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerLeave={up}
      >
        <div className="roll-inner">
          <div className="roll-rail" aria-hidden="true" />
          <div className="roll-frames">
            {half(0, false)}
            {half(1, true)}
          </div>
          <div className="roll-rail" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
