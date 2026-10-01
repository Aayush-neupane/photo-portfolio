import type { GalleryImage } from '../data/projects';

export interface BentoTile {
  im: GalleryImage;
  /** Index into the project's images, preserved for the lightbox. */
  index: number;
  /** Exact box in px. w / h always equals the photo's own aspect ratio. */
  w: number;
  h: number;
}

export interface BentoStack {
  kind: 'stack';
  w: number;
  h: number;
  top: BentoTile;
  bottom: BentoTile;
}

export interface BentoSingle {
  kind: 'single';
  w: number;
  h: number;
  tile: BentoTile;
}

export type BentoCell = BentoSingle | BentoStack;

export interface BentoBand {
  kind: string;
  h: number;
  cells: BentoCell[];
  /** A lone photo that cannot fill the row; rendered centered, never stretched. */
  centered: boolean;
}

function arOf(im: GalleryImage): number {
  return im.w && im.h ? im.w / im.h : 1;
}

/**
 * Lays photos out as exact-fit bento bands.
 *
 * Every tile's box is derived from its own aspect ratio (w = h * ar), so no
 * frame is ever cropped. Each band's height is solved so its tiles plus gaps
 * fill the row exactly, so no gaps open up either. Bands alternate between tall
 * feature blocks (a large tile beside two stacked frames) and short rows of
 * varying counts, which is what makes the board read as bento. Photo order is
 * preserved throughout.
 */
