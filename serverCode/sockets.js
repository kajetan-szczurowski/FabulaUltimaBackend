const chat = require('./chat.js');
const characterManagement = require('./character.js');

exports.handleSockets = function (io){
    io.on('connection', (socket) => {
        chat.sendStartingMessages(socket);
        chat.handleSocketChat(io, socket);
        characterManagement.manageCharacters(socket)
    });
}