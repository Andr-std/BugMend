import React, { useState, useEffect } from 'react'
import io from "socket.io-client";
import queryString from 'query-string'
import { Message } from './Message';
const ENDPOINT = "localhost:8080";


let socket;
// let localquestions = [];
// let localmessages = [];


const User = () => {

    const [, setName] = useState('');
    const [isInstructor, setIsInstructor] = useState(false)
    const [messages, setMessages] = useState([])
    const [helps, setHelps] = useState([])
    const [messageBody, setMessageBody] = useState('')
    // const [message, setMessage] = useState({})
    const [isAnonym, setIsAnonym] = useState(true)
    const [localmessages, setLocalMessages] = useState([])
    const [localquestions, setLocalQuestions] = useState([])

    const toggleCheck = () => {
        setIsAnonym(!isAnonym)
    }
    const [isPublic, setIsPublic] = useState(true)
    const toggleCheck2 = () => {
        console.log('before', isPublic)
        setIsPublic(!isPublic)
        console.log('after', isPublic)
    }
    const [isTaken, setIsTaken] = useState(false)
    const takeHelp = () => {

        setIsTaken(!isTaken)

    }

    useEffect(() => {
        const { name, isInstructor } = queryString.parse(window.location.search)
        // console.log(isInstructor)
        setName(name)
        setIsInstructor(isInstructor)

        socket = io(ENDPOINT);

        socket.emit('join', { name, isInstructor });
        socket.on('messages', (messages) => {
            // console.log(messages)
            setMessages(prev => [...prev, ...messages])
            // messagesObj.current = messages
            // console.log(messages)
        })
        socket.on('helps', (helps) => {
            // console.log(messages)
            setHelps(prev => [...prev, ...helps])
            // messagesObj.current = messages
            // console.log(messages)
        })

        // console.log(messages)
        return () => {
            socket.emit('disconnect');

            socket.off();
        }
    }, [setName, isInstructor])//[ENDPOINT, window.location.search]

    useEffect(() => {
        console.log(messages)
        socket.on('message', (message) => {
            // console.log(messages)
            // setMessages([...messages, message])
            setMessages(prev => [...prev, message])
            // console.log('effect', message)
            // console.log('effect', messages)
        })
        socket.on('help', (help) => {
            // console.log(messages)
            // setMessages([...messages, message])
            setHelps(prev => [...prev, help])
            // console.log('effect', message)
            // console.log('effect', messages)
        })
    }, [])
    const sendMessage = (event) => {


        // event.preventDefault()
        const message = { id: messages.length + 1, userId: socket.id, body: messageBody, isQuestion: true, isPublic, isAnonym }

        if (message) {
            socket.emit('sendMessage', message);
        }
    }

    const askHelp = (event) => {

        // event.preventDefault()
        const help = { id: helps.length + 1, userId: socket.id, isTaken: false }

        if (help) {
            socket.emit('askHelp', help);
        }
    }


    useEffect(() => {

        console.log(messages)
        console.log('instr', isInstructor)
        if (isInstructor === true) {
            console.log(isInstructor)
            let newLocalQuestions = messages.filter((localquestion) => {
                return localquestion.isQuestion
            })
            setLocalQuestions(newLocalQuestions)
        }
        else {
            console.log('soething')
            let newLocalQuestions = messages.filter((localquestion) => {
                // console.log(localquestion.userId === socket.id)
                console.log('pub', localquestion.isPublic)
                return ((localquestion.userId === socket.id) || localquestion.isPublic) && localquestion.isQuestion
            })
            console.log(newLocalQuestions)
            setLocalQuestions(newLocalQuestions)
        }
    }, [messages, isInstructor])
    useEffect(() => {

        let localmessages = []
        localquestions.forEach(localquestion => { localmessages.push(localquestion, ...messages.filter(messageitem => { return messageitem.messageId === localquestion.id })) })
        setLocalMessages(localmessages)
        console.log(localmessages)
        console.log(localquestions)
    }, [localquestions])

    // console.log(localquestions)
    // console.log(localmessages)
    return (

        <div>
            <div>
                <input onChange={(event) => setMessageBody(event.target.value)} />
                <div><input name="isAnonym" type="checkbox" checked={isAnonym} onChange={(event) => { toggleCheck() }} />Anonymous Question</div>
                {isAnonym ? <div>Anonymous questions are public!</div> :
                    <div><input name="isPublic" type="checkbox" checked={isPublic} onChange={(event) => { toggleCheck2() }} /> Public Question</div>
                }

                <button className="send" type="submit" onClick={(event) => sendMessage(event)}>Send</button>
                {console.log('inst', isInstructor)}
                {isInstructor ? null : <button className="help" type="submit" onClick={(event) => askHelp(event)}>Ask for help</button>}

                <span>{messages.length}</span>
                {helps.map(helpItem => (
                    helpItem.isTaken ? <button className="helptaken" type="submit" onClick={(event) => takeHelp(event)}>Take help request</button> : 'Help request taken'
                ))}
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
