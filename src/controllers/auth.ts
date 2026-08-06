import type { RequestHandler } from 'express';
import axios from 'axios';
import { WOOCOMMERCE_CONSUMER_KEY, WOOCOMMERCE_CONSUMER_SECRET, WOOCOMMERCE_URL } from '#config';
import { createToken, verifyToken, getCookieOptions, setAuthCookies, clearAuthCookies } from '#utils';
import { CustomerRegisterSchema, CustomerSchema } from '#schemas';
import { validateBody } from '#middlewares';

export const register: RequestHandler = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const customerData = {
      email: email,
      password: password,
      username: username
    };

    const wpResponse = await axios.post(`${WOOCOMMERCE_URL}/wp-json/wc/v3/customers`, customerData, {
      auth: {
        username: WOOCOMMERCE_CONSUMER_KEY,
        password: WOOCOMMERCE_CONSUMER_SECRET
      }
    });

    const customer = CustomerSchema.parse(wpResponse.data);

    const payload = {
      userId: customer.id,
      email: customer.email,
      username: customer.username || customer.email,
      roles: customer.roles || ['customer']
    };

    const token = createToken(payload);
    setAuthCookies(res, token);

    res.status(201).json({
      success: true,
      data: {
        customer: {
          id: customer.id,
          email: customer.email,
          username: customer.username || customer.email,
          first_name: customer.first_name || '',
          last_name: customer.last_name || ''
        }
      }
    });
  } catch (error: any) {
    console.error('Registration error:', error.message);
    res.status(error.response?.status || 500).json({
      success: false,
      message: error.response?.data?.message || 'Registration failed'
    });
  }
};

export const login: RequestHandler = async (req, res) => {
  try {
    const { username, password } = req.body;

    const wpResponse = await axios.post(
      `${WOOCOMMERCE_URL}/wp-json/jwt-auth/v1/token`,
      { username, password },
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000
      }
    );

    const authResult = wpResponse.data;

    if (!authResult || !authResult.token) {
      throw new Error('Invalid credentials', { cause: { status: 401 } });
    }

    const payload = {
      userId: authResult.user_id || 0,
      email: authResult.user_email || username,
      username: authResult.username || username,
      roles: authResult.user_roles || ['customer']
    };

    const token = createToken(payload);

    // Set HTTP-only cookie
    setAuthCookies(res, token);

    res.json({
      success: true,
      data: {
        customer: {
          id: payload.userId,
          email: payload.email,
          username: payload.username
        },
        expires_in: 3600
      }
    });
  } catch (error: any) {
    console.error('Login error:', error.message);

    if (error.response?.status === 401) {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
      return;
    }

    res.status(error.response?.status || 500).json({
      success: false,
      message: error.response?.data?.message || 'Login failed'
    });
  }
};

export const logout: RequestHandler = async (req, res) => {
  clearAuthCookies(res);
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
};

export const me: RequestHandler = async (req, res) => {
  try {
    const token = req.cookies?.token;
    if (!token) {
      throw new Error('Unauthorized', { cause: { status: 401 } });
    }

    const payload = verifyToken(token);
    if (!payload) {
      throw new Error('Invalid or expired token', { cause: { status: 401 } });
    }

    res.json({
      success: true,
      data: {
        customer: {
          id: payload.userId,
          email: payload.email,
          username: payload.username
        }
      }
    });
  } catch (error: any) {
    res.status(error.cause?.status || 401).json({
      success: false,
      message: error.message || 'Unauthorized'
    });
  }
};
