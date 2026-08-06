import type { RequestHandler } from 'express';
import jwt, { type JwtPayload } from 'jsonwebtoken';
import { JWT_SECRET } from '#config';

const authenticate: RequestHandler = (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    throw new Error('Not authorized', { cause: { status: 401 } });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    req.user = {
      id: decoded.id,
      roles: decoded.roles
    };
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return next(new Error('Expired access token', { cause: { status: 401 } }));
    }

    throw new Error('Not authorized', { cause: { status: 401 } });
  }

  next();
};

export default authenticate;
