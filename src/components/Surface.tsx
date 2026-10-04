import { useLayoutEffect, useRef, useState, type CSSProperties, type ElementType, type ReactNode } from 'react';
import { renderFitted, type PatternSpec } from '../pattern';
import { SURFACE_TEXTURE } from './surfaceTexture';
import './Surface.css';

// The game's surface, on anything: a dialog, a row in it, a button, an icon
// square. The same layers as a HUD tile, from the outside in:
//
//   1. a dark outline
//   2. a ring of the surface's own colour, just inside it, as thick
//   3. the fill: the colour, a shine gradient, and a texture fitted to the
//      surface (see renderFitted: even spacing that fills it, margin all round)

interface SurfaceProps {
  // The ring's colour, and the fill's unless `fill` is given.
  color: string;
  fill?: string;
  edge?: number; // px, the width of the outline and of the ring
  radius?: number; // px, the outer corner
  texture?: PatternSpec | null;
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
  // Anything else the element takes: onClick, disabled, aria-*, ...
  [prop: string]: unknown;
}

export function Surface({
  color, fill, edge = 4, radius = 14, texture = SURFACE_TEXTURE, as: Tag = 'div', className = '', style, children, ...rest
}: SurfaceProps) {
  // The texture is drawn for the fill's exact size, so it is redrawn when the
  // surface changes size.
  const fillRef = useRef<HTMLSpanElement>(null);
  const [size, setSize] = useState<[number, number]>([0, 0]);
  useLayoutEffect(() => {
    const el = fillRef.current;
    if (!el) return;
    const measure = () => {
      const w = Math.round(el.clientWidth), h = Math.round(el.clientHeight);
      setSize((s) => (s[0] === w && s[1] === h ? s : [w, h]));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const image = texture ? renderFitted(texture, size[0], size[1]) : 'none';
  const vars = {
    '--surface-ring': color,
    '--surface-fill': fill ?? color,
    '--surface-edge': `${edge}px`,
    '--surface-radius': `${radius}px`,
    ...style,
  } as CSSProperties;

  return (
    <Tag className={`ctd-surface ${className}`} style={vars} {...rest}>
      <span ref={fillRef} className="ctd-surface-texture" style={{ backgroundImage: image }} aria-hidden />
      {children}
    </Tag>
  );
}
