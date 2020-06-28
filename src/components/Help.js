import React from 'react';
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
        const help = {
            userId: props.userId, instId: props.socketId,
            stdName: props.stdName, instName: props.name, isSolved: false
        }

        if (help) {
            socket.emit('askHelp', help);
        }
    }
    const helpSolved = (event) => {


        // event.preventDefault()
        const help = {
            userId: props.userId, instId: '',
            stdName: props.stdName, instName: '', isSolved: true
        }

        if (help) {
            socket.emit('askHelp', help);
        }
    }
    return (
        <div>
            {/* {console.log('props', props.isTaken === false)} */}
            {!props.instName ? <button className="helptaken" type="button" onClick={(event) => takeHelp(event)}>{`Take help request from ${props.stdName}`}</button> :
                <div>{`Help request of ${props.stdName} is taken by ${instDisplayName}`}{instDisplayName === 'you' ? <button className="helptaken" type="button" onClick={(event) => helpSolved(event)}>Done!</button> : null}</div>}

        </div>
    )

}
