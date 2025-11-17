
import React from 'react';
import type { ProcessStep, ProcessStatus, AgentName } from '../types';
import { CheckCircleIcon, ArrowPathIcon, ExclamationCircleIcon, CogIcon } from './icons';

const getStatusIcon = (status: ProcessStatus) => {
  switch (status) {
    case 'complete':
      return <CheckCircleIcon className="h-6 w-6 text-green-400" />;
    case 'in-progress':
      return <CogIcon className="h-6 w-6 text-blue-400 animate-spin" />;
    case 'evaluating':
    case 'reworking':
      return <ArrowPathIcon className="h-6 w-6 text-yellow-400 animate-spin" />;
    case 'error':
      return <ExclamationCircleIcon className="h-6 w-6 text-red-400" />;
    case 'pending':
    default:
      return <div className="h-6 w-6 flex items-center justify-center"><div className="h-3 w-3 rounded-full bg-slate-600 border-2 border-slate-500"></div></div>;
  }
};

const getAgentColor = (agent: AgentName): string => {
  const colors: Record<AgentName, string> = {
    Analysis: 'bg-cyan-900/50 border-cyan-500',
    EQ: 'bg-green-900/50 border-green-500',
    Dynamics: 'bg-orange-900/50 border-orange-500',
    StereoImage: 'bg-purple-900/50 border-purple-500',
    Enhancement: 'bg-pink-900/50 border-pink-500',
    QualityCheck: 'bg-yellow-900/50 border-yellow-500',
    Improvement: 'bg-amber-900/50 border-amber-500',
    Delivery: 'bg-blue-900/50 border-blue-500',
  };
  return colors[agent] || 'bg-slate-800 border-slate-600';
};

const ProcessStepItem: React.FC<{ step: ProcessStep; isLast: boolean }> = ({ step, isLast }) => (
  <li className="relative pl-12 pb-8">
    {/* Connecting Line */}
    {!isLast && <div className="absolute left-[22px] top-2 h-full w-0.5 bg-slate-700"></div>}
    
    {/* Pulsing dot for in-progress */}
    {step.status === 'in-progress' && (
      <div className="absolute left-[18px] top-2 h-2 w-2 rounded-full bg-blue-400 animate-ping"></div>
    )}

    <div className="flex items-start gap-4">
      <div className="absolute left-0 top-0 flex items-center justify-center w-11 h-11 rounded-full bg-slate-800 border-2 border-slate-700">
        {getStatusIcon(step.status)}
      </div>
      <div className={`flex-1 p-4 rounded-lg border ${getAgentColor(step.agent)}`}>
        <div className="flex items-center justify-between">
          <p className="font-bold text-gray-100 text-lg">{step.agent}</p>
          <p className="text-xs font-mono text-gray-500 capitalize">{step.status}</p>
        </div>
        <p className="text-sm text-gray-300 mt-1">{step.task}</p>
        {step.details && <p className="mt-2 pl-2 border-l-2 border-slate-600 text-xs text-gray-400 italic">{step.details}</p>}
      </div>
    </div>
  </li>
);

interface ProcessFlowProps {
  steps: ProcessStep[];
  statusMessage: string;
  isProcessing: boolean;
}

export const ProcessFlow: React.FC<ProcessFlowProps> = ({ steps, statusMessage, isProcessing }) => {
  return (
    <div className="glass-card rounded-xl p-5 h-full flex flex-col">
      <h2 className="text-xl font-bold text-white mb-6 tracking-wider">2. AGENT PROCESS FLOW</h2>
      {steps.length === 0 ? (
        <div className="flex-grow flex flex-col items-center justify-center text-center text-gray-500">
          <CogIcon className="h-16 w-16 mb-4 text-slate-600" />
          <p className="font-semibold text-lg">Awaiting Instructions</p>
          <p className="text-sm max-w-xs">Upload a file and define your goal to initiate the autonomous mastering sequence.</p>
        </div>
      ) : (
        <div className="flex-grow flex flex-col">
          <div className="flex-grow overflow-y-auto pr-2 -mr-2">
            <ul>
              {steps.map((step, index) => (
                <ProcessStepItem key={step.id} step={step} isLast={index === steps.length - 1} />
              ))}
            </ul>
          </div>
          {isProcessing && (
            <div className="mt-4 p-3 bg-blue-900/50 rounded-lg text-center border border-blue-500/50">
              <p className="text-sm text-blue-300 animate-pulse font-semibold">{statusMessage}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
