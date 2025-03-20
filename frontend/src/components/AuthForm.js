import React, { useState } from 'react';
import axios from 'axios';
import styles from './AuthForm.module.css';

const AuthForm = ({ onLogin }) => {
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [loginId, setUserId] = useState('');
  const [pwd, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // 에러 메시지 상태

  const handleSubmit = async () => {
    setErrorMessage(''); // 에러 메시지 초기화

    if (mode === 'register' && pwd !== confirmPassword) {
      setErrorMessage('비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      if (mode === 'login') {
        const response = await axios.post('http://localhost:5000/users/login', { loginId: loginId, pwd: pwd });
        console.log(response)
        if (response.status === 200) {
          localStorage.setItem('userId', JSON.stringify(response.data.id));
          onLogin(response.data.id); 
        }
      } else {
        const response = await axios.post('http://localhost:5000/users/join', { loginId: loginId, pwd: pwd });
        if (response.status === 201) {
          alert('회원가입이 완료되었습니다. 로그인 해주세요.');
          setMode('login'); // 로그인 화면으로 전환
          resetForm(); // 폼 초기화
        }
      }
    } catch (error) {
      setErrorMessage(error.response.data.message);
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
          value={loginId}
          onChange={(e) => setUserId(e.target.value)}
          className={`${styles.input} ${errorMessage ? styles.errorInput : ''}`}
        />
        <input
          type="password"
          placeholder="Password"
          value={pwd}
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
