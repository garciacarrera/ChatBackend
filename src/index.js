import app from "./app.js";

const main = () =>{
    const port = app.get('port')
    app.listen(port)
    console.log(`server running on port ${port}`)
}

main();