
import React, { useState, useEffect } from 'react';
import { View, AppState, ThumbnailPrompt, TrendData, Platform, RebrandResults } from './types';
import Dashboard from './components/Dashboard';
import PromptGenerator from './components/PromptGenerator';
import DiscoveryLab from './components/DiscoveryLab';
import LearningCenter from './components/LearningCenter';
import StrategyCenter from './components/StrategyCenter';
import RebrandStudio from './components/RebrandStudio';
import ImageForge from './components/ImageForge';
import MultimodalEmbedding from './components/MultimodalEmbedding';
import { Layout } from './components/Layout';

const STORAGE_KEY = 'iconic_click_state_v4';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);
  const [state, setState] = useState<AppState>(() => {
    const defaultState: AppState = {
      history: [],
      savedPrompts: [],
      knowledgeBase: [
        "Use high contrast for @iconicbeatsla branding",
        "Curiosity gaps drive the most clicks",
        "Large faces with extreme expressions perform well"
      ],
      discoveryHistory: [],
      currentNiche: "Music Production",
      currentPlatform: "YouTube",
      rebrandResults: null,
      isDevMode: false,
      branding: {
        name: "@iconicbeatsla",
        colors: ["#3b82f6", "#8b5cf6", "#ffd700", "#000000"],
        vibe: "Iconic, Sleek, High-Energy"
      }
    };

    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          return { ...defaultState, ...parsed };
        }
      } catch (e) {
        console.error("Failed to parse saved state", e);
      }
    }
    return defaultState;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const addPromptToHistory = (prompts: ThumbnailPrompt[]) => {
    setState(prev => ({
      ...prev,
      history: [...prompts, ...prev.history].slice(0, 50)
    }));
  };

  const toggleSavePrompt = (prompt: ThumbnailPrompt) => {
    setState(prev => {
      const isSaved = prev.savedPrompts.some(p => p.id === prompt.id);
      return {
        ...prev,
        savedPrompts: isSaved 
          ? prev.savedPrompts.filter(p => p.id !== prompt.id)
          : [prompt, ...prev.savedPrompts]
      };
    });
  };

  const updateKnowledgeBase = (insight: string) => {
    setState(prev => ({
      ...prev,
      knowledgeBase: [insight, ...prev.knowledgeBase].slice(0, 20)
    }));
  };

  const setRebrandResults = (results: RebrandResults) => {
    setState(prev => ({ ...prev, rebrandResults: results }));
  };

  const addTrendsToHistory = (trends: TrendData[]) => {
    setState(prev => ({
      ...prev,
      discoveryHistory: [...trends, ...prev.discoveryHistory].slice(0, 30)
    }));
  };

  const setPlatform = (platform: Platform) => {
    setState(prev => ({ ...prev, currentPlatform: platform }));
  };

  const renderView = () => {
    switch (currentView) {
      case View.DASHBOARD:
        return <Dashboard state={state} onNavigate={setCurrentView} onToggleSave={toggleSavePrompt} />;
      case View.GENERATOR:
        return <PromptGenerator 
          state={state} 
          onPromptsGenerated={addPromptToHistory} 
          onToggleSave={toggleSavePrompt}
          onPlatformChange={setPlatform}
        />;
      case View.DISCOVERY:
        return <DiscoveryLab 
          state={state} 
          onLearn={updateKnowledgeBase} 
          onTrendsFound={addTrendsToHistory}
        />;
      case View.REBRAND:
        return <RebrandStudio 
          state={state} 
          onRebrandComplete={setRebrandResults} 
          onToggleSave={toggleSavePrompt}
        />;
      case View.FORGE:
        return <ImageForge state={state} />;
      case View.EMBEDDING:
        return <MultimodalEmbedding state={state} />;
      case View.LEARNING:
        return <LearningCenter state={state} onUpdateState={setState} />;
      case View.STRATEGY:
        return <StrategyCenter state={state} />;
      default:
        return <Dashboard state={state} onNavigate={setCurrentView} onToggleSave={toggleSavePrompt} />;
    }
  };

  return (
    <Layout 
      currentView={currentView} 
      onNavigate={setCurrentView}
      isDevMode={state.isDevMode}
      onToggleDevMode={(val) => setState(prev => ({ ...prev, isDevMode: val }))}
    >
      {renderView()}
    </Layout>
  );
};

export default App;
