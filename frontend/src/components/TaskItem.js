import React from 'react';
import styles from './TodoList.module.css';

const TaskItem = ({ task, onToggle, onEdit, onDelete, editingTaskId, onChangeEdit, onKeyPress, setEditingTaskId }) => {
  return (
    <li key={task.id} className={`${styles.taskItem} ${task.status ? styles.completedTask : ''}`}>
      <input
        type="checkbox"
        checked={task.status}
        onChange={() => onToggle(task.id)}
        className={styles.checkbox}
      />
      {editingTaskId === task.id ? (
        <input
          type="text"
          value={task.name}
          onChange={(e) => onChangeEdit(task.id, e)}
          onKeyPress={(e) => onKeyPress(task.id, e)}
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
          <button onClick={() => onEdit(task.id)} className={styles.button}>수정</button>
          <button onClick={() => onDelete(task.id)} className={`${styles.button} ${styles.deleteButton}`}>삭제</button>
        </>
      )}
    </li>
  );
};

export default TaskItem;
