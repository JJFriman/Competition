// TasksSelector.js is used to determine which tasks are used in a round

import React, { useState, useEffect } from 'react';
import axios from 'axios';

function TasksSelector({ onSelectTasks }) {
  const [tasks, setTasks] = useState([]);
  const [selectedTasks, setSelectedTasks] = useState([
    { tehtävä_nimi: '', max_aika: null },
    { tehtävä_nimi: '', max_aika: null },
    { tehtävä_nimi: '', max_aika: null },
  ]);

  useEffect(() => {
    axios
      .get('http://localhost:3001/api/tehtavat')
      .then((response) => {
        setTasks(response.data);
      })
      .catch((error) => {
        console.error('Error fetching tasks:', error);
      });
  }, []);

  const handleTaskChange = (e, index) => {
    const taskName = e.target.value;
    const selectedTask = tasks.find((task) => task.tehtävä_nimi === taskName);

    if (selectedTask) {
      const updatedSelectedTasks = [...selectedTasks];
      updatedSelectedTasks[index] = selectedTask;
      setSelectedTasks(updatedSelectedTasks);

      onSelectTasks(updatedSelectedTasks);
    }
  };

  return (
    <div>
      <h2>Task Selector</h2>
      {selectedTasks.map((selectedTask, index) => (
        <div key={index}>
          <p>Selected Task {index + 1}: {selectedTask.tehtävä_nimi}</p>
          <select value={selectedTask.tehtävä_nimi || ''} onChange={(e) => handleTaskChange(e, index)}>
            <option key="default" value="">
              Select a task
            </option>
            {tasks.map((task) => (
              <option key={task.id} value={task.tehtävä_nimi}>
                {task.tehtävä_nimi}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
}

export default TasksSelector;
