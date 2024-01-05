// NewAjastinGranChild.js is the control for the referees 

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';

const NewAjastinGranChild = () => {
  const { teamId } = useParams();
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [socket, setSocket] = useState(null);
  const [isReady, setIsReady] = useState(false); 

  useEffect(() => {
    document.title = `Team ${teamId}`;
    const newSocket = io('http://localhost:8000');

    newSocket.on('connect', () => {
      console.log('WebSocket connection is open.');
    });

    newSocket.on('disconnect', () => {
      console.log('WebSocket connection is closed.');
    });

    newSocket.on('selectedGroupUpdate', (updatedGroupData) => {
      console.log('Received updated group data:', updatedGroupData);
      const parsedData = JSON.parse(updatedGroupData);
      setSelectedGroup(parsedData);

      localStorage.setItem('selectedGroup', updatedGroupData);
    });

    const storedSelectedGroup = localStorage.getItem('selectedGroup');
    if (storedSelectedGroup) {
      const parsedData = JSON.parse(storedSelectedGroup);
      setSelectedGroup(parsedData);
    }

    setSocket(newSocket);

    return () => {
      if (newSocket.connected) {
        newSocket.disconnect();
      }
    };
  }, [teamId]);

// Task time stop here

  const handleLapClick = (task) => {
    if (socket) {
      const teamName = getTeamName(teamId);
      socket.emit('lapTimer', {
        teamId,
        teamName,
        taskName: task.tehtävä_nimi,
      });
    }
  };
  

  const getTeamName = (teamId) => {
    const team = selectedGroup?.teams.find((team) => team.joukkue_id === parseInt(teamId));
    return team ? team.joukkue_nimi : 'Unknown Team';
  };

// Set ready here 

  const handleReadyClick = () => {
    if (socket) {
      const teamName = getTeamName(teamId);
      setIsReady((prevIsReady) => !prevIsReady);
      socket.emit('teamReady', {
        teamId,
        teamName,
        isReady: !isReady,
      });
    }
  };

  return (
    <div>
      <h2>{`${getTeamName(teamId)}`}</h2>
      {selectedGroup && (
        <div>
      <button onClick={handleReadyClick}>
        {isReady ? 'Not Ready' : 'Ready'}
      </button>
          <h3>Selected Tasks:</h3>
          <ul>
            {selectedGroup.selectedTasks.map((task) => (
              <li key={task.tehtävä_nimi}>
                <div>
                  <p>Task: {task.tehtävä_nimi}</p>
                  <button onClick={() => handleLapClick(task)}>Stop</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default NewAjastinGranChild;
