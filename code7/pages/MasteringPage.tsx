
import React, { useState, useCallback } from 'react';
import { ControlPanel } from '../components/ControlPanel';
import { ProcessFlow } from '../components/ProcessFlow';
import { AnalyticsDashboard } from '../components/AnalyticsDashboard';
import { OutputPanel } from '../components/OutputPanel';
import { InitialAnalysis } from '../components/InitialAnalysis';
import { useAiMasteringAgent } from '../hooks/useAiMasteringAgent';
import type { MasteringGoal } from '../types';

const MasteringPage: React.FC = () => {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [masteringGoal, setMasteringGoal] = useState<MasteringGoal>({
    platform: 'streaming',
    tags: [],
  });

  const {
    processSteps,
    analytics,
    finalVersions,
    isProcessing,
    statusMessage,
    startMasteringProcess,
    reset,
  } = useAiMasteringAgent();

  const handleStart = useCallback(() => {
    if (audioFile) {
      startMasteringProcess(masteringGoal);
    }
  }, [audioFile, masteringGoal, startMasteringProcess]);

  const handleReset = () => {
    setAudioFile(null);
    reset();
  };

  const isFinished = finalVersions.length > 0;

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-3">
          <ControlPanel
            audioFile={audioFile}
            setAudioFile={setAudioFile}
            masteringGoal={masteringGoal}
            setMasteringGoal={setMasteringGoal}
            onStart={handleStart}
            onReset={handleReset}
            isProcessing={isProcessing}
            isFinished={isFinished}
          />
        </div>

        <div className="lg:col-span-9 flex flex-col gap-6">
          {isProcessing || isFinished ? (
            <>
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2">
                  <ProcessFlow steps={processSteps} statusMessage={statusMessage} isProcessing={isProcessing} />
                </div>
                <div className="xl:col-span-1">
                  <AnalyticsDashboard data={analytics} isProcessing={isProcessing} />
                </div>
              </div>
              {isFinished && <OutputPanel versions={finalVersions} />}
            </>
          ) : (
            <InitialAnalysis file={audioFile} platform={masteringGoal.platform} />
          )}
        </div>
      </div>
    </div>
  );
};

export default MasteringPage;
