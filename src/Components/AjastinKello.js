// AjastinKello.js is the stopwatch used in Ajastin.js
// Not used anymore
import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:8000');

const AjastinKello = ({ teamId, task, era, maxAika }) => {
    const [elapsedTime, setElapsedTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const intervalIdRef = React.useRef(null);
    useEffect(() => {
      return () => {
        clearInterval(intervalIdRef.current);
      };
    }, []);
  
// Interval for the stopwatch and time emit

    useEffect(() => {
        const formattedMaxAika = maxAika;
      
        console.log('formattedMaxAika:', formattedMaxAika);
        console.log('elapsedTime:', elapsedTime);
      
        if (isRunning && elapsedTime >= formattedMaxAika) {
          console.log('Stopping timer...');
          stopTimer();
        }
      
        if (isRunning) {
          const intervalId = setInterval(() => {
            setElapsedTime((prevElapsedTime) => prevElapsedTime + 1);
          }, 10);
          intervalIdRef.current = intervalId;
        } else {
          clearInterval(intervalIdRef.current);
        }
      
        socket.emit('timerUpdate', {
          teamId,
          era,
          taskName: task.tehtävä_nimi,
          isRunning,
        });
      
        return () => {
          clearInterval(intervalIdRef.current);
        };
      }, [isRunning, teamId, era, task.tehtävä_nimi, maxAika, elapsedTime]);
      
// Stopwatch controls

  const startTimer = () => {
    setIsRunning(true);
  };

  const stopTimer = () => {
    console.log('teamId:', teamId);
    setIsRunning(false);
    const finishedTime = elapsedTime;
    socket.emit('finishedTime', {
      teamId,
      era,
      taskName: task.tehtävä_nimi,
      finishedTime,
    });
    postToMySQL(era, task.tehtävä_nimi,teamId,  finishedTime);
  };
  
  const resetTimer = () => {
    setElapsedTime(0);
    clearInterval(intervalIdRef.current);
    setIsRunning(false);
  };
  
// Formatting the stopwatch to 00:00:00

  function formatTime(milliseconds) {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;
    const hundredths = Math.floor((milliseconds % 1000) / 10);
    const formattedTime = `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}:${String(hundredths).padStart(2, '0')}`;
    return formattedTime;
  }

// Posting the times to MySQL

  const postToMySQL = async (era, tehtava,teamId, finishedTime) => {
    const selectedGroup = localStorage.getItem('selectedGroup');
  
    if (selectedGroup) {
      try {
        const parsedData = JSON.parse(selectedGroup);
        console.log('teamId:', teamId);
        const response = await fetch('http://localhost:3001/api/aikataulu', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            era: parsedData.groupInfo,
            tehtava,
            joukkueId: teamId,
            aika: finishedTime,
          }),
        });
  
        if (!response.ok) {
          console.error('Failed to send finished time to aikataulu:', response.status);
        }
      } catch (error) {
        console.error('Error sending finished time to aikataulu:', error);
      }
    }
  };
  
// End of functions

  return (
    <div>
      <h3>{task.tehtävä_nimi}</h3>
      <p>Max Aika: {formatTime(maxAika * 10)}</p>
      <div className="timer">
        <span>{formatTime(elapsedTime * 10)}</span>
      </div>
      <div className="controls">
        <button onClick={startTimer} disabled={isRunning}>
          Start
        </button>
        <button onClick={stopTimer} disabled={!isRunning}>
          Stop
        </button>
        <button onClick={resetTimer}>Reset</button>
      </div>
    </div>
  );
};

export default AjastinKello;
