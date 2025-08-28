'use client';

export default function ExpertEmptyState() {
  return (
    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="bg-white/10 backdrop-blur rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white/90">
          No assigned projects yet
        </h3>
        <p className="text-sm text-white/70 mt-1">
          You don’t have any assigned projects for now.
        </p>
      </div>
      <div className="bg-white/10 backdrop-blur rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white/90">
          No applications yet
        </h3>
        <p className="text-sm text-white/70 mt-1">
          You haven’t applied to any project yet.
        </p>
      </div>
    </div>
  );
}
