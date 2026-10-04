import { ActionButton, Dialog, IconSquare, Row, RowList } from '../components';
import { go } from '../hooks/useRoute';
import './Facility.css';

// The game's FACILITY screen, as UI only: the numbers are the screenshot's,
// and buying does nothing.

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

export function Facility() {
  return (
    <Dialog
      id="facility"
      title="Facility"
      titleColor="var(--ctd-facility)"
      onClose={() => go('home')}
      intro={<p className="fac-balance"><b>63.6K</b> test data</p>}
    >
      <RowList>
        {UPGRADES.map((u) => (
          <li key={u.name}>
            <Row className="fac-row">
              <IconSquare icon={u.icon} color={u.iconColor} />
              <div className="fac-text">
                <span className="fac-name">{u.name}</span>
                <span className="fac-detail">{u.detail}</span>
              </div>
              <ActionButton off={!u.affordable} label={`Buy ${u.name} for ${u.price} test data`}>
                {u.price}
              </ActionButton>
            </Row>
          </li>
        ))}
      </RowList>
    </Dialog>
  );
}
