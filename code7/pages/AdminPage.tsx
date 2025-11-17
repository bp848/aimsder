
import React from 'react';

// Dummy data for the admin dashboard
const stats = [
  { name: 'Total Users', value: '1,428' },
  { name: 'Active Subscriptions', value: '312' },
  { name: 'Masters Processed (24h)', value: '89' },
  { name: 'Server Status', value: 'Operational', status: 'ok' },
];

const users = [
  { id: 'user-001', name: 'John Doe', email: 'john.d@example.com', plan: 'Pro', joined: '2023-01-15' },
  { id: 'user-002', name: 'Jane Smith', email: 'jane.s@example.com', plan: 'Free', joined: '2023-02-20' },
  { id: 'user-123', name: 'Nova Spark', email: 'nova@example.com', plan: 'Pro', joined: '2023-03-01' },
  { id: 'user-004', name: 'Alex Ray', email: 'alex.r@example.com', plan: 'Free', joined: '2023-04-10' },
];

const AdminPage: React.FC = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
        <p className="text-gray-400 mt-1">Service overview and management.</p>
      </div>

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
                {users.map(user => (
                  <tr key={user.id} className="hover:bg-gray-800/50">
                    <td className="px-6 py-4 font-semibold">{user.name}</td>
                    <td className="px-6 py-4 text-gray-400">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.plan === 'Pro' ? 'bg-blue-900/70 text-blue-300' : 'bg-gray-700 text-gray-300'}`}>
                        {user.plan}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-400">{user.joined}</td>
                    <td className="px-6 py-4">
                      <button className="text-blue-400 hover:text-blue-300 font-medium">Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
