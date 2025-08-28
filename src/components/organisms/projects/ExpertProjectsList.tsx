'use client';

import { motion } from 'framer-motion';
import type { ExpertProjectItem } from '@/utils/projectsService';

export default function ExpertProjectsList({
  items,
}: {
  items: ExpertProjectItem[];
}) {
  if (!items.length)
    return <p className="mt-4 text-white/70">No projects available.</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
      {items.map(({ project, offer }) => (
        <motion.div
          key={`${project.id}-${offer.id}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="bg-white/10 backdrop-blur rounded-xl p-4 shadow"
        >
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-semibold text-white">
              {project.project_name}
            </h3>
            {project.description && (
              <p className="text-sm text-white/80">{project.description}</p>
            )}
            <p className="text-xs text-white/60">
              Status: {project.status ?? '—'}
            </p>

            <div className="mt-3 rounded-xl bg-[#e7e7e7] text-[#1d2c45] font-bold px-3 py-1 w-fit">
              {offer.category_name ?? 'Category'} —{' '}
              {offer.subcategory_name ?? 'Subcategory'}
            </div>

            {offer.description_solution && (
              <p className="text-sm text-white/80 mt-2">
                {offer.description_solution}
              </p>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
