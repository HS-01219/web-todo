import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './TodoList.module.css';

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
      id: Date.now(), // Assuming the backend will generate the team ID
      name: newTeamName
    };

    // Add the new team to the list
    dummyTeams.push(newTeam); // You should ideally fetch the teams again from your backend

    setSelectedTeam(newTeam);
    closeTeamModal();

    axios.post('http://localhost:8080/api/teams', newTeam)
      .catch(error => console.error('Error creating team:', error));
  };

  return (
    <div className={styles.container}>
      <div className={styles.teamList}>
        <h3>Team List</h3>
        <ul>
          {dummyTeams.map(team => (
            <li
              key={team.id}
              className={`${styles.teamItem} ${selectedTeam.id === team.id ? styles.selectedTeam : ''}`}
              onClick={() => setSelectedTeam(team)}
            >
              {team.name}
            </li>
          ))}
        </ul>
        <button onClick={openTeamModal} className={styles.addTeamButton}>팀 만들기</button>
      </div>

      <div className={styles.todoList}>
        <h2>{selectedTeam.name}의 Todo List</h2>
        <div className={styles.inputWrapper}>
          <input
            type="text"
            placeholder="새로운 할 일"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            className={styles.inputTask}
          />
          <button onClick={addTask} className={styles.addButton}>등록하기</button>
        </div>

        <h3>TO DO</h3>
        <ul className={styles.taskList}>
          {(tasksByTeam[selectedTeam.id] || []).filter(task => !task.status).map(task => (
            <li key={task.id} className={styles.taskItem}>
              <input
                type="checkbox"
                checked={task.status}
                onChange={() => toggleTaskStatus(task.id)}
                className={styles.checkbox}
              />
              {editingTaskId === task.id ? (
                <input
                  type="text"
                  value={task.name}
                  onChange={(e) => handleEditChange(task.id, e)}
                  onKeyPress={(e) => handleEditKeyPress(task.id, e)}
                  autoFocus
                  className={styles.editInput}
                />
              ) : (
                <span className={styles.taskName}>{task.name}</span>
              )}
              {editingTaskId === task.id ? (
                <button onClick={() => setEditingTaskId(null)} className={styles.button}>완료</button>
              ) : (
                <>
                  <button onClick={() => startEditing(task.id)} className={styles.button}>수정</button>
                  <button onClick={() => openDeleteModal(task.id)} className={`${styles.button} ${styles.deleteButton}`}>삭제</button>
                </>
              )}
            </li>
          ))}
        </ul>

        <h3>DONE</h3>
        <ul className={styles.doneTaskList}>
          {(tasksByTeam[selectedTeam.id] || []).filter(task => task.status).map(task => (
            <li key={task.id} className={`${styles.taskItem} ${styles.completedTask}`}>
              <input
                type="checkbox"
                checked={task.status}
                onChange={() => toggleTaskStatus(task.id)}
                className={styles.checkbox}
              />
              <span className={styles.taskName}>{task.name}</span>
              <button onClick={() => openDeleteModal(task.id)} className={`${styles.button} ${styles.deleteButton}`}>삭제</button>
            </li>
          ))}
        </ul>
      </div>

      {/* 팀 만들기 모달 */}
      {isTeamModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>새 팀 만들기</h3>
            <input
              type="text"
              value={newTeamName}
              onChange={(e) => setNewTeamName(e.target.value)}
              placeholder="팀 이름"
              className={styles.inputTask}
            />
            <div>
              <button onClick={createNewTeam} className={`${styles.button} ${styles.addButton}`}>팀 만들기</button>
              <button onClick={closeTeamModal} className={`${styles.button} ${styles.cancelButton}`}>취소</button>
            </div>
          </div>
        </div>
      )}

      {/* 삭제 확인 모달 */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <p>정말로 이 할 일을 삭제하시겠습니까?</p>
            <div>
              <button onClick={deleteTask} className={`${styles.button} ${styles.deleteButton}`}>삭제</button>
              <button onClick={closeDeleteModal} className={`${styles.button} ${styles.cancelButton}`}>취소</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodoList;
