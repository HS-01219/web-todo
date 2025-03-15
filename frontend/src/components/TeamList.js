import React from 'react';
import styles from './TodoList.module.css';

const TeamList = ({ teams, selectedTeam, onSelectTeam }) => {
  return (
    <div className={styles.teamList}>
      <h3>Team List</h3>
      <ul>
        {teams.map(team => (
          <li
            key={team.id}
            className={`${styles.teamItem} ${selectedTeam.id === team.id ? styles.selectedTeam : ''}`}
            onClick={() => onSelectTeam(team)}
          >
            {team.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TeamList;
