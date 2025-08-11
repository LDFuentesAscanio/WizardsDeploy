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
};

export default function ImageUploader({
  label,
  type,
  initialUrl,
  onUpload,
}: Props) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(initialUrl || null);

  const storageBaseUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/expert-documents`;

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showError('Invalid file', {
        description: 'Only images are allowed.',
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showError('File too large', {
        description: 'Max 5MB allowed.',
      });
      return;
    }

    setUploading(true);
    showInfo('Uploading image...');

    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) throw new Error('User not authenticated');

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

      // Verificamos si ya existe un registro para ese user_id + type
      const { data: existing, error: fetchError } = await supabase
        .from('expert_media')
        .select('id')
        .eq('expert_id', user.id)
        .eq('type', type)
        .maybeSingle();

      if (fetchError) throw fetchError;

      if (existing) {
        // Si existe: actualizamos
        const { error: updateError } = await supabase
          .from('expert_media')
          .update({
            filename: file.name,
            url_storage: fullUrl,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existing.id);

        if (updateError) throw updateError;
      } else {
        // Si no existe: insertamos
        const { error: insertError } = await supabase
          .from('expert_media')
          .insert({
            expert_id: user.id,
            filename: file.name,
            url_storage: fullUrl,
            type,
            created_at: new Date().toISOString(),
          });

        if (insertError) throw insertError;
      }

      setPreview(fullUrl);
      showSuccess(`${type === 'avatar' ? 'Profile' : 'Company'} image updated`);

      if (onUpload) onUpload(fullUrl);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Known error:', error.message);
        showError('Error uploading image', {
          description: error.message,
        });
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
