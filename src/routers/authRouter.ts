import { Router } from 'express';
import { register, login, logout, me } from '#controllers';
import { RegisterSchema, LoginSchema } from '#schemas';
import { validateBody, authenticate } from '#middlewares';

const authRouter = Router();

authRouter.post('/register', validateBody(RegisterSchema), register);
authRouter.post('/login', validateBody(LoginSchema), login);
authRouter.post('/logout', logout);
authRouter.get('/me', authenticate, me);

export default authRouter;
