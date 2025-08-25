'use client';

import { useState } from 'react';
import { Category } from '../types';

import { CustomerBasicInfo } from './CustomerBasicInfo';
import { supabase } from '@/utils/supabase/browserClient';
import { showError, showSuccess } from '@/utils/toastService';
import FormCheckbox from '@/components/atoms/FormCheckbox';
import { saveCustomerCategories } from '@/utils/saveCategories';
import CustomerCategoryModal from '../../dashboard/CustomerCategoriesModal';

type Props = {
  categories: Category[];
  roleName: string | null;
};

export default function CustomerSections({ categories, roleName }: Props) {
  const [showModal, setShowModal] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const handleSaveCategories = async (values: {
    selectedCategories: string[];
    description: string;
    lookingForExpert: boolean;
  }) => {
    try {
      const { data: authUser } = await supabase.auth.getUser();
      const user_id = authUser.user?.id;
      if (!user_id) throw new Error('No user authenticated');

      await saveCustomerCategories({
        user_id,
        selectedCategories: values.selectedCategories,
        description: values.description,
      });

      setSelectedCategories(values.selectedCategories);
      setShowModal(false);
      showSuccess('Categories saved successfully!');
    } catch (error) {
      console.error('Error saving categories:', error);
      showError('Error saving categories');
    }
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
            <p className="text-white mb-2">You have selected:</p>
            <ul className="space-y-1">
              {selectedCategories.map((id) => {
                const category = categories.find((c) => c.id === id);
                return (
                  category && (
                    <li key={id} className="text-sm text-white">
                      • {category.name}
                    </li>
                  )
                );
              })}
            </ul>
          </div>
        )}
      </div>

      <CustomerCategoryModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        categories={categories}
        initialValues={{
          lookingForExpert: selectedCategories.length > 0,
          selectedCategories,
          description: '',
        }}
        onSubmit={handleSaveCategories}
      />
    </>
  );
}
