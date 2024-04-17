const fs = require('fs');
const passwords = JSON.parse(fs.readFileSync('./states/passwords.json'));

exports.loginHandle = function(socket, users, loadFunction){
    // socket.on('hi', (data) => console.log('odbjur', data))
    socket.on('password', password => {
        const authorization = passwords[password];
        if (!authorization){
            socket.emit('wrong-password');
            return;
        };
        const loadedState = loadFunction(authorization);
        socket.emit('logged', [authorization, loadedState]);
        const newUser = {};
        newUser[socket.id] = authorization;
        users.push(newUser);
    });
}
