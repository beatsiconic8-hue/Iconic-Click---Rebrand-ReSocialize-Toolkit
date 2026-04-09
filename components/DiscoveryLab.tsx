
import React, { useState } from 'react';
import { AppState, TrendData } from '../types';
import { researchTrends } from '../services/geminiService';

interface DiscoveryLabProps {
  state: AppState;
  onLearn: (insight: string) => void;
  onTrendsFound: (trends: TrendData[]) => void;
}

const DiscoveryLab: React.FC<DiscoveryLabProps> = ({ state, onLearn, onTrendsFound }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentTrends, setCurrentTrends] = useState<TrendData[]>([]);

  const handleResearch = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await researchTrends(state.currentNiche, state.isDevMode);
      setCurrentTrends(data);
      onTrendsFound(data);
    } catch (err: any) {
      console.error(err);
      if (err?.status === 429 || err?.message?.includes("quota") || err?.message?.includes("429")) {
        setError("Trend Research Quota Exceeded. Please check your billing or wait a few minutes.");
      } else {
        setError("Algorithm scan interrupted. Please verify connectivity.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAdopt = (trend: TrendData) => {
    // Injecting granular data into the evolutionary knowledge stack
    const cuesText = trend.visualCues?.join(', ') || 'N/A';
    const keywordsText = trend.keywords?.join(', ') || 'N/A';
    const insight = `Trend: ${trend.topic}. Style: ${trend.visualStyle}. Visual Cues: ${cuesText}. SEO Keywords: ${keywordsText}.`;
    
    onLearn(insight);
    alert(`Evo-Intelligence context updated with ${trend.topic} visual cues.`);
  };

  return (
    <div className="space-y-12 pb-20 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-diamond font-graffiti text-dripping tracking-tight">Trend Discovery Lab</h2>
          <p className="text-white/40 mt-2 font-street">Deep-scanning YouTube algorithms for {state.currentNiche} trends...</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 px-4 py-2 rounded-xl text-red-400 text-xs mb-2 max-w-sm text-right font-street">
              {error}
            </div>
          )}
          <button 
            onClick={handleResearch}
            disabled={loading}
            className="bg-white/10 hover:bg-white/20 text-white font-black px-8 py-4 rounded-xl transition-all border border-white/20 embossed-edge flex items-center gap-2 group font-graffiti tracking-widest"
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            ) : (
              <svg className="w-5 h-5 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.618.309a6 6 0 01-3.86.517l-3.158-.632a2 2 0 01-1.223-1.223L3.5 11.5a2 2 0 011.223-1.223l3.158-.632a6 6 0 013.86.517l.618.309a6 6 0 003.86.517l2.387-.477a2 2 0 001.022-.547l3.5-3.5" /></svg>
            )}
            {loading ? "Decrypting Metadata..." : "Initialize Global Scan"}
          </button>
        </div>
      </header>

      {/* Current Research Results */}
      {currentTrends.length > 0 && (
        <section className="animate-in slide-in-from-top-4 duration-500">
          <h3 className="text-2xl font-black mb-6 text-diamond font-graffiti flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
            Real-time Scan Results
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentTrends.map((trend, idx) => (
              <div key={`current-${idx}`} className="bg-transparent backdrop-blur-sm border border-white/10 rounded-2xl p-6 flex flex-col hover:border-white/30 transition-all group relative overflow-hidden embossed-edge">
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-widest border border-white/10 font-street ${
                    trend.momentum === 'rising' ? 'bg-white/10 text-white' :
                    trend.momentum === 'peaked' ? 'bg-white/5 text-white/60' :
                    'bg-white/5 text-white/40'
                  }`}>
                    {trend.momentum}
                  </span>
                  <span className="text-white/20 text-xs font-street">NEW</span>
                </div>
                <h3 className="text-2xl font-black mb-3 font-graffiti text-diamond">{trend.topic}</h3>
                <p className="text-white/50 text-sm leading-relaxed mb-4 italic font-street">
                  "{trend.visualStyle}"
                </p>
                
                <div className="space-y-3 mb-6 flex-1">
                  <div className="flex flex-wrap gap-1">
                    {trend.visualCues.map((cue, i) => (
                      <span key={i} className="text-[10px] px-1.5 py-0.5 bg-white/5 text-white/60 rounded border border-white/10 font-street">
                        {cue}
                      </span>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {trend.keywords.map((kw, i) => (
                      <span key={i} className="text-[10px] px-1.5 py-0.5 bg-white/5 text-white/40 rounded border border-white/10 font-street italic">
                        #{kw}
                      </span>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={() => handleAdopt(trend)}
                  className="w-full py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-xs font-black uppercase tracking-widest transition-all text-white font-graffiti embossed-edge"
                >
                  Adopt Strategy
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Persistent Hypothesis Archive */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-black text-diamond font-graffiti flex items-center gap-2">
            <svg className="w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
            Discovery Hypothesis Archive
          </h3>
          <span className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] font-street">{state.discoveryHistory.length} Patterns Revealed</span>
        </div>
        
        {state.discoveryHistory.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-80 grayscale-[0.5] hover:grayscale-0 transition-all">
            {state.discoveryHistory.map((trend, idx) => (
              <div key={`hist-${idx}`} className="bg-transparent backdrop-blur-sm border border-white/10 rounded-2xl p-6 flex flex-col hover:border-white/30 transition-all group embossed-edge">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-bold px-2 py-1 bg-white/5 rounded-md uppercase tracking-widest text-white/40 font-street border border-white/10">
                    Archived Pattern
                  </span>
                  <span className="text-white/10 text-xs font-street">0{idx + 1}</span>
                </div>
                <h3 className="text-lg font-bold mb-2 text-white/70 font-street">{trend.topic}</h3>
                <p className="text-white/30 text-xs leading-relaxed italic mb-4 font-street">{trend.visualStyle}</p>
                <div className="flex flex-wrap gap-1 opacity-50">
                   {(trend.visualCues || []).slice(0, 3).map((cue, i) => (
                      <span key={i} className="text-[9px] px-1 py-0.5 bg-white/5 text-white/40 rounded border border-white/10 font-street">
                        {cue}
                      </span>
                    ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-24 text-center border-2 border-dashed border-white/10 rounded-3xl embossed-edge bg-transparent backdrop-blur-sm">
            <h3 className="text-xl font-bold text-white/60 font-graffiti">Archive Empty</h3>
            <p className="text-white/30 text-sm max-w-md mx-auto mt-2 font-street">Initialize a scan to begin populating the persistent discovery engine.</p>
          </div>
        )}
      </section>

      {/* Evolutionary Lab Status */}
      <div className="bg-transparent backdrop-blur-sm border border-white/10 p-8 rounded-3xl relative overflow-hidden embossed-edge">
        <h4 className="text-xl font-black mb-4 flex items-center gap-2 font-graffiti text-diamond">
          <span className="w-2 h-2 bg-white rounded-full animate-ping"></span>
          Autonomous Data Fusion
        </h4>
        <div className="space-y-4">
          <p className="text-white/60 text-sm leading-relaxed max-w-2xl font-street">
            Revealed data is now automatically injected into the <span className="text-white font-bold underline decoration-white/30 underline-offset-4">Evo-Intelligence Knowledge Stack</span>. The hypothesis engine correlates past scan successes with current niche momentum, now including <span className="text-white">visual cues</span> and <span className="text-white/60">SEO keywords</span> for 32% more precise prompt targeting.
          </p>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {["Cues Mapping", "Keyword Sync", "Visual Synapse", "Context Grafting"].map(tag => (
              <span key={tag} className="shrink-0 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-white/50 font-street">{tag}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscoveryLab;
