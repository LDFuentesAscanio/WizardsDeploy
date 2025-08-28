'use client';

import DashboardGuard from '@/components/guards/DashboardGuard';
import CustomerDashboardView from '@/components/views/CustomerDashboardView';
import DashboardView from '@/components/views/DashboardView';
import { useDashboardUser } from '@/hooks/useDashboardUser';
import Loader from '@/components/atoms/Loader';

export default function DashboardPage() {
  const { userData, loading } = useDashboardUser();

  if (loading) return <Loader />;

  if (!userData) return null;

  const role = userData.role_name.toLowerCase();

  return (
    <DashboardGuard>
      {role === 'customer' ? <CustomerDashboardView /> : <DashboardView />}
    </DashboardGuard>
  );
}
