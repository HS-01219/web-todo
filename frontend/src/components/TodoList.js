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
  const [selectedTeamTasks, setSelectedTeamTasks] = useState([]);
  // 팀원 초대에 필요한 상태 변수 추가
  const [inviteMemberId, setInviteMemberId] = useState(''); // 초대할 팀원의 loginId
  const [isInviting, setIsInviting] = useState(false); // 초대 진행 중인지 여부

  const savedUser = JSON.parse(localStorage.getItem('userId')); // 로컬 스토리지에서 userId 가져오기

  // 팀 목록 조회 (GET /teams?userId={userId})
  useEffect(() => {
    axios.get(`http://localhost:5000/teams?userId=${savedUser}`)
      .then(response => {
        const fetchedTeams = response.data.map(team => ({
          id: team.id,
          name: team.name
        }));

        if (fetchedTeams.length === 0) {
          setTeams([]);
          setSelectedTeam(null);
        } else {
          setTeams(fetchedTeams);
          setSelectedTeam(fetchedTeams[0]);
        }
      })
      .catch(error => {
        console.error('팀 목록 가져오기 실패:', error);
        setTeams([]);
        setSelectedTeam(null);
      });
  }, [savedUser]);

  // 선택된 팀에 대한 할일 목록 조회
  useEffect(() => {
    if (selectedTeam) {
      axios.get(`http://localhost:5000/works?teamId=${selectedTeam.id}&state=0`)
        .then(response => {
          setSelectedTeamTasks(response.data);
          setTasksByTeam(prev => ({
            ...prev,
            [selectedTeam.id]: response.data,
          }));
        })
        .catch(error => {
          console.error('할일 목록 가져오기 실패:', error);
        });
    }
  }, [selectedTeam]);
  //[{"id" :15,"name" : "할일", "state": 0, "teamId": 1, "userId": 1}]

  // tasksByTeam 상태가 변경될 때마다 콘솔에 출력하여 값이 잘 들어갔는지 확인
  useEffect(() => {
    console.log('tasksByTeam:', tasksByTeam);
  }, [tasksByTeam]);

  // 팀원 초대 처리 (POST /members)
  const inviteMember = () => {
    if (!inviteMemberId.trim()) return; // 아이디가 비어있으면 리턴

    const memberData = {
      teamId: selectedTeam.id, // 현재 선택된 팀 ID
      loginId: inviteMemberId // 초대할 팀원의 loginId
    };

    setIsInviting(true); // 초대 진행 중 상태로 설정

    axios.post('http://localhost:5000/members', memberData)
      .then(response => {
        if (response.status === 201) {
          console.log('팀원 초대 성공');
          setInviteMemberId(''); // 초대 후 입력값 초기화
        }
      })
      .catch(error => {
        console.error('팀원 초대 실패:', error);
      })
      .finally(() => {
        setIsInviting(false); // 초대 진행 완료 상태로 변경
      });
  };

  // 할일 등록 (POST /works)
  const addTask = () => {
    if (!newTask.trim()) return; // 할일 내용이 비어있으면 리턴

    const newTodo = {
      name: newTask,
      userId: user.id,
      teamId: selectedTeam ? selectedTeam.id : null
    };

    // 로컬 상태 업데이트 
    setSelectedTeamTasks(prev => [...prev, newTodo]);

    axios.post('http://localhost:5000/works', newTodo)
      .then(response => {
        if (response.status === 201) {
          console.log('할일 등록 성공');
        }
      })
      .catch(error => console.error('할일 등록 에러:', error));

    setNewTask(''); // 입력 필드 초기화
  };

  // 할일 상태 토글 (TODO <-> DONE) : PUT /works
  const toggleTaskStatus = (taskId) => {
    const task = selectedTeamTasks.find(t => t.id === taskId);
    if (!task) return;

    const newStatus = task.status ? 0 : 1;

    // 로컬 상태 업데이트
    setSelectedTeamTasks(prev => prev.map(t =>
      t.id === taskId ? { ...t, status: newStatus } : t
    ));

    // API 요청: 상태 변경
    axios.put('http://localhost:5000/works', { id: taskId, state: newStatus })
      .catch(error => console.error('Error updating task status:', error));
  };

  // 할일 이름 수정 (PUT /works)
  const updateTaskName = (taskId, newName) => {
    const task = selectedTeamTasks.find(t => t.id === taskId);
    if (!task) return;

    setSelectedTeamTasks(prev => prev.map(t =>
      t.id === taskId ? { ...t, name: newName } : t
    ));

    // API 요청: 이름 변경
    axios.put('http://localhost:5000/works', { id: taskId, name: newName })
      .catch(error => console.error('Error updating task name:', error));
  };

  const handleEditChange = (taskId, e) => {
    const newName = e.target.value;
    setSelectedTeamTasks(prev => prev.map(task =>
      task.id === taskId ? { ...task, name: newName } : task
    ));
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
      setSelectedTeamTasks(prev => prev.filter(task => task.id !== taskToDelete));

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
          const createdTeam = {
            id: response.data.id,
            name: response.data.name,
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
    setSelectedTeam(prevSelected => (prevSelected?.id === teamId ? null : prevSelected));

    axios.delete(`http://localhost:5000/teams/${teamId}`)
      .then(() => {
        setTeams(prevTeams => {
          return prevTeams.filter(team => team.id !== teamId);
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
        // 팀원 초대 UI 추가
        inviteMemberId={inviteMemberId}
        setInviteMemberId={setInviteMemberId}
        inviteMember={inviteMember}
        isInviting={isInviting}
      />
      <TodoSection
        selectedTeam={selectedTeam}
        newTask={newTask}
        setNewTask={setNewTask}
        addTask={addTask}
        tasksByTeam={selectedTeamTasks}
        editingTaskId={editingTaskId}
        setEditingTaskId={setEditingTaskId}
        toggleTaskStatus={toggleTaskStatus}
        handleEditChange={handleEditChange}
        handleEditKeyPress={handleEditKeyPress}
        openDeleteModal={openDeleteModal}
        isModalOpen={isModalOpen}
        closeDeleteModal={closeDeleteModal}
        deleteTask={deleteTask}
        startEditing={startEditing}   // 추가된 함수 전달
      />
    </div>
  );
};

export default TodoList;
