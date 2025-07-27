'use client';

import { useState } from 'react';
import { Solution } from '../types';
import CustomerSolutionModal from '../../dashboard/CustomerSolutionsModal';
import { CustomerBasicInfo } from './CustomerBasicInfo';
import { saveCustomerSolutions } from '@/utils/saveSolutions';
import { supabase } from '@/utils/supabase/browserClient';
import { showError, showSuccess } from '@/utils/toastService';

type Props = {
  solutions: Solution[];
};

export default function CustomerSections({ solutions }: Props) {
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
      <CustomerBasicInfo />

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
          acceptedTerms: false,
          acceptedPrivacy: false,
        }}
        onSubmit={handleSaveSolutions}
      />
    </>
  );
}
