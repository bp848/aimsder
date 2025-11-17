
import React, { useState } from 'react';
import { UserIcon, EnvelopeIcon, LockClosedIcon } from '../components/icons';

interface AuthPageProps {
  onLogin: (email: string, pass: string) => Promise<void>;
  onSignup: (name: string, email: string, pass: string) => Promise<void>;
}

const AuthPage: React.FC<AuthPageProps> = ({ onLogin, onSignup }) => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (isLoginView) {
        // 遺言: ここでバックエンドのログインAPIを叩く。
        // 例: await api.auth.login({ email, password });
        await onLogin(email, password);
      } else {
        // 遺言: ここでバックエンドのサインアップAPIを叩く。
        // 例: await api.auth.signup({ name, email, password });
        await onSignup(name, email, password);
      }
    } catch (error) {
      console.error("Authentication failed:", error);
      // TODO: Display an error message to the user
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center py-12">
      <div className="w-full max-w-md">
        <div className="glass-card rounded-xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-center text-white mb-2">
            {isLoginView ? 'Welcome Back' : 'Create Your Account'}
          </h2>
          <p className="text-center text-gray-400 mb-8">
            {isLoginView ? 'Sign in to continue' : 'Get started with AI Mastering'}
          </p>
          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLoginView && (
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
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input-field pl-10"
                    placeholder="Nova Spark"
                  />
                </div>
              </div>
            )}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email address</label>
              <div className="relative input-container">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <EnvelopeIcon className="h-5 w-5 text-gray-400 transition-colors" />
                </span>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field pl-10"
                  placeholder="you@example.com"
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">Password</label>
              <div className="relative input-container">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <LockClosedIcon className="h-5 w-5 text-gray-400 transition-colors" />
                </span>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete={isLoginView ? "current-password" : "new-password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-10"
                  placeholder="••••••••"
                />
              </div>
            </div>
            <div>
              <button type="submit" className="w-full btn-primary py-3 mt-2" disabled={isLoading}>
                {isLoading ? 'Processing...' : (isLoginView ? 'Sign In' : 'Sign Up')}
              </button>
            </div>
          </form>
          <div className="text-center mt-6">
            <button onClick={() => setIsLoginView(!isLoginView)} className="text-sm text-blue-400 hover:text-blue-300">
              {isLoginView ? 'Don\'t have an account? Sign Up' : 'Already have an account? Sign In'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
