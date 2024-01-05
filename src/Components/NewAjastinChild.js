// NewAjastinChild is to replace Competition.js

import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import useGroupData from './UseGroupData';
import '../css/Competition.css';

const socket = io('http://localhost:8000');

const NewAjastinChild = () => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [laps, setLaps] = useState({});
  const [lapCount, setLapCount] = useState({});
  const intervalIdRef = useRef(null);
  const { selectedGroup } = useGroupData();

  const resetTimer = () => {
    setElapsedTime(0);
    setIsRunning(false);
    setStartTime(null);
    setLaps({});
    setLapCount({});
  };
  
  useEffect(() => {
    resetTimer();
    if (selectedGroup && selectedGroup.teams) {
      const allLapsCompleted = selectedGroup.teams.every((team) => {
        const teamLaps = laps[team.joukkue_id] || [];
        return teamLaps.length === 3;
      });
      if (allLapsCompleted) {
        localStorage.clear();
      }
    }
  }, [selectedGroup]);

  useEffect(() => {
    const stopTimerHandler = () => {
      resetTimer();
    };
    socket.on('stopTimer', stopTimerHandler);
    return () => {
      socket.off('stopTimer', stopTimerHandler);
    };
  }, []);


  useEffect(() => {
    const startTimerHandler = (data) => {
      const serverTimestamp = data.timestamp;
      const localTimestamp = window.performance.now();
      const networkDelay = localTimestamp - serverTimestamp;
      const adjustedStartTime = serverTimestamp + networkDelay;
      setStartTime(adjustedStartTime);
      setIsRunning(true);
    };

// Big Big disgusting clunky logic to calculate individual task times as "laptimes" and combining them for display & comparision purposes

    const lapTimerHandler = (lapTimerData) => {
        const { teamId, taskName } = lapTimerData;
        if (!startTime) {
          console.error('Error: startTime is not set.');
          return;
        }
        const previousLapsTotalTime = Array.isArray(laps[teamId])
          ? laps[teamId].reduce((totalTime, lap) => totalTime + lap.lapTime, 0)
          : 0;
        const existingLapIndex = Array.isArray(laps[teamId])
          ? laps[teamId].findIndex((lap) => lap.taskName === taskName)
          : -1;
        let lapTime;
        if (existingLapIndex !== -1) {
          lapTime = elapsedTime * 10 - previousLapsTotalTime + laps[teamId][existingLapIndex].lapTime;
        } else {
          lapTime = elapsedTime * 10 - previousLapsTotalTime;
          const task = selectedGroup?.selectedTasks.find((t) => t.tehtävä_nimi === taskName);
          if (task && lapTime > task.max_aika * 1000) {
            lapTime = task.max_aika * 1000;
            setLapCount((prevLapCount) => ({
              ...prevLapCount,
              [teamId]: (prevLapCount[teamId] || 0) + 1,
            }));
            setLaps((prevLaps) => {
              const updatedLaps = { ...prevLaps };
              updatedLaps[teamId] = [...(prevLaps[teamId] || []), { taskName, lapTime }];
              const currentLapCount = updatedLaps[teamId] ? updatedLaps[teamId].length : 0;
              if (currentLapCount === 3) {
                const combinedTime = updatedLaps[teamId].reduce((totalTime, lap) => totalTime + lap.lapTime, 0);
              }
              return updatedLaps;
            });
            return;
          }
        }
        setLapCount((prevLapCount) => ({
          ...prevLapCount,
          [teamId]: (prevLapCount[teamId] || 0) + 1,
        }));
        setLaps((prevLaps) => {
          const updatedLaps = { ...prevLaps };
          if (prevLaps[teamId] && prevLaps[teamId].length >= 3) {
            return prevLaps;
          }
          const currentLapCount = updatedLaps[teamId] ? updatedLaps[teamId].length : 0;
          if (existingLapIndex !== -1) {
            updatedLaps[teamId][existingLapIndex] = { taskName, lapTime };
          } else {
            updatedLaps[teamId] = [...(prevLaps[teamId] || []), { taskName, lapTime }];
          }
          if (currentLapCount + 1 === 3) {
            const combinedTime = updatedLaps[teamId].reduce((totalTime, lap) => totalTime + lap.lapTime, 0);
          }
          return updatedLaps;
        });
      };


    socket.on('timerStart', startTimerHandler);
    socket.on('lapTimerUpdate', lapTimerHandler);

    return () => {
      socket.off('timerStart', startTimerHandler);
      socket.off('lapTimerUpdate', lapTimerHandler);
    };
  }, [startTime, elapsedTime, lapCount, laps]);

  const submitMaxAikaLaps = (teamId, taskName, round) => {
    const task = selectedGroup?.selectedTasks.find((t) => t.tehtävä_nimi === taskName);
    const maxAika = task ? task.max_aika * 1000 : 0;
  
    setLapCount((prevLapCount) => ({
      ...prevLapCount,
      [teamId]: (prevLapCount[teamId] || 0) + 1,
    }));
  
    setLaps((prevLaps) => {
      const updatedLaps = { ...prevLaps };
  
      const existingLapIndex = Array.isArray(updatedLaps[teamId])
        ? updatedLaps[teamId].findIndex((lap) => lap.taskName === taskName)
        : -1;
  
      if (existingLapIndex === -1) {
        const lapTime = maxAika;
        updatedLaps[teamId] = [...(prevLaps[teamId] || []), { taskName, lapTime }];
      }
      const currentLapCount = updatedLaps[teamId] ? updatedLaps[teamId].length : 0;
  
      if (currentLapCount === 3) {
        const combinedTime = updatedLaps[teamId].reduce((totalTime, lap) => totalTime + lap.lapTime, 0);
      }
  
      return updatedLaps;
    });
  };
  
