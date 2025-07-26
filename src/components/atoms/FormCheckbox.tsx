'use client';
import { useField } from 'formik';
import { ChangeEvent } from 'react';

interface FormCheckboxProps {
  name: string;
  label?: string | React.ReactNode;
  className?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  checked?: boolean; // Añade esta línea
}

export default function FormCheckbox({
  name,
  label,
  className,
  onChange,
  checked, // Añade esto a las props
}: FormCheckboxProps) {
  const [field, meta, helpers] = useField({ name, type: 'checkbox' });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    helpers.setValue(e.target.checked);
    if (onChange) onChange(e);
  };

  return (
    <div className={className}>
      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          {...field}
          checked={checked !== undefined ? checked : field.value} // Usa checked si está definido
          onChange={handleChange}
          className="accent-white"
        />
        <span className="text-sm text-white">{label}</span>
      </label>
      {meta.touched && meta.error && (
        <p className="text-sm text-red-400 mt-1">{meta.error}</p>
      )}
    </div>
  );
}
