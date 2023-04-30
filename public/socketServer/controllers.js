import { TicketControllers } from "../../model/ticketControlls.js";

const ticketControlls=new TicketControllers()

export const socketServer=(socket)=>{
    //Enviar los tickets pendientes desde un inicio
    socket.emit("cola",ticketControlls.tickets.length)

    //Mandemos los ultimos4Tickets desde el inicio para el público
    socket.emit("ultimos4",ticketControlls.ultimos4Tickets)

    socket.on("crearTicket",callback=>{

        //ticketControlls.crearTicket() nos devuelve el ticket 
        const ticket=ticketControlls.crearTicket()
        //Pasamos al callback el numero del ticket--> Funcion que muestra los tiques 
        callback('Ticket : '+ticket.numeroTicket)
        

        //Mandamos al escritorio los tickets pendientes (cola) cada vez que creamos uno nuevo
        socket.broadcast.emit("cola",ticketControlls.tickets.length)
        socket.emit("cola",ticketControlls.tickets.length)

        
    })

    //Mostremos desde el inicio el ultimo ticket que se ha creado
    socket.emit("ultimoTicket",ticketControlls.ultimoTicket)

    //Recibimos la funcion y el escritorio que atiende al ticket para pasarlo como argumento
    socket.on("atendiendoA",(escritorio,callback)=>{
       
        //Devuelve el ticket que se etendió
        const ticket=ticketControlls.atenderTicket(escritorio)
        if(ticket!==null){
            callback('Ticket: '+ticket.numeroTicket)
            //Mandemos los ultimos4Tickets actualizados cuando se atiende un ticket
            socket.broadcast.emit("ultimos4",ticketControlls.ultimos4Tickets)
        }
        else{
            //Si ticket==null, no hay mas tickets
            socket.emit("atendiendoA",ticket)

             
        }   

        //Mostramos la cola pendiente luego de atentes a un cliente
        socket.broadcast.emit("cola",ticketControlls.tickets.length)
        socket.emit("cola",ticketControlls.tickets.length)

    })

    
}