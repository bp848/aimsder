
import React from 'react';
import { CheckCircleIcon, LogoIcon } from '../components/icons';

interface LandingPageProps {
  navigate: (path: string) => void;
}

const features = [
  "Autonomous Multi-Agent System",
  "Natural Language Instructions",
  "Genre-Aware Profile Generation",
  "Self-Correction & Improvement Loops",
  "DAW & External Tool Integration",
  "Detailed Quality Assurance Reports"
];

const LandingPage: React.FC<LandingPageProps> = ({ navigate }) => {
  return (
    <div className="relative overflow-hidden">
      {/* Abstract background gradient */}
      <div aria-hidden="true" className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-slate-900"></div>
        <div className="absolute inset-x-0 top-0 h-[800px] bg-gradient-to-b from-slate-900 to-transparent"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[700px] bg-gradient-to-tr from-blue-900/50 via-purple-900/30 to-fuchsia-900/50 rounded-full blur-3xl opacity-40"></div>
      </div>

      <div className="relative z-10 text-white text-center py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4">
          <LogoIcon className="h-20 w-20 text-blue-400 mx-auto mb-6" />
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-br from-white to-gray-400">
            The Future of Audio Mastering is Here
          </h1>
          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-gray-300 mb-10">
            Experience the world's first AI Agent Mastering service. Our autonomous agents diagnose, refine, and perfect your audio with an engineer's intuition.
          </p>
          <button onClick={() => navigate('#/login')} className="btn-primary text-lg py-3 px-8 rounded-full shadow-lg shadow-blue-500/30 transform hover:scale-105 transition-transform">
            Get Started for Free
          </button>
        </div>

        <div className="max-w-6xl mx-auto mt-24 sm:mt-32 px-4">
          <h2 className="text-3xl font-bold mb-12">Why AI Agent Mastering?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
            {features.map((feature, index) => (
              <div key={index} className="glass-card p-6 rounded-xl transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-900/30">
                <CheckCircleIcon className="h-7 w-7 text-green-400 mb-4" />
                <h3 className="font-semibold text-lg mb-2 text-gray-100">{feature}</h3>
                <p className="text-gray-400 text-sm">
                  Our system goes beyond simple presets, making intelligent decisions at every step of the process.
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
