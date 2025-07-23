'use client';

import DashboardGuard from '@/components/guards/DashboardGuard';
import CustomerDashboardView from '@/components/views/CustomerDashboardView';
import DashboardView from '@/components/views/DashboardView';
import Image from 'next/image';
import { useDashboardUser } from '@/hooks/useDashboardUser';

export default function DashboardPage() {
  const { userData, loading } = useDashboardUser();

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <Image
          src="/icons/carga.svg"
          alt="Loading"
          width={160}
          height={160}
          className="animate-pulse w-auto h-auto"
        />
      </div>
    );
  }

  if (!userData) return null;

  const role = userData.role_name.toLowerCase();

  return (
    <DashboardGuard>
      {role === 'customer' ? <CustomerDashboardView /> : <DashboardView />}
    </DashboardGuard>
  );
}
