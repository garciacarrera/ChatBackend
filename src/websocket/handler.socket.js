export const socketHandler = (socket) => {
    
    socket.on("message", (data) => {
        console.log('Mensaje recibido:', data);
        socket.emit("message", "Mensaje procesado");
    });
    
    socket.on("login", (userData) => {
        console.log('Usuario logueado:', userData);
        socket.emit("login", "Conexión exitosa");
    });
    
    socket.on("disconnected", (reason) => {
        console.log(`
            Cliente desconectado: ${socket.id}
            Razon: ${reason}    
        `);
        socket.emit('Razon:', reason);
    });
};