// NewAjastin.js Simplified new version of Ajastin.js

import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
const socket = io('http://localhost:8000');

const NewAjastin = () => {
  const [isRunning, setIsRunning] = useState(false);

  const startTimer = () => {
    setIsRunning(true);

    socket.emit('startTimer');

    console.log('Start Timer');
  };

  const stopTimer = () => {
    setIsRunning(false);

    socket.emit('stopTimer');

    console.log('Stop Timer');
  };

  return (
    <div>
      <h3>NewAjastin</h3>
      <div className="controls">
        <button onClick={startTimer} disabled={isRunning}>
          Start Timer
        </button>
        <button onClick={stopTimer} disabled={!isRunning}>
          Stop Timer
        </button>
      </div>
    </div>
  );
};

export default NewAjastin;
