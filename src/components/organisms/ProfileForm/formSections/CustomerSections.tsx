'use client';

import { useState } from 'react';
import { Category } from '../types';

import { CustomerBasicInfo } from './CustomerBasicInfo';
import FormCheckbox from '@/components/atoms/FormCheckbox';
import CustomerCategoryModal from '../../dashboard/CustomerCategoriesModal';

type Props = {
  categories: Category[];
  roleName: string | null;
};

export default function CustomerSections({ categories, roleName }: Props) {
  const [showModal, setShowModal] = useState(false);
  // Nota: ahora guarda subcategory_id(s)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // El modal ya hace el save en Supabase. Este callback solo sincroniza estado local.
  const handleAfterSave = async (values: {
    lookingForExpert: boolean;
    categoryId: string; // categoría elegida
    selectedCategories: string[]; // subcategory_id (single select)
    projectId: string; // proyecto al que cuelga la oferta
    description: string;
  }) => {
    setSelectedCategories(values.selectedCategories);
    setShowModal(false);
  };

  return (
    <>
      <CustomerBasicInfo roleName={roleName} />

      <div className="pt-4 space-y-3">
        <FormCheckbox
          name="accepted_terms_conditions"
          label={
            <>
              I accept the{' '}
              <a
                href="/terms"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                terms and conditions
              </a>
            </>
          }
        />
        <FormCheckbox
          name="accepted_privacy_policy"
          label={
            <>
              I agree to the{' '}
              <a
                href="/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                privacy policy
              </a>
            </>
          }
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Categories</h3>

        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="text-[#67ff94] hover:text-[#8effd2] underline text-sm"
        >
          {selectedCategories.length > 0
            ? 'Edit your categories selection'
            : 'Are you looking for an expert? Click here'}
        </button>

        {selectedCategories.length > 0 && (
          <div className="bg-white/10 p-4 rounded-lg">
            <p className="text-white mb-1">
              {selectedCategories.length === 1
                ? '1 subcategory selected'
                : `${selectedCategories.length} subcategories selected`}
            </p>
            <p className="text-xs text-white/70">
              (Selection stored as subcategory IDs)
            </p>
          </div>
        )}
      </div>

      <CustomerCategoryModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        categories={categories}
        initialValues={{
          lookingForExpert: selectedCategories.length > 0,
          categoryId: '', // inicial: sin categoría seleccionada
          projectId: '', // inicial: sin proyecto seleccionado
          selectedCategories, // mantiene lo ya elegido
          description: '',
        }}
        onSubmit={handleAfterSave}
      />
    </>
  );
}
