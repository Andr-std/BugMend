import React, { useState, useEffect } from 'react'
import io from "socket.io-client";
import queryString from 'query-string'
import { Message } from './Message';
const ENDPOINT = "localhost:8080";


let socket;
// const localmessages = [];


const User = () => {
    const [name, setName] = useState('');
    const [isInstructor, setIsInstructor] = useState(false)
    const [messages, setMessages] = useState([])
    const [message, setMessage] = useState({})
    const [isAnonym, setIsAnonym] = useState(false)

    const toggleCheck = () => {
        setIsAnonym(!isAnonym)
    }
    const [isPublic, setIsPublic] = useState(true)
    const toggleCheck2 = () => {
        setIsPublic(!isPublic)
    }

    useEffect(() => {
        const { name, isInstructor } = queryString.parse(window.location.search)
        setName(name)
        setIsInstructor(isInstructor)

        socket = io(ENDPOINT);

        socket.emit('join', { name, isInstructor });
        socket.on('messages', (messages) => {
            console.log(messages)
            setMessages(messages)
            console.log(messages)
        })

        console.log(messages)
        return () => {
            socket.emit('disconnect');

            socket.off();
        }
    }, [ENDPOINT, window.location.search])

    useEffect(() => {
        socket.on('message', (message) => {
            setMessages([...messages, message])

            console.log('effect', message)
            console.log('effect', messages)
        })
    })

    const sendMessage = (event) => {
        console.log('sendmessage', message)
        console.log('sendmessage', messages)
        event.preventDefault()
        if (message) {
            socket.emit('sendMessage', message, () => setMessage({}));
        }
    }
    const localmessages = messages.filter((localmessage) => {
        return (localmessage.userId == socket.id) || localmessage.isPublic
    })
    console.log(localmessages)
    return (

        <div>
            <div>
                <input onChange={(event) => setMessage({ id: messages.length + 1, userId: socket.id, body: event.target.value, isQuestion: true, isPublic, isAnonym })} />
                <div onClick={() => toggleCheck()}><input name="isAnonym" type="checkbox" checked={!isAnonym} onChange={toggleCheck} />Anonymous Question</div>
                {isAnonym ? <div onClick={() => toggleCheck2()}><input name="isPublic" type="checkbox" checked={isPublic} onChange={toggleCheck2} /> Public Question</div> :
                    <div>Anonymous questions are public!</div>}

                <button className="send" type="submit" onClick={(event) => sendMessage(event)}>Send</button>


                <span>{messages.length}</span>
                {localmessages.map(localmessage => (
                    <Message body={localmessage.body}
                        messageId={localmessage.id}
                        isQuestion={localmessage.isQuestion}
                        userId={localmessage.userId}
                        messages={messages}
                        key={localmessage.id} />
                ))}


            </div>
        </div>

    )


}



export default User;
