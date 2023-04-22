const express = require('express');
// REQUIRES: require in http module
// MODIFIES: 
// EFFECTS: allows us to use the http library, which is required in configuring the server with socket.io
//          since socket.io allows real time bi-directional communication without a user needing to refresh the page
const http = require('http');
// REQUIRES: require in socket.io and then using its Server functionality
// MODIFIES: 
// EFFECTS: we can utilize the socket.io library stored in the server variable, allows us to recreate our server with socket.io
const Server = require('socket.io').Server
const app = express();

// REQUIRES: http required in, app is declared
// MODIFIES: app
// EFFECTS: constructor function to recreate the server with socket.io and still use the express library abstraction
const server = http.createServer(app);

// REQUIRES: Server, server
// MODIFIES: 
// EFFECTS: create a new http server, modifying cors to allow the server to accept request from multiple clients
const io = new Server(server, {
    cors:{
        origin:'*'
    }
});

// REQUIRES: 
// MODIFIES: 
// EFFECTS: function to handle connection from multiple clients -> visualisation: (client -> server -> client)
io.on('connection', (socket) => {
    console.log('connection succesfully')

//     REQUIRES: socket connection
//     MODIFIES: other connected clients
//     EFFECTS on recieving a "chat" the server will then send this chat to other connected clients
    socket.on('chat', chat => {
        io.emit('chat', chat);
    })

    //     REQUIRES: socket connection
    //     MODIFIES: client
    //     EFFECTS: disconnect from the socket

    socket.on('disconnect', () => {
        console.log('disconnected');
    })
}) 

server.listen(4000, () => console.log('listen on port 4000'))