
import React, { useState, useRef, useEffect } from 'react';
import { LogoIcon, UserCircleIcon } from './icons';
import type { User } from '../types';

interface NavbarProps {
  isLoggedIn: boolean;
  user: User | null;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ isLoggedIn, user, onLogout }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const NavLink: React.FC<{ href: string; children: React.ReactNode }> = ({ href, children }) => (
    <a href={href} className="relative text-sm font-medium text-gray-300 hover:text-white transition-colors group">
      {children}
      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
    </a>
  );

  return (
    <header className="w-full bg-slate-900/60 backdrop-blur-lg border-b border-slate-300/10 sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <a href="#/" className="flex items-center gap-3">
            <LogoIcon className="h-8 w-8 text-blue-500" />
            <h1 className="text-xl font-bold text-white tracking-tight hidden sm:block">
              AI Agent Mastering
            </h1>
          </a>
          <div className="flex items-center gap-6">
            {isLoggedIn ? (
              <>
                <div className="hidden md:flex items-center gap-6">
                  <NavLink href="#/dashboard">Dashboard</NavLink>
                  <NavLink href="#/mastering">Mastering Tool</NavLink>
                  {user?.isAdmin && <NavLink href="#/admin">Admin</NavLink>}
                </div>
                <div className="relative" ref={dropdownRef}>
                  <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center gap-2 text-sm font-medium text-gray-300 hover:text-white transition-colors">
                    <UserCircleIcon className="h-7 w-7" />
                    <span className="hidden md:inline">{user?.name}</span>
                  </button>
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-3 w-48 bg-slate-800 rounded-md shadow-lg py-1 z-50 border border-slate-700">
                      <a href="#/settings" className="block px-4 py-2 text-sm text-gray-300 hover:bg-slate-700/50" onClick={() => setDropdownOpen(false)}>Settings</a>
                      <a href="#/mastering" className="block md:hidden px-4 py-2 text-sm text-gray-300 hover:bg-slate-700/50" onClick={() => setDropdownOpen(false)}>Mastering</a>
                      <button onClick={() => { onLogout(); setDropdownOpen(false); }} className="w-full text-left block px-4 py-2 text-sm text-red-400 hover:bg-slate-700/50">
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <a href="#/login" className="btn-primary py-1.5 px-5">
                Login / Sign Up
              </a>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};
