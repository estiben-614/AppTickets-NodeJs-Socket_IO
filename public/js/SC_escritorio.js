const socket=io()

// Referencia HTML
const lblPendientes=document.querySelector('#lblPendientes')
const sinTickets=document.querySelector('span')
const escritorio=document.querySelector('h1')
const button=document.querySelector('button')
const atendiendoA=document.querySelector('small')


sinTickets.style.display='none'//Lo ocultamos porque si hay tickets

//Recuperamos el Escritorio introducido en el input del index
const searchParams= new URLSearchParams(window.location.search)
const nombreEscritorio=searchParams.get('escritorio') //Nombre del escritorio ingresado
escritorio.innerHTML=nombreEscritorio 



//Recibimos los tickets pendientes
socket.on("cola",ticketsPendientes=>{

    
    if(ticketsPendientes!=0){
        sinTickets.style.display='none'
    }
    else{
        sinTickets.style.display=''
    }
    lblPendientes.innerHTML=ticketsPendientes
})

//Creamos un evento para el boton AtenderSiguienteTicket
button.addEventListener('click',()=>{
    //Mandamos una función y el escritorio
    socket.emit("atendiendoA",nombreEscritorio,(ticket)=>{
        atendiendoA.innerHTML=ticket
    })
})

//Recibimos la notificación de que no hay mas tickets
socket.on("atendiendoA",noHay=>{
    sinTickets.style.display=''
    atendiendoA.innerHTML='Nadie'
})