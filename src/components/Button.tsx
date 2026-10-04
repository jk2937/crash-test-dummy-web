import type { CSSProperties, ReactNode } from 'react';
import type { ColorKey } from '../theme';
import { patternStyle, type PatternSpec } from '../pattern';
import { lookStyle, type TileLook } from './look';
import './Button.css';

export type ButtonSize = 'small' | 'medium' | 'large';

export interface ButtonProps {
  label: string;
  icon?: ReactNode;
  // Any palette colour; the tile is filled with it.
  color?: ColorKey;
  // Any CSS colour instead of a palette one.
  fill?: string;
  // How the tile looks beyond its colour, icon and label (see look.ts); the
  // HUD's own look if left out.
  look?: Partial<TileLook>;
  // A texture over the fill (see src/pattern); none if left out.
  texture?: PatternSpec | null;
  size?: ButtonSize;
  // Nudge: blink the whole tile to ask for a press (two blinks and a rest).
  nudge?: boolean;
  // Spotlight: sit above a Shade, the one lit thing on a darkened screen.
  // Pair it with `nudge` for the full spotlight.
  spotlight?: boolean;
  onClick?: () => void;
  disabled?: boolean;
}

// A HUD tile: a filled square in its section's colour, icon above, label
// along the bottom in white with a dark stroke, as in the Roblox HUD.
export function Button({
  label, icon, color = 'gold', fill, look, texture, size = 'medium', nudge = false, spotlight = false, onClick, disabled = false,
}: ButtonProps) {
  const style = {
    '--tile': fill ?? `var(--ctd-${color})`,
    // Lets a long label shrink to fit its tile (see .ctd-btn-label).
    '--chars': label.length,
    ...(spotlight && { zIndex: 'calc(var(--ctd-shade-z) + 1)' }),
    ...patternStyle(texture),
    ...lookStyle(look),
  } as CSSProperties;
  const classes = ['ctd-btn', `ctd-btn-${size}`, nudge && 'ctd-btn-nudge'].filter(Boolean).join(' ');
  return (
    <button className={classes} style={style} onClick={onClick} disabled={disabled}>
      {icon && <span className="ctd-btn-icon" aria-hidden>{icon}</span>}
      <span className="ctd-btn-label">{label}</span>
    </button>
  );
}
