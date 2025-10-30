import axios from 'axios';

// API Mock for testing
const MOCK_MODE = true; // Theres no backend. When the backend is implemented this must be changed to false

if (MOCK_MODE) {
  console.log('⚠️ MOCK MODE ON - No real backend being used');
}

export const apiClient = axios.create({
  baseURL: MOCK_MODE ? 'https://jsonplaceholder.typicode.com' : import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Automatically adds a token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handles errors globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // In case the token has expired or is not valid
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);