import { useRef, useState } from 'react';
import { IoCameraSharp } from 'react-icons/io5';
import toast from 'react-hot-toast';
import { uploadImage } from '../../lib/upload';

type AvatarUploadProps = {
  currentAvatarUrl?: string;
  onFileSelect: (url: string) => void;
};

const AvatarUpload = ({
  currentAvatarUrl,
  onFileSelect,
}: AvatarUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(
    currentAvatarUrl,
  );
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const url = await uploadImage(file);
      setPreviewUrl(url);
      onFileSelect(url);
    } catch (error) {
      console.error(error);
      toast.error('Could not upload that photo.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="relative w-28 h-28">
      <img
        src={previewUrl || 'https://placehold.co/200x200'}
        alt="Avatar previw"
        className="w-28 h-28 rounded-full object-cover border-4 border-primary-container"
      />

      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        className="absolute bottom-0 right-0 bg-primary text-on-primary rounded-full p-2 border-2 border-white hover:bg-secondary transition-colors disabled:opacity-50"
      >
        <IoCameraSharp size={20} />
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      {isUploading && (
        <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center text-white text-xs font-semibold">
          Uploading...
        </div>
      )}
    </div>
  );
};

export default AvatarUpload;
