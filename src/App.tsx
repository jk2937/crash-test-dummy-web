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
  // The empty-queue nag, as in the game: VEHICLES blinks while the queue is
  // empty and its panel is closed. The very first time (once per save in the
  // game, once per page here until reset) a shade dims everything else, with
  // VEHICLES lifted above it, still blinking and the only thing to press.
  const [queueEmpty, setQueueEmpty] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [shadeShown, setShadeShown] = useState(false);
  const [shadeUp, setShadeUp] = useState(false);
  const nagging = queueEmpty && !shopOpen;

  const emptyQueue = () => {
    setQueueEmpty(true);
    if (!shadeShown) {
      setShadeUp(true);
      setShadeShown(true);
    }
  };
  // Anything that stops the nag lifts the shade with it.
  const openShop = () => { setShopOpen(true); setShadeUp(false); };
  const refill = () => { setQueueEmpty(false); setShadeUp(false); };
  const resetFirstTime = () => { setShadeShown(false); setShadeUp(false); };

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
            nagging={nagging} spotlit={shadeUp} onClick={openShop} />
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
        <p>
          Empty the queue and VEHICLES blinks: twice, then a rest. The first time, the screen dims around it too.
          Press VEHICLES to open its panel, which stops the blink and lifts the shade.
        </p>
        <div className="nag-test-row">
          <button className="nag-test-btn" onClick={emptyQueue} disabled={queueEmpty}>Empty the queue</button>
          <button className="nag-test-btn" onClick={refill} disabled={!queueEmpty}>Refill the queue</button>
          <button className="nag-test-btn" onClick={resetFirstTime} disabled={!shadeShown}>Reset first time</button>
        </div>
        <p className="nag-test-state" aria-live="polite">
          Queue: <b>{queueEmpty ? 'empty' : 'stocked'}</b> · VEHICLES: <b>{nagging ? 'blinking' : 'still'}</b> ·
          Shade: <b>{shadeUp ? 'down' : shadeShown ? 'already shown' : 'not shown yet'}</b>
        </p>
      </section>

      <Playground />

      <Shade show={shadeUp} />

      {shopOpen && (
        <div className="shop-backdrop" onClick={() => setShopOpen(false)}>
          <div className="shop" role="dialog" aria-modal aria-labelledby="shop-title" onClick={(e) => e.stopPropagation()}>
            <h2 id="shop-title">VEHICLES</h2>
            <p>A stand-in for the game's Vehicles panel.</p>
            <div className="nag-test-row">
              <button className="nag-test-btn nag-test-gold" onClick={() => { refill(); setShopOpen(false); }}>Buy 10</button>
              <button className="nag-test-btn" onClick={() => setShopOpen(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
