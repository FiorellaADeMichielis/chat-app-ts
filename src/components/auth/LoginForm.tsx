import React, { useState } from 'react';
import { Mail, Lock } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';

interface LoginFormData {
  email: string;
  password: string;
}

const ERROR_MESSAGES = {
  REQUIRED_FIELDS: 'Email and password are required',
  INVALID_EMAIL: 'Please enter a valid email address',
  LOGIN_FAILED: 'Invalid email or password',
} as const;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const LoginForm: React.FC = () => {
  const { login, isLoading, error: authError } = useAuth();
  
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });
  
  const [validationError, setValidationError] = useState('');

  const validateForm = (): string | null => {
    const { email, password } = formData;

    if (!email.trim() || !password) {
      return ERROR_MESSAGES.REQUIRED_FIELDS;
    }

    if (!EMAIL_REGEX.test(email)) {
      return ERROR_MESSAGES.INVALID_EMAIL;
    }

    return null;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    if (validationError) {
      setValidationError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setValidationError('');
    
    const error = validateForm();
    if (error) {
      setValidationError(error);
      return;
    }

    try {
      await login(formData.email.trim(), formData.password);
    } catch (err) {
      setValidationError(
        err instanceof Error ? err.message : ERROR_MESSAGES.LOGIN_FAILED
      );
    }
  };

  const displayError = validationError || authError;

  return (
    <Card className="w-full max-w-md mx-auto bg-primary">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center text-primary">
          Welcome back!
        </CardTitle>
        <p className="text-center text-secondary text-sm mt-2">
          Please log in to start chatting
        </p>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {displayError && (
            <div 
              className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-lg border border-red-200 dark:border-red-800"
              role="alert"
              aria-live="polite"
            >
              {displayError}
            </div>
          )}

          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            icon={<Mail size={18} />}
            placeholder="you@email.com"
            required
            autoComplete="email"
            aria-label="Email address"
            aria-required="true"
          />

          <Input
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            icon={<Lock size={18} />}
            placeholder="••••••••"
            required
            autoComplete="current-password"
            aria-label="Password"
            aria-required="true"
          />

          <Button
            type="submit"
            className="w-full"
            isLoading={isLoading}
            disabled={isLoading}
            aria-label={isLoading ? 'Logging in' : 'Log in'}
          >
            {isLoading ? 'Logging in...' : 'Log in'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};