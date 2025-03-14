// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client'; // 'react-dom'에서 'react-dom/client'로 import 변경
import App from './App';

// React 18에서는 createRoot()를 사용해야 합니다.
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
