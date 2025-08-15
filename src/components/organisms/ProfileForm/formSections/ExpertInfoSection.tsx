'use client';
import { Field } from 'formik';
import UploadDocumentField from '@/components/molecules/UploadDocumentField';
import ExpertiseSection from '../formComponents/ExpertiseSection';
import SkillsSection from '../formComponents/SkillsSection';
import ToolsSection from '../formComponents/ToolsSection';
import { ITProfession } from '../types';

interface ExpertInfoSectionProps {
  professions: ITProfession[];
}

export function ExpertInfoSection({ professions }: ExpertInfoSectionProps) {
  return (
    <section className="grid gap-4">
      <UploadDocumentField />

      <div>
        <label htmlFor="profession" className="text-sm mb-1 block text-white">
          Profession
        </label>
        <Field
          as="select"
          name="profession" // Cambiado de profession_id a profession
          className="w-full px-4 py-3 rounded-xl bg-white/20 text-white"
        >
          <option value="">Select a profession</option>
          {professions.map((p) => (
            <option key={p.id} value={p.profession_name}>
              {' '}
              {/* Enviamos el nombre */}
              {p.profession_name}
            </option>
          ))}
        </Field>
      </div>

      <Field
        as="textarea"
        name="bio"
        placeholder="Write a short bio"
        rows={5}
        className="w-full px-4 py-3 rounded-xl bg-white/20 text-white resize-none"
      />

      <ExpertiseSection />
      <SkillsSection />
      <ToolsSection />
    </section>
  );
}
