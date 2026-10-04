import {
  ActionButton, Dialog, DifficultyTag, GroupLabel, IconSquare, Pips, ProgressBar, Row, RowList,
  type ActionTone, type Difficulty,
} from '../components';
import { go } from '../hooks/useRoute';
import type { ColorKey } from '../theme';
import './Mockup.css';

// Mockup screens for the HUD tiles that have no real screen yet: placeholder
// text, laid out from the same pieces as FACILITY and CERTIFICATIONS, so a
// new screen can be sketched before it is designed.

export interface MockSpec {
  title: string;
  color: ColorKey; // the title's colour: the tile's own
  icon: string; // the tile's icon, used on the rows
  seed: number; // picks this screen's placeholder text and numbers
}

const WORDS = (
  'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore '
  + 'magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat'
).split(' ');

// A small repeatable random source, so a screen reads the same every visit.
function random(seed: number) {
  let s = seed * 2654435761 % 4294967296;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

export function Mockup({ spec }: { spec: MockSpec }) {
  const r = random(spec.seed);
  const pick = <T,>(xs: readonly T[]) => xs[Math.floor(r() * xs.length)];
  const words = (n: number) => Array.from({ length: n }, () => pick(WORDS)).join(' ');
  const sentence = (n: number) => { const w = words(n); return w[0].toUpperCase() + w.slice(1) + '.'; };
  const name = () => words(2).replace(/\b\w/g, (c) => c.toUpperCase());

  const items = Array.from({ length: 4 }, (_, i) => ({
    name: name(),
    detail: `${words(3)} · ${Math.floor(r() * 90) + 10}`,
    price: `${(r() * 9 + 1).toFixed(2)}K`,
    tone: (['gold', 'info', 'live', 'claim'] as ActionTone[])[i % 4],
    off: i === 3,
  }));
  const goals = Array.from({ length: 3 }, () => {
    const target = pick([10, 25, 50, 100, 500]);
    return {
      title: words(2).toUpperCase(),
      difficulty: pick(['easy', 'medium', 'hard'] as Difficulty[]),
      description: sentence(5),
      target,
      progress: Math.floor(r() * target),
      levels: pick([1, 3, 4, 5]),
    };
  });

  return (
    <Dialog
      id={`mock-${spec.seed}`}
      title={spec.title}
      titleColor={`var(--ctd-${spec.color})`}
      onClose={() => go('home')}
      intro={<p>{sentence(12)}</p>}
    >
      <GroupLabel>{words(2).toUpperCase()}</GroupLabel>
      <RowList>
        {items.map((it) => (
          <li key={it.name}>
            <Row className="mock-row">
              <IconSquare icon={spec.icon} color={`var(--ctd-${spec.color})`} />
              <div className="mock-text">
                <span className="mock-name">{it.name}</span>
                <span className="mock-detail">{it.detail}</span>
              </div>
              <ActionButton tone={it.tone} off={it.off}>{it.price}</ActionButton>
            </Row>
          </li>
        ))}
      </RowList>

      <GroupLabel>{words(2).toUpperCase()}</GroupLabel>
      <RowList>
        {goals.map((g) => (
          <li key={g.title}>
            <Row className="mock-row">
              <div className="mock-main">
                <div className="mock-heading">
                  <span className="mock-title">{g.title}</span>
                  <DifficultyTag level={g.difficulty} />
                  <Pips total={g.levels} earned={Math.floor(g.levels / 2)} />
                </div>
                <p className="mock-description">{g.description}</p>
                <ProgressBar value={g.progress} max={g.target} text={`${g.progress} / ${g.target}`} />
              </div>
              <ActionButton tone="claim" off>LOREM</ActionButton>
            </Row>
          </li>
        ))}
      </RowList>

      <GroupLabel>{words(1).toUpperCase()}</GroupLabel>
      <Row className="mock-prose">
        <p>{sentence(18)} {sentence(14)}</p>
        <p>{sentence(16)}</p>
      </Row>
    </Dialog>
  );
}
