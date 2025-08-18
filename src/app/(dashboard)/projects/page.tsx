'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/browserClient';
import Button from '@/components/atoms/Button';
import ProjectForm from '@/components/organisms/projects/ProjectForm';
import ProjectList from '@/components/organisms/projects/ProjectList';
import { showError } from '@/utils/toastService';
import { Database } from '@/types/supabase';

type Project = Database['public']['Tables']['it_projects']['Row'];

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // 🔐 Obtener user y rol desde Supabase
  useEffect(() => {
    const fetchUserAndRole = async () => {
      try {
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();
        if (authError || !user) {
          showError('Not authenticated');
          return;
        }

        setUserId(user.id);

        const { data: profile, error: profileError } = await supabase
          .from('users')
          .select('role_id, user_role:role_id(name)')
          .eq('id', user.id)
          .single();

        if (profileError) throw profileError;

        setUserRole(profile?.user_role?.name?.toLowerCase() ?? null);
      } catch (err) {
        console.error('❌ Error fetching user role:', err);
        showError('Error fetching user role');
      }
    };

    fetchUserAndRole();
  }, []);

  // 📦 Obtener proyectos según rol
  useEffect(() => {
    const fetchProjects = async () => {
      if (!userId || !userRole) return;

      let query = supabase.from('it_projects').select('*');

      if (userRole === 'customer') {
        // buscar customer_id real desde tabla customers
        const { data: customer } = await supabase
          .from('customers')
          .select('id')
          .eq('user_id', userId)
          .single();

        if (customer) {
          query = query.eq('customer_id', customer.id);
        }
      }

      if (userRole === 'expert') {
        // TODO: join con contracted_solutions para filtrar solo asignados
      }

      const { data, error } = await query;
      if (error) {
        console.error('❌ Error fetching projects:', error);
        return;
      }
      setProjects((data as Project[]) || []);
    };

    fetchProjects();
  }, [userId, userRole]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Projects</h1>
        {userRole === 'customer' && (
          <Button onClick={() => setShowForm(true)}>New Project</Button>
        )}
      </div>

      {showForm ? (
        <ProjectForm onClose={() => setShowForm(false)} />
      ) : (
        <ProjectList projects={projects} />
      )}
    </div>
  );
}
