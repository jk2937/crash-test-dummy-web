// The game's own HUD palette: HudGrid.UI in crash-test-dummy
// (src/StarterPlayerScripts/HudGrid.lua). Keep the two in step.
export const colors = {
  surface: '#1c1c20',
  surfaceOff: '#2c2a2c',
  panel: '#16161a',
  text: '#f0eee8',
  muted: '#96948e',

  // The currency.
  data: '#e8b61e',
  // The bright gold the Test Data readout, buy buttons and VEHICLES tile share.
  gold: '#ffcc40',

  // States.
  live: '#78d68c',
  stop: '#e2685c',
  info: '#70b0e8',

  // Shop sections, each with its own tile colour.
  facility: '#56cebe',
  rebirth: '#b07cf0',
  setup: '#f29248',
} as const;

export type ColorKey = keyof typeof colors;

// Every colour as a CSS custom property, --ctd-<key>, set on :root.
export function applyColors(root: HTMLElement = document.documentElement) {
  for (const [key, value] of Object.entries(colors)) {
    root.style.setProperty(`--ctd-${key}`, value);
  }
}
