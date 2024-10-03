// src/WebSocketComponent.js
import React, { useEffect, useState } from 'react';
import Atmosphere  from 'atmosphere.js';

const WebSocketComponent = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Configure the Atmosphere client
    const request = {
      url: 'ws://localhost:8080/ws',
      contentType: "application/json",
      logLevel: 'debug',
      transport: 'websocket',
      fallbackTransport: 'long-polling',
      onOpen: () => console.log('Connected to WebSocket server'),
      onMessage: (response) => {
        const message = response.responseBody;
        setMessages((prevMessages) => [...prevMessages, message]);
      },
      onError: () => console.log('Connection error'),
      onClose: () => console.log('Connection closed'),
    };

    // Open the WebSocket connection
    const subSocket = Atmosphere.subscribe(request);
    setSocket(subSocket);

    // Clean up WebSocket connection on component unmount
    return () => subSocket.close();
  }, []);

  const sendMessage = () => {
    if (socket) {
      socket.push(input);
      setInput("");
    }
  };

  return (
    <div>
      <h1>WebSocket Communication</h1>
      <div>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
      <div>
        <h2>Messages:</h2>
        <ul>
          {messages.map((msg, index) => (
            <li key={index}>{msg}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default WebSocketComponent;
