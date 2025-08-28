'use client';

import { useField } from 'formik';

interface Option {
  value: string;
  label: string;
}

interface FormInputProps {
  name: string;
  label?: string;
  placeholder?: string;
  type?: string;
  as?: 'input' | 'textarea' | 'select';
  rows?: number;
  className?: string;
  options?: Option[];
}

export default function FormInput({
  name,
  label,
  placeholder,
  type = 'text',
  as = 'input',
  rows = 4,
  className,
  options = [],
}: FormInputProps) {
  const [field, meta] = useField(name);
  const isCheckbox = type === 'checkbox';
  const hasError = Boolean(meta.touched && meta.error);
  const describedBy = hasError ? `${name}-error` : undefined;

  return (
    <div className={className}>
      {isCheckbox ? (
        <>
          <label htmlFor={name} className="inline-flex items-center space-x-2">
            <input
              id={name}
              type="checkbox"
              name={field.name}
              onChange={field.onChange}
              onBlur={field.onBlur}
              checked={Boolean(field.value)}
              aria-invalid={hasError}
              aria-describedby={describedBy}
              className={`accent-white ${hasError ? 'border border-red-400' : ''}`}
            />
            {label && <span className="text-sm text-white">{label}</span>}
          </label>
          {hasError && (
            <p id={`${name}-error`} className="text-sm text-red-400 mt-1">
              {meta.error}
            </p>
          )}
        </>
      ) : (
        <>
          {label && (
            <label htmlFor={name} className="text-sm mb-1 block text-[#e7e7e7]">
              {label}
            </label>
          )}

          {as === 'textarea' ? (
            <textarea
              id={name}
              {...field}
              placeholder={placeholder}
              rows={rows}
              aria-invalid={hasError}
              aria-describedby={describedBy}
              className={`w-full px-4 py-3 rounded-xl bg-[#e7e7e7] text-[#2c3d5a] placeholder-[#2c3d5a]/50 resize-none ${
                hasError ? 'border border-red-400' : ''
              }`}
            />
          ) : as === 'select' ? (
            <select
              id={name}
              {...field}
              aria-invalid={hasError}
              aria-describedby={describedBy}
              className={`w-full px-4 py-3 rounded-xl bg-[#e7e7e7] text-[#2c3d5a] ${
                hasError ? 'border border-red-400' : ''
              }`}
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
          ) : (
            <input
              id={name}
              {...field}
              type={type}
              placeholder={placeholder}
              aria-invalid={hasError}
              aria-describedby={describedBy}
              className={`w-full px-4 py-3 rounded-xl bg-white/20 placeholder-gray-200 text-white ${
                hasError ? 'border border-red-400' : ''
              }`}
            />
          )}

          {hasError && (
            <p id={`${name}-error`} className="text-sm text-red-400 mt-1">
              {meta.error}
            </p>
          )}
        </>
      )}
    </div>
  );
}
