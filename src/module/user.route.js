
import { Router } from "express";
import { validate } from "../middlewares/validator.middleware.js";
import { userSchema } from "./schemas/Validator_enchema.js";
import { usercontroller } from "./user.controller.js";
import { userController } from './user.controller.js';
import authMiddleware from '../../middlewares/auth.middleware.js'

const userRoute = Router();

userRoute.post('/register', validate(createUser), userController.register);
userRoute.post('/login', validate(loginUser), userController.login);
userRoute.get('/users', authMiddleware, userController.findAll);

export default userRoute;