import { useLayoutEffect, useRef, useState, useSyncExternalStore, type CSSProperties, type ReactNode } from 'react';
import { Button, type ButtonProps } from './Button';
import { Shade } from './Shade';
import './TileLayout.css';

// Which side of the screen a tile belongs to in landscape.
export type Region = 'left' | 'right';

export interface TileSpec extends ButtonProps {
  id: string;
  region: Region;
}

interface TileLayoutProps {
  tiles: TileSpec[];
  // Tiles across each region in landscape.
  columns?: number;
  // Rows the tiles fill in portrait; the columns follow from the tile count.
  portraitRows?: number;
  // Dim everything under the HUD; a tile with `spotlight` stays above it.
  shade?: boolean;
  // A title for the HUD: centred at the top between the two regions in
  // landscape, above the tiles in portrait.
  header?: ReactNode;
}

// The game's HUD measurements, in design units: the units the layout was
// authored in, turned into pixels by a scale that follows the screen.
const TILE = 76;
const SPACING = 14; // the gap between tiles, and the margin to the screen's edge
const SMALL_SPACING = 8; // the same, on a small screen
const SMALL_EDGE = 520; // a screen whose short side is at most this is small
const FOOTPRINT = { x: 320, y: 440 }; // what must always fit on screen

// Pixels per design unit for a screen: from 1 up to 1.5 as the screen grows
// (1.5 from 1280 x 720), never above 1 on a small screen, and never so big the
// footprint stops fitting.
function scaleFor(width: number, height: number, small: boolean) {
  const fit = Math.min(width / FOOTPRINT.x, height / FOOTPRINT.y);
  if (small) return Math.min(1, fit);
  const natural = Math.min(Math.max(Math.min(width / 1280, height / 720) * 1.5, 1), 1.5);
  return Math.min(natural, fit);
}

function readViewport() {
  // The window's own size, scrollbar included. Not the width without the
  // scrollbar: the layout decides whether the page scrolls (portrait never
  // does), so measuring around the scrollbar fed back into itself -- on a
  // nearly square window, a scrollbar made it portrait, portrait removed the
  // scrollbar, which made it landscape, which brought the scrollbar back --
  // and React gave up and blanked the page. The window's size does not move
  // when the scrollbar comes and goes.
  // At least 1px each way: a minimised window can report 0, which no layout fits.
  return `${Math.max(1, window.innerWidth)}x${Math.max(1, window.innerHeight)}`;
}
function subscribe(onChange: () => void) {
  window.addEventListener('resize', onChange);
  return () => window.removeEventListener('resize', onChange);
}

