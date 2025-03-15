import React, { useState } from 'react';
import { FaCog } from 'react-icons/fa';  // react-icons에서 FontAwesome 기어 아이콘 임포트
import styles from './TodoList.module.css';

const TeamSection = ({
  teams,
  selectedTeam,
  setSelectedTeam,
  openTeamModal,
  isTeamModalOpen,
  newTeamName,
  setNewTeamName,
  createNewTeam,
  closeTeamModal,
}) => {
  const [settingsTeamId, setSettingsTeamId] = useState(null);

  const toggleSettings = (teamId, e) => {
    e.stopPropagation();
    setSettingsTeamId(settingsTeamId === teamId ? null : teamId);
  };

  const handleInviteMember = (teamId) => {
    console.log(`${teamId} 팀의 팀원을 초대합니다.`);
    setSettingsTeamId(null);
  };

  const handleDeleteMember = (teamId) => {
    console.log(`${teamId} 팀을 삭제합니다.`);
    setSettingsTeamId(null);
  };

  return (
    <div className={styles.teamList}>
      <h3>Team List</h3>
      <ul className={styles.teamListWrapper}>
        {teams.map(team => (
          <li
            key={team.id}
            className={`${styles.teamItem} ${selectedTeam.id === team.id ? styles.selectedTeam : ''}`}
            onClick={() => setSelectedTeam(team)}
            style={{ position: 'relative' }}
          >
            <span>{team.name}</span>
            <button 
              className={styles.settingsButton}
              onClick={(e) => toggleSettings(team.id, e)}
            >
              <FaCog /> {/* FontAwesome 기어 아이콘 */}
            </button>
            {settingsTeamId === team.id && (
              <div className={styles.teamSettingsBox}>
                <button 
                  onClick={() => handleInviteMember(team.id)}
                  className={styles.teamSettingsButton}
                >
                  팀원 초대하기
                </button>
                <button 
                  onClick={() => handleDeleteMember(team.id)}
                  className={styles.teamSettingsButton}
                >
                  삭제하기
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
      <button onClick={openTeamModal} className={styles.addTeamButton}>
        팀 만들기
      </button>

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
              <button onClick={createNewTeam} className={`${styles.button} ${styles.addButton}`}>
                팀 만들기
              </button>
              <button onClick={closeTeamModal} className={`${styles.button} ${styles.cancelButton}`}>
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamSection;
