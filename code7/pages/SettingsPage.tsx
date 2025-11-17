
import React, { useState } from 'react';
import type { User } from '../types';
import { UserIcon, EnvelopeIcon, LockClosedIcon } from '../components/icons';

interface SettingsPageProps {
  user: User;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ user }) => {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  // 遺言: ここでバックエンドのユーザープロファイル更新APIを叩く。
  // 例: await api.users.updateProfile(user.id, { name, email });
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    console.log(`// TODO: API Call - Updating profile for ${user.id} with name: ${name}, email: ${email}`);
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
    setIsSavingProfile(false);
    alert('Profile updated successfully! (Simulation)');
  };
  
  // 遺言: ここでバックエンドのパスワード更新APIを叩く。
  // 例: await api.users.updatePassword(user.id, { currentPassword, newPassword });
  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingPassword(true);
    console.log(`// TODO: API Call - Updating password for ${user.id}`);
    await new Promise(resolve => setTimeout(resolve, 1500));
    // @ts-ignore
    e.target.reset();
    setIsSavingPassword(false);
    alert('Password updated successfully! (Simulation)');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div>
        <h1 className="text-3xl font-bold text-white">Settings</h1>
        <p className="text-gray-400 mt-1">Manage your account settings and preferences.</p>
      </div>

      {/* Profile Settings */}
      <div className="glass-card rounded-xl p-8">
        <h2 className="text-xl font-bold text-white mb-6">Profile Information</h2>
        <form onSubmit={handleProfileUpdate} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Name</label>
            <div className="relative input-container">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <UserIcon className="h-5 w-5 text-gray-400 transition-colors" />
              </span>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email</label>
            <div className="relative input-container">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <EnvelopeIcon className="h-5 w-5 text-gray-400 transition-colors" />
              </span>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>
          <div className="text-right pt-2">
            <button type="submit" className="btn-primary" disabled={isSavingProfile}>
              {isSavingProfile ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>

      {/* Password Settings */}
      <div className="glass-card rounded-xl p-8">
        <h2 className="text-xl font-bold text-white mb-6">Change Password</h2>
        <form onSubmit={handlePasswordUpdate} className="space-y-6">
          <div>
            <label htmlFor="current-password" className="block text-sm font-medium text-gray-300 mb-1">Current Password</label>
            <div className="relative input-container">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <LockClosedIcon className="h-5 w-5 text-gray-400 transition-colors" />
              </span>
              <input id="current-password" type="password" className="input-field pl-10" placeholder="••••••••" required />
            </div>
          </div>
          <div>
            <label htmlFor="new-password" className="block text-sm font-medium text-gray-300 mb-1">New Password</label>
            <div className="relative input-container">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <LockClosedIcon className="h-5 w-5 text-gray-400 transition-colors" />
              </span>
              <input id="new-password" type="password" className="input-field pl-10" placeholder="••••••••" required />
            </div>
          </div>
          <div className="text-right pt-2">
            <button type="submit" className="btn-primary" disabled={isSavingPassword}>
              {isSavingPassword ? 'Saving...' : 'Update Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SettingsPage;
