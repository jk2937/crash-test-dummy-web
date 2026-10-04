import {
  ActionButton, Dialog, DifficultyTag, GroupLabel, Pips, ProgressBar, Row, RowList, type Difficulty,
} from '../components';
import { go } from '../hooks/useRoute';
import { shortNumber } from '../format';
import './Certifications.css';

// The game's CERTIFICATIONS screen, as UI only: the standings are the
// screenshot's (the last row's is made up, to show a claim waiting), and
// CLAIM does nothing. The rules for how a row reads are the game's
// (CertsView): the level shown is the first not yet claimed; a row with
// levels earned and waiting has a purple ring, bar and CLAIM (CLAIM xN for
// more than one); a row with every level claimed has a gold ring and DONE.

interface Cert {
  title: string; // the ladder's name and the level's numeral: "CRASH TESTING I"
  difficulty: Difficulty;
  description: string;
  progress: number;
  target: number;
  levels: number; // the ladder's length; 1 for a single certification
  earned: number; // levels earned so far
  claimed: number; // levels claimed so far
}

const GROUPS: { name: string; certs: Cert[] }[] = [
  {
    name: 'ANY VEHICLE',
    certs: [
      { title: 'CRASH TESTING I', difficulty: 'easy', description: 'Crash 25 vehicles', progress: 1, target: 25, levels: 6, earned: 0, claimed: 0 },
      { title: 'VEHICLE DEMOLITION I', difficulty: 'easy', description: 'Tear 2,500,000 parts off vehicles', progress: 147, target: 2_500_000, levels: 5, earned: 0, claimed: 0 },
      { title: 'PERFECT LAUNCH TIMING I', difficulty: 'easy', description: 'Launch in the green 100 times', progress: 0, target: 100, levels: 4, earned: 0, claimed: 0 },
      { title: 'CONTRACT COMPLETION I', difficulty: 'easy', description: 'Complete 10 contracts', progress: 0, target: 10, levels: 5, earned: 0, claimed: 0 },
      { title: 'STRESS TESTING', difficulty: 'hard', description: 'Click 500 times in a single run', progress: 0, target: 500, levels: 1, earned: 0, claimed: 0 },
      { title: 'TEST DATA PRODUCTION I', difficulty: 'easy', description: 'Earn 10,000,000 Test Data', progress: 1780, target: 10_000_000, levels: 5, earned: 0, claimed: 0 },
      { title: 'WALL IMPACT TESTING I', difficulty: 'easy', description: 'Crash 50 vehicles into the wall', progress: 1, target: 50, levels: 5, earned: 0, claimed: 0 },
      { title: 'STABILITY TESTING I', difficulty: 'easy', description: 'Spin out 10 times', progress: 10, target: 10, levels: 4, earned: 2, claimed: 0 },
    ],
  },
];

export function Certifications() {
  const waiting = GROUPS.flatMap((g) => g.certs).reduce((n, c) => n + c.earned - c.claimed, 0);
  return (
    <Dialog
      id="certs"
      title="Certifications"
      onClose={() => go('home')}
      intro={(
        <>
          <p>Always on, all at once. Reach a level and claim an Effects Crate for it.</p>
          <p className={waiting > 0 ? 'cert-ready' : 'cert-none'}>
            {waiting > 0 ? `${waiting} ready to claim` : 'Nothing to claim right now.'}
          </p>
        </>
      )}
    >
      {GROUPS.map((group) => (
        <section key={group.name} aria-label={group.name}>
          <GroupLabel>{group.name}</GroupLabel>
          <RowList>
            {group.certs.map((c) => <CertRow key={c.title} cert={c} />)}
          </RowList>
        </section>
      ))}
    </Dialog>
  );
}

function CertRow({ cert: c }: { cert: Cert }) {
  const waiting = c.earned - c.claimed;
  const done = c.claimed >= c.levels;
  const ring = done ? 'var(--ctd-gold)' : waiting > 0 ? 'var(--ctd-claim)' : undefined;
  return (
    <li>
      <Row ring={ring} className="cert-row">
        <div className="cert-main">
          <div className="cert-heading">
            <span className="cert-title">{c.title}</span>
            <DifficultyTag level={c.difficulty} />
            <Pips total={c.levels} earned={c.earned} />
          </div>
          <p className="cert-description">{done ? 'All claimed.' : c.description}</p>
          <ProgressBar
            value={done ? c.target : c.progress}
            max={c.target}
            color={waiting > 0 && !done ? 'var(--ctd-claim)' : 'var(--ctd-gold)'}
            text={done ? shortNumber(c.target) : `${shortNumber(c.progress)} / ${shortNumber(c.target)}`}
          />
        </div>
        <ActionButton tone="claim" off={waiting <= 0} label={done ? undefined : `Claim ${c.title}`}>
          {done ? 'DONE' : waiting > 1 ? `CLAIM x${waiting}` : 'CLAIM'}
        </ActionButton>
      </Row>
    </li>
  );
}
