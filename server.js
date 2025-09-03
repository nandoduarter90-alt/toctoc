const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const { v4: uuidv4 } = require('uuid');

const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(express.static('public'));

let waitingUser = null;

io.on('connection', (socket) => {
  console.log('👤 Nuevo usuario conectado:', socket.id);

  if (waitingUser) {
    const roomId = uuidv4();
    socket.join(roomId);
    waitingUser.join(roomId);

    io.to(roomId).emit('chat message', '🔗 ¡Estás conectado con alguien!');
    waitingUser = null;
  } else {
    waitingUser = socket;
    socket.emit('chat message', '⌛ Esperando a alguien para hablar...');
  }

  socket.on('chat message', (msg) => {
    const rooms = [...socket.rooms].filter(r => r !== socket.id);
    rooms.forEach(room => {
      io.to(room).emit('chat message', msg);
    });
  });

  socket.on('disconnect', () => {
    console.log('❌ Usuario desconectado:', socket.id);
    if (waitingUser === socket) {
      waitingUser = null;
    }
  });
});

server.listen(3000, () => {
  console.log('🚪 Toctoc escuchando en puerto 3000');
});
