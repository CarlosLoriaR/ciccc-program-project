import React, { useRef } from 'react';
import { FiPlus, FiX } from 'react-icons/fi';

const MAX_PHOTOS = 3;

type PhotoGalleryUploadProps = {
  photos: string[];
  onChange: (photos: string[]) => void;
};

const PhotoGalleryUpload = ({ photos, onChange }: PhotoGalleryUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    onChange([...photos, url]);

    e.target.value = '';
  };

  const removePhoto = (index: number) => {
    onChange(photos.filter((_, i) => i !== index));
  };

  const canAddMore = photos.length < MAX_PHOTOS;

  return (
    <div>
      <div className="grid grid-cols-3 gap-3">
        {photos.map((photo, index) => (
          <div>
            <img
              src={photo}
              alt={`Photo ${index + 1}`}
              className="w-full h-full object-cover rounded-xl"
            />
            <button
              type="button"
              onClick={() => removePhoto(index)}
              className="absolute -top-2 -right-2 bg-error text-on-error rounded-full p-1 hover:opacity-90 transition-opacity"
              aria-label="Remove photo"
            >
              <FiX size={14} />
            </button>
          </div>
        ))}

        {canAddMore && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="aspect-square rounded-xl border-2 border-dashed border-outline-variant flex items-center justify-center text-on-surface-variant hover:border-primary hover:text-primary transition-colors"
          >
            <FiPlus />
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
