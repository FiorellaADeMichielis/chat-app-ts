import React, { createContext, useReducer, useEffect } from 'react';
import { authService, type AuthResponse } from '../services/auth.service';
import type { User, AuthState } from '../types/types';

interface AuthContextState extends AuthState {
  error: string | null;
}

// 1. Add updateUser to the Context Type definition
export interface AuthContextType extends AuthContextState {
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  updateUser: (updates: Partial<User>) => void; 
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 2. Add UPDATE_USER to the Reducer Action types
type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'CLEAR_ERROR' }
  | { type: 'UPDATE_USER'; payload: Partial<User> };

const authReducer = (state: AuthContextState, action: AuthAction): AuthContextState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_USER':
      return { 
        ...state, 
        user: action.payload, 
        isAuthenticated: !!action.payload,
        error: null 
      };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    // 3. Handle the update logic in the reducer
    case 'UPDATE_USER':
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null,
      };
    default:
      return state;
  }
};

const initialState: AuthContextState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        dispatch({ type: 'SET_LOADING', payload: false });
        return;
      }

      try {
        const userData = await authService.getCurrentUser();
        dispatch({ type: 'SET_USER', payload: userData });
      } catch (error) {
        console.error("Session expired:", error);
        localStorage.removeItem('auth_token');
        dispatch({ type: 'SET_USER', payload: null });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });
    
    try {
      const response: AuthResponse = await authService.login({ email, password });
      localStorage.setItem('auth_token', response.token);
      dispatch({ type: 'SET_USER', payload: response.user });
    } catch (error: any) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const register = async (name: string, email: string, password: string): Promise<void> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });
    
    try {
      const response: AuthResponse = await authService.register({ name, email, password });
      localStorage.setItem('auth_token', response.token);
      dispatch({ type: 'SET_USER', payload: response.user });
    } catch (error: any) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('auth_token');
      dispatch({ type: 'SET_USER', payload: null });
    }
  };

  const clearError = () => dispatch({ type: 'CLEAR_ERROR' });

  // 4. Implement the updateUser function
  const updateUser = (updates: Partial<User>) => {
    dispatch({ type: 'UPDATE_USER', payload: updates });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout, clearError, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};