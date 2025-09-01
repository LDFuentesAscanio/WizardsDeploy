'use client';
//External libraries
import { useEffect, useState } from 'react';
//Validations, types and interfaces
import { DashboardData } from '../organisms/dashboard/types';
//Utilities
import { supabase } from '@/utils/supabase/browserClient';
import { fetchDashboardData } from '@/utils/fetchDashboardData';
//UI local components
import UserCard from '@/components/organisms/dashboard/UserCard';
import BioSection from '@/components/organisms/dashboard/BioSection';
import StatsSection from '@/components/organisms/dashboard/StatsSection';
import TasksOverview from '@/components/organisms/dashboard/TasksOverview';
import SkillsSection from '@/components/organisms/dashboard/SkillsSection';
import ProfileCompletionCard from '../organisms/dashboard/ProfileCompletionCard';
import ExperienceSection from '@/components/organisms/dashboard/ExperienceSection';
import Loader from '../atoms/Loader';

export default function DashboardView() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardData | null>(null);
  useEffect(() => {
    const loadData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const dashboardData = await fetchDashboardData(user.id);
      setData(dashboardData);
      setLoading(false);
    };

    loadData();
  }, []);

  if (loading || !data) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#2c3d5a] text-white">
        <Loader />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#2c3d5a] text-white">
      <div className="w-full px-6 py-8 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="col-span-1 space-y-6">
          <UserCard
            firstName={data.firstName}
            lastName={data.lastName}
            profession={data.profession}
            avatarUrl={data.avatarUrl}
            linkedin={data.linkedin}
            otherLink={data.otherLink}
          />
          <StatsSection
            stats={[
              { label: 'Projects', value: 0 }, // ❌ aún no disponible
              { label: 'Hirings', value: 0 },
              { label: 'Tasks', value: '0/0' },
            ]}
          />
        </div>

        <div className="col-span-2 space-y-6 w-full max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TasksOverview
              completed={0}
              total={0}
              tasks={[
                { label: 'Verify email', done: false },
                { label: 'Upload document', done: false },
              ]}
            />
            <ProfileCompletionCard
              completed={data.completion}
              missingFields={data.missingFields}
            />
          </div>
          <BioSection bio={data.bio} />
          <SkillsSection skills={data.skills} tools={data.tools} />
          <ExperienceSection experiences={data.experiences} />
        </div>
      </div>
    </main>
  );
}
