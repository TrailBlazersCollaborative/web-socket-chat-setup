import React, { useEffect, useState } from "react";
import socketIoClient from 'socket.io-client';
import UserLogin from "./UserLogin";
import ChatBoxReciever from "./ChatBoxReciever";
import ChatBoxSender from "./ChatBoxSender";
import InputText from "./InputText";
import Room from "./Room";


export default function ChatContainer() {
    //sets connectction for client to your backend *must be the same backend endpoint*
    // let socketio = socketIoClient('http://localhost:4000');

    const [user, setUser] = useState(localStorage.getItem('user'));
    const [avatar, setAvatar] = useState(localStorage.getItem('avatar'));
    const [rooms, setRooms] = useState(['room1', 'room2', 'room3']);
    const [currentRoom, setCurrentRoom] = useState('room1')

    //all chats recived by client and sent from backend
    const [socketio, setSocketIO] = useState(null);
    const [chats, setChats] = useState({
        'room1': [],
        'room2': [], 
        'room3': []
    });


//  REQUIRES: socketio and socket io client
//  MODIFIES: chats state 
//  EFFECTS: on recieving an event named chat that event will give us a group of chats
//          that is contained within that parcitular socket channel and then we 
//          setChats to that recieved chats
    useEffect(() => {
        setSocketIO(socketIoClient('http://localhost:4000'))
        // axios.get('http://localhost:4000/rooms')
        //       .then((data) => data.data)
        //       .then((parsedData) => {
        //         for (let key in parsedData) {
        //             parsedData[key] = [];
        //         }
        //         setChats(parsedData);
        //       })
        //       .catch((err) => console.log(err));
    }, [])

    useEffect(() => {
        if (socketio) {
            console.log('actually adding listener now')
        socketio.on('recieve-chat', (recievedChats) => {
            addChat(recievedChats.chat);
        });
    }
    }, [socketio]);

    function addChat (chat) {

        setChats((chats)=>{
            const current = chats[chat.currentRoom].slice(0);
            return {...chats, [chat.currentRoom]: [...current, chat]}
        })
    }

    function logout() {
        localStorage.removeItem('user');
        localStorage.removeItem('avatar');
        setUser('')
    }

//  REQUIRES: socketio and socket io client
//  MODIFIES: all other clients' chats
//  EFFECTS: sends an event named chat with the content of chat variable to the backend
//          to be emitted by the backend to all other connected clients
    function sendChatsToBackend(chat) {
        socketio.emit('send-chat', {chat, currentRoom}, () => {
            console.log('reached');
            console.log(chat);
            addChat(chat);
        });
    }


//  REQUIRES: socketio and socket io client
//  MODIFIES: all other clients' chats
//  EFFECTS: updates your list of chats and then send your new chat with your username
//          and avatar to the other clients
    function addMessage(chat) {
        const newChat = {...chat, user, avatar, currentRoom};
        // setChats([...chats, newChat]);
        sendChatsToBackend(newChat);
    }

    function joinRoom(roomName) {
        setCurrentRoom(roomName);
        socketio.emit('join-room', roomName);
    }

    return (
            user ? 
            <div>
                <div style={{display: 'flex', flexDirection:'row', justifyContent:'space-between'}}>
                    <h4>{user}</h4>
                    <p onClick={() => logout()}>Log out</p>
                </div>
                <h3>{currentRoom}</h3>
                {rooms.map((currRoom, id) => {
                    return <button onClick={() => joinRoom(currRoom)}> 
                        {currRoom}
                    </button>
                })}
                {chats[currentRoom].map((chat, index) => {
                    return user === chat.user ?
                    <ChatBoxReciever avatar={chat.avatar} user={chat.user} message={chat.message}/>
                    :
                    <ChatBoxSender avatar={chat.avatar} user={chat.user} message={chat.message}/>
                })}
                <InputText addMessage={addMessage}/>
            </div>
            
            : 
            
            <UserLogin setUser={setUser}/>
    )
}