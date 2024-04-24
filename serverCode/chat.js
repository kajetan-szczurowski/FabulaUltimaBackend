const rolls = require('./rolls.js');
const crypto = require("crypto");
const character = require("./character.js");
const messages = [];

exports.handleSocketChat = function(io, socket, loggedUsers){
    socket.on('chat-message', (payload) => {
        const sender = loggedUsers[socket.id] ?? 'Spy';
        const processed = handleChat(payload, sender, socket);
        if (!processed) return;
        io.emit('messages', processed);
    });

    socket.on('initial-messages', () => {
        sendStartingMessages(socket);
    })
}

function sendStartingMessages(socket){
    socket.emit('messages', messages);
}


function handleChat(payload, sender, socket){
    const processed = processChatMessage(payload, sender, socket);
    if (!processed) return;
    messages.push(processed);
    return messages;
}

function processChatMessage(payload, sender, socket){
    if (typeof payload !== 'string') return null;
    const message = payload.trim();
    if (message.charAt(0) === '/') return handleCommand(message, sender, socket);
    if (message.charAt(0) === '#') return rolls.handleRoll(message, sender);
    return handleMessage(message, sender);
}

function handleMessage(message, senderObject){
    return{
        id: crypto.randomBytes(8).toString("hex"),
        messageTypeName: 'message',
        text: message,
        sender: senderObject.name,
        color: senderObject.color 
    }
}

function handleCommand(command, sender, socket){
    const commandData = command.split(' ');

    if (commandData[0] === '/id' && ['1', '2', '3', '4'].includes(commandData[1]) && sender?.name === 'GM'){
        socket.emit('logged', [commandData[1], character.loadCharacter(commandData[1])]);
    }
}
