import React, { useState } from 'react';
import { FaCog, FaTrashAlt } from 'react-icons/fa';
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
  onDeleteTeam,
}) => {
  const [settingsTeamId, setSettingsTeamId] = useState(null);
  const [inviteMemberModalOpen, setInviteMemberModalOpen] = useState(false);
  const [inviteUserId, setInviteUserId] = useState('');
  const [inviteUserList, setInviteUserList] = useState([]);

  const toggleSettings = (teamId, e) => {
    e.stopPropagation();
    setSettingsTeamId(settingsTeamId === teamId ? null : teamId);
  };

  const handleInviteMember = () => {
    if (!inviteUserId.trim()) {
      alert('유저 아이디를 입력하세요.');
      return;
    }
    
    setInviteUserList(prevList => [...prevList, inviteUserId.trim()]);
    setInviteUserId('');
  };

  const handleDeleteUser = (userId) => {
    setInviteUserList(prevList => prevList.filter(user => user !== userId));
  };

  const handleDeleteMember = (teamId) => {
    const teamName = teams.find(t => t.id === teamId)?.name || '해당 팀';
    if (window.confirm(`정말 "${teamName}" 팀을 삭제하시겠습니까?`)) {
      onDeleteTeam(teamId);
    }
    setSettingsTeamId(null);
  };

  return (
    <div className={styles.teamList}>
      <h3>Team List</h3>
      <ul className={styles.teamListWrapper}>
        {teams.map(team => (
          <li
            key={team.id}
            className={`${styles.teamItem} ${selectedTeam?.id === team.id ? styles.selectedTeam : ''}`}
            onClick={() => setSelectedTeam(team)}
            style={{ position: 'relative' }}
          >
            <span>{team.name}</span>
            <button
              className={styles.settingsButton}
              onClick={(e) => toggleSettings(team.id, e)}
            >
              <FaCog />
            </button>
            {settingsTeamId === team.id && (
              <div className={styles.teamSettingsBox}>
                <button
                  onClick={() => setInviteMemberModalOpen(true)}
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

      {inviteMemberModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>팀원 초대</h3>
            <div className={styles.inviteInputWrapper}>
              <input
                type="text"
                value={inviteUserId}
                onChange={(e) => setInviteUserId(e.target.value)}
                placeholder="초대할 유저의 아이디"
                className={styles.inputTask}
              />
              <button
                onClick={handleInviteMember}
                className={`${styles.button} ${styles.addButton}`}
              >
                초대
              </button>
            </div>
            <div className={styles.inviteList}>
              {inviteUserList.length > 0 && (
                <ul>
                  {inviteUserList.map((userId, index) => (
                    <li key={index} className={styles.inviteListItem}>
                      <span>{userId}</span>
                      <button
                        onClick={() => handleDeleteUser(userId)}
                        className={styles.inviteDeleteButton}
                      >
                        <FaTrashAlt />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div>
              <button onClick={() => setInviteMemberModalOpen(false)} className={`${styles.button} ${styles.cancelButton}`}>
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamSection;
