'use client';

import { Tables } from '@/types/supabase';

type Project = Tables<'it_projects'>;

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="p-4 bg-[#e7e7e7] rounded-xl shadow-md text-[#2c3d5a]">
      <h3 className="text-lg font-bold text-[#2c3d5a]">
        {project.project_name}
      </h3>
      <p className="text-sm text-[#2c3d5a]/70">{project.description}</p>
      <p className="mt-2 text-xs">
        Status:
        <span className="ml-1 text-[#67ff94] font-semibold">
          {project.status}
        </span>
      </p>
      <p className="mt-1 text-xs text-[#2c3d5a]/70">
        Start: {project.start_date}
      </p>
    </div>
  );
}
