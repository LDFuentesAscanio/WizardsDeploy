'use client';

import { useState } from 'react';
import { useFormikContext } from 'formik';
import { ProfileFormValues, Solution } from '../types';
import CustomerSolutionModal from '../../dashboard/CustomerSolutionsModal';
import { CustomerBasicInfo } from './CustomerBasicInfo';

type Props = {
  solutions: Solution[];
};

export default function CustomerSections({ solutions }: Props) {
  const { values } = useFormikContext<ProfileFormValues>();
  const [showModal, setShowModal] = useState(false);

  const selectedSolutions = values.selected_solutions || [];

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
          lookingForExpert: values.looking_for_expert || false,
          selectedSolutions,
          description: values.solution_description || '',
          acceptedTerms: values.accepted_terms_conditions || false,
          acceptedPrivacy: values.accepted_privacy_policy || false,
        }}
      />
    </>
  );
}
