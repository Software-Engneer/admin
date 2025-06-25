import React from 'react';
import './App.css';
import Dashboard from './components/Dashboard';
import LoginPage from './components/LoginPage';
import { AuthProvider, useAuth } from './components/AuthContext';

const AppContent = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="App">
      {isAuthenticated ? <Dashboard /> : <LoginPage />}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
