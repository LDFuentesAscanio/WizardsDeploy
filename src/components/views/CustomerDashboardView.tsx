'use client';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/browserClient';
import { showError } from '@/utils/toastService';
import UserCard from '../organisms/dashboard/UserCard';
import {
  CustomerDashboardData,
  SupabaseContractedSolution,
} from '../organisms/dashboard/types';
import { Solution } from '../organisms/ProfileForm/types';
import CustomerSolutionModal from '../organisms/dashboard/CustomerSolutionsModal';
import { saveCustomerSolutions } from '@/utils/saveSolutions';

export default function CustomerDashboardView() {
  const [data, setData] = useState<CustomerDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [availableSolutions, setAvailableSolutions] = useState<Solution[]>([]);

  useEffect(() => {
    async function fetchAllData() {
      try {
        const { data: authUser, error: authError } =
          await supabase.auth.getUser();
        if (authError) throw authError;

        const user_id = authUser.user?.id;
        if (!user_id) throw new Error('No user authenticated');

        // Buscar customer_id
        const { data: customerData, error: customerError } = await supabase
          .from('customers')
          .select('id')
          .eq('user_id', user_id)
          .single();

        if (customerError) throw customerError;
        if (!customerData) throw new Error('Customer no encontrado');
        const customer_id = customerData.id;

        // Consultas paralelas básicas
        const [
          { data: user, error: userError },
          { data: about, error: aboutError },
          { data: avatarMedia, error: avatarError },
          { data: companyLogoMedia, error: companyLogoError },
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
        ]);

        if (userError) throw userError;
        if (aboutError) throw aboutError;
        if (avatarError) throw avatarError;
        if (companyLogoError) throw companyLogoError;

        // Obtener contracted_solutions
        const { data: contractedRaw, error: contractedError } = await supabase
          .from('contracted_solutions')
          .select('solution_id')
          .eq('customer_id', customer_id);

        if (contractedError) throw contractedError;

        // Extraer IDs
        const solutionIds = contractedRaw?.map((c) => c.solution_id) || [];

        // Obtener nombres
        const { data: matchingSolutions, error: matchingError } = await supabase
          .from('solutions')
          .select('id, name')
          .in('id', solutionIds);

        if (matchingError) throw matchingError;

        const solutionNames = matchingSolutions?.map((s) => s.name) || [];

        // Obtener todas las soluciones (para mostrar en modal)
        const { data: allSolutions, error: solutionsError } = await supabase
          .from('solutions')
          .select('id, name');

        if (solutionsError) throw solutionsError;

        setAvailableSolutions(allSolutions || []);

        setData({
          first_name: user?.first_name || '',
          last_name: user?.last_name || '',
          linkedin_profile: user?.linkedin_profile || null,
          other_link: user?.other_link || null,
          bio: about?.bio || '',
          avatar: avatarMedia?.url_storage || null,
          company_logo: companyLogoMedia?.url_storage || null,
          solutions: solutionNames,
        });
      } catch (error) {
        console.error('❌ [ERROR] Error cargando datos:', error);
        showError('Dashboard Error', 'Could not load dashboard data');
      } finally {
        setLoading(false);
      }
    }

    fetchAllData();
  }, []);

  const handleModalSubmit = async (values: {
    selectedSolutions: string[];
    description: string;
  }) => {
    try {
      const { data: authUser, error: authError } =
        await supabase.auth.getUser();
      if (authError) throw authError;

      const user_id = authUser.user?.id;
      if (!user_id) throw new Error('No user authenticated');

      const customer_id = await saveCustomerSolutions({
        user_id,
        selectedSolutions: values.selectedSolutions,
        description: values.description,
      });

      const { data: refreshedSolutions, error: refreshedError } = await supabase
        .from('contracted_solutions')
        .select('solution_id, solutions:solution_id (name)')
        .eq('customer_id', customer_id);

      if (refreshedError) throw refreshedError;

      const solutionNames =
        ((refreshedSolutions as SupabaseContractedSolution[] | null)
          ?.filter((item) => {
            return item.solutions !== null;
          })
          .map((item) => {
            return item.solutions?.name;
          })
          .filter(Boolean) as string[]) || [];

      setData((prev) => {
        const newData = {
          ...prev!,
          solutions: solutionNames,
        };
        return newData;
      });

      setShowModal(false);
    } catch (error) {
      console.error('❌ [ERROR] Error updating solutions:', error);
      showError('Error updating solutions');
    }
  };

  if (loading) {
    return <p>Loading dashboard...</p>;
  }

  if (!data) {
    return <p>No data available.</p>;
  }

  return (
    <section className="w-full max-w-5xl mx-auto px-4 py-6 space-y-6">
      <UserCard
        firstName={data.first_name}
        lastName={data.last_name}
        avatarUrl={data.avatar ?? '/icons/avatar.svg'}
        linkedin={data.linkedin_profile}
        otherLink={data.other_link}
      />

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
          <p className="text-[#e7e7e7]">{data.bio}</p>
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur rounded-xl p-6 shadow">
        <h2 className="text-xl font-semibold mb-2">Solutions Needed</h2>
        {data.solutions.length > 0 ? (
          <ul className="flex flex-wrap gap-2">
            {data.solutions.map((name, idx) => (
              <li
                key={`${name}-${idx}`}
                className="bg-[#67ff94] text-[#2c3d5a] px-3 py-1 rounded-full text-sm font-medium"
              >
                {name}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-400">No solutions selected.</p>
        )}
      </div>

      <p
        onClick={() => setShowModal(true)}
        className="mt-4 text-sm underline text-white cursor-pointer hover:text-[#67ff94]"
      >
        Are you looking for an expert? Click here
      </p>

      <CustomerSolutionModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        solutions={availableSolutions}
        initialValues={{
          lookingForExpert: data.solutions.length > 0,
          selectedSolutions: availableSolutions
            .filter((s) => data.solutions.includes(s.name))
            .map((s) => s.id),
          description: '',
        }}
        onSubmit={handleModalSubmit}
      />
    </section>
  );
}
