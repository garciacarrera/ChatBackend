import app from "./app.js";
import { envs } from "./configuration/envs.js";
import http from "http"
import { Server } from "socket.io";
import socketHandler from "./websocket/handler.socket.js";


//Creamos un servidor usando el archivo "app.js"
const server = http.createServer((app))

//Llamamos a la clase 'Server' de socket.io para instanciar el servidor
const io = new Server(server)

const main = () =>{

    //Evento de conexion(ejecutado al iniciar la aplicacion)
    io.on("connection",(socket) =>{
        console.log("Conexion exitosa")

        console.log(socket)

        socketHandler(socket)
    })

    server.listen(app.get('port'))
    console.log(`server running on port ${envs.PORT}`)
}




main();