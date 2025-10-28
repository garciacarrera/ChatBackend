import { Router } from 'express';
import { mensajeController } from '../controllers/mensaje.controller.js';
import { validate } from "../../middlewares/validator.middleware.js";
import { mensajeSchema } from '../schemas/Validator_enchema.js';

const mensajeRouter = Router();


mensajeRouter.post('/', validate(mensajeSchema), mensajeController.send);


mensajeRouter.get('/chat/:chatId', mensajeController.findByChat);


mensajeRouter.delete('/:id', mensajeController.remove);

export default mensajeRouter;