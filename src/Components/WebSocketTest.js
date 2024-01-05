// WebSocketTest is for testing the the websocket, plays no part in the functionality

import React, { useEffect } from 'react';
import io from 'socket.io-client';
function WebSocketTest() {
    useEffect(() => {
        const socket = io('http://localhost:8000');
    
        socket.on('connect', () => {
          console.log('Connected to WebSocket server');
        });
    
        socket.emit('message', 'Hello, WebSocket server');
      }, []);

  return (
    <div>
      <h1>WebSocket Test</h1>
    </div>
  );
}

export default WebSocketTest;
