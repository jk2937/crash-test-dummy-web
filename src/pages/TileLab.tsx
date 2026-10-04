import { useEffect, useState, type ReactNode } from 'react';
import { Button, DEFAULT_LOOK, type TileLook } from '../components';
import {
  FINISHES, LAYOUTS, MARKS, MAX_READABLE_STRENGTH, PRESETS, patternStyle,
  type PatternSpec, type PresetName,
} from '../pattern';
import { colors, type ColorKey } from '../theme';
import './TileLab.css';

// Everything the lab edits, saved together: copy it out as one spec.
interface LabSpec {
  label: string;
  icon: string;
  color: ColorKey | 'custom';
  customFill: string;
  texture: PatternSpec | null;
  look: TileLook;
}

const START: LabSpec = {
  label: 'Vehicles',
  icon: '🚗',
  color: 'gold',
  customFill: '#ff7a59',
  texture: { ...PRESETS.polka, strength: 0.4 },
  look: DEFAULT_LOOK,
};

const SWATCHES: ColorKey[] = ['gold', 'info', 'rebirth', 'setup', 'facility', 'live', 'stop', 'surface'];
const SAVE_KEY = 'ctd-tile-lab';

// What was being worked on last time in this browser, if anything. A
// convenience only: it may be missing, or unreadable, and that is fine.
function loadSaved(): LabSpec {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (raw) {
      const saved = JSON.parse(raw) as Partial<LabSpec>;
      return { ...START, ...saved, look: { ...DEFAULT_LOOK, ...saved.look } };
    }
  } catch {
    // No storage, or something unreadable in it: start fresh.
  }
  return START;
}

