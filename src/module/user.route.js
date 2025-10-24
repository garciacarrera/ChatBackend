import { Router } from "express";
import { validate } from "../middlewares/validator.middleware.js";

import { userSchema } from "./schemas/Validator_enchema.js";
import { usercontroller } from "./user.controller.js";

/**
 * const userrouter = Router(); 

userrouter.post('/users', validate(userSchema), usercontroller.create);
export default userrouter;
 */


