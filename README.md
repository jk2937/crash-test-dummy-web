# Be a Crash Test Dummy UI

The HUD of the Roblox game *Be a Crash Test Dummy*, rebuilt as a React + TypeScript UI kit.

**Live:** https://jk2937.github.io/crash-test-dummy-web/

- `src/theme` — the game's palette (mirrors `HudGrid.UI`), spacing and type
- `src/components` — reusable pieces:
  - `Button`, the HUD tile, with `nudge` (blink until pressed) and `spotlight` (stay lit above the `Shade`)
  - `TileLayout`, the HUD: fixed to the screen, spaced like the game, and giving each tile a slot from nothing more than its region (`left` or `right`) — two blocks in landscape, one centred grid in portrait
  - `Surface`, the game's surface on anything (a dialog, a row, a button, an icon square): dark outline, a ring of its own colour, then the fill with its shine and a texture **fitted** to its size — same mark size everywhere, an even margin all round, and gaps stretched or squashed just enough to fill it, so spacing is about the same on every surface
  - `Backdrop`, the sky: a Surface with no outline filling the screen behind everything, and where full-screen content will go
  - `SafeArea`, for page content on an off-white Surface, kept clear of the HUD's tiles plus the game's margin: in landscape document-sized and scrolling with the page between the tile blocks; in portrait a panel filling the screen below the tiles, scrolling inside itself. TileLayout publishes the insets as `--ctd-safe-top/right/bottom/left`, so full-screen content behind the HUD can ignore them and anything else can use them
- `src/pages/Facility.tsx` — the game's FACILITY screen, as UI only (the FACILITY tile, or `#/facility`), built entirely from Surfaces
- `src/pages/TileLab.tsx` — the Tile Lab (the TILE LAB tile, or `#/lab`): every part of a tile — shape, outline, shine, texture, icon, label, colour — adjustable with a live preview, kept in the browser and copyable as a spec. A tile's look is plain data too (`TileLook` in `src/components/look.ts`)
- `src/pattern` — textures from primitives: a **mark** (dot, rounded square, pill, stripe…) repeated in a **layout** (grid, offset, hex, alternate) and lit by a **finish** (flat, raised, sunken, outline). A texture is plain data (`PatternSpec`), rendered here as an SVG tile; presets in `presets.ts`. Try them in the Tile Lab on the live page.

```
npm install
npm run dev
```

Pushing to `main` deploys to GitHub Pages.
