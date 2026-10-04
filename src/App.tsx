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
  // The nag, as the game's VEHICLES tile does it: the tile blinks until it is
  // pressed. The first time a queue runs dry the game also dims everything
  // else, with the tile lifted above the shade -- one test button does each.
  const [nagging, setNagging] = useState(false);
  const [shadeUp, setShadeUp] = useState(false);

  const nag = (withShade: boolean) => { setNagging(true); setShadeUp(withShade); };
  const pressVehicles = () => {
    if (!nagging) return;
    setNagging(false);
    setShadeUp(false);
    alert('VEHICLES pressed: the nag is over.');
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
            nagging={nagging} spotlit={shadeUp} onClick={pressVehicles} />
          {RIGHT.map(([label, icon, color]) => <Button key={label} label={label} icon={icon} color={color} texture={TILE_TEXTURE} />)}
        </section>
        <section className="hud-sizes" aria-label="Sizes">
          <Button label="Small" icon="🚀" color="setup" texture={TILE_TEXTURE} size="small" />
          <Button label="Medium" icon="🚀" color="setup" texture={TILE_TEXTURE} />
          <Button label="Large" icon="🚀" color="setup" texture={TILE_TEXTURE} size="large" />
          <Button label="Disabled" icon="🚀" color="setup" texture={TILE_TEXTURE} disabled />
        </section>
      </main>

      <section className="nag-test" aria-labelledby="nag-title">
        <h2 id="nag-title">Nag test</h2>
        <p>VEHICLES blinks until you press it. The shade version also dims everything else around it.</p>
        <div className="nag-test-row">
          <button className="nag-test-btn" onClick={() => nag(true)} disabled={nagging}>Shade + blink</button>
          <button className="nag-test-btn" onClick={() => nag(false)} disabled={nagging}>Blink</button>
        </div>
      </section>

      <Playground />

      <Shade show={shadeUp} />
    </>
  );
}
