import React, { useState } from 'react';
import Login from './components/AuthForm';
import TodoList from './components/TodoList';

const App = () => {
  const [user, setUser] = useState(null);

  return (
    <div>
      {!user ? <Login onLogin={setUser} /> : <TodoList user={user} />}
    </div>
  );
};

export default App;
