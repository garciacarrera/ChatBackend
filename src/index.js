import app from "./app.js";
import { envs } from "./configuration/envs.js";

//Creamos una clase http que requiere 'http'
const http = require("http")

//Creamos un servidor usando el archivo "app.js"
const server = http.createServer((app))

//Llamamos a la clase 'Server' de socket.io para instanciar el servidor
const { Server } = require("socket.io")
const io = new Server(server)

const main = () =>{

    //Evento de conexion(ejecutado al iniciar la aplicacion)
    io.on("connection",(socket) =>{
        console.log("Conexion exitosa")

        console.log(socket)
    })

    server.listen(app.get('port'))
    console.log(`server running on port ${envs.PORT}`)
}




main();