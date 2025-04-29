const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');

// Serve static files
app.use(express.static(path.join(__dirname)));

// Store connected users and chat history
const users = new Map();
const chatHistory = [];
const MAX_HISTORY = 50;

io.on('connection', (socket) => {
    console.log('A user connected');

    // Handle user joining
    socket.on('join', (username) => {
        if (!username || typeof username !== 'string') {
            return socket.emit('error', 'Invalid username');
        }

        // Store user information
        users.set(socket.id, {
            username,
            character: null
        });

        // Broadcast user joined
        io.emit('system', `${username} joined the chat`);
        io.emit('users', Array.from(users.values()));

        // Send chat history to new user
        socket.emit('chat history', chatHistory);
    });

    // Handle chat messages
    socket.on('chat message', (message) => {
        const user = users.get(socket.id);
        if (!user) return;

        const messageObj = {
            username: user.username,
            character: user.character,
            text: message,
            timestamp: new Date().toISOString()
        };

        // Store in chat history
        chatHistory.push(messageObj);
        if (chatHistory.length > MAX_HISTORY) {
            chatHistory.shift();
        }

        // Broadcast message
        io.emit('chat message', messageObj);
    });

    // Handle quiz result sharing
    socket.on('share result', (character) => {
        const user = users.get(socket.id);
        if (!user) return;

        user.character = character;
        users.set(socket.id, user);

        const messageObj = {
            type: 'result',
            username: user.username,
            character: character,
            timestamp: new Date().toISOString()
        };

        chatHistory.push(messageObj);
        io.emit('chat message', messageObj);
        io.emit('users', Array.from(users.values()));
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        const user = users.get(socket.id);
        if (user) {
            io.emit('system', `${user.username} left the chat`);
            users.delete(socket.id);
            io.emit('users', Array.from(users.values()));
        }
    });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});