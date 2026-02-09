import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar({ isAuthenticated, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (res.ok) {
        onLogout();            // clear frontend auth state
        navigate('/login');    // redirect to login
      } else {
        console.error('Logout failed');
      }
    } catch (err) {
      console.error('Logout error:', err.message);
    }
  };

  return (
    <nav className="bg-gray-800 py-4 px-6 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold text-white">
        Countries API
      </Link>

      <div className="space-x-4">
        {isAuthenticated ? (
          <button
            onClick={handleLogout}
            className="text-red-400 hover:text-white"
          >
            Logout
          </button>
        ) : (
          <>
            <Link to="/login" className="text-gray-300 hover:text-white">
              Login
            </Link>
            <Link to="/register" className="text-gray-300 hover:text-white">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;