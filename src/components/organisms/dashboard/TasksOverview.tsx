'use client';

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
  return (
    <section className="w-full max-w-3xl bg-[#e7e7e7] border border-gray-200 rounded-xl p-6">
      <h2 className="text-lg text-[#2c3d5a] font-semibold mb-2">Tasks</h2>
      <p className="text-sm text-gray-600 mb-4">
        Completed {completed} of {total} tasks.
      </p>

      <ul className="space-y-2">
        {tasks.map((task, idx) => (
          <TaskItem key={idx} label={task.label} done={task.done} />
        ))}
      </ul>
    </section>
  );
}
