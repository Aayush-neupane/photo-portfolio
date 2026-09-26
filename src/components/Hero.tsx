import { useLayoutEffect, useRef } from 'react';
import { mid } from '../lib/img';

const clamp = (v: number, a = 0, b = 1): number => Math.min(b, Math.max(a, v));
const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;
const smooth = (t: number): number => t * t * (3 - 2 * t);

/** Staggered entrance thresholds for Layer B fragments. */
const STARTS: Record<string, number> = {
  mini: 0.5, l1: 0.55, l2: 0.6, sub: 0.68, cta: 0.74, specs: 0.8,
};

/**
 * Scroll-to-expand viewfinder hero. A centered camera frame grows to
 * fullscreen, coupled to scroll position; viewfinder chrome fades while
 * the statement layer staggers in. Zero dependencies — plain rAF loop.
 */
export default function Hero() {
  const stageRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLImageElement>(null);
  const scrimRef = useRef<HTMLDivElement>(null);
  const chromeRef = useRef<HTMLDivElement>(null);
  const cornersRef = useRef<HTMLDivElement>(null);
  const focusRef = useRef<HTMLDivElement>(null);
  const layerARef = useRef<HTMLDivElement>(null);
  const layerBRef = useRef<HTMLDivElement>(null);
  const cueRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const frameNoRef = useRef<HTMLSpanElement>(null);
  const camWrapRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const stage = stageRef.current;
    const frame = frameRef.current;
    const photo = photoRef.current;
    const scrim = scrimRef.current;
    const chrome = chromeRef.current;
    const corners = cornersRef.current;
    const focus = focusRef.current;
    const layerA = layerARef.current;
    const layerB = layerBRef.current;
    const cue = cueRef.current;
    const bar = barRef.current;
    const frameNo = frameNoRef.current;
    const camWrap = camWrapRef.current;
    if (!stage || !frame || !photo || !scrim || !chrome || !corners ||
        !focus || !layerA || !layerB || !cue || !bar || !frameNo || !camWrap) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const bits = Array.from(layerB.querySelectorAll<HTMLElement>('[data-hero]'));

    let stageTop = 0;
    let stageH = 1;
    const measure = (): void => {
      stageTop = stage.getBoundingClientRect().top + window.scrollY;
      stageH = stage.offsetHeight;
    };
    measure();

    const render = (): void => {
      if (reduced) {
        frame.style.width = '100vw';
        frame.style.height = '100vh';
        photo.style.transform = 'scale(1)';
        scrim.style.opacity = '.5';
        chrome.style.opacity = '0';
        corners.style.opacity = '0';
        camWrap.style.opacity = '0';
        camWrap.style.visibility = 'hidden';
        frame.style.left = '0';
        frame.style.top = '0';
        layerA.style.opacity = '0';
        layerA.style.visibility = 'hidden';
        layerB.style.opacity = '1';
        layerB.style.visibility = 'visible';
        bits.forEach((el) => { el.style.opacity = '1'; el.style.transform = 'none'; });
        cue.style.opacity = '0';
        bar.style.transform = 'scaleX(1)';
        frameNo.textContent = '008';
        return;
      }
      const vh = window.innerHeight;
      const vw = window.innerWidth;
      const p = clamp((window.scrollY - stageTop) / Math.max(1, stageH - vh));
      const e = smooth(clamp(p / 0.58));
      frameNo.textContent = String(1 + Math.round(e * 7)).padStart(3, '0');
      // Two-phase expansion. (A) Camera + photo travel and grow locked
      // together. (B) The body keeps moving to the very end, dissolving
      // only as the photo lands fullscreen on the full hero statement.
      const ES = 0.55;
      const e2 = clamp((e - ES) / (1 - ES));
      // Exact LCD fractions of the 600x400 camera artwork
      const LX = 0.12;
      const LY = 0.35;
      const LW = 0.5167;
      const LH = 0.475;
      const camW0 = Math.min(640, vw * 0.94, vh * 1.15);
      const camH0 = (camW0 * 400) / 600;
      const zoom = e < ES ? 1 + 0.45 * (e / ES) : 1.45 + 0.45 * e2;
      const camW = camW0 * zoom;
      const camH = camH0 * zoom;
      const camX = vw / 2 - camW / 2;
      const camY = vh / 2 - camH / 2 - 60 * e2;
      // LCD rect of the live camera box
      const lcdX = camX + camW * LX;
      const lcdY = camY + camH * LY;
      const lcdW = camW * LW;
      const lcdH = camH * LH;
      // Handoff rect where phase B begins (zoom 1.45, no drift)
      const hw = camW0 * 1.45;
      const hh = camH0 * 1.45;
      const hx = vw / 2 - hw / 2 + hw * LX;
      const hy = vh / 2 - hh / 2 + hh * LY;
      const hlcdW = hw * LW;
      const hlcdH = hh * LH;
      frame.style.left = `${e < ES ? lcdX : lerp(hx, 0, e2)}px`;
      frame.style.top = `${e < ES ? lcdY : lerp(hy, 0, e2)}px`;
      frame.style.width = `${e < ES ? lcdW : lerp(hlcdW, vw, e2)}px`;
      frame.style.height = `${e < ES ? lcdH : lerp(hlcdH, vh, e2)}px`;
      camWrap.style.width = `${camW}px`;
      camWrap.style.height = `${camH}px`;
      camWrap.style.left = `${camX}px`;
      camWrap.style.top = `${camY}px`;
      camWrap.style.opacity = String(e < 0.75 ? 1 : 1 - (e - 0.75) / 0.25);
      camWrap.style.visibility = e >= 1 ? 'hidden' : 'visible';
      // LCD interface scales with the assembly, full-size at handoff
      const uiS = e < ES ? 0.62 + 0.38 * (e / ES) : 1;
      chrome.style.fontSize = `${10 * uiS}px`;
      focus.style.width = `${120 * uiS}px`;
      focus.style.height = `${120 * uiS}px`;
      focus.style.fontSize = `${10 * uiS}px`;
      photo.style.transform = `scale(${lerp(1.16, 1.02, e)})`;
      scrim.style.opacity = String(lerp(0.42, 0.52, e));
      chrome.style.opacity = String(clamp(1 - e2 * 1.6));
      corners.style.opacity = String(clamp(1 - e2 * 2.2));
      focus.style.transform = `translate(-50%,-50%) scale(${1 + e2 * 0.9})`;
      focus.style.opacity = String(clamp(1 - e2 * 1.8));

      // Caption block rides the LCD's true center (low in the body)
      const lcdCx = camX + camW * (LX + LW / 2);
      const lcdCy = camY + camH * (LY + LH / 2);
      layerA.style.left = `${lcdCx}px`;
      layerA.style.top = `${lcdCy}px`;
      layerA.style.opacity = String(clamp(1 - p / 0.14));
      layerA.style.transform = `translate(-50%,-50%) translateY(${-34 * clamp(p / 0.2)}px) scale(${0.8 + 0.2 * clamp(p / 0.2)})`;
      layerA.style.visibility = p > 0.16 ? 'hidden' : 'visible';

      bits.forEach((el) => {
        const s = STARTS[el.dataset.hero ?? ''] ?? 0.6;
        const o = clamp((p - s) / 0.1);
        el.style.opacity = String(o);
        el.style.transform = `translateY(${26 * (1 - o)}px)`;
      });
      layerB.style.opacity = p > 0.48 ? '1' : '0';
      layerB.style.visibility = p > 0.48 ? 'visible' : 'hidden';
      cue.style.opacity = String(clamp(1 - p / 0.07));
      bar.style.transform = `scaleX(${p})`;
    };

    let ticking = false;
    const onScroll = (): void => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => { render(); ticking = false; });
      }
    };
    const onResize = (): void => { measure(); render(); };

    render();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    window.addEventListener('load', measure);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('load', measure);
    };
  }, []);

  return (
    <section className="hero-stage" id="heroStage" aria-label="Introduction — Aayush Neupane, photographer" ref={stageRef}>
      <div className="hero-sticky">
        <div className="hero-progress" aria-hidden="true"><span ref={barRef} /></div>

        <div className="hero-center">
          <div className="hero-frame" ref={frameRef}>
            <div className="hero-photo-clip">
              <img
                ref={photoRef}
                src={mid('/gallery/the-beginning-after-the-end.jpeg')}
                alt="Sun setting behind tree silhouettes while the moon rises over eastern Nepal"
                fetchPriority="high"
                decoding="async"
              />
              <div className="hero-scrim" ref={scrimRef} aria-hidden="true" />
              <div className="vf" ref={chromeRef} aria-hidden="true">
                <div className="vf-top"><span>EASTERN NEPAL</span><span className="vf-rec"><i />FRAME <span ref={frameNoRef}>001</span> / 008</span></div>
                <div className="vf-grid"><span /><span /><span /><span /><span /><span /><span /><span /><span /></div>
                <div className="vf-focus" ref={focusRef}><span /><span /><span /><span /><em>24MM</em></div>
                <div className="vf-bottom"><span>ƒ/1.8 &nbsp;&nbsp; 1/2000 &nbsp;&nbsp; ISO 50</span><span>−0.7 EV &nbsp;·&nbsp; AWB</span></div>
              </div>
              <div className="vf-corners" ref={cornersRef} aria-hidden="true"><span /><span /><span /><span /></div>
            </div>
          </div>
          {/* Manufactured rangefinder back — the live photo sits in its LCD */}
          <div className="cam-wrap" ref={camWrapRef} aria-hidden="true">
            <svg viewBox="0 0 600 400" width="100%" height="100%" role="presentation">
              <defs>
                <linearGradient id="camTop" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#7A756F" />
                  <stop offset=".35" stopColor="#57534D" />
                  <stop offset=".8" stopColor="#35322E" />
                  <stop offset="1" stopColor="#232120" />
                </linearGradient>
                <linearGradient id="camBody" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#2A2723" />
                  <stop offset=".6" stopColor="#211E1B" />
                  <stop offset="1" stopColor="#171412" />
                </linearGradient>
                <radialGradient id="camShade" cx=".5" cy=".38" r=".78">
                  <stop offset="0" stopColor="#000" stopOpacity="0" />
                  <stop offset=".68" stopColor="#000" stopOpacity="0" />
                  <stop offset="1" stopColor="#000" stopOpacity=".3" />
                </radialGradient>
                <radialGradient id="silverBtn" cx=".38" cy=".32" r=".9">
                  <stop offset="0" stopColor="#9A9590" />
                  <stop offset=".6" stopColor="#5C5852" />
                  <stop offset="1" stopColor="#33302C" />
                </radialGradient>
                <pattern id="knurl" width="5" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(24)">
                  <rect width="5" height="6" fill="#100F0D" />
                  <line x1="0" y1="0" x2="0" y2="6" stroke="#45413B" strokeWidth="2.2" />
                </pattern>
                <filter id="camGrain" x="0" y="0" width="100%" height="100%">
                  <feTurbulence type="fractalNoise" baseFrequency=".8" numOctaves="2" result="n" />
                  <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.79 0 0 0 0 0.73 0 0 0 0 0.66 0 0 0 .09 0" />
                </filter>
              </defs>
              {/* strap lugs */}
              <rect x="12" y="150" width="10" height="26" rx="5" fill="#141210" stroke="rgba(201,187,168,.4)" strokeWidth="1.5" />
              <circle cx="15" cy="163" r="2" fill="none" stroke="rgba(201,187,168,.5)" strokeWidth="1.25" />
              <rect x="578" y="150" width="10" height="26" rx="5" fill="#141210" stroke="rgba(201,187,168,.4)" strokeWidth="1.5" />
              <circle cx="585" cy="163" r="2" fill="none" stroke="rgba(201,187,168,.5)" strokeWidth="1.25" />
              {/* main body */}
              <rect x="20" y="40" width="560" height="320" rx="24" fill="url(#camBody)" stroke="rgba(201,187,168,.35)" strokeWidth="1.5" />
              {/* leatherette grain + depth shading */}
              <rect x="28" y="128" width="544" height="224" rx="14" filter="url(#camGrain)" />
              <rect x="20" y="40" width="560" height="320" rx="24" fill="url(#camShade)" />
              {/* pop-up flash head */}
              <rect x="248" y="10" width="104" height="34" rx="6" fill="#1E1B18" stroke="rgba(201,187,168,.4)" strokeWidth="1.5" />
              <rect x="260" y="16" width="80" height="20" rx="3" fill="#D8D2C4" opacity=".92" />
              <line x1="287" y1="16" x2="287" y2="36" stroke="#8A8580" strokeWidth="1.5" />
              <line x1="313" y1="16" x2="313" y2="36" stroke="#8A8580" strokeWidth="1.5" />
              <rect x="260" y="16" width="80" height="20" rx="3" fill="none" stroke="rgba(0,0,0,.5)" strokeWidth="1" />
              {/* EVF eyecup */}
              <rect x="150" y="20" width="92" height="26" rx="9" fill="#1E1B18" stroke="rgba(201,187,168,.4)" strokeWidth="1.5" />
              <rect x="160" y="27" width="72" height="12" rx="6" fill="#0B0A09" stroke="rgba(201,187,168,.25)" strokeWidth="1" />
              {/* satin top plate + top light catch */}
              <path d="M20 64 Q20 40 44 40 H556 Q580 40 580 64 V104 H20 Z" fill="url(#camTop)" stroke="rgba(201,187,168,.4)" strokeWidth="1.5" />
              <line x1="48" y1="44.5" x2="552" y2="44.5" stroke="#fff" strokeOpacity=".16" strokeWidth="1.5" />
              {/* plate screws */}
              <g fill="#1B1917" stroke="rgba(201,187,168,.55)" strokeWidth="1">
                <circle cx="40" cy="94" r="4" />
                <circle cx="560" cy="94" r="4" />
              </g>
              <g stroke="rgba(201,187,168,.6)" strokeWidth="1">
                <line x1="37.5" y1="94" x2="42.5" y2="94" />
                <line x1="40" y1="91.5" x2="40" y2="96.5" />
                <line x1="557.5" y1="94" x2="562.5" y2="94" />
                <line x1="560" y1="91.5" x2="560" y2="96.5" />
              </g>
              {/* left mode dial */}
              <circle cx="96" cy="72" r="21" fill="none" stroke="url(#knurl)" strokeWidth="7" />
              <circle cx="96" cy="72" r="16" fill="#1B1917" stroke="rgba(201,187,168,.5)" strokeWidth="1.5" />
              <line x1="96" y1="58" x2="96" y2="65" stroke="#C9BBA8" strokeWidth="2.5" />
              {/* hot shoe */}
              <rect x="272" y="60" width="56" height="20" rx="2" fill="#141210" stroke="rgba(201,187,168,.55)" strokeWidth="1.5" />
              <line x1="272" y1="66" x2="328" y2="66" stroke="rgba(201,187,168,.35)" strokeWidth="1" />
              <line x1="272" y1="74" x2="328" y2="74" stroke="rgba(201,187,168,.35)" strokeWidth="1" />
              <rect x="290" y="67" width="4" height="4" fill="rgba(201,187,168,.6)" />
              <rect x="306" y="67" width="4" height="4" fill="rgba(201,187,168,.6)" />
              {/* red dot */}
              <circle cx="348" cy="72" r="10" fill="#C9603C" opacity=".18" />
              <circle cx="348" cy="72" r="4.5" fill="#C9603C" />
              <circle cx="348" cy="72" r="7" fill="none" stroke="rgba(201,187,168,.35)" strokeWidth="1" />
              {/* shutter dial with engraved speeds */}
              <circle cx="470" cy="72" r="22" fill="none" stroke="url(#knurl)" strokeWidth="7" />
              <circle cx="470" cy="72" r="17" fill="#1B1917" stroke="rgba(201,187,168,.5)" strokeWidth="1.5" />
              <path d="M470 41 l5 8 h-10 z" fill="#C9603C" />
              <g stroke="#C9BBA8" strokeWidth="1.5" opacity=".8">
                <line x1="457.5" y1="72" x2="454.5" y2="72" />
                <line x1="459.8" y1="64.8" x2="457.3" y2="63.1" />
                <line x1="465.7" y1="60.3" x2="464.7" y2="57.4" />
                <line x1="474.3" y1="60.3" x2="475.3" y2="57.4" />
                <line x1="480.2" y1="64.8" x2="482.7" y2="63.1" />
                <line x1="482.5" y1="72" x2="485.5" y2="72" />
              </g>
              <text x="470" y="76" fontFamily="IBM Plex Mono, monospace" fontSize="9" fill="#C9BBA8" textAnchor="middle">1000</text>
              {/* soft-release shutter button */}
              <circle cx="540" cy="56" r="11" fill="#1E1B18" stroke="rgba(201,187,168,.45)" strokeWidth="1.5" />
              <circle cx="540" cy="56" r="8" fill="url(#silverBtn)" stroke="rgba(0,0,0,.6)" strokeWidth="1" />
              <circle cx="540" cy="56" r="3" fill="#C9603C" />
              {/* flash-ready bolt */}
              <circle cx="36" cy="200" r="9" fill="#E8A33D" opacity=".16" />
              <path d="M38.5 192 L32 202 L36.5 202 L34.5 210 L41 200 L36.5 200 Z" fill="#E8A33D" />
              {/* screen bezel + backing */}
              <rect x="60" y="128" width="334" height="214" rx="10" fill="#0B0A09" stroke="#000" strokeWidth="2" />
              <rect x="62.5" y="130.5" width="329" height="209" rx="8" fill="none" stroke="rgba(255,255,255,.1)" strokeWidth="1" />
              <rect x="72" y="140" width="310" height="190" fill="#050505" />
              {/* Fn button */}
              <circle cx="414" cy="238" r="11" fill="#1E1B18" stroke="rgba(201,187,168,.4)" strokeWidth="1.25" />
              <text x="414" y="241" fontFamily="IBM Plex Mono, monospace" fontSize="7" fill="#C9BBA8" textAnchor="middle" letterSpacing="1">Fn</text>
              {/* d-pad */}
              <circle cx="488" cy="238" r="55" fill="#141210" stroke="rgba(201,187,168,.45)" strokeWidth="1.5" />
              <circle cx="488" cy="238" r="41" fill="none" stroke="rgba(201,187,168,.18)" strokeWidth="1" />
              <path d="M488 200l10 13h-20z M488 276l-10-13h20z M450 238l13-10v20z M526 238l-13 10v-20z" fill="#C9BBA8" opacity=".85" />
              <circle cx="488" cy="238" r="16" fill="#1E1B18" stroke="rgba(201,187,168,.5)" strokeWidth="1.5" />
              <circle cx="488" cy="238" r="4" fill="#C9BBA8" opacity=".9" />
              {/* buttons */}
              <g fontFamily="IBM Plex Mono, monospace" fontSize="9" fill="#C9BBA8" textAnchor="middle" letterSpacing="2">
                <rect x="419" y="146" width="62" height="22" rx="11" fill="#1E1B18" stroke="rgba(201,187,168,.4)" strokeWidth="1.25" />
                <line x1="429" y1="148.5" x2="471" y2="148.5" stroke="#fff" strokeOpacity=".12" strokeWidth="1" />
                <text x="450" y="161">MENU</text>
                <rect x="495" y="146" width="62" height="22" rx="11" fill="#1E1B18" stroke="rgba(201,187,168,.4)" strokeWidth="1.25" />
                <line x1="505" y1="148.5" x2="547" y2="148.5" stroke="#fff" strokeOpacity=".12" strokeWidth="1" />
                <text x="526" y="161">PLAY</text>
                <rect x="419" y="304" width="138" height="22" rx="11" fill="#1E1B18" stroke="rgba(201,187,168,.4)" strokeWidth="1.25" />
                <line x1="429" y1="306.5" x2="547" y2="306.5" stroke="#fff" strokeOpacity=".12" strokeWidth="1" />
                <text x="488" y="319">DELETE</text>
              </g>
              {/* battery door + latch */}
              <rect x="430" y="341" width="95" height="15" rx="3" fill="none" stroke="rgba(201,187,168,.25)" strokeWidth="1" />
              <circle cx="442" cy="348.5" r="2.5" fill="none" stroke="rgba(201,187,168,.4)" strokeWidth="1" />
              {/* baseplate seam + tripod socket */}
              <line x1="24" y1="338" x2="576" y2="338" stroke="rgba(201,187,168,.22)" strokeWidth="1" />
              <circle cx="300" cy="349" r="7" fill="none" stroke="rgba(201,187,168,.55)" strokeWidth="1.5" />
              <circle cx="300" cy="349" r="2" fill="rgba(201,187,168,.6)" />
              <g fill="#1B1917" stroke="rgba(201,187,168,.5)" strokeWidth="1">
                <circle cx="60" cy="349" r="3.5" />
                <circle cx="540" cy="349" r="3.5" />
              </g>
            </svg>
          </div>
        </div>

        <div className="hero-layer hero-layer-a" ref={layerARef}>
          <p className="mono-label light">Portfolio — 2024 → 2026</p>
          <div className="layer-a-rule" aria-hidden="true"><span /><em>◉ ◎ ◉</em><span /></div>
        </div>

        <div className="hero-layer hero-layer-b" ref={layerBRef}>
          <p className="mono-label light mini" data-hero="mini">Jhapa — Eastern Nepal</p>
          <h1 className="hero-title">
            <span className="hero-line" data-hero="l1">Stories told through</span>
            <span className="hero-line italic" data-hero="l2">light, people &amp; places.</span>
          </h1>
          <p className="hero-sub" data-hero="sub">I’m Aayush — I shoot streets, skies and gardens around Jhapa and the valley, in natural light.</p>
          <div className="hero-actions" data-hero="cta">
            <a href="#work" className="cta-line">Explore Work <span aria-hidden="true">→</span></a>
            <a href="#contact" className="cta-ghost">Say hello</a>
          </div>
          <dl className="hero-specs" data-hero="specs">
            <div><dt>Base</dt><dd>Jhapa, Nepal</dd></div>
            <div><dt>Shoots</dt><dd>Streets · Skies · Garden</dd></div>
            <div><dt>Light</dt><dd>Natural, always</dd></div>
          </dl>
        </div>

        <div className="hero-cue" ref={cueRef} aria-hidden="true">
          <span>Scroll to develop</span>
          <span className="cue-line"><span /></span>
        </div>
        <div className="hero-side mono" aria-hidden="true"><span>N 26°38′ — E 88°07′</span><span>JHAPA — NEPAL</span></div>
      </div>
    </section>
  );
}
