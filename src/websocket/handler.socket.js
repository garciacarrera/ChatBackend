const socketHandler = (socket) =>{
    //Evento "Message" con la capacidad de brindar un mensaje(muestra los datos del mensaje)
    socket.on("message",(data) =>{
        console.log("Mensaje:",data)

        socket.emit("message","Mensaje Procesado")
    })
    
    socket.on("disconnect",()=>{
        console.log("No hay un usuario conectado")

        socket.emit("disconnect","Desconexion")
    })
}

module.exports = {socketHandler}



