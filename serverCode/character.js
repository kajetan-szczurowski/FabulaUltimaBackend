const authorization = require('./authorization.js');
const fs = require('fs');

exports.manageCharacters = function(socket){
    const users = [];
    authorization.loginHandle(socket, users, loadCharacter);

    socket.on('character-update', (([characterState, characterID]) => {
        const permission = findUserAuthorization(socket.id, users);
        if (permission !== characterID) return;
        console.log(characterState)
        saveCharacter(characterState, characterID);
    }))
};

function saveCharacter(characterState, characterID){
    fs.writeFileSync(`./states/character_${characterID}.json`, JSON.stringify(characterState));
}

function loadCharacter(characterID){
    const path = `./states/character_${characterID}.json`;
    if (!fs.existsSync(path)) return;
    return JSON.parse(fs.readFileSync(path));
}

function findUserAuthorization(id, users){
    for (const oneUser of users){
        const authorization = oneUser[id];
        if (authorization) return authorization;
    }

}