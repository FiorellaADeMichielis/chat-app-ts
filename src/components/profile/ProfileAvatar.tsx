import React, { useRef, type ChangeEvent } from 'react';
import { Camera, Loader2 } from 'lucide-react';

interface ProfileAvatarProps {
  userName: string;
  avatarUrl?: string; // 1. Added prop to display the image
  isUploading?: boolean; // 2. Added prop to handle loading state
  onFileSelect: (file: File) => void;
}

export const ProfileAvatar: React.FC<ProfileAvatarProps> = ({ 
  userName, 
  avatarUrl, 
  isUploading = false, 
  onFileSelect 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const getInitials = (name: string): string => {
    return name.charAt(0).toUpperCase();
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
      // Reset input so the same file can be selected again if needed
      event.target.value = ''; 
    }
  };

  return (
    <div className="flex flex-col items-center mb-8">
      <div className="relative group">
        
        {/* Avatar Circle Container */}
        <div className="w-32 h-32 rounded-full flex items-center justify-center overflow-hidden border-4 border-white dark:border-gray-800 shadow-xl bg-gray-200 dark:bg-gray-700">
          
          {/* 3. Conditional Rendering: Image vs Initials */}
          {avatarUrl ? (
            <img 
              src={avatarUrl} 
              alt={`${userName}'s profile`} 
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-5xl text-gray-500 dark:text-gray-400 font-semibold select-none">
              {getInitials(userName)}
            </span>
          )}

          {/* Optional: Overlay when uploading */}
          {isUploading && (
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
               {/* This is purely decorative, the real spinner is on the button */}
            </div>
          )}
        </div>
        
        {/* Action Button */}
        <button
          onClick={handleButtonClick} 
          disabled={isUploading}
          className={`
            absolute bottom-0 right-0 p-3 rounded-full shadow-lg transition-all duration-200
            border-2 border-white dark:border-gray-800
            ${isUploading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer hover:scale-105 active:scale-95'
            }
          `}
          aria-label="Change profile picture"
        >
          {isUploading ? (
            <Loader2 size={20} className="animate-spin text-white" />
          ) : (
            <Camera size={20} />
          )}
        </button>
      </div>

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*" 
        className="hidden"
      />
    </div>
  );
};