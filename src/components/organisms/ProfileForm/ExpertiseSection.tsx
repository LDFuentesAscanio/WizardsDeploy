//External libraries
import { useEffect, useState } from 'react';
import { useFormikContext, FieldArray } from 'formik';
import { AnimatePresence, motion } from 'framer-motion';
//Validations, types and interfaces
import { Platform, ProfileFormValues } from './types';
//Utilities
import { supabase } from '@/utils/supabase/client';
//UI local components
import { ExpertiseItem } from './ExpertiseItem';

const EXPERIENCE_OPTIONS = [
  { value: 'less than 1 year', label: 'Less than 1 year' },
  { value: '1 to 2 years', label: '1 to 2 years' },
  { value: '2 to 3 years', label: '2 to 3 years' },
  { value: 'more than 3 years', label: 'More than 3 years' },
];

export default function ExpertiseSection() {
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const { values } = useFormikContext<ProfileFormValues>();

  useEffect(() => {
    const fetchPlatforms = async () => {
      const { data, error } = await supabase
        .from('platforms')
        .select('id, name');
      if (!error && data) setPlatforms(data);
    };
    fetchPlatforms();
  }, []);
  const expertiseArray = values.expertise ?? [];
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Expertise</h2>
      <FieldArray name="expertise">
        {({ push, remove }) => (
          <div className="space-y-4">
            <AnimatePresence>
              {expertiseArray.map((_, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <ExpertiseItem
                    index={index}
                    platforms={platforms}
                    experienceOptions={EXPERIENCE_OPTIONS}
                    onRemove={() => remove(index)}
                    canRemove={expertiseArray.length > 1}
                  />
                </motion.div>
              ))}
            </AnimatePresence>

            {platforms.length > 0 && (
              <button
                type="button"
                onClick={() =>
                  push({ platform_id: '', rating: '', experience_time: '' })
                }
                className="text-sm text-[#67ff94] underline hover:text-[#8effd2]"
              >
                + Add expertise
              </button>
            )}
          </div>
        )}
      </FieldArray>
    </div>
  );
}
