//ticketManagerDB.js
const Ticket = require('./models/ticket');

class TicketManagerDB {
    async createTicket(ticketData) {
        const ticket = new Ticket(ticketData);
        await ticket.save();
        return ticket;
    }
    
    async getTicketById(id) {
        return await Ticket.findById(id);
    }
    
    // Otros métodos si es necesario...
}

module.exports = TicketManagerDB;