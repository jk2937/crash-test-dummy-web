import type { ReactNode } from 'react';
import { Surface } from './Surface';
import './SafeArea.css';

// Content kept clear of the HUD, in the safe area TileLayout publishes, on an
// off-white Surface (no texture) that fills that space.
//
//   Landscape: the size of the document -- the screen's height at least,
//              growing with what is in it -- scrolling with the page, between
//              the two blocks of tiles.
//   Portrait:  the screen below the tiles, filling it to the bottom, with the
//              content scrolling inside it, so nothing ever passes under them.
//
// For content that should fill the whole screen behind the HUD instead, put it
// in the Backdrop rather than in here.
export function SafeArea({ children }: { children: ReactNode }) {
  return (
    <div className="ctd-safe-area">
      <Surface className="ctd-safe-surface" color="var(--ctd-paper)" edge={6} radius={22} texture={null}>
        {children}
      </Surface>
    </div>
  );
}
