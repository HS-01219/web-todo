import React, { useState, useEffect } from 'react';
import { FaCog, FaTrashAlt } from 'react-icons/fa';
import axios from 'axios';
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
  const [teamMembers, setTeamMembers] = useState([]);
  const [inviteMemberId, setInviteMemberId] = useState('');
  const [isInviting, setIsInviting] = useState(false);

  // 팀원 초대 처리
  const inviteMember = () => {
    if (!inviteMemberId.trim()) return; // 아이디가 비어있으면 리턴

    const memberData = {
      teamId: selectedTeam.id, // 현재 선택된 팀 ID
      loginId: inviteMemberId, // 초대할 팀원의 loginId
    };

    setIsInviting(true); // 초대 진행 중 상태로 설정

    axios
      .post('http://localhost:5000/members', memberData)
      .then((response) => {
        if (response.status === 201) {
          console.log('팀원 초대 성공');
          setInviteMemberId(''); // 초대 후 입력값 초기화
          getTeamMembers(); // 팀원 목록 갱신
        }
      })
      .catch((error) => {
        console.error('팀원 초대 실패:', error);
      })
      .finally(() => {
        setIsInviting(false); // 초대 진행 완료 상태로 변경
      });
  };

  // 팀원 조회
  const getTeamMembers = () => {
    axios
      .get(`http://localhost:5000/members?teamId=${selectedTeam.id}`)
      .then((response) => {
        if (response.status === 200) {
          setTeamMembers(response.data); // 팀원 목록 업데이트
        }
      })
      .catch((error) => {
        console.error('팀원 조회 실패:', error);
      });
  };

  // 팀원 삭제
  const deleteMember = (memberId) => {
    axios
      .delete(`http://localhost:5000/members/${memberId}`)
      .then((response) => {
        if (response.status === 200) {
          console.log('팀원 삭제 성공');
          setTeamMembers((prevMembers) =>
            prevMembers.filter((member) => member.id !== memberId)
          ); // 삭제된 팀원 목록에서 제거
        }
      })
      .catch((error) => {
        console.error('팀원 삭제 실패:', error);
      });
  };

  // 팀 설정 열기
  const toggleSettings = (teamId, e) => {
    e.stopPropagation();
    setSettingsTeamId(settingsTeamId === teamId ? null : teamId);
  };

  // 팀원 초대 버튼 클릭 시
  const handleInviteMember = () => {
    if (!inviteUserId.trim()) {
      alert('유저 아이디를 입력하세요.');
      return;
    }

    setInviteUserList((prevList) => [...prevList, inviteUserId.trim()]);
    setInviteUserId('');
  };

  // 팀원 삭제
  const handleDeleteUser = (userId) => {
    setInviteUserList((prevList) => prevList.filter((user) => user !== userId));
  };

  // 팀 삭제
  const handleDeleteMember = (teamId) => {
    const teamName = teams.find((t) => t.id === teamId)?.name || '해당 팀';
    if (window.confirm(`정말 "${teamName}" 팀을 삭제하시겠습니까?`)) {
      onDeleteTeam(teamId);
    }
    setSettingsTeamId(null);
  };

  // 팀 선택 시 팀원 조회
  useEffect(() => {
    if (selectedTeam) {
      getTeamMembers(); // 팀이 선택되면 팀원 목록을 조회
    }
  }, [selectedTeam]);

  return (
    <div className={styles.teamList}>
      <h3>Team List</h3>
      <ul className={styles.teamListWrapper}>
        {teams.map((team) => (
          <li
            key={team.id}
            className={`${styles.teamItem} ${
              selectedTeam?.id === team.id ? styles.selectedTeam : ''
            }`}
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
              <button
                onClick={createNewTeam}
                className={`${styles.button} ${styles.addButton}`}
              >
                팀 만들기
              </button>
              <button
                onClick={closeTeamModal}
                className={`${styles.button} ${styles.cancelButton}`}
              >
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
                onClick={inviteMember}
                className={`${styles.button} ${styles.addButton}`}
                disabled={isInviting}
              >
                {isInviting ? '초대 중...' : '초대'}
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
              <button
                onClick={() => setInviteMemberModalOpen(false)}
                className={`${styles.button} ${styles.cancelButton}`}
              >
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
