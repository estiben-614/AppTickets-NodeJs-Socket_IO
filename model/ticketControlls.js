import express from "express"
import * as fs from 'node:fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));


export class CrearTicket{
    constructor(numeroTicket,escritorio){
        this.numeroTicket=numeroTicket
        this.escritorio=escritorio
    }
}
export class TicketControllers{
    constructor(){
        this.ultimoTicket=0
        this.fechaHoy=new Date().getDate()
        this.tickets=[]
        this.ultimos4Tickets=[]

        this.numeroTicket=0

        this.pathDB=path.join(__dirname,'../db/data.json')

        this.leerDB()
    }
    get getDatosActuales(){
        return {
            ultimoTicket:this.ultimoTicket,
            fechaHoy:this.fechaHoy,
            Tickets:this.tickets,
            ultimos4Tickets:this.ultimos4Tickets,
        }
    }
    guardar(){
        //Si existe el archivo
        if(fs.existsSync(this.pathDB)){
            //getDatosActuales contiene la información con todas las modificaciones, por eso es lo que se guarda
            fs.writeFileSync(this.pathDB,JSON.stringify(this.getDatosActuales),{encoding:"utf-8"})
        }
        else{
            //Si no existe el archivo, lo crea 
            fs.writeFileSync(this.pathDB,JSON.stringify(this.getDatosActuales),{encoding:"utf-8"})
        }
    }

    leerDB(){
        if(!fs.existsSync(this.pathDB)){
            return null
        }
        //Si existe
        else{
            //Obtengo la el JSON en string
            const info=fs.readFileSync(this.pathDB,{encoding:'utf-8'})
            //Si está vacio
            if(!info){
                return null
            }
            //Pasamos la info de string a JSON 
            const data=JSON.parse(info)
            const {ultimoTicket,fechaHoy, Tickets, ultimos4Tickets}=data
            //Si la fecha de la DB es de hoy
            if(fechaHoy==new Date().getDate()){
                //Guarda en nuestras variables todo lo que haya en la DB
                this.fechaHoy=fechaHoy
                this.ultimoTicket=ultimoTicket
                this.tickets=Tickets
                this.ultimos4Tickets=ultimos4Tickets

                this.numeroTicket=ultimoTicket
            }
            //Si la fecha no es de hoy, guardamos inicializando todas las variables y con la fecha de hoy 
            else{
                this.guardar()
            }
        }

    }
    crearTicket(){
        this.numeroTicket+=1
        const ticket=new CrearTicket(this.numeroTicket,null)
        //Mandamos el ticket a tickets
        this.tickets.push(ticket)

        this.ultimoTicket=this.numeroTicket
        
        //Guardamos
        this.guardar()

        return ticket
    }

    atenderTicket(escritorio){

        if(this.tickets.length==0){
            return null
        }
        else{
        
            //Recibimos el primer elemento de tickets, lo eliminamos de la lista y lo devolvemos
        const ticket=this.tickets.shift()
            //Guardamos el escritorio que lo está atendiendo
        ticket.escritorio=escritorio
        //Mandamos el ticket atendido a los ultimos4 tickets
        this.ultimos4Tickets.unshift(ticket)

        //Condiciones ultimos4 tickets para que solo muestre 4 elementos
        if(this.ultimos4Tickets.length>4){
            const ultimos4=this.ultimos4Tickets.slice(0,3)
            this.ultimos4Tickets=ultimos4
        }
        
        //Guardamos
        this.guardar()

        return ticket
        }
        
    }
}