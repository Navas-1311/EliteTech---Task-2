// server.js

// 1. Setup Express and HTTP Server
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);

// 2. Setup Socket.IO on the server
const { Server } = require('socket.io');
const io = new Server(server, {
    cors: {
        origin: "*", 
        methods: ["GET", "POST"]
    }
});

// 🛑 CRITICAL: Tell Express to serve static files (CSS, client-side JS) 🛑
app.use(express.static(__dirname)); 

// Serve the index.html file when the root URL is accessed
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// 3. Socket.IO Connection Logic
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // 4. Handle a new chat message from a client (expects { user, text })
    socket.on('chat message', (messageData) => {
        console.log(`Message from ${messageData.user}: ${messageData.text}`);

        // 5. Broadcast the message object to ALL connected clients
        io.emit('chat message', messageData);
    });

    // 6. Handle client disconnection
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// 7. Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});