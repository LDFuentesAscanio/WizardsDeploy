// app/projects/page.tsx
'use client';

import { useCallback, useEffect, useState } from 'react';
import Button from '@/components/atoms/Button';
import ProjectForm from '@/components/organisms/projects/ProjectForm';
import ProjectList from '@/components/organisms/projects/ProjectList';
import ProjectEditModal from '@/components/organisms/projects/ProjectEditModal';
import ExpertEmptyState from '@/components/organisms/projects/ExpertEmptyState';
import { showError } from '@/utils/toastService';

import {
  getUserAndRole,
  fetchProjectsByRole,
  type Project,
} from '@/utils/projectsService';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [selected, setSelected] = useState<Project | null>(null);

  // Obtener user + role
  useEffect(() => {
    (async () => {
      try {
        const { userId, role } = await getUserAndRole();
        setUserId(userId);
        setUserRole(role);
      } catch (err) {
        console.error('❌ Error fetching user role:', err);
        showError('Error fetching user role');
      }
    })();
  }, []);

  // Traer proyectos según rol
  const fetchAll = useCallback(async () => {
    if (!userId || !userRole) return;
    try {
      if (userRole === 'expert') {
        // Vista estática para expertos (sin fetch real por ahora)
        setProjects([]);
        return;
      }
      const data = await fetchProjectsByRole(userId, userRole);
      setProjects(data);
    } catch (e) {
      console.error('❌ Error fetching projects:', e);
      showError('Error fetching projects');
    }
  }, [userId, userRole]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return (
    <div className="p-6 min-h-screen bg-[#2c3d5a] text-[#e7e7e7]">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white/70">
          {userRole === 'expert' ? 'My Projects' : 'Projects'}
        </h1>

        {userRole === 'customer' && (
          <Button variant="primary" onClick={() => setShowForm(true)}>
            New Project
          </Button>
        )}
      </div>

      {userRole === 'expert' ? (
        <ExpertEmptyState />
      ) : showForm ? (
        <ProjectForm
          onClose={() => {
            setShowForm(false);
            fetchAll(); // refetch
          }}
        />
      ) : (
        <ProjectList projects={projects} onSelect={(p) => setSelected(p)} />
      )}

      {selected && userRole !== 'expert' && (
        <ProjectEditModal
          isOpen={!!selected}
          onClose={() => setSelected(null)}
          project={selected}
          onSaved={fetchAll}
        />
      )}
    </div>
  );
}
