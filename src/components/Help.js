import React, { useState } from 'react';
import io from "socket.io-client";
const ENDPOINT = "localhost:8080";

let socket;
socket = io(ENDPOINT);

export const Help = (props) => {
    console.log(props.socketId)
    console.log(props.instId)
    const instDisplayName = props.socketId === props.instId ? 'you' : props.instName

    const takeHelp = (event) => {


        // event.preventDefault()
        const help = { id: props.id, userId: props.userId, instId: props.socketId, isTaken: true, stdName: props.stdName, instName: props.name }

        if (help) {
            socket.emit('askHelp', help);
        }
    }
    return (
        <div>
            {console.log('props', props.isTaken === false)}
            {!props.isTaken ? <button className="helptaken" type="button" onClick={(event) => takeHelp(event)}>{`Take help request from ${props.stdName}`}</button> :
                <div>{`Help request of ${props.stdName} is taken by ${instDisplayName}`}</div>}

        </div>
    )

}
