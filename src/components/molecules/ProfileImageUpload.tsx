'use client';

import { useState } from 'react';
import { PostgrestError } from '@supabase/supabase-js';
import { useFormikContext } from 'formik';
import Image from 'next/image';
import { supabase } from '@/utils/supabase/client';
import { ProfileFormValues } from '../organisms/ProfileForm/types';

export default function ProfileImageUpload() {
  const { setFieldValue, values } = useFormikContext<ProfileFormValues>();
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  interface StorageError {
    message: string;
    statusCode?: string;
    error?: string;
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) throw authError;
      if (!user) throw new Error('Usuario no autenticado');

      const filename = `${user.id}_${Date.now()}.${file.name.split('.').pop()}`;
      const filePath = `profile-images/${filename}`;

      // Subir imagen con tipado específico
      const { error: uploadError } = await supabase.storage
        .from('expert-documents')
        .upload(filePath, file, { cacheControl: '3600', upsert: true });

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from('expert-documents').getPublicUrl(filePath);

      // Upsert con tipado
      const { error: mediaError } = await supabase.rpc('upsert_user_media', {
        p_user_id: user.id,
        p_filename: file.name,
        p_url_storage: publicUrl,
      });

      if (mediaError) throw mediaError;

      setFieldValue('photo_url', publicUrl);
      setPreview(publicUrl);
    } catch (error: unknown) {
      handleUploadError(error);
    } finally {
      setUploading(false);
    }
  };

  // Función auxiliar para manejo de errores
  function handleUploadError(error: unknown) {
    if (error instanceof Error) {
      console.error('Error conocido:', error.message);
      alert(`Error: ${error.message}`);
    } else if (typeof error === 'object' && error !== null) {
      const supabaseError = error as PostgrestError | StorageError;
      console.error('Error Supabase:', supabaseError.message);
      alert(`Error en Supabase: ${supabaseError.message}`);
    } else {
      console.error('Error desconocido:', error);
      alert('Ocurrió un error desconocido');
    }
  }

  const imageUrl = preview || values.photo_url;

  return (
    <div className="flex flex-col items-center space-y-2">
      {imageUrl ? (
        <div className="relative w-[120px] h-[120px]">
          <Image
            src={imageUrl}
            alt="Profile"
            fill
            className="rounded-full object-cover border border-white"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      ) : (
        <div className="w-[120px] h-[120px] rounded-full bg-white/10" />
      )}

      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="text-sm text-white"
        disabled={uploading}
      />
      {uploading && <p className="text-sm text-gray-300">Uploading...</p>}
    </div>
  );
}
