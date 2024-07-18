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
  cpf: z
    .string()
    .regex(/^\d{3}\.\d{3}\.\d{3}\-\d{2}$/, { message: 'Invalid cpf format' }),
});

export const updateUserSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters long' })
    .optional(),
  name: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters long' }),
  phone: z
    .string()
    .regex(/^\(\d{2}\) \d{4,5}-\d{4}$/, { message: 'Invalid phone format' }),
  cpf: z
    .string()
    .regex(/^\d{3}\.\d{3}\.\d{3}\-\d{2}$/, { message: 'Invalid cpf format' }),
});

// export const updateUserSchema = z
//   .object({
//     email: z.string().email({ message: 'Invalid email address' }).optional(),
//     password: z
//       .string()
//       .min(6, { message: 'Password must be at least 6 characters long' })
//       .optional(),
//     name: z
//       .string()
//       .min(2, { message: 'Name must be at least 2 characters long' })
//       .optional(),
//     phone: z
//       .string()
//       .regex(/^\(\d{2}\) \d{4,5}-\d{4}$/, { message: 'Invalid phone format' })
//       .optional(),
//     cpf: z
//       .string()
//       .regex(/^\d{3}\.\d{3}\.\d{3}\-\d{2}$/, { message: 'Invalid cpf format' })
//       .optional(),
//   })
//   .refine((data) => Object.keys(data).length > 0, {
//     message: 'At least one field must be provided',
//   });
