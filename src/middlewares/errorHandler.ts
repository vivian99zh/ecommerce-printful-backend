import type { ErrorRequestHandler } from 'express';

type ErrorPayload = {
  success: false;
  message: string;
  errors?: Array<{ field: string; message: string }>;
};

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (process.env.NODE_ENV !== 'production') {
    console.error('❌ Error:', err.stack);
  }

  const payload: ErrorPayload = {
    success: false,
    message: err.message || 'Internal server error'
  };

  if (err.cause) {
    const cause = err.cause as { status: number; code?: string; errors?: any[] };

    if (cause.code === 'ACCESS_TOKEN_EXPIRED') {
      res.setHeader('WWW-Authenticate', 'Bearer error="token_expired", error_description="The access token expired"');
    }

    if (cause.code === 'INVALID_TOKEN') {
      res.setHeader(
        'WWW-Authenticate',
        'Bearer error="invalid_token", error_description="The access token is invalid"'
      );
    }

    if (cause.errors && Array.isArray(cause.errors)) {
      payload.errors = cause.errors.map((err: any) => ({
        field: err.path?.join('.') || 'unknown',
        message: err.message
      }));
      payload.message = 'Validation error';
    }

    res.status(cause.status || 500).json(payload);
    return;
  }

  if (err.name === 'ZodError') {
    payload.message = 'Validation error';
    payload.errors =
      err.errors?.map((e: any) => ({
        field: e.path?.join('.') || 'unknown',
        message: e.message
      })) || [];
    res.status(400).json(payload);
    return;
  }

  res.status(err.status || 500).json(payload);
};

export default errorHandler;
