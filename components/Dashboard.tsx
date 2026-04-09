
import React from 'react';
import { AppState, View, ThumbnailPrompt } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface DashboardProps {
  state: AppState;
  onNavigate: (view: View) => void;
  onToggleSave: (prompt: ThumbnailPrompt) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ state, onNavigate, onToggleSave }) => {
  const chartData = [
    { name: 'Mon', ctr: 4.2 },
    { name: 'Tue', ctr: 5.8 },
    { name: 'Wed', ctr: 5.1 },
    { name: 'Thu', ctr: 7.4 },
    { name: 'Fri', ctr: 8.9 },
    { name: 'Sat', ctr: 12.1 },
    { name: 'Sun', ctr: 15.4 },
  ];

  return (
    <div className="space-y-8 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-4xl font-black text-diamond font-graffiti text-dripping">Iconic Control Center</h2>
          <p className="text-white/50 font-street">Managing SEO-Primed assets for <span className="text-white font-bold">{state.branding.name}</span></p>
        </div>
        <button 
          onClick={() => onNavigate(View.GENERATOR)}
          className="bg-white/10 hover:bg-white/20 text-white font-bold px-8 py-3 rounded-xl transition-all border border-white/20 embossed-edge active:scale-95 font-graffiti tracking-widest"
        >
          New Campaign
        </button>
      </header>

      {/* Grid Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-transparent backdrop-blur-sm border border-white/10 p-6 rounded-2xl embossed-edge hover:border-white/30 transition-colors group">
          <p className="text-white/40 text-xs font-bold uppercase tracking-widest font-street">Active Intelligence</p>
          <div className="flex items-end justify-between mt-2">
            <h3 className="text-5xl font-black text-diamond">{state.knowledgeBase.length}</h3>
            <span className="text-white/60 text-sm font-bold flex items-center">
              +12% <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-9 9-4-4-6 6" /></svg>
            </span>
          </div>
          <p className="text-white/30 text-xs mt-2 font-street">Insights in evolutionary stack</p>
        </div>
        <div className="bg-transparent backdrop-blur-sm border border-white/10 p-6 rounded-2xl embossed-edge">
          <p className="text-white/40 text-xs font-bold uppercase tracking-widest font-street">Avg. Predicted CTR</p>
          <div className="flex items-end justify-between mt-2">
            <h3 className="text-5xl font-black text-diamond">9.4%</h3>
            <span className="text-white/60 text-sm font-bold">High Potential</span>
          </div>
          <p className="text-white/30 text-xs mt-2 font-street">Based on current niche: {state.currentNiche}</p>
        </div>
        <div className="bg-transparent backdrop-blur-sm border border-white/10 p-6 rounded-2xl embossed-edge">
          <p className="text-white/40 text-xs font-bold uppercase tracking-widest font-street">Vault Items</p>
          <div className="flex items-end justify-between mt-2">
            <h3 className="text-5xl font-black text-diamond">{state.savedPrompts.length}</h3>
          </div>
          <p className="text-white/30 text-xs mt-2 font-street">Saved tactical prompts</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Saved Prompts / Vault */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xl font-black flex items-center gap-2 font-graffiti text-diamond">
              <svg className="w-5 h-5 text-white/60" fill="currentColor" viewBox="0 0 24 24"><path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
              The Vault
            </h4>
            <span className="text-[10px] text-white/20 uppercase tracking-widest font-black font-street">Priority Assets</span>
          </div>
          <div className="space-y-3">
            {state.savedPrompts.length > 0 ? (
              state.savedPrompts.slice(0, 5).map((prompt) => (
                <div key={prompt.id} className="bg-transparent backdrop-blur-sm border border-white/10 p-4 rounded-xl flex items-center gap-4 group hover:border-white/30 transition-all embossed-edge">
                  <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-white font-black text-sm border border-white/10">
                    {prompt.ctrRating}%
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="text-white font-bold truncate text-sm font-street">{prompt.conceptName}</h5>
                    <p className="text-white/40 text-[10px] truncate italic">"{prompt.textOverlay}"</p>
                  </div>
                  <button 
                    onClick={() => onToggleSave(prompt)}
                    className="text-white/20 hover:text-white transition-colors p-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              ))
            ) : (
              <div className="py-8 text-center bg-transparent backdrop-blur-sm rounded-xl border border-dashed border-white/10 embossed-edge">
                <p className="text-white/20 text-xs font-street">No assets in vault. Save from Prompt Engine.</p>
              </div>
            )}
          </div>
        </section>

        {/* Chart Section */}
        <section className="bg-transparent backdrop-blur-sm border border-white/10 p-6 rounded-2xl overflow-hidden h-fit embossed-edge">
          <h4 className="text-xl font-black mb-6 font-graffiti text-diamond">Evolutionary Momentum</h4>
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorCtr" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ffffff" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#ffffff" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="name" stroke="#ffffff40" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#ffffff40" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '10px', backdropFilter: 'blur(10px)' }}
                  itemStyle={{ color: '#ffffff' }}
                />
                <Area type="monotone" dataKey="ctr" stroke="#ffffff" strokeWidth={3} fillOpacity={1} fill="url(#colorCtr)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      {/* Recent Prompt History */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-xl font-black font-graffiti text-diamond">Recent Intelligence history</h4>
          <button 
            onClick={() => onNavigate(View.GENERATOR)}
            className="text-xs text-white/60 hover:text-white font-bold font-street tracking-widest"
          >
            Engine Feed
          </button>
        </div>
        <div className="space-y-3">
          {state.history.slice(0, 5).map((prompt) => (
            <div key={prompt.id} className="bg-transparent backdrop-blur-sm border border-white/10 p-4 rounded-xl flex items-center gap-4 hover:bg-white/5 transition-colors cursor-pointer group embossed-edge">
              <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center text-white/20 font-black shrink-0 group-hover:bg-white/10 group-hover:text-white transition-colors border border-white/10">
                {prompt.ctrRating}%
              </div>
              <div className="flex-1 min-w-0">
                <h5 className="text-white font-bold truncate font-street">{prompt.conceptName}</h5>
                <p className="text-white/40 text-xs truncate italic">"{prompt.textOverlay}"</p>
              </div>
              <div className="flex items-center gap-2">
                 <button 
                  onClick={(e) => { e.stopPropagation(); onToggleSave(prompt); }}
                  className={`p-2 rounded-lg transition-colors ${state.savedPrompts.some(p => p.id === prompt.id) ? 'text-white' : 'text-white/10 hover:text-white'}`}
                >
                  <svg className="w-5 h-5" fill={state.savedPrompts.some(p => p.id === prompt.id) ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
                </button>
              </div>
            </div>
          ))}
          {state.history.length === 0 && (
            <div className="text-center py-12 bg-transparent backdrop-blur-sm rounded-xl border border-dashed border-white/20 embossed-edge">
              <p className="text-white/30 text-sm font-street">No assets generated yet. Start the engine to see data here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
