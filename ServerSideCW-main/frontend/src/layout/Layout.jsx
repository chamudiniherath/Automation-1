import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Layout({ children, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      const csrfRes = await fetch('http://localhost:5000/api/csrf-token', {
        credentials: 'include',
      });
      const { csrfToken } = await csrfRes.json();

      const res = await fetch('http://localhost:5000/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken,
        },
      });

      if (res.ok) {
        if (onLogout) onLogout();
        navigate('/login');
      } else {
        console.error('Logout failed');
      }
    } catch (err) {
      console.error('Logout error:', err.message);
    }
  };

  return (
    <div>
      <header className="flex justify-between items-center p-4 bg-gray-900 text-white">
        <div className="flex gap-2 items-center">
          {/* ✅ Back Button (hide on home) */}
          {location.pathname !== '/' && (
            <button
              onClick={() => navigate(-1)}
              className="bg-gray-600 hover:bg-gray-700 px-3 py-1 rounded text-sm"
            >
              ← Back
            </button>
          )}
          <h1 className="text-xl font-semibold ml-2">Countries API</h1>
        </div>

        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm"
        >
          Logout
        </button>
      </header>

      <main className="p-4">{children}</main>

      <footer className="p-4 text-center text-gray-400">
        &copy; 2025 Countries API
      </footer>
    </div>
  );
}