// SQL logic for posting times
  
  const postToMySQL = async (era, tehtava, teamId, finishedTime) => {
    try {
      const selectedGroup = localStorage.getItem('selectedGroup');
      if (!selectedGroup) {
        return;
      }
  
      const parsedData = JSON.parse(selectedGroup);
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
  };
  const sendLapTimeDataToMySQL = () => {
    selectedGroup?.teams.forEach((team) => {
      const teamLaps = laps[team.joukkue_id] || [];
      teamLaps.forEach((lap) => {
        postToMySQL(selectedGroup.groupInfo, lap.taskName, team.joukkue_id, lap.lapTime);
      });
    });
  };

  useEffect(() => {
    const allLapsCompleted = selectedGroup?.teams?.every((team) => {
      const teamLaps = laps[team.joukkue_id] || [];
      return teamLaps.length === 3;
    });
  
    if (allLapsCompleted) {
      setIsRunning(false);
      sendLapTimeDataToMySQL();
    }
  }, [selectedGroup, laps]);
  
  

  useEffect(() => {
    if (selectedGroup?.selectedTasks && laps && elapsedTime > 0) {
      selectedGroup.teams.forEach((team) => {
        const teamLaps = laps[team.joukkue_id] || [];
        selectedGroup.selectedTasks.forEach((task) => {
          const currentLapCount = teamLaps.filter((lap) => lap.taskName === task.tehtävä_nimi).length;
          if (currentLapCount < 3) {
            const maxAika = task.max_aika * 1000;
            const cumulativeMaxAika = teamLaps.reduce((total, lap) => total + lap.lapTime, 0) + maxAika;
            if (cumulativeMaxAika <= elapsedTime * 10) {
              submitMaxAikaLaps(team.joukkue_id, task.tehtävä_nimi, currentLapCount + 1);
            }
          }
        });
      })
    }
  }, [selectedGroup, laps, elapsedTime]);

  useEffect(() => {
    if (isRunning) {
      const intervalId = setInterval(() => {
        setElapsedTime((prevElapsedTime) => prevElapsedTime + 1);
      }, 10);
      intervalIdRef.current = intervalId;
    } else {
      clearInterval(intervalIdRef.current);
    }
    return () => {
      clearInterval(intervalIdRef.current);
    };
  }, [isRunning, elapsedTime]);

  

  const getCombinedTime = (teamId) => {
    const teamLaps = laps[teamId] || [];
    const combinedTime = teamLaps.reduce((totalTime, lap) => totalTime + lap.lapTime, 0);
    return combinedTime;
  };


  const calculateCombinedTimesByTeam = () => {
    const combinedTimesByTeam = {};
  
    selectedGroup.teams.forEach((team) => {
      const teamId = team.joukkue_id;
      combinedTimesByTeam[teamId] = getCombinedTime(teamId);
    });
  
    return combinedTimesByTeam;
  };
  
  const getSortedTeamsByCombinedTime = () => {
    const teamsWithCombinedTimes = selectedGroup.teams.map((team) => ({
      team,
      combinedTime: getCombinedTime(team.joukkue_id),
    }));
  
    const sortedTeams = teamsWithCombinedTimes.sort((a, b) => {
      if (!a.combinedTime && b.combinedTime) {
        return 1;
      }
      if (a.combinedTime && !b.combinedTime) {
        return -1;
      }
      return a.combinedTime - b.combinedTime;
    });
  
    return sortedTeams.map((item, index) => ({
      ...item.team,
      rank: index + 1,
      color: getRankColor(index + 1),
      combinedTime: item.combinedTime,
    }));
  };
  
  

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

  const renderTeams = () => {
    if (!selectedGroup || !selectedGroup.teams) {
      return <p>No teams available.</p>;
    }
  
    const sortedTeams = getSortedTeamsByCombinedTime();
  
    const allLapsCompleted = selectedGroup.teams.every((team) => {
      const teamLaps = laps[team.joukkue_id] || [];
      return teamLaps.length === 3;
    });
  
    return sortedTeams.map((team) => (
      <div key={team.joukkue_id} className={`team-card ${allLapsCompleted ? getRankColor(team.rank) : ''}`}>
        <h4>{team.joukkue_nimi}</h4>
        {allLapsCompleted && <p>Sija: {team.rank}</p>}
        <ul>
          {laps[team.joukkue_id]?.map((lap) => (
            <li key={`${team.joukkue_id}-${lap.taskName}`}>
              Tehtävä: {lap.taskName}, Aika: {formatTime(lap.lapTime)}
            </li>
          ))}
          {laps[team.joukkue_id]?.length === 3 && (
            <li key={`${team.joukkue_id}-combined`}>
              Lopullinen aika: {formatTime(team.combinedTime)}
            </li>
          )}
        </ul>
      </div>
    ));
  };
  
  
  return (
    <div>
      {selectedGroup && <h1>{selectedGroup.groupInfo}</h1>}
      <div className="max-times-container">
        <h4>Max aika:</h4>
        <ul>
        {selectedGroup?.selectedTasks.map((task, index) => (
  <li key={`${task.tehtävä_id}-${index}`}>
    {task.tehtävä_nimi}, Max aika: {formatTime(task.max_aika * 1000)}
  </li>
))}

        </ul>
      </div>
      <div className="timer">
        <span>{formatTime(elapsedTime * 10)}</span>
      </div>
      <div>
        <h4>Ajat:</h4>
        {renderTeams()}
      </div>
    </div>
  );
};

// Time formatting to 00:00:00

const formatTime = (milliseconds) => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const remainingSeconds = totalSeconds % 60;
  const hundredths = Math.floor((milliseconds % 1000) / 10);

  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}:${String(hundredths).padStart(2, '0')}`;
};

export default NewAjastinChild;
