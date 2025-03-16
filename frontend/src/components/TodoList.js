// src/components/TodoList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './TodoList.module.css';
import TeamSection from './TeamSection';
import TodoSection from './TodoSection';

const dummyTeams = [
  { id: 1, name: '팀 A' },
  { id: 2, name: '팀 B' },
  { id: 3, name: '팀 C' },
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
  const [teams, setTeams] = useState(dummyTeams); // ✅ 초기값을 dummyTeams로 설정


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


  useEffect(() => {
    console.log("팀 상태 업데이트됨:", teams); // teams 상태가 변경될 때마다 실행됩니다.
  }, [teams]);



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

    // 기존 dummyTeams 배열을 수정하지 않고 새로운 배열로 상태를 업데이트
    setTeams(prevTeams => [...prevTeams, newTeam]);

    setSelectedTeam(newTeam);
    closeTeamModal();

    axios.post('http://localhost:8080/api/teams', newTeam)
      .catch(error => console.error('Error creating team:', error));
  };

  const deleteTeam = (teamId) => {
    console.log("삭제 전 teams 상태:", teams);

    // 선택된 팀이 삭제된 팀이라면 선택 초기화
    setSelectedTeam((prevSelected) => (prevSelected?.id === teamId ? null : prevSelected));

    // 팀 삭제: 새로운 배열을 반환하여 상태를 업데이트
    setTeams((prevTeams) => {
      const updatedTeams = prevTeams.filter(team => team.id !== teamId);
      console.log("삭제 후 teams 상태:", updatedTeams);
      return updatedTeams; // 새로운 배열 반환
    });
  };

  return (
    <div className={styles.container}>
      <TeamSection
        teams={teams}  // 여기서 dummyTeams가 아니라 teams 상태를 전달
        onDeleteTeam={deleteTeam} // ✅ 삭제 함수 전달
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
