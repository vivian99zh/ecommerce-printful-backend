import { z } from 'zod/v4';
import { commonSchemas } from '#schemas';

export const LoginSchema = z.object({
  username: commonSchemas.nonEmptyString,
  password: commonSchemas.nonEmptyString
});

export const RegisterSchema = z.object({
  email: commonSchemas.email,
  password: commonSchemas.password,
  username: z.string().optional()
});

export const JwtPayloadSchema = z.object({
  id: commonSchemas.id,
  email: commonSchemas.email,
  username: z.string(),
  iat: z.number().optional(),
  exp: z.number().optional()
});

export type LoginFormData = z.infer<typeof LoginSchema>;
export type RegisterFormData = z.infer<typeof RegisterSchema>;
export type JwtPayload = z.infer<typeof JwtPayloadSchema>;
