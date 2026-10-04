// Textures built from primitives: a mark, repeated in a layout, lit by a
// finish. A pattern is plain data (PatternSpec), so the same description can
// be rendered here as an SVG tile for CSS, and exported elsewhere (a PNG for
// a Roblox texture, say) without being redesigned.
//
// Marks are drawn in white and black at low opacity, never in a colour, so a
// texture takes on whatever surface it sits over.

export const MARKS = [
  'dot', 'ring', 'square', 'rounded', 'diamond', 'triangle',
  'line', 'pill', 'plus', 'cross', 'chevron', 'stripe',
] as const;
export const LAYOUTS = ['grid', 'offset', 'hex', 'alternate'] as const;
export const FINISHES = ['flat', 'raised', 'sunken', 'outline'] as const;

export type Mark = (typeof MARKS)[number];
export type Layout = (typeof LAYOUTS)[number];
export type Finish = (typeof FINISHES)[number];

export interface PatternSpec {
  mark: Mark;
  layout: Layout;
  finish: Finish;
  size: number; // the mark, in px
  gap: number; // space between marks, in px
  angle: number; // each mark turned about its own centre, in degrees
  strength: number; // 0..1, how strongly it shows
}

// Text sits on these, so a pattern is capped at this unless asked otherwise.
export const MAX_READABLE_STRENGTH = 0.5;

// Each mark as one SVG path, centred on 0,0 and about `s` across.
function markPath(mark: Mark, s: number): string {
  const h = s / 2;
  const rect = (w: number, ht: number, r = 0) => {
    const x = -w / 2, y = -ht / 2;
    if (!r) return `M${x} ${y}h${w}v${ht}h${-w}z`;
    return `M${x + r} ${y}h${w - 2 * r}a${r} ${r} 0 0 1 ${r} ${r}v${ht - 2 * r}a${r} ${r} 0 0 1 ${-r} ${r}h${-(w - 2 * r)}a${r} ${r} 0 0 1 ${-r} ${-r}v${-(ht - 2 * r)}a${r} ${r} 0 0 1 ${r} ${-r}z`;
  };
  const circle = (r: number) => `M${-r} 0a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0z`;
  const bar = s * 0.24;
  switch (mark) {
    case 'dot': return circle(h);
    case 'ring': return circle(h) + circle(h * 0.55);
    case 'square': return rect(s, s);
    case 'rounded': return rect(s, s, s * 0.22);
    case 'diamond': return `M0 ${-h}L${h} 0L0 ${h}L${-h} 0z`;
    case 'triangle': return `M0 ${-h}L${h} ${h * 0.8}L${-h} ${h * 0.8}z`;
    case 'line': return rect(s, bar);
    case 'pill': return rect(s, s * 0.34, s * 0.17);
    case 'plus':
    case 'cross': return rect(s, bar) + rect(bar, s);
    case 'chevron': return `M${-h} ${-h * 0.2}L0 ${-h * 0.75}L${h} ${-h * 0.2}L${h} ${h * 0.3}L0 ${-h * 0.25}L${-h} ${h * 0.3}z`;
    case 'stripe': return '';
  }
}

interface Placed { x: number; y: number; turn: number }

// Where the marks go in one repeating tile, and how big the tile is.
function place(layout: Layout, cell: number): { w: number; h: number; at: Placed[] } {
  const c = cell, m = c / 2;
  switch (layout) {
    case 'grid':
      return { w: c, h: c, at: [{ x: m, y: m, turn: 0 }] };
    case 'offset':
      return { w: c, h: 2 * c, at: [
        { x: m, y: m, turn: 0 },
        { x: 0, y: m + c, turn: 0 }, { x: c, y: m + c, turn: 0 },
      ] };
    case 'hex': {
      const row = c * 0.866;
      return { w: c, h: 2 * row, at: [
        { x: m, y: row / 2, turn: 0 },
        { x: 0, y: row * 1.5, turn: 0 }, { x: c, y: row * 1.5, turn: 0 },
      ] };
    }
    case 'alternate':
      return { w: 2 * c, h: 2 * c, at: [
        { x: m, y: m, turn: 0 }, { x: m + c, y: m, turn: 90 },
        { x: m, y: m + c, turn: 90 }, { x: m + c, y: m + c, turn: 0 },
      ] };
  }
}

// The lit shape: a body with, for raised and sunken, a light edge on one side
// and a dark edge on the other.
function lit(d: string, finish: Finish, s: number, strength: number, fillRule: string): string {
  const body = (fill: string, a: number, dx = 0, dy = 0) =>
    `<path d="${d}" fill="${fill}" fill-opacity="${a.toFixed(3)}" fill-rule="${fillRule}"${dx || dy ? ` transform="translate(${dx} ${dy})"` : ''}/>`;
  const k = Math.max(0.75, s * 0.08);
  switch (finish) {
    case 'flat':
      return body('#fff', strength);
    case 'outline':
      return `<path d="${d}" fill="none" stroke="#fff" stroke-opacity="${strength.toFixed(3)}" stroke-width="${Math.max(1, s * 0.09)}"/>`;
    case 'raised':
      return body('#000', strength * 0.9, k, k) + body('#fff', strength, -k * 0.6, -k * 0.6) + body('#fff', strength * 0.35);
    case 'sunken':
      return body('#fff', strength * 0.8, k, k) + body('#000', strength * 0.9, -k * 0.6, -k * 0.6) + body('#000', strength * 0.25);
  }
}

