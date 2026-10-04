import type { ReactNode } from 'react';
import { Surface } from './Surface';
import './Dialog.css';

// The pieces of a game screen -- FACILITY, CERTIFICATIONS and the rest --
// every one of them a Surface, so they share the outline, the ring, the shine
// and the fitted texture.

// The screen itself: its title in the screen's colour, a line or two under it,
// a close button, and whatever goes in it.
export function Dialog({ id, title, titleColor = 'var(--ctd-gold)', intro, onClose, children }: {
  id: string; // for the title's id, which names the dialog
  title: string;
  titleColor?: string;
  intro?: ReactNode;
  onClose?: () => void;
  children: ReactNode;
}) {
  const titleId = `${id}-title`;
  return (
    <div className="ctd-dialog-wrap">
      <Surface
        className="ctd-dialog"
        role="dialog"
        aria-labelledby={titleId}
        color="var(--ctd-dialogRing)"
        fill="var(--ctd-dialogFill)"
        edge={6}
        radius={22}
      >
        <header className="ctd-dialog-head">
          <div className="ctd-dialog-heading">
            <h2 id={titleId} className="ctd-dialog-title" style={{ color: titleColor }}>{title}</h2>
            {intro}
          </div>
          {onClose && <CloseButton onClick={onClose} />}
        </header>
        {children}
      </Surface>
    </div>
  );
}

export function CloseButton({ onClick }: { onClick: () => void }) {
  return (
    <Surface
      as="button"
      className="ctd-close"
      color="var(--ctd-controlOff)"
      fill="var(--ctd-controlFill)"
      edge={3}
      radius={10}
      aria-label="Close"
      onClick={onClick}
    >
      X
    </Surface>
  );
}

// A heading over a group of rows, in gold capitals: "ANY VEHICLE".
export function GroupLabel({ children }: { children: ReactNode }) {
  return <h3 className="ctd-group">{children}</h3>;
}

// A row in a screen. Its ring can take a state's colour (purple when something
// in it is waiting, gold when it is all done), and its fill a tint.
export function Row({ ring, fill, className = '', children }: {
  ring?: string; fill?: string; className?: string; children: ReactNode;
}) {
  return (
    <Surface
      className={`ctd-row ${className}`}
      color={ring ?? 'var(--ctd-rowRing)'}
      fill={fill ?? 'var(--ctd-rowFill)'}
      edge={5}
      radius={16}
    >
      {children}
    </Surface>
  );
}

export function RowList({ children }: { children: ReactNode }) {
  return <ul className="ctd-rows">{children}</ul>;
}

// The square an item's icon sits in, in the item's colour, its ring lighter.
export function IconSquare({ icon, color }: { icon: ReactNode; color: string }) {
  return (
    <Surface className="ctd-icon" color={`color-mix(in srgb, ${color} 65%, white)`} fill={color} edge={3} radius={10}>
      <span aria-hidden>{icon}</span>
    </Surface>
  );
}

// The button at the end of a row: BUY, CLAIM, ... Its tone is its colour, and
// `off` greys it and turns it off.
export type ActionTone = 'gold' | 'claim' | 'live' | 'info';
export function ActionButton({ tone = 'gold', off = false, label, onClick, children }: {
  tone?: ActionTone;
  off?: boolean;
  label?: string; // what a screen reader says, when the text alone is not enough
  onClick?: () => void;
  children: ReactNode;
}) {
  const color = off ? 'var(--ctd-controlOff)' : `var(--ctd-${tone})`;
  return (
    <Surface
      as="button"
      className="ctd-action"
      color={color}
      fill="var(--ctd-controlFill)"
      edge={3}
      radius={10}
      disabled={off}
      aria-label={label}
      onClick={onClick}
      style={{ color: off ? 'var(--ctd-muted)' : color }}
    >
      {children}
    </Surface>
  );
}

// A progress bar with its numbers on it: "147 / 2.50M".
export function ProgressBar({ value, max, color = 'var(--ctd-gold)', text }: {
  value: number; max: number; color?: string; text: string;
}) {
  const share = Math.min(1, Math.max(0, value / Math.max(max, 1)));
  return (
    <div className="ctd-progress" role="progressbar" aria-valuemin={0} aria-valuemax={max} aria-valuenow={value} aria-valuetext={text}>
      {/* The true share, as in the game: a start shows as a small dot, and a
          share too small to see (147 of 2.5M) shows nothing. */}
      {share > 0 && <span className="ctd-progress-fill" style={{ width: `${share * 100}%`, background: color }} />}
      <span className="ctd-progress-text">{text}</span>
    </div>
  );
}

// One dot per level of a ladder, gold once earned.
export function Pips({ total, earned }: { total: number; earned: number }) {
  if (total < 2) return null;
  return (
    <span className="ctd-pips" aria-label={`${earned} of ${total} levels`}>
      {Array.from({ length: total }, (_, i) => <span key={i} className={i < earned ? 'ctd-pip ctd-pip-on' : 'ctd-pip'} />)}
    </span>
  );
}

export type Difficulty = 'easy' | 'medium' | 'hard';
const DIFFICULTY_COLOR: Record<Difficulty, string> = {
  easy: 'var(--ctd-live)', medium: 'var(--ctd-medium)', hard: 'var(--ctd-stop)',
};
export function DifficultyTag({ level }: { level: Difficulty }) {
  return <span className="ctd-difficulty" style={{ color: DIFFICULTY_COLOR[level] }}>{level.toUpperCase()}</span>;
}
