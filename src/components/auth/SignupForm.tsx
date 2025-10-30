import React, { useState } from 'react';
import { Mail, Lock, User } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';

interface SignUpFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const VALIDATION_RULES = {
  PASSWORD_MIN_LENGTH: 6,
  PASSWORD_REGEX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  NAME_MIN_LENGTH: 2,
} as const;


const ERROR_MESSAGES = {
  REQUIRED_FIELDS: 'All fields are required',
  INVALID_EMAIL: 'Please enter a valid email address',
  NAME_TOO_SHORT: `Name must be at least ${VALIDATION_RULES.NAME_MIN_LENGTH} characters long`,
  PASSWORD_TOO_SHORT: `Password must be at least ${VALIDATION_RULES.PASSWORD_MIN_LENGTH} characters long`,
  PASSWORD_WEAK: 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
  PASSWORDS_NOT_MATCH: 'Passwords do not match',
  SIGNUP_FAILED: 'Failed to create account. Please try again.',
} as const;

export const SignUpForm: React.FC = () => {
  const { register, isLoading, error: authError } = useAuth();
  
  const [formData, setFormData] = useState<SignUpFormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  
  const [validationError, setValidationError] = useState('');
  const [touched, setTouched] = useState<Set<keyof SignUpFormData>>(new Set());

  const validateForm = (): string | null => {
    const { name, email, password, confirmPassword } = formData;

    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      return ERROR_MESSAGES.REQUIRED_FIELDS;
    }

    if (name.trim().length < VALIDATION_RULES.NAME_MIN_LENGTH) {
      return ERROR_MESSAGES.NAME_TOO_SHORT;
    }

    if (!VALIDATION_RULES.EMAIL_REGEX.test(email)) {
      return ERROR_MESSAGES.INVALID_EMAIL;
    }

    if (password.length < VALIDATION_RULES.PASSWORD_MIN_LENGTH) {
      return ERROR_MESSAGES.PASSWORD_TOO_SHORT;
    }

    if (!VALIDATION_RULES.PASSWORD_REGEX.test(password)) {
      return ERROR_MESSAGES.PASSWORD_WEAK;
    }

    if (password !== confirmPassword) {
      return ERROR_MESSAGES.PASSWORDS_NOT_MATCH;
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

  const handleBlur = (field: keyof SignUpFormData) => {
    setTouched(prev => new Set(prev).add(field));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setValidationError('');
    
    setTouched(new Set(['name', 'email', 'password', 'confirmPassword']));
    
    // Validate the data 
    const error = validateForm();
    if (error) {
      setValidationError(error);
      return;
    }

    try {
      await register(formData.name.trim(), formData.email.trim(), formData.password);
      
    } catch (err) {
      setValidationError(
        err instanceof Error ? err.message : ERROR_MESSAGES.SIGNUP_FAILED
      );
    }
  };

  
  const displayError = validationError || authError;

  return (
    <Card className="w-full max-w-md mx-auto bg-primary">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center text-primary">
          Create your account
        </CardTitle>
        <p className="text-center text-secondary text-sm mt-2">
          Join us and start chatting!
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
            label="Name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            onBlur={() => handleBlur('name')}
            icon={<User size={18} />}
            placeholder="John Doe"
            required
            autoComplete="name"
            aria-label="Your name"
            aria-required="true"
            aria-invalid={touched.has('name') && !formData.name.trim()}
          />

          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={() => handleBlur('email')}
            icon={<Mail size={18} />}
            placeholder="you@email.com"
            required
            autoComplete="email"
            aria-label="Email address"
            aria-required="true"
            aria-invalid={touched.has('email') && !VALIDATION_RULES.EMAIL_REGEX.test(formData.email)}
          />

          <Input
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            onBlur={() => handleBlur('password')}
            icon={<Lock size={18} />}
            placeholder="••••••••"
            required
            autoComplete="new-password"
            aria-label="Password"
            aria-required="true"
            aria-invalid={touched.has('password') && formData.password.length < VALIDATION_RULES.PASSWORD_MIN_LENGTH}
            aria-describedby="password-requirements"
          />
          
          {/* Password requirements*/}
          <p id="password-requirements" className="text-xs text-secondary -mt-2">
            At least 8 characters, including uppercase, lowercase, and a number
          </p>

          <Input
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            onBlur={() => handleBlur('confirmPassword')}
            icon={<Lock size={18} />}
            placeholder="••••••••"
            required
            autoComplete="new-password"
            aria-label="Confirm password"
            aria-required="true"
            aria-invalid={touched.has('confirmPassword') && formData.password !== formData.confirmPassword}
          />

          <Button
            type="submit"
            className="w-full"
            isLoading={isLoading}
            disabled={isLoading}
            aria-label={isLoading ? 'Creating account' : 'Sign up'}
          >
            {isLoading ? 'Creating account...' : 'Sign up'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};