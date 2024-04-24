const fs = require('fs');
const passwords = JSON.parse(fs.readFileSync('./states/passwords.json'));

exports.loginHandle = function(socket, users, loadFunction, loggedUsers, updatePartyMembers){
    // socket.on('hi', (data) => console.log('odbjur', data))
    socket.on('password', password => {
        const authObject = passwords[password];
        if (!authObject){
            socket.emit('wrong-password');
            return;
        };
        const authorizedCharacter = authObject.character;

        const loadedState = authorizedCharacter !== 'GM' ? loadFunction(authorizedCharacter) : loadFunction('1');
        socket.emit('logged', [authorizedCharacter, loadedState]);
        if (authorizedCharacter !== 'GM') updatePartyMembers(authorizedCharacter, loadedState, socket);
        const newUser = {};
        newUser[socket.id] = authorizedCharacter;
        const loggedName = authorizedCharacter === 'GM'? 'GM' : loadedState.name;
        loggedUsers[socket.id] = {name: loggedName, color: authObject.color} ;
        users.push(newUser);
    });
}
