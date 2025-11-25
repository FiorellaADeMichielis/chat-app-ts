import { apiClient } from '../lib/api';
import type { User } from '../types/types';

// Use env variable or default to true for development
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true' || true;

/**
 * Uploads a profile picture.
 * Returns the URL of the uploaded image.
 */
export const uploadAvatarService = async (file: File): Promise<string> => {
  if (USE_MOCK) {
    console.log(`[UserService] 🎭 Mock upload: ${file.name}`);
    
    return new Promise((resolve) => {
      setTimeout(() => {
        // Return a dynamic mock URL to see the change immediately
        // Uses ui-avatars to generate a new image based on time
        resolve(`https://ui-avatars.com/api/?name=New+Avatar&background=random&time=${Date.now()}`);
      }, 1500);
    });
  }

  // Real API implementation
  const formData = new FormData();
  formData.append('avatar', file);

  const response = await apiClient.post<{ url: string }>('/users/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  
  return response.data.url;
};

/**
 * Updates the user's status.
 */
export const updateStatusService = async (status: User['status']): Promise<void> => {
  if (USE_MOCK) {
    console.log(`[UserService] 🎭 Mock update status: ${status}`);
    return new Promise((resolve) => setTimeout(resolve, 600));
  }

  await apiClient.patch('/users/status', { status });
};

/**
 * Updates profile details (Name, etc.)
 */
export const updateProfileService = async (data: Partial<User>): Promise<User> => {
  if (USE_MOCK) {
    console.log(`[UserService] 🎭 Mock update profile`, data);
    return new Promise((resolve) => {
      setTimeout(() => {
          // Return dummy data merged
          resolve({ 
              id: '1', 
              email: 'demo@example.com', 
              name: data.name || 'Updated Name', 
              status: 'online',
              avatar: '',
              lastSeen: new Date()
          } as User);
      }, 800);
    });
  }

  const response = await apiClient.patch<User>('/users/profile', data);
  return response.data;
};