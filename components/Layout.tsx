
import React from 'react';
import { View } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  currentView: View;
  onNavigate: (view: View) => void;
  isDevMode: boolean;
  onToggleDevMode: (val: boolean) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentView, onNavigate, isDevMode, onToggleDevMode }) => {
  const navItems = [
    { id: View.DASHBOARD, label: 'Control Center', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { id: View.GENERATOR, label: 'Meta Engine', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
    { id: View.REBRAND, label: 'Rebrand Studio', icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15' },
    { id: View.FORGE, label: 'Image Forge', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { id: View.DISCOVERY, label: 'Trend Lab', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' },
    { id: View.STRATEGY, label: 'Growth Strategy', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
    { id: View.EMBEDDING, label: 'Multimodal Lab', icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.183.394l-1.154.908a2.41 2.41 0 01-3.057 0l-1.154-.908a2 2 0 00-1.183-.394l-1.933.386a6 6 0 01-3.86-.517l-.318-.158a6 6 0 00-3.86-.517l-2.387.477a2 2 0 00-1.022.547l-1.16 1.16a2 2 0 01-2.828 0l-1.16-1.16a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.183.394l-1.154.908a2.41 2.41 0 01-3.057 0l-1.154-.908a2 2 0 00-1.183-.394l-1.933.386a6 6 0 01-3.86-.517l-.318-.158a6 6 0 00-3.86-.517l-2.387.477a2 2 0 00-1.022.547l-1.16 1.16a2 2 0 01-2.828 0l-1.16-1.16z' },
    { id: View.LEARNING, label: 'Intelligence', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18 18.246 18.477 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-[#050505] relative">
      {/* Global Stationary Background Image */}
      <div 
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `url('https://lh3.googleusercontent.com/d/1YOGV-_YPapqnfdli6Phf58o0__VtfMhq')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      />
      {/* Dark Overlay for contrast */}
      <div className="fixed inset-0 z-[1] bg-black/60 pointer-events-none backdrop-blur-[2px]" />

      <aside className="w-64 bg-transparent border-r border-white/10 hidden lg:flex flex-col relative z-20">
        <div className="p-6">
          <h1 className="text-2xl font-black tracking-tighter text-diamond font-graffiti text-dripping">
            ICONIC CLICK
          </h1>
          <p className="text-[10px] uppercase tracking-widest text-white/40 mt-1 font-street">Advanced SEO Nexus</p>
        </div>
        
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                currentView === item.id 
                  ? 'bg-white/10 text-white border border-white/10 shadow-lg shadow-white/10 backdrop-blur-sm' 
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
              </svg>
              <span className={currentView === item.id ? 'font-bold' : ''}>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 mt-auto space-y-4">
          <div className="flex items-center justify-between px-4 py-3 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 embossed-edge">
            <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Dev Mode</span>
            <button 
              onClick={() => onToggleDevMode(!isDevMode)}
              className={`w-10 h-5 rounded-full relative transition-colors duration-200 ${isDevMode ? 'bg-blue-600' : 'bg-white/10'}`}
            >
              <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all duration-200 ${isDevMode ? 'left-6' : 'left-1'}`}></div>
            </button>
          </div>

          <div className="bg-white/5 backdrop-blur-md p-4 rounded-xl border border-white/10 embossed-edge">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Core Status: Optimal</span>
            </div>
            <p className="text-xs text-white/30 mt-2">v4.0.0-pro-grounding</p>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto relative z-10 custom-scrollbar">
        {/* Content Overlay */}
        <div className="max-w-7xl mx-auto px-4 py-8 md:px-8">
          {children}
        </div>
        
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-black/20 backdrop-blur-2xl border-t border-white/10 flex justify-around p-2 z-50 overflow-x-auto scrollbar-hide">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center p-2 rounded-lg transition-colors min-w-[70px] ${
                currentView === item.id ? 'text-white font-bold' : 'text-white/40'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
              </svg>
              <span className="text-[9px] mt-1 font-medium whitespace-nowrap">{item.label}</span>
            </button>
          ))}
        </nav>
      </main>
    </div>
  );
};
