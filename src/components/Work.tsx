import { useRef, useState } from 'react';
import { CATEGORIES, PROJECTS, type Project } from '../data/projects';
import { thumb } from '../lib/img';
import { playShutter } from '../lib/shutter';

interface WorkProps {
  onOpen: (id: string) => void;
}

function canHoverFine(): boolean {
  return window.matchMedia('(hover:hover) and (pointer:fine)').matches &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

interface CardProps {
  p: Project;
  hidden: boolean;
  onOpen: (id: string) => void;
  showTag: () => void;
  hideTag: () => void;
  moveTag: (e: React.MouseEvent) => void;
}

function WorkCard({ p, hidden, onOpen, showTag, hideTag, moveTag }: CardProps) {
  const [loaded, setLoaded] = useState(false);
  const markLoaded = (): void => setLoaded(true);

  return (
    <article
      className={`work-card${hidden ? ' hide' : ''}`}
      tabIndex={0}
      role="button"
      aria-label={`Open project ${p.title}, ${p.catLabel} ${p.year}`}
      onClick={() => onOpen(p.id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onOpen(p.id); }
      }}
    >
      <div className="work-media" onMouseEnter={showTag} onMouseLeave={hideTag} onMouseMove={moveTag}>
        <span className="ph">LOADING — {p.n}</span>
        <img
          loading="lazy"
          decoding="async"
          src={thumb(p.cover.src)}
          alt={p.cover.alt}
          className={loaded ? 'loaded' : undefined}
          ref={(el) => { if (el && el.complete && el.naturalWidth) markLoaded(); }}
          onLoad={markLoaded}
          onError={markLoaded}
        />
        <span className="work-idx">{p.n} / 08</span>
        <span className="work-count">{p.count} PHOTOS</span>
        <span className="vf-hover" aria-hidden="true"><i /><i /><i /><i /><em>VIEW · 24MM</em></span>
      </div>
      <div className="work-info">
        <h3>{p.title} <span className="yr">— {p.year}</span></h3>
        <span className="work-meta">{p.catLabel} · {p.loc}</span>
        <p>{p.desc}</p>
        <span className="work-open">Open story →</span>
      </div>
    </article>
  );
}

export default function Work({ onOpen }: WorkProps) {
  const [filter, setFilter] = useState('all');
  const tagRef = useRef<HTMLDivElement>(null);

  const showTag = (): void => {
    if (canHoverFine()) tagRef.current?.classList.add('show');
  };
  const hideTag = (): void => tagRef.current?.classList.remove('show');
  const moveTag = (e: React.MouseEvent): void => {
    const t = tagRef.current;
    if (!t) return;
    t.style.left = `${e.clientX}px`;
    t.style.top = `${e.clientY}px`;
  };

  return (
    <section className="section" id="work" aria-label="Selected work">
      <div className="wrap">
        <div className="sec-head" data-reveal>
          <div className="sec-index"><span>02</span><em>Selected Work</em></div>
          <h2 className="sec-title">Work <span className="count">/ 08</span></h2>
          <p className="sec-note">An editorial cut — eight long-term series. Open any story for the full edit, captions and field notes.</p>
        </div>
        <div className="filters" role="tablist" aria-label="Filter work by category" data-reveal>
          {CATEGORIES.map((c) => (
            <button
              key={c.value}
              type="button"
              className={`filter${filter === c.value ? ' is-active' : ''}`}
              role="tab"
              aria-selected={filter === c.value}
              onClick={() => { playShutter('step'); setFilter(c.value); }}
            >
              {c.label}
            </button>
          ))}
        </div>
        <div className="work-grid">
          {PROJECTS.map((p) => (
            <WorkCard
              key={p.id}
              p={p}
              hidden={filter !== 'all' && p.cat !== filter}
              onOpen={onOpen}
              showTag={showTag}
              hideTag={hideTag}
              moveTag={moveTag}
            />
          ))}
        </div>
        <p className="work-foot mono" data-reveal>All frames © Aayush Neupane — Jhapa · Kathmandu valley. Prints available on request.</p>
      </div>
      <div className="cursor-tag" ref={tagRef} aria-hidden="true">View →</div>
    </section>
  );
}
