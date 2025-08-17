'use client';

import { useState } from 'react';
import { Solution } from '../types';
import CustomerSolutionModal from '../../dashboard/CustomerSolutionsModal';
import { CustomerBasicInfo } from './CustomerBasicInfo';
import { saveCustomerSolutions } from '@/utils/saveSolutions';
import { supabase } from '@/utils/supabase/browserClient';
import { showError, showSuccess } from '@/utils/toastService';
import FormCheckbox from '@/components/atoms/FormCheckbox';

type Props = {
  solutions: Solution[];
  roleName: string | null; // ahora recibimos el role
};

export default function CustomerSections({ solutions, roleName }: Props) {
  const [showModal, setShowModal] = useState(false);
  const [selectedSolutions, setSelectedSolutions] = useState<string[]>([]);

  const handleSaveSolutions = async (modalValues: {
    selectedSolutions: string[];
    description: string;
    acceptedTerms: boolean;
    acceptedPrivacy: boolean;
  }) => {
    try {
      const { data: authUser } = await supabase.auth.getUser();
      const user_id = authUser.user?.id;
      if (!user_id) throw new Error('No user authenticated');

      await saveCustomerSolutions({
        user_id,
        selectedSolutions: modalValues.selectedSolutions,
        description: modalValues.description,
      });

      setSelectedSolutions(modalValues.selectedSolutions);
      setShowModal(false);
      showSuccess('Solutions saved!');
    } catch (error) {
      console.error('Error saving solutions:', error);
      showError('Error saving solutions');
    }
  };

  return (
    <>
      {/* Pasamos roleName al CustomerBasicInfo */}
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
        <h3 className="text-lg font-semibold text-white">Solutions</h3>

        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="text-[#67ff94] hover:text-[#8effd2] underline text-sm"
        >
          {selectedSolutions.length > 0
            ? 'Edit your solutions selection'
            : 'Are you looking for an expert? Click here'}
        </button>

        {selectedSolutions.length > 0 && (
          <div className="bg-white/10 p-4 rounded-lg">
            <p className="text-white mb-2">You have selected:</p>
            <ul className="space-y-1">
              {selectedSolutions.map((id) => {
                const solution = solutions.find((s) => s.id === id);
                return (
                  solution && (
                    <li key={id} className="text-sm text-white">
                      • {solution.name}
                    </li>
                  )
                );
              })}
            </ul>
          </div>
        )}
      </div>

      <CustomerSolutionModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        solutions={solutions}
        initialValues={{
          lookingForExpert: selectedSolutions.length > 0,
          selectedSolutions,
          description: '',
        }}
        onSubmit={handleSaveSolutions}
      />
    </>
  );
}
