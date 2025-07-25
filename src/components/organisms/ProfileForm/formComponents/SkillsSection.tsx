'use client';
// External libraries
import { useState } from 'react';
import { useFormikContext, FieldArray } from 'formik';
import { motion } from 'framer-motion';
import { ProfileFormValues } from '../types';
// Validations, types and interfaces

export default function SkillsSection() {
  const { values } = useFormikContext<ProfileFormValues>();
  const [input, setInput] = useState('');

  const skills = values.skills ?? []; // fallback defensivo

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Skills</h2>
      <FieldArray name="skills">
        {({ push, remove }) => (
          <div className="space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Add a skill"
                className="flex-1 px-3 py-2 rounded bg-white text-[#2c3d5a]"
              />
              <button
                type="button"
                onClick={() => {
                  const trimmed = input.trim();
                  if (trimmed !== '' && !skills.includes(trimmed)) {
                    push(trimmed);
                    setInput('');
                  }
                }}
                className="bg-[#67ff94] text-[#2c3d5a] px-4 py-2 rounded hover:bg-[#8effd2] transition"
              >
                Add
              </button>
            </div>

            <motion.ul layout className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <motion.li
                  layout
                  key={index}
                  className="bg-[#67ff94] text-[#2c3d5a] px-3 py-1 rounded-full flex items-center gap-2"
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="text-sm font-bold hover:text-red-600"
                  >
                    ✕
                  </button>
                </motion.li>
              ))}
            </motion.ul>
          </div>
        )}
      </FieldArray>
    </div>
  );
}
