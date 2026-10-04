import { useState } from 'react';
import { Button, Shade } from './components';
import { PRESETS } from './pattern';
import { Playground } from './pages/Playground';
import type { ColorKey } from './theme';
import './App.css';

// The texture the HUD tiles wear.
const TILE_TEXTURE = PRESETS.polka;

const LEFT: [string, string, ColorKey][] = [
  ['Certifications', '📜', 'gold'], ['Home', '🏠', 'info'],
  ['Rebirth', '♻️', 'rebirth'], ['Contracts', '📋', 'info'],
  ['Setup', '🛠️', 'setup'], ['FX Crate', '✨', 'stop'],
];
const RIGHT: [string, string, ColorKey][] = [
  ['Facility', '🏭', 'facility'], ['Collection', '📖', 'rebirth'], ['Store', '🛒', 'live'],
];

// A showcase of the toolkit, laid out like the game's HUD.
export default function App() {
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
      <main className="hud">
        <header className="hud-title">
          <h1>Be a Crash Test Dummy · UI kit</h1>
          <p>The game's HUD, rebuilt for the web. Work in progress.</p>
        </header>
        <section className="hud-grid hud-left" aria-label="Left menu">
          {LEFT.map(([label, icon, color]) => <Button key={label} label={label} icon={icon} color={color} texture={TILE_TEXTURE} />)}
        </section>
        <section className="hud-grid hud-right" aria-label="Right menu">
          <Button label="Vehicles" icon="🚗" color="gold" texture={TILE_TEXTURE}
            nudge={nudging} spotlight={spotlit} onClick={pressVehicles} />
          {RIGHT.map(([label, icon, color]) => <Button key={label} label={label} icon={icon} color={color} texture={TILE_TEXTURE} />)}
        </section>
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

      <Playground />

      <Shade show={spotlit} />
    </>
  );
}
