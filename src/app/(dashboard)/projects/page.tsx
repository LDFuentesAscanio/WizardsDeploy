// app/projects/page.tsx
'use client';

import { useCallback, useEffect, useState } from 'react';
import Button from '@/components/atoms/Button';
import ProjectForm from '@/components/organisms/projects/ProjectForm';
import ProjectList from '@/components/organisms/projects/ProjectList';
import { showError } from '@/utils/toastService';

import {
  getUserAndRole,
  fetchProjectsByRole,
  Project,
} from '@/utils/projectsService';

import ProjectEditModal from '@/components/organisms/projects/ProjectEditModal';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [selected, setSelected] = useState<Project | null>(null);

  // user + role
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

  // proyectos por rol
  const fetchProjects = useCallback(async () => {
    if (!userId) return;
    try {
      const data = await fetchProjectsByRole(userId, userRole);
      setProjects(data);
    } catch (e) {
      console.error('❌ Error fetching projects:', e);
      showError('Error fetching projects');
    }
  }, [userId, userRole]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return (
    <div className="p-6 min-h-screen bg-[#2c3d5a] text-[#e7e7e7]">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white/70">Projects</h1>
        {userRole === 'customer' && (
          <Button variant="primary" onClick={() => setShowForm(true)}>
            New Project
          </Button>
        )}
      </div>

      {showForm ? (
        <ProjectForm
          onClose={() => {
            setShowForm(false);
            fetchProjects();
          }}
        />
      ) : (
        <ProjectList projects={projects} onSelect={(p) => setSelected(p)} />
      )}

      {selected && (
        <ProjectEditModal
          isOpen={!!selected}
          onClose={() => setSelected(null)}
          project={selected}
          onSaved={fetchProjects}
        />
      )}
    </div>
  );
}
