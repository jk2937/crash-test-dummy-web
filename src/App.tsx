import { useState } from 'react';
import { Backdrop, Button, SafeArea, TileLayout, type TileSpec } from './components';
import { PRESETS } from './pattern';
import { TileLab } from './pages/TileLab';
import { Facility } from './pages/Facility';
import { go, useRoute } from './hooks/useRoute';
import './App.css';

// The texture the size demo wears.
const TILE_TEXTURE = { ...PRESETS.polka, strength: 0.4 };

// The HUD tiles each wear a different texture, in turn, at 0.4 strength.
const TEXTURES = Object.values(PRESETS).map((p) => ({ ...p, strength: 0.4 }));

// The HUD's tiles. Each says only which side it belongs on; TileLayout gives
// it a slot in landscape and in portrait.
const TILES: Omit<TileSpec, 'texture'>[] = [
  { id: 'certs', label: 'Certifications', icon: '📜', color: 'gold', region: 'left' },
  { id: 'home', label: 'Home', icon: '🏠', color: 'info', region: 'left' },
  { id: 'rebirth', label: 'Rebirth', icon: '♻️', color: 'rebirth', region: 'left' },
  { id: 'contracts', label: 'Contracts', icon: '📋', color: 'info', region: 'left' },
  { id: 'setup', label: 'Setup', icon: '🛠️', color: 'setup', region: 'left' },
  { id: 'fx', label: 'FX Crate', icon: '✨', color: 'stop', region: 'left' },
  { id: 'vehicles', label: 'Vehicles', icon: '🚗', color: 'gold', region: 'right' },
  { id: 'facility', label: 'Facility', icon: '🏭', color: 'facility', region: 'right' },
  { id: 'collection', label: 'Collection', icon: '📖', color: 'rebirth', region: 'right' },
  { id: 'store', label: 'Store', icon: '🛒', color: 'live', region: 'right' },
  { id: 'lab', label: 'Tile Lab', icon: '🧪', color: 'facility', region: 'right' },
];

// A showcase of the toolkit, laid out like the game's HUD. HOME, TILE LAB and
// FACILITY switch between the pages.
export default function App() {
  const route = useRoute();

  // As the game's VEHICLES tile does it. A nudge: the tile blinks until it is
  // pressed. A spotlight: the same, with everything else dimmed under a shade
  // and the tile lifted above it -- one test button does each.
  const [nudging, setNudging] = useState(false);
  const [spotlit, setSpotlit] = useState(false);

  const start = (spotlight: boolean) => { setNudging(true); setSpotlit(spotlight); };
  const pressVehicles = () => {
    if (!nudging) return;
    setNudging(false);
    setSpotlit(false);
    alert('VEHICLES pressed: the nudge is over.');
  };

  return (
    <>
      <Backdrop />

      <TileLayout
        shade={spotlit}
        tiles={TILES.map((t, i) => ({
          ...t,
          texture: TEXTURES[i % TEXTURES.length],
          ...(t.id === 'vehicles' && { nudge: nudging, spotlight: spotlit, onClick: pressVehicles }),
          ...(t.id === 'home' && { onClick: () => go('home') }),
          ...(t.id === 'lab' && { onClick: () => go('lab') }),
          ...(t.id === 'facility' && { onClick: () => go('facility') }),
        }))}
      />

      <SafeArea>
        {route === 'lab' ? <TileLab /> : route === 'facility' ? <Facility /> : (<>
          <header className="hud-title">
            <h1>Be a Crash Test Dummy · UI kit</h1>
            <p>The game's HUD, rebuilt for the web. Work in progress.</p>
          </header>

          <main className="hud">
            <section className="hud-sizes" aria-label="Sizes">
              <Button label="Small" icon="🚀" color="setup" texture={TILE_TEXTURE} size="small" />
              <Button label="Medium" icon="🚀" color="setup" texture={TILE_TEXTURE} />
              <Button label="Large" icon="🚀" color="setup" texture={TILE_TEXTURE} size="large" />
              <Button label="Disabled" icon="🚀" color="setup" texture={TILE_TEXTURE} disabled />
            </section>
          </main>

          <section className="nudge-test" aria-labelledby="nudge-title">
            <h2 id="nudge-title">Nudge and spotlight</h2>
            <p>
              A <b>nudge</b> blinks VEHICLES until you press it. A <b>spotlight</b> does the same and dims everything
              else around it.
            </p>
            <div className="nudge-test-row">
              <button className="nudge-test-btn" onClick={() => start(true)} disabled={nudging}>Spotlight</button>
              <button className="nudge-test-btn" onClick={() => start(false)} disabled={nudging}>Nudge</button>
            </div>
          </section>
        </>)}
      </SafeArea>
    </>
  );
}
