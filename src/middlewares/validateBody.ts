import type { RequestHandler } from 'express';
import * as z from 'zod';

const validateBody =
  (zodSchema: z.ZodType): RequestHandler =>
  async (req, res, next) => {
    if (!req.body) {
      throw new Error('Request body is missing', { cause: 400 });
    }

    const { data, error, success } = zodSchema.safeParse(req.body);

    if (!success) {
      throw new Error(z.prettifyError(error), { cause: 400 });
    }

    req.body = data;
    next();
  };

export default validateBody;
