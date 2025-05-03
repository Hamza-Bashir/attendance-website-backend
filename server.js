const app = require("./app")
const http = require("http")
const db = require("./config/dbConn")
const server = http.Server(app)
const port = process.env.port

const startServer = async ()=>{
    try {
        db()
        server.listen(port, ()=>{
            console.log("Server start successfully at port ", port)
        })
    } catch (error) {
        console.log("Server not started successfully")
        process.exit(1)
    }
}

startServer()