
export type AgentName =
  | 'Analysis'
  | 'EQ'
  | 'Dynamics'
  | 'StereoImage'
  | 'Enhancement'
  | 'QualityCheck'
  | 'Improvement'
  | 'Delivery';

export type ProcessStatus = 'pending' | 'in-progress' | 'complete' | 'evaluating' | 'reworking' | 'error';

export interface ProcessStep {
  id: number;
  agent: AgentName;
  task: string;
  status: ProcessStatus;
  details?: string;
}

export interface AnalyticsData {
  before: {
    lufs: number;
    peak: number;
    crest: number;
    spectrum: number[];
  };
  after: {
    lufs: number;
    peak: number;
    crest: number;
    spectrum: number[];
  };
}

export interface MasteringGoal {
  platform: 'streaming' | 'beatport' | 'cd' | 'youtube' | 'auto';
  tags: string[];
}

export interface FinalVersion {
  name: string;
  description: string;
}

// Added User type for authentication and profile management
export interface User {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}
