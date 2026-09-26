import { useEffect, useState } from 'react';
import { playShutter } from '../lib/shutter';

const LINKS = [
  { href: '#work', label: 'Work' },
  { href: '#about', label: 'About' },
  { href: '#services', label: 'Services' },
  { href: '#journal', label: 'Journal' },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = (): void => {
      const stage = document.getElementById('heroStage');
      if (!stage) {
        setScrolled(window.scrollY > window.innerHeight * 0.8);
        return;
      }
      setScrolled(window.scrollY > stage.offsetTop + stage.offsetHeight - window.innerHeight * 0.6);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open ]);

  return (
    <>
      <header className={`nav${scrolled ? ' scrolled' : ''}`} id="nav">
        <div className="nav-inner">
          <a href="#top" className="brand brand-with-mark" aria-label="Aayush Neupane — home">
            <img src="/logotrp.png" alt="" aria-hidden="true" width={42} height={42} draggable={false} className="brand-mark-img" />
            <span className="brand-text">
              <span className="brand-name">Aayush Neupane</span>
              <span className="brand-sub">Photography · Jhapa</span>
            </span>
          </a>
          <nav className="nav-links" aria-label="Primary">
            {LINKS.map((l) => (
              <a key={l.href} href={l.href}>{l.label}</a>
            ))}
            <a href="#contact" className="nav-cta">Contact <span aria-hidden="true">→</span></a>
          </nav>
          <div className="nav-meta" aria-hidden="true"><span className="avail-dot" /> Jhapa, Nepal</div>
          <button
            className="menu-btn"
            type="button"
            aria-expanded={open}
            aria-controls="mobileMenu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => { playShutter('step'); setOpen((o) => !o); }}
          >
            <span /><span />
          </button>
        </div>
      </header>
      {!open ? null : (
        <div className="mobile-menu" id="mobileMenu">
          <nav aria-label="Mobile">
            {[...LINKS, { href: '#contact', label: 'Contact' }].map((l) => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)}>{l.label}</a>
            ))}
          </nav>
          <div className="mobile-foot">
            <span>theghostoftheuchiha38@gmail.com</span>
            <span>Jhapa — Nepal</span>
          </div>
        </div>
      )}
    </>
  );
}
