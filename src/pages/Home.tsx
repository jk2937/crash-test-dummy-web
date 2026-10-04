import { Button } from '../components';
import { PRESETS } from '../pattern';
import './Home.css';

// The texture the size demo wears.
const TILE_TEXTURE = { ...PRESETS.polka, strength: 0.4 };

// The kit's front page: tile sizes, and the nudge and spotlight test.
export function Home({ nudging, onStart }: { nudging: boolean; onStart: (spotlight: boolean) => void }) {
  return (
    <>
      <section className="home-sizes" aria-label="Sizes">
        <Button label="Small" icon="🚀" color="setup" texture={TILE_TEXTURE} size="small" />
        <Button label="Medium" icon="🚀" color="setup" texture={TILE_TEXTURE} />
        <Button label="Large" icon="🚀" color="setup" texture={TILE_TEXTURE} size="large" />
        <Button label="Disabled" icon="🚀" color="setup" texture={TILE_TEXTURE} disabled />
      </section>

      <section className="nudge-test" aria-labelledby="nudge-title">
        <h2 id="nudge-title">Nudge and spotlight</h2>
        <p>
          A <b>nudge</b> blinks VEHICLES until you press it. A <b>spotlight</b> does the same and dims everything
          else around it.
        </p>
        <div className="nudge-test-row">
          <button className="nudge-test-btn" onClick={() => onStart(true)} disabled={nudging}>Spotlight</button>
          <button className="nudge-test-btn" onClick={() => onStart(false)} disabled={nudging}>Nudge</button>
        </div>
      </section>
    </>
  );
}
