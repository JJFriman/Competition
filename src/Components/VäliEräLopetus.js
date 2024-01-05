//VäliEräLopetus.js Is for ending the semifinals

import React, { useState, useEffect } from 'react';

const VäliEräLopetus = ({ eraName }) => {
  const [times, setTimes] = useState([]);
  const [allWinners, setAllWinners] = useState([]);

  const fetchAndHandleTeams = async () => {
    try {
      const fetchedTimes = await fetchTimes();
      await handleTeams(fetchedTimes);
    } catch (error) {
      console.error('Error fetching and handling teams:', error);
    }
  };

  const fetchTimes = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/aikataulu');
      if (!response.ok) {
        throw new Error('Failed to fetch times');
      }
      const data = await response.json();
      const filteredTimes = data.filter((time) => time.era.includes('Välierä'));
      console.log(filteredTimes);
      return filteredTimes;
    } catch (error) {
      console.error('Error fetching times:', error);
      throw error;
    }
  };

  const calculateCombinedTimesByRound = (times) => {
    const combinedTimesByRound = {};

    times.forEach((time) => {
      const teamId = time.joukkue_id;
      const round = time.era;
      if (!combinedTimesByRound[round]) {
        combinedTimesByRound[round] = {};
      }
      if (!combinedTimesByRound[round][teamId]) {
        combinedTimesByRound[round][teamId] = 0;
      }
      combinedTimesByRound[round][teamId] += time.aika;
    });

    return combinedTimesByRound;
  };
  const findWinnersByRound = (times) => {
    const combinedTimesByRound = calculateCombinedTimesByRound(times);
    const winnersByRound = {};
    Object.keys(combinedTimesByRound).forEach((round) => {
      const combinedTimesByTeam = combinedTimesByRound[round];
      const roundWinners = findRoundWinners(combinedTimesByTeam);
      winnersByRound[round] = roundWinners;
    });
    return winnersByRound;
  };
  const findRoundWinners = (combinedTimesByTeam) => {
    const roundWinners = [];
    Object.keys(combinedTimesByTeam).forEach((teamId) => {
      const combinedTime = combinedTimesByTeam[teamId];
      const isWinner = Object.values(combinedTimesByTeam).every(
        (otherCombinedTime) => combinedTime <= otherCombinedTime
      );
      if (isWinner) {
        roundWinners.push({ teamId, combinedTime });
      }
    });
    return roundWinners;
  };

  const handleTeams = async (fetchedTimes) => {
    try {
      const winnersByRound = findWinnersByRound(fetchedTimes);
      const allWinners = Object.values(winnersByRound)
        .reduce((acc, roundWinners) => acc.concat(roundWinners), []);
      setAllWinners(allWinners);
      console.log('All Winners:', allWinners);
      const allWinnersUpdates = await Promise.all(allWinners.map(async (winner) => {
        const randomValue = generateRandomNumber();
        const response = await fetch('http://localhost:3001/api/updateJoukkueet', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            updates: [{
              joukkueId: winner.teamId,
              updatedFields: {
                finalist: randomValue,
              },
            }],
          }),
        });
        if (!response.ok) {
          throw new Error('Failed to update data');
        }
        const data = await response.json();
        return {
          joukkueId: winner.teamId,
          updatedFields: data.updateResults.find(result => result.joukkueId === winner.teamId)?.updatedFields,
        };
      }));
      const winnersUpdateResults = await Promise.all(allWinnersUpdates);
      console.log('Update Results for Finalists:', winnersUpdateResults);
    } catch (error) {
      console.error('Error handling teams:', error);
    }
  };

  const handleLopetaClick = () => {
    fetchAndHandleTeams();
  };

  const generateRandomNumber = () => {
    return Math.floor(Math.random() * 1000);
  };

  return (
    <div>
      <button onClick={handleLopetaClick}>Lopeta erä</button>
    </div>
  );
};

export default VäliEräLopetus;
