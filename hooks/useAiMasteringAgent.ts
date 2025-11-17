
import { useState, useCallback } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import type { ProcessStep, AnalyticsData, MasteringGoal, FinalVersion, AgentName } from '../types';

const FALLBACK_API_KEY = 'AIzaSyCxn-tLGeGnl7Smn3B0-GN0zDpt2RLrQCM';

const API_KEY: string =
  // Prefer Node-style env if available (e.g. in build tools)
  (typeof process !== 'undefined' && (process as any)?.env?.API_KEY) ||
  // Or allow setting on window (for quick demos)
  (typeof window !== 'undefined' && (window as any).API_KEY) ||
  FALLBACK_API_KEY;

if (!API_KEY) {
  console.warn('API_KEY not provided. Falling back to local mastering simulation.');
}

const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY, vertexai: true }) : null;

const initialSpectrum = Array.from({ length: 32 }, () => Math.random() * 0.4 + 0.1);
const initialAnalytics: AnalyticsData = {
  before: { lufs: -24.5, peak: -3.1, crest: 12.3, spectrum: initialSpectrum },
  after: { lufs: -24.5, peak: -3.1, crest: 12.3, spectrum: initialSpectrum },
};

const finalVersionsData: FinalVersion[] = [
  { name: 'Streaming Master', description: 'Optimized for Spotify, Apple Music (-14 LUFS).' },
  { name: 'CD Master', description: 'Full dynamic range, ready for physical media.' },
  { name: 'Loud Master', description: 'Competitive loudness for specific use cases.' },
  { name: 'Analog Taste', description: 'Master with subtle saturation and warmth.' },
];

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

type EvaluationResult = {
  evaluation: string;
  reworkStep: { agent: AgentName; task: string };
};

const createFallbackPlan = (goal: MasteringGoal) => {
  const tagSummary = goal.tags.length ? goal.tags.join(', ') : 'balanced presentation';
  return [
    { agent: 'Analysis' as AgentName, task: `Analyze spectral balance for ${goal.platform} delivery.` },
    { agent: 'EQ' as AgentName, task: `Shape tonal curve to emphasize ${tagSummary}.` },
    { agent: 'Dynamics' as AgentName, task: 'Control transients and glue the mix with smart compression.' },
    { agent: 'StereoImage' as AgentName, task: 'Enhance width while preserving mono compatibility.' },
    { agent: 'Enhancement' as AgentName, task: 'Apply subtle coloration and harmonic polish.' },
    { agent: 'QualityCheck' as AgentName, task: 'Verify headroom, loudness, and translation on references.' },
  ];
};

const fallbackEvaluation: EvaluationResult = {
  evaluation: 'Overall balance meets the target curve; only a touch more air is recommended.',
  reworkStep: { agent: 'EQ' as AgentName, task: 'Add a gentle high-shelf boost above 12 kHz for extra clarity.' },
};

