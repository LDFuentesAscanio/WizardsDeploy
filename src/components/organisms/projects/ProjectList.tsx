'use client';

import { Tables } from '@/types/supabase';
import ProjectCard from '@/components/molecules/ProjectCard';

type Project = Tables<'it_projects'>;

export default function ProjectList({
  projects,
  onSelect,
}: {
  projects: Project[];
  onSelect?: (p: Project) => void;
}) {
  if (!projects.length) {
    return <p>No projects found.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {projects.map((p) => (
        <ProjectCard key={p.id} project={p} onClick={() => onSelect?.(p)} />
      ))}
    </div>
  );
}
