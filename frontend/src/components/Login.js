import React, { useState } from 'react';
import axios from 'axios';
import styles from './Login.module.css'; // CSS Modules 사용

const Login = ({ onLogin }) => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // 비밀번호 재확인 필드

  // 👉 백엔드 없이 로그인 테스트용 더미 유저
  const dummyUser = { id: 1, userId: 'testUser', password: '1234' };

  const handleLogin = async () => {
    // 비밀번호 확인
    if (password !== confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (userId === dummyUser.userId && password === dummyUser.password) {
      onLogin(dummyUser);
      return;
    }

    try {
      const response = await axios.post('http://localhost:8080/api/login', { userId, password });
      if (response.data.success) {
        onLogin(response.data.user);
      } else {
        alert('로그인 실패: 아이디 또는 비밀번호가 잘못되었습니다.');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('서버 연결 실패: 백엔드가 실행 중인지 확인하세요.');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginBox}>
        <h2 className={styles.title}>로그인</h2>
        <input
          type="text"
          placeholder="User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className={styles.input}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={styles.input}
        />
        <input
          type="password"
          placeholder="Confirm Password" // 비밀번호 재확인 필드
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className={styles.input}
        />
        <button onClick={handleLogin} className={styles.button}>로그인</button>
      </div>
    </div>
  );
};

export default Login;
