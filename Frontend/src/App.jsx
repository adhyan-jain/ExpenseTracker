import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Transactions from './components/Transactions';
import Prediction from './components/Prediction';
import './index.css';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [activePage, setActivePage] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('userEmail');
    
    if (token && email) {
      setIsAuthenticated(true);
      setUserEmail(email);
    }
  }, []);

  const handleLogin = (token, email) => {
    localStorage.setItem('token', token);
    localStorage.setItem('userEmail', email);
    setIsAuthenticated(true);
    setUserEmail(email);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    setIsAuthenticated(false);
    setUserEmail('');
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="container">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      
      <div className="main-content">
        <div className="header">
          <i className="fas fa-bars menu-toggle"></i>
          <h1>{activePage.charAt(0).toUpperCase() + activePage.slice(1)}</h1>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
        
        {activePage === 'dashboard' && (
          <Dashboard userEmail={userEmail} />
        )}
        
        {activePage === 'transactions' && (
          <Transactions userEmail={userEmail} />
        )}
        
        {activePage === 'prediction' && (
          <Prediction userEmail={userEmail} />
        )}
      </div>
    </div>
  );
};

export default App;
