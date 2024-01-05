// Register.js is used to register new teams to the competition

import React, { useState } from 'react';
import axios from 'axios';
import '../css/Register.css';

function Register({ setTeams }) {
  const [formData, setFormData] = useState({
    joukkue_nimi: '',
    jäsenet: '',
    kaupunki: '',
  });
  const [newlyAddedTeam, setNewlyAddedTeam] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
  
    axios
      .post('http://localhost:3001/api/joukkueet', formData)
      .then((response) => {
        console.log('Joukkue created:', response.data);
        setNewlyAddedTeam(response.data);
        setFormData({
          joukkue_nimi: '',
          jäsenet: '',
          kaupunki: '',
        });
  
        handleAddTeam(response.data);
      })
      .catch((error) => {
        console.error('Error creating joukkue:', error);
      });
  };
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleAddTeam = (newTeam) => {
    setTeams((prevTeams) => {
      newTeam.key = prevTeams.length;
      return [...prevTeams, newTeam];
    });
  };
  
  


  return (
    <div className="register-container">
      
      <form onSubmit={handleSubmit}>
        <div className="form-row">
        <h2>Ilmoittautuminen</h2>
          <div className="form__group">
            <input
              type="text"
              className="form__field"
              id="joukkue_nimi"
              name="joukkue_nimi"
              placeholder="Name"
              value={formData.joukkue_nimi}
              onChange={handleInputChange}
              required
              autoComplete="off"
            />
            <label htmlFor="joukkue_nimi" className="form__label">Joukkue Nimi</label>
          </div>
          <div className="form__group">
            <input
              type="text"
              className="form__field"
              id="kaupunki"
              name="kaupunki"
              placeholder="Name"
              value={formData.kaupunki}
              onChange={handleInputChange}
              required
              autoComplete="off"
            />
            <label htmlFor="kaupunki" className="form__label">Kaupunki</label>
          </div>
          <div className="form__group">
          <input
              type="text"
              className="form__field"
              id="jäsenet"
              name="jäsenet"
              placeholder="Name"
              value={formData.jäsenet}
              onChange={handleInputChange}
              required
              autoComplete="off"
            />
            <label htmlFor="jäsenet" className="form__label">Jäsenet</label>
          </div>
        </div>
        <button type="submit" className="submit-button">Submit</button>
        </form>
    {newlyAddedTeam && (
      <div className="newly-added-team">
        <h2>Uusi joukkue lisätty:</h2>
        <p>Joukkueen Nimi: {newlyAddedTeam.joukkue_nimi}</p>
        <p>Kaupunki: {newlyAddedTeam.kaupunki}</p>
        <p>Jäsenet: {newlyAddedTeam.jäsenet}</p>
      </div>
    )}
  </div>
  );
}

export default Register;
