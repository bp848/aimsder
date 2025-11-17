
import React from 'react';
import type { FinalVersion } from '../types';
import { DownloadIcon, MusicNoteIcon } from './icons';

interface OutputPanelProps {
  versions: FinalVersion[];
}

const VersionIcon: React.FC<{name: string}> = ({name}) => {
    // Simple logic to return a different icon/style based on version name
    if (name.includes('Streaming')) return <MusicNoteIcon className="h-6 w-6 text-cyan-400" />;
    if (name.includes('CD')) return <div className="font-bold text-lg text-purple-400">CD</div>;
    if (name.includes('Loud')) return <div className="font-extrabold text-lg text-red-400">L</div>;
    if (name.includes('Analog')) return <div className="font-serif font-bold text-lg text-amber-400">A</div>;
    return <DownloadIcon className="h-6 w-6 text-gray-400" />;
}

export const OutputPanel: React.FC<OutputPanelProps> = ({ versions }) => {
  const handleDownload = (versionName: string) => {
    console.log(`Downloading ${versionName}...`);
    alert(`Simulating download for: ${versionName}`);
  };

  return (
    <div className="glass-card rounded-xl p-5">
      <h2 className="text-xl font-bold text-white mb-4 tracking-wider">4. DELIVERY</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {versions.map((version) => (
          <div key={version.name} className="group relative bg-slate-900/70 rounded-lg p-4 flex flex-col justify-between border border-slate-800 hover:border-blue-500/50 transition-all duration-300 cursor-pointer" onClick={() => handleDownload(version.name)}>
            <div className="absolute -top-px -left-px -right-px h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex items-start justify-between">
                <div>
                    <h3 className="font-bold text-gray-100">{version.name}</h3>
                    <p className="text-xs text-gray-400 mt-1">{version.description}</p>
                </div>
                <div className="w-10 h-10 flex-shrink-0 bg-slate-800 rounded-full flex items-center justify-center border border-slate-700 group-hover:border-blue-500/50 transition-colors">
                    <VersionIcon name={version.name} />
                </div>
            </div>
            <button
              className="mt-4 w-full bg-slate-800 group-hover:bg-blue-600 text-white text-sm font-semibold py-2 px-3 rounded-md flex items-center justify-center gap-2 transition-colors"
            >
              <DownloadIcon className="h-4 w-4" />
              Download
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