const generateTaskPlan = async (goal: MasteringGoal) => {
  if (!ai) {
    return createFallbackPlan(goal);
  }

  const systemPrompt = `You are an AI mastering engineer task scheduler. Based on the user's structured request, break down the mastering process into a sequence of tasks for different AI agents. The agents are: 'Analysis', 'EQ', 'Dynamics', 'StereoImage', 'Enhancement', 'QualityCheck'. Respond ONLY with a JSON array of objects, where each object has 'agent' (string) and 'task' (string) properties. The user's goal is to release on '${goal.platform}' and they want the track to be '${goal.tags.join(', ')}'. Be professional and logical.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { role: 'user', parts: [{ text: `Target Platform: ${goal.platform}, Desired Characteristics: ${goal.tags.join(', ')}` }] },
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              agent: { type: Type.STRING },
              task: { type: Type.STRING },
            },
          },
        },
      },
    });

    const taskPlan = JSON.parse(response.text ?? '[]');
    if (Array.isArray(taskPlan) && taskPlan.length) {
      return taskPlan;
    }
  } catch (error) {
    console.warn('Could not fetch task plan from Gemini. Using fallback plan.', error);
  }

  return createFallbackPlan(goal);
};

const requestEvaluation = async (goal: MasteringGoal, metrics: { lufs: number; peak: number }) => {
  if (!ai) {
    return fallbackEvaluation;
  }

  const evaluationPrompt = `You are a quality assurance AI for audio mastering. The goal was: platform '${goal.platform}', characteristics '${goal.tags.join(', ')}'. The current metrics are LUFS: ${metrics.lufs.toFixed(1)}, Peak: ${metrics.peak.toFixed(1)}. Based on the goal, suggest one final micro-adjustment. Respond with a JSON object: {"evaluation": "brief summary", "reworkStep": { "agent": "EQ" | "Dynamics", "task": "specific micro-adjustment" } }.`;

  try {
    const evalResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { role: 'user', parts: [{ text: evaluationPrompt }] },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            evaluation: { type: Type.STRING },
            reworkStep: {
              type: Type.OBJECT,
              properties: {
                agent: { type: Type.STRING },
                task: { type: Type.STRING },
              },
            },
          },
        },
      },
    });

    const evaluationResult = JSON.parse(evalResponse.text ?? 'null');
    if (evaluationResult?.evaluation && evaluationResult?.reworkStep) {
      return evaluationResult as EvaluationResult;
    }
  } catch (error) {
    console.warn('Could not fetch evaluation from Gemini. Using fallback assessment.', error);
  }

  return fallbackEvaluation;
};

export const useAiMasteringAgent = () => {
  const [processSteps, setProcessSteps] = useState<ProcessStep[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData>(initialAnalytics);
  const [finalVersions, setFinalVersions] = useState<FinalVersion[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const reset = useCallback(() => {
    setProcessSteps([]);
    setAnalytics(initialAnalytics);
    setFinalVersions([]);
    setIsProcessing(false);
    setStatusMessage('');
  }, []);

  const startMasteringProcess = useCallback(async (goal: MasteringGoal) => {
    reset();
    setIsProcessing(true);
    setStatusMessage('Initializing AI agents...');

    try {
      // Step 1: Get initial task breakdown (Gemini or fallback)
      const taskPlan = await generateTaskPlan(goal);
      let currentSteps: ProcessStep[] = taskPlan.map((p: any, i: number) => ({
        id: i,
        agent: p.agent as AgentName,
        task: p.task,
        status: 'pending',
      }));
      setProcessSteps(currentSteps);
      await sleep(1000);

      // Step 2: Simulate processing each step
      let tempAnalytics = { ...analytics };
      for (let i = 0; i < currentSteps.length; i++) {
        // Update status to 'in-progress'
        currentSteps = currentSteps.map((s, idx) => idx === i ? { ...s, status: 'in-progress' } : s);
        setProcessSteps([...currentSteps]);
        setStatusMessage(`Agent [${currentSteps[i].agent}] is executing: ${currentSteps[i].task}`);
        
        // Simulate work
        await sleep(2000 + Math.random() * 1500);
        
        // Simulate analytics change
        tempAnalytics = {
            ...tempAnalytics,
            after: {
                lufs: tempAnalytics.after.lufs + (14 - tempAnalytics.after.lufs) * 0.2,
                peak: tempAnalytics.after.peak + (-1 - tempAnalytics.after.peak) * 0.2,
                crest: tempAnalytics.after.crest + (9 - tempAnalytics.after.crest) * 0.2,
                spectrum: tempAnalytics.after.spectrum.map(v => Math.min(1, v + (Math.random() - 0.45) * 0.2)),
            }
        };
        setAnalytics(tempAnalytics);

        // Update status to 'complete'
        currentSteps = currentSteps.map((s, idx) => idx === i ? { ...s, status: 'complete' } : s);
        setProcessSteps([...currentSteps]);
      }

      // Step 3: Simulate self-evaluation and improvement loop
      setStatusMessage('Agents evaluating results for improvement...');
      const improvementStep: ProcessStep = { id: currentSteps.length, agent: 'Improvement', task: 'Self-evaluating overall balance and dynamics.', status: 'in-progress' };
      currentSteps.push(improvementStep);
      setProcessSteps([...currentSteps]);
      await sleep(2500);

      // Simulate Gemini's evaluation
      const evaluationResult = await requestEvaluation(goal, {
        lufs: tempAnalytics.after.lufs,
        peak: tempAnalytics.after.peak,
      });

      currentSteps = currentSteps.map(s => s.agent === 'Improvement' ? { ...s, status: 'complete', details: evaluationResult.evaluation } : s);
      setProcessSteps([...currentSteps]);
      await sleep(1000);

      // Simulate rework
      const reworkStep: ProcessStep = { id: currentSteps.length, agent: evaluationResult.reworkStep.agent, task: evaluationResult.reworkStep.task, status: 'reworking' };
      currentSteps.push(reworkStep);
      setProcessSteps([...currentSteps]);
      setStatusMessage(`Reworking: ${reworkStep.task}`);
      await sleep(2000);

      // Final analytics update
      tempAnalytics = {
        ...tempAnalytics,
        after: {
            lufs: -14.1,
            peak: -1.0,
            crest: 9.2,
            spectrum: tempAnalytics.after.spectrum.map(v => Math.min(1, v + (Math.random() - 0.4) * 0.1)),
        }
      };
      setAnalytics(tempAnalytics);
      currentSteps = currentSteps.map(s => s.status === 'reworking' ? { ...s, status: 'complete' } : s);
      setProcessSteps([...currentSteps]);

      // Step 4: Delivery
      const deliveryStep: ProcessStep = { id: currentSteps.length, agent: 'Delivery', task: 'Generating final versions for different platforms.', status: 'in-progress' };
      currentSteps.push(deliveryStep);
      setProcessSteps([...currentSteps]);
      setStatusMessage('Finalizing and generating output files...');
      await sleep(1500);

      currentSteps = currentSteps.map(s => s.agent === 'Delivery' ? { ...s, status: 'complete' } : s);
      setProcessSteps([...currentSteps]);
      setFinalVersions(finalVersionsData);

    } catch (error) {
      console.error("Error during mastering process:", error);
      setStatusMessage('An error occurred. Please check the console.');
      const errorStep: ProcessStep = { id: processSteps.length, agent: 'Improvement', task: 'Process failed', status: 'error', details: (error as Error).message };
      setProcessSteps(prev => [...prev, errorStep]);
    } finally {
      setIsProcessing(false);
      setStatusMessage('Mastering process complete.');
    }
  }, [reset, analytics, processSteps]);

  return { processSteps, analytics, finalVersions, isProcessing, statusMessage, startMasteringProcess, reset };
};
