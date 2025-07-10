'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { uploadFile, deleteImage } from '@/lib/storage';
import { Loader2, Trash2, UploadCloud, X, Image as ImageIcon, Video } from 'lucide-react';
import NextImage from 'next/image';

interface FileUploaderProps {
  label: string;
  storagePath: string;
  fileType: 'image' | 'video';
  value: string[];
  onChange: (urls: string[]) => void;
}

export function FileUploader({ label, storagePath, fileType, value, onChange }: FileUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const downloadURL = await uploadFile(file, storagePath, (p) => setProgress(p));
      onChange([...value, downloadURL]);
      toast({ title: 'Success', description: `${label} uploaded successfully.` });
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Upload Failed', description: error.message });
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const handleFileDelete = async (urlToDelete: string) => {
    try {
      await deleteImage(urlToDelete);
      onChange(value.filter((url) => url !== urlToDelete));
      toast({ title: 'Success', description: `${label} deleted successfully.` });
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Deletion Failed', description: error.message });
    }
  };

  return (
    <div className="space-y-4">
      <label className="font-medium">{label}</label>
      {value && value.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          {value.map((url, index) => (
            <div key={index} className="relative group">
              {fileType === 'image' ? (
                <NextImage src={url} alt={`${label} ${index + 1}`} width={150} height={150} className="w-full h-auto object-cover rounded-md aspect-square" />
              ) : (
                <div className="w-full aspect-square bg-black rounded-md flex items-center justify-center">
                    <Video className="h-10 w-10 text-white" />
                </div>
              )}
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-1 right-1 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleFileDelete(url)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
      <div className="flex items-center gap-2">
        <Input
          type="file"
          id={`${storagePath}-upload`}
          className="hidden"
          accept={fileType === 'image' ? 'image/*' : 'video/*'}
          onChange={handleFileUpload}
          disabled={uploading}
        />
        <label
          htmlFor={`${storagePath}-upload`}
          className="w-full"
        >
            <Button type="button" variant="outline" className="w-full" disabled={uploading} asChild>
                <div>
                {uploading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    fileType === 'image' ? <ImageIcon className="mr-2 h-4 w-4" /> : <Video className="mr-2 h-4 w-4" />
                )}
                Upload {label}
                </div>
            </Button>
        </label>
      </div>
      {uploading && <Progress value={progress} className="w-full" />}
    </div>
  );
}