// Every part of a tile, adjustable, with the result shown live.
export function TileLab() {
  const [spec, setSpec] = useState<LabSpec>(loadSaved);
  const [preset, setPreset] = useState<PresetName | 'none' | null>(null);
  const [nudge, setNudge] = useState(false);
  const [backdrop, setBackdrop] = useState<'light' | 'dark'>('light');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(spec));
    } catch {
      // Saving is a convenience; without storage the lab still works.
    }
  }, [spec]);

  const setLook = <K extends keyof TileLook>(key: K, value: TileLook[K]) =>
    setSpec((s) => ({ ...s, look: { ...s.look, [key]: value } }));
  const setTexture = <K extends keyof PatternSpec>(key: K, value: PatternSpec[K]) => {
    setSpec((s) => ({ ...s, texture: { ...(s.texture ?? START.texture!), [key]: value } }));
    setPreset(null);
  };

  const fill = spec.color === 'custom' ? spec.customFill : undefined;
  const color = spec.color === 'custom' ? undefined : spec.color;
  const { look, texture } = spec;
  const json = JSON.stringify({
    ...(fill ? { fill } : { color }),
    texture,
    look,
  }, null, 2);

  const reset = () => { setSpec(START); setPreset(null); };
  const copy = () => navigator.clipboard?.writeText(json).then(() => {
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  });

  return (
    <div className="lab">
      <header className="lab-head">
        <h1>Tile Lab</h1>
        <p>Every part of a tile, adjustable, with the result shown live. Your work is kept in this browser.</p>
      </header>

      <div className="lab-body">
        <div className="lab-controls">
          <Section title="Content">
            <Text label="Label" value={spec.label} onChange={(v) => setSpec((s) => ({ ...s, label: v }))} />
            <Text label="Icon" value={spec.icon} onChange={(v) => setSpec((s) => ({ ...s, icon: v }))} />
            <label className="lab-field">
              <span>Colour</span>
              <div className="lab-swatches" role="group" aria-label="Colour">
                {SWATCHES.map((c) => (
                  <button
                    key={c}
                    className="lab-swatch"
                    style={{ background: colors[c] }}
                    aria-label={c}
                    aria-pressed={spec.color === c}
                    onClick={() => setSpec((s) => ({ ...s, color: c }))}
                  />
                ))}
                <input
                  type="color"
                  className="lab-swatch lab-swatch-custom"
                  aria-label="Custom colour"
                  aria-pressed={spec.color === 'custom'}
                  value={spec.customFill}
                  onChange={(e) => setSpec((s) => ({ ...s, color: 'custom', customFill: e.target.value }))}
                />
              </div>
            </label>
            <Toggle label="Nudge (blink)" value={nudge} onChange={setNudge} />
          </Section>

          <Section title="Shape">
            <Slider label="Size" min={48} max={220} value={look.size} unit="px" onChange={(v) => setLook('size', v)} />
            <Slider label="Outline width" min={0} max={0.14} step={0.002} value={look.outlineWidth} percent
              onChange={(v) => setLook('outlineWidth', v)} />
            <ColorField label="Outline colour" value={look.outlineColor} onChange={(v) => setLook('outlineColor', v)} />
            <Toggle label="Coloured ring inside the outline" value={look.ring} onChange={(v) => setLook('ring', v)} />
            <Slider label="Corner radius" min={0} max={0.5} step={0.01} value={look.radius} percent
              onChange={(v) => setLook('radius', v)} />
          </Section>

          <Section title="Shine">
            <Slider label="Light at the foot" min={0} max={1} step={0.01} value={look.shineLight}
              onChange={(v) => setLook('shineLight', v)} />
            <Slider label="Shade at the top" min={0} max={1} step={0.01} value={look.shineShade}
              onChange={(v) => setLook('shineShade', v)} />
            <Slider label="Light reaches up" min={0} max={100} value={look.shineFade} unit="%"
              onChange={(v) => setLook('shineFade', v)} />
          </Section>

          <Section title="Texture">
            <div className="lab-presets" role="group" aria-label="Texture presets">
              <button className="lab-chip" aria-pressed={texture === null}
                onClick={() => { setSpec((s) => ({ ...s, texture: null })); setPreset('none'); }}>None</button>
              {(Object.keys(PRESETS) as PresetName[]).map((name) => (
                <button
                  key={name}
                  className="lab-chip"
                  aria-pressed={preset === name}
                  style={patternStyle({ ...PRESETS[name], strength: 0.35 })}
                  onClick={() => {
                    setSpec((s) => ({ ...s, texture: { ...PRESETS[name], strength: s.texture?.strength ?? 0.4 } }));
                    setPreset(name);
                  }}
                >
                  {name}
                </button>
              ))}
            </div>
            {texture && (
              <>
                <Choice label="Mark" options={MARKS} value={texture.mark} onChange={(v) => setTexture('mark', v)} />
                <Choice label="Layout" options={LAYOUTS} value={texture.layout} onChange={(v) => setTexture('layout', v)}
                  disabled={texture.mark === 'stripe'} />
                <Choice label="Finish" options={FINISHES} value={texture.finish} onChange={(v) => setTexture('finish', v)} />
                <Slider label="Mark size" min={2} max={40} value={texture.size} unit="px" onChange={(v) => setTexture('size', v)} />
                <Slider label="Gap" min={0} max={40} value={texture.gap} unit="px" onChange={(v) => setTexture('gap', v)} />
                <Slider label="Angle" min={0} max={180} step={15} value={texture.angle} unit="°"
                  onChange={(v) => setTexture('angle', v)} disabled={texture.mark === 'stripe'} />
                <Slider label="Strength" min={0.02} max={1} step={0.02} value={texture.strength}
                  onChange={(v) => setTexture('strength', v)} />
                {texture.strength > MAX_READABLE_STRENGTH && (
                  <p className="lab-warn">Above {MAX_READABLE_STRENGTH}, labels may get hard to read.</p>
                )}
              </>
            )}
          </Section>

          <Section title="Icon">
            <Slider label="Size" min={0.3} max={1.6} step={0.02} value={look.iconScale} percent
              onChange={(v) => setLook('iconScale', v)} />
            <Slider label="Tilt" min={-45} max={45} value={look.iconTilt} unit="°" onChange={(v) => setLook('iconTilt', v)} />
            <Toggle label="Lift above the label" value={look.iconLift} onChange={(v) => setLook('iconLift', v)} />
            <Slider label="Shadow across" min={-20} max={20} step={0.5} value={look.iconShadowX} unit="px"
              onChange={(v) => setLook('iconShadowX', v)} />
            <Slider label="Shadow down" min={-20} max={20} step={0.5} value={look.iconShadowY} unit="px"
              onChange={(v) => setLook('iconShadowY', v)} />
            <Slider label="Shadow blur" min={0} max={20} step={0.5} value={look.iconShadowBlur} unit="px"
              onChange={(v) => setLook('iconShadowBlur', v)} />
            <Slider label="Shadow darkness" min={0} max={1} step={0.01} value={look.iconShadowAlpha}
              onChange={(v) => setLook('iconShadowAlpha', v)} />
          </Section>

          <Section title="Label">
            <Slider label="Size" min={0.06} max={0.24} step={0.005} value={look.labelScale} percent
              onChange={(v) => setLook('labelScale', v)} />
            <Slider label="Outline" min={0} max={8} step={0.5} value={look.labelStroke} unit="px"
              onChange={(v) => setLook('labelStroke', v)} />
            <Slider label="Letter spacing" min={-0.05} max={0.3} step={0.01} value={look.labelSpacing} unit="em"
              onChange={(v) => setLook('labelSpacing', v)} />
            <Toggle label="Capitals" value={look.labelUpper} onChange={(v) => setLook('labelUpper', v)} />
          </Section>
        </div>

        <div className="lab-preview">
          <div className={`lab-stage lab-stage-${backdrop}`}>
            <Button label={spec.label} icon={spec.icon} color={color} fill={fill} texture={texture} look={look} nudge={nudge} />
          </div>
          <div className="lab-stage-switch" role="group" aria-label="Backdrop">
            <button className="lab-chip" aria-pressed={backdrop === 'light'} onClick={() => setBackdrop('light')}>Light backdrop</button>
            <button className="lab-chip" aria-pressed={backdrop === 'dark'} onClick={() => setBackdrop('dark')}>Dark backdrop</button>
          </div>

          <h2 className="lab-subhead">In every colour</h2>
          <div className={`lab-row lab-stage-${backdrop}`}>
            {SWATCHES.map((c) => (
              <Button key={c} label={c} icon={spec.icon} color={c} texture={texture}
                look={{ ...look, size: Math.min(look.size, 88) }} nudge={nudge} />
            ))}
          </div>

          <div className="lab-out">
            <div className="lab-out-head">
              <h2 className="lab-subhead">Spec</h2>
              <div className="lab-out-actions">
                <button className="lab-action" onClick={reset}>Reset</button>
                <button className="lab-action lab-action-primary" onClick={copy}>{copied ? 'Copied' : 'Copy'}</button>
              </div>
            </div>
            <pre className="lab-json">{json}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <details className="lab-section" open>
      <summary>{title}</summary>
      <div className="lab-section-body">{children}</div>
    </details>
  );
}

