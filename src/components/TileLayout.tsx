import type { CSSProperties, ReactNode } from 'react';
import { Button, type ButtonProps } from './Button';
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
  // Anything for the space between the two regions (landscape) or under the
  // tiles (portrait).
  children?: ReactNode;
}

// Places tiles in slots, for both screen shapes, from nothing more than each
// tile's region. Every tile gets a slot in each layout -- worked out here --
// and CSS picks the layout for the screen's shape, so turning a phone needs
// no script at all.
//
//   Landscape: each region is a grid `columns` wide, filled row by row: left
//              at the top left, right at the top right.
//   Portrait:  every tile in one grid at the top, centred, `portraitRows`
//              deep (left's tiles first, then right's), shrinking to fit the
//              screen's width.
export function TileLayout({ tiles, columns = 2, portraitRows = 2, children }: TileLayoutProps) {
  const left = tiles.filter((t) => t.region === 'left');
  const right = tiles.filter((t) => t.region === 'right');
  const leftRows = Math.ceil(left.length / columns);
  const rightRows = Math.ceil(right.length / columns);
  const landscapeRows = Math.max(leftRows, rightRows, 1);
  const portraitColumns = Math.max(1, Math.ceil(tiles.length / portraitRows));

  const slots = new Map<string, CSSProperties>();
  const place = (list: TileSpec[], firstColumn: number) =>
    list.forEach((t, i) => {
      slots.set(t.id, {
        '--land-col': firstColumn + (i % columns),
        '--land-row': 1 + Math.floor(i / columns),
      } as CSSProperties);
    });
  place(left, 1);
  // The right region's columns come after the left's and the gap between them.
  place(right, columns + 2);
  [...left, ...right].forEach((t, i) => {
    Object.assign(slots.get(t.id)!, {
      '--port-col': 1 + (i % portraitColumns),
      '--port-row': 1 + Math.floor(i / portraitColumns),
    });
  });

  const layoutStyle = {
    '--columns': columns,
    '--land-rows': landscapeRows,
    '--port-columns': portraitColumns,
    '--port-rows': portraitRows,
  } as CSSProperties;

  return (
    <div className="tile-layout" style={layoutStyle}>
      {[...left, ...right].map(({ id, region, ...button }) => (
        <div key={id} className={`tile-slot tile-slot-${region}`} style={slots.get(id)}>
          <Button {...button} />
        </div>
      ))}
      {children && <div className="tile-layout-middle">{children}</div>}
    </div>
  );
}
