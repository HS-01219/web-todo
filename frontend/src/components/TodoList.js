// src/components/TodoList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './TodoList.module.css';
import TeamSection from './TeamSection';
import TodoSection from './TodoSection';

const dummyTeams = [
  { id: 1, name: '팀 A' },
  { id: 2, name: '팀 B' }
];

const TodoList = ({ user }) => {
  const [tasksByTeam, setTasksByTeam] = useState({});
  const [newTask, setNewTask] = useState('');
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(dummyTeams[0]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [newTeamName, setNewTeamName] = useState('');
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);

  useEffect(() => {
    axios.get(`http://localhost:8080/api/todos?teamId=${selectedTeam.id}`)
      .then(response => {
        setTasksByTeam(prev => ({
          ...prev,
          [selectedTeam.id]: response.data
        }));
      })
      .catch(error => console.error('Error fetching tasks:', error));
  }, [selectedTeam.id]);

  const addTask = () => {
    if (!newTask.trim()) return;
    const newTodo = {
      id: Date.now(),
      name: newTask,
      status: false,
      user_id: user.id,
      team_id: selectedTeam.id
    };
    setTasksByTeam(prev => ({
      ...prev,
      [selectedTeam.id]: [...(prev[selectedTeam.id] || []), newTodo]
    }));
    axios.post('http://localhost:8080/api/todos', newTodo)
      .catch(error => console.error('Error adding task:', error));
    setNewTask('');
  };

  const toggleTaskStatus = (taskId) => {
    setTasksByTeam(prev => ({
      ...prev,
      [selectedTeam.id]: prev[selectedTeam.id].map(task =>
        task.id === taskId ? { ...task, status: !task.status } : task
      )
    }));
    axios.put(`http://localhost:8080/api/todos/${taskId}/toggle`)
      .catch(error => console.error('Error updating task:', error));
  };

  const startEditing = (taskId) => {
    setEditingTaskId(taskId);
  };

  const updateTaskName = (taskId, newName) => {
    setTasksByTeam(prev => ({
      ...prev,
      [selectedTeam.id]: prev[selectedTeam.id].map(task =>
        task.id === taskId ? { ...task, name: newName } : task
      )
    }));
    axios.put(`http://localhost:8080/api/todos/${taskId}`, { name: newName })
      .catch(error => console.error('Error updating task name:', error));
  };

  const handleEditChange = (taskId, e) => {
    const newName = e.target.value;
    setTasksByTeam(prev => ({
      ...prev,
      [selectedTeam.id]: prev[selectedTeam.id].map(task =>
        task.id === taskId ? { ...task, name: newName } : task
      )
    }));
  };

  const handleEditKeyPress = (taskId, e) => {
    if (e.key === 'Enter') {
      updateTaskName(taskId, e.target.value);
      setEditingTaskId(null);
    }
  };

  const openDeleteModal = (taskId) => {
    setTaskToDelete(taskId);
    setIsModalOpen(true);
  };

  const closeDeleteModal = () => {
    setTaskToDelete(null);
    setIsModalOpen(false);
  };

  const deleteTask = () => {
    if (taskToDelete) {
      setTasksByTeam(prev => ({
        ...prev,
        [selectedTeam.id]: prev[selectedTeam.id].filter(task => task.id !== taskToDelete)
      }));
      axios.delete(`http://localhost:8080/api/todos/${taskToDelete}`)
        .catch(error => console.error('Error deleting task:', error));
    }
    closeDeleteModal();
  };

  const openTeamModal = () => {
    setIsTeamModalOpen(true);
  };

  const closeTeamModal = () => {
    setIsTeamModalOpen(false);
    setNewTeamName('');
  };

  const createNewTeam = () => {
    if (!newTeamName.trim()) return;
    const newTeam = {
      id: Date.now(),
      name: newTeamName
    };
    dummyTeams.push(newTeam);
    setSelectedTeam(newTeam);
    closeTeamModal();
    axios.post('http://localhost:8080/api/teams', newTeam)
      .catch(error => console.error('Error creating team:', error));
  };

  return (
    <div className={styles.container}>
      <TeamSection
        teams={dummyTeams}
        
        selectedTeam={selectedTeam}
        setSelectedTeam={setSelectedTeam}
        openTeamModal={openTeamModal}
        isTeamModalOpen={isTeamModalOpen}
        newTeamName={newTeamName}
        setNewTeamName={setNewTeamName}
        createNewTeam={createNewTeam}
        closeTeamModal={closeTeamModal}
      />
      <TodoSection
        selectedTeam={selectedTeam}
        newTask={newTask}
        setNewTask={setNewTask}
        addTask={addTask}
        tasksByTeam={tasksByTeam}
        editingTaskId={editingTaskId}
        setEditingTaskId={setEditingTaskId}  // setEditingTaskId 추가
        toggleTaskStatus={toggleTaskStatus}
        startEditing={startEditing}
        handleEditChange={handleEditChange}
        handleEditKeyPress={handleEditKeyPress}
        openDeleteModal={openDeleteModal}
        isModalOpen={isModalOpen}
        closeDeleteModal={closeDeleteModal}
        deleteTask={deleteTask}
      />

    </div>
  );
};

export default TodoList;
