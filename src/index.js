import app from "./app.js";
import { envs } from "./configuration/envs.js";
import http from "http";
import { Server } from "socket.io";
import { socketHandler } from "./websocket/handler.socket.js";
import pkg from 'signale';
const { Signale } = pkg;
import AppDataSource from './provider/datasource-provider.js';

const server = http.createServer(app);
const io = new Server(server);

const main = async () => {
    const logger = new Signale({ scope: 'Main' });
    
    try {
        await AppDataSource.initialize();
        logger.success('Conectado a la base de datos');
        
        server.listen(app.get('port'), () => {
            logger.success(`Servidor prendido en el puerto ${envs.PORT}`);
        });
        
        io.on("connection", (socket) => {
            logger.info(`Cliente conectado: ${socket.id}`);
            socketHandler(socket);
        });
        
    } catch (error) {
        logger.error('Error al iniciar:', error);
        process.exit(1);
    }
};

main();