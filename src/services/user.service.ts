import { apiClient } from '../lib/api';
import type { User, UserUpdatePayload } from '../types/types';

// ENV CONFIGURATION:
// Strict boolean check. Never default to 'true' in production code.
// Ideally, this should be wrapped in a config utility, but I'll keep it here for now.
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

// SIMULATED LATENCY: Constants make tweaking dev experience easier.
const MOCK_DELAY_MS = 800;

/**
 * Uploads a profile picture.
 * Returns the URL of the uploaded image.
 */
export const uploadAvatarService = async (file: File): Promise<string> => {
  // MOCK IMPLEMENTATION
  if (USE_MOCK) {
    console.info(`[Mock] 📤 Uploading avatar: ${file.name}`);
    
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(`https://ui-avatars.com/api/?name=New+Avatar&background=random&time=${Date.now()}`);
      }, MOCK_DELAY_MS);
    });
  }

  // REAL IMPLEMENTATION
  const formData = new FormData();
  formData.append('avatar', file);

  const response = await apiClient.post<{ url: string }>('/users/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  
  return response.data.url;
};

/**
 * Updates profile details.
 * @param data - The DTO containing only editable fields.
 */
export const updateProfileService = async (data: UserUpdatePayload): Promise<User> => {
  // MOCK IMPLEMENTATION
  if (USE_MOCK) {
    console.info(`[Mock] 💾 Updating profile:`, data);
    return new Promise((resolve) => {
      setTimeout(() => {
        // SMART MOCKING:
        // Instead of returning a hardcoded "demo" user, we return a merged object.
        // In a real app, I would merge 'data' with the current user state, 
        // but since services are stateless, I simulate a successful return 
        // by reflecting the sent data back.
        
        // I constructed a partial User to simulate the API response
        const mockResponse: User = {
            id: 'mock-user-id', 
            email: data.email,  
            name: data.name,   
            status: (data.status as User['status']) || 'online',
            avatar: 'https://github.com/shadcn.png', 
            lastSeen: new Date().toISOString() 
        } as unknown as User; // Casting for mock simplicity

        resolve(mockResponse);
      }, MOCK_DELAY_MS);
    });
  }

  // REAL IMPLEMENTATION
  // We use patch because we are doing a partial update.
  const response = await apiClient.patch<User>('/users/profile', data);

  return response.data;
};