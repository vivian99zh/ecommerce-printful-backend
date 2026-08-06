import { z } from 'zod/v4';

export const commonSchemas = {
  id: z.number().or(z.string()),
  nonEmptyString: z.string().min(1, 'Required'),
  url: z.url('Invalid URL format'),
  email: z.email('Invalid email address'),
  password: z
    .string()
    .min(10, 'Password must be at least 10 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
};

export const AddressSchema = z.object({
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  company: z.string().optional(),
  address_1: z.string().optional(),
  address_2: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postcode: z.string().optional(),
  country: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional()
});

export type Address = z.infer<typeof AddressSchema>;
