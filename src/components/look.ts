import type { CSSProperties } from 'react';

// Everything about how a tile looks that is not its colour, icon or label --
// as data, so the Tile Lab can change it live and anything can save it. The
// defaults are the HUD's own look. Sizes given as a share of the tile scale
// with it.
export interface TileLook {
  size: number; // px, for a medium tile outside a TileLayout
  outlineWidth: number; // share of the tile's size; the coloured ring matches it
  outlineColor: string;
  ring: boolean; // the ring of the tile's own colour inside the outline
  radius: number; // corner radius, share of the tile's size
  shineLight: number; // 0..1, the light along the foot
  shineShade: number; // 0..1, the shade along the top
  shineFade: number; // 0..100, how far up the light reaches, in %
  iconScale: number; // share of the tile's width
  iconTilt: number; // degrees
  iconLift: boolean; // centre the icon in the space above the label
  iconShadowX: number; // px
  iconShadowY: number; // px
  iconShadowBlur: number; // px
  iconShadowAlpha: number; // 0..1
  labelScale: number; // share of the tile's size
  labelStroke: number; // px
  labelUpper: boolean;
  labelSpacing: number; // em
}

export const DEFAULT_LOOK: TileLook = {
  size: 112,
  outlineWidth: 0.054,
  outlineColor: '#16161a',
  ring: true,
  radius: 0.25,
  shineLight: 0.304,
  shineShade: 0.096,
  shineFade: 55,
  iconScale: 1,
  iconTilt: -12,
  iconLift: true,
  iconShadowX: 4.5,
  iconShadowY: 7.5,
  iconShadowBlur: 0,
  iconShadowAlpha: 0.45,
  labelScale: 0.13,
  labelStroke: 3,
  labelUpper: true,
  labelSpacing: 0.02,
};

// The look as the custom properties Button.css reads. Only what differs from
// the defaults is set, so a tile with no look is styled by the CSS alone.
export function lookStyle(look?: Partial<TileLook>): CSSProperties {
  if (!look) return {};
  const l = { ...DEFAULT_LOOK, ...look };
  const vars: Record<string, string | number> = {
    '--look-size': `${l.size}px`,
    '--look-edge': l.outlineWidth,
    '--look-outline': l.outlineColor,
    '--look-ring': l.ring ? 1 : 0,
    '--look-radius': l.radius,
    '--look-shine-light': l.shineLight,
    '--look-shine-shade': l.shineShade,
    '--look-shine-fade': `${l.shineFade}%`,
    '--look-icon': l.iconScale,
    '--look-tilt': `${l.iconTilt}deg`,
    '--look-lift': l.iconLift ? 1 : 0,
    '--look-shadow-x': `${l.iconShadowX}px`,
    '--look-shadow-y': `${l.iconShadowY}px`,
    '--look-shadow-blur': `${l.iconShadowBlur}px`,
    '--look-shadow-alpha': l.iconShadowAlpha,
    '--look-label': l.labelScale,
    '--look-stroke': `${l.labelStroke}px`,
    '--look-case': l.labelUpper ? 'uppercase' : 'none',
    '--look-spacing': `${l.labelSpacing}em`,
  };
  return vars as CSSProperties;
}
