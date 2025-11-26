import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, User as UserIcon } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { ProfileAvatar } from './ProfileAvatar';
import type { UserUpdatePayload } from '../../types/types';
import { uploadAvatarService, updateProfileService } from '../../services/user.service';
import toast from 'react-hot-toast'; 
import { z } from 'zod';
import { userProfileSchema } from '../../schemas/user.schema';

export const ProfileView: React.FC = () => {
  // GLOBAL STATE: The "Server Truth". Treated as Read-Only here until successful update.
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  // LOCAL STATE (The "Draft"): 
  // Decoupled from global state to allow editing without premature updates to the UI.
  const [formData, setFormData] = useState<UserUpdatePayload>({
    name: '',
    email: '',
    status: 'offline'
  });

  // UI STATE: Granular loading states for better UX (Upload vs Save).
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // SYNC PATTERN: 
  // Hydrates the local form when the component mounts or server data changes.
  // Ensures the form always starts with the latest server data.
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        status: user.status || 'offline'
      });
    }
  }, [user]);

  // GUARD CLAUSE: Prevents rendering if auth context is not ready
  if (!user) return null; 

  // --- HANDLERS ---

  const handleGoBack = () => {
    // Navigates back to the main layout (Chat List)
    navigate('/'); 
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    // Functional update ensures we work with the latest state snapshot
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileSelected = async (file: File) => {
    if (isUploading) return;
    
    setIsUploading(true);
    const toastId = toast.loading('Updating avatar...');
    
    try {
      const newAvatarUrl = await uploadAvatarService(file);
      
      // OPTIMISTIC / HYBRID UPDATE:
      // Update global state immediately after successful upload
      updateUser({ avatar: newAvatarUrl }); 
      toast.success('Avatar updated!', { id: toastId });
    } catch (error) {
      console.error(error);
      toast.error('Failed to upload image', { id: toastId });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validates the schema before making any network requests.
    try {
      userProfileSchema.parse(formData);
    } catch (err) {
      if (err instanceof z.ZodError) {
        // Extract the first error message to show to the user
        const firstError = err.issues?.[0]?.message ?? 'Validation failed';
        toast.error(firstError);
        return; 
      }
    }
    //API SUBMISSION
    setIsSaving(true);
    
    try {
      // Service call returns the sanitized user object from backend
      const updatedUser = await updateProfileService(formData);
      
      // SYNC: Update global context only on success
      updateUser(updatedUser);
      
      toast.success('Profile saved successfully');
    } catch (error) {
      console.error(error);
      toast.error('Could not save changes');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex-1 bg-secondary h-full flex flex-col relative">
      
      {/* --- NAVIGATION HEADER --- */}
      <header className="sticky top-0 z-10 flex items-center gap-4 p-4 bg-primary border-b border-default shadow-sm">
        <Button 
          onClick={handleGoBack}
          className="p-2 rounded-full hover:bg-secondary transition-colors text-primary focus:outline-none focus:ring-2 focus:ring-accent"
          aria-label="Go back to chats"
        >
          <ArrowLeft size={24} />
        </Button>
        <h1 className="text-xl font-bold text-primary">Edit Profile</h1>
      </header>

      {/* --- SCROLLABLE CONTENT --- */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto p-6">
          
          {/* Avatar Section: Handles image upload and display logic */}
          <ProfileAvatar 
            userName={formData.name} 
            avatarUrl={user.avatar || ''} 
            isUploading={isUploading}
            onFileSelect={handleFileSelected} 
          />

          <div className="flex flex-col items-center mb-8">
            <h2 className="mt-4 text-2xl font-bold text-primary">{user.name}</h2>
            <p className="text-secondary">{user.email}</p>
          </div>
          
          {/* Form Section */}
          <form onSubmit={handleSubmit} className="bg-primary rounded-xl border border-default p-6 space-y-6 shadow-sm">
            
            <Input 
              name="name" 
              label="Full Name" 
              value={formData.name} 
              onChange={handleInputChange} 
              icon={<UserIcon size={18} />} 
              className="bg-secondary"
            />
            
            <Input 
              name="email"
              label="Email Address" 
              value={formData.email} 
              onChange={handleInputChange}
              icon={<Mail size={18} />} 
              className="bg-secondary"
            />

            {/* STATUS SELECTOR */}
            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                Current Status
              </label>
              <div className="relative">
                <select
                  name="status"
                  className="w-full px-4 py-2 bg-primary border border-default rounded-lg text-primary focus:outline-none focus:ring-2 focus:ring-accent appearance-none cursor-pointer"
                  value={formData.status}
                  onChange={handleInputChange}
                >
                  <option value="online">🟢 Online</option>
                  <option value="away">🟡 Away</option>
                  <option value="offline">⚪ Offline</option>
                </select>
              </div>
            </div>

            <div className="pt-4">
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isUploading || isSaving}
                isLoading={isSaving}
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
          
          {/* Bottom spacer to prevent content from being cut off */}
          <div className="h-10"></div>
        </div>
      </div>
    </div>
  );
};