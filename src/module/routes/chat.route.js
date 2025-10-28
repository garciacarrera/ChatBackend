import { Router } from 'express';
import { chatController } from '../controllers/chat.controllers.js';
import { validate } from "../../middlewares/validator.middleware.js";
import { chatSchema } from '../schemas/Validator_enchema.js';

const chatRouter = Router();


chatRouter.post('/', validate(chatSchema), chatController.create);


chatRouter.get('/', chatController.findAll);


chatRouter.get('/:id', chatController.findOne);


chatRouter.post('/:id/join', chatController.join);


chatRouter.delete('/:id/leave', chatController.leave);

export default chatRouter;