import { Surface } from '../components';
import { go } from '../hooks/useRoute';
import './Facility.css';

// The game's FACILITY screen, as UI only: the numbers are the screenshot's,
// and buying does nothing. Every surface in it -- the dialog, each row, each
// icon square and each price button -- is the same Surface, so they share the
// outline, the ring, the shine and the fitted texture.

interface Upgrade {
  name: string;
  detail: string;
  icon: string;
  iconColor: string; // the icon square's colour
  price: string;
  affordable: boolean;
}

const UPGRADES: Upgrade[] = [
  { name: 'Speed', detail: 'level 0 · 380/s', icon: '👟', iconColor: '#4d9be0', price: '5.16K', affordable: true },
  { name: 'Glass Panes', detail: 'level 0 · 1 pane', icon: '💎', iconColor: '#4d9be0', price: '5.90K', affordable: true },
  { name: 'Track Length', detail: 'level 0 · 1400 studs', icon: '🛣️', iconColor: '#4d9be0', price: '7.38K', affordable: true },
  { name: 'Durability', detail: 'level 0 · 100%', icon: '🛡️', iconColor: '#4d9be0', price: '6.64K', affordable: true },
  { name: 'Crusher', detail: '0 in inventory · place from HAZARDS', icon: '🗜️', iconColor: '#d9554b', price: '744K', affordable: false },
  { name: 'Cannon', detail: '0 in inventory · place from HAZARDS', icon: '💣', iconColor: '#8a8a92', price: '124K', affordable: false },
  { name: 'TNT', detail: '0 in inventory · place from HAZARDS', icon: '🧨', iconColor: '#ef8a4c', price: '124K', affordable: false },
];

// Greys from the screenshot: the dialog, its rows and an unaffordable button.
const DIALOG = { ring: '#5d5d63', fill: '#2c2c31' };
const ROW = { ring: '#7a7a80', fill: '#323237' };
const PRICE_OFF = '#55555b';

export function Facility() {
  return (
    <div className="fac">
      <Surface
        className="fac-dialog"
        role="dialog"
        aria-labelledby="fac-title"
        color={DIALOG.ring}
        fill={DIALOG.fill}
        edge={6}
        radius={22}
      >
        <header className="fac-head">
          <div>
            <h2 id="fac-title" className="fac-title">FACILITY</h2>
            <p className="fac-balance"><b>63.6K</b> test data</p>
          </div>
          <button className="fac-close" aria-label="Close" onClick={() => go('home')}>X</button>
        </header>

        <ul className="fac-rows">
          {UPGRADES.map((u) => (
            <li key={u.name}>
              <Surface className="fac-row" color={ROW.ring} fill={ROW.fill} edge={5} radius={16}>
                <Surface className="fac-icon" color={lighten(u.iconColor)} fill={u.iconColor} edge={3} radius={10}>
                  <span aria-hidden>{u.icon}</span>
                </Surface>
                <div className="fac-text">
                  <span className="fac-name">{u.name}</span>
                  <span className="fac-detail">{u.detail}</span>
                </div>
                <Surface
                  as="button"
                  className={`fac-price${u.affordable ? '' : ' fac-price-off'}`}
                  color={u.affordable ? 'var(--ctd-data)' : PRICE_OFF}
                  fill="#2a2a2f"
                  edge={3}
                  radius={10}
                  disabled={!u.affordable}
                  aria-label={`Buy ${u.name} for ${u.price} test data`}
                >
                  {u.price}
                </Surface>
              </Surface>
            </li>
          ))}
        </ul>
      </Surface>
    </div>
  );
}

// The icon square's ring: its own colour, lighter, as in the game.
function lighten(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  const mix = (c: number) => Math.round(c + (255 - c) * 0.35);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map(mix);
  return `rgb(${r} ${g} ${b})`;
}
