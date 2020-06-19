import React from "react"; //, { useState, useEffect }
import { BrowserRouter as Router, Route } from "react-router-dom";
// import socketIOClient from "socket.io-client";
import Home from './components/Home';
import Student from './components/Student';
import Instructor from './components/Instructor';
// const ENDPOINT = "localhost:8080";

const App = () => {
  return (
    <Router>
      <Route path='/' exact component={Home}></Route>
      <Route path='/instructor' component={Instructor}></Route>
      <Route path='/student' component={Student}></Route>
    </Router>
  )
};

// function App() {
//   const [response, setResponse] = useState("");

//   useEffect(() => {
//     const socket = socketIOClient(ENDPOINT);
//     socket.on("FromAPI", data => {
//       setResponse(data);

//     });
//   }, []);

//   return (

//   );
// }

export default App;
