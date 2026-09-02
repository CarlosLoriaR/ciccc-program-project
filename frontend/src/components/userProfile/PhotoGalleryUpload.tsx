import React, { useRef, useState } from 'react';
import { FiPlus, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { uploadImage } from '../../lib/upload';

const MAX_PHOTOS = 5;

type PhotoGalleryUploadProps = {
  photos: string[];
  onChange: (photos: string[]) => void;
};

const PhotoGalleryUpload = ({ photos, onChange }: PhotoGalleryUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    setIsUploading(true);
    try {
      const url = await uploadImage(file);
      onChange([...photos, url]);
    } catch (error) {
      console.error(error);
      toast.error('Could not upload that photo.');
    } finally {
      setIsUploading(false);
    }
  };

  const removePhoto = (index: number) => {
    onChange(photos.filter((_, i) => i !== index));
  };

  const canAddMore = photos.length < MAX_PHOTOS;

  return (
    <div>
      <div className="grid grid-cols-3 gap-3">
        {photos.map((photo, index) => (
          <div key={index} className="relative aspect-square">
            <img
              src={photo}
              alt={`Photo ${index + 1}`}
              className="w-full h-full object-cover rounded-xl"
            />
            <button
              type="button"
              onClick={() => removePhoto(index)}
              className="absolute -top-2 -right-2 bg-error text-on-error rounded-full p-1 hover:opacity-90 transition-opacity"
            >
              <FiX size={14} />
            </button>
          </div>
        ))}

        {canAddMore && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="aspect-square rounded-xl border-2 border-dashed border-outline-variant flex items-center justify-center text-on-surface-variant hover:border-secondary hover:text-primary transition-colors disabled:opacity-50"
          >
            {isUploading ? (
              <span className="text-xs">Uploading...</span>
            ) : (
              <FiPlus />
            )}
          </button>
        )}
      </div>

      <p className="text-xs text-on-surface-variant mt-2">
        {photos.length}/{MAX_PHOTOS} photos
      </p>
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};

export default PhotoGalleryUpload;
