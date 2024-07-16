import { z } from 'zod';

export const createUserSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters long' }),
  name: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters long' }),
  phone: z
    .string()
    .regex(/^\(\d{2}\) \d{4,5}-\d{4}$/, { message: 'Invalid phone format' }),
});
