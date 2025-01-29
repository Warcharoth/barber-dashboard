import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import { ToastProvider, useToast } from './components/ToastContext';

function AuthenticatedApp() {
  const [user, setUser] = useState(null);
  const { addToast } = useToast();

  const handleLogin = (userData) => {
    setUser(userData);
    addToast(`Benvenuto ${userData.username}!`);
  };

  return (
    <>
      {!user ? (
        <Login onLogin={handleLogin} />
      ) : (
        <Dashboard currentUser={user} />
      )}
    </>
  );
}

function App() {
  return (
    <ToastProvider>
      <AuthenticatedApp />
    </ToastProvider>
  );
}

export default App;