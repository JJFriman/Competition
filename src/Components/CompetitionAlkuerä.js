// CompetitionAlkuerä.js is used to display the preliminary round

import React, { useState, useEffect } from 'react';
import CompetitionFetch from './CompetitionFetch';
import '../css/CompetitionAlkuerä.css';
import TasksSelector from './TasksSelector';
import { io } from 'socket.io-client';
import { Link } from 'react-router-dom';
import AlkuEräLopetus from './AlkuEräLopetus';
import NewAjastin from './NewAjastin';

function CompetitionAlkuerä() {
  const [teams, setTeams] = useState([]);
  const [groupedTeams, setGroupedTeams] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [socket, setSocket] = useState(null);
  const [selectedTasks, setSelectedTasks] = useState([null, null, null]);
  const [teamReadiness, setTeamReadiness] = useState({});

  const handleSelectTasks = (tasks) => {
    setSelectedTasks(tasks);
  };

  useEffect(() => {
    document.title = 'Alkuerä';
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
    const sortedTeams = [...data].sort((a, b) => a.osallistumis_nro - b.osallistumis_nro);
    const first36Teams = sortedTeams.slice(0, 36);
    setTeams(first36Teams);
    divideTeamsIntoGroups(first36Teams);
  };

  const divideTeamsIntoGroups = (teams) => {
    const grouped = [];
    for (let i = 0; i < teams.length; i += 6) {
      grouped.push(teams.slice(i, i + 6));
    }
    setGroupedTeams(grouped);
  };

  const handleGroupSelection = (selectedGroupIndex) => {
    if (selectedTasks.some((task) => task === null || task.tehtava_nimi === null)) {
      alert('Valitse tehtävät.');
      return;
    }
  
    setSelectedGroup(selectedGroupIndex);
  
    if (socket && socket.connected) {
      const selectedGroupData = {
        groupInfo: `Alkuerä ${selectedGroupIndex + 1}`,
        teams: groupedTeams[selectedGroupIndex],
        selectedTaskNames: selectedTasks.map((task) => task.tehtava_nimi),
        selectedTasks: selectedTasks,
      };
  
      const jsonData = JSON.stringify(selectedGroupData);
      console.log('Sending selected group data:', jsonData);
      socket.emit('selectedGroup', jsonData);
  
      localStorage.setItem('selectedGroupIndex', selectedGroupIndex);
    }
  };
  
  useEffect(() => {
    if (socket) {
      socket.on('teamReadyUpdate', (readyData) => {
        console.log('Received teamReady:', readyData);
        const { teamId, isReady } = readyData;
        setTeamReadiness((prevTeamReadiness) => ({
          ...prevTeamReadiness,
          [teamId]: isReady,
        }));
      });
    }
  
    return () => {
      if (socket) {
        socket.off('teamReadyUpdate');
      }
    };
  }, [socket, teamReadiness]);

  const allTeamsInGroupReady = groupedTeams[selectedGroup]
  ? groupedTeams[selectedGroup].every((team) => teamReadiness[team.joukkue_id])
  : false;


  return (
    <div>
      <title>Alkuerä</title>
      <h1>Competition Alkuerä</h1>
      <TasksSelector onSelectTasks={handleSelectTasks} />
      <div className="groups-container">
        {groupedTeams.map((group, groupIndex) => (
          <div
            key={groupIndex}
            className={`group ${selectedGroup === groupIndex ? 'highlighted-group' : ''}`}
          >
            <h2>Alkuerä {groupIndex + 1}</h2>
  
            {selectedGroup === groupIndex && (
              <div>
                {allTeamsInGroupReady ? (
                  <NewAjastin teamReadiness={teamReadiness} />
                ) : (
                  <p>Waiting for all teams in this group to be ready...</p>
                )}
              </div>
            )}
  
            <button onClick={() => handleGroupSelection(groupIndex)}>Select</button>
            {group.map((team) => (
              <div
                key={team.joukkue_id}
                className={`team ${teamReadiness[team.joukkue_id] ? 'ready' : ''}`}
              >
                <h3>
                <Link to={`/team/${team.joukkue_id}/Newtimer`}>
                    {team.joukkue_nimi}
                  </Link>
                </h3>
              </div>
            ))}
          </div>
        ))}
      </div>
      <AlkuEräLopetus eraName={'Alkuerä'} />
      <CompetitionFetch onDataFetched={handleDataFetched} />
    </div>
  );
            }

export default CompetitionAlkuerä;
