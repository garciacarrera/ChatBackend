import joi from 'joi';
import dotenv from 'dotenv';

dotenv.config();

const envsSchema = joi 
  .object({ 
    PORT: joi.number().required(),
    DATABASE: joi.string().required(),
    DB_PORT: joi.number().required(),
    DB_USER: joi.string().required(),
    DB_PASS: joi.string().allow('').optional(),
    DB_HOST: joi.string().required(),
    JWT_SECRET: joi.string().required(),
  })
  .unknown(true);

const { value, error } = envsSchema.validate(process.env);

if (error) throw new Error(error.message);

// Mapeo a nombres usados por datasource-provider
export const envs = {
  PORT: value.PORT,
  DB_NAME: value.DATABASE,        // antes: DATABASE
  DB_PORT: value.DB_PORT,
  DB_USER: value.DB_USER,
  DB_PASSWORD: value.DB_PASS,     // antes: DB_PASS
  DB_HOST: value.DB_HOST,
  JWT_SECRET: value.JWT_SECRET

};