// 45° bands that tile without a seam: the bands along x + y = 0, t and 2t,
// each `size` wide across, clipped to the tile, so the corners meet the
// neighbouring tiles' bands. Ignores layout and angle.
function stripeTile(spec: PatternSpec): { w: number; h: number; inner: string } {
  const t = spec.size + spec.gap;
  const w = spec.size / 2;
  const d = [0, t, 2 * t]
    .map((c) => `M${c - w} 0L${c + w} 0L${c + w - t} ${t}L${c - w - t} ${t}z`)
    .join('');
  const finish = spec.finish === 'outline' ? 'flat' : spec.finish;
  return { w: t, h: t, inner: lit(d, finish, spec.size, spec.strength, 'nonzero') };
}

export interface RenderedPattern {
  image: string; // a CSS background-image value
  size: string; // the matching background-size
}

export function renderPattern(spec: PatternSpec): RenderedPattern {
  let w: number, h: number, inner: string;
  if (spec.mark === 'stripe') {
    ({ w, h, inner } = stripeTile(spec));
  } else {
    const tile = place(spec.layout, spec.size + spec.gap);
    w = tile.w; h = tile.h;
    const d = markPath(spec.mark, spec.size);
    const turnExtra = spec.mark === 'cross' ? 45 : 0;
    const fillRule = spec.mark === 'ring' ? 'evenodd' : 'nonzero';
    const shape = lit(d, spec.finish, spec.size, spec.strength, fillRule);
    inner = tile.at
      .map((p) => `<g transform="translate(${p.x} ${p.y}) rotate(${spec.angle + p.turn + turnExtra})">${shape}</g>`)
      .join('');
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${inner}</svg>`;
  return {
    image: `url("data:image/svg+xml,${encodeURIComponent(svg)}")`,
    size: `${w}px ${h}px`,
  };
}

// ---------------------------------------------------------------------------
// Fitted textures: made to measure for one container, rather than repeated.
//
//   - Every mark is `size` across, everywhere.
//   - Marks fill the container edge to edge in a grid, with a margin around
//     the outside, and every gap the same.
//   - Gaps and margins aim at the spec's `gap` (the margin at `margin`, the gap
//     by default) and stretch or squash, in proportion, by just enough that a
//     whole number of marks fills the box: the count that needs the least
//     stretching wins. So spacing is close to `gap` on every container, and
//     equal within each one.
// ---------------------------------------------------------------------------

export interface FittedAxis {
  count: number; // marks along this side
  gap: number; // px between neighbouring marks
  margin: number; // px from each edge to the outermost marks
}

// How marks fit along one side `length` px long.
export function fitAxis(length: number, size: number, gap: number, margin = gap): FittedAxis {
  // As many marks as fit with the spacing as asked, rounded to the nearest
  // whole number, so the stretch is never more than half a step either way.
  const count = Math.max(1, Math.round((length - 2 * margin + gap) / (size + gap)));
  const room = Math.max(0, length - count * size);
  const asked = (count - 1) * gap + 2 * margin;
  const k = asked > 0 ? room / asked : 1;
  return { count, gap: gap * k, margin: margin * k };
}

// A fitted texture for a box `width` x `height` px, as a CSS background-image
// sized to the box exactly (background-size: 100% 100%, no repeat). Grid only:
// a fitted texture has no tile to stagger or rotate.
export function renderFitted(spec: PatternSpec, width: number, height: number, margin?: number): string {
  if (width < 1 || height < 1) return 'none';
  const x = fitAxis(width, spec.size, spec.gap, margin);
  const y = fitAxis(height, spec.size, spec.gap, margin);
  const mark = spec.mark === 'stripe' ? 'line' : spec.mark;
  const d = markPath(mark, spec.size);
  const turnExtra = mark === 'cross' ? 45 : 0;
  const shape = lit(d, spec.finish, spec.size, spec.strength, mark === 'ring' ? 'evenodd' : 'nonzero');
  const marks: string[] = [];
  for (let i = 0; i < x.count; i++) {
    for (let j = 0; j < y.count; j++) {
      const cx = x.margin + i * (spec.size + x.gap) + spec.size / 2;
      const cy = y.margin + j * (spec.size + y.gap) + spec.size / 2;
      marks.push(`<g transform="translate(${cx.toFixed(2)} ${cy.toFixed(2)}) rotate(${spec.angle + turnExtra})">${shape}</g>`);
    }
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${marks.join('')}</svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

// The pattern as CSS custom properties, for any element whose background
// stack reads --ctd-texture and --ctd-texture-size.
export function patternStyle(spec: PatternSpec | null | undefined): Record<string, string> {
  if (!spec) return { '--ctd-texture': 'none', '--ctd-texture-size': 'auto' };
  const { image, size } = renderPattern(spec);
  return { '--ctd-texture': image, '--ctd-texture-size': size };
}