function Slider({ label, min, max, step = 1, value, unit = '', percent = false, onChange, disabled }: {
  label: string; min: number; max: number; step?: number; value: number; unit?: string; percent?: boolean;
  onChange: (v: number) => void; disabled?: boolean;
}) {
  const shown = percent ? `${Math.round(value * 1000) / 10}%` : `${Math.round(value * 100) / 100}${unit}`;
  return (
    <label className="lab-field">
      <span>{label} <output>{shown}</output></span>
      <input type="range" min={min} max={max} step={step} value={value} disabled={disabled}
        onChange={(e) => onChange(Number(e.target.value))} />
    </label>
  );
}

function Choice<T extends string>({ label, options, value, onChange, disabled }: {
  label: string; options: readonly T[]; value: T; onChange: (v: T) => void; disabled?: boolean;
}) {
  return (
    <label className="lab-field">
      <span>{label}</span>
      <select value={value} disabled={disabled} onChange={(e) => onChange(e.target.value as T)}>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  );
}

function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="lab-toggle">
      <input type="checkbox" checked={value} onChange={(e) => onChange(e.target.checked)} />
      <span>{label}</span>
    </label>
  );
}

function Text({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="lab-field">
      <span>{label}</span>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="lab-field lab-field-inline">
      <span>{label}</span>
      <input type="color" value={value} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}
