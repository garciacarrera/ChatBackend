import pkg from 'signale';
const { Signale } = pkg;

export const socketHandler = (socket, io) => {
    const logger = new Signale({ scope: 'Socket' });
    
    socket.on("message", (data) => {
        logger.info('Mensaje recibido:', data);
        socket.emit("message", "Mensaje procesado");
    });
    
    socket.on("login", (userData) => {
        logger.info('Usuario logueado:', userData);
        socket.emit("login", "Conexión exitosa");
    });
    
    socket.on("disconnect", (reason) => {
        logger.warn(`Cliente desconectado: ${socket.id}`);
    });
};