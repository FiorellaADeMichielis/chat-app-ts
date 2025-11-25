import { apiClient } from '../lib/api';
import type { User, LoginCredentials } from '../types/types';

// Input DTOs
export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

// Response structure specifically for Auth (Token + User)
export interface AuthResponse {
  token: string;
  user: User;
}

// Raw response from the API for authentication
interface ApiAuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    status: string;
    avatar?: string;
  };
}

// --- ADAPTERS ---

const normalizeStatus = (status: string): User['status'] => {
  const validStatuses = ['online', 'offline', 'away'];
  return validStatuses.includes(status) 
    ? (status as User['status'])
    : 'offline'; // Default safety fallback
};

const adaptUserResponse = (apiUser: ApiAuthResponse['user']): User => {
  return {
    id: apiUser.id,
    name: apiUser.name,
    email: apiUser.email,
    status: normalizeStatus(apiUser.status),
    avatar: apiUser.avatar, // Pass through or undefined
    lastSeen: new Date(), // Set default or parse from API
  };
};

// Use Environment Variable for Mock Mode
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true' || true; // Fallback to true for dev

export const authService = {
  
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    if (USE_MOCK) {
      console.log('[AuthService] 🎭 Mock login:', credentials.email);
      await new Promise(resolve => setTimeout(resolve, 800)); // Latency
      
      return {
        token: 'mock-jwt-token-' + Date.now(),
        user: {
          id: '1',
          name: 'Fiorella Dev',
          email: credentials.email,
          status: 'online',
          avatar: `https://ui-avatars.com/api/?name=${credentials.email}&background=random`,
          lastSeen: new Date()
        },
      };
    }
    
    // Real API Call
    const response = await apiClient.post<ApiAuthResponse>('/auth/login', credentials);
    return {
      token: response.data.token,
      user: adaptUserResponse(response.data.user),
    };
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    if (USE_MOCK) {
      console.log('[AuthService] 🎭 Mock register:', data.email);
      await new Promise(resolve => setTimeout(resolve, 800));
      
      return {
        token: 'mock-jwt-token-' + Date.now(),
        user: {
          id: Date.now().toString(),
          name: data.name,
          email: data.email,
          status: 'online',
          avatar: `https://ui-avatars.com/api/?name=${data.name}&background=random`,
          lastSeen: new Date()
        },
      };
    }
    
    const response = await apiClient.post<ApiAuthResponse>('/auth/signup', data);
    return {
      token: response.data.token,
      user: adaptUserResponse(response.data.user),
    };
  },

  async logout(): Promise<void> {
    if (USE_MOCK) {
      console.log("[AuthService] 🎭 Mock logout");
      await new Promise(resolve => setTimeout(resolve, 200));
      return;
    }
    
    await apiClient.post('/auth/logout');
  },

  async getCurrentUser(): Promise<User> {
    if (USE_MOCK) {
      console.log('[AuthService] Mock getCurrentUser');
      const token = localStorage.getItem('auth_token');
      
      // Simulate checking token validity
      if (!token) throw new Error('No token found');

      return {
        id: '1',
        name: 'Fiorella Dev',
        email: 'demo@example.com',
        status: 'online',
        avatar: 'https://ui-avatars.com/api/?name=Fiorella+Dev',
        lastSeen: new Date()
      };
    }
    
    const response = await apiClient.get<ApiAuthResponse['user']>('/auth/me');
    return adaptUserResponse(response.data);
  },
};