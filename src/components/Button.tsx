import type { ReactNode } from 'react';
import type { ColorKey } from '../theme';
import './Button.css';

export type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps {
  label: string;
  icon?: ReactNode;
  // Any palette colour; the tile is filled with it.
  color?: ColorKey;
  size?: ButtonSize;
  onClick?: () => void;
  disabled?: boolean;
}

// A HUD tile: a filled square in its section's colour, icon above, label
// along the bottom in white with a dark stroke, as in the Roblox HUD.
export function Button({ label, icon, color = 'gold', size = 'medium', onClick, disabled = false }: ButtonProps) {
  return (
    <button
      className={`ctd-btn ctd-btn-${size}`}
      style={{ '--tile': `var(--ctd-${color})` } as React.CSSProperties}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && <span className="ctd-btn-icon" aria-hidden>{icon}</span>}
      <span className="ctd-btn-label">{label}</span>
    </button>
  );
}
