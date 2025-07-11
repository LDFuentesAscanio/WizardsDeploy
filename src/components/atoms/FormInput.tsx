'use client';

import { useField } from 'formik';

interface FormInputProps {
  name: string;
  label?: string;
  placeholder?: string;
  type?: string;
  as?: 'input' | 'textarea';
  rows?: number;
}

export default function FormInput({
  name,
  label,
  placeholder,
  type = 'text',
  as = 'input',
  rows = 4,
}: FormInputProps) {
  const [field, meta] = useField(name);

  return (
    <div>
      {label && (
        <label htmlFor={name} className="text-sm mb-1 block">
          {label}
        </label>
      )}
      {as === 'textarea' ? (
        <textarea
          id={name}
          {...field}
          placeholder={placeholder}
          rows={rows}
          className={`w-full px-4 py-3 rounded-xl bg-white/20 placeholder-gray-200 text-white resize-none ${
            meta.touched && meta.error ? 'border border-red-400' : ''
          }`}
        />
      ) : (
        <input
          id={name}
          {...field}
          type={type}
          placeholder={placeholder}
          className={`w-full px-4 py-3 rounded-xl bg-white/20 placeholder-gray-200 text-white ${
            meta.touched && meta.error ? 'border border-red-400' : ''
          }`}
        />
      )}
      {meta.touched && meta.error && (
        <p className="text-sm text-red-400 mt-1">{meta.error}</p>
      )}
    </div>
  );
}
