// Referencia html
const lblEscritorio = document.querySelector('h1');
const btnAtender = document.querySelector('button');
const lblSmall = document.querySelector('small');
const divAlerta = document.querySelector('.alert');
const lblPendientes = document.querySelector('#lblPendientes');

const searchParams = new URLSearchParams( window.location.search );

if( !searchParams.has('escritorio') ) {
  window.location = 'index.html';
  throw new Error('El escritorio es obligatorio');
}

const escritorio = searchParams.get('escritorio');
lblEscritorio.innerText = 'Escritorio: ' + escritorio;
divAlerta.style.display = 'none';

const socket = io();

socket.on("connect", () => {
  btnAtender.disabled = false;
});

socket.on("disconnect", () => {
  btnAtender.disabled = true;
});

// socket.on("ultimo-ticket", (ultimo) => {
//   lblNuevoTicket.innerText = ultimo;
// });

btnAtender.addEventListener("click", () => {
  const payload = {
    escritorio
  }
  
  socket.emit('atender-ticket', payload, ( { ok, ticket, msg } ) => {
    if(!ok) {
      lblSmall.innerText = 'Nadie '
      return divAlerta.style.display = 'block';
    }

    lblSmall.innerText = 'Ticket ' + ticket.numero;
  });
});

socket.on('tickets-pendientes', ( pendientes ) => {
  if(pendientes !== 0) {
    divAlerta.style,display = 'none';
  }
  lblPendientes.innerText = pendientes;
})
