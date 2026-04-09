
import React, { useState } from 'react';
import { AppState } from '../types';

interface StrategyCenterProps {
  state: AppState;
}

const StrategyCenter: React.FC<StrategyCenterProps> = ({ state }) => {
  const [copyStatus, setCopyStatus] = useState<string | null>(null);

  const showStatus = (msg: string) => {
    setCopyStatus(msg);
    setTimeout(() => setCopyStatus(null), 3000);
  };

  const copyContent = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      showStatus('Content Copied!');
    });
  };

  const downloadStrategy = () => {
    const content = `ICONIC CLICK - GROWTH STRATEGY GUIDE\nGenerated for: ${state.branding.name}\n\n90-Day Roadmap Summary:\n- Weeks 1-4: Foundation & Tooling\n- Weeks 5-8: Content Sprint & SEO Dominance\n- Weeks 9-12: Expansion & Monetization\n\nKey Templates included in the app.\n`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'IconicClick_Growth_Strategy.txt';
    a.click();
    URL.revokeObjectURL(url);
    showStatus('Strategy Downloaded!');
  };

  const roadmapData = [
    { phase: 'Weeks 1-2: Foundation', tasks: ['Setup AI tools stack', 'Redesign channel art', 'Optimize past 10 video titles', 'Plan next 30 days'] },
    { phase: 'Weeks 3-6: Sprint', tasks: ['Upload 3-4 beats/week', 'Test 3 thumbnail styles', 'Implement SEO on all uploads', 'Analyze CTR daily'] },
    { phase: 'Weeks 7-12: Expansion', tasks: ['Start long-form tutorials', 'A/B Test Thumbnails', 'Create first "How-to" series', 'Begin monetization optimization'] },
  ];

  const templates = [
    {
      title: 'SEO Title Formula',
      content: '[Artist Name] Type Beat 2025 | [Mood/Description] | Free/[BPM]\nExample: "Drake Type Beat 2025 | Dark Melodic | 140 BPM | Free"'
    },
    {
      title: 'Video Description Template',
      content: '🔥 FREE DOWNLOAD: [Link]\n💰 PURCHASE: [Link]\n\n📧 Business: [Email]\n📱 Instagram: @IconicBeatsLA\n\n🎵 BPM: [X] | Key: [X]\n✅ Free for non-profit'
    },
    {
      title: 'Competitor Analysis Prompt',
      content: 'Analyze the YouTube channel [NAME] and provide:\n1. Top performing themes\n2. Hook structures\n3. Title formulas\n4. Thumbnail style patterns'
    }
  ];

  return (
    <div className="space-y-12 pb-24 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-diamond font-graffiti text-dripping tracking-tight">Growth Strategy Hub</h2>
          <p className="text-white/40 mt-2 font-street">Data-driven roadmaps and asset templates for YouTube dominance.</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={downloadStrategy}
            className="px-6 py-3 bg-white/10 border border-white/20 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white/20 transition-all flex items-center gap-2 font-graffiti embossed-edge"
          >
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            Download Strategy
          </button>
          <button 
            onClick={() => window.print()}
            className="px-6 py-3 bg-white/10 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white/20 transition-all border border-white/20 font-graffiti embossed-edge"
          >
            Print PDF
          </button>
        </div>
      </header>

      {copyStatus && (
        <div className="fixed bottom-24 right-8 bg-white/10 backdrop-blur-md text-white px-6 py-3 rounded-xl shadow-2xl z-50 animate-bounce border border-white/20 font-graffiti text-diamond embossed-edge">
          {copyStatus}
        </div>
      )}

      {/* 90-Day Roadmap */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {roadmapData.map((item, idx) => (
          <div key={idx} className="bg-transparent backdrop-blur-sm border border-white/10 rounded-3xl p-8 relative overflow-hidden group embossed-edge">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/5 rounded-full blur-3xl"></div>
            <h3 className="text-2xl font-black text-diamond font-graffiti mb-6">{item.phase}</h3>
            <ul className="space-y-4">
              {item.tasks.map((task, tidx) => (
                <li key={tidx} className="flex items-start gap-3 text-sm text-white/60 font-street">
                  <span className="w-1.5 h-1.5 rounded-full bg-white/40 shrink-0 mt-1.5"></span>
                  {task}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      {/* Templates Section */}
      <section className="space-y-8">
        <h3 className="text-3xl font-black italic underline decoration-white/20 decoration-4 underline-offset-8 font-graffiti text-diamond">Copy-Ready Intelligence</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {templates.map((tpl, idx) => (
            <div key={idx} className="bg-transparent backdrop-blur-sm border border-white/10 rounded-3xl overflow-hidden flex flex-col embossed-edge">
              <div className="p-6 bg-white/5 flex items-center justify-between border-b border-white/10">
                <span className="text-xs font-black uppercase tracking-widest text-white/40 font-street">{tpl.title}</span>
                <button 
                  onClick={() => copyContent(tpl.content)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/60"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                </button>
              </div>
              <pre className="p-6 text-sm text-white/80 font-mono whitespace-pre-wrap leading-relaxed flex-1 bg-white/5 font-street">
                {tpl.content}
              </pre>
            </div>
          ))}
        </div>
      </section>

      {/* Tool Stack */}
      <section className="bg-transparent backdrop-blur-sm border border-white/10 p-8 rounded-3xl embossed-edge">
        <h3 className="text-2xl font-black mb-8 font-graffiti text-diamond">Iconic AI Tool Stack (Cost Optimized)</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { name: 'ChatGPT', cost: '$0 - $20', impact: 'High', for: 'Strategy & Scripts' },
            { name: 'Leonardo AI', cost: '$0', impact: 'High', for: 'Thumbnails' },
            { name: 'CapCut', cost: '$0', impact: 'Medium', for: 'Quick Edits' },
            { name: 'Adobe Podcast', cost: '$0', impact: 'Medium', for: 'Audio Polishing' }
          ].map((tool, idx) => (
            <div key={idx} className="bg-white/5 p-6 rounded-2xl border border-white/5 flex flex-col items-center text-center embossed-edge">
              <span className="text-xl font-black mb-2 font-graffiti text-diamond">{tool.name}</span>
              <span className="text-[10px] uppercase font-black text-white/40 mb-4 tracking-widest font-street">Impact: {tool.impact}</span>
              <p className="text-xs text-white/40 font-street">{tool.for}</p>
              <span className="mt-4 text-[10px] font-mono text-white/20 font-street">COST: {tool.cost}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Best Practices */}
      <div className="bg-transparent backdrop-blur-sm border border-white/10 p-8 rounded-3xl flex flex-col md:flex-row items-center gap-8 embossed-edge">
        <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center shrink-0 shadow-lg border border-white/20 embossed-edge">
          <svg className="w-8 h-8 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </div>
        <div>
          <h4 className="text-xl font-black mb-2 font-graffiti text-diamond">Algorithm Safety Note</h4>
          <p className="text-white/60 text-sm leading-relaxed font-street">
            AI is a lever, not a replacement. Always verify your master text overlay in the <span className="text-white font-bold font-graffiti">Prompt Engine</span> to ensure 100% human readability. The "Curiosity Gap" method works best when combined with authentic {state.branding.name} visual consistency.
          </p>
        </div>
      </div>
    </div>
  );
};

export default StrategyCenter;
