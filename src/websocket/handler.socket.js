export const socketHandler = (socket) =>{
    //Evento "Message" con la capacidad de brindar un mensaje(muestra los datos del mensaje)
    socket.on("message",(data) =>{
        console.log("Mensaje:",data)

        socket.emit("message","Mensaje Procesado")
    })
    
    //Evento para la desconexion de usuarios, o en caso de falta de conexion
    socket.on("disconnect",()=>{
        console.log("No hay un usuario conectado")

        socket.emit("disconnect","Desconexion")
    })

    //Evento de logueo de usuarios
    socket.on("login", ()=>{
        console.log("Usuario conectado correctamente")

        socket.emit("login","Conexion de usuario realizada correctamente")
    })
}
