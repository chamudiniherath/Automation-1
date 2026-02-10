import React from 'react';
import { useNavigate } from 'react-router-dom';

function LogoutButton({ onLogout }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const csrf = await fetch('http://localhost:5000/api/csrf-token', {
        credentials: 'include',
      });
      const { csrfToken } = await csrf.json();
  
      const res = await fetch('http://localhost:5000/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken,
        },
      });
  
      if (res.ok) {
        onLogout(); // or setIsAuthenticated(false)
        navigate('/login');
      }
    } catch (err) {
      console.error('Logout error:', err);
    }
  };  

  return (
    <button
      onClick={handleLogout}
      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
    >
      Logout
    </button>
  );
}

export default LogoutButton;