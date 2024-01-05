// Tasks.js contains and uses all tasks components 

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TasksEdit from './TasksEdit';
import TasksRegister from './TasksRegister';
import TasksDisplay from './TasksDisplay';

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  function fetchTasks() {
    axios
      .get('http://localhost:3001/api/tehtavat')
      .then((response) => {
        setTasks(response.data);
      })
      .catch((error) => {
        console.error('Error fetching tasks:', error);
      });
  }

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleEditTask = (task) => {
    setSelectedTask(task);
    setIsEditing(true);
    console.log('Selected Task:', task);
  };

  const handleExitEdit = () => {
    resetEditing();
  };

  const resetEditing = () => {
    setSelectedTask(null);
    setIsEditing(false);
  };

  const handleUpdateTask = (updatedTask) => {
    axios
      .put(`http://localhost:3001/api/tehtavat/${updatedTask.id}`, updatedTask)
      .then((response) => {
        console.log('Task updated:', response.data);
        setIsEditing(false);
        fetchTasks();
      })
      .catch((error) => {
        console.error('Error updating task:', error);
      });
  };

  const handleDeleteTask = (task) => {
    const taskId = task.id;

    if (taskId) {
      axios
        .delete(`http://localhost:3001/api/tehtavat/${taskId}`)
        .then((response) => {
          console.log('Task deleted:', response.data);
          fetchTasks();
        })
        .catch((error) => {
          console.error('Error deleting task:', error);
        });
    } else {
      console.log('Invalid taskId, cannot delete the task.');
    }
  };

  

  return (
    <div>
      <div className="form-container">
        <TasksRegister setTasks={setTasks} />
        {isEditing && (
          <TasksEdit
            task={selectedTask}
            onUpdate={handleUpdateTask}
            onExitEdit={handleExitEdit}
          />
        )}
      </div>
      <TasksDisplay
        tasks={tasks}
        onEditTask={handleEditTask}
        onDeleteTask={handleDeleteTask}
      />
    </div>
  );
}

export default Tasks;
