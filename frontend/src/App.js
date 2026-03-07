import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import { useAuth } from './context/AuthContext';

// Layout
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/layout/ProtectedRoute';

// Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/Dashboard';
import Benchmark from './pages/Benchmark';
import Reports from './pages/Reports';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';

// Styles
import './App.css';

function App() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleToggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <>
      <CssBaseline />
      <Router>
        <div className="app">
          {user && (
            <Navbar
              onMenuClick={handleToggleSidebar}
              sidebarOpen={sidebarOpen}
            />
          )}
          <div className="app-container">
            {user && (
              <Sidebar
                mobileOpen={sidebarOpen}
                onClose={handleCloseSidebar}
              />
            )}
            <main className="main-content">
              <Routes>
                <Route 
                  path="/login" 
                  element={user ? <Navigate to="/dashboard" /> : <Login />} 
                />
                <Route 
                  path="/register" 
                  element={user ? <Navigate to="/dashboard" /> : <Register />} 
                />
                
                <Route element={<ProtectedRoute />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/benchmark" element={<Benchmark />} />
                  <Route path="/reports" element={<Reports />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/" element={<Navigate to="/dashboard" />} />
                </Route>
                
                <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
              </Routes>
            </main>
          </div>
          {user && <Footer />}
        </div>
      </Router>
    </>
  );
}

export default App;
