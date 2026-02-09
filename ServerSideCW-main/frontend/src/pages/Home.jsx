import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Home() {
    const [countries, setCountries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      console.log('Home component mounted');
      fetch('http://localhost:5000/api/countries', { credentials: 'include' })
        .then((res) => {
          if (!res.ok) {
            throw new Error('Failed to fetch countries');
          }
          return res.json();
        })
        .then((data) => {
          setCountries(data);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    }, []);
  
    if (loading) return <p className="text-white">Loading...</p>;
    if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="p-6 md:p-12">
      {/* Hero Section */}
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Explore Countries Around the World
        </h1>
        <p className="text-gray-300 mb-8">
          Access comprehensive country data through our secure API middleware service.
          Register for an API key and start building with reliable information today.
        </p>
        <div className="space-x-4">
          <Link
            to="/register"
            className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
          >
            Get API Key
          </Link>
          <Link
            to="/search"
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
          >
            Explore Countries
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="bg-gray-800 rounded p-6">
          <h2 className="text-xl font-semibold mb-2">Country Data</h2>
          <p className="text-gray-400">
            Get detailed information about countries worldwide. Our API provides
            filtered data including names, currencies, capitals, languages, and
            national flags from RestCountries.com.
          </p>
        </div>

        <div className="bg-gray-800 rounded p-6">
          <h2 className="text-xl font-semibold mb-2">API Keys</h2>
          <p className="text-gray-400">
            Generate and manage your personal API keys through our dedicated
            web interface. Register now!
          </p>
          <div className="mt-4">
            <Link
              to="/register"
              className="underline text-blue-400 hover:text-blue-200"
            >
              Register now →
            </Link>
          </div>
        </div>

        <div className="bg-gray-800 rounded p-6">
          <h2 className="text-xl font-semibold mb-2">Security</h2>
          <p className="text-gray-400">
            Our service implements comprehensive security including password hashing,
            session management, and secure API key validation.
          </p>
          <div className="mt-4">
            <Link
              to="/login"
              className="underline text-blue-400 hover:text-blue-200"
            >
              Login securely →
            </Link>
          </div>
        </div>
      </section>

      {/* Countries List Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Countries List</h2>
        {loading ? (
          <p className="text-gray-400">Loading countries...</p>
        ) : error ? (
          <p className="text-red-500">Error: {error}</p>
        ) : (
          <ul className="space-y-2">
            {countries.map((country) => (
              <li key={country.code} className="bg-gray-800 p-4 rounded">
                <span className="font-bold">{country.name}</span>
                {country.capital && ` - ${country.capital}`}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default Home;
