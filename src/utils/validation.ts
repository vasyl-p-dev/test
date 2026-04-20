import { z } from 'zod';

export const signupSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters'),
  email: z.string().trim().toLowerCase().email('Enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Za-z]/, 'Password must include a letter')
    .regex(/\d/, 'Password must include a digit'),
  acceptTos: z.boolean().refine((v) => v === true, {
    message: 'You must accept the Terms to continue',
  }),
});

export type SignupFormValues = z.infer<typeof signupSchema>;
