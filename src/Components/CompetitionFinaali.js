// CompetitionFinaali.js displays the final round

import React, { useState, useEffect } from 'react';
import CompetitionFetch from './CompetitionFetch';
import '../css/CompetitionAlkuerä.css';
import TasksSelector from './TasksSelector';
import { io } from 'socket.io-client';
import { Link } from 'react-router-dom';

function CompetitionFinaali() {
  const [teams, setTeams] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [socket, setSocket] = useState(null);
  const [selectedTasks, setSelectedTasks] = useState([null, null, null]);

  const handleSelectTasks = (tasks) => {
    setSelectedTasks(tasks);
  };

  useEffect(() => {
    document.title = 'Finaali';
    const newSocket = io('http://localhost:8000');

    const storedSelectedGroupIndex = localStorage.getItem('selectedGroupIndex');
    if (storedSelectedGroupIndex) {
      setSelectedGroup(parseInt(storedSelectedGroupIndex, 10));
    }

    newSocket.on('connect', () => {
      console.log('WebSocket connection is open.');
    });

    newSocket.on('disconnect', () => {
      console.log('WebSocket connection is closed.');
    });

    setSocket(newSocket);

    return () => {
      if (newSocket && newSocket.connected) {
        newSocket.disconnect();
      }
    };
  }, []);

  const handleDataFetched = (data) => {
    const finalistTeams = data.filter((team) => team.finalist);

    const sortedTeams = [...finalistTeams].sort((a, b) => b.finalist - a.finalist);

    setTeams(sortedTeams);
  };

  const handleGroupSelection = () => {
    if (selectedTasks.some((task) => task === null || task.tehtava_nimi === null)) {
      alert('Valitse tehtävät.');
      return;
    }

    setSelectedGroup(0);

    if (socket && socket.connected) {
      const selectedGroupData = {
        groupInfo: 'Finaali',
        teams: teams,
        selectedTaskNames: selectedTasks.map((task) => task.tehtava_nimi),
        selectedTasks: selectedTasks,
      };

      const jsonData = JSON.stringify(selectedGroupData);
      console.log('Sending selected group data:', jsonData);
      socket.emit('selectedGroup', jsonData);
    }
  };

  return (
    <div>
      <title>Finaali</title>
      <h1>Competition Finaali</h1>
      <TasksSelector onSelectTasks={handleSelectTasks} />
      <div className="groups-container">
        <div className={`group ${selectedGroup === 0 ? 'highlighted-group' : ''}`}>
          <h2>Finaali</h2>
          <button onClick={handleGroupSelection}>Select</button>
          {teams.map((team) => (
            <div key={team.joukkue_id} className="team">
              <h3>
                <Link to={`/team/${team.joukkue_id}`}>{team.joukkue_nimi}</Link>
              </h3>
            </div>
          ))}
        </div>
      </div>
      <CompetitionFetch onDataFetched={handleDataFetched} />
    </div>
  );
}

export default CompetitionFinaali;
