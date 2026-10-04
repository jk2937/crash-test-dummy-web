import './Shade.css';

// The onboarding spotlight's shade: a dim over the whole screen that takes
// every click, so the one tile lifted above it (Button's `spotlight`) is the
// only thing left to press.
export function Shade({ show }: { show: boolean }) {
  return <div className={`ctd-shade${show ? ' ctd-shade-up' : ''}`} aria-hidden />;
}
