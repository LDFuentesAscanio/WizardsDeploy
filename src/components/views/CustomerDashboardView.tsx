'use client';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/client';
import { showError } from '@/utils/toastService';
import UserCard from '../organisms/dashboard/UserCard';
import {
  ContractedSolution,
  UserRow,
  AboutRow,
  CustomerDashboardData,
} from '../organisms/dashboard/types';

export default function CustomerDashboardView() {
  const [data, setData] = useState<CustomerDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCustomerData() {
      try {
        const { data: authUser } = await supabase.auth.getUser();
        const user_id = authUser.user?.id;
        if (!user_id) throw new Error('No user authenticated');

        // 1. User basic info
        const { data: user, error: userError } = await supabase
          .from('users')
          .select('first_name, last_name, linkedin_profile, other_link')
          .eq('id', user_id)
          .single<UserRow>();

        if (userError || !user) throw new Error('User data not found');

        // 2. About (bio)
        const { data: about } = await supabase
          .from('about')
          .select('bio')
          .eq('user_id', user_id)
          .maybeSingle<AboutRow>();

        // 3. Company logo
        const { data: media } = await supabase
          .from('user_media')
          .select('url_storage')
          .eq('user_id', user_id)
          .maybeSingle();

        // 4. Contracted solutions
        const { data: contracted } = await supabase
          .from('contracted_solutions')
          .select('solution_id, solutions:solution_id (name)')
          .eq('customer_id', user_id);

        // Procesar soluciones de forma segura
        const solutionsList =
          (contracted as ContractedSolution[] | null)?.flatMap(
            (item) => item.solutions?.map((solution) => solution.name) || []
          ) || [];

        setData({
          first_name: user.first_name || '',
          last_name: user.last_name || '',
          linkedin_profile: user.linkedin_profile,
          other_link: user.other_link,
          bio: about?.bio || '',
          company_logo: media?.url_storage,
          solutions: solutionsList,
        });
      } catch (error) {
        showError('Dashboard Error', 'Could not load dashboard data');
        console.error('Customer dashboard error:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchCustomerData();
  }, []);

  if (loading) return <p>Loading dashboard...</p>;
  if (!data) return <p>No data available.</p>;

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
                key={idx}
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
    </section>
  );
}
