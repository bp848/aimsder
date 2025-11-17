
import React from 'react';
import { Navbar } from './Navbar';
import type { User } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  isLoggedIn: boolean;
  user: User | null;
  onLogout: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, isLoggedIn, user, onLogout }) => {
  return (
    <div className="min-h-screen text-gray-200 flex flex-col font-sans">
      <Navbar isLoggedIn={isLoggedIn} user={user} onLogout={onLogout} />
      <main className="flex-grow w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>
      <footer className="w-full max-w-7xl mx-auto mt-8 py-4 text-center text-xs text-gray-600">
        <p>Powered by Gemini. This is a conceptual demonstration and does not perform real audio processing.</p>
      </footer>
    </div>
  );
};
