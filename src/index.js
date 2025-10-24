import app from "./app.js";

const app = require("./app.js")
const envs = require("./configuration/envs.js")


const http = require("http")

const server = http.createServer((app))

const { Server } = require("socket.io")

const io = new Server(server)

const main = () =>{
    const port = app.get('port')

    io.on("connection",(socket) =>{
        console.log("Succesful connection")
    })

    server.listen(app.get("port"))
    console.log(`server running on port ${port}`)
}




main();