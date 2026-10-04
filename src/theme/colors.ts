// The game's own HUD palette: HudGrid.UI in crash-test-dummy
// (src/StarterPlayerScripts/HudGrid.lua). Keep the two in step.
export const colors = {
  surface: '#1c1c20',
  surfaceOff: '#2c2a2c',
  panel: '#16161a',
  text: '#f0eee8',
  muted: '#96948e',

  // The web kit's own: the sky behind everything, and the off-white page.
  sky: '#8fcdf2',
  paper: '#d9c9b0',

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

  // The collection's purple: CLAIM, and anything earned and waiting
  // (CertsView.PURPLE in the game).
  claim: '#b084e8',
  // A difficulty's word; easy and hard are the states' green and red.
  medium: '#ffc846',

  // Dialogs (the web kit's, matched to the game's screens): the dialog, the
  // rows in it, and a control that is off.
  dialogRing: '#5d5d63',
  dialogFill: '#2c2c31',
  rowRing: '#4a4a50',
  rowFill: '#2f2f34',
  controlFill: '#28282d',
  controlOff: '#55555b',
} as const;

export type ColorKey = keyof typeof colors;

// Every colour as a CSS custom property, --ctd-<key>, set on :root.
export function applyColors(root: HTMLElement = document.documentElement) {
  for (const [key, value] of Object.entries(colors)) {
    root.style.setProperty(`--ctd-${key}`, value);
  }
}
