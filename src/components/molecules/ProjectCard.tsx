// components/molecules/ProjectCard.tsx
'use client';

import { Tables } from '@/types/supabase';

type Project = Tables<'it_projects'>;

export default function ProjectCard({
  project,
  onClick,
}: {
  project: Project;
  onClick?: () => void;
}) {
  return (
    <div
      className="bg-white/10 p-4 rounded-xl shadow hover:bg-white/15 transition cursor-pointer"
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : -1}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) onClick();
      }}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">
          {project.project_name}
        </h3>
        {project.status && (
          <span className="text-xs px-2 py-1 rounded bg-[#67ff94] text-[#2c3d5a]">
            {project.status}
          </span>
        )}
      </div>
      {project.description && (
        <p className="text-sm text-white/80 mt-2 line-clamp-3">
          {project.description}
        </p>
      )}
      <div className="text-xs text-white/60 mt-3">
        {project.start_date ? `Start: ${project.start_date}` : ''}
        {project.end_date ? ` · End: ${project.end_date}` : ''}
      </div>
    </div>
  );
}
