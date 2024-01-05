// CompetitionFetch.js is the function to fetch teams 
import React, { useEffect } from 'react';
import axios from 'axios';

function CompetitionFetch({ onDataFetched }) {
  useEffect(() => {
    axios
      .get('http://localhost:3001/api/joukkueet')
      .then((response) => {
        onDataFetched(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  return null;
}

export default CompetitionFetch;
