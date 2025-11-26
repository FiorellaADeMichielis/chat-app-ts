import React, { useRef, useState, type ChangeEvent } from 'react';
import { Camera, Loader2 } from 'lucide-react';

interface ProfileAvatarProps {
  userName: string;
  avatarUrl?: string;
  isUploading?: boolean;
  onFileSelect: (file: File) => void;
}

export const ProfileAvatar: React.FC<ProfileAvatarProps> = ({ 
  userName, 
  avatarUrl, 
  isUploading = false, 
  onFileSelect 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  // UI STATE: Handle broken images gracefully by showing initials instead
  const [imgError, setImgError] = useState(false);
  
  const getInitials = (name: string): string => {
    return name ? name.charAt(0).toUpperCase() : '?';
  };

  const handleButtonClick = () => {
    if (!isUploading) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelect(file);
      event.target.value = ''; 
    }
  };

  // Logic: Show image ONLY if it has a URL AND it hasn't failed loading
  const showImage = avatarUrl && !imgError;

  return (
    <div className="flex flex-col items-center mb-8">
      <div className="relative group">
        
        {/* Avatar Circle */}
        <div className="w-32 h-32 rounded-full flex items-center justify-center overflow-hidden border-4 border-secondary shadow-xl bg-secondary">
          
          {showImage ? (
            <img 
              src={avatarUrl} 
              alt={`${userName}'s profile`} 
              className="w-full h-full object-cover"
              onError={() => setImgError(true)} // FALLBACK STRATEGY
            />
          ) : (
            <span className="text-5xl text-primary font-semibold select-none">
              {getInitials(userName)}
            </span>
          )}

          {/* Upload Overlay (Visual feedback) */}
          {isUploading && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-sm transition-all">
            </div>
          )}
        </div>
        
        {/* Action Button */}
        <button
          onClick={handleButtonClick} 
          disabled={isUploading}
          className={`
            absolute bottom-0 right-0 p-3 rounded-full shadow-lg transition-all duration-200
            border-2 border-secondary
            ${isUploading 
              ? 'bg-muted cursor-not-allowed' 
              : 'bg-accent hover:bg-accent/90 text-white cursor-pointer hover:scale-105 active:scale-95'
            }
          `}
          aria-label="Change profile picture"
        >
          {isUploading ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <Camera size={20} />
          )}
        </button>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/png, image/jpeg, image/webp" 
        className="hidden"
      />
    </div>
  );
};