'use client';

import React, {
  useMemo,
  useState,
  ChangeEvent,
  KeyboardEvent,
  MouseEvent,
} from 'react';
import { useField } from 'formik';

type Option = { value: string; label: string }; // p.ej. value=platform_id, label=platform.name

interface ExpertiseSectionProps {
  name?: string; // default: "expertise"
  label?: string; // default: "Expertise"
  placeholder?: string; // default: "Add an expertise and press Enter"
  options?: Option[]; // lista de plataformas disponibles (opcional)
  maxItems?: number;
}

export default function ExpertiseSection({
  name = 'expertise',
  label = 'Expertise',
  placeholder = 'Add an expertise and press Enter',
  options = [],
  maxItems,
}: ExpertiseSectionProps) {
  const [field, meta, helpers] = useField<string[]>(name);
  const [input, setInput] = useState<string>('');

  const selected = useMemo<string[]>(
    () => (Array.isArray(field.value) ? field.value : []),
    [field.value]
  );
  const hasError = Boolean(meta.touched && meta.error);

  const remainingOptions = useMemo<Option[]>(
    () => options.filter((o) => !selected.includes(o.value)),
    [options, selected]
  );

  const addItem = (val: string) => {
    const v = val.trim();
    if (!v) return;
    if (maxItems && selected.length >= maxItems) return;
    if (selected.includes(v)) return;
    helpers.setValue([...selected, v]);
    helpers.setTouched(true, true);
    setInput('');
  };

  const removeItem = (val: string) => {
    helpers.setValue(selected.filter((s) => s !== val));
    helpers.setTouched(true, true);
  };

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addItem(input);
    }
  };

  const onOptionClick = (e: MouseEvent<HTMLButtonElement>, value: string) => {
    e.preventDefault();
    addItem(value);
  };

  const labelFor = (value: string) =>
    options.find((o) => o.value === value)?.label ?? value;

  return (
    <section className="space-y-2">
      <label className="block text-sm">{label}</label>

      <input
        type="text"
        value={input}
        onChange={onInputChange}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        className={`w-full px-4 py-3 rounded-xl bg-[#e7e7e7] text-[#2c3d5a] placeholder-[#2c3d5a]/60 ${
          hasError ? 'border border-red-400' : ''
        }`}
      />

      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selected.map((val) => (
            <span
              key={val}
              className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full bg-[#e7e7e7] text-[#1d2c45]"
            >
              {labelFor(val)}
              <button
                type="button"
                aria-label={`Remove ${labelFor(val)}`}
                onClick={() => removeItem(val)}
                className="text-[#1d2c45]/70 hover:text-red-600"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      {remainingOptions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {remainingOptions.slice(0, 10).map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={(e) => onOptionClick(e, opt.value)}
              className="text-xs px-3 py-1 rounded-full bg-white/10 text-white hover:bg-white/15"
            >
              + {opt.label}
            </button>
          ))}
        </div>
      )}

      {hasError && typeof meta.error === 'string' && (
        <p className="text-sm text-red-400">{meta.error}</p>
      )}
    </section>
  );
}
