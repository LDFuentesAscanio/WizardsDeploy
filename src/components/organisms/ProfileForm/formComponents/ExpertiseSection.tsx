'use client';

import { FieldArray, useField } from 'formik';
import { useMemo } from 'react';
import type { ProfileFormValues, Expertise } from '../types';

type Option = { value: string; label: string };

// Type seguro tomado del propio modelo
type Exp = Expertise['experience_time'];

type Props = {
  name: 'expertise'; // clave en Formik
  platforms: Option[]; // options de la tabla platforms ya mapeadas a {value,label}
};

// ⚠️ Debe calzar EXACTO con tu ExperienceTimeEnum del schema
const EXPERIENCE_OPTIONS: { value: Exp; label: string }[] = [
  { value: 'less than 1 year', label: 'Less than 1 year' },
  { value: '1 to 2 years', label: '1 to 2 years' },
  { value: '2 to 3 years', label: '2 to 3 years' },
  { value: 'more than 3 years', label: 'More than 3 years' },
];

export default function ExpertiseSection({ name, platforms }: Props) {
  // Field como array de expertise; si no hay array, devolvemos []
  const [field, meta, helpers] = useField<ProfileFormValues['expertise']>(name);

  const list = useMemo<Expertise[]>(
    () => (Array.isArray(field.value) ? (field.value as Expertise[]) : []),
    [field.value]
  );

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold">Expertises</h4>
        <FieldArray name={name}>
          {({ push }) => (
            <button
              type="button"
              onClick={() =>
                push({
                  platform_id: '',
                  rating: 1,
                  experience_time: 'less than 1 year' as Exp,
                })
              }
              className="text-xs px-3 py-1 rounded-lg bg-white/20 hover:bg-white/30"
            >
              + Add
            </button>
          )}
        </FieldArray>
      </div>

      <FieldArray name={name}>
        {({ remove }) => (
          <div className="space-y-3">
            {list.map((row, idx) => {
              const setPlatform = (platform_id: string) => {
                const next: Expertise[] = list.map((it, i) =>
                  i === idx ? { ...it, platform_id } : it
                );
                helpers.setValue(next);
              };

              const setRating = (rating: number) => {
                const next: Expertise[] = list.map((it, i) =>
                  i === idx ? { ...it, rating } : it
                );
                helpers.setValue(next);
              };

              const setExperience = (experience_time: Exp) => {
                const next: Expertise[] = list.map((it, i) =>
                  i === idx ? { ...it, experience_time } : it
                );
                helpers.setValue(next);
              };

              return (
                <div
                  key={`${row.platform_id || 'new'}-${idx}`}
                  className="grid gap-2 bg-white/10 rounded-xl p-3 border border-white/10"
                >
                  {/* Platform */}
                  <div className="grid gap-1">
                    <label className="text-xs text-white/80">Platform</label>
                    <select
                      value={row.platform_id ?? ''}
                      onChange={(e) => setPlatform(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white/20 text-white focus:outline-none focus:ring-2 focus:ring-[#67ff94]"
                    >
                      <option value="" className="text-[#2c3d5a] bg-white">
                        Select a platform
                      </option>
                      {platforms.map((p) => (
                        <option
                          key={p.value}
                          value={p.value}
                          className="text-[#2c3d5a] bg-white"
                        >
                          {p.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Rating (1–7) */}
                  <div className="grid gap-1">
                    <label className="text-xs text-white/80">
                      Rating (1–7)
                    </label>
                    <select
                      value={row.rating ?? 1}
                      onChange={(e) => setRating(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-lg bg-white/20 text-white focus:outline-none focus:ring-2 focus:ring-[#67ff94]"
                    >
                      {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                        <option
                          key={n}
                          value={n}
                          className="text-[#2c3d5a] bg-white"
                        >
                          {n}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Experience time */}
                  <div className="grid gap-1">
                    <label className="text-xs text-white/80">Experience</label>
                    <select
                      value={(row.experience_time ?? 'less than 1 year') as Exp}
                      onChange={(e) => setExperience(e.target.value as Exp)}
                      className="w-full px-3 py-2 rounded-lg bg-white/20 text-white focus:outline-none focus:ring-2 focus:ring-[#67ff94]"
                    >
                      {EXPERIENCE_OPTIONS.map((opt) => (
                        <option
                          key={opt.value}
                          value={opt.value}
                          className="text-[#2c3d5a] bg-white"
                        >
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => remove(idx)}
                      className="text-xs px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </FieldArray>

      {meta.touched && typeof meta.error === 'string' && (
        <p className="text-sm text-red-400 mt-1">{meta.error}</p>
      )}
    </div>
  );
}
