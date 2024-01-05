// Competition.js is the component that is used to display the competition to the audience
// Not used anymore
import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import '../css/Competition.css';
import NewAjastinChild from './NewAjastinChild';

function Competition() {
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [finishedTimes, setFinishedTimes] = useState({});
  const [updatedGroupData, setUpdatedGroupData] = useState(null);

// Get the selected group data from the socket

  useEffect(() => {
    const socket = io('http://localhost:8000');

    socket.on('selectedGroupUpdate', (updatedGroupData) => {
      const parsedData = JSON.parse(updatedGroupData);
      setSelectedGroup(parsedData);
      setUpdatedGroupData(parsedData);
      localStorage.setItem('selectedGroup', JSON.stringify(parsedData));
    });

    socket.on('groupDataUpdate', (updatedGroupData) => {
      const parsedData = JSON.parse(updatedGroupData);
      setSelectedGroup(parsedData);
      setUpdatedGroupData(parsedData);
      localStorage.setItem('selectedGroup', JSON.stringify(parsedData));
    });

    socket.on('finishedTimeUpdate', (finishedTimes) => {
      console.log('Received finished time update:', finishedTimes);

      setFinishedTimes(finishedTimes);

      localStorage.setItem('finishedTimes', JSON.stringify(finishedTimes));

      console.log('Updated finishedTimes:', finishedTimes);
    });

    const storedSelectedGroup = localStorage.getItem('selectedGroup');
    if (storedSelectedGroup) {
      const parsedData = JSON.parse(storedSelectedGroup);
      setSelectedGroup(parsedData);
      setUpdatedGroupData(parsedData);
    }

    return () => {
      if (socket.connected) {
        socket.disconnect();
      }
    };
  }, []);

// Parse the finished times 

  useEffect(() => {
    const storedFinishedTimes = localStorage.getItem('finishedTimes');
    if (storedFinishedTimes) {
      const parsedFinishedTimes = JSON.parse(storedFinishedTimes);
      setFinishedTimes(parsedFinishedTimes);
      console.log('Parsed Finished Times:', parsedFinishedTimes);
    }
  }, []);

// Format the time to 00:00:00

  function formatTime(milliseconds) {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;
    const hundredths = Math.floor((milliseconds % 1000) / 10);

    const formattedTime = `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}:${String(hundredths).padStart(2, '0')}`;
    return formattedTime;
  }

// Get teams combined times from all tasks

  function getCombinedTime(team) {
    return Object.values(finishedTimes[team.joukkue_id] || {}).reduce((acc, tasks) => {
      return acc + Object.values(tasks).reduce((taskAcc, task) => taskAcc + task.finishedTime, 0);
    }, 0);
  }

// Sort the teams by combined time and apply rank

  function getSortedTeamsByCombinedTime() {
    const teamsWithCombinedTimes = updatedGroupData.teams
      .map((team) => ({
        team,
        combinedTime: getCombinedTime(team),
      }))
      .filter((item) => item.combinedTime > 0);
  
    teamsWithCombinedTimes.sort((a, b) => a.combinedTime - b.combinedTime);
  
    return teamsWithCombinedTimes.map((item, index) => ({
      ...item.team,
      rank: index + 1,
      color: getRankColor(index + 1),
    }));
  }
  
  function getRankColor(rank) {
    if (rank === 1) {
      return 'gold';
    } else if (rank === 2) {
      return 'silver';
    } else if (rank === 3) {
      return 'bronze';
    } else {
      return '';
    }
  }
  
// End of functions

  return (
    <div className="competition-container">
      <h1>Kilpailu</h1>
      {updatedGroupData ? (
        <div>
          <h2>{updatedGroupData.groupInfo}</h2>
          <h3>Tehtävät: {updatedGroupData.selectedTasks.map((task) => `${task.tehtävä_nimi} (${formatTime(task.max_aika * 1000)})`).join(', ')}</h3>
          <NewAjastinChild/>
          <ul>
            {updatedGroupData.teams.map((team) => (
              <div key={team.joukkue_id} className={`team-card ${getRankColor(getSortedTeamsByCombinedTime().findIndex((t) => t.joukkue_id === team.joukkue_id) + 1)}`}>
                <h3>{team.joukkue_nimi}</h3>
                <p>Jäsenet: {team.jäsenet}</p>
                {Object.entries(finishedTimes[team.joukkue_id] || {}).map(([era, tasks]) => (
                  era === updatedGroupData.groupInfo && (
                    <div key={era} className="tasks-container">
                      {Object.entries(tasks).map(([taskName, finishedTimeData]) => (
                        <div key={taskName} className="task">
                          <h4>{taskName}</h4>
                          <p>Aika: {formatTime(finishedTimeData.finishedTime * 10)}</p>
                        </div>
                      ))}
                      <div className="combined-time">
                        <h4>Lopullinen aika</h4>
                        <p>{formatTime(getCombinedTime(team) * 10)}</p>
                      </div>
                    </div>
                  )
                ))}
              </div>
            ))}
          </ul>
        </div>
      ) : (
        <p>No selected group available.</p>
      )}
    </div>
  );
}

export default Competition;
