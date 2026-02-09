import React, { useEffect, useState } from 'react';

function Search() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [allCountries, setAllCountries] = useState([]);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  // 🔁 Load all countries on mount
  useEffect(() => {
    fetch('http://localhost:5000/api/countries', {
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => {
        const names = data.map(c => c.name);
        setAllCountries(names);
      })
      .catch(err => {
        console.error('Failed to load countries', err);
      });
  }, []);

  // 🔍 Suggest as user types
  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    const matches = allCountries.filter(name =>
      name.toLowerCase().startsWith(query.toLowerCase())
    );

    setSuggestions(matches.slice(0, 5));
  }, [query, allCountries]);

  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);

    try {
      const res = await fetch(`http://localhost:5000/api/countries/name/${query}`, {
        credentials: 'include',
      });

      if (!res.ok) {
        const data = await res.json();

        // ✅ Handle specific 429 error
        if (res.status === 429) {
          throw new Error(data.message || 'Search limit reached. Try again later.');
        }

        throw new Error(data.error || 'Search failed');
      }

      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSuggestionClick = (name) => {
    setQuery(name);
    setSuggestions([]);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
      <div className="max-w-md w-full bg-gray-800 rounded p-6 relative">
        <h2 className="text-2xl font-semibold mb-6 text-center">Search Countries</h2>
        <form onSubmit={handleSearch} className="space-y-2">
          <div className="relative">
            <input
              type="text"
              className="w-full p-2 rounded bg-gray-700 border border-gray-600"
              placeholder="Search by country name..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoComplete="off"
            />
            {suggestions.length > 0 && (
              <ul className="absolute z-10 w-full bg-white text-black rounded shadow max-h-40 overflow-y-auto mt-1">
                {suggestions.map((name, i) => (
                  <li
                    key={i}
                    className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                    onClick={() => handleSuggestionClick(name)}
                  >
                    {name}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Search
          </button>
        </form>

        {/* ✅ Error Display */}
        {error && (
          <div className="mt-4 p-3 bg-red-100 text-red-800 border border-red-400 rounded text-center">
            <strong>⚠️ {error}</strong>
          </div>
        )}

        {/* ✅ Search Result Display */}
        {result && (
          <div className="mt-6 bg-gray-700 p-4 rounded text-white">
            <h3 className="text-xl font-bold mb-2">{result.name}</h3>
            {result.flag && (
              <img src={result.flag} alt={`${result.name} flag`} className="w-32 mb-4" />
            )}
            <p><strong>Capital:</strong> {result.capital}</p>
            <p><strong>Currency:</strong> {result.currencies}</p>
            <p><strong>Languages:</strong> {result.languages}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Search;