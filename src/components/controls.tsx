import type { ReactNode } from 'react';

interface SegmentedOption<T extends string | number> {
  value: T;
  label: ReactNode;
}

interface SegmentedProps<T extends string | number> {
  options: SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  ariaLabel: string;
}

export function Segmented<T extends string | number>({
  options, value, onChange, ariaLabel,
}: SegmentedProps<T>) {
  return (
    <div className="segmented" role="radiogroup" aria-label={ariaLabel}>
      {options.map((opt) => (
        <button
          key={String(opt.value)}
          type="button"
          role="radio"
          aria-checked={opt.value === value}
          className={`segmented-item${opt.value === value ? ' is-active' : ''}`}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

interface SliderProps {
  id: string;
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  display: string;
  onChange: (value: number) => void;
}

export function Slider({ id, label, min, max, step, value, display, onChange }: SliderProps) {
  const percent = ((value - min) / (max - min)) * 100;
  return (
    <div className="slider-row">
      <div className="slider-head">
        <label htmlFor={id}>{label}</label>
        <span className="slider-value">{display}</span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        style={{ '--fill': `${percent}%` } as React.CSSProperties}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}

interface ToggleProps {
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function Toggle({ id, label, checked, onChange }: ToggleProps) {
  return (
    <label className="toggle" htmlFor={id}>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="toggle-track" aria-hidden="true">
        <span className="toggle-thumb" />
      </span>
      <span className="toggle-label">{label}</span>
    </label>
  );
}

interface NumberFieldProps {
  id: string;
  label: string;
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
}

export function NumberField({ id, label, value, min, max, onChange }: NumberFieldProps) {
  return (
    <div className="number-field">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type="number"
        inputMode="numeric"
        value={Number.isFinite(value) ? value : ''}
        min={min}
        max={max}
        onChange={(e) => onChange(e.target.value === '' ? NaN : Number(e.target.value))}
      />
    </div>
  );
}

export function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="field-error" role="alert">{message}</p>;
}
