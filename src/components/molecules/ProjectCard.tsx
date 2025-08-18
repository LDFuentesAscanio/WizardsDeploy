'use client';

import { Tables } from '@/types/supabase';

type Project = Tables<'it_projects'>;

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="bg-white/10 backdrop-blur rounded-xl p-6 shadow">
      <h3 className="text-lg font-bold text-white/70">
        {project.project_name}
      </h3>
      <p className="text-sm text-white/70">{project.description}</p>
      <p className="mt-2 text-xs">
        Status:
        <span className="ml-1 text-[#67ff94] font-semibold">
          {project.status}
        </span>
      </p>
      <p className="mt-1 text-xs text-white/70">Start: {project.start_date}</p>
    </div>
  );
}
