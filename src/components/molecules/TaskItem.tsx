'use client';

interface TaskItemProps {
  label: string;
  done: boolean;
}

export default function TaskItem({ label, done }: TaskItemProps) {
  return (
    <li className="flex items-center gap-2">
      <input
        type="checkbox"
        checked={done}
        readOnly
        className="w-4 h-4 text-green-500 accent-green-500"
      />
      <span className={done ? 'line-through text-gray-400' : 'text-[#2c3d5a]'}>
        {label}
      </span>
    </li>
  );
}
