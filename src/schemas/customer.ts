import { z } from 'zod/v4';
import { commonSchemas } from '#schemas';

export const CustomerRegisterSchema = z.object({
  email: commonSchemas.email,
  password: commonSchemas.password,
  username: z.string().optional(),
  first_name: z.string().optional(),
  last_name: z.string().optional()
});

export const CustomerUpdateSchema = z.object({
  email: commonSchemas.email.optional(),
  password: commonSchemas.password.optional(),
  username: z.string().optional(),
  first_name: z.string().optional(),
  last_name: z.string().optional()
});

export const CustomerSchema = z.object({
  id: z.number().or(z.string()),
  email: z.string(),
  username: z.string().optional(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  roles: z.array(z.string()).optional(),
  avatar_url: z.string().url().optional(),
  is_paying_customer: z.boolean().optional()
});

export type CustomerRegister = z.infer<typeof CustomerRegisterSchema>;
export type CustomerUpdate = z.infer<typeof CustomerUpdateSchema>;
export type Customer = z.infer<typeof CustomerSchema>;
