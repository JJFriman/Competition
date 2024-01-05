// Ajastin.js is used to display the stopwatch for the selected team
// Not used anymore
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import AjastinKello from './AjastinKello';

function Ajastin() {
  const { teamId } = useParams();
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    document.title = `Team ${teamId}`;
    const newSocket = io('http://localhost:8000');

    newSocket.on('connect', () => {
      console.log('WebSocket connection is open.');
    });

    newSocket.on('disconnect', () => {
      console.log('WebSocket connection is closed.');
    });

// Listen the socket for the group data and set it to localstorage

    newSocket.on('selectedGroupUpdate', (updatedGroupData) => {
      console.log('Received updated group data:', updatedGroupData);
      const parsedData = JSON.parse(updatedGroupData);
      setSelectedGroup(parsedData);
      localStorage.setItem('selectedGroup', updatedGroupData);
    });

// Get the group data from localstorage if available

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

// End of functions

  return (
    <div>
      <h2>{`Team ${teamId} Stopwatch`}</h2>
      {selectedGroup && (
        <div>
          <h3>Selected Tasks:</h3>
          <ul>
            {selectedGroup.selectedTasks.map((task) => (
              <li key={task.tehtävä_nimi}>
                 <AjastinKello teamId={teamId} era={selectedGroup.groupInfo} task={task} maxAika={task.max_aika * 100}   />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Ajastin;
