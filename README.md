# Be a Crash Test Dummy UI

The HUD of the Roblox game *Be a Crash Test Dummy*, rebuilt as a React + TypeScript UI kit.

**Live:** https://jk2937.github.io/crash-test-dummy-web/

- `src/theme` — the game's palette (mirrors `HudGrid.UI`), spacing and type
- `src/components` — reusable pieces:
  - `Button`, the HUD tile, with `nudge` (blink until pressed) and `spotlight` (stay lit above the `Shade`)
  - `TileLayout`, the HUD: fixed to the screen, spaced like the game, and giving each tile a slot from nothing more than its region (`left` or `right`) — two blocks in landscape, one centred grid in portrait
  - `SafeArea`, for page content: document-sized and scrolling, kept clear of the HUD's tiles plus the game's margin. TileLayout publishes the insets as `--ctd-safe-top/right/bottom/left`, so full-screen content behind the HUD can ignore them and anything else can use them
- `src/pattern` — textures from primitives: a **mark** (dot, rounded square, pill, stripe…) repeated in a **layout** (grid, offset, hex, alternate) and lit by a **finish** (flat, raised, sunken, outline). A texture is plain data (`PatternSpec`), rendered here as an SVG tile; presets in `presets.ts`. Try them in the playground on the live page.

```
npm install
npm run dev
```

Pushing to `main` deploys to GitHub Pages.
