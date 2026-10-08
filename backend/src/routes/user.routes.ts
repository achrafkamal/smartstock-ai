import { Router } from 'express';
import { getUsers, getUser, createUser, login } from '../controllers/user.controller.js';

export const userRouter = Router();

userRouter.get('/', getUsers);
userRouter.get('/:id', getUser);
userRouter.post('/', createUser);
userRouter.post('/login', login);

export default userRouter;

