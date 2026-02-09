import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Optional: a small helper to set a cookie from JS
function setCookie(name, value, days) {
  const expires = new Date();
  expires.setDate(expires.getDate() + (days || 1));
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
}

function Login({ onLogin }) {
  const [username, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [csrfToken, setCsrfToken] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // 1) Fetch CSRF token on mount
  useEffect(() => {
    fetch('http://localhost:5000/api/csrf-token', {
        credentials: 'include'
      })      
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to get CSRF token');
        }
        return res.json();
      })
      .then((data) => {
        // store token in state
        setCsrfToken(data.csrfToken);
        // optionally set a cookie for the token
        setCookie('csrfToken', data.csrfToken, 1);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken
        },
        body: JSON.stringify({ username, password }),
        credentials: 'include'
      });
  
      if (!response.ok) {
        const msg = await response.json();
        throw new Error(msg.message || 'Login failed');
      }
  
      const data = await response.json();
  
      // ✅ Notify parent App about login and isAdmin
      onLogin(data.isAdmin);
  
      // ✅ Navigate based on admin status
      if (data.isAdmin) {
        navigate('/admin');
      } else {
        navigate('/');
      }
  
    } catch (err) {
      setError(err.message);
    }
  };  

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
      <div className="max-w-md w-full bg-gray-800 rounded p-6">
        <h2 className="text-2xl font-semibold mb-6 text-center">Login</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-gray-300">Email or Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 border border-gray-600"
              placeholder="Enter your email or username"
            />
          </div>
          <div>
            <label className="block mb-1 text-gray-300">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 border border-gray-600"
              placeholder="••••••••"
            />
          </div>
          <div className="text-right">
            <a href="#" className="text-sm text-blue-400 hover:underline">
              Forgot password?
            </a>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
          >
            Login
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-400">
          Don’t have an account?{' '}
          <Link to="/register" className="text-blue-400 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
