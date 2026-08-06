export type IdParams = { id: string };

declare global {
  namespace Express {
    interface Request {
      user?: { id: string; roles: string[] };
    }
  }
}

export type CustomerData = {
  userId: string | number;
  username: string;
  email: string;
  roles: string[];
};
