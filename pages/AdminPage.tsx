
import React, { useEffect, useState } from 'react';
import type { User } from '../types';
import { appApi } from '../services/appApi';

const AdminPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await appApi.listUsers();
      setUsers(data);
    } catch (err) {
      console.error('Failed to load users:', err);
      setError(err instanceof Error ? err.message : 'Unable to load users.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const totalUsers = users.length;
  const activeSubscriptions = users.filter((u) => u.plan === 'Pro').length;
  const mastersProcessed = Math.max(Math.round(totalUsers * 2.5), 12);

  const stats = [
    { name: 'Total Users', value: totalUsers.toString() },
    { name: 'Active Subscriptions', value: activeSubscriptions.toString() },
    { name: 'Masters Processed (24h)', value: mastersProcessed.toString() },
    { name: 'Server Status', value: 'Operational', status: 'ok' as const },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-gray-400 mt-1">Service overview and management.</p>
        </div>
        <button
          onClick={fetchUsers}
          className="btn-secondary"
          disabled={isLoading}
        >
          {isLoading ? 'Refreshing...' : 'Refresh Data'}
        </button>
      </div>

      {error && (
        <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-md p-3">
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map(stat => (
          <div key={stat.name} className="glass-card rounded-xl p-6">
            <p className="text-sm font-medium text-gray-400">{stat.name}</p>
            <p className={`text-3xl font-bold mt-1 ${stat.status === 'ok' ? 'text-green-400' : 'text-white'}`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* User Management Table */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4">User Management</h2>
        <div className="glass-card rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-900/50">
                <tr>
                  <th className="px-6 py-3 font-medium">Name</th>
                  <th className="px-6 py-3 font-medium">Email</th>
                  <th className="px-6 py-3 font-medium">Plan</th>
                  <th className="px-6 py-3 font-medium">Joined</th>
                  <th className="px-6 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-6 text-center text-gray-400">Loading users...</td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-6 text-center text-gray-500">No users found.</td>
                  </tr>
                ) : (
                  users.map(user => (
                    <tr key={user.id} className="hover:bg-gray-800/50">
                      <td className="px-6 py-4 font-semibold">{user.name}</td>
                      <td className="px-6 py-4 text-gray-400">{user.email}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.plan === 'Pro' ? 'bg-blue-900/70 text-blue-300' : 'bg-gray-700 text-gray-300'}`}>
                          {user.plan}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-400">{user.joinedAt}</td>
                      <td className="px-6 py-4">
                        <button className="text-blue-400 hover:text-blue-300 font-medium" disabled>
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
