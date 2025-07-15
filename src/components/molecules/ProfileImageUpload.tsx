'use client';
// External libraries
import Image from 'next/image';
import { useState } from 'react';
import { useFormikContext } from 'formik';
import { PostgrestError } from '@supabase/supabase-js';
// Validations, types and interfaces
import { ProfileFormValues } from '../organisms/ProfileForm/types';
// Utilities
import { supabase } from '@/utils/supabase/client';
import { showError, showInfo, showSuccess } from '@/utils/toastService';

export default function ProfileImageUpload() {
  const { setFieldValue, values } = useFormikContext<ProfileFormValues>();
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const storageBaseUrl = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BASE_URL;

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showError('Invalid file', 'Only images are allowed.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showError('file too large', 'Must be less than 5MB.');
      return;
    }

    setUploading(true);
    showInfo('Subiendo imagen...');

    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        throw new Error('User not authenticated');
      }

      const filename = `${user.id}_${Date.now()}.${file.name.split('.').pop()}`;
      const filePath = `profile-images/${filename}`;

      const { error: uploadError } = await supabase.storage
        .from('expert-documents')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (uploadError) throw uploadError;

      const fullUrl = `${storageBaseUrl}/${filePath}`;

      const { error: mediaError } = await supabase.rpc('upsert_user_media', {
        p_user_id: user.id,
        p_filename: file.name,
        p_url_storage: fullUrl,
      });

      if (mediaError) throw mediaError;

      setFieldValue('photo_url', fullUrl);
      setPreview(fullUrl);
      showSuccess('Photo updated successfully');
    } catch (error: unknown) {
      handleUploadError(error);
    } finally {
      setUploading(false);
    }
  };

  function handleUploadError(error: unknown) {
    if (error instanceof Error) {
      console.error('Known error:', error.message);
      showError('Error uploading image', error.message);
    } else if (typeof error === 'object' && error !== null) {
      const supabaseError = error as PostgrestError;
      console.error('Error Supabase:', supabaseError.message);
      showError('Error in Supabase', supabaseError.message);
    } else {
      console.error('Unknown error:', error);
      showError('An unknown error occurred');
    }
  }

  const imageUrl = preview || values.photo_url;

  return (
    <div className="flex flex-col items-center space-y-3">
      {imageUrl ? (
        <div className="relative w-[120px] h-[120px]">
          <Image
            src={imageUrl}
            alt="Profile picture"
            fill
            className="rounded-2xl object-cover border border-white"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      ) : (
        <div className="w-[120px] h-[120px] rounded-2xl bg-white/10 flex items-center justify-center text-sm text-white text-center">
          No photo
        </div>
      )}

      <label className="cursor-pointer text-[#67ff94] font-semibold underline hover:opacity-80 transition">
        {imageUrl ? 'Edit photo' : 'Upload photo'}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
          disabled={uploading}
        />
      </label>

      {uploading && <p className="text-sm text-gray-300">Updating image...</p>}
    </div>
  );
}
