// src/components/atoms/FormSelect.tsx
'use client';

import { useField } from 'formik';
import { useCallback } from 'react';

interface FormSelectProps {
  name: string;
  label?: string;
  options: { value: string; label: string }[];
  disabled?: boolean;
  /** Callback opcional para reaccionar al cambio con el value final (tipado) */
  onChangeValue?: (value: string) => void;
}

export default function FormSelect({
  name,
  label,
  options,
  disabled,
  onChangeValue,
}: FormSelectProps) {
  const [field, meta, helpers] = useField<string>(name);
  const { setValue, setTouched } = helpers;

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value;
      setValue(value);
      setTouched(true, true);
      if (onChangeValue) onChangeValue(value);
    },
    [onChangeValue, setTouched, setValue]
  );

  return (
    <div>
      {label && (
        <label htmlFor={name} className="text-sm mb-1 block text-[#e7e7e7]">
          {label}
        </label>
      )}
      <select
        id={name}
        name={name}
        value={field.value ?? ''}
        onChange={handleChange}
        onBlur={field.onBlur}
        disabled={disabled}
        className={`w-full px-4 py-3 rounded-xl bg-[#e7e7e7] text-[#2c3d5a]
          focus:outline-none focus:ring-2 focus:ring-[#67ff94]
          ${meta.touched && meta.error ? 'border border-red-400' : ''}
          disabled:opacity-50`}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {meta.touched && meta.error && (
        <p className="text-sm text-red-400 mt-1">{meta.error}</p>
      )}
    </div>
  );
}
