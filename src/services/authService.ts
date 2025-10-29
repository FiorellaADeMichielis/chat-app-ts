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
    avatar?: string;
  };
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    status: 'online' | 'offline' | 'away';
    avatar?: string;
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
    avatar: apiUser.avatar,
  };
};

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<ApiAuthResponse>('/auth/login', credentials);
    
    return {
      token: response.data.token,
      user: adaptUserResponse(response.data.user),
    };
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await apiClient.post<ApiAuthResponse>('/auth/register', data);
    
    return {
      token: response.data.token,
      user: adaptUserResponse(response.data.user),
    };
  },

  async logout(): Promise<void> {
    await apiClient.post('/auth/logout');
  },

  async getCurrentUser(): Promise<AuthResponse['user']> {
    const response = await apiClient.get<ApiAuthResponse['user']>('/auth/me');
    return adaptUserResponse(response.data);
  },
};