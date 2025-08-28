'use client';

import { Field, ErrorMessage } from 'formik';
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
        <label
          htmlFor="profession_id"
          className="text-sm mb-1 block text-white"
        >
          Profession
        </label>
        <Field
          as="select"
          name="profession_id"
          className="w-full px-4 py-3 rounded-xl bg-white/20 text-white focus:outline-none focus:ring-2 focus:ring-[#67ff94]"
        >
          <option value="" className="text-[#2c3d5a] bg-white">
            Select a profession
          </option>
          {professions.map((p) => (
            <option
              key={p.id}
              value={p.id}
              className="text-[#2c3d5a] bg-white hover:bg-[#67ff94]"
            >
              {p.profession_name}
            </option>
          ))}
        </Field>
        <ErrorMessage
          name="profession_id"
          component="div"
          className="text-sm text-red-400 mt-1"
        />
      </div>

      <div>
        <Field
          as="textarea"
          name="bio"
          placeholder="Write a short bio"
          rows={5}
          className="w-full px-4 py-3 rounded-xl bg-white/20 text-white resize-none focus:outline-none focus:ring-2 focus:ring-[#67ff94]"
        />
        <ErrorMessage
          name="bio"
          component="div"
          className="text-sm text-red-400 mt-1"
        />
      </div>

      <ExpertiseSection />
      <SkillsSection />
      <ToolsSection />
    </section>
  );
}
