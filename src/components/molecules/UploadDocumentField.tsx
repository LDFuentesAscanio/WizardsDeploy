'use client';
// External libraries
import { ChangeEvent, useState } from 'react';
import { useFormikContext } from 'formik';
// Validations, types and interfaces
import { ProfileFormValues } from '../organisms/ProfileForm/types';
// Utilities
import { showSuccess, showError, showInfo } from '@/utils/toastService';
import { supabase } from '@/utils/supabase/client';

export default function UploadDocumentField() {
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const { setFieldValue, values } = useFormikContext<ProfileFormValues>();

  const storageBaseUrl = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BASE_URL;

  const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    if (!allowedTypes.includes(file.type)) {
      showError('Formato no válido', 'Solo se permiten archivos PDF o DOCX.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      showError('Archivo muy grande', 'Debe pesar menos de 10MB.');
      return;
    }

    setUploading(true);
    showInfo('Subiendo archivo...');

    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        throw new Error('No autenticado');
      }

      const uniqueFilename = `${Date.now()}_${file.name}`;
      const filePath = `${user.id}/${uniqueFilename}`;

      const { error: uploadError } = await supabase.storage
        .from('expert-documents')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const fullUrl = `${storageBaseUrl}/${filePath}`;

      const { error: insertError } = await supabase
        .from('user_documents')
        .insert({
          user_id: user.id,
          filename: file.name,
          url_storage: fullUrl,
        });

      if (insertError) throw insertError;

      setFieldValue('cv_url', fullUrl);
      setFieldValue('filename', file.name);
      setFileName(file.name);

      showSuccess('Archivo subido', file.name);
    } catch (err) {
      console.error('Error uploading document:', err);
      showError('Error al subir', 'Intenta nuevamente más tarde.');
    } finally {
      setUploading(false);
    }
  };

  const uploadedFileName =
    values.filename ||
    fileName ||
    (values.cv_url ? values.cv_url.split('/').pop() : 'Documento');

  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium">
        Curriculum (PDF o DOCX)
      </label>
      <input
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={handleUpload}
        className="block w-full text-sm text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#67ff94] file:text-[#2c3d5a] hover:file:bg-[#8effd2]"
        disabled={uploading}
      />

      {uploading && (
        <p className="text-sm text-gray-300">Subiendo archivo...</p>
      )}

      {fileName && (
        <p className="text-sm text-green-400">✅ Archivo subido: {fileName}</p>
      )}

      {values.cv_url && !fileName && (
        <p className="text-sm text-blue-300 mt-1">
          📎 Archivo actual:{' '}
          <a
            href={values.cv_url}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-blue-400"
          >
            {uploadedFileName}
          </a>
        </p>
      )}
    </div>
  );
}
