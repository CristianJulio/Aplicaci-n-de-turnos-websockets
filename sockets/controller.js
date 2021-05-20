const TicketControl = require("../models/ticket-control");

const ticketControl = new TicketControl();

const socketController = (socket) => {
  socket.emit("ultimo-ticket", `Ticket ${ticketControl.ultimo}`);
  socket.emit('estado-actual', ticketControl.ultimos_4);
  socket.emit('tickets-pendientes', ticketControl.tickets.length);

  socket.on("siguiente-ticket", (payload, callback) => {
    const siguiente = ticketControl.siguiente();
    socket.broadcast.emit('tickets-pendientes', ticketControl.tickets.length);
    callback(siguiente);
  });

  socket.on('atender-ticket', ( { escritorio }, callback ) => {
    if(!escritorio) {
        return callback({
            ok: false,
            msg: 'El escritorio es obligatorio'
        });
    }
    
    const ticket = ticketControl.atenderTicket( escritorio );

    // TODO: Notificar cambio en los últimos cuatro
    socket.broadcast.emit('estado-actual', ticketControl.ultimos_4);

    // Notificar el número de tickets pendientes
    socket.broadcast.emit('tickets-pendientes', ticketControl.tickets.length);
    socket.emit('tickets-pendientes', ticketControl.tickets.length);
    
    if(!ticket) {
        callback({
            ok: false,
            msg: 'Ya no hay tickets pendientes'
        });
    } else {
        callback({
            ok: true,
            ticket 
        })
    }
    
  });
};

module.exports = {
  socketController,
};
