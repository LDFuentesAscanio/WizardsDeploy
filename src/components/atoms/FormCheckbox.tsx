'use client';

import { useField } from 'formik';
import type { ChangeEvent } from 'react';

interface FormCheckboxProps {
  name: string;
  label?: string | React.ReactNode;
  className?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  checked?: boolean;
}

export default function FormCheckbox({
  name,
  label,
  className,
  onChange,
  checked,
}: FormCheckboxProps) {
  // Siempre llamamos al hook en el tope del componente
  const [field, meta, helpers] = useField({ name, type: 'checkbox' });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      // Para casos como selectedCategories (array), dejamos que el padre maneje la lógica
      onChange(e);
    } else {
      // Para boolean simple
      helpers.setValue(e.target.checked);
    }
    helpers.setTouched(true, true);
  };

  const hasError = meta.touched && !!meta.error;

  return (
    <div className={className}>
      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          name={field.name}
          onBlur={field.onBlur}
          onChange={handleChange}
          checked={checked !== undefined ? checked : Boolean(field.value)}
          className={`accent-white ${hasError ? 'border border-red-400' : ''}`}
        />
        <span className="text-sm text-white">{label}</span>
      </label>
      {hasError && <p className="text-sm text-red-400 mt-1">{meta.error}</p>}
    </div>
  );
}
