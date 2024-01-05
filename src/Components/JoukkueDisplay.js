//JoukkueDisplay is used to display teams inside the team editor

import React from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

function JoukkueDisplay({ teams, onEditTeam, onDeleteTeam }) {
  return (
<ul className="team-list">
  {teams.map((team, index) => (
    <li key={team.key || index} className="team-card">
      {team.joukkue_nimi}
      <div className="team-info">
        <EditIcon onClick={() => onEditTeam(team)} />
        <DeleteIcon onClick={() => onDeleteTeam(team)} />
        <p>Kaupunki: {team.kaupunki}</p>
        <p>Jäsenet: {team.jäsenet}</p>
      </div>
    </li>
  ))}
</ul>
  );
}

export default JoukkueDisplay;