import React from "react";

export default function Room ({room, joinRoom}) {
    return (
        <button onClick={() => joinRoom(room)}> 
            {room}
        </button>
    )
}