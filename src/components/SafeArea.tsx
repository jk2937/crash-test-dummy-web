import type { ReactNode } from 'react';
import './SafeArea.css';

// Content that scrolls with the page, kept clear of the HUD: as tall as the
// screen at least and growing with what is in it, its usable space inset by the
// safe area TileLayout publishes. For content that should fill the whole screen
// behind the HUD instead, put it under the HUD rather than in here.
export function SafeArea({ children }: { children: ReactNode }) {
  return <div className="ctd-safe-area">{children}</div>;
}
