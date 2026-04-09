
import React, { useState } from 'react';
import { AppState } from '../types';

interface LearningCenterProps {
  state: AppState;
  onUpdateState: (newState: AppState) => void;
}

const LearningCenter: React.FC<LearningCenterProps> = ({ state, onUpdateState }) => {
  const [newInsight, setNewInsight] = useState('');

  const handleAddInsight = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInsight.trim()) return;
    
    onUpdateState({
      ...state,
      knowledgeBase: [newInsight, ...state.knowledgeBase].slice(0, 20)
    });
    setNewInsight('');
  };

  const clearHistory = () => {
    if (confirm("Reset strategic history? This cannot be undone.")) {
      onUpdateState({ ...state, history: [] });
    }
  };

  const clearVault = () => {
    if (confirm("Wipe the Vault? All saved assets will be deleted.")) {
      onUpdateState({ ...state, savedPrompts: [] });
    }
  };

  const updateNiche = (niche: string) => {
    onUpdateState({ ...state, currentNiche: niche });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-32 animate-in fade-in duration-700">
      <div>
        <h2 className="text-4xl font-black text-diamond font-graffiti text-dripping">Evo-Intelligence</h2>
        <p className="text-white/40 mt-2 font-street">Managing the self-learning knowledge stack for {state.branding.name}.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Knowledge Base */}
        <section className="bg-transparent backdrop-blur-sm border border-white/10 p-8 rounded-3xl space-y-6 embossed-edge">
          <h3 className="text-xl font-black flex items-center gap-2 font-graffiti text-diamond">
            <svg className="w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.674a1 1 0 00.922-.606l2.024-4.722a1 1 0 00.117-.466V7a2 2 0 00-2-2H4.663a2 2 0 00-2 2v2.206c0 .164.04.325.117.466l2.024 4.722a1 1 0 00.922.606z" /></svg>
            Evolutionary Context
          </h3>
          
          <form onSubmit={handleAddInsight} className="flex gap-2">
            <input 
              type="text" 
              placeholder="Inject new insight..."
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-white/20 font-street text-white"
              value={newInsight}
              onChange={(e) => setNewInsight(e.target.value)}
            />
            <button className="bg-white/10 hover:bg-white/20 p-3 rounded-xl transition-colors border border-white/10 embossed-edge">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            </button>
          </form>

          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {state.knowledgeBase.map((item, idx) => (
              <div key={idx} className="p-4 bg-white/5 rounded-xl border border-white/5 text-sm text-white/60 flex gap-3 group font-street">
                <span className="text-white font-bold">[{idx + 1}]</span>
                <span className="flex-1">{item}</span>
                <button 
                  onClick={() => onUpdateState({...state, knowledgeBase: state.knowledgeBase.filter((_, i) => i !== idx)})}
                  className="opacity-0 group-hover:opacity-100 text-red-500/50 hover:text-red-500 transition-opacity"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* System Settings */}
        <div className="space-y-8">
          <section className="bg-transparent backdrop-blur-sm border border-white/10 p-8 rounded-3xl space-y-6 embossed-edge">
            <h3 className="text-xl font-black flex items-center gap-2 font-graffiti text-diamond">
              <svg className="w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              Core Parameters
            </h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest font-street">Global Brand Focus</label>
                <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-black font-graffiti text-diamond tracking-widest">
                  {state.branding.name}
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest font-street">Active Market Segment / Niche</label>
                <input 
                  type="text"
                  placeholder="e.g. Personal Finance, AI Art, Fitness..."
                  value={state.currentNiche}
                  onChange={(e) => updateNiche(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-white/20 text-white font-street"
                />
                <p className="text-[10px] text-white/20 italic font-street">Changing this will influence trend discovery and asset generation globally.</p>
              </div>
            </div>
          </section>

          <section className="bg-transparent backdrop-blur-sm border border-red-500/20 p-8 rounded-3xl space-y-6 embossed-edge">
            <h3 className="text-xl font-black flex items-center gap-2 text-red-400 font-graffiti">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              Data Hygiene
            </h3>
            <p className="text-xs text-white/40 leading-relaxed font-street">System maintenance protocols for clearing temporary and permanent data.</p>
            <div className="space-y-3">
              <button 
                onClick={clearHistory}
                className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white/60 text-xs font-black uppercase tracking-widest transition-all font-graffiti embossed-edge"
              >
                Flush Feed History
              </button>
              <button 
                onClick={clearVault}
                className="w-full py-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-xl text-red-400 text-xs font-black uppercase tracking-widest transition-all font-graffiti embossed-edge"
              >
                Clear The Vault
              </button>
            </div>
          </section>
        </div>
      </div>

      {/* Evolutionary Progress Bar */}
      <section className="bg-transparent backdrop-blur-sm border border-white/10 p-8 rounded-3xl relative overflow-hidden embossed-edge">
        <div className="absolute top-0 left-0 w-1 h-full bg-white/20"></div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex-1">
            <h4 className="text-xl font-black font-graffiti text-diamond">Neural Connectivity</h4>
            <p className="text-white/40 text-sm mt-1 font-street">Measuring the density of adopted trends vs. history performance.</p>
            <div className="w-full bg-white/5 h-2 rounded-full mt-4 overflow-hidden border border-white/5">
              <div 
                className="h-full bg-white/40" 
                style={{ width: `${Math.min(100, (state.knowledgeBase.length / 20) * 100)}%` }}
              ></div>
            </div>
          </div>
          <div className="text-right">
            <span className="text-4xl font-black text-diamond font-graffiti">{Math.min(100, (state.knowledgeBase.length / 20) * 100)}%</span>
            <p className="text-[10px] font-bold text-white/30 uppercase tracking-tighter font-street">Capacity Optimized</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LearningCenter;
