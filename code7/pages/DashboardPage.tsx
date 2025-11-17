
import React, { useState } from 'react';
import type { User } from '../types';
import { MusicNoteIcon, PlayIcon, PauseIcon, DownloadIcon, ShareIcon } from '../components/icons';

interface DashboardPageProps {
  user: User;
  navigate: (path: string) => void;
}

// Dummy data for recent projects
const recentProjects = [
  { id: 1, name: 'Midnight Drive.wav', status: 'Completed', date: '2 days ago', format: '44.1kHz / 24bit', lufs: -9.5 },
  { id: 2, name: 'Sunrise Groove.mp3', status: 'Completed', date: '5 days ago', format: '48kHz / 16bit', lufs: -12.0 },
  { id: 3, name: 'City Lights Final Mix.flac', status: 'Completed', date: '1 week ago', format: '96kHz / 24bit', lufs: -8.9 },
  { id: 4, name: 'Oceanic Depth.wav', status: 'Completed', date: '2 weeks ago', format: '44.1kHz / 24bit', lufs: -14.0 },
];

const ProjectCard: React.FC<{ project: typeof recentProjects[0], playingId: number | null, onPlay: (id: number) => void }> = ({ project, playingId, onPlay }) => {
  const isPlaying = playingId === project.id;

  return (
    <div style={{ backgroundColor: 'var(--dashboard-card-bg)' }} className="rounded-xl p-5 border border-slate-800 flex flex-col transition-all duration-300 hover:border-cyan-500/50 hover:shadow-2xl hover:shadow-cyan-900/50">
      <div className="flex items-center gap-4 mb-4">
        <div 
          onClick={() => onPlay(isPlaying ? -1 : project.id)}
          className="w-12 h-12 flex-shrink-0 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200"
          style={{ 
            backgroundColor: isPlaying ? 'var(--dashboard-accent)' : 'rgba(0, 255, 255, 0.1)',
            color: isPlaying ? 'black' : 'var(--dashboard-accent)',
            boxShadow: `0 0 15px -5px ${isPlaying ? 'var(--dashboard-accent)' : 'transparent'}`
          }}
        >
          {isPlaying ? <PauseIcon className="w-6 h-6" /> : <PlayIcon className="w-6 h-6" />}
        </div>
        <div className="overflow-hidden">
          <p className="font-bold text-white truncate">{project.name}</p>
          <p className="text-sm text-slate-400">{project.date}</p>
        </div>
      </div>
      <div className="flex-grow space-y-3 text-sm mb-5">
        <div className="flex justify-between">
          <span className="text-slate-400">Status:</span>
          <span className="font-semibold text-green-400">{project.status}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Format:</span>
          <span className="font-mono text-slate-300">{project.format}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Loudness:</span>
          <span className="font-mono font-bold" style={{color: 'var(--dashboard-accent)'}}>{project.lufs.toFixed(1)} LUFS</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-md bg-slate-700/50 hover:bg-slate-700 transition-colors">
          <DownloadIcon className="w-4 h-4" /> Download
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-md bg-slate-700/50 hover:bg-slate-700 transition-colors">
          <ShareIcon className="w-4 h-4" /> Share
        </button>
      </div>
    </div>
  );
};

const DashboardPage: React.FC<DashboardPageProps> = ({ user, navigate }) => {
  const [playingId, setPlayingId] = useState<number | null>(null);

  return (
    <div style={{ backgroundColor: 'var(--dashboard-bg)' }} className="p-4 sm:p-6 rounded-2xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-extrabold text-white">Dashboard</h1>
          <p className="text-slate-400 mt-2 text-lg">Welcome back, {user.name}!</p>
        </div>
        <button onClick={() => navigate('#/mastering')} className="btn-primary">
          New Project
        </button>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-white mb-4">Recent Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {recentProjects.map(project => (
            <ProjectCard key={project.id} project={project} playingId={playingId} onPlay={setPlayingId} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
