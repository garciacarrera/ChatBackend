import express from "express";

const app = express()

app.use(express.json())


app.set('port', 3000)

export default app;