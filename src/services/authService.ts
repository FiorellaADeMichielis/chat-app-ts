import { apiClient } from '../lib/api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

interface ApiAuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    status: string;
  };
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    status: 'online' | 'offline' | 'away';
  };
}

const normalizeStatus = (status: string): 'online' | 'offline' | 'away' => {
  const validStatuses = ['online', 'offline', 'away'];
  return validStatuses.includes(status) 
    ? (status as 'online' | 'offline' | 'away')
    : 'online';
};

const adaptUserResponse = (apiUser: ApiAuthResponse['user']): AuthResponse['user'] => {
  return {
    id: apiUser.id,
    name: apiUser.name,
    email: apiUser.email,
    status: normalizeStatus(apiUser.status),
  };
};

const MOCK_MODE = true; 

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    if (MOCK_MODE) {
      
      console.log(' Mock login:', credentials.email);

      await new Promise(resolve => setTimeout(resolve, 500));
      
      return {
        token: 'mock-jwt-token-' + Date.now(),
        user: {
          id: '1',
          name: credentials.email.split('@')[0],
          email: credentials.email,
          status: 'online',
        },
      };
    }
    
    // real API
    const response = await apiClient.post<ApiAuthResponse>('/auth/login', credentials);
    return {
      token: response.data.token,
      user: adaptUserResponse(response.data.user),
    };
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    if (MOCK_MODE) {
      console.log('Mock Sign up:', data.email);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return {
        token: 'mock-jwt-token-' + Date.now(),
        user: {
          id: Date.now().toString(),
          name: data.name,
          email: data.email,
          status: 'online',
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
    if (MOCK_MODE) {
      console.log("Mock logout");
      await new Promise(resolve => setTimeout(resolve, 200));
      return;
    }
    
    await apiClient.post('/auth/logout');
  },

  async getCurrentUser(): Promise<AuthResponse['user']> {
    if (MOCK_MODE) {
      console.log('🎭 Mock getCurrentUser');
      
      
      const token = localStorage.getItem('auth_token');
      if (!token) {
        throw new Error('No token found');
      }
      
      return {
        id: '1',
        name: 'Demo User',
        email: 'demo@example.com',
        status: 'online',
      };
    }
    
    const response = await apiClient.get<ApiAuthResponse['user']>('/auth/me');
    return adaptUserResponse(response.data);
  },
};