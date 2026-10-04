import { useEffect, useRef, type ReactNode } from 'react';
import { Surface } from './Surface';
import './SafeArea.css';

// Content kept clear of the HUD, in the safe area TileLayout publishes, on an
// off-white Surface (no texture) that fills that space.
//
//   Landscape: the size of the document -- the screen's height at least,
//              growing with what is in it -- scrolling with the page, between
//              the two blocks of tiles.
//   Portrait:  a panel filling the screen below the tiles, its content
//              scrolling inside it, never passing under them. Scrolling also
//              slides the HUD up until its header is gone and the icons reach
//              the top: the panel starts as high as the tiles will end up, and
//              keeps clear of them until then by an empty band at its top the
//              size of the slide, which scrolls away in step with the HUD.
//
// For content that should fill the whole screen behind the HUD instead, put it
// in the Backdrop rather than in here.
export function SafeArea({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // How far this panel has scrolled, for the HUD to follow (TileLayout.css);
    // straight onto the page root, so a scroll redraws nothing in React.
    const root = document.documentElement.style;
    const follow = () => root.setProperty('--ctd-hud-shift', `${el.scrollTop}px`);
    follow();
    el.addEventListener('scroll', follow, { passive: true });
    return () => {
      el.removeEventListener('scroll', follow);
      root.removeProperty('--ctd-hud-shift');
    };
  }, []);
  return (
    <div ref={ref} className="ctd-safe-area">
      <Surface className="ctd-safe-surface" color="var(--ctd-paper)" edge={6} radius={22} texture={null}>
        {children}
      </Surface>
    </div>
  );
}
