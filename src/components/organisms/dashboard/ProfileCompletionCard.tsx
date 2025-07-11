'use client';

interface ProfileCompletionCardProps {
  completed: number; // porcentaje completado (0-100)
  missingFields: string[];
}

export default function ProfileCompletionCard({
  completed,
  missingFields,
}: ProfileCompletionCardProps) {
  return (
    <section className="w-full max-w-3xl bg-[#e7e7e7] rounded-2xl p-6 shadow border border-[#e7e7e7]">
      <h2 className="text-lg font-semibold text-[#2c3d5a] mb-2">
        Profile Completion
      </h2>

      <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden mb-4">
        <div
          className="h-full bg-[#67ff94] transition-all"
          style={{ width: `${completed}%` }}
        />
      </div>

      <p className="text-sm text-gray-700 mb-2">
        Your profile is {completed}% complete
      </p>

      {missingFields.length > 0 && (
        <ul className="text-sm text-gray-500 list-disc list-inside">
          {missingFields.map((field, index) => (
            <li key={index}>Complete your {field}</li>
          ))}
        </ul>
      )}
    </section>
  );
}
