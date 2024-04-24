
const express = require('express');
const fs = require('fs');
const app = express();
const cors = require('cors');
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    // origin: ["http://localhost:5173"]
    origin: ["https://okruszek-ultima.netlify.app"]
  }
});
const PORT = process.env.PORT || 3000;
const socket = require('./serverCode/sockets.js');

server.listen(PORT, () => {
    console.log('listening on ', PORT);
});

socket.handleSockets(io);



