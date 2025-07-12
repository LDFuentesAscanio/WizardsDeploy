'use client';
//External libraries
import { useState } from 'react';
import { useField } from 'formik';
import { Star } from 'lucide-react';

interface StarRatingInputProps {
  name: string;
  label?: string;
  max?: number; // por defecto 5 estrellas
}

export default function StarRatingInput({
  name,
  label = 'Rating',
  max = 5,
}: StarRatingInputProps) {
  const [field, , helpers] = useField(name);
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div>
      {label && <label className="text-sm mb-1 block">{label}</label>}
      <div className="flex items-center gap-1">
        {Array.from({ length: max }, (_, i) => {
          const value = (i + 1).toString();

          return (
            <button
              key={value}
              type="button"
              onClick={() => helpers.setValue(value)}
              onMouseEnter={() => setHovered(i + 1)}
              onMouseLeave={() => setHovered(null)}
              className="focus:outline-none"
            >
              <Star
                className={`w-6 h-6 transition-colors duration-150 ${
                  (hovered ?? parseInt(field.value)) > i
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-400'
                }`}
                fill={
                  (hovered ?? parseInt(field.value)) > i
                    ? 'currentColor'
                    : 'none'
                }
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
