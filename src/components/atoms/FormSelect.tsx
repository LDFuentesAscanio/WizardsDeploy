'use client';
//External libraries
import { useField } from 'formik';

interface FormSelectProps {
  name: string;
  label?: string;
  options: { value: string; label: string }[];
  disabled?: boolean;
}

export default function FormSelect({
  name,
  label,
  options,
  disabled,
}: FormSelectProps) {
  const [field, meta] = useField(name);

  return (
    <div>
      {label && (
        <label htmlFor={name} className="text-sm mb-1 block">
          {label}
        </label>
      )}
      <select
        {...field}
        id={name}
        disabled={disabled}
        className={`w-full px-4 py-3 rounded-xl bg-white text-[#2c3d5a] 
          focus:outline-none focus:ring-2 focus:ring-[#67ff94] 
          ${meta.touched && meta.error ? 'border border-red-400' : ''} 
          disabled:opacity-50`}
      >
        <option value="" disabled>
          Select an option
        </option>
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
