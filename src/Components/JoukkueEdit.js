//JoukkeEdit.js is the form used to edit teams

import React, { useState, useEffect } from 'react';
import '../css/JoukkueEdit.css';

function JoukkueEdit({ team, onUpdate, onExitEdit }) {
  const [formData, setFormData] = useState({
    joukkue_nimi: team.joukkue_nimi || '',
    kaupunki: team.kaupunki || '',
    jäsenet: team.jäsenet || '',
  });

  useEffect(() => {
    setFormData({
      joukkue_nimi: team.joukkue_nimi || '',
      kaupunki: team.kaupunki || '',
      jäsenet: team.jäsenet || '',
    });
  }, [team]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate({ ...formData, joukkue_id: team.joukkue_id });
  };

  return (
    <div className="register-container">
      <form onSubmit={handleSubmit}>
        <div className="form-row">
        <h2>Muokkaa Joukkuetta</h2>
          <div className="form__group">
            <input
              type="text"
              className="form__field"
              name="joukkue_nimi"
              placeholder="Name"
              value={formData.joukkue_nimi}
              onChange={handleInputChange}
              required
            />
            <label className="form__label">Joukkue Nimi</label>
          </div>
          <div className="form__group">
            <input
              type="text"
              className="form__field"
              name="kaupunki"
              placeholder="City"
              value={formData.kaupunki}
              onChange={handleInputChange}
              required
            />
            <label className="form__label">Kaupunki</label>
          </div>
          <div className="form__group">
            <input
              type="text"
              className="form__field"
              name="jäsenet"
              placeholder="Members"
              value={formData.jäsenet}
              onChange={handleInputChange}
              required
            />
            <label className="form__label">Jäsenet</label>
          </div>
        </div>
        <button type="submit" className="submit-button">
          Update
        </button>
        <button onClick={onExitEdit}className="submit-button">Cancel</button>
      </form>
    </div>
  );
}

export default JoukkueEdit;
