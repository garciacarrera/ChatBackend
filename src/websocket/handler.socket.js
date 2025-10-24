const socketHandler = (socket) =>{
    socket.on("message",(data) =>{
        console.log("Mensaje 1")
    })
    
    socket.on("disconnect",()=>{
        console.log("disconnected")
    })
}

module.exports = {socketHandler}



