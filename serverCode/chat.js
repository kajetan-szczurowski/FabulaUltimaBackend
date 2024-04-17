const rolls = require('./rolls.js');
const crypto = require("crypto");
const messages = [];

exports.sendStartingMessages = function(socket){
    socket.emit('messages', messages);
}

exports.handleSocketChat = function(io, socket){
    socket.on('chat-message', (payload) => {
        const processed = handleChat(payload);
        if (!processed) return;
        io.emit('messages', processed);
    })
}

function handleChat(payload){
    const processed = processChatMessage(payload);
    if (!processed) return;
    messages.push(processed);
    return messages;
}

function processChatMessage(payload){
    if (typeof payload !== 'string') return null;
    const message = payload.trim();
    if (message.charAt(0) === '#') return rolls.handleRoll(message);
    return handleMessage(message);
}

function handleMessage(message){
    return{
        id: crypto.randomBytes(8).toString("hex"),
        messageTypeName: 'message',
        text: message,
        sender: 'Spy'
    }
}
