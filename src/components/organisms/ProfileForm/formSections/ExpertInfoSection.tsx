'use client';

import FormInput from '@/components/atoms/FormInput';
import UploadDocumentField from '@/components/molecules/UploadDocumentField';
import ExpertiseSection from '../formComponents/ExpertiseSection';
import SkillsSection from '../formComponents/SkillsSection';
import ToolsSection from '../formComponents/ToolsSection';

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
