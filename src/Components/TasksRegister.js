// TasksRegister.js is the task creation form

import React, { useState } from 'react';
import axios from 'axios';
import '../css/Register.css';

function TasksRegister({ setTasks }) {
  const [formData, setFormData] = useState({
    tehtävä_nimi: '',
    max_aika: '',
  });
  const [newlyAddedTask, setNewlyAddedTask] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post('http://localhost:3001/api/tehtavat', formData)
      .then((response) => {
        console.log('Task created:', response.data);
        setNewlyAddedTask(response.data);
        setFormData({
          tehtävä_nimi: '',
          max_aika: '',
        });

        handleAddTask(response.data);
      })
      .catch((error) => {
        console.error('Error creating task:', error);
      });
  };
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleAddTask = (newTask) => {
    setTasks((prevTasks) => {
    newTask.key = prevTasks.length;
      return [...prevTasks, newTask];
    });
  };
  
  return (
    <div className="register-container">
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <h2>Tehtävän lisäys</h2>

          <div className="form__group">
          
            <input
              type="text"
              className="form__field"
              id="tehtävä_nimi"
              name="tehtävä_nimi"
              placeholder="Tehtävän nimi"
              value={formData.tehtävä_nimi}
              onChange={handleInputChange}
              required
              autoComplete="off"
            />
            <label htmlFor="tehtävä_nimi" className="form__label">Tehtävä</label>
          </div>
          <div className="form__group">
            <input
              type="text"
              className="form__field"
              id="max_aika"
              name="max_aika"
              placeholder="Maksimi aika"
              value={formData.max_aika}
              onChange={handleInputChange}
              required
              autoComplete="off"
            />
            <label htmlFor="max_aika" className="form__label">Maksimi Aika</label>
          </div>
        </div>
        <button type="submit" className="submit-button">Lisää</button>
      </form>
      {newlyAddedTask && (
        <div className="newly-added-team">
          <h2>Uusi tehtävä lisätty:</h2>
          <p>Tehtävän Nimi: {newlyAddedTask.tehtävä_nimi}</p>
          <p>Maksimi Aika: {newlyAddedTask.max_aika}</p>
        </div>
      )}
    </div>
  );
}

export default TasksRegister;
