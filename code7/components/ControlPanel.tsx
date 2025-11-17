
import React from 'react';
import type { MasteringGoal } from '../types';
import { UploadIcon, MusicNoteIcon } from './icons';

interface ControlPanelProps {
  audioFile: File | null;
  setAudioFile: (file: File | null) => void;
  masteringGoal: MasteringGoal;
  setMasteringGoal: (goal: MasteringGoal) => void;
  onStart: () => void;
  onReset: () => void;
  isProcessing: boolean;
  isFinished: boolean;
}

const platforms = [
  { id: 'streaming', name: 'Streaming (Spotify, etc.)' },
  { id: 'beatport', name: 'Beatport' },
  { id: 'cd', name: 'CD Master' },
  { id: 'youtube', name: 'YouTube' },
  { id: 'auto', name: 'Auto-Detect' },
];

const descriptiveTags = [
  'Punchy & Wide', 'Warm & Vintage', 'Crystal Clear', 'Bass Focused', 'Vocals Forward', 'Dynamic & Open', 'Loud & Proud', 'Natural & Transparent'
];

export const ControlPanel: React.FC<ControlPanelProps> = ({
  audioFile,
  setAudioFile,
  masteringGoal,
  setMasteringGoal,
  onStart,
  onReset,
  isProcessing,
  isFinished,
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAudioFile(e.target.files[0]);
    }
  };

  const handlePlatformChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMasteringGoal({ ...masteringGoal, platform: e.target.value as MasteringGoal['platform'] });
  };

  const handleTagToggle = (tag: string) => {
    const newTags = masteringGoal.tags.includes(tag)
      ? masteringGoal.tags.filter(t => t !== tag)
      : [...masteringGoal.tags, tag];
    setMasteringGoal({ ...masteringGoal, tags: newTags });
  };

  return (
    <div className="glass-card rounded-xl p-5 flex flex-col h-full space-y-6">
      <h2 className="text-xl font-bold text-white tracking-wider">1. SETUP</h2>
      
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Upload Audio</label>
        {audioFile ? (
          <div className="bg-slate-900/80 p-3 rounded-lg flex items-center justify-between border border-blue-500/50 shadow-inner shadow-blue-900/50">
            <div className="flex items-center gap-3 overflow-hidden">
              <MusicNoteIcon className="h-6 w-6 text-blue-400 flex-shrink-0" />
              <p className="text-sm truncate" title={audioFile.name}>{audioFile.name}</p>
            </div>
            <button onClick={() => setAudioFile(null)} className="text-gray-400 hover:text-white text-xl transition-colors">&times;</button>
          </div>
        ) : (
          <label htmlFor="file-upload" className="relative flex flex-col items-center justify-center w-full h-36 border-2 border-slate-700 border-dashed rounded-lg cursor-pointer bg-slate-900/50 hover:border-blue-500 hover:bg-slate-900 transition-all duration-300 group">
            <div className="absolute inset-0 bg-gradient-to-t from-blue-900/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="flex flex-col items-center justify-center pt-5 pb-6 z-10">
              <UploadIcon className="w-8 h-8 mb-3 text-gray-400 group-hover:text-blue-400 transition-colors" />
              <p className="mb-2 text-sm text-gray-400"><span className="font-semibold">Click to upload</span> or drag & drop</p>
              <p className="text-xs text-gray-500">WAV, FLAC, MP3 (Max 100MB)</p>
            </div>
            <input id="file-upload" type="file" className="hidden" onChange={handleFileChange} accept="audio/*" />
          </label>
        )}
      </div>

      <div>
        <label htmlFor="platform" className="block text-sm font-medium text-gray-300 mb-2">Target Platform</label>
        <select id="platform" value={masteringGoal.platform} onChange={handlePlatformChange} className="input-field" disabled={isProcessing || isFinished}>
          {platforms.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Desired Characteristics</label>
        <div className="flex flex-wrap gap-2">
          {descriptiveTags.map(tag => {
            const isSelected = masteringGoal.tags.includes(tag);
            return (
              <button
                key={tag}
                onClick={() => handleTagToggle(tag)}
                disabled={isProcessing || isFinished}
                className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 border ${
                  isSelected 
                  ? 'bg-blue-500 border-blue-400 text-white shadow-md shadow-blue-900/50' 
                  : 'bg-slate-700/50 border-slate-600 hover:bg-slate-700 hover:border-slate-500'
                }`}
              >
                {tag}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-grow"></div>

      <div className="space-y-3 pt-2">
        {isFinished ? (
          <button onClick={onReset} className="btn-secondary w-full py-3">Start New Session</button>
        ) : (
          <button onClick={onStart} disabled={!audioFile || isProcessing} className="btn-primary w-full py-3 text-base">
            {isProcessing ? 'Processing...' : 'Start AI Mastering'}
          </button>
        )}
      </div>
    </div>
  );
};
