import React, { useEffect, useState } from 'react';
import type { User } from '../types';
import { UserIcon, EnvelopeIcon, LockClosedIcon } from '../components/icons';
import { appApi } from '../services/appApi';

interface SettingsPageProps {
  user: User;
  onUserUpdate: (user: User) => void;
}

type FeedbackState = { type: 'success' | 'error'; message: string } | null;

const SettingsPage: React.FC<SettingsPageProps> = ({ user, onUserUpdate }) => {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [profileFeedback, setProfileFeedback] = useState<FeedbackState>(null);
  const [passwordFeedback, setPasswordFeedback] = useState<FeedbackState>(null);

  useEffect(() => {
    setName(user.name);
    setEmail(user.email);
  }, [user]);

  const handleProfileUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setProfileFeedback(null);
    try {
      const updatedUser = await appApi.updateProfile(user.id, { name, email });
      onUserUpdate(updatedUser);
      setName(updatedUser.name);
      setEmail(updatedUser.email);
      setProfileFeedback({ type: 'success', message: 'Profile updated successfully.' });
    } catch (error) {
      console.error('Profile update failed:', error);
      setProfileFeedback({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to update profile.',
      });
    } finally {
      setIsSavingProfile(false);
    }
  };
  
  const handlePasswordUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSavingPassword(true);
    setPasswordFeedback(null);
    const formData = new FormData(e.currentTarget);
    const currentPassword = String(formData.get('currentPassword') ?? '');
    const newPassword = String(formData.get('newPassword') ?? '');

    try {
      await appApi.updatePassword(user.id, { currentPassword, newPassword });
      e.currentTarget.reset();
      setPasswordFeedback({ type: 'success', message: 'Password updated successfully.' });
    } catch (error) {
      console.error('Password update failed:', error);
      setPasswordFeedback({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to update password.',
      });
    } finally {
      setIsSavingPassword(false);
    }
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
                name="name"
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
                name="email"
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
          {profileFeedback && (
            <p className={`text-sm ${profileFeedback.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
              {profileFeedback.message}
            </p>
          )}
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
              <input
                id="current-password"
                name="currentPassword"
                type="password"
                className="input-field pl-10"
                placeholder="••••••••"
                required
              />
            </div>
          </div>
          <div>
            <label htmlFor="new-password" className="block text-sm font-medium text-gray-300 mb-1">New Password</label>
            <div className="relative input-container">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <LockClosedIcon className="h-5 w-5 text-gray-400 transition-colors" />
              </span>
              <input
                id="new-password"
                name="newPassword"
                type="password"
                className="input-field pl-10"
                placeholder="••••••••"
                required
              />
            </div>
          </div>
          <div className="text-right pt-2">
            <button type="submit" className="btn-primary" disabled={isSavingPassword}>
              {isSavingPassword ? 'Saving...' : 'Update Password'}
            </button>
          </div>
          {passwordFeedback && (
            <p className={`text-sm ${passwordFeedback.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
              {passwordFeedback.message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default SettingsPage;
