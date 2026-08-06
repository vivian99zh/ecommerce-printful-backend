import jwt from 'jsonwebtoken';
import config, { JWT_SECRET, JWT_EXPIRES_IN } from '#config';
import crypto from 'node:crypto';
import { type CustomerData } from '#types';

export const verifyToken = (token: string): any => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

export const createToken = (customerData: CustomerData) => {
  const token = jwt.sign(
    { id: customerData.userId, username: customerData.username, email: customerData.email, roles: customerData.roles },
    JWT_SECRET,
    {
      expiresIn: '5s'
    }
  );

  return token;
};

export const getCookieOptions = () => ({
  httpOnly: true,
  secure: true,
  sameSite: 'none' as const
});

export const setAuthCookies = (res: any, token: string) => {
  res.cookie('token', token, getCookieOptions());
};

export const clearAuthCookies = (res: any) => {
  res.clearCookie('token');
};
