import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Register({ onLogin }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState(''); // for future use
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [csrfToken, setCsrfToken] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  // Fetch CSRF token
  useEffect(() => {
    fetch('http://localhost:5000/api/csrf-token', {
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => {
        setCsrfToken(data.csrfToken);
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to load CSRF token.');
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!termsAccepted) {
      return setError('You must accept the terms and conditions.');
    }

    if (password !== confirmPassword) {
      return setError('Passwords do not match.');
    }

    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken,
        },
        credentials: 'include',
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Registration failed.');
      }

      onLogin();        // ✅ set isAuthenticated to true in App
      navigate('/');    // ✅ redirect to homepage
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
      <div className="max-w-md w-full bg-gray-800 rounded p-6">
        <h2 className="text-2xl font-semibold mb-6 text-center">Create an account</h2>
        {error && <div className="text-red-400 text-center mb-4">{error}</div>}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block mb-1 text-gray-300">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 border border-gray-600"
              placeholder="johndoe"
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-gray-300">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 border border-gray-600"
              placeholder="name@example.com"
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
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-gray-300">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 border border-gray-600"
              placeholder="••••••••"
              required
            />
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="terms"
              className="h-4 w-4"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
            />
            <label htmlFor="terms" className="text-gray-300 text-sm">
              I accept the terms and conditions
            </label>
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
          >
            Register
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-400 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
