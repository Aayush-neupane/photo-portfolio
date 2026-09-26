/**
 * Synthesized camera-shutter sounds — zero audio assets.
 * A clack is two filtered noise bursts (mirror up, curtains) plus a low
 * body thump. Everything plays only from explicit user gestures
 * (clicks / keys), so autoplay policies are always satisfied.
 */

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let muted = false;

/** Tiny humanization so rapid repeats never sound machine-stamped. */
function jitter(amount: number): number {
  return 1 + (Math.random() * 2 - 1) * amount;
}

export function setShutterMuted(m: boolean): void {
  muted = m;
}

function ac(): AudioContext | null {
  try {
    if (!ctx) {
      const AC =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    if (ctx.state === 'suspended') void ctx.resume();
    if (!master) {
      const comp = ctx.createDynamicsCompressor();
      comp.threshold.value = -18;
      comp.ratio.value = 6;
      comp.attack.value = 0.002;
      comp.release.value = 0.12;
      master = ctx.createGain();
      master.gain.value = 0.9;
      master.connect(comp);
      comp.connect(ctx.destination);
    }
    return ctx;
  } catch {
    return null;
  }
}

function burst(t0: number, dur: number, type: BiquadFilterType, freq: number, gain: number): void {
  const c = ac();
  if (!c || muted || !master) return;
  const len = Math.max(1, Math.floor(c.sampleRate * dur));
  const buf = c.createBuffer(1, len, c.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
  const src = c.createBufferSource();
  src.buffer = buf;
  const f = c.createBiquadFilter();
  f.type = type;
  f.frequency.value = freq;
  const g = c.createGain();
  g.gain.setValueAtTime(gain, t0);
  g.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
  src.connect(f);
  f.connect(g);
  g.connect(master);
  src.start(t0);
}

function thump(t0: number, gain = 0.28): void {
  const c = ac();
  if (!c || muted || !master) return;
  const o = c.createOscillator();
  o.type = 'sine';
  o.frequency.setValueAtTime(140, t0);
  o.frequency.exponentialRampToValueAtTime(55, t0 + 0.09);
  const g = c.createGain();
  g.gain.setValueAtTime(gain, t0);
  g.gain.exponentialRampToValueAtTime(0.001, t0 + 0.1);
  o.connect(g);
  g.connect(master);
  o.start(t0);
  o.stop(t0 + 0.11);
}

/** Faint spring whirr under the curtains. */
function whirr(t0: number): void {
  const c = ac();
  if (!c || muted || !master) return;
  const dur = 0.14;
  const len = Math.max(1, Math.floor(c.sampleRate * dur));
  const buf = c.createBuffer(1, len, c.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
  const src = c.createBufferSource();
  src.buffer = buf;
  const f = c.createBiquadFilter();
  f.type = 'bandpass';
  f.frequency.value = 750;
  f.Q.value = 8;
  const g = c.createGain();
  g.gain.setValueAtTime(0.07, t0);
  g.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
  src.connect(f);
  f.connect(g);
  g.connect(master);
  src.start(t0);
}

export type ShutterKind = 'open' | 'step' | 'send';

/** Play a shutter sound. Safe to call anywhere — no-ops when muted. */
export function playShutter(kind: ShutterKind = 'step'): void {
  if (muted) return;
  const c = ac();
  if (!c || !master) return;
  const t = c.currentTime + 0.01;
  if (kind === 'open') {
    // mirror slap — bright, loud crack
    burst(t, 0.035, 'highpass', 3000, 0.85 * jitter(0.06));
    // first curtain chasing it
    burst(t + 0.028 * jitter(0.1), 0.045, 'bandpass', 1700, 0.55);
    // second curtain + mirror return, duller and heavier
    burst(t + 0.1 * jitter(0.08), 0.06, 'bandpass', 900, 0.5);
    thump(t + 0.02, 0.4);
    whirr(t + 0.01);
  } else if (kind === 'send') {
    burst(t, 0.03, 'highpass', 2200, 0.5);
    burst(t + 0.06, 0.04, 'bandpass', 1200, 0.35);
    thump(t + 0.01, 0.3);
  } else {
    // advance lever: two quick mechanical taps
    burst(t, 0.025, 'highpass', 3200, 0.5 * jitter(0.08));
    burst(t + 0.055 * jitter(0.1), 0.03, 'bandpass', 1900, 0.38);
  }
}
