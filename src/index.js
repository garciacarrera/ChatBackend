
import app from "./app.js";
import { envs } from "./configuration/envs.js";
import http from "http"
import { Server } from "socket.io";
import { socketHandler } from "./websocket/handler.socket.js";

import pkg from 'signale';

const { Signale } = pkg;
import AppDataSource from './provider/datasource-provider.js';


//Creamos un servidor usando el archivo "app.js"
const server = http.createServer((app))

//Llamamos a la clase 'Server' de socket.io para instanciar el servidor
const io = new Server(server)

const main = () =>{
    server.listen(app.get('port'))
    //# Le damos el scope
    const logger = new Signale({ scope: 'Main' });

    AppDataSource.initialize()
        .then(() => logger.log('Connected to database'))
        .catch(() => logger.log('Unable to connect to database'));

    

    //Evento de conexion(ejecutado al iniciar la aplicacion)
    io.on("connection",(socket) =>{
        console.log("Conexion exitosa")

        console.log(socket)

        socketHandler(socket)
    })

    // # En vez de usar console.log, usamos signale para los logs
    logger.log('server running on port ' + port);
}




main();

