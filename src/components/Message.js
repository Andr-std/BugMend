import React, { useState } from 'react';
import io from "socket.io-client";
const ENDPOINT = "localhost:8080";

let socket;
socket = io(ENDPOINT);

export const Message = (props) => {
    const [isOpenForAnswer, setIsOpenForAnswer] = useState(false)
    const [messageBody, setMessageBody] = useState('')

    const sendMessage = (event) => {


        // event.preventDefault()
        const message = { id: props.messages.length + 1, messageId: props.messageId, userId: props.userId, body: messageBody, isQuestion: false, isPublic: true, isAnonym: true }

        if (message) {
            socket.emit('sendMessage', message, () => setMessageBody(''));
        }
    }
    return (
        <div>
            {props.body}
            {props.isQuestion ? <button className="send" type="button" onClick={(event) => setIsOpenForAnswer(!isOpenForAnswer)}>Reply</button> : null}
            {isOpenForAnswer ? <input onChange={(event) => setMessageBody(event.target.value)} /> : null}
            {isOpenForAnswer ? <button className="send" type="submit" onClick={(event) => sendMessage(event)}>Send</button> : null}
        </div>
    )

}

// export default Message;
