// src/components/TodoSection.js
import React from 'react';
import styles from './TodoList.module.css';
import TodoSection from './TodoSection';

const TodoSection = ({
  selectedTeam,
  newTask,
  setNewTask,
  addTask,
  tasksByTeam,
  editingTaskId,
  setEditingTaskId,  // props로 받음
  toggleTaskStatus,
  startEditing,
  handleEditChange,
  handleEditKeyPress,
  openDeleteModal,
  isModalOpen,
  closeDeleteModal,
  deleteTask,
}) => {
  //값 받았는지 확인
  console.log('selectedTeam:', selectedTeam);
  console.log('tasksByTeam:', tasksByTeam);
  console.log('tasksByTeam[selectedTeam?.id]:', tasksByTeam[selectedTeam?.id]);



  return (
    <div className={styles.todoList}>
      <h2>{selectedTeam ? `${selectedTeam.name}의 Todo List` : '팀을 선택해주세요'}</h2>
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
        {(tasksByTeam[selectedTeam?.id] || []).filter(task => !task.status).length === 0 ? (
          <li className={styles.emptyMessage}>할 일이 없습니다.</li>
        ) : (
          (tasksByTeam[selectedTeam?.id] || []).filter(task => !task.status).map(task => (
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
                  <button onClick={() => startEditing(task.id)} className={styles.button}>
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
        {(tasksByTeam[selectedTeam?.id] || []).filter(task => task.status).map(task => (
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
        ))}
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
