import express from 'express'
import {envs} from '../src/configuration/envs.js'
import userRouter from '../src/module/routes/user.route.js';
import chatRouter from '../src/module/routes/chat.route.js';
import mensajeRouter from '../src/module/routes/mensaje.route.js'

const app =express();


app.use(express.json());



app.use('/api/users', userRouter);
app.use('/api/chats', chatRouter);
app.use('/api/messages', mensajeRouter);
app.set('port', envs.PORT);
app.use(userRouter);

export default app;
