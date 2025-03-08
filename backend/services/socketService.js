import { Server } from 'socket.io';

class SocketService {
  constructor() {
    this.io = null;
  }

  initialize(server) {
    this.io = new Server(server, {
      cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        methods: ['GET', 'POST']
      }
    });

    this.io.on('connection', (socket) => {
      console.log('Client connected:', socket.id);

      // Handle joining a spreadsheet room
      socket.on('join_spreadsheet', (spreadsheetId) => {
        socket.join(spreadsheetId);
        console.log(`Client ${socket.id} joined spreadsheet: ${spreadsheetId}`);
      });

      // Handle leaving a spreadsheet room
      socket.on('leave_spreadsheet', (spreadsheetId) => {
        socket.leave(spreadsheetId);
        console.log(`Client ${socket.id} left spreadsheet: ${spreadsheetId}`);
      });

      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
      });
    });
  }

  // Method to emit updates to all clients viewing a specific spreadsheet
  emitSpreadsheetUpdate(spreadsheetId, data) {
    if (this.io) {
      this.io.to(spreadsheetId).emit('spreadsheet_updated', {
        spreadsheetId,
        data
      });
    }
  }

  // Method to emit column updates
  emitColumnUpdate(spreadsheetId, columnData) {
    if (this.io) {
      this.io.to(spreadsheetId).emit('column_updated', {
        spreadsheetId,
        columnData
      });
    }
  }
}

export default new SocketService(); 