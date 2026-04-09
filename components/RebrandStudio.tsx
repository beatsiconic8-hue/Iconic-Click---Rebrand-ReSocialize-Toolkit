
import React, { useState } from 'react';
import { AppState, RebrandResults, ThumbnailPrompt } from '../types';
import { rebrandVideo } from '../services/geminiService';

interface RebrandStudioProps {
  state: AppState;
  onRebrandComplete: (results: RebrandResults) => void;
  onToggleSave: (prompt: ThumbnailPrompt) => void;
}

const RebrandStudio: React.FC<RebrandStudioProps> = ({ state, onRebrandComplete, onToggleSave }) => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<RebrandResults | null>(state.rebrandResults);

  const handleRebrand = async () => {
    if (!url) return;
    setLoading(true);
    try {
      const data = await rebrandVideo(url, state.currentNiche, state.knowledgeBase, state.isDevMode);
      setResults(data);
      onRebrandComplete(data);
    } catch (err) {
      alert("Nexus processing failed. Retrying...");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Metadata locked to clipboard.");
  };

  const copyTimestamps = () => {
    if (!results?.timestamps) return;
    const tsText = results.timestamps.map(t => `${t.time} - ${t.label}`).join('\n');
    copyToClipboard(tsText);
  };

  const getFullDescription = () => {
    if (!results) return "";
    const tsText = results.timestamps.map(t => `${t.time} - ${t.label}`).join('\n');
    return `${results.description}\n\nTIMELINE:\n${tsText}\n\n${results.hashtagBlock}\n\n${results.keywordBlock}`;
  };

  return (
    <div className="space-y-12 pb-24 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-diamond font-graffiti text-dripping tracking-tight">Rebrand Studio</h2>
          <p className="text-white/40 mt-2 font-street">Revolutionize existing assets with Pro-tier Bio-Intelligence.</p>
        </div>
      </header>

      <section className="bg-transparent backdrop-blur-sm border border-white/10 p-8 rounded-3xl embossed-edge">
        <div className="flex flex-col md:flex-row gap-4">
          <input 
            type="text" 
            placeholder="Paste YouTube Video URL..." 
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-5 py-4 focus:ring-2 focus:ring-white/20 outline-none transition-all text-white font-street"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <button 
            onClick={handleRebrand}
            disabled={loading}
            className="px-10 py-4 bg-white/10 hover:bg-white/20 text-white font-black rounded-xl transition-all border border-white/20 font-graffiti tracking-widest embossed-edge disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                Analyzing Transcript...
              </span>
            ) : "Rebrand Optimized"}
          </button>
        </div>
      </section>

      {results && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div className="bg-transparent backdrop-blur-sm p-8 rounded-3xl space-y-6 border border-white/10 embossed-edge">
              <div>
                <label className="text-[10px] font-black uppercase text-white/40 tracking-widest mb-2 block font-street">Optimized Title</label>
                <div className="text-2xl font-black text-diamond font-graffiti flex justify-between group">
                  {results.title}
                  <button onClick={() => copyToClipboard(results.title)} className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:text-white/60">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                  </button>
                </div>
              </div>
              
              <div className="border-t border-white/5 pt-6">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[10px] font-black uppercase text-white/40 tracking-widest block font-street">Video Timeline Breakdown</label>
                  <button onClick={copyTimestamps} className="text-[10px] font-bold text-white/40 hover:text-white uppercase tracking-tighter transition-colors font-street">Copy Timeline</button>
                </div>
                <div className="bg-white/5 rounded-xl border border-white/5 p-4 max-h-48 overflow-y-auto custom-scrollbar font-street">
                  {results.timestamps.length > 0 ? (
                    <div className="space-y-2">
                      {results.timestamps.map((ts, idx) => (
                        <div key={idx} className="flex gap-4 text-xs">
                          <span className="font-mono text-white/60 shrink-0 w-12">{ts.time}</span>
                          <span className="text-white/40">{ts.label}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-white/20 text-[10px] italic">No chapters found in video stream.</p>
                  )}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-white/40 tracking-widest mb-2 block font-street">Description Meta (SEO Primed)</label>
                <div className="text-sm text-white/60 leading-relaxed max-h-48 overflow-y-auto pr-2 custom-scrollbar whitespace-pre-wrap font-street">
                  {results.description}
                </div>
                <button onClick={() => copyToClipboard(getFullDescription())} className="mt-4 text-[10px] font-bold text-white/20 hover:text-white uppercase tracking-widest flex items-center gap-2 font-street">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                  Copy Full Bio-Block
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-transparent backdrop-blur-sm p-6 rounded-2xl border border-white/10 embossed-edge">
                <label className="text-[10px] font-black uppercase text-white/40 tracking-widest mb-4 block font-street">Hashtag Block</label>
                <p className="text-sm font-mono text-white/60 break-words font-street">{results.hashtagBlock}</p>
                <button onClick={() => copyToClipboard(results.hashtagBlock)} className="mt-4 text-xs font-bold text-white/30 hover:text-white uppercase tracking-tighter font-street">Copy Tags</button>
              </div>
              <div className="bg-transparent backdrop-blur-sm p-6 rounded-2xl border border-white/10 embossed-edge">
                <label className="text-[10px] font-black uppercase text-white/40 tracking-widest mb-4 block font-street">Keyword Block ({results.keywordBlock.length}/500)</label>
                <p className="text-[10px] font-mono text-white/40 leading-relaxed break-words font-street">{results.keywordBlock}</p>
                <button onClick={() => copyToClipboard(results.keywordBlock)} className="mt-4 text-xs font-bold text-white/30 hover:text-white uppercase tracking-tighter font-street">Copy Keywords</button>
              </div>
            </div>
            
            <div className="bg-transparent backdrop-blur-sm p-6 rounded-2xl border border-white/10 embossed-edge">
              <label className="text-[10px] font-black uppercase text-white/40 tracking-widest mb-4 block font-street">Pinned Engagement Comment</label>
              <p className="text-sm text-white/80 italic leading-relaxed font-street">"{results.pinnedComment}"</p>
              <button onClick={() => copyToClipboard(results.pinnedComment)} className="mt-4 text-xs font-bold text-white/30 hover:text-white uppercase tracking-tighter font-street">Copy Comment</button>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-2xl font-black flex items-center gap-2 font-graffiti text-diamond">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
              New Thumbnail Concept Forge
            </h3>
            {results.thumbnailPrompts.map((p, i) => (
              <div key={i} className="bg-transparent backdrop-blur-sm p-6 rounded-2xl border border-white/10 hover:border-white/30 transition-all group embossed-edge">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-2xl font-black font-graffiti text-diamond">{p.conceptName}</h4>
                  <span className="text-white font-bold bg-white/10 px-2 py-1 rounded text-xs font-street border border-white/10">{p.ctrRating}% SUCCESS</span>
                </div>
                <p className="text-xs text-white/40 mb-4 italic leading-relaxed font-street">"{p.visualDescription}"</p>
                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <span className="text-[10px] text-white/20 uppercase font-black tracking-widest font-street">Psych-Trigger: {p.psychologicalTrigger}</span>
                  <button onClick={() => onToggleSave(p)} className="text-xs bg-white/10 text-white px-4 py-2 rounded-xl font-black uppercase tracking-widest hover:bg-white/20 transition-all font-graffiti border border-white/20 embossed-edge">Save Asset</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RebrandStudio;
