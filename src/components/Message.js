import React, { useState, useEffect } from 'react';
import io from "socket.io-client";
const ENDPOINT = "localhost:8080";

let socket;
socket = io(ENDPOINT);

export const Message = (props) => {
    const [isOpenForAnswer, setIsOpenForAnswer] = useState(false)
    const [message, setMessage] = useState({})

    const sendMessage = (event) => {
        event.preventDefault()
        if (message) {
            socket.emit('sendMessage', message, () => setMessage({}));
        }
    }
    return (
        <div>
            {props.body}
            {props.isQuestion ? <button className="send" type="button" onClick={(event) => setIsOpenForAnswer(!isOpenForAnswer)}>Reply</button> : null}
            {isOpenForAnswer ? <input onChange={(event) => setMessage({
                id: props.messages.length + 1,
                messageId: props.messageId,
                userId: props.userId,
                body: event.target.value,
                isQuestion: false, isPublic: true,
                isAnonym: true
            })} /> : null}
            {isOpenForAnswer ? <button className="send" type="submit" onClick={(event) => sendMessage(event)}>Send</button> : null}
        </div>
    )

}

// export default Message;
