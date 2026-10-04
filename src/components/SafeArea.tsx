import type { ReactNode } from 'react';
import './SafeArea.css';

// Content kept clear of the HUD, in the safe area TileLayout publishes.
//
//   Landscape: the size of the document -- the screen's height at least,
//              growing with what is in it -- scrolling with the page, between
//              the two blocks of tiles.
//   Portrait:  the screen below the tiles, filling it to the bottom, with the
//              content scrolling inside it, so nothing ever passes under them.
//
// For content that should fill the whole screen behind the HUD instead, put it
// under the HUD rather than in here.
export function SafeArea({ children }: { children: ReactNode }) {
  return <div className="ctd-safe-area">{children}</div>;
}
