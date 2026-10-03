import type { PatternSpec } from './pattern';

// Named textures. Each one is only a PatternSpec: copy one and change a field
// to make your own.
export const PRESETS = {
  studs: { mark: 'rounded', layout: 'grid', finish: 'raised', size: 14, gap: 10, angle: 0, strength: 0.22 },
  rivets: { mark: 'dot', layout: 'grid', finish: 'raised', size: 6, gap: 16, angle: 0, strength: 0.35 },
  polka: { mark: 'dot', layout: 'offset', finish: 'flat', size: 6, gap: 12, angle: 0, strength: 0.18 },
  tread: { mark: 'pill', layout: 'alternate', finish: 'raised', size: 12, gap: 6, angle: 45, strength: 0.25 },
  hazard: { mark: 'stripe', layout: 'grid', finish: 'flat', size: 10, gap: 10, angle: 0, strength: 0.16 },
  blueprint: { mark: 'plus', layout: 'grid', finish: 'flat', size: 7, gap: 13, angle: 0, strength: 0.25 },
  perforated: { mark: 'dot', layout: 'hex', finish: 'sunken', size: 5, gap: 7, angle: 0, strength: 0.3 },
  quilted: { mark: 'diamond', layout: 'grid', finish: 'outline', size: 18, gap: 0, angle: 0, strength: 0.25 },
  chevrons: { mark: 'chevron', layout: 'offset', finish: 'flat', size: 12, gap: 8, angle: 0, strength: 0.18 },
} satisfies Record<string, PatternSpec>;

export type PresetName = keyof typeof PRESETS;
