import React, { useState } from 'react'
import { Link } from 'react-router-dom';

const Home = () => {
    const [name, setName] = useState('')
    const [isInstructor, setIsInstructor] = useState(false)
    const toggleCheck = () => {
        setIsInstructor(!isInstructor)
    }
    console.log(isInstructor)
    return (
        <div className="All">

            <div><input placeholder="Name" type="text" onChange={(event) => setName(event.target.value)} /></div>
            <div><input name="isInstructor" type="checkbox" checked={isInstructor} onChange={(event) => { toggleCheck() }} />Instructor</div>
            <div className="Users">
                <Link onClick={event => (!name) ? event.preventDefault() : null} to={`/user?name=${name}&isInstructor=${isInstructor}`}>
                    <button className="signin" type="submit">Sign In</button>
                </Link>
            </div>
        </div>

    )
}

export default Home
