// AlkueräLopetus.js is for handling the end of the first round. Determining who proceeds to the semifinals and who is placed into collection round

import React, { useState, useEffect } from 'react';

const AlkuEräLopetus = () => {
  const [allWinners, setAllWinners] = useState([]);
  const [remainingNonWinners, setRemainingNonWinners] = useState([]);

// Fetch the teams and their times

  const fetchAndHandleTeams = async () => {
    try {
      const fetchedTimes = await fetchTimes();
      handleTeams(fetchedTimes);
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
      return data;
    } catch (error) {
      console.error('Error fetching times:', error);
      throw error;
    }
  };

// Calculate the combined times

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

// Logic to find and determine winners by combined times

  const findWinnersAndNonWinnersByRound = (times) => {
    const combinedTimesByRound = calculateCombinedTimesByRound(times);
    const winnersByRound = {};
    const allWinners = [];
    let allNonWinners = [];

    Object.keys(combinedTimesByRound).forEach((round) => {
      const combinedTimesByTeam = combinedTimesByRound[round];
      const roundWinners = findRoundWinners(combinedTimesByTeam);

      allWinners.push(...roundWinners);

      winnersByRound[round] = roundWinners;

      const nonWinners = Object.keys(combinedTimesByTeam)
        .filter((teamId) => !roundWinners.some((winner) => winner.teamId === teamId))
        .map((teamId) => ({ teamId, combinedTime: combinedTimesByTeam[teamId], round }));

      allNonWinners.push(...nonWinners);
    });

    allNonWinners.sort((a, b) => a.combinedTime - b.combinedTime);

    return { winnersByRound, allNonWinners };
  };

// Get a winner from each round

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

// get 6 additional winners (number of rounds) to add to the winners 

  const handleTeams = (fetchedTimes) => {
    try {
      const { winnersByRound, allNonWinners } = findWinnersAndNonWinnersByRound(fetchedTimes);

      const removedTeams = allNonWinners.slice(0, 6);
      const remainingNonWinners = allNonWinners.slice(6);

      const allWinners = Object.values(winnersByRound)
        .reduce((acc, roundWinners) => acc.concat(roundWinners), [])
        .concat(removedTeams);

      setAllWinners(allWinners);
      setRemainingNonWinners(remainingNonWinners);

      console.log('All Winners:', allWinners);
      console.log('All Non-winners:', remainingNonWinners);
    } catch (error) {
      console.error('Error handling teams:', error);
    }
  };

  const handleLopetaClick = async () => {
    fetchAndHandleTeams();
  };

  return (
    <div>
      <button onClick={handleLopetaClick}>Lopeta erä</button>
    </div>
  );
};

export default AlkuEräLopetus;
