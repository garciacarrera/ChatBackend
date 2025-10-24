import express from "express";
import { envs } from "./configuration/envs"

const app = express()

app.use(express.json())

app.set('port', envs.PORT)

export default app;