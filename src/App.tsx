import { useState, type ReactNode } from 'react';
import { Backdrop, SafeArea, TileLayout, type TileSpec } from './components';
import { PRESETS } from './pattern';
import { Certifications } from './pages/Certifications';
import { Facility } from './pages/Facility';
import { Home } from './pages/Home';
import { Mockup, type MockSpec } from './pages/Mockup';
import { TileLab } from './pages/TileLab';
import { go, isRoute, useRoute, type Route } from './hooks/useRoute';
import './App.css';

// The HUD tiles each wear a different texture, in turn, at 0.4 strength.
const TEXTURES = Object.values(PRESETS).map((p) => ({ ...p, strength: 0.4 }));

// The HUD's tiles. Each says only which side it belongs on; TileLayout gives
// it a slot in landscape and in portrait. A tile opens the page of its id.
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

// The mockups: every tile with no real screen yet, in its own colour and icon.
const MOCKS = ['rebirth', 'contracts', 'setup', 'fx', 'vehicles', 'collection', 'store'] as const;
const mockSpec = (id: (typeof MOCKS)[number], seed: number): MockSpec => {
  const tile = TILES.find((t) => t.id === id)!;
  return { title: tile.label, color: tile.color ?? 'gold', icon: String(tile.icon), seed };
};
const MOCK_BLURB = 'A mockup: placeholder text, laid out from the kit, until the real screen is built.';

interface Page {
  title: string; // the header in the HUD
  blurb: string; // the line under it
  render: (home: { nudging: boolean; onStart: (spotlight: boolean) => void }) => ReactNode;
}

// Every page: its header and its content.
const PAGES: Record<Route, Page> = {
  home: {
    title: 'Be a Crash Test Dummy · UI kit',
    blurb: "The game's HUD, rebuilt for the web. Work in progress.",
    render: (home) => <Home {...home} />,
  },
  lab: {
    title: 'Tile Lab',
    blurb: 'Every part of a tile, adjustable, with the result shown live. Your work is kept in this browser.',
    render: () => <TileLab />,
  },
  facility: {
    title: 'Facility',
    blurb: "The game's FACILITY screen, rebuilt from Surfaces. UI only: buying does nothing.",
    render: () => <Facility />,
  },
  certs: {
    title: 'Certifications',
    blurb: "The game's CERTIFICATIONS screen, rebuilt from Surfaces. UI only: claiming does nothing.",
    render: () => <Certifications />,
  },
  ...mockPages(),
};

function mockPages() {
  const pages = {} as Record<(typeof MOCKS)[number], Page>;
  MOCKS.forEach((id, i) => {
    const spec = mockSpec(id, i + 1);
    pages[id] = { title: spec.title, blurb: MOCK_BLURB, render: () => <Mockup key={id} spec={spec} /> };
  });
  return pages;
}

// A showcase of the toolkit, laid out like the game's HUD: each tile opens a
// page, HOME the front one.
export default function App() {
  const route = useRoute();
  const page = PAGES[route];

  // As the game's VEHICLES tile does it. A nudge: the tile blinks until it is
  // pressed. A spotlight: the same, with everything else dimmed under a shade
  // and the tile lifted above it -- the home page's test buttons start each.
  const [nudging, setNudging] = useState(false);
  const [spotlit, setSpotlit] = useState(false);
  const start = (spotlight: boolean) => { setNudging(true); setSpotlit(spotlight); };
  const open = (id: string) => {
    if (id === 'vehicles' && nudging) {
      setNudging(false);
      setSpotlit(false);
      alert('VEHICLES pressed: the nudge is over.');
      return;
    }
    if (isRoute(id)) go(id);
  };

  return (
    <>
      <Backdrop />

      <TileLayout
        shade={spotlit}
        header={(
          <header className="hud-title">
            <h1>{page.title}</h1>
            <p>{page.blurb}</p>
          </header>
        )}
        tiles={TILES.map((t, i) => ({
          ...t,
          texture: TEXTURES[i % TEXTURES.length],
          onClick: () => open(t.id),
          ...(t.id === 'vehicles' && { nudge: nudging, spotlight: spotlit }),
        }))}
      />

      <SafeArea>
        {page.render({ nudging, onStart: start })}
      </SafeArea>
    </>
  );
}
