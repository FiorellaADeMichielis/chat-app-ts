import { z } from 'zod';

// login schema
export const loginSchema = z.object({
  email: z.string()
    .min(1, 'Your email is required')
    .email('Please put a valid email'),
  password: z.string()
    .min(1, 'Password is required')
    .min(6, 'yout password must be at least 6 characters long'),
});

// register schema
export const registerSchema = z.object({
  name: z.string()
    .min(1, 'your name is required')
    .min(2, 'your name is too short'),
  email: z.string()
    .min(1, 'Your email is required')
    .email('Invalid email address'),
  password: z.string()
    .min(1, 'You must provide a password')
    .min(6, 'yout password must be at least 6 characters long'),
  confirmPassword: z.string()
    .min(1, 'Please, confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Your passwords don't match",
  path: ['confirmPassword'],
});

//message schema
export const messageSchema = z.object({
  content: z.string()
    .min(1, "your message can't be empty")
    .max(1000, 'Your message is too long'),
});

// infer types
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type MessageFormData = z.infer<typeof messageSchema>;