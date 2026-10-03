import { useState } from 'react';
import { Button } from '../components';
import type { ColorKey } from '../theme';
import {
  FINISHES, LAYOUTS, MARKS, MAX_READABLE_STRENGTH, PRESETS, patternStyle,
  type PatternSpec, type PresetName,
} from '../pattern';
import './Playground.css';

const SWATCHES: ColorKey[] = ['gold', 'info', 'rebirth', 'setup', 'facility', 'live', 'stop', 'surface'];

// Pick a mark, a layout and a finish, tune it, and see it on real tiles.
export function Playground() {
  const [spec, setSpec] = useState<PatternSpec>(PRESETS.studs);
  const [preset, setPreset] = useState<PresetName | null>('studs');
  const [copied, setCopied] = useState(false);

  const set = <K extends keyof PatternSpec>(key: K, value: PatternSpec[K]) => {
    setSpec((s) => ({ ...s, [key]: value }));
    setPreset(null);
  };
  const json = JSON.stringify(spec);

  return (
    <section className="pg" aria-labelledby="pg-title">
      <h2 id="pg-title">Texture playground</h2>
      <p className="pg-blurb">
        Every texture is a <b>mark</b>, repeated in a <b>layout</b>, lit by a <b>finish</b>. It is drawn in white and
        black only, so it takes on whatever colour it sits over.
      </p>

      <div className="pg-presets" role="group" aria-label="Presets">
        {(Object.keys(PRESETS) as PresetName[]).map((name) => (
          <button
            key={name}
            className="pg-chip"
            aria-pressed={preset === name}
            style={patternStyle({ ...PRESETS[name], strength: Math.max(PRESETS[name].strength, 0.3) })}
            onClick={() => { setSpec(PRESETS[name]); setPreset(name); }}
          >
            {name}
          </button>
        ))}
      </div>

      <div className="pg-body">
        <form className="pg-controls" onSubmit={(e) => e.preventDefault()}>
          <Choice label="Mark" options={MARKS} value={spec.mark} onChange={(v) => set('mark', v)} />
          <Choice label="Layout" options={LAYOUTS} value={spec.layout} onChange={(v) => set('layout', v)}
            disabled={spec.mark === 'stripe'} />
          <Choice label="Finish" options={FINISHES} value={spec.finish} onChange={(v) => set('finish', v)} />
          <Slider label="Size" min={2} max={40} value={spec.size} unit="px" onChange={(v) => set('size', v)} />
          <Slider label="Gap" min={0} max={40} value={spec.gap} unit="px" onChange={(v) => set('gap', v)} />
          <Slider label="Angle" min={0} max={180} step={15} value={spec.angle} unit="°" onChange={(v) => set('angle', v)}
            disabled={spec.mark === 'stripe'} />
          <Slider label="Strength" min={0.02} max={1} step={0.02} value={spec.strength} onChange={(v) => set('strength', v)} />
          {spec.strength > MAX_READABLE_STRENGTH && (
            <p className="pg-warn">Above {MAX_READABLE_STRENGTH}, labels on top may get hard to read.</p>
          )}
        </form>

        <div className="pg-preview">
          <div className="pg-tiles">
            {SWATCHES.map((c) => <Button key={c} label={c} icon="🚗" color={c} texture={spec} />)}
          </div>
          <div className="pg-panel" style={patternStyle(spec)}>
            <span>A wider surface: a panel, a card, a page background.</span>
          </div>
          <div className="pg-json">
            <code>{json}</code>
            <button
              className="pg-copy"
              onClick={() => navigator.clipboard?.writeText(json).then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 1200);
              })}
            >
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Choice<T extends string>({ label, options, value, onChange, disabled }: {
  label: string; options: readonly T[]; value: T; onChange: (v: T) => void; disabled?: boolean;
}) {
  return (
    <label className="pg-field">
      <span>{label}</span>
      <select value={value} disabled={disabled} onChange={(e) => onChange(e.target.value as T)}>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  );
}

function Slider({ label, min, max, step = 1, value, unit = '', onChange, disabled }: {
  label: string; min: number; max: number; step?: number; value: number; unit?: string;
  onChange: (v: number) => void; disabled?: boolean;
}) {
  return (
    <label className="pg-field">
      <span>{label} <output>{value}{unit}</output></span>
      <input type="range" min={min} max={max} step={step} value={value} disabled={disabled}
        onChange={(e) => onChange(Number(e.target.value))} />
    </label>
  );
}
