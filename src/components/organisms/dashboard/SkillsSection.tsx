'use client';

interface SkillsSectionProps {
  skills: string[];
  tools: string[];
}

export default function SkillsSection({ skills, tools }: SkillsSectionProps) {
  return (
    <section className="w-full max-w-4xl mt-8">
      <h2 className="text-xl font-semibold mb-4">Skills & Tools</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-medium mb-2">Skills</h3>
          <ul className="flex flex-wrap gap-2">
            {skills.length > 0 ? (
              skills.map((skill, index) => (
                <li
                  key={index}
                  className="bg-[#67ff94] text-[#2c3d5a] px-3 py-1 rounded-full text-sm font-medium shadow-sm"
                >
                  {skill}
                </li>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No skills provided.</p>
            )}
          </ul>
        </div>

        <div>
          <h3 className="font-medium mb-2">Tools</h3>
          <ul className="flex flex-wrap gap-2">
            {tools.length > 0 ? (
              tools.map((tool, index) => (
                <li
                  key={index}
                  className="bg-[#67ff94] text-[#2c3d5a] px-3 py-1 rounded-full text-sm font-medium shadow-sm"
                >
                  {tool}
                </li>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No tools provided.</p>
            )}
          </ul>
        </div>
      </div>
    </section>
  );
}
