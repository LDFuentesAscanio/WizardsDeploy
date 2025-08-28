'use client';

import { Briefcase, ClipboardList } from 'lucide-react';

export default function ExpertEmptyState() {
  return (
    <div className="min-h-[60vh] flex flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card: No assigned projects */}
        <div className="bg-white/10 backdrop-blur rounded-xl p-6 shadow flex items-start gap-4">
          <div className="p-3 rounded-xl bg-white/10">
            <Briefcase className="w-6 h-6 text-[#67ff94]" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">No assigned projects yet</h3>
            <p className="text-sm text-white/70 mt-1">
              When you are assigned to a project, it will appear here.
            </p>
          </div>
        </div>

        {/* Card: No applications */}
        <div className="bg-white/10 backdrop-blur rounded-xl p-6 shadow flex items-start gap-4">
          <div className="p-3 rounded-xl bg-white/10">
            <ClipboardList className="w-6 h-6 text-[#67ff94]" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">No applications yet</h3>
            <p className="text-sm text-white/70 mt-1">
              Projects you apply to will be listed here once implemented.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-2 text-sm text-white/60">
        Tip: Use{' '}
        <span className="font-semibold text-white">Explore Projects</span> to
        find opportunities and apply.
      </div>
    </div>
  );
}
