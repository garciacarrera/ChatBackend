import joi from 'joi'

export const userSchema = joi.object({
    username: joi.string().required(),
    password: joi.string().required()
})

export const chatSchema = joi.object({
    name: joi.string().required()
})

export const mensajeSchema = joi.object({
    content: joi.string().required(),
    user: joi.number().required(),
    chat: joi.number().required()
})

export const participationShema = joi.object({
    user: joi.number().required(),
    chat: joi.number().required()
})