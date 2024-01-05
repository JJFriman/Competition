//Joukkueet.js is the team view

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/Joukkueet.css';
import JoukkueEdit from './JoukkueEdit';
import Register from './Register';
import JoukkueDisplay from './JoukkueDisplay';

function Joukkueet() {
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  function fetchTeams() {
    axios
      .get('http://localhost:3001/api/joukkueet')
      .then((response) => {
        setTeams(response.data);
      })
      .catch((error) => {
        console.error('Error fetching teams:', error);
      });
  }

  useEffect(() => {
    fetchTeams();
  }, []);

  const handleEditTeam = (team) => {
    setSelectedTeam(team);
    setIsEditing(true);
    console.log('Selected Team:', team);
  };
  
  const handleExitEdit = () => {
    resetEditing();
  };

  const resetEditing = () => {
    setSelectedTeam(null);
    setIsEditing(false);
  };
  
  const handleUpdateTeam = (updatedTeam) => {
    axios
      .put(`http://localhost:3001/api/joukkueet/${updatedTeam.joukkue_id}`, updatedTeam)
      .then((response) => {
        console.log('Team updated:', response.data);
        setIsEditing(false);
        fetchTeams();
      })
      .catch((error) => {
        console.error('Error updating team:', error);
      });
  };

  const handleDeleteTeam = (team) => {
    const teamId = team.joukkue_id;
  
    if (teamId) {
      axios
        .delete(`http://localhost:3001/api/joukkueet/${teamId}`)
        .then((response) => {
          console.log('Team deleted:', response.data);
          fetchTeams();
        })
        .catch((error) => {
          console.error('Error deleting team:', error);
        });
    } else {
      console.log('Invalid teamId, cannot delete the team.');
    }
  };
  

  return (
    <div>
      <div className="form-container">
        <Register setTeams={setTeams} />
        {isEditing && (
          <JoukkueEdit
            team={selectedTeam}
            onUpdate={handleUpdateTeam}
            onExitEdit={handleExitEdit}
          />
        )}
      </div>
      <JoukkueDisplay
        teams={teams}
        onEditTeam={handleEditTeam}
        onDeleteTeam={handleDeleteTeam}
      />
    </div>
  );
}

export default Joukkueet;
