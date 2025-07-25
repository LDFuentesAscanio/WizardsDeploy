'use client';
// External libraries
import { ChangeEvent, useState } from 'react';
import { useFormikContext } from 'formik';
// Validations, types and interfaces
import { ProfileFormValues } from '../organisms/ProfileForm/types';
// Utilities
import { showSuccess, showError, showInfo } from '@/utils/toastService';
import { supabase } from '@/utils/supabase/browserClient';

export default function UploadDocumentField() {
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const { setFieldValue, values } = useFormikContext<ProfileFormValues>();

  // ✅ URL base correctamente definida (sin barra final)
  const storageBaseUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/expert-documents`;

  const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    if (!allowedTypes.includes(file.type)) {
      showError('Invalid format', 'Only PDF or DOCX files are allowed.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      showError('File too large', 'Must be less than 10MB.');
      return;
    }

    setUploading(true);
    showInfo('Uploading file...');

    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        throw new Error('Not authenticated');
      }

      const uniqueFilename = `${Date.now()}_${file.name}`;
      const filePath = `${user.id}/${uniqueFilename}`;

      const { error: uploadError } = await supabase.storage
        .from('expert-documents')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // ✅ URL bien formada
      const fullUrl = `${storageBaseUrl}/${filePath}`;

      const { error: insertError } = await supabase
        .from('user_documents')
        .insert({
          user_id: user.id,
          filename: file.name, // este es el nombre limpio, sin ID
          url_storage: fullUrl,
        });

      if (insertError) throw insertError;

      setFieldValue('cv_url', fullUrl);
      setFieldValue('filename', file.name); // mostramos solo el nombre, no la URL
      setFileName(file.name);

      showSuccess('File uploaded successfully', file.name);
    } catch (err) {
      console.error('Error uploading document:', err);
      showError('Upload failed', 'Please try again later.');
    } finally {
      setUploading(false);
    }
  };

  // ✅ Mostrar solo el nombre de archivo limpio, nunca el user ID
  const uploadedFileName = values.filename || fileName || 'Document';

  return (
    <div className="space-y-1" lang="en">
      <label className="block text-sm font-medium">Resume (PDF or DOCX)</label>
      <input
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={handleUpload}
        className="block w-full text-sm text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#67ff94] file:text-[#2c3d5a] hover:file:bg-[#8effd2]"
        disabled={uploading}
      />

      {uploading && <p className="text-sm text-gray-300">Uploading file...</p>}

      {fileName && (
        <p className="text-sm text-green-400">✅ File uploaded: {fileName}</p>
      )}

      {values.cv_url && !fileName && (
        <p className="text-sm text-blue-300 mt-1">
          📎 Current file:{' '}
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
