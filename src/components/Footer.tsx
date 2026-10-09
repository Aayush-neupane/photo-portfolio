const LINKS = [
  { href: '#work', label: 'Work' },
  { href: '#about', label: 'About' },
  { href: '#services', label: 'Services' },
  { href: '#journal', label: 'Journal' },
  { href: '#contact', label: 'Contact' },
];

export default function Footer({ sound, onToggleSound }: { sound: boolean; onToggleSound: () => void }) {
  const toTop = (e: React.MouseEvent<HTMLAnchorElement>): void => {
    e.preventDefault();
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
  };

  return (
    <footer className="footer" aria-label="Footer">
      <div className="wrap">
        <div className="foot-top">
          <p className="foot-name foot-name-with-mark">
            <img src="/logo.svg" alt="" aria-hidden="true" width={64} height={64} draggable={false} loading="lazy" className="foot-mark" />
            <span>Aayush Neupane</span>
          </p>
          <nav className="foot-nav" aria-label="Footer">
            {LINKS.map((l) => (
              <a key={l.href} href={l.href}>{l.label}</a>
            ))}
          </nav>
        </div>
        <div className="foot-mid">
          <span>© 2026 Aayush Neupane. All photographs are the author’s.</span>
          <span className="foot-social"><a href="https://www.instagram.com/dynamic_aayush38" target="_blank" rel="noopener">Instagram</a> · <a href="mailto:theghostoftheuchiha38@gmail.com">Email</a></span>
        </div>
        <div className="foot-base mono">
          <button type="button" className="sound-toggle" aria-pressed={sound} onClick={onToggleSound}>
            <i aria-hidden="true" /> Sound · {sound ? 'On' : 'Off'}
          </button>
          <a href="#top" onClick={toTop}>Back to top ↑</a>
        </div>
        <div className="foot-credit">
          <a
            href="https://aayushnp.netlify.app"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Aayush Neupane — portfolio"
          >
            <img src="/logo.svg" alt="Aayush Neupane" width={40} height={40} draggable={false} loading="lazy" />
            <span>Developed by <span>Aayush Neupane</span></span>
          </a>
        </div>
      </div>
    </footer>
  );
}
