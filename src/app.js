import express from 'express'
import {envs} from '../src/configuration/envs.js'


const app =express();


app.use(express.json())


app.set('port', envs.PORT)


export default app;
