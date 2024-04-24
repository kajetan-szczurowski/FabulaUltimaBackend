const chat = require('./chat.js');
const characterManagement = require('./character.js');

const loggedUsers = {};

exports.handleSockets = function (io){
    io.on('connection', (socket) => {
        // chat.sendStartingMessages(socket);
        chat.handleSocketChat(io, socket, loggedUsers);
        characterManagement.manageCharacters(socket, loggedUsers);
    });
}