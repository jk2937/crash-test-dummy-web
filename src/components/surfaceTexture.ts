import type { PatternSpec } from '../pattern';

// The texture every Surface wears unless told otherwise: the game's studs.
// One spec for all of them, so the spacing is the same everywhere.
export const SURFACE_TEXTURE: PatternSpec = {
  mark: 'rounded', layout: 'grid', finish: 'sunken', size: 7, gap: 9, angle: 0, strength: 0.3,
};
