'use client';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/browserClient';
import { showError } from '@/utils/toastService';
import UserCard from '../organisms/dashboard/UserCard';
import {
  UserRow,
  AboutRow,
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
    console.log('🔵 [1] Iniciando carga de datos del dashboard');
    async function fetchAllData() {
      try {
        console.log('🔵 [2] Obteniendo usuario autenticado');
        const { data: authUser, error: authError } =
          await supabase.auth.getUser();
        if (authError) throw authError;

        const user_id = authUser.user?.id;
        if (!user_id) throw new Error('No user authenticated');
        console.log('🟢 [3] Usuario ID obtenido:', user_id);

        console.log('🔵 [4] Iniciando consultas paralelas');
        const [
          { data: user, error: userError },
          { data: about, error: aboutError },
          { data: media, error: mediaError },
          { data: contracted, error: contractedError },
          { data: allSolutions, error: solutionsError },
        ] = await Promise.all([
          supabase
            .from('users')
            .select('first_name, last_name, linkedin_profile, other_link')
            .eq('id', user_id)
            .single<UserRow>(),

          supabase
            .from('about')
            .select('bio')
            .eq('user_id', user_id)
            .maybeSingle<AboutRow>(),

          supabase
            .from('user_media')
            .select('url_storage')
            .eq('user_id', user_id)
            .maybeSingle(),

          supabase
            .from('contracted_solutions')
            .select('solution_id, solutions:solution_id (name)')
            .eq('customer_id', user_id),

          supabase.from('solutions').select('id, name'),
        ]);

        console.log('📊 [5] Resultados de consultas:', {
          user,
          about,
          media,
          contracted,
          allSolutions,
        });

        if (userError) throw userError;
        if (aboutError) throw aboutError;
        if (mediaError) throw mediaError;
        if (contractedError) throw contractedError;
        if (solutionsError) throw solutionsError;

        const solutionsList =
          ((contracted as SupabaseContractedSolution[] | null)
            ?.filter((item) => {
              console.log('🔍 [6] Procesando item contracted_solutions:', item);
              return item.solutions !== null;
            })
            .map((item) => {
              console.log('📌 [7] Mapeando solución:', item.solutions?.name);
              return item.solutions?.name;
            })
            .filter(Boolean) as string[]) || [];

        console.log('📋 [8] Lista final de soluciones:', solutionsList);

        setAvailableSolutions(allSolutions || []);
        console.log('🛒 [9] Soluciones disponibles:', allSolutions);

        const dashboardData = {
          first_name: user?.first_name || '',
          last_name: user?.last_name || '',
          linkedin_profile: user?.linkedin_profile || null,
          other_link: user?.other_link || null,
          bio: about?.bio || '',
          company_logo: media?.url_storage || null,
          solutions: solutionsList,
        };

        console.log(
          '📦 [10] Datos completos para el dashboard:',
          dashboardData
        );
        setData(dashboardData);
      } catch (error) {
        console.error('❌ [ERROR] Customer dashboard error:', error);
        showError('Dashboard Error', 'Could not load dashboard data');
      } finally {
        console.log('✅ [11] Carga de datos completada');
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
      console.log('🔄 [12] Iniciando envío de soluciones:', values);

      const { data: authUser, error: authError } =
        await supabase.auth.getUser();
      if (authError) throw authError;

      const user_id = authUser.user?.id;
      if (!user_id) throw new Error('No user authenticated');
      console.log('👤 [13] ID de usuario para guardar soluciones:', user_id);

      console.log('💾 [14] Guardando soluciones en Supabase...');
      const customer_id = await saveCustomerSolutions({
        user_id,
        selectedSolutions: values.selectedSolutions,
        description: values.description,
      });
      console.log('🆔 [15] ID de cliente recibido:', customer_id);

      console.log('🔍 [16] Refrescando soluciones contratadas...');
      const { data: refreshedSolutions, error: refreshedError } = await supabase
        .from('contracted_solutions')
        .select('solution_id, solutions:solution_id (name)')
        .eq('customer_id', customer_id);

      if (refreshedError) throw refreshedError;
      console.log('🔄 [17] Soluciones refrescadas:', refreshedSolutions);

      const solutionNames =
        ((refreshedSolutions as SupabaseContractedSolution[] | null)
          ?.filter((item) => {
            console.log('🔍 [18] Filtrando solución refrescada:', item);
            return item.solutions !== null;
          })
          .map((item) => {
            console.log(
              '📌 [19] Mapeando solución refrescada:',
              item.solutions?.name
            );
            return item.solutions?.name;
          })
          .filter(Boolean) as string[]) || [];

      console.log('📋 [20] Nueva lista de soluciones:', solutionNames);

      setData((prev) => {
        const newData = {
          ...prev!,
          solutions: solutionNames,
        };
        console.log('🆕 [21] Actualizando estado con nuevos datos:', newData);
        return newData;
      });

      setShowModal(false);
      console.log('✔️ [22] Modal cerrado después de guardar');
    } catch (error) {
      console.error('❌ [ERROR] Error updating solutions:', error);
      showError('Error updating solutions');
    }
  };

  if (loading) {
    console.log('⏳ [23] Renderizando estado de carga...');
    return <p>Loading dashboard...</p>;
  }

  if (!data) {
    console.log('🚫 [24] No hay datos disponibles');
    return <p>No data available.</p>;
  }

  console.log('🖥️ [25] Renderizando componente con datos:', data);

  return (
    <section className="w-full max-w-5xl mx-auto px-4 py-6 space-y-6">
      <UserCard
        firstName={data.first_name}
        lastName={data.last_name}
        avatarUrl="/icons/avatar.svg"
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
