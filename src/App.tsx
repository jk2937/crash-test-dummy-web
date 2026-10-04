import { Button } from './components';
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
  ['Vehicles', '🚗', 'gold'], ['Facility', '🏭', 'facility'],
  ['Collection', '📖', 'rebirth'], ['Store', '🛒', 'live'],
];

// A showcase of the toolkit, laid out like the game's HUD.
export default function App() {
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
          {RIGHT.map(([label, icon, color]) => <Button key={label} label={label} icon={icon} color={color} texture={TILE_TEXTURE} />)}
        </section>
        <section className="hud-sizes" aria-label="Sizes">
          <Button label="Small" icon="🚀" color="setup" texture={TILE_TEXTURE} size="small" />
          <Button label="Medium" icon="🚀" color="setup" texture={TILE_TEXTURE} />
          <Button label="Large" icon="🚀" color="setup" texture={TILE_TEXTURE} size="large" />
          <Button label="Disabled" icon="🚀" color="setup" texture={TILE_TEXTURE} disabled />
        </section>
      </main>
      <Playground />
    </>
  );
}
