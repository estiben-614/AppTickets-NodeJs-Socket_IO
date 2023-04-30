import express from "express"
import dotenv from "dotenv"
import {createServer} from "http"
import {Server} from "socket.io"
import { socketServer } from "../public/socketServer/controllers.js" //Al usar import, se ejecuta todo lo que hay en ese archivo
                                                                    //Por eso, se ejecuta la instancia TicketControllers

dotenv.config()

export class Servidor{
    constructor(){  
        this.port=process.env.PORT

        this.app=express()
        //Configuración Socket.io
        this.httpServer=createServer(this.app)
        this.io=new Server(this.httpServer)
        

        this.middlewares()
        this.sockets()


    }

    middlewares(){
        
        this.app.use(express.static('public'));

    }

    sockets(){
       this.io.on("connection",socketServer) 
        // this.io.on("connection",(socket)=>{
        //     socketServer(socket)
        // });
    }

    listen(){

        
        this.httpServer.listen(this.port,()=>{
            console.log(`Example app listening on port ${this.port}`)
        })
    }
}