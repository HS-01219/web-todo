import React, { useState } from 'react';
import axios from 'axios';
import styles from './AuthForm.module.css';

const AuthForm = ({ onLogin }) => {
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // 에러 메시지 상태

  const dummyUser = { id: 1, userId: 'testUser', password: '1234' };

  const handleSubmit = async () => {
    setErrorMessage(''); // 에러 메시지 초기화

    if (mode === 'register' && password !== confirmPassword) {
      setErrorMessage('비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      if (mode === 'login') {
        if (userId === dummyUser.userId && password === dummyUser.password) {
          onLogin(dummyUser);
          return;
        }

        const response = await axios.post('http://localhost:8080/api/login', { userId, password });
        if (response.data.success) {
          onLogin(response.data.user);
        } else {
          setErrorMessage('아이디 또는 비밀번호를 확인해주세요.');
        }
      } else {
        const response = await axios.post('http://localhost:8080/api/register', { userId, password });
        if (response.data.success) {
          alert('회원가입이 완료되었습니다. 로그인 해주세요.');
          setMode('login'); // 로그인 화면으로 전환
          resetForm(); // 폼 초기화
        } else {
          setErrorMessage('회원가입 실패: 이미 존재하는 아이디입니다.');
        }
      }
    } catch (error) {
      console.error(`${mode === 'login' ? 'Login' : 'Register'} error:`, error);
      setErrorMessage('서버 연결 실패: 백엔드가 실행 중인지 확인하세요.');
    }
  };

  // 🔹 로그인/회원가입 화면 전환 시 폼 초기화
  const resetForm = () => {
    setUserId('');
    setPassword('');
    setConfirmPassword('');
    setErrorMessage('');
  };

  return (
    <div className={styles.container}>
      <div className={styles.authBox}>
        <h2 className={styles.title}>{mode === 'login' ? '로그인' : '회원가입'}</h2>
        <input
          type="text"
          placeholder="User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className={`${styles.input} ${errorMessage ? styles.errorInput : ''}`}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={`${styles.input} ${errorMessage ? styles.errorInput : ''}`}
        />
        {mode === 'register' && (
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={`${styles.input} ${errorMessage ? styles.errorInput : ''}`}
          />
        )}
        {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
        <button onClick={handleSubmit} className={styles.button}>
          {mode === 'login' ? '로그인' : '회원가입'}
        </button>
        <p className={styles.toggleText}>
          {mode === 'login' ? '계정이 없나요? ' : '이미 계정이 있나요? '}
          <span
            onClick={() => {
              setMode(mode === 'login' ? 'register' : 'login');
              resetForm(); // 🔹 화면 전환 시 폼 초기화
            }}
            className={styles.toggleButton}
          >
            {mode === 'login' ? '회원가입' : '로그인'}
          </span>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
