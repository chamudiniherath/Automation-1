import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Layout from './layout/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Search from './pages/Search';
import AdminDashboard from './pages/AdminDashboard';

function ProtectedRoute({ isAuthenticated, children }) {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false); // ✅ NEW state

  // ✅ Check session on load
  useEffect(() => {
    checkSession();

    // ✅ Check session every minute
    const interval = setInterval(checkSession, 60000);
    return () => clearInterval(interval);
  }, []);

  const checkSession = () => {
    fetch('http://localhost:5000/api/auth/session', {
      credentials: 'include',
    })
      .then((res) => {
        if (!res.ok) throw new Error('Session invalid');
        return res.json();
      })
      .then((data) => {
        setIsAuthenticated(true);
        setIsAdmin(data.isAdmin); // ✅ get admin from backend
      })
      .catch((err) => {
        setIsAuthenticated(false);
        setIsAdmin(false);
      });
  };

  // ✅ Handler for login success
  const handleLogin = (isAdminFlag = false) => {
    setIsAuthenticated(true);
    setIsAdmin(isAdminFlag);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setIsAdmin(false);
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={<Login onLogin={handleLogin} />}
        />
        <Route
          path="/register"
          element={<Register onLogin={handleLogin} />}
        />
        <Route
          path="/search"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Layout onLogout={handleLogout}>
                <Search />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Layout onLogout={handleLogout}>
                <Home />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated && isAdmin}>
              <Layout onLogout={handleLogout}>
                <AdminDashboard />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to={isAuthenticated ? (isAdmin ? '/admin' : '/') : '/login'} />} />
      </Routes>
    </Router>
  );
}

export default App;