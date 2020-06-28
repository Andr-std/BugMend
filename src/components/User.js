import React, { useState, useEffect } from 'react'
import io from "socket.io-client";
import queryString from 'query-string'
import { Message } from './Message';
import { Help } from './Help';
const ENDPOINT = "localhost:8080";


let socket;
// let localquestions = [];
// let localmessages = [];


const User = () => {

    const [name, setName] = useState('');
    const [isInstructor, setIsInstructor] = useState(false)
    const [messages, setMessages] = useState([])
    const [helps, setHelps] = useState([])
    const [messageBody, setMessageBody] = useState('')
    // const [message, setMessage] = useState({})
    const [isAnonym, setIsAnonym] = useState(true)
    const [localmessages, setLocalMessages] = useState([])
    const [localquestions, setLocalQuestions] = useState([])
    // const [isAskedForHelp, setIsAskedForHelp] = useState(false)

    const toggleCheck = () => {
        setIsAnonym(!isAnonym)
    }
    const [isPublic, setIsPublic] = useState(true)
    const toggleCheck2 = () => {
        console.log('before', isPublic)
        setIsPublic(!isPublic)
        console.log('after', isPublic)
    }
    // const [isTaken, setIsTaken] = useState(false)
    // const takeHelp = () => {

    //     setIsTaken(!isTaken)

    // }

    useEffect(() => {
        const { name, isInstructor } = queryString.parse(window.location.search)
        // console.log('1', isInstructor)
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
        console.log('effect1', helps)

        // console.log(messages)
        return () => {
            socket.emit('disconnect');

            socket.off();
        }
    }, [setName])//[ENDPOINT, window.location.search]

    useEffect(() => {
        console.log(messages)
        socket.on('message', (message) => {
            // console.log(messages)
            // setMessages([...messages, message])
            setMessages(prev => [...prev, message])
            // console.log('effect', message)
            // console.log('effect', messages)
        })
        setHelps([])
        console.log('effect2', helps)
        socket.on('helps', (helps) => {
            // console.log(messages)
            // setMessages([...messages, message])
            setHelps(helps)//prev => [...prev, ...helps]
            // console.log('effect', message)
            // console.log('effect', messages)
        })
        // console.log('effect3', helps)
    }, [])
    const sendMessage = (event) => {


        // event.preventDefault()
        const message = {
            name: name, id: messages.length + 1, userId: socket.id,
            body: messageBody, isQuestion: true, isPublic, isAnonym,
            Qname: name, Rname: ''
        }

        if (message) {
            socket.emit('sendMessage', message, setMessageBody(''));
        }
    }

    const askHelp = (event) => {

        // event.preventDefault()
        const help = {
            userId: socket.id, stdName: name,
            instName: '', instId: '', isSolved: false
        }
        console.log('askHelp', help)
        if (help) {
            socket.emit('askHelp', help);
            // setIsAskedForHelp(!isAskedForHelp)
        }
    }


    useEffect(() => {

        // console.log(messages)
        // console.log('instr', isInstructor)
        if (isInstructor === 'true') {
            // console.log(isInstructor)
            let newLocalQuestions = messages.filter((localquestion) => {
                return localquestion.isQuestion
            })
            setLocalQuestions(newLocalQuestions)
        }
        else {
            // console.log('soething')
            let newLocalQuestions = messages.filter((localquestion) => {
                // console.log(localquestion.userId === socket.id)
                // console.log('pub', localquestion.isPublic)
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
        // console.log(localmessages)
        // console.log(localquestions)
    }, [localquestions])

    // console.log('2', isInstructor)
    // console.log(localmessages)
    return (

        <div>
            <div>
                <h2>{`Welcome ${name}!`}</h2>
                {isInstructor === 'true' ? null :
                    <div>
                        Message: <input value={messageBody} onChange={(event) => setMessageBody(event.target.value)} />
                        <div><input name="isAnonym" type="checkbox" checked={isAnonym} onChange={(event) => { toggleCheck() }} />Anonymous Question</div>
                        {isAnonym ? <div>Anonymous questions are public!</div> :
                            <div><input name="isPublic" type="checkbox" checked={isPublic} onChange={(event) => { toggleCheck2() }} /> Public Question</div>
                        }

                        <button className="send" type="submit" onClick={(event) => sendMessage(event)}>Send</button>
                        {helps.filter(i => i.stdName === name).length === 0 ? <button className="help" type="submit" onClick={(event) => askHelp(event)}>Ask for help</button> :
                            helps.filter(i => i.stdName === name && !i.instName).length === 1 ? <div>There are {helps.map(i => i.stdName).indexOf(name)} help request(s) ahead of yours!</div> :
                                helps.filter(i => i.stdName === name && i.instName).length === 1 ? <div>Instructor {helps.filter(i => i.stdName === name && i.instName)[0].instName} took your help request!</div> : null}

                        {/* {isAskedForHelp ? <div>There are {helps.filter(i => !i.instName).length - 1} help request(s) ahead of yours!</div> : <button className="help" type="submit" onClick={(event) => askHelp(event)}>Ask for help</button>} */}
                    </div>}
                {/* <span>{messages.length}</span> */}
                {console.log('map', isInstructor === 'true')}
                {isInstructor === 'true' ? helps.map(helpItem => (
                    <Help id={helpItem.id}
                        // isTaken={helpItem.isTaken}
                        userId={helpItem.userId}
                        instId={helpItem.instId}
                        socketId={socket.id}
                        instName={helpItem.instName}
                        name={name}
                        stdName={helpItem.stdName}
                        // isSolved={helpItem.isSolved}
                        key={helpItem.id} />
                )) : null}
                {localmessages.map(localmessage => (
                    <Message body={localmessage.body}
                        messageId={localmessage.id}
                        isQuestion={localmessage.isQuestion}
                        userId={localmessage.userId}
                        Qname={localmessage.isAnonym ? 'Anonymous user' : localmessage.Qname}
                        socketId={socket.id}
                        Rname={localmessage.Rname}
                        name={name}
                        messages={messages}
                        key={localmessage.id} />
                ))}


            </div>
        </div>

    )


}



export default User;
