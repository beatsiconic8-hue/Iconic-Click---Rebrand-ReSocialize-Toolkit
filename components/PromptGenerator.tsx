
import React, { useState } from 'react';
import { AppState, ThumbnailPrompt, Platform } from '../types';
import { generateThumbnailPrompts } from '../services/geminiService';

interface PromptGeneratorProps {
  state: AppState;
  onPromptsGenerated: (prompts: ThumbnailPrompt[]) => void;
  onToggleSave: (prompt: ThumbnailPrompt) => void;
  onPlatformChange: (platform: Platform) => void;
}

const PromptGenerator: React.FC<PromptGeneratorProps> = ({ state, onPromptsGenerated, onToggleSave, onPlatformChange }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<ThumbnailPrompt[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    niche: state.currentNiche,
    audience: 'Broad Market Creatives',
    platform: state.currentPlatform
  });

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return;

    setLoading(true);
    setError(null);
    setResults([]);
    try {
      const data = await generateThumbnailPrompts(
        formData.title,
        formData.niche,
        formData.audience,
        formData.platform,
        state.knowledgeBase,
        state.isDevMode
      );
      setResults(data);
      onPromptsGenerated(data);
    } catch (err: any) {
      setError(err?.message || "Generation failed");
    } finally {
      setLoading(false);
    }
  };

  const platforms: Platform[] = ['YouTube', 'YouTube Shorts', 'Facebook', 'Instagram', 'X', 'Reddit', 'Pinterest'];
  
  const suggestedNiches = [
    "AI Tech", "Personal Finance", "True Crime", "Gaming Walkthroughs", 
    "ASMR", "Fitness & Biohacking", "Luxury Travel", "Self Improvement"
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-24">
      <section className="bg-transparent backdrop-blur-sm border border-white/10 p-8 rounded-3xl shadow-2xl relative overflow-hidden embossed-edge">
        <h2 className="text-4xl font-black mb-6 flex items-center gap-2 font-graffiti text-diamond text-dripping">
          Strategic Engine
        </h2>

        <form onSubmit={handleGenerate} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-white/50 font-street">Core Topic / Title</label>
              <input 
                type="text"
                required
                placeholder="Enter your video title..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white focus:ring-2 focus:ring-white/20 transition-all outline-none font-street"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-white/50 font-street">Target Platform</label>
              <select 
                className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 focus:ring-2 focus:ring-white/20 outline-none appearance-none font-street text-white"
                value={formData.platform}
                onChange={(e) => {
                  const p = e.target.value as Platform;
                  setFormData({...formData, platform: p});
                  onPlatformChange(p);
                }}
              >
                {platforms.map(p => <option key={p} value={p} className="bg-[#050505]">{p}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-white/50 font-street">Market Niche</label>
              <input 
                type="text"
                placeholder="e.g. Music Production, AI Tech..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white focus:ring-2 focus:ring-white/20 outline-none font-street"
                value={formData.niche}
                onChange={(e) => setFormData({...formData, niche: e.target.value})}
              />
              <div className="flex flex-wrap gap-2 mt-2">
                {suggestedNiches.map(n => (
                  <button 
                    key={n}
                    type="button"
                    onClick={() => setFormData({...formData, niche: n})}
                    className="text-[10px] px-2 py-1 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 text-white/40 hover:text-white transition-colors font-street"
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-white/50 font-street">Audience Profile</label>
              <input 
                type="text"
                placeholder="Describe your viewers..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white focus:ring-2 focus:ring-white/20 outline-none font-street"
                value={formData.audience}
                onChange={(e) => setFormData({...formData, audience: e.target.value})}
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-white/10 border border-white/20 rounded-2xl font-black text-2xl uppercase shadow-xl hover:scale-[1.01] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-graffiti text-diamond embossed-edge tracking-widest"
          >
            {loading ? "Engaging Neural Nexus..." : "Ignite Strategic Engine"}
          </button>
        </form>
      </section>

      {error && <div className="p-4 bg-red-500/20 text-red-400 rounded-xl border border-red-500/30 text-sm font-street">{error}</div>}

      <div className="grid grid-cols-1 gap-8">
        {results.map((item) => (
          <div key={item.id} className="bg-transparent backdrop-blur-sm border border-white/10 rounded-2xl p-8 space-y-6 shadow-xl animate-in fade-in slide-in-from-bottom-4 embossed-edge">
             <div className="flex justify-between items-start">
               <div>
                 <h4 className="text-2xl font-black font-graffiti text-diamond">{item.conceptName}</h4>
                 <p className="text-white/40 text-xs font-street uppercase tracking-widest mt-1">Trigger: {item.psychologicalTrigger}</p>
               </div>
               <div className="text-right">
                  <span className="text-3xl font-black text-diamond">{item.ctrRating}%</span>
                  <p className="text-[10px] text-white/30 uppercase font-bold tracking-tighter font-street">Est. CTR</p>
               </div>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/5">
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest font-street">Image Prompt</span>
                  <div className="bg-white/5 p-4 rounded-xl text-sm leading-relaxed border border-white/5 min-h-[100px] font-street">
                    {item.visualDescription}
                  </div>
                </div>
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest font-street">Master Overlay</span>
                  <div className="bg-white/5 p-4 rounded-xl flex items-center justify-center text-center h-full min-h-[100px] border border-white/5">
                    <h5 className="text-4xl font-black uppercase tracking-tighter text-diamond font-graffiti text-dripping">
                      {item.textOverlay}
                    </h5>
                  </div>
                </div>
             </div>
             <div className="flex flex-wrap gap-2">
                {item.tags.map(tag => <span key={tag} className="text-[10px] px-2 py-1 bg-white/5 rounded text-white/40 font-street border border-white/5">#{tag}</span>)}
                <button 
                  onClick={() => onToggleSave(item)} 
                  className="ml-auto px-6 py-2 bg-white/10 text-white border border-white/20 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-white/20 transition-all font-graffiti embossed-edge"
                >
                  {state.savedPrompts.some(p => p.id === item.id) ? "Unsave Asset" : "Save Asset"}
                </button>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PromptGenerator;
