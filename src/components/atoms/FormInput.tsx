'use client';
import { useField } from 'formik';

interface FormInputProps {
  name: string;
  label?: string;
  placeholder?: string;
  type?: string;
  as?: 'input' | 'textarea';
  rows?: number;
  className?: string;
}

export default function FormInput({
  name,
  label,
  placeholder,
  type = 'text',
  as = 'input',
  rows = 4,
  className,
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
            className={`form-checkbox h-4 w-4 text-blue-500 ${
              hasError ? 'border-red-400' : ''
            }`}
            checked={field.value} // importante para checkboxes
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
              className={`w-full px-4 py-3 rounded-xl bg-white/20 placeholder-gray-200 text-white resize-none ${
                hasError ? 'border border-red-400' : ''
              }`}
            />
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
