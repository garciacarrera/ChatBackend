
import { Router } from "express";
import { validate } from "../middlewares/validator.middleware.js";

import { userSchema } from "../module/schemas/Validator_enchema.js";
import { userController } from "./user.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.post('/user', validate(userSchema), userController.register)

userRouter.post('/user/login', userController.login)

userRouter.get('/users', authMiddleware ,userController.findAll)

userRouter.post('/register', validate(createUser), userController.register);
userRouter.post('/login', validate(loginUser), userController.login);
userRouter.get('/users', authMiddleware, userController.findAll);

export default userRouter;

