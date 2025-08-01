'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/browserClient';
import { showError, showSuccess } from '@/utils/toastService';
import UserCard from '../organisms/dashboard/UserCard';
import {
  CustomerDashboardData,
  SupabaseContractedSolution,
} from '../organisms/dashboard/types';
import CustomerSolutionModal from '../organisms/dashboard/CustomerSolutionsModal';
import { saveCustomerSolutions } from '@/utils/saveSolutions';
import { Solution } from '../organisms/ProfileForm/types';
import { ConfirmDialog } from '../organisms/dashboard/ConfirmDialog';

export default function CustomerDashboardView() {
  const [data, setData] = useState<CustomerDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [solutionToDelete, setSolutionToDelete] = useState<string | null>(null);
  const [availableSolutions, setAvailableSolutions] = useState<Solution[]>([]);
  const [contractedSolutions, setContractedSolutions] = useState<
    SupabaseContractedSolution[]
  >([]);

  useEffect(() => {
    async function fetchAllData() {
      try {
        const { data: authUser, error: authError } =
          await supabase.auth.getUser();
        if (authError) throw authError;

        const user_id = authUser.user?.id;
        if (!user_id) throw new Error('No user authenticated');

        const { data: customerData, error: customerError } = await supabase
          .from('customers')
          .select('id, company_name')
          .eq('user_id', user_id)
          .single();

        if (customerError || !customerData) throw customerError;
        const customer_id = customerData.id;

        const [
          { data: user },
          { data: about },
          { data: avatarMedia },
          { data: companyLogoMedia },
          { data: allSolutions },
        ] = await Promise.all([
          supabase
            .from('users')
            .select('first_name, last_name, linkedin_profile, other_link')
            .eq('id', user_id)
            .single(),

          supabase
            .from('about')
            .select('bio')
            .eq('user_id', user_id)
            .maybeSingle(),

          supabase
            .from('user_media')
            .select('url_storage')
            .eq('user_id', user_id)
            .eq('type', 'avatar')
            .maybeSingle(),

          supabase
            .from('user_media')
            .select('url_storage')
            .eq('user_id', user_id)
            .eq('type', 'company_logo')
            .maybeSingle(),

          supabase.from('solutions').select('id, name'),
        ]);

        setAvailableSolutions(allSolutions || []);

        const { data: contractedRaw } = await supabase
          .from('contracted_solutions')
          .select(
            'id, solution_id, description_solution, solutions:solution_id (name)'
          )
          .eq('customer_id', customer_id)
          .eq('is_active', true);

        setContractedSolutions(contractedRaw || []);

        const solutionNames =
          contractedRaw
            ?.map((item) => item.solutions?.name)
            .filter((name): name is string => !!name) || [];

        setData({
          first_name: user?.first_name || '',
          last_name: user?.last_name || '',
          linkedin_profile: user?.linkedin_profile || null,
          other_link: user?.other_link || null,
          company_name: customerData.company_name || '',
          bio: about?.bio || '',
          avatar: avatarMedia?.url_storage || null,
          company_logo: companyLogoMedia?.url_storage || null,
          solutions: solutionNames,
        });
      } catch (error) {
        console.error('Error loading data:', error);
        showError('Dashboard Error', {
          description: 'Could not load dashboard data',
        });
      } finally {
        setLoading(false);
      }
    }

    fetchAllData();
  }, []);

  const confirmDelete = (solutionId: string) => {
    setSolutionToDelete(solutionId);
    setConfirmOpen(true);
  };

  const handleDeleteConfirmed = async () => {
    if (!solutionToDelete) return;

    try {
      const { data: authUser } = await supabase.auth.getUser();
      const user_id = authUser.user?.id;
      if (!user_id) throw new Error('No user authenticated');

      const { data: customerData } = await supabase
        .from('customers')
        .select('id')
        .eq('user_id', user_id)
        .single();

      if (!customerData) throw new Error('Customer not found');

      const { error: deleteError } = await supabase
        .from('contracted_solutions')
        .update({ is_active: false, updated_at: new Date().toISOString() })
        .eq('id', solutionToDelete);

      if (deleteError) throw deleteError;

      if (deleteError) throw deleteError;

      const { data: refreshedSolutions } = await supabase
        .from('contracted_solutions')
        .select(
          'id, solution_id, description_solution, solutions:solution_id (name)'
        )
        .eq('customer_id', customerData.id)
        .eq('is_active', true);

      setContractedSolutions(refreshedSolutions || []);

      const solutionNames =
        refreshedSolutions
          ?.map((item) => item.solutions?.name)
          .filter((name): name is string => !!name) || [];

      setData((prev) => ({
        ...prev!,
        solutions: solutionNames,
      }));

      showSuccess('Solution removed successfully');
    } catch (error) {
      console.error('Error deleting solution:', error);
      showError('Failed to remove solution');
    } finally {
      setConfirmOpen(false);
      setSolutionToDelete(null);
    }
  };

  const handleModalSubmit = async (values: {
    selectedSolutions: string[];
    description: string;
  }) => {
    try {
      const { data: authUser } = await supabase.auth.getUser();
      const user_id = authUser.user?.id;
      if (!user_id) throw new Error('User not authenticated');

      const customer_id = await saveCustomerSolutions({
        user_id,
        selectedSolutions: values.selectedSolutions,
        description: values.description,
      });

      const { data: refreshedSolutions } = await supabase
        .from('contracted_solutions')
        .select(
          'id, solution_id, description_solution, solutions:solution_id (name)'
        )
        .eq('customer_id', customer_id)
        .eq('is_active', true);

      setContractedSolutions(refreshedSolutions || []);

      const solutionNames =
        refreshedSolutions
          ?.map((item) => item.solutions?.name)
          .filter((name): name is string => !!name) || [];

      setData((prev) => ({
        ...prev!,
        solutions: solutionNames,
      }));

      setShowModal(false);
      showSuccess('Solutions updated successfully');
    } catch (error) {
      console.error('Error updating solutions:', error);
      showError('Failed to update solutions');
    }
  };

  if (loading) return <p>Loading dashboard...</p>;
  if (!data) return <p>No data available.</p>;

  return (
    <section className="w-full max-w-6xl mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Columna izquierda */}
        <div className="w-full md:w-1/3">
          <UserCard
            firstName={data.first_name}
            lastName={data.last_name}
            avatarUrl={data.avatar ?? '/icons/avatar.svg'}
            linkedin={data.linkedin_profile}
            otherLink={data.other_link}
          />
        </div>

        {/* Columna derecha */}
        <div className="w-full md:w-2/3 space-y-6">
          {/* About the company */}
          <div className="bg-white/10 backdrop-blur rounded-xl p-6 shadow">
            <h2 className="text-xl font-semibold mb-2">About the Company</h2>
            <div className="flex gap-4 items-start">
              {data.company_logo && (
                <div className="relative w-20 h-20 rounded-lg overflow-hidden">
                  <Image
                    src={data.company_logo}
                    alt="Company Logo"
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>
              )}
              <div>
                <h2 className="text-xl font-semibold">{data.company_name}</h2>
                <p className="text-[#e7e7e7]">{data.bio}</p>
              </div>
            </div>
          </div>

          {/* Solutions Needed */}
          <div className="bg-white/10 backdrop-blur rounded-xl p-6 shadow">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-semibold">Solutions Needed</h2>
              <button
                onClick={() => setShowModal(true)}
                className="text-sm text-[#67ff94] hover:underline"
              >
                Add Solutions
              </button>
            </div>

            {data.solutions.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {contractedSolutions.map((item) => (
                  <div
                    key={item.id}
                    className="bg-[#67ff94] text-[#2c3d5a] p-4 rounded-xl shadow flex flex-col gap-2"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-md">
                          {item.solutions?.name || 'Unnamed Solution'}
                        </h3>
                        {item.description_solution && (
                          <p className="text-sm text-[#1d2c45] mt-1">
                            {item.description_solution}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => confirmDelete(item.id)}
                        className="text-[#2c3d5a] hover:text-red-500"
                        aria-label="Remove solution"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400">No solutions selected.</p>
            )}
          </div>
        </div>
      </div>

      <CustomerSolutionModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        solutions={availableSolutions}
        initialValues={{
          lookingForExpert: data.solutions.length > 0,
          selectedSolutions: contractedSolutions
            .map((item) => item.solution_id)
            .filter((id): id is string => !!id),
          description: '',
        }}
        onSubmit={handleModalSubmit}
      />

      <ConfirmDialog
        isOpen={confirmOpen}
        title="Remove Solution"
        description="Are you sure you want to remove this solution?"
        onConfirm={handleDeleteConfirmed}
        onCancel={() => setConfirmOpen(false)}
      />
    </section>
  );
}
