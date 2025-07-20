// components/atoms/FormCheckBox.tsx
'use client';

import { useField } from 'formik';

interface FormCheckboxProps {
  name: string;
  label?: string | React.ReactNode;
  className?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function FormCheckbox({
  name,
  label,
  className,
  onChange,
}: FormCheckboxProps) {
  const [field, meta, helpers] = useField({ name, type: 'checkbox' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    helpers.setValue(e.target.checked);
    if (onChange) onChange(e);
  };

  return (
    <div className={className}>
      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          {...field}
          checked={field.value}
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
