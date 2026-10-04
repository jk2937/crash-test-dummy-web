import type { CSSProperties, ReactNode } from 'react';
import type { ColorKey } from '../theme';
import { patternStyle, type PatternSpec } from '../pattern';
import './Button.css';

export type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps {
  label: string;
  icon?: ReactNode;
  // Any palette colour; the tile is filled with it.
  color?: ColorKey;
  // A texture over the fill (see src/pattern); none if left out.
  texture?: PatternSpec | null;
  size?: ButtonSize;
  // Blink the fill to ask for a press (two blinks and a rest).
  nagging?: boolean;
  // Sit above a Shade, the one lit thing on a darkened screen.
  spotlit?: boolean;
  onClick?: () => void;
  disabled?: boolean;
}

// A HUD tile: a filled square in its section's colour, icon above, label
// along the bottom in white with a dark stroke, as in the Roblox HUD.
export function Button({
  label, icon, color = 'gold', texture, size = 'medium', nagging = false, spotlit = false, onClick, disabled = false,
}: ButtonProps) {
  const style = {
    '--tile': `var(--ctd-${color})`,
    // Lets a long label shrink to fit its tile (see .ctd-btn-label).
    '--chars': label.length,
    ...(spotlit && { zIndex: 'calc(var(--ctd-shade-z) + 1)' }),
    ...patternStyle(texture),
  } as CSSProperties;
  const classes = ['ctd-btn', `ctd-btn-${size}`, nagging && 'ctd-btn-nag'].filter(Boolean).join(' ');
  return (
    <button className={classes} style={style} onClick={onClick} disabled={disabled}>
      {icon && <span className="ctd-btn-icon" aria-hidden>{icon}</span>}
      <span className="ctd-btn-label">{label}</span>
    </button>
  );
}
