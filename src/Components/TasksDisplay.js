// TasksDisplay.js displays all the tasks in Tasks.js

import React from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

function TasksDisplay({ tasks, onEditTask, onDeleteTask }) {

  function formatTime(milliseconds) {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;
  
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');
  
    const formattedTime = `${formattedMinutes}:${formattedSeconds}`;
    return formattedTime;
  }
  
  
  
  
  
  return (
    <ul className="team-list">
      {tasks && tasks.map((task, index) => (
        <li key={task.key || index} className="team-card">
          {task.tehtävä_nimi}
          <div className="task-info">
          <p>{formatTime(task.max_aika * 1000)}</p>
            <EditIcon onClick={() => onEditTask(task)} />
            <DeleteIcon onClick={() => onDeleteTask(task)} />

          </div>
        </li>
      ))}
    </ul>
  );
}

export default TasksDisplay;

