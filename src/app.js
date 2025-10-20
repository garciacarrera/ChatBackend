import express from "express";

const app = express()

app.use(express.json())
app.use(uploadRouter)

app.set('port', 3000)

export default app;