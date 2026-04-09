
export interface ThumbnailPrompt {
  id: string;
  conceptName: string;
  visualDescription: string;
  textOverlay: string;
  compositionNotes: string;
  psychologicalTrigger: string;
  ctrRating: number;
  tags: string[];
  createdAt: string;
}

export interface VideoTimestamp {
  time: string;
  label: string;
}

export interface RebrandResults {
  title: string;
  description: string;
  hashtagBlock: string;
  keywordBlock: string;
  pinnedComment: string;
  timestamps: VideoTimestamp[];
  thumbnailPrompts: ThumbnailPrompt[];
}

export interface TrendData {
  topic: string;
  momentum: 'rising' | 'peaked' | 'fading';
  visualStyle: string;
  visualCues: string[];
  keywords: string[];
  sourceUrl?: string;
}

export type Platform = 'YouTube' | 'YouTube Shorts' | 'Facebook' | 'Instagram' | 'X' | 'Reddit' | 'Pinterest';

export type AspectRatio = "1:1" | "16:9" | "9:16" | "4:3" | "3:4" | "1:4" | "1:8" | "4:1" | "8:1";

export interface AppState {
  history: ThumbnailPrompt[];
  savedPrompts: ThumbnailPrompt[];
  knowledgeBase: string[];
  discoveryHistory: TrendData[];
  currentNiche: string;
  currentPlatform: Platform;
  rebrandResults: RebrandResults | null;
  isDevMode: boolean;
  branding: {
    name: string;
    colors: string[];
    vibe: string;
  };
}

export enum View {
  DASHBOARD = 'DASHBOARD',
  GENERATOR = 'GENERATOR',
  DISCOVERY = 'DISCOVERY',
  LEARNING = 'LEARNING',
  STRATEGY = 'STRATEGY',
  REBRAND = 'REBRAND',
  FORGE = 'FORGE',
  EMBEDDING = 'EMBEDDING'
}
