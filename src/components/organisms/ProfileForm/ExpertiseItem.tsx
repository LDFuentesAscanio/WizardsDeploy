'use client';

import { Field, ErrorMessage } from 'formik';
import { Platform } from './types';
import StarRatingInput from '@/components/atoms/StarRatingInput';

interface Props {
  index: number;
  platforms: Platform[];
  experienceOptions: { value: string; label: string }[];
  onRemove: () => void;
  canRemove: boolean;
}

export function ExpertiseItem({
  index,
  platforms,
  experienceOptions,
  onRemove,
  canRemove,
}: Props) {
  return (
    <div className="p-4 border rounded-xl bg-white/10 space-y-2">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <label className="block text-sm mb-1">Platform</label>
          <Field
            as="select"
            name={`expertise[${index}].platform_id`}
            className="w-full px-3 py-2 rounded bg-white text-[#2c3d5a]"
          >
            <option value="">Select a platform</option>
            {platforms.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </Field>
          <ErrorMessage
            name={`expertise[${index}].platform_id`}
            component="div"
            className="text-sm text-red-400 mt-1"
          />
        </div>

        <StarRatingInput name={`expertise.${index}.rating`} label="Level" />

        <div>
          <label className="block text-sm mb-1">Time</label>
          <Field
            as="select"
            name={`expertise[${index}].experience_time`}
            className="w-full px-3 py-2 rounded bg-white text-[#2c3d5a]"
          >
            <option value="">Select</option>
            {experienceOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </Field>
        </div>
      </div>

      {canRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="text-sm text-red-400 underline mt-2"
        >
          Delete expertise
        </button>
      )}
    </div>
  );
}
