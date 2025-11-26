import { z } from 'zod';

//Strict schema for user profile validation
export const userProfileSchema = z.object({
  name: z.string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters")
    .nonempty("Name is required"),
  
  email: z.string()
    .email("Invalid email format"), // validates email format
    //TypeScript inferes by default that an array is mutable (string[]). 
    //Zod needs a readonly tuple for enum validation, so we use 'as const' to ensure immutability.
  status: z.enum(['online', 'offline', 'away'] as const, {
    message: "Status must be valid"
  })
});

export type UserProfileSchema = z.infer<typeof userProfileSchema>;