const express = require('express');
const roomController = require('./rooms')
const cors = require('cors');

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

app.use(cors())

// REQUIRES: http required in, app is declared
// MODIFIES: app
// EFFECTS: constructor function to recreate the server with socket.io and still use the express library abstraction
const server = http.createServer(app);

// REQUIRES: Server, server
// MODIFIES: 
// EFFECTS: create a new http server, modifying cors to allow the server to accept request from multiple clients
const io = new Server(server, {
    cors:{
        origin:'*',
        methods: ["GET", "POST"]
    }
});

// REQUIRES: 
// MODIFIES: 
// EFFECTS: function to handle connection from multiple clients -> visualisation: (client -> server -> client)
//socket is the client's socket connection
//socket == client
//io  == server
io.on('connection', (socket) => {
    console.log('connection succesfully', socket.id);

    //TODO: create a join room function
    socket.on('join-room', room => {
        console.log(room);
        socket.join(room);
        // socket.to(room.roomName).emit( `${room.user} joined room ${room.roomName}`)
    })


//     REQUIRES: socket connection
//     MODIFIES: other connected clients
//     EFFECTS on recieving a "chat" the server will then send this chat to other connected clients
    socket.on('send-chat', (data, cb) => {
        console.log(data);
        socket.to(data.currentRoom).emit('recieve-chat', data);
        cb();
    })

    //     REQUIRES: socket connection
    //     MODIFIES: client
    //     EFFECTS: disconnect from the socket 
    socket.on('disconnect', () => {
        // console.log('disconnected');
    })
}) 

app.get('/rooms', roomController.getRooms, (req, res) => {
    res.status(200).json(res.locals.rooms)
})

server.listen(4000, () => console.log('listen on port 4000'))