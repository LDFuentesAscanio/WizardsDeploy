'use client';

import FormInput from '@/components/atoms/FormInput';
import UploadDocumentField from '@/components/molecules/UploadDocumentField';
import ExpertiseSection from '../ExpertiseSection';
import SkillsSection from '../SkillsSection';
import ToolsSection from '../ToolsSection';

export function ExpertInfoSection() {
  return (
    <section className="grid gap-4">
      <UploadDocumentField />
      <FormInput name="profession" label="Profession" />
      <FormInput
        name="bio"
        label="Bio"
        as="textarea"
        placeholder="Write a short bio"
        rows={5}
      />
      <ExpertiseSection />
      <SkillsSection />
      <ToolsSection />
    </section>
  );
}
