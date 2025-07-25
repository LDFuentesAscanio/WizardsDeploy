'use client';
//External libraries
import { useFormikContext, FieldArray } from 'formik';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ProfileFormValues } from '../types';
//Validations, types and interfaces

export default function ToolsSection() {
  const { values } = useFormikContext<ProfileFormValues>();
  const [input, setInput] = useState('');
  const tools = values.tools ?? [];
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Tools</h2>
      <FieldArray name="tools">
        {({ push, remove }) => (
          <div className="space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Add a tool"
                className="flex-1 px-3 py-2 rounded bg-white text-[#2c3d5a]"
              />
              <button
                type="button"
                onClick={() => {
                  const trimmed = input.trim();
                  if (trimmed !== '' && !tools.includes(trimmed)) {
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
              {tools.map((tool, index) => (
                <motion.li
                  layout
                  key={index}
                  className="bg-[#67ff94] text-[#2c3d5a] px-3 py-1 rounded-full flex items-center gap-2"
                >
                  <span>{tool}</span>
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
