# Be a Crash Test Dummy UI

The HUD of the Roblox game *Be a Crash Test Dummy*, rebuilt as a React + TypeScript UI kit.

**Live:** https://jk2937.github.io/crash-test-dummy-web/

- `src/theme` — the game's palette (mirrors `HudGrid.UI`), spacing and type
- `src/components` — reusable pieces, starting with the HUD tile `Button`
- `src/pattern` — textures from primitives: a **mark** (dot, rounded square, pill, stripe…) repeated in a **layout** (grid, offset, hex, alternate) and lit by a **finish** (flat, raised, sunken, outline). A texture is plain data (`PatternSpec`), rendered here as an SVG tile; presets in `presets.ts`. Try them in the playground on the live page.

```
npm install
npm run dev
```

Pushing to `main` deploys to GitHub Pages.
