'use client';

import { ChangeEvent, useState } from 'react';
import { supabase } from '@/utils/supabase/client';
import { useFormikContext } from 'formik';
import { ProfileFormValues } from '../organisms/ProfileForm/types';

export default function UploadDocumentField() {
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { setFieldValue, values } = useFormikContext<ProfileFormValues>();

  const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError(null);

    if (!file) return;

    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    if (!allowedTypes.includes(file.type)) {
      setError('Solo se permiten archivos PDF o DOCX.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('El archivo debe pesar menos de 10MB.');
      return;
    }

    setUploading(true);

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

      const { error: insertError } = await supabase
        .from('user_documents')
        .insert({
          user_id: user.id,
          filename: file.name,
          url_storage: filePath,
        });

      if (insertError) throw insertError;

      setFieldValue('cv_url', filePath);

      setFileName(file.name);
    } catch (err) {
      console.error('Error uploading document:', err);
      setError('Error al subir el archivo. Intenta nuevamente.');
    } finally {
      setUploading(false);
    }
  };

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
      {fileName && !error && (
        <p className="text-sm text-green-400">✅ Archivo subido: {fileName}</p>
      )}
      {error && <p className="text-sm text-red-400">{error}</p>}

      {/* Mostrar enlace si ya había un documento cargado */}
      {values.cv_url && !fileName && (
        <p className="text-sm text-blue-300 mt-1">
          📎 Documento actual:{' '}
          <a
            href={
              supabase.storage
                .from('expert-documents')
                .getPublicUrl(values.cv_url).data.publicUrl
            }
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-blue-400"
          >
            Ver archivo
          </a>
        </p>
      )}
    </div>
  );
}
