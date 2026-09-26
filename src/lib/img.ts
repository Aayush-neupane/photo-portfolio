/** Responsive variants generated alongside the originals (see README):
 *  `<name>-thumb.avif` (640px) for rails/strips/thumbs,
 *  `<name>-mid.avif` (1280px) for hero/overlay views.
 *  Falls back to the source for anything without a variant (SVG, etc.). */
function variant(src: string, suffix: string): string {
  if (typeof src !== 'string' || !src.startsWith('/gallery/')) return src;
  const i = src.lastIndexOf('.');
  if (i < 0) return src;
  return `${src.slice(0, i)}-${suffix}.avif`;
}

export function thumb(src: string): string {
  return variant(src, 'thumb');
}

export function mid(src: string): string {
  return variant(src, 'mid');
}
