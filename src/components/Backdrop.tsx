import type { ReactNode } from 'react';
import { Surface } from './Surface';
import { SKY_TEXTURE } from './surfaceTexture';
import './Backdrop.css';

// The sky behind everything: a Surface filling the screen, fixed there while
// the page scrolls over it, with no outline. Full-screen content (a game,
// a canvas) can go in it, behind the HUD and the page.

export function Backdrop({ children }: { children?: ReactNode }) {
  return (
    <Surface className="ctd-backdrop" color="var(--ctd-sky)" edge={0} radius={0} texture={SKY_TEXTURE} aria-hidden={!children}>
      {children}
    </Surface>
  );
}
