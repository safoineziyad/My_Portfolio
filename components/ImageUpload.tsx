'use client';

import { useCallback, useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

interface ImageUploadProps {
  onUpload: (url: string) => void;
  folder?: string;
  className?: string;
  accept?: string;
}

export default function ImageUpload({
  onUpload,
  folder = 'portfolio',
  className = '',
  accept = 'image/*',
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image must be less than 5MB');
        return;
      }

      setUploading(true);
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);

      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', folder);

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await res.json();

        if (res.ok && data.url) {
          onUpload(data.url);
          toast.success('Image uploaded successfully');
        } else {
          toast.error(data.error || 'Upload failed');
          setPreview(null);
        }
      } catch {
        toast.error('Upload failed');
        setPreview(null);
      } finally {
        setUploading(false);
      }
    },
    [onUpload, folder]
  );

  return (
    <div className={className}>
      {preview ? (
        <div className="relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
          {!uploading && (
            <button
              type="button"
              onClick={() => setPreview(null)}
              className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700"
            >
              <X size={14} />
            </button>
          )}
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            </div>
          )}
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg cursor-pointer hover:border-indigo-500 transition-colors">
          <Upload size={24} className="text-slate-400 mb-2" />
          <span className="text-sm text-slate-500">Click to upload image</span>
          <span className="text-xs text-slate-400 mt-1">PNG, JPG, WebP up to 5MB</span>
          <input type="file" accept={accept} onChange={handleUpload} className="hidden" />
        </label>
      )}
    </div>
  );
}
