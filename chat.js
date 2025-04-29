// Initialize socket connection
const socket = io();

// DOM Elements
const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');
const messagesDiv = document.getElementById('messages');
const usersList = document.getElementById('users');
const shareResultBtn = document.getElementById('share-result');

// Get username and character result
let username;
while (!username) {
    username = prompt('Please enter your username:');
}
const quizResult = localStorage.getItem('quizResult');

// Join chat
socket.emit('join', username);

// Handle form submission
messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value.trim();
    if (message) {
        socket.emit('chat message', message);
        messageInput.value = '';
    }
});

// Share quiz result
shareResultBtn.addEventListener('click', () => {
    if (quizResult) {
        socket.emit('share result', quizResult);
    } else {
        alert('Please take the quiz first!');
    }
});

// Display chat message
function displayMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message';
    
    if (message.type === 'result') {
        messageDiv.innerHTML = `
            <span class="username">${message.username}</span>
            <span class="timestamp">${new Date(message.timestamp).toLocaleTimeString()}</span>
            <p>I got matched with ${message.character}! 🎉</p>
        `;
    } else {
        messageDiv.innerHTML = `
            <span class="username">${message.username}</span>
            ${message.character ? `<span class="character-tag">${message.character}</span>` : ''}
            <span class="timestamp">${new Date(message.timestamp).toLocaleTimeString()}</span>
            <p>${escapeHtml(message.text)}</p>
        `;
    }
    
    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// Display system message
function displaySystemMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message system-message';
    messageDiv.textContent = message;
    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// Update users list
function updateUsers(users) {
    usersList.innerHTML = users.map(user => `
        <li>
            ${escapeHtml(user.username)}
            ${user.character ? `<span class="character-tag">${user.character}</span>` : ''}
        </li>
    `).join('');
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Socket event listeners
socket.on('chat message', displayMessage);
socket.on('system', displaySystemMessage);
socket.on('users', updateUsers);
socket.on('chat history', (history) => {
    history.forEach(displayMessage);
});
socket.on('error', (error) => {
    alert(error);
});