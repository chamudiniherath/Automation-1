import React, { useEffect, useState } from 'react';

function AdminDashboard() {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    const res = await fetch('http://localhost:5000/api/admin/users', {
      credentials: 'include',
    });
    const data = await res.json();
    setUsers(data);
  };

  const upgradeUser = async (id) => {
    await fetch(`http://localhost:5000/api/admin/upgrade/${id}`, {
      method: 'POST',
      credentials: 'include',
    });
    fetchUsers();
  };

  const resetUser = async (id) => {
    await fetch(`http://localhost:5000/api/admin/reset/${id}`, {
      method: 'POST',
      credentials: 'include',
    });
    fetchUsers();
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
      <table className="w-full text-sm text-left text-gray-200 border border-gray-700">
  <thead className="bg-gray-900 text-gray-300 uppercase text-xs">
    <tr>
      <th className="px-4 py-3 border-b border-gray-700">Username</th>
      <th className="px-4 py-3 border-b border-gray-700">API Key</th>
      <th className="px-4 py-3 border-b border-gray-700">Searches</th>
      <th className="px-4 py-3 border-b border-gray-700">Paid</th>
      <th className="px-4 py-3 border-b border-gray-700">Actions</th>
    </tr>
  </thead>
  <tbody className="bg-gray-800">
    {users.map((u, index) => (
      <tr
        key={u.id}
        className={index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-700 hover:bg-gray-600'}
      >
        <td className="px-4 py-3 border-b border-gray-700">{u.username}</td>
        <td className="px-4 py-3 border-b border-gray-700 text-xs break-all">{u.apiKey}</td>
        <td className="px-4 py-3 border-b border-gray-700">{u.searchCount}</td>
        <td className="px-4 py-3 border-b border-gray-700">
          {u.isPaid ? '✅' : '❌'}
        </td>
        <td className="px-4 py-3 border-b border-gray-700 space-x-2">
          {!u.isPaid && (
            <button
              onClick={() => upgradeUser(u.id)}
              className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded text-sm"
            >
              Upgrade
            </button>
          )}
          <button
            onClick={() => resetUser(u.id)}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded text-sm"
          >
            Reset
          </button>
        </td>
      </tr>
    ))}
  </tbody>
</table>
    </div>
  );
}

export default AdminDashboard;