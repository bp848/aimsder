
import React, { useState, useEffect, useCallback } from 'react';
import { Layout } from './components/Layout';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import MasteringPage from './pages/MasteringPage';
import AdminPage from './pages/AdminPage';
import SettingsPage from './pages/SettingsPage';
import type { User } from './types';
import { appApi } from './services/appApi';

const App: React.FC = () => {
  const [route, setRoute] = useState(window.location.hash || '#/');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  // This effect handles routing when the URL hash changes
  useEffect(() => {
    const handleHashChange = () => {
      setRoute(window.location.hash || '#/');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Navigation function to be passed to child components
  const navigate = useCallback((path: string) => {
    window.location.hash = path;
  }, []);

  useEffect(() => {
    let isMounted = true;
    const bootstrap = async () => {
      try {
        const session = await appApi.getSession();
        if (session && isMounted) {
          setIsLoggedIn(true);
          setUser(session.user);
        }
      } finally {
        if (isMounted) {
          setIsBootstrapping(false);
        }
      }
    };
    bootstrap();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleLogin = useCallback(async (email: string, pass: string) => {
    const session = await appApi.login({ email, password: pass });
    setIsLoggedIn(true);
    setUser(session.user);
    navigate('#/dashboard');
  }, [navigate]);

  const handleLogout = useCallback(async () => {
    await appApi.logout();
    setIsLoggedIn(false);
    setUser(null);
    navigate('#/');
  }, [navigate]);

  const handleSignup = useCallback(async (name: string, email: string, pass: string) => {
    const session = await appApi.signup({ name, email, password: pass });
    setIsLoggedIn(true);
    setUser(session.user);
    navigate('#/dashboard');
  }, [navigate]);

  const handleUserUpdate = useCallback((updated: User) => {
    setUser(updated);
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
          return <SettingsPage user={user!} onUserUpdate={handleUserUpdate} />;
        case '#/admin':
          // Admin-only route
          return user?.isAdmin ? <AdminPage /> : <DashboardPage user={user!} navigate={navigate} />;
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

  const content = isBootstrapping ? (
    <div className="text-center text-gray-400 py-16">Restoring your workspace...</div>
  ) : (
    renderPage()
  );

  return (
    <Layout isLoggedIn={isLoggedIn} user={user} onLogout={handleLogout}>
      {content}
    </Layout>
  );
};

export default App;