export function packBento(
  images: GalleryImage[],
  width: number,
  gap: number
): BentoBand[] {
  if (!width || images.length === 0) return [];
  // Phones get one fluid frame per row: natural ratio, no forced box.
  if (width < 640) {
    return images.map((im, index) => {
      const ar = arOf(im);
      const w = width;
      const h = w / ar;
      return {
        kind: 'column',
        h,
        cells: [{ kind: 'single', w, h, tile: { im, index, w, h } } as BentoSingle],
        centered: false,
      };
    });
  }

  const minH = Math.max(150, width * 0.16);
  const maxRowH = Math.min(800, width * 0.7);
  const maxFeatH = Math.min(1100, width * 0.95);
  const minW = Math.max(110, width * 0.11);

  const n = images.length;
  const ars = images.map(arOf);
  const bands: BentoBand[] = [];
  let i = 0;
  let prevKind = '';
  let bandNo = 0;

  const stackS = (a: number, b: number) => (a * b) / (a + b);

  interface Built {
    kind: string;
    k: number;
    h: number;
    cells: BentoCell[];
    ncols: number;
    centered: boolean;
    fallback?: boolean;
  }

  const single = (ref: number, w: number, h: number): BentoSingle => ({
    kind: 'single',
    w,
    h,
    tile: { im: images[ref], index: ref, w, h },
  });

  function build(kind: string, idx: number): Built | null {
    const P = (k: number) => ars[idx + k];
    if (kind === 'row2' || kind === 'row3' || kind === 'row4' || kind === 'row5') {
      const k = { row2: 2, row3: 3, row4: 4, row5: 5 }[kind];
      const slice = Array.from({ length: k }, (_, j) => P(j));
      const h = (width - gap * (k - 1)) / slice.reduce((s, a) => s + a, 0);
      return {
        kind, k, h, ncols: k, centered: false,
        cells: slice.map((ar, j) => single(idx + j, h * ar, h)),
      };
    }
    if (kind === 'featL' || kind === 'featR') {
      const tallFirst = kind === 'featL';
      const arT = tallFirst ? P(0) : P(2);
      const a1 = tallFirst ? P(1) : P(0);
      const a2 = tallFirst ? P(2) : P(1);
      const S = stackS(a1, a2);
      const h = (width - gap + gap * S) / (arT + S);
      const Wc = (h - gap) * S;
      const h1 = Wc / a1;
      const h2 = Wc / a2;
      const r1 = tallFirst ? idx + 1 : idx;
      const r2 = tallFirst ? idx + 2 : idx + 1;
      const tall = single(tallFirst ? idx : idx + 2, h * arT, h);
      const stack: BentoStack = {
        kind: 'stack', w: Wc, h,
        top: { im: images[r1], index: r1, w: Wc, h: h1 },
        bottom: { im: images[r2], index: r2, w: Wc, h: h2 },
      };
      return { kind, k: 3, h, ncols: 2, centered: false, cells: tallFirst ? [tall, stack] : [stack, tall] };
    }
    if (kind === 'stack2') {
      const S1 = stackS(P(0), P(1));
      const S2 = stackS(P(2), P(3));
      const h = (width - gap) / (S1 + S2) + gap;
      const W1 = (h - gap) * S1;
      const W2 = (h - gap) * S2;
      const mk = (ref: number, w: number, h: number): BentoTile => ({ im: images[ref], index: ref, w, h });
      return {
        kind, k: 4, h, ncols: 2, centered: false,
        cells: [
          { kind: 'stack', w: W1, h, top: mk(idx, W1, W1 / P(0)), bottom: mk(idx + 1, W1, W1 / P(1)) },
          { kind: 'stack', w: W2, h, top: mk(idx + 2, W2, W2 / P(2)), bottom: mk(idx + 3, W2, W2 / P(3)) },
        ],
      };
    }
    if (kind === 'hero') {
      const ar = P(0);
      const h = Math.min(Math.max(width / ar, minH), maxRowH);
      const w = h * ar;
      return { kind, k: 1, h, ncols: 1, centered: w < width - 1, cells: [single(idx, w, h)] };
    }
    return null;
  }

  function valid(b: Built | null): b is Built {
    if (!b) return false;
    if (b.kind === 'hero') return true;
    const cap = b.kind.startsWith('row') ? maxRowH : maxFeatH;
    if (!(b.h >= minH - 1e-9 && b.h <= cap + 1e-9)) return false;
    for (const c of b.cells) {
      if (c.w < minW - 1e-9 || c.w > width - gap - minW + 1e-9) return false;
      if (c.kind === 'stack') {
        const f1 = c.top.h / b.h;
        const f2 = c.bottom.h / b.h;
        if (f1 < 0.28 || f1 > 0.72 || f2 < 0.28 || f2 > 0.72) return false;
      }
    }
    return true;
  }

  const NEED: Record<string, number> = {
    row2: 2, row3: 3, row4: 4, row5: 5, featL: 3, featR: 3, stack2: 4,
  };
  const tallIdeal = maxRowH * 0.85;
  const shortIdeal = minH * 1.5;

  while (i < n) {
    const r = n - i;
    if (r === 1) {
      bands.push(build('hero', i) as Built);
      i += 1;
      prevKind = 'hero';
      bandNo++;
      continue;
    }
    const ideal = bandNo % 2 === 0 ? tallIdeal : shortIdeal;
    const order =
      bandNo % 4 === 0 ? ['featL', 'featR', 'row3', 'stack2', 'row2', 'row4', 'row5'] :
      bandNo % 4 === 1 ? ['row3', 'row4', 'row2', 'row5', 'featL', 'featR', 'stack2'] :
      bandNo % 4 === 2 ? ['featR', 'featL', 'stack2', 'row4', 'row2', 'row3', 'row5'] :
        ['stack2', 'row4', 'row5', 'row3', 'row2', 'featL', 'featR'];
    let best: Built | null = null;
    let bestScore = Infinity;
    for (const kind of order) {
      const k = NEED[kind];
      if (k > r || r - k === 1) continue;
      const b = build(kind, i);
      if (!valid(b)) continue;
      let score = Math.abs(b.h - ideal) / ideal;
      if (kind === 'featL' || kind === 'featR' || kind === 'stack2') score -= 0.3;
      if (kind === prevKind) score += 0.25;
      if (score < bestScore) {
        bestScore = score;
        best = b;
      }
    }
    if (!best) {
      // Lenient fallback: exact fit is preserved, height may run tall or short.
      const k = r >= 4 ? 4 : r >= 3 ? 3 : 2;
      best = (k === 4 ? build('row4', i) : k === 3 ? build('row3', i) : build('row2', i)) as Built;
      best.fallback = true;
    }
    bands.push(best);
    prevKind = best.kind;
    i += best.k;
    bandNo++;
  }
  return bands;
}
