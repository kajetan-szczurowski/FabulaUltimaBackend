const authorization = require('./authorization.js');
const fs = require('fs');
let partyMembers = [];

exports.manageCharacters = function(socket, loggedUsers){
    const users = [];
    authorization.loginHandle(socket, users, loadCharacter, loggedUsers, updatePartyMembers);

    socket.on('character-update', (([characterState, characterID]) => {
        const permission = findUserAuthorization(socket.id, users);
        if (permission !== characterID) return;
        if (permission === 'GM') return;
        saveCharacter(characterState, characterID);
        updatePartyMembers(characterID, characterState, socket);
    }));

    socket.on('disconnect', () => {
        removePartyMember(socket.id, users);
        releaseAuthorization(socket.id, users);
        socket.emit('current-party', gatherParty());
        socket.broadcast.emit('current-party', gatherParty());
    });

    socket.on('party-state', () => {
        socket.emit('current-party', gatherParty());
    });
};


function saveCharacter(characterState, characterID){
    fs.writeFileSync(`./states/character_${characterID}.json`, JSON.stringify(characterState));
}

exports.loadCharacter = function (characterID){
    return loadCharacter(characterID);
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

function releaseAuthorization(id, users){
    users = users.filter(user => user.id !== id);
}

function updatePartyMembers(id, state, socket){
    const foundMember = partyMembers.find(member => member.id === id);
    if (!foundMember) {
        partyMembers.push({...state, id: id});
        socket.emit('current-party', gatherParty());
        socket.broadcast.emit('current-party', gatherParty());
        return;
    }
    const index = partyMembers.indexOf(foundMember);
    partyMembers[index] = {...state, id: id};
    socket.emit('current-party', gatherParty());
    socket.broadcast.emit('current-party', gatherParty());
}

function removePartyMember(id, users){
    const character = findUserAuthorization(id, users);
    if (character) partyMembers = partyMembers.filter(member => member.id !== character);
}

function gatherParty(){
    return partyMembers.map(member => {return {
        name: member.name,
        maxHP: member.maxHP,
        currentHP: member.currentHP,
        currentMagic: member.currentMagic,
        maxMagic: member.maxMagic,
        graphicUrl: member.graphicUrl,
        id: member.id}});
}