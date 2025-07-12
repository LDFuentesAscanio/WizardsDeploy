'use client';
//Validations, types and interfaces
import { Experience } from './types';

interface ExperienceSectionProps {
  experiences: Experience[];
}

export default function ExperienceSection({
  experiences,
}: ExperienceSectionProps) {
  return (
    <section className="w-full max-w-4xl">
      <h2 className="text-xl font-semibold mb-4">Experience</h2>

      {experiences.length === 0 ? (
        <p className="text-gray-500 text-sm">No experience registered.</p>
      ) : (
        <ul className="space-y-4">
          {experiences.map((exp, index) => (
            <li
              key={index}
              className="bg-[#e7e7e7] rounded-lg p-4 shadow-sm text-[#2c3d5a]"
            >
              <p className="font-medium text-lg">{exp.platform}</p>
              <p className="text-sm text-gray-700">
                Rating: {exp.rating}/7 — Experience: {exp.experienceTime}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
