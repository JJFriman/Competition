// TasksEdit.js This is the Task editorial form

import React, { useState, useEffect } from 'react';

function TasksEdit({ task, onUpdate, onExitEdit }) {
  const [formData, setFormData] = useState({
    tehtävä_nimi: task.tehtävä_nimi || '',
    max_aika: task.max_aika || '',
  });


  useEffect(() => {
    setFormData({
      tehtävä_nimi: task.tehtävä_nimi || '',
      max_aika: task.max_aika || '',
    });
  }, [task]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate({ ...formData, id: task.id });
  };

  return (
    <div className="register-container">
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <h2>Muokkaa Tehtävää</h2>
          <div className="form__group">
            <input
              type="text"
              className="form__field"
              name="tehtävä_nimi"
              placeholder="Tehtävän Nimi"
              value={formData.tehtävä_nimi}
              onChange={handleInputChange}
              required
            />
            <label className="form__label">Tehtävän Nimi</label>
          </div>
          <div className="form__group">
            <input
              type="text"
              className="form__field"
              name="max_aika"
              placeholder="Maksimiaika"
              value={formData.max_aika}
              onChange={handleInputChange}
              required
            />
            <label className="form__label">Maksimiaika</label>
          </div>
        </div>
        <button type="submit" className="submit-button">
          Update Task
        </button>
        <button onClick={onExitEdit} className="submit-button">Cancel</button>
      </form>
    </div>
  );
}

export default TasksEdit;
