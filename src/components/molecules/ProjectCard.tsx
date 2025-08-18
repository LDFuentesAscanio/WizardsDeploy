'use client';

import { Tables } from '@/types/supabase';

type Project = Tables<'it_projects'>;

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="p-4 bg-white rounded-xl shadow-md text-black">
      <h3 className="text-lg font-bold">{project.project_name}</h3>
      <p className="text-sm text-gray-600">{project.description}</p>
      <p className="mt-2 text-xs">Status: {project.status}</p>
      <p className="mt-1 text-xs">Start: {project.start_date}</p>
    </div>
  );
}
