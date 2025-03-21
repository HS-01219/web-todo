import React from 'react';
import styles from './TodoList.module.css';
import axios from 'axios';

const TodoSection = ({
  selectedTeam,
  newTask,
  setNewTask,
  addTask,
  tasksByTeam,
  editingTaskId,
  setEditingTaskId,
  toggleTaskStatus,
  handleEditChange,
  handleEditKeyPress,
  openDeleteModal,
  isModalOpen,
  closeDeleteModal,
  deleteTask,
  myTasks
}) => {

  const updateTaskName = (taskId, newName) => {
    if (!selectedTeam?.id) return;

    const task = tasksByTeam[selectedTeam.id]?.find(t => t.id === taskId);
    if (!task) return;

    // 로컬 상태 업데이트
    const updatedTasks = tasksByTeam[selectedTeam.id].map(t =>
      t.id === taskId ? { ...t, name: newName } : t
    );

    // API 요청: 이름 변경
    axios.put('http://localhost:5000/works', { id: taskId, name: newName })
      .catch(error => console.error('Error updating task name:', error));
  };

  // 내 할일을 팀 목록처럼 추가하기
  const tasksToDisplay = selectedTeam ? tasksByTeam : myTasks;

  return (
    <div className={styles.todoList}>
      <h2>{selectedTeam ? `${selectedTeam.name}의 Todo List` : '내 Todo List'}</h2>
      <div className={styles.inputWrapper}>
        <input
          type="text"
          placeholder="새로운 할 일"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          className={styles.inputTask}
        />
        <button onClick={addTask} className={styles.addButton}>
          등록하기
        </button>
      </div>
      <h3>TO DO</h3>
      <ul className={styles.taskList}>
        {(tasksToDisplay || [])
          .filter(task => task.state === 0) // state가 0인 항목만 필터링
          .length === 0 ? (
          <li className={styles.emptyMessage}>할 일이 없습니다.</li>
        ) : (
          (tasksToDisplay || [])
            .filter(task => task.state === 0) // state가 0인 항목만 필터링
            .map(task => (
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
                  <button onClick={() => setEditingTaskId(null)} className={styles.button}>
                    완료
                  </button>
                ) : (
                  <>
                    <button onClick={() => setEditingTaskId(task.id)} className={styles.button}>
                      수정
                    </button>
                    <button onClick={() => openDeleteModal(task.id)} className={`${styles.button} ${styles.deleteButton}`}>
                      삭제
                    </button>
                  </>
                )}
              </li>
            ))
        )}
      </ul>

      <h3>DONE</h3>
      <ul className={styles.doneTaskList}>
        {(tasksToDisplay || [])
          .filter(task => task.state === 1) // state가 1인 항목만 필터링
          .length === 0 ? (
          <li className={styles.emptyMessage}>완료된 일이 없습니다.</li>
        ) : (
          (tasksToDisplay || [])
            .filter(task => task.state === 1) // state가 1인 항목만 필터링
            .map(task => (
              <li key={task.id} className={`${styles.taskItem} ${styles.completedTask}`}>
                <input
                  type="checkbox"
                  checked={task.status}
                  onChange={() => toggleTaskStatus(task.id)}
                  className={styles.checkbox}
                />
                <span className={styles.taskName}>{task.name}</span>
                <button onClick={() => openDeleteModal(task.id)} className={`${styles.button} ${styles.deleteButton}`}>
                  삭제
                </button>
              </li>
            ))
        )}
      </ul>
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <p>정말로 이 할 일을 삭제하시겠습니까?</p>
            <div>
              <button onClick={deleteTask} className={`${styles.button} ${styles.deleteButton}`}>
                삭제
              </button>
              <button onClick={closeDeleteModal} className={`${styles.button} ${styles.cancelButton}`}>
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodoSection;
