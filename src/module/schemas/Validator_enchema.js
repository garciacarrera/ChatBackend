const joi = require("joi");

const userSchema = joi.object({
  username: joi.string().required(),
  password: joi.string().required()
});

const chatSchema = joi.object({
  name: joi.string().required()
});

const mensajeSchema = joi.object({
  content: joi.string().required(),
  userId: joi.number().integer().required(),
  chatId: joi.number().integer().required()
});

const participationSchema = joi.object({
  userId: joi.number().integer().required(),
  chatId: joi.number().integer().required()
});

module.exports = {
  userSchema,
  chatSchema,
  mensajeSchema,
  participationSchema
};