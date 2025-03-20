// src/components/TodoList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './TodoList.module.css';
import TeamSection from './TeamSection';
import TodoSection from './TodoSection';

const TodoList = ({ user }) => {
  const [tasksByTeam, setTasksByTeam] = useState({});
  const [newTask, setNewTask] = useState('');
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [newTeamName, setNewTeamName] = useState('');
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);

  const startEditing = (taskId) => {
    setEditingTaskId(taskId);
  };

  // localStorage에 저장된 userId (문자열)
  const savedUser = JSON.parse(localStorage.getItem('userId'));

  // 팀 목록 조회 (GET /teams?userId={userId})
  useEffect(() => {
    axios.get(`http://localhost:5000/teams?userId=${savedUser}`)
      .then(response => {
        const fetchedTeams = response.data.map(team => ({
          id: team.teamId,
          name: team.teamName
        }));
  
        if (fetchedTeams.length === 0) {
          // 기본 리스트 생성
          const defaultTeam = { name: '나의 TodoList', userId: savedUser };
          
          axios.post('http://localhost:5000/teams', defaultTeam)
          .then(response => {
            // 기본 팀 생성 후 팀 목록에 추가
            const createdTeam = {
              id: response.data.teamId,
              name: response.data.teamName,
            };
            setTeams([createdTeam]);
            setSelectedTeam(createdTeam); // 기본 팀을 선택 상태로 설정
          })
          .catch(error => {
            console.error('기본 팀 생성 실패:', error);
          });
        } else {
          // 팀 목록이 있으면 첫 번째 팀을 선택
          setTeams(fetchedTeams);
          setSelectedTeam(fetchedTeams[0]);
        }
      })
      .catch(error => {
        console.error('팀 목록 가져오기 실패:', error);
        const dummyTeam = { id: 9999, name: '더미 팀' };
        setTeams([dummyTeam]);
        setSelectedTeam(dummyTeam);
      });
  }, [savedUser]);
  

  useEffect(() => {
    console.log("팀 상태 업데이트됨:", teams);
  }, [teams]);

  // 할일 등록 (POST /works)
  const addTask = () => {
    if (!newTask.trim() || !selectedTeam) return;
    // 로컬 상태용 할일 객체 (status: false -> TODO, true -> DONE)
    const newTodo = {
      id: Date.now(),
      name: newTask,
      status: false,
      user_id: user.id,
      team_id: selectedTeam.id
    };
    // 로컬 상태 업데이트
    setTasksByTeam(prev => ({
      ...prev,
      [selectedTeam.id]: [...(prev[selectedTeam.id] || []), newTodo]
    }));
    // API 요청: 팀 할일 등록의 경우 { teamId, name }
    axios.post('http://localhost:5000/works', { teamId: selectedTeam.id, name: newTask })
      .then(response => {
        if (response.status === 201) {
          console.log('할일 등록 성공');
        }
      })
      .catch(error => console.error('할일 등록 에러:', error));
    setNewTask('');
  };

  // 할일 상태 토글 (TODO <-> DONE) : PUT /works
  const toggleTaskStatus = (taskId) => {
    const teamTasks = tasksByTeam[selectedTeam.id] || [];
    const task = teamTasks.find(t => t.id === taskId);
    if (!task) return;
    const newStatus = !task.status;
    setTasksByTeam(prev => ({
      ...prev,
      [selectedTeam.id]: prev[selectedTeam.id].map(t =>
         t.id === taskId ? { ...t, status: newStatus } : t
      )
    }));
    // API 요청: 업데이트 시 기존 이름과 새로운 상태 전달 (state: 0 = TODO, 1 = DONE)
    axios.put('http://localhost:5000/works', { id: taskId, name: task.name, state: newStatus ? 1 : 0 })
      .catch(error => console.error('Error updating task status:', error));
  };

  // 할일 이름 수정 (PUT /works)
  const updateTaskName = (taskId, newName) => {
    const teamTasks = tasksByTeam[selectedTeam.id] || [];
    const task = teamTasks.find(t => t.id === taskId);
    if (!task) return;
    setTasksByTeam(prev => ({
      ...prev,
      [selectedTeam.id]: prev[selectedTeam.id].map(t =>
        t.id === taskId ? { ...t, name: newName } : t
      )
    }));
    axios.put('http://localhost:5000/works', { id: taskId, name: newName, state: task.status ? 1 : 0 })
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

  // 할일 삭제 (DELETE /works/:id)
  const deleteTask = () => {
    if (taskToDelete) {
      setTasksByTeam(prev => ({
        ...prev,
        [selectedTeam.id]: prev[selectedTeam.id].filter(task => task.id !== taskToDelete)
      }));
      axios.delete(`http://localhost:5000/works/${taskToDelete}`)
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

  // 팀 생성 (POST /teams)
  const createNewTeam = () => {
    if (!newTeamName.trim()) return;
    const teamData = {
      userId: savedUser,
      name: newTeamName,
    };

    axios.post('http://localhost:5000/teams', teamData)
      .then(response => {
        if (response.status === 201) {
          // 응답 데이터 예시: { teamId, teamName }
          const createdTeam = {
            id: response.data.teamId,
            name: response.data.teamName,
          };
          setTeams(prevTeams => [...prevTeams, createdTeam]);
          setSelectedTeam(createdTeam);
          closeTeamModal();
        }
      })
      .catch(error => console.error('팀 생성 실패:', error));
  };

  // 팀 삭제 (DELETE /teams/:teamId)
  const deleteTeam = (teamId) => {
    console.log("삭제 전 teams 상태:", teams);
    setSelectedTeam(prevSelected => (prevSelected?.id === teamId ? null : prevSelected));

    axios.delete(`http://localhost:5000/teams/${teamId}`)
      .then(() => {
        setTeams(prevTeams => {
          const updatedTeams = prevTeams.filter(team => team.id !== teamId);
          console.log("삭제 후 teams 상태:", updatedTeams);
          return updatedTeams;
        });
      })
      .catch(error => console.error('팀 삭제 실패:', error));
  };

  return (
    <div className={styles.container}>
      <TeamSection
        teams={teams}
        onDeleteTeam={deleteTeam}
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
        setEditingTaskId={setEditingTaskId}
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
