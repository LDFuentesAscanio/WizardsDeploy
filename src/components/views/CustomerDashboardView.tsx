'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/utils/supabase/browserClient';
import { showError, showSuccess } from '@/utils/toastService';
import UserCard from '../organisms/dashboard/UserCard';
import {
  CustomerDashboardData,
  FrontendContractedSolution,
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
    FrontendContractedSolution[]
  >([]);

  useEffect(() => {
    async function fetchAllData() {
      try {
        const { data: authUser, error: authError } =
          await supabase.auth.getUser();
        if (authError) throw authError;

        const user_id = authUser.user?.id;
        if (!user_id) throw new Error('No user authenticated');

        // Obtener datos del customer
        const { data: customerData, error: customerError } = await supabase
          .from('customers')
          .select('id, company_name, job_title, description')
          .eq('user_id', user_id)
          .single();

        if (customerError || !customerData) throw customerError;
        const customer_id = customerData.id;

        const [
          { data: user },
          { data: avatarMedia },
          { data: companyLogoMedia },
          { data: allSolutions },
          { data: contractedRaw },
        ] = await Promise.all([
          supabase
            .from('users')
            .select('first_name, last_name, linkedin_profile, other_link')
            .eq('id', user_id)
            .single(),

          supabase
            .from('customer_media')
            .select('url_storage')
            .eq('customer_id', customer_id)
            .eq('type', 'avatar')
            .maybeSingle(),

          supabase
            .from('customer_media')
            .select('url_storage')
            .eq('customer_id', customer_id)
            .eq('type', 'company_logo')
            .maybeSingle(),

          supabase.from('solutions').select('id, name'),

          supabase
            .from('contracted_solutions')
            .select(
              `
              id, 
              solution_id, 
              customer_id,
              description_solution,
              is_active,
              contract_date,
              solutions:solution_id (name)
            `
            )
            .eq('customer_id', customer_id)
            .eq('is_active', true),
        ]);

        setAvailableSolutions(allSolutions || []);

        // Mapear los datos para que coincidan con nuestro tipo
        const formattedSolutions: FrontendContractedSolution[] =
          contractedRaw?.map((item) => ({
            id: item.id,
            solution_id: item.solution_id,
            customer_id: item.customer_id,
            description_solution: item.description_solution,
            is_active: item.is_active ?? false,
            contract_date: item.contract_date,
            solutions: item.solutions,
          })) || [];

        setContractedSolutions(formattedSolutions);

        const solutionNames = formattedSolutions
          .map((item) => item.solutions?.name)
          .filter((name): name is string => !!name);

        setData({
          first_name: user?.first_name || '',
          last_name: user?.last_name || '',
          linkedin_profile: user?.linkedin_profile || null,
          other_link: user?.other_link || null,
          company_name: customerData.company_name || '',
          job_title: customerData.job_title || '',
          description: customerData.description || '',
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
        .eq('id', solutionToDelete)
        .select();

      if (deleteError) throw deleteError;

      const { data: refreshedSolutions } = await supabase
        .from('contracted_solutions')
        .select(
          `
          id, 
          solution_id, 
          customer_id,
          description_solution,
          is_active,
          contract_date,
          solutions:solution_id (name)
        `
        )
        .eq('customer_id', customerData.id)
        .eq('is_active', true);

      const formattedSolutions: FrontendContractedSolution[] =
        refreshedSolutions?.map((item) => ({
          id: item.id,
          solution_id: item.solution_id,
          customer_id: item.customer_id,
          description_solution: item.description_solution,
          is_active: item.is_active ?? false,
          contract_date: item.contract_date,
          solutions: item.solutions,
        })) || [];

      setContractedSolutions(formattedSolutions);

      const solutionNames = formattedSolutions
        .map((item) => item.solutions?.name)
        .filter((name): name is string => !!name);

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
          `
          id, 
          solution_id, 
          customer_id,
          description_solution,
          is_active,
          contract_date,
          solutions:solution_id (name)
        `
        )
        .eq('customer_id', customer_id)
        .eq('is_active', true);

      const formattedSolutions: FrontendContractedSolution[] =
        refreshedSolutions?.map((item) => ({
          id: item.id,
          solution_id: item.solution_id,
          customer_id: item.customer_id,
          description_solution: item.description_solution,
          is_active: item.is_active ?? false,
          contract_date: item.contract_date,
          solutions: item.solutions,
        })) || [];

      setContractedSolutions(formattedSolutions);

      const solutionNames = formattedSolutions
        .map((item) => item.solutions?.name)
        .filter((name): name is string => !!name);

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
    <main className="min-h-screen bg-[#2c3d5a] text-white">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full px-6 py-8 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        {/* Columna izquierda */}
        <div className="space-y-6">
          <UserCard
            firstName={data.first_name}
            lastName={data.last_name}
            profession={data.job_title}
            avatarUrl={data.avatar ?? '/icons/avatar.svg'}
            linkedin={data.linkedin_profile}
            otherLink={data.other_link}
          />
        </div>

        {/* Columna derecha */}
        <div className="col-span-2 space-y-6">
          {/* Sección empresa */}
          <div className="bg-white/10 backdrop-blur rounded-xl p-6 shadow">
            <h2 className="text-xl font-semibold mb-4">About the Company</h2>
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
              <div className="flex flex-col gap-1">
                <h3 className="text-lg font-bold">{data.company_name}</h3>
                <p className="text-sm text-white/70">{data.description}</p>
              </div>
            </div>
          </div>

          {/* Sección soluciones */}
          <div className="bg-white/10 backdrop-blur rounded-xl p-6 shadow">
            <div className="flex justify-between items-center mb-4">
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
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
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
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-white/70">No solutions selected.</p>
            )}
          </div>
        </div>
      </motion.div>

      {/* Modales */}
      <CustomerSolutionModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        solutions={availableSolutions}
        initialValues={{
          lookingForExpert: false,
          selectedSolutions: [],
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
    </main>
  );
}
