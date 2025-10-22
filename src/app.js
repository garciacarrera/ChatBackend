import express from 'express'
import {envs} from '../src/configuration/envs.js'
import userrouter from './module/user.route.js';

const app =express();


app.use(express.json())


app.set('port', envs.PORT)
app.use(userrouter);

export default app;
