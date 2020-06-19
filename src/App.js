import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
const ENDPOINT = "localhost:8080";

function App() {
  const [response, setResponse] = useState("");

  useEffect(() => {
    const socket = socketIOClient(ENDPOINT);
    socket.on("FromAPI", data => {
      setResponse(data);

    });
  }, []);

  return (
    <p>
      It is working!! The {response} is here!!
    </p>
  );
}

export default App;
