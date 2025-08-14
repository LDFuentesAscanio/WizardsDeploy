'use client';

import Image from 'next/image';
import { useState } from 'react';
import { supabase } from '@/utils/supabase/browserClient';
import { showError, showInfo, showSuccess } from '@/utils/toastService';

type Props = {
  label: string;
  type: 'avatar' | 'company_logo';
  initialUrl?: string;
  onUpload?: (url: string) => void;
  roleName: string | null; // lo obtenemos de useProfileFormData
};

export default function ImageUploader({
  label,
  type,
  initialUrl,
  onUpload,
  roleName,
}: Props) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(initialUrl || null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showError('Invalid file', { description: 'Only images are allowed.' });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showError('File too large', { description: 'Max 5MB allowed.' });
      return;
    }

    setUploading(true);
    showInfo('Uploading image...');

    try {
      // Obtener usuario actual
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();
      if (authError || !user) throw new Error('User not authenticated');

      // Obtener ID de expert o customer según rol
      let targetId: string | null = null;
      let bucketName: string = ''; // bucket correcto según rol

      if (roleName?.toLowerCase() === 'expert') {
        const { data, error } = await supabase
          .from('experts')
          .select('id')
          .eq('user_id', user.id)
          .single();
        if (error || !data) throw error || new Error('Expert not found');
        targetId = data.id;
        bucketName = 'expert-documents';
      } else if (roleName?.toLowerCase() === 'customer') {
        const { data, error } = await supabase
          .from('customers')
          .select('id')
          .eq('user_id', user.id)
          .single();
        if (error || !data) throw error || new Error('Customer not found');
        targetId = data.id;
        bucketName = 'customer-documents';
      } else {
        throw new Error('Invalid role for image upload');
      }

      // Construir nombre único dentro del bucket (solo path relativo)
      const timestamp = Date.now();
      const safeFileName = file.name.replace(/\s+/g, '-');
      const filePath = `profile-images/${timestamp}-${safeFileName}`; // ruta dentro del bucket

      // Subir a Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, { cacheControl: '3600', upsert: true });
      if (uploadError) throw uploadError;

      // URL pública de la imagen
      const fullUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucketName}/${filePath}`;

      // Upsert en la tabla correspondiente
      if (roleName?.toLowerCase() === 'expert') {
        const { error: upsertError } = await supabase
          .from('expert_media')
          .upsert(
            {
              expert_id: targetId!,
              filename: file.name,
              url_storage: fullUrl,
              type,
              updated_at: new Date().toISOString(),
              created_at: new Date().toISOString(),
            },
            { onConflict: 'expert_id,type' }
          );
        if (upsertError) throw upsertError;
      } else if (roleName?.toLowerCase() === 'customer') {
        const { error: upsertError } = await supabase
          .from('customer_media')
          .upsert(
            {
              customer_id: targetId!,
              filename: file.name,
              url_storage: fullUrl,
              type,
              updated_at: new Date().toISOString(),
              created_at: new Date().toISOString(),
            },
            { onConflict: 'customer_id,type' }
          );
        if (upsertError) throw upsertError;
      }

      setPreview(fullUrl);
      showSuccess(`${type === 'avatar' ? 'Profile' : 'Company'} image updated`);
      if (onUpload) onUpload(fullUrl);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Known error:', error.message);
        showError('Error uploading image', { description: error.message });
      } else {
        console.error('Unknown error:', error);
        showError('Unknown error');
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-3">
      {preview ? (
        <div className="relative w-[120px] h-[120px]">
          <Image
            src={preview}
            alt={label}
            fill
            className="rounded-2xl object-cover border border-white"
            priority
          />
        </div>
      ) : (
        <div className="w-[120px] h-[120px] rounded-2xl bg-white/10 flex items-center justify-center text-sm text-white text-center">
          No image
        </div>
      )}

      <label className="cursor-pointer text-[#67ff94] font-semibold underline hover:opacity-80 transition">
        {preview ? 'Edit' : 'Upload'} {label}
        <input
          type="file"
          accept="image/*"
          onChange={handleUpload}
          className="hidden"
          disabled={uploading}
        />
      </label>

      {uploading && <p className="text-sm text-gray-300">Uploading...</p>}
    </div>
  );
}
