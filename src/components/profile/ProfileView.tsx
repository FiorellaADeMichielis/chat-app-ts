import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, User as UserIcon } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { ProfileAvatar } from './ProfileAvatar';
import type { User } from '../../types/types';
import { uploadAvatarService, updateStatusService, updateProfileService } from '../../services/user.service';

export const ProfileView: React.FC = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email
      });
    }
  }, [user]);

  if (!user) return null;

  // --- HANDLERS ---

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      const updatedUser = await updateProfileService({
        name: formData.name,
        email: formData.email
      });

      updateUser(updatedUser);
      
      console.log('Profile updated successfully');
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileSelected = async (file: File) => {
    if (isUploading) return;
    
    setIsUploading(true);
    try {
      const newAvatarUrl = await uploadAvatarService(file);
      updateUser({ avatar: newAvatarUrl });
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    const validStatus = newStatus as User['status'];

    updateUser({ status: validStatus });
    
    setStatusLoading(true);
    
    try {
      await updateStatusService(validStatus);
      console.log('Status synced with server');
    } catch (error) {
      console.error('Failed to sync status:', error);
      alert('Failed to update status on server');
    } finally {
      setStatusLoading(false);
    }
  };

  return (
    <div className="flex-1 bg-secondary h-full overflow-y-auto">
      {/* Header */}
      <div className="bg-primary border-b border-default px-6 py-4 sticky top-0 z-10">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => navigate(-1)} 
            className="text-secondary hover:text-primary transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold text-primary">Profile</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto p-6">
        
        {/* Avatar Section */}
        <ProfileAvatar 
          userName={user.name} 
          avatarUrl={user.avatar || ''} 
          isUploading={isUploading}
          onFileSelect={handleFileSelected} 
        />

        {/* User Identity */}
        <div className="flex flex-col items-center mb-8">
          <h2 className="mt-4 text-2xl font-bold text-primary">{user.name}</h2>
          <p className="text-secondary">{user.email}</p>
        </div>
        
        {/* Form Section */}
        <div className="bg-primary rounded-xl border border-default p-6 space-y-6 shadow-sm">
          <h3 className="text-lg font-semibold text-primary border-b border-default pb-2">
            Personal Information
          </h3>
          
          <Input 
            label="Full Name" 
            name="name"
            value={formData.name} 
            onChange={handleInputChange}
            icon={<UserIcon size={18} />} 
          />
          
          <Input 
            label="Email Address" 
            name="email"
            value={formData.email} 
            onChange={handleInputChange}
            icon={<Mail size={18} />} 
          />

          {/* Status Selector */}
          <div>
            <label className="block text-sm font-medium text-primary mb-2">
              Current Status
            </label>
            <div className="relative">
              <select
                className="w-full px-4 py-2 bg-primary border border-default rounded-lg text-primary focus:outline-none focus:ring-2 focus:ring-accent appearance-none cursor-pointer"
                value={user.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                disabled={statusLoading}
              >
                <option value="online">🟢 Online</option>
                <option value="away">🟡 Away</option>
                <option value="offline">⚪ Offline</option>
              </select>
            </div>
          </div>

          <div className="pt-4">
            <Button 
              className="w-full" 
              onClick={handleSaveProfile}
              disabled={isUploading || isSaving}
              isLoading={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};