const socket=io()

//referencias HTML 
const button=document.querySelector('button')
const lblNuevoTicket=document.querySelector('#lblNuevoTicket')

button.addEventListener('click',()=>{
    //Emitimos el evento para crear el ticket
    socket.emit("crearTicket",(ticket)=>{
        lblNuevoTicket.innerHTML=ticket
    })
})

//Recibimos el último ticket que se ha creado para mostrarlo desde el inicio
socket.on("ultimoTicket",ultimoTicket=>{
    lblNuevoTicket.innerHTML='Ticket : '+ultimoTicket
})