
import React, { useState } from 'react';
import { AppState, AspectRatio } from '../types';
import { generateImage, editImage } from '../services/geminiService';

const ImageForge: React.FC<{ state: AppState }> = ({ state }) => {
  const [prompt, setPrompt] = useState('');
  const [size, setSize] = useState<"1K" | "2K" | "4K">("1K");
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("16:9");
  const [genLoading, setGenLoading] = useState(false);
  const [generatedImg, setGeneratedImg] = useState<string | null>(null);
  
  const [editPrompt, setEditPrompt] = useState('');
  const [editLoading, setEditLoading] = useState(false);
  const [sourceImg, setSourceImg] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt) return;
    setGenLoading(true);
    try {
      const url = await generateImage(prompt, size, aspectRatio, state.isDevMode);
      setGeneratedImg(url);
    } catch (e) {
      alert("Forge cooling down. Try smaller size.");
    } finally {
      setGenLoading(false);
    }
  };

  const handleEdit = async () => {
    if (!sourceImg || !editPrompt) return;
    setEditLoading(true);
    try {
      const url = await editImage(sourceImg, editPrompt, state.isDevMode);
      setGeneratedImg(url);
    } catch (e) {
      alert("Editing failed. Check image format.");
    } finally {
      setEditLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setSourceImg(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-12 pb-24 animate-in fade-in duration-700">
      <header>
        <h2 className="text-4xl font-black text-diamond font-graffiti text-dripping tracking-tight">Image Forge</h2>
        <p className="text-white/40 mt-2 font-street">Nano Banana Pro image generation and real-time canvas editing.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Generation */}
        <section className="bg-transparent backdrop-blur-sm border border-white/10 p-8 rounded-3xl space-y-6 embossed-edge">
          <h3 className="text-xl font-black flex items-center gap-2 font-graffiti text-diamond">
            <svg className="w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
            Creation Engine (Pro)
          </h3>
          <div className="space-y-4">
            <textarea 
              placeholder="A professional studio setup with @iconicbeatsla neon signage..." 
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 min-h-[120px] font-street text-white focus:ring-1 focus:ring-white/20 outline-none"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest w-full mb-1 font-street">Aspect Ratio</span>
                {(["16:9", "9:16", "1:1", "4:3", "3:4", "4:1", "1:4"] as AspectRatio[]).map(ar => (
                  <button 
                    key={ar} 
                    onClick={() => setAspectRatio(ar)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all border font-street ${aspectRatio === ar ? 'bg-white/20 text-white border-white/40' : 'bg-white/5 text-white/40 border-white/5'}`}
                  >
                    {ar}
                  </button>
                ))}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  {(["1K", "2K", "4K"] as const).map(s => (
                    <button 
                      key={s} 
                      onClick={() => setSize(s)}
                      className={`px-4 py-2 rounded-lg text-xs font-black transition-all font-street ${size === s ? 'bg-white/20 text-white border border-white/40' : 'bg-white/5 text-white/40 border border-white/5'}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                <button 
                  onClick={handleGenerate}
                  disabled={genLoading}
                  className="bg-white/10 hover:bg-white/20 px-6 py-3 rounded-xl font-black text-sm border border-white/20 font-graffiti embossed-edge text-white tracking-widest"
                >
                  {genLoading ? "Forging..." : `Generate ${aspectRatio}`}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Editing */}
        <section className="bg-transparent backdrop-blur-sm border border-white/10 p-8 rounded-3xl space-y-6 embossed-edge">
          <h3 className="text-xl font-black flex items-center gap-2 font-graffiti text-diamond">
            <svg className="w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
            Nano Canvas Editor
          </h3>
          <div className="space-y-4">
            <input type="file" onChange={handleFileUpload} className="block w-full text-xs text-white/40 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-black file:bg-white/10 file:text-white hover:file:bg-white/20 font-street" />
            <input 
              type="text" 
              placeholder='e.g., "Add a retro film grain" or "Remove the mic stand"' 
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm font-street text-white focus:ring-1 focus:ring-white/20 outline-none"
              value={editPrompt}
              onChange={(e) => setEditPrompt(e.target.value)}
            />
            <button 
              onClick={handleEdit}
              disabled={editLoading || !sourceImg}
              className="w-full bg-white/10 hover:bg-white/20 disabled:bg-white/5 py-3 rounded-xl font-black text-sm border border-white/20 font-graffiti embossed-edge text-white tracking-widest"
            >
              {editLoading ? "Modifying..." : "Apply AI Transformation"}
            </button>
          </div>
        </section>
      </div>

      {/* Output Display */}
      {(generatedImg || sourceImg) && (
        <section className="mt-12 bg-transparent backdrop-blur-sm border border-white/10 p-8 rounded-3xl overflow-hidden embossed-edge">
          <div className="flex flex-col md:flex-row gap-8 items-start">
             {sourceImg && (
               <div className="flex-1 space-y-2">
                 <span className="text-[10px] font-black uppercase text-white/20 font-street">Source Material</span>
                 <img src={sourceImg} alt="Source" className="w-full rounded-2xl border border-white/10 embossed-edge" />
               </div>
             )}
             {generatedImg && (
               <div className="flex-1 space-y-2">
                 <span className="text-[10px] font-black uppercase text-diamond font-graffiti">Forged Output</span>
                 <img src={generatedImg} alt="Generated" className="w-full rounded-2xl border border-white/20 embossed-edge" />
                 <a href={generatedImg} download="forged_asset.png" className="block text-center py-3 bg-white/10 rounded-xl text-xs font-black hover:bg-white/20 transition-colors font-graffiti border border-white/20 embossed-edge text-white tracking-widest">Download Asset</a>
               </div>
             )}
          </div>
        </section>
      )}
    </div>
  );
};

export default ImageForge;
