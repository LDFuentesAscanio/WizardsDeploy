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
  const hasError = meta.touched && meta.error;

  return (
    <div className={className}>
      {isCheckbox ? (
        <label className="inline-flex items-center space-x-2">
          <input
            id={name}
            {...field}
            type="checkbox"
            className={`w-full px-4 py-3 rounded-xl bg-[#e7e7e7]/20 placeholder-[#e7e7e7]/60 text-[#e7e7e7] ${
              hasError ? 'border border-red-400' : ''
            }`}
            checked={field.value}
          />
          <span className="text-sm text-white">{label}</span>
        </label>
      ) : (
        <>
          {label && (
            <label htmlFor={name} className="text-sm mb-1 block text-white">
              {label}
            </label>
          )}
          {as === 'textarea' ? (
            <textarea
              id={name}
              {...field}
              placeholder={placeholder}
              rows={rows}
              className={`w-full px-4 py-3 rounded-xl bg-[#e7e7e7]/20 placeholder-[#e7e7e7]/60 text-[#e7e7e7] resize-none ${
                hasError ? 'border border-red-400' : ''
              }`}
            />
          ) : as === 'select' ? (
            <select
              id={name}
              {...field}
              className={`w-full px-4 py-3 rounded-xl bg-[#e7e7e7]/20 text-[#e7e7e7] ${
                hasError ? 'border border-red-400' : ''
              }`}
            >
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
              className={`w-full px-4 py-3 rounded-xl bg-white/20 placeholder-gray-200 text-white ${
                hasError ? 'border border-red-400' : ''
              }`}
            />
          )}
        </>
      )}
      {hasError && <p className="text-sm text-red-400 mt-1">{meta.error}</p>}
    </div>
  );
}
