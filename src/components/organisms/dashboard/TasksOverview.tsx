'use client';

import Link from 'next/link';
// UI global components
import TaskItem from '@/components/molecules/TaskItem';

interface Task {
  label: string;
  done: boolean;
}

interface TasksOverviewProps {
  completed: number;
  total: number;
  tasks: Task[];
}

export default function TasksOverview({
  completed,
  total,
  tasks,
}: TasksOverviewProps) {
  const isEmpty = !tasks || tasks.length === 0 || total === 0;

  return (
    <section className="w-full max-w-3xl bg-[#e7e7e7] border border-gray-200 rounded-xl p-6">
      <h2 className="text-lg text-[#2c3d5a] font-semibold mb-2">Projects</h2>

      {isEmpty ? (
        <div className="rounded-lg border border-dashed border-gray-300 bg-white p-6 text-center">
          <p className="text-[#2c3d5a] font-medium">
            You’re not in any projects yet.
          </p>
          <p className="text-sm text-gray-600 mt-1">
            Want to discover open opportunities?
          </p>
          <Link
            href="/projects/explore"
            className="inline-block mt-4 px-4 py-2 rounded-lg bg-[#2c3d5a] text-white font-semibold hover:bg-[#22324b] transition-colors"
          >
            Explore Projects
          </Link>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-700 mb-4">
            Completed {completed} of {total} tasks.
          </p>

          <ul className="space-y-2">
            {tasks.map((task) => (
              <TaskItem key={task.label} label={task.label} done={task.done} />
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
