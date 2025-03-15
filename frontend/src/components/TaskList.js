import React from 'react';
import TaskItem from './TaskItem';
import styles from './TodoList.module.css';

const TaskList = ({ tasks, onToggle, onEdit, onDelete, editingTaskId, onChangeEdit, onKeyPress, setEditingTaskId }) => {
  return (
    <>
      <h3>TO DO</h3>
      <ul className={styles.taskList}>
        {tasks.filter(task => !task.status).map(task => (
          <TaskItem
            key={task.id}
            task={task}
            onToggle={onToggle}
            onEdit={onEdit}
            onDelete={onDelete}
            editingTaskId={editingTaskId}
            onChangeEdit={onChangeEdit}
            onKeyPress={onKeyPress}
            setEditingTaskId={setEditingTaskId}
          />
        ))}
      </ul>

      <h3>DONE</h3>
      <ul className={styles.doneTaskList}>
        {tasks.filter(task => task.status).map(task => (
          <TaskItem
            key={task.id}
            task={task}
            onToggle={onToggle}
            onEdit={onEdit}
            onDelete={onDelete}
            editingTaskId={editingTaskId}
            onChangeEdit={onChangeEdit}
            onKeyPress={onKeyPress}
            setEditingTaskId={setEditingTaskId}
          />
        ))}
      </ul>
    </>
  );
};

export default TaskList;