// Places tiles in slots, for both screen shapes, from nothing more than each
// tile's region, spaced as the game spaces its HUD: an even gap between every
// tile, and a margin to the screen's edges.
//
// It is a HUD: fixed to the screen, over the page, never scrolling with it.
// The rest of the screen -- the safe area -- is published on the page root as
// --ctd-safe-top, -right, -bottom and -left: how far content keeps in from
// each edge to stay clear of the tiles, with the game's margin between -- and
// the HUD's shape as data-ctd-hud="portrait" or "landscape" on the page root.
// Use them through SafeArea.
//
//   Landscape: each region is a grid `columns` wide, filled row by row: left
//              at the top left of the screen, right at the top right.
//   Portrait:  (taller than wide) every tile in one grid at the top, centred,
//              `portraitRows` deep (left's tiles first, then right's); tiles
//              and gaps shrink so a row fits the screen's width.
//
// A header, if given, spans the top of the screen above the tiles in either
// shape: the tiles start level with the page below it, and as the page
// scrolls the header goes and the tiles rise with the page until they reach
// the top, then stay. It has the same space below it as above, and the safe
// area keeps clear of it.
export function TileLayout({ tiles, columns = 2, portraitRows = 2, shade = false, header }: TileLayoutProps) {
  const [width, height] = useSyncExternalStore(subscribe, readViewport).split('x').map(Number);

  const portrait = width < height;
  const small = Math.min(width, height) <= SMALL_EDGE;
  const scale = scaleFor(width, height, small);
  const spacing = small ? SMALL_SPACING : SPACING;
  const edge = spacing * scale;

  const left = tiles.filter((t) => t.region === 'left');
  const right = tiles.filter((t) => t.region === 'right');
  const ordered = [...left, ...right];
  const landscapeRows = Math.max(Math.ceil(left.length / columns), Math.ceil(right.length / columns), 1);
  const portraitColumns = Math.max(1, Math.ceil(tiles.length / portraitRows));

  // In portrait the tiles and the gaps between them shrink together until a
  // row fits between the margins; never bigger than their own size.
  const across = portraitColumns * TILE + (portraitColumns - 1) * spacing;
  const shrink = portrait ? Math.min(Math.max((width / scale - 2 * spacing) / across, 0.3), 1) : 1;
  const tile = TILE * scale * shrink;
  const gap = spacing * scale * shrink;

  // The header's height, as drawn: it wraps differently at every width.
  const headerRef = useRef<HTMLDivElement>(null);
  const [headerHeight, setHeaderHeight] = useState(0);
  useLayoutEffect(() => {
    const el = headerRef.current;
    if (!el) { setHeaderHeight(0); return; }
    const measure = () => setHeaderHeight(el.getBoundingClientRect().height);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [header, portrait]);

  // The HUD's own height, as drawn: in portrait the page starts a margin below
  // it. Measured rather than added up, so it is exactly where the tiles end.
  const hudRef = useRef<HTMLDivElement>(null);
  const [hudHeight, setHudHeight] = useState(0);
  useLayoutEffect(() => {
    const el = hudRef.current;
    if (!el) return;
    const measure = () => setHudHeight(el.getBoundingClientRect().height);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const block = (n: number) => n * tile + (n - 1) * gap;
  const top = edge + gap; // the game starts its tiles a margin and a gap down
  const tilesAcross = edge + block(columns) + edge;
  // The icons spill up past the tops of their tiles, by about a third of a
  // tile with their lift. Under a portrait header, the space down to them
  // matches the space above the header: the grid's own gaps either side of a
  // spacer row, and the spacer makes up the rest.
  const iconSpill = tile * 0.3;
  const spacer = Math.max(0, top + iconSpill - 2 * gap);

  // The safe area (see above). Every edge keeps the game's margin; the edges
  // the tiles stand along keep the tiles too, and a second margin past them.
  // In landscape the top keeps the header, with the same space under it as
  // above it; in portrait it starts a margin below the HUD.
  const safeTop = portrait ? hudHeight + edge : header ? top + headerHeight + top : edge;

  // Portrait: how far the HUD can slide up as the page scrolls, taking the
  // header off the top of the screen, until the tops of the icons spilling
  // from the top row of tiles are where the top of the header was. SafeArea
  // drives the slide (--ctd-hud-shift); the HUD stops at this much.
  const collapse = portrait && header
    ? Math.max(0, headerHeight + gap + spacer + gap - iconSpill)
    : 0;
  // Landscape: the header spans the top of the screen, and the tiles start
  // below it, level with the top of the page -- never above it. As the page
  // scrolls they rise with it (--ctd-hud-shift again) until they are back at
  // the top margin, by this much.
  const drop = !portrait && header ? headerHeight + top : 0;

  useLayoutEffect(() => {
    const safe = portrait
      ? { top: safeTop, right: edge, bottom: edge, left: edge }
      : { top: safeTop, right: tilesAcross, bottom: edge, left: tilesAcross };
    const root = document.documentElement;
    for (const [side, px] of Object.entries(safe)) root.style.setProperty(`--ctd-safe-${side}`, `${px}px`);
    root.style.setProperty('--ctd-hud-collapse', `${collapse}px`);
    root.style.setProperty('--ctd-hud-drop', `${drop}px`);
    // Which shape the HUD is in, for SafeArea.
    root.dataset.ctdHud = portrait ? 'portrait' : 'landscape';
  }, [portrait, safeTop, tilesAcross, edge, collapse, drop]);

  const slot = (id: string): CSSProperties => {
    // A spotlit tile's slot rises above the shade with it.
    const lifted = ordered.find((t) => t.id === id)?.spotlight ? { zIndex: 'calc(var(--ctd-shade-z) + 1)' } : {};
    if (portrait) {
      const i = ordered.findIndex((t) => t.id === id);
      const row = Math.floor(i / portraitColumns);
      // Below the header's row and the spacer under it, if there is one.
      return { gridColumn: 1 + (i % portraitColumns), gridRow: (header ? 3 : 1) + row, zIndex: portraitRows - row, ...lifted };
    }
    const list = left.some((t) => t.id === id) ? left : right;
    const i = list.findIndex((t) => t.id === id);
    // The right region's columns come after the left's and the space between.
    const first = list === left ? 1 : columns + 2;
    const row = Math.floor(i / columns);
    return { gridColumn: first + (i % columns), gridRow: 1 + row, zIndex: landscapeRows - row, ...lifted };
  };

  const layoutStyle = {
    '--tile': `${tile}px`,
    '--gap': `${gap}px`,
    '--edge': `${edge}px`,
    paddingTop: `${top}px`,
    gridTemplateColumns: portrait
      ? `repeat(${portraitColumns}, var(--tile))`
      : `repeat(${columns}, var(--tile)) 1fr repeat(${columns}, var(--tile))`,
    gridTemplateRows: portrait
      ? `${header ? `auto ${spacer}px ` : ''}repeat(${portraitRows}, var(--tile))`
      : `repeat(${landscapeRows}, var(--tile))`,
  } as CSSProperties;

  return (
    <>
      <div ref={hudRef} className={`tile-layout ${portrait ? 'tile-layout-portrait' : 'tile-layout-landscape'}`} style={layoutStyle}>
        {ordered.map(({ id, region: _region, ...button }) => (
          <div key={id} className="tile-slot" style={slot(id)}>
            <Button {...button} />
          </div>
        ))}
        {/* Portrait: the header is fixed with the HUD, above the tiles. */}
        {header && portrait && (
          <div ref={headerRef} className="tile-layout-header" style={{ gridColumn: '1 / -1', gridRow: 1 }}>
            {header}
          </div>
        )}
        {/* Inside the HUD, so the spotlit tile's slot can rise above it. */}
        <Shade show={shade} />
      </div>
      {/* Landscape: the header belongs to the page, so it scrolls away with it,
          across the top of the screen above the tiles. */}
      {header && !portrait && (
        <div
          ref={headerRef}
          className="tile-layout-header tile-layout-header-page"
          style={{ top: `${top}px`, left: `${edge}px`, right: `${edge}px` }}
        >
          {header}
        </div>
      )}
    </>
  );
}
