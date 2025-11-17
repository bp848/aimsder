
import React, { useState, useEffect, useCallback } from 'react';
import { Layout } from './components/Layout';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import MasteringPage from './pages/MasteringPage';
import AdminPage from './pages/AdminPage';
import SettingsPage from './pages/SettingsPage';
import type { User } from './types';

// Dummy user data for demonstration
const DUMMY_USER: User = {
  id: 'user-123',
  name: 'Nova Spark',
  email: 'nova@example.com',
  isAdmin: true, // Set to true to see the Admin link
};

const App: React.FC = () => {
  const [route, setRoute] = useState(window.location.hash || '#/');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  // This effect handles routing when the URL hash changes
  useEffect(() => {
    const handleHashChange = () => {
      setRoute(window.location.hash || '#/');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Navigation function to be passed to child components
  const navigate = (path: string) => {
    window.location.hash = path;
  };

  // --- API Placeholder Functions ---
  // These functions simulate authentication and can be replaced with real API calls.

  const handleLogin = useCallback(async (email: string, pass: string) => {
    console.log(`// TODO: API Call - Logging in with ${email}`);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
    setIsLoggedIn(true);
    setUser(DUMMY_USER);
    navigate('#/dashboard');
  }, []);

  const handleLogout = useCallback(() => {
    console.log('// TODO: API Call - Logging out');
    setIsLoggedIn(false);
    setUser(null);
    navigate('#/');
  }, []);

  const handleSignup = useCallback(async (name: string, email: string, pass: string) => {
    console.log(`// TODO: API Call - Signing up ${name} with ${email}`);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoggedIn(true);
    setUser({ ...DUMMY_USER, name, email });
    navigate('#/dashboard');
  }, []);


  // Simple router to render the correct page based on the URL hash
  const renderPage = () => {
    // Protected routes
    if (isLoggedIn) {
      switch (route) {
        case '#/dashboard':
          return <DashboardPage user={user!} navigate={navigate} />;
        case '#/mastering':
          return <MasteringPage />;
        case '#/settings':
          return <SettingsPage user={user!} />;
        case '#/admin':
          // Admin-only route
          return user?.isAdmin ? <AdminPage /> : <DashboardPage user={user} navigate={navigate} />;
        default:
          return <DashboardPage user={user!} navigate={navigate} />;
      }
    }

    // Public routes
    switch (route) {
      case '#/login':
        return <AuthPage onLogin={handleLogin} onSignup={handleSignup} />;
      case '#/':
      default:
        return <LandingPage navigate={navigate} />;
    }
  };

  return (
    <Layout isLoggedIn={isLoggedIn} user={user} onLogout={handleLogout}>
      {renderPage()}
    </Layout>
  );
};

export default App;
