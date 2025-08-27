'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/utils/supabase/browserClient';
import { showError, showSuccess } from '@/utils/toastService';
import UserCard from '../organisms/dashboard/UserCard';
import {
  CustomerDashboardData,
  FrontendContractedCategory,
} from '../organisms/dashboard/types';

import { saveCustomerCategories } from '@/utils/saveCategories';
import { Category } from '../organisms/ProfileForm/types';
import { ConfirmDialog } from '../organisms/dashboard/ConfirmDialog';
import CustomerCategoryModal from '../organisms/dashboard/CustomerCategoriesModal';

type ProjectIdRow = { id: string };

type ContractedRow = {
  id: string;
  subcategory_id: string | null;
  it_projects_id: string | null;
  description_solution: string | null;
  is_active: boolean | null;
  contract_date: string | null;
  subcategories: {
    name: string | null;
    category_id: string | null;
    categories: { name: string | null } | null;
  } | null;
  it_projects: { project_name: string | null } | null; // ⬅️ NUEVO
};

type FrontendContractedCategoryWithProject = FrontendContractedCategory & {
  project_name?: string | null;
};

export default function CustomerDashboardView() {
  const [data, setData] = useState<CustomerDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const [availableCategories, setAvailableCategories] = useState<Category[]>(
    []
  );
  const [contractedCategories, setContractedCategories] = useState<
    FrontendContractedCategoryWithProject[]
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
          .select('id, company_name, job_title, description')
          .eq('user_id', user_id)
          .single();

        if (customerError || !customerData) throw customerError;
        const customer_id = customerData.id;

        const { data: projects, error: projectsErr } = await supabase
          .from('it_projects')
          .select('id')
          .eq('customer_id', customer_id);
        if (projectsErr) throw projectsErr;

        const projectIds =
          (projects as ProjectIdRow[] | null)?.map((p) => p.id) ?? [];

        const [
          { data: user },
          { data: avatarMedia },
          { data: companyLogoMedia },
          { data: allCategories },
          contractedPromiseResult,
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
          supabase.from('categories').select('id, name'),
          projectIds.length
            ? supabase
                .from('contracted_solutions')
                .select(
                  `
                  id,
                  subcategory_id,
                  it_projects_id,
                  description_solution,
                  is_active,
                  contract_date,
                  subcategories:subcategory_id (
                    name,
                    category_id,
                    categories:category_id (name)
                  ), 
                  it_projects:it_projects_id ( project_name )
                `
                )
                .in('it_projects_id', projectIds)
                .eq('is_active', true)
            : Promise.resolve({ data: [], error: null }),
        ]);

        setAvailableCategories((allCategories as Category[]) || []);

        const contractedRaw = (
          contractedPromiseResult as {
            data: ContractedRow[] | null;
            error: unknown;
          }
        ).data;

        const formattedCategories: FrontendContractedCategory[] = (
          contractedRaw ?? []
        ).map((row) => ({
          id: row.id,
          subcategory_id: row.subcategory_id ?? '',
          it_projects_id: row.it_projects_id ?? null,
          description_solution: row.description_solution,
          is_active: row.is_active ?? false,
          contract_date: row.contract_date,
          categories: row.subcategories?.categories
            ? { name: row.subcategories.categories.name ?? '' }
            : null,
          project_name: row.it_projects?.project_name ?? null,
        }));

        setContractedCategories(formattedCategories);

        const categoryNames = formattedCategories
          .map((item) => item.categories?.name)
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
          categories: categoryNames,
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

  const confirmDelete = (categoryId: string) => {
    setCategoryToDelete(categoryId);
    setConfirmOpen(true);
  };

  const handleDeleteConfirmed = async () => {
    if (!categoryToDelete) return;

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
        .eq('id', categoryToDelete);
      if (deleteError) throw deleteError;

      const { data: projects } = await supabase
        .from('it_projects')
        .select('id')
        .eq('customer_id', customerData.id);

      const projectIds =
        (projects as ProjectIdRow[] | null)?.map((p) => p.id) ?? [];

      const { data: refreshed } = projectIds.length
        ? await supabase
            .from('contracted_solutions')
            .select(
              `
              id,
              subcategory_id,
              it_projects_id,
              description_solution,
              is_active,
              contract_date,
              subcategories:subcategory_id (
                name,
                category_id,
                categories:category_id (name)
              ), 
              it_projects:it_projects_id ( project_name )
            `
            )
            .in('it_projects_id', projectIds)
            .eq('is_active', true)
        : { data: [] as ContractedRow[] };

      const formattedCategories: FrontendContractedCategory[] = (
        refreshed as ContractedRow[]
      ).map((row) => ({
        id: row.id,
        subcategory_id: row.subcategory_id ?? '',
        it_projects_id: row.it_projects_id ?? null,
        description_solution: row.description_solution,
        is_active: row.is_active ?? false,
        contract_date: row.contract_date,
        categories: row.subcategories?.categories
          ? { name: row.subcategories.categories.name ?? '' }
          : null,
        project_name: row.it_projects?.project_name ?? null,
      }));

      setContractedCategories(formattedCategories);

      const categoryNames = formattedCategories
        .map((item) => item.categories?.name)
        .filter((name): name is string => !!name);

      setData((prev) => ({
        ...prev!,
        categories: categoryNames,
      }));

      showSuccess('Offer removed successfully');
    } catch (error) {
      console.error('Error deleting category:', error);
      showError('Failed to remove offer');
    } finally {
      setConfirmOpen(false);
      setCategoryToDelete(null);
    }
  };

  const handleModalSubmit = async (values: {
    selectedCategories: string[];
    description: string;
    projectId: string;
  }) => {
    try {
      const { data: authUser } = await supabase.auth.getUser();
      const user_id = authUser.user?.id;
      if (!user_id) throw new Error('User not authenticated');

      const customer_id = await saveCustomerCategories({
        user_id,
        projectId: values.projectId,
        selectedCategories: values.selectedCategories,
        description: values.description,
      });

      const { data: projects } = await supabase
        .from('it_projects')
        .select('id')
        .eq('customer_id', customer_id);

      const projectIds =
        (projects as ProjectIdRow[] | null)?.map((p) => p.id) ?? [];

      const { data: refreshed } = projectIds.length
        ? await supabase
            .from('contracted_solutions')
            .select(
              `
              id,
              subcategory_id,
              it_projects_id,
              description_solution,
              is_active,
              contract_date,
              subcategories:subcategory_id (
                name,
                category_id,
                categories:category_id (name)
              ), 
              it_projects:it_projects_id ( project_name )
            `
            )
            .in('it_projects_id', projectIds)
            .eq('is_active', true)
        : { data: [] as ContractedRow[] };

      const formattedCategories: FrontendContractedCategory[] = (
        refreshed as ContractedRow[]
      ).map((row) => ({
        id: row.id,
        subcategory_id: row.subcategory_id ?? '',
        it_projects_id: row.it_projects_id ?? null,
        description_solution: row.description_solution,
        is_active: row.is_active ?? false,
        contract_date: row.contract_date,
        categories: row.subcategories?.categories
          ? { name: row.subcategories.categories.name ?? '' }
          : null,
        project_name: row.it_projects?.project_name ?? null,
      }));

      setContractedCategories(formattedCategories);

      const categoryNames = formattedCategories
        .map((item) => item.categories?.name)
        .filter((name): name is string => !!name);

      setData((prev) => ({
        ...prev!,
        categories: categoryNames,
      }));

      setShowModal(false);
      showSuccess('Offer created successfully');
    } catch (error) {
      console.error('Error updating categories:', error);
      showError('Failed to create offer');
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

        <div className="col-span-2 space-y-6">
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

          {/* Sección expertos/ofertas */}
          <div className="bg-white/10 backdrop-blur rounded-xl p-6 shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Experts Required</h2>
              <button
                onClick={() => setShowModal(true)}
                className="text-sm text-[#67ff94] hover:underline"
              >
                Create Offer
              </button>
            </div>

            {data.categories.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {contractedCategories.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-[#67ff94] text-[#1d2c45] p-4 rounded-xl shadow flex flex-col gap-2"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-md">
                          {item.categories?.name || 'Unnamed Category'}
                        </h3>
                        {item.project_name && (
                          <p className="text-xs text-[#1d2c45] mt-0.5">
                            Project: {item.project_name}
                          </p>
                        )}
                        {item.description_solution && (
                          <p className="text-sm text-[#1d2c45] mt-1">
                            {item.description_solution}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => confirmDelete(item.id)}
                        className="text-[#2c3d5a] hover:text-red-500"
                        aria-label="Remove offer"
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
              <p className="text-sm text-white/70">No experts requested yet.</p>
            )}
          </div>
        </div>
      </motion.div>

      <CustomerCategoryModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        categories={availableCategories}
        initialValues={{
          lookingForExpert: false,
          categoryId: '',
          selectedCategories: [],
          projectId: '',
          description: '',
        }}
        onSubmit={handleModalSubmit}
      />

      <ConfirmDialog
        isOpen={confirmOpen}
        title="Remove Offer"
        description="Are you sure you want to remove this offer?"
        onConfirm={handleDeleteConfirmed}
        onCancel={() => setConfirmOpen(false)}
      />
    </main>
  );
}
