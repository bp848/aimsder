
import React from 'react';
import type { AnalyticsData } from '../types';

const SpectrumAnalyzer: React.FC<{ data: number[], color: string, glowColor: string, id: string }> = ({ data, color, glowColor, id }) => {
  const width = 200;
  const height = 80;
  const barWidth = width / data.length;

  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id={`gradient-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={glowColor} stopOpacity="0.8" />
          <stop offset="100%" stopColor={color} stopOpacity="0.9" />
        </linearGradient>
        <filter id={`glow-${id}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <g style={{ filter: `url(#glow-${id})` }}>
        {data.map((d, i) => (
          <rect
            key={i}
            x={i * barWidth}
            y={height - d * height}
            width={barWidth - 1}
            height={d * height}
            fill={`url(#gradient-${id})`}
            rx="1"
            style={{ transition: 'y 0.3s ease, height 0.3s ease' }}
          />
        ))}
      </g>
    </svg>
  );
};

const MetricDisplay: React.FC<{ label: string; value: string | number; unit: string }> = ({ label, value, unit }) => (
  <div className="text-center glass-card p-3 rounded-lg bg-slate-900/50">
    <p className="text-sm text-gray-400">{label}</p>
    <p className="text-2xl font-bold text-white tracking-tight">
      {value} <span className="text-base font-medium text-gray-400">{unit}</span>
    </p>
  </div>
);

interface AnalyticsDashboardProps {
  data: AnalyticsData;
  isProcessing: boolean;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ data, isProcessing }) => {
  const { before, after } = data;

  return (
    <div className="glass-card rounded-xl p-5 h-full flex flex-col">
      <h2 className="text-xl font-bold text-white mb-4">3. Quality Assurance</h2>
      <div className="space-y-6 flex-grow flex flex-col justify-around">
        <div>
          <h3 className="text-sm font-semibold text-gray-300 mb-2">Spectrum Analysis</h3>
          <div className="space-y-1">
            <div>
              <p className="text-xs text-gray-500 mb-1">Before</p>
              <SpectrumAnalyzer data={before.spectrum} color="#4B5563" glowColor="#6B7280" id="before" />
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">After</p>
              <SpectrumAnalyzer data={after.spectrum} color="#2563EB" glowColor="#60A5FA" id="after" />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-300 mb-3">Core Metrics</h3>
          <div className="grid grid-cols-3 gap-3">
            <MetricDisplay label="LUFS" value={isProcessing ? '...' : after.lufs.toFixed(1)} unit="LUFS" />
            <MetricDisplay label="Peak" value={isProcessing ? '...' : after.peak.toFixed(1)} unit="dBTP" />
            <MetricDisplay label="Crest" value={isProcessing ? '...' : after.crest.toFixed(1)} unit="dB" />
          </div>
        </div>
      </div>
    </div>
  );
};
