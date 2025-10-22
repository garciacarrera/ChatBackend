import joi from "joi";

export const userSchema = joi.object({
  username: joi.string().required(),
  password: joi.string().required()
});

export const chatSchema = joi.object({
  name: joi.string().required()
});

export const mensajeSchema = joi.object({
  content: joi.string().required(),
  userId: joi.number().integer().required(),
  chatId: joi.number().integer().required()
});

export const participationSchema = joi.object({
  userId: joi.number().integer().required(),
  chatId: joi.number().integer().required()
});