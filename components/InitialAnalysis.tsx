
import React from 'react';
import { UploadIcon } from './icons';

interface InitialAnalysisProps {
  file: File | null;
  platform: 'streaming' | 'beatport' | 'cd' | 'youtube' | 'auto';
}

const platformTargets = {
  streaming: { lufs: -14.0, peak: -1.0 },
  beatport: { lufs: -9.0, peak: -0.5 },
  cd: { lufs: -9.0, peak: -0.1 },
  youtube: { lufs: -13.0, peak: -1.5 },
  auto: { lufs: -12.0, peak: -1.0 },
};

const WaveformPlaceholder: React.FC = () => (
  <svg width="100%" height="100" preserveAspectRatio="none" className="opacity-50">
    <path d="M0 50 L20 60 L40 40 L60 55 L80 45 L100 50 L120 60 L140 40 L160 55 L180 45 L200 50 L220 60 L240 40 L260 55 L280 45 L300 50 L320 60 L340 40 L360 55 L380 45 L400 50" fill="none" stroke="url(#waveform-gradient)" strokeWidth="2" />
    <defs>
      <linearGradient id="waveform-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="var(--primary-glow)" />
        <stop offset="100%" stopColor="var(--secondary-glow)" />
      </linearGradient>
    </defs>
  </svg>
);

const SpectrumPlaceholder: React.FC = () => {
    const data = React.useMemo(() => Array.from({ length: 48 }, () => Math.random() * 0.6 + 0.1), []);
    return (
        <svg width="100%" height="100" preserveAspectRatio="none">
            {data.map((d, i) => (
                <rect key={i} x={(i/data.length) * 100 + '%'} y={`${100 - d * 100}%`} width={`${100/data.length - 1}%`} height={`${d * 100}%`} fill="rgba(0, 255, 255, 0.4)" />
            ))}
        </svg>
    );
};

export const InitialAnalysis: React.FC<InitialAnalysisProps> = ({ file, platform }) => {
  if (!file) {
    return (
      <div className="glass-card rounded-xl p-5 h-full flex flex-col items-center justify-center text-center">
        <UploadIcon className="h-16 w-16 mb-4 text-slate-600" />
        <h3 className="font-bold text-xl text-white">Awaiting Audio File</h3>
        <p className="text-slate-400 mt-2 max-w-sm">Upload your track in the setup panel to begin the analysis and mastering process.</p>
      </div>
    );
  }

  const currentStats = { lufs: -18.3, peak: -0.8 }; // Dummy data
  const targetStats = platformTargets[platform];

  const MetricRow: React.FC<{label: string, currentValue: number, targetValue: number, unit: string}> = ({label, currentValue, targetValue, unit}) => {
    const delta = currentValue - targetValue;
    const isGood = Math.abs(delta) < (label === 'LUFS' ? 2 : 0.5);
    return (
        <tr className="border-b border-slate-800">
            <td className="py-3 px-4 font-semibold text-slate-300">{label}</td>
            <td className="py-3 px-4 text-center font-mono">{currentValue.toFixed(1)} {unit}</td>
            <td className="py-3 px-4 text-center font-mono">{targetValue.toFixed(1)} {unit}</td>
            <td className={`py-3 px-4 text-center font-mono font-bold ${isGood ? 'text-green-400' : 'text-amber-400'}`}>
                {delta > 0 ? '+' : ''}{delta.toFixed(1)} {unit}
            </td>
        </tr>
    )
  }

  return (
    <div className="glass-card rounded-xl p-6 space-y-6">
      <h2 className="text-xl font-bold text-white tracking-wider">INITIAL ANALYSIS: <span className="text-blue-400">{file.name}</span></h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900/70 p-4 rounded-lg border border-slate-800">
            <h3 className="font-semibold text-slate-300 mb-2">Waveform</h3>
            <WaveformPlaceholder />
        </div>
        <div className="bg-slate-900/70 p-4 rounded-lg border border-slate-800">
            <h3 className="font-semibold text-slate-300 mb-2">Spectrum</h3>
            <SpectrumPlaceholder />
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-slate-300 mb-3">Platform Target Comparison: <span className="text-cyan-400 capitalize">{platform}</span></h3>
        <div className="overflow-hidden rounded-lg border border-slate-800">
            <table className="w-full text-sm">
                <thead className="bg-slate-900/70">
                    <tr>
                        <th className="py-2 px-4 text-left">Metric</th>
                        <th className="py-2 px-4 text-center">Current</th>
                        <th className="py-2 px-4 text-center">Target</th>
                        <th className="py-2 px-4 text-center">Delta</th>
                    </tr>
                </thead>
                <tbody>
                    <MetricRow label="Integrated LUFS" currentValue={currentStats.lufs} targetValue={targetStats.lufs} unit="LUFS" />
                    <MetricRow label="True Peak" currentValue={currentStats.peak} targetValue={targetStats.peak} unit="dBTP" />
                </tbody>
            </table>
        </div>
        <p className="text-xs text-slate-500 mt-2">This is a preliminary analysis. The AI will perform a more detailed diagnosis.</p>
      </div>
    </div>
  );
};
