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
  roleName: string | null;
};

type ExpertMedia = {
  expert_id: string;
  filename: string;
  url_storage: string;
  type: 'avatar' | 'company_logo';
  updated_at: string;
};

type CustomerMedia = {
  customer_id: string;
  filename: string;
  url_storage: string;
  type: 'avatar' | 'company_logo';
  updated_at: string;
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

    // Validaciones iniciales del archivo
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
      // 1. Autenticación del usuario
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();
      if (authError || !user) throw new Error('User not authenticated');

      // 2. Determinar el rol y configuraciones
      let bucketName: string;
      let tableName: 'expert_media' | 'customer_media';
      let upsertData: ExpertMedia | CustomerMedia;
      let entityId: string;

      if (roleName?.toLowerCase() === 'expert') {
        const { data, error } = await supabase
          .from('experts')
          .select('id')
          .eq('user_id', user.id)
          .single();
        if (error || !data) throw error || new Error('Expert not found');

        entityId = data.id;
        bucketName = 'expert-documents';
        tableName = 'expert_media';
        upsertData = {
          expert_id: entityId,
          filename: '',
          url_storage: '',
          type,
          updated_at: new Date().toISOString(),
        };
      } else if (roleName?.toLowerCase() === 'customer') {
        const { data, error } = await supabase
          .from('customers')
          .select('id')
          .eq('user_id', user.id)
          .single();
        if (error || !data) throw error || new Error('Customer not found');

        entityId = data.id;
        bucketName = 'customer-documents';
        tableName = 'customer_media';
        upsertData = {
          customer_id: entityId,
          filename: '',
          url_storage: '',
          type,
          updated_at: new Date().toISOString(),
        };
      } else {
        throw new Error('Invalid role for image upload');
      }

      // 3. Preparar nombre de archivo seguro (sin carpetas)
      const timestamp = Date.now();
      const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const safeName = `${type}-${entityId}-${timestamp}.${fileExt}`;
      const filePath = safeName; // IMPORTANTE: No usar carpetas en el path

      // 4. Subir a Supabase Storage
      // 4. Subir a Supabase Storage (versión optimizada)
      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
          contentType: file.type,
        });

      if (uploadError) throw uploadError;

      // 5. Obtener URL pública
      const {
        data: { publicUrl },
      } = supabase.storage.from(bucketName).getPublicUrl(filePath);

      // 6. Actualizar la base de datos (versión corregida)
      if (tableName === 'expert_media') {
        const { error: upsertError } = await supabase
          .from('expert_media')
          .upsert(upsertData as ExpertMedia);
        if (upsertError) throw upsertError;
      } else {
        const { error: upsertError } = await supabase
          .from('customer_media')
          .upsert(upsertData as CustomerMedia);
        if (upsertError) throw upsertError;
      }

      // 7. Actualizar estado y notificar
      setPreview(publicUrl);
      showSuccess(`${type === 'avatar' ? 'Profile' : 'Company'} image updated`);
      if (onUpload) onUpload(publicUrl);
    } catch (error: unknown) {
      console.error('Upload error:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'An unexpected error occurred';
      showError('Upload failed', { description: errorMessage });
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
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
