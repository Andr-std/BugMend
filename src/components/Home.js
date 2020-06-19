import React, { useState } from 'react'
import { Link } from 'react-router-dom';

const Home = () => {
    const [name, setName] = useState('')
    return (
        <div className="All">
            <div className="Instructors">
                <div><input placeholder="Name" type="text" onChange={(event) => setName(event.target.value)} /></div>
                <Link onClick={event => (!name) ? event.preventDefault() : null} to={`/instructor?name=${name}`}>
                    <button className="signin" type="submit">Sign In</button>
                </Link>
            </div>
            <div className="Students">
                <div><input placeholder="Name" type="text" onChange={(event) => setName(event.target.value)} /></div>
                <Link onClick={event => (!name) ? event.preventDefault() : null} to={`/student?name=${name}`}>
                    <button className="signin" type="submit">Sign In</button>
                </Link>
            </div>
        </div>

    )
}

export default Home
