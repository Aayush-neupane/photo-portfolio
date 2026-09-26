import { useCallback, useEffect, useRef, useState } from 'react';
import Nav from './components/Nav';
import Hero from './components/Hero';
import Manifesto from './components/Manifesto';
import Work from './components/Work';
import RollStrip from './components/RollStrip';
import Interlude from './components/Interlude';
import About from './components/About';
import Services from './components/Services';
import Journal from './components/Journal';
import Contact, { type EnquiryPrefill } from './components/Contact';
import Footer from './components/Footer';
import ProjectOverlay from './components/ProjectOverlay';
import ArticleOverlay from './components/ArticleOverlay';
import Lightbox from './components/Lightbox';
import { PROJECTS, type GalleryImage } from './data/projects';
import { POSTS } from './data/posts';
import { playShutter, setShutterMuted } from './lib/shutter';

export interface LightboxState {
  images: GalleryImage[];
  index: number;
}

export default function App() {
  const [projectIdx, setProjectIdx] = useState<number | null>(null);
  const [articleId, setArticleId] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<LightboxState | null>(null);
  const [prefill, setPrefill] = useState<EnquiryPrefill | null>(null);
  const [formKey, setFormKey] = useState(0);
  const [sound, setSound] = useState<boolean>(() => {
    try {
      return window.localStorage.getItem('at-sound') !== '0';
    } catch {
      return true;
    }
  });

  useEffect(() => {
    setShutterMuted(!sound);
    try {
      window.localStorage.setItem('at-sound', sound ? '1' : '0');
    } catch {
      /* private mode — stay ephemeral */
    }
  }, [sound]);
  const [shutter, setShutter] = useState(false);
  const shutterTimer = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (shutterTimer.current) window.clearTimeout(shutterTimer.current);
    },
    [],
  );

  // Lock body scroll while any overlay is open.
  useEffect(() => {
    const locked = projectIdx !== null || articleId !== null || lightbox !== null;
    document.body.style.overflow = locked ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [projectIdx, articleId, lightbox]);

  // Scroll-spy reveals. Deliberately NOT IntersectionObserver (clip-path
  // shutters collapse IO intersection to zero). Queries the live DOM on
  // every check and never caches nodes — the contact form remounts on
  // enquiry prefill, and a cached list would keep pointing at the detached
  // node while the live form stays invisible forever.
  useEffect(() => {
    const check = (): void => {
      const vh = window.innerHeight;
      let rest = false;
      document.querySelectorAll<HTMLElement>('[data-reveal]:not(.in)').forEach((el) => {
        if (el.getBoundingClientRect().top < vh) {
          el.classList.add('in');
        } else {
          rest = true;
        }
      });
      if (!rest) {
        window.removeEventListener('scroll', onScroll);
        document.removeEventListener('scrollend', onScrollEnd);
      }
    };
    let ticking = false;
    const onScroll = (): void => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          check();
          ticking = false;
        });
      }
    };
    const onResize = (): void => {
      check();
    };
    const onScrollEnd = (): void => {
      check();
    };
    check();
    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('scrollend', onScrollEnd);
    window.addEventListener('resize', onResize);
    window.addEventListener('load', onResize);
    if (document.fonts) {
      document.fonts.ready.then(onResize).catch(() => {});
    }
    return () => {
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('scrollend', onScrollEnd);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('load', onResize);
    };
  }, []);

  // Global keyboard handling — lightbox takes priority over project, then article.
  useEffect(() => {
    const onKey = (e: KeyboardEvent): void => {
      if (lightbox) {
        if (e.key === 'Escape') setLightbox(null);
        else if (e.key === 'ArrowRight') {
          setLightbox((lb) => (lb ? { ...lb, index: (lb.index + 1) % lb.images.length } : lb));
        } else if (e.key === 'ArrowLeft') {
          setLightbox((lb) => (lb ? { ...lb, index: (lb.index - 1 + lb.images.length) % lb.images.length } : lb));
        }
        return;
      }
      if (projectIdx !== null) {
        if (e.key === 'Escape') setProjectIdx(null);
        else if (e.key === 'ArrowRight') setProjectIdx((i) => (i === null ? i : (i + 1) % PROJECTS.length));
        else if (e.key === 'ArrowLeft') setProjectIdx((i) => (i === null ? i : (i + PROJECTS.length - 1) % PROJECTS.length));
        return;
      }
      if (articleId !== null && e.key === 'Escape') setArticleId(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightbox, projectIdx, articleId]);

  const openProject = useCallback((id: string): void => {
    const i = PROJECTS.findIndex((p) => p.id === id);
    if (i < 0) return;
    playShutter('open');
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setProjectIdx(i);
      return;
    }
    if (shutterTimer.current) window.clearTimeout(shutterTimer.current);
    setProjectIdx(i);
    setShutter(true);
    shutterTimer.current = window.setTimeout(() => setShutter(false), 260);
  }, []);

  const openLightbox = useCallback((images: GalleryImage[], index: number): void => {
    playShutter('step');
    setLightbox({ images, index });
  }, []);

  const openArticle = useCallback((id: string): void => {
    playShutter('open');
    setArticleId(id);
  }, []);

  const closeProject = useCallback((): void => {
    playShutter('step');
    setProjectIdx(null);
  }, []);

  const closeArticle = useCallback((): void => {
    playShutter('step');
    setArticleId(null);
  }, []);

  const closeLightbox = useCallback((): void => {
    playShutter('step');
    setLightbox(null);
  }, []);

  const stepLightbox = useCallback((dir: 1 | -1): void => {
    playShutter('step');
    setLightbox((lb) =>
      lb ? { ...lb, index: (lb.index + dir + lb.images.length) % lb.images.length } : lb,
    );
  }, []);

  const jumpLightbox = useCallback((i: number): void => {
    playShutter('step');
    setLightbox((lb) => (lb ? { ...lb, index: (i + lb.images.length) % lb.images.length } : lb));
  }, []);

  const navigateProject = useCallback((i: number): void => {
    playShutter('step');
    setProjectIdx(i);
  }, []);

  const enquireAbout = useCallback((im: GalleryImage): void => {
    setLightbox(null);
    setProjectIdx(null);
    setPrefill({ type: 'Print request', message: `Hi — I'd like "${im.cap}" as a print. Please share sizes and prices.` });
    setFormKey((k) => k + 1);
    window.setTimeout(() => {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      document.querySelector('#contact')?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
      // Belt and suspenders: this destination was explicitly navigated to,
      // so reveal it outright and move focus there for assistive tech.
      document
        .querySelectorAll('#contact [data-reveal]')
        .forEach((el) => el.classList.add('in'));
      (document.querySelector('#contact-title') as HTMLElement | null)?.focus({ preventScroll: true });
    }, 80);
  }, []);

  const article = POSTS.find((p) => p.id === articleId) ?? null;

  return (
    <>
      <a className="skip-link" href="#work">Skip to work</a>
      <Nav />
      <main id="top">
        <Hero />
        <Manifesto />
        <Work onOpen={openProject} />
        <RollStrip onZoom={openLightbox} />
        <Interlude />
        <About />
        <Services />
        <Journal onOpen={openArticle} />
        <Contact prefill={prefill} formKey={formKey} />
      </main>
      <Footer sound={sound} onToggleSound={() => setSound((s) => !s)} />
      {shutter && (
        <div className="shutter" aria-hidden="true">
          <span />
          <span />
        </div>
      )}
      {projectIdx !== null && (
        <ProjectOverlay
          index={projectIdx}
          onClose={closeProject}
          onNavigate={navigateProject}
          onLightbox={openLightbox}
        />
      )}
      {article && <ArticleOverlay post={article} onClose={closeArticle} />}
      {lightbox && (
        <Lightbox
          images={lightbox.images}
          index={lightbox.index}
          onClose={closeLightbox}
          onStep={stepLightbox}
          onJump={jumpLightbox}
          onEnquire={enquireAbout}
        />
      )}
    </>
  );
}
