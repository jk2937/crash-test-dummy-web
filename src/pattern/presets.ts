import type { PatternSpec } from './pattern';

// Named textures. Each one is only a PatternSpec: copy one and change a field
// to make your own.
export const PRESETS = {
  polka: { mark: 'dot', layout: 'offset', finish: 'flat', size: 6, gap: 12, angle: 0, strength: 0.18 },
  hazard: { mark: 'stripe', layout: 'grid', finish: 'flat', size: 10, gap: 10, angle: 0, strength: 0.16 },
  quilted: { mark: 'diamond', layout: 'grid', finish: 'outline', size: 18, gap: 0, angle: 0, strength: 0.25 },
  chevrons: { mark: 'chevron', layout: 'offset', finish: 'flat', size: 12, gap: 8, angle: 0, strength: 0.18 },
} satisfies Record<string, PatternSpec>;

export type PresetName = keyof typeof PRESETS;
