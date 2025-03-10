import React, { useState, useEffect } from 'react';
import axios from 'axios';

// 더미 데이터 (팀과 할 일 목록)
const dummyTeams = [
  { id: 1, name: '팀 A', userIds: [1, 2] },
  { id: 2, name: '팀 B', userIds: [3, 4] }
];

const TodoList = ({ user }) => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [selectedTeam, setSelectedTeam] = useState(dummyTeams[0]); // 기본적으로 첫 번째 팀을 선택

  // 👉 더미 데이터 (백엔드 없이 테스트)
  const dummyTasks = [
    { id: 1, name: '할 일 1', status: false, user_id: user.id, team_id: selectedTeam.id },
    { id: 2, name: '할 일 2', status: true, user_id: user.id, team_id: selectedTeam.id }
  ];

  useEffect(() => {
    // 👉 백엔드 없이 테스트할 때는 더미 데이터를 사용
    setTasks(dummyTasks);

    // ✅ 백엔드에서 할 일 목록 가져오기 (팀별)
    axios.get(`http://localhost:8080/api/todos?teamId=${selectedTeam.id}&userId=${user.id}`)
      .then(response => setTasks(response.data))
      .catch(error => console.error('Error fetching tasks:', error));
  }, [user.id, selectedTeam.id]); // 팀과 사용자 ID가 바뀔 때마다 실행

  const addTask = () => {
    if (!newTask.trim()) return;

    const newTodo = { id: tasks.length + 1, name: newTask, status: false, user_id: user.id, team_id: selectedTeam.id };
    
    // 👉 백엔드 없이 테스트할 때는 로컬에서 업데이트
    setTasks([...tasks, newTodo]);

    // ✅ 백엔드에 새로운 할 일 추가 요청
    axios.post('http://localhost:8080/api/todos', newTodo)
      .catch(error => console.error('Error adding task:', error));

    setNewTask('');
  };

  const toggleTaskStatus = (taskId) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, status: !task.status } : task
    ));

    // ✅ 백엔드에 상태 변경 요청
    axios.put(`http://localhost:8080/api/todos/${taskId}/toggle`)
      .catch(error => console.error('Error updating task:', error));
  };

  const handleTeamClick = (team) => {
    setSelectedTeam(team); // 클릭한 팀으로 선택 변경
  };

  return (
    <div style={{ display: 'flex' }}>
      {/* 왼쪽: 팀 목록 */}
      <div style={{ width: '200px', padding: '20px', borderRight: '1px solid #ddd' }}>
        <h3>팀 목록</h3>
        <ul>
          {dummyTeams.map(team => (
            <li
              key={team.id}
              style={{
                cursor: 'pointer',
                fontWeight: selectedTeam.id === team.id ? 'bold' : 'normal',
                padding: '5px 0'
              }}
              onClick={() => handleTeamClick(team)}
            >
              {team.name}
            </li>
          ))}
        </ul>
      </div>

      {/* 오른쪽: 선택된 팀의 할 일 목록 */}
      <div style={{ padding: '20px', flex: 1 }}>
        <h2>{selectedTeam.name}의 Todo List</h2>
        <input
          type="text"
          placeholder="새로운 할 일"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          style={{ padding: '5px', marginBottom: '10px' }}
        />
        <button onClick={addTask} style={{ padding: '5px 10px' }}>추가</button>

        <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
          {tasks.map(task => (
            <li
              key={task.id}
              style={{ textDecoration: task.status ? 'line-through' : 'none', marginBottom: '10px' }}
            >
              {task.name}
              <button
                onClick={() => toggleTaskStatus(task.id)}
                style={{ marginLeft: '10px', padding: '5px' }}
              >
                {task.status ? '되돌리기' : '완료'}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TodoList;
