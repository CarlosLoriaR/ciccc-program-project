import { useRef, useState } from 'react';
import { IoCameraSharp } from 'react-icons/io5';

type AvatarUploadProps = {
  currentAvatarUrl?: string;
  onFileSelect: (file: File, previewUrl: string) => void;
};

const AvatarUpload = ({
  currentAvatarUrl,
  onFileSelect,
}: AvatarUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(
    currentAvatarUrl,
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    onFileSelect(file, url);
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
        className="absolute bottom-0 right-0 bg-primary text-on-primary rounded-full p-2 border-2 border-white hover:bg-secondary transition-colors"
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
    </div>
  );
};

export default AvatarUpload;
