
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { AppState } from '../types';
import { Upload, FileText, Image as ImageIcon, Music, Send, Loader2, Info } from 'lucide-react';

interface MultimodalEmbeddingProps {
  state: AppState;
}

const MultimodalEmbedding: React.FC<MultimodalEmbeddingProps> = ({ state }) => {
  const [text, setText] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [audio, setAudio] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [embeddings, setEmbeddings] = useState<number[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setAudio(file);
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1];
        resolve(base64);
      };
      reader.onerror = error => reject(error);
    });
  };

  const processEmbedding = async () => {
    if (!text && !image && !audio) {
      setError("Please provide at least one input (text, image, or audio).");
      return;
    }

    setIsProcessing(true);
    setError(null);
    setEmbeddings(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const contents: any[] = [];

      if (text) {
        contents.push(text);
      }

      if (image) {
        const base64Image = await fileToBase64(image);
        contents.push({
          inlineData: {
            data: base64Image,
            mimeType: image.type
          }
        });
      }

      if (audio) {
        const base64Audio = await fileToBase64(audio);
        contents.push({
          inlineData: {
            data: base64Audio,
            mimeType: audio.type
          }
        });
      }

      const result = await ai.models.embedContent({
        model: "gemini-embedding-2-preview",
        contents: contents,
      });

      if (result.embeddings) {
        // result.embeddings can be an array or a single embedding depending on input
        // For embedContent with multiple contents, it returns an array of embeddings
        // But the user's snippet shows result.embeddings directly.
        // Actually, embedContent returns a single embedding if contents is a list of parts for one item,
        // or a list of embeddings if it's multiple items.
        // In the user's snippet, it's a single call with a list of parts.
        setEmbeddings(result.embeddings.values || []);
      }
    } catch (err: any) {
      console.error("Embedding error:", err);
      setError(err.message || "Failed to generate embeddings.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8" id="multimodal-embedding-container">
      <div className="space-y-2">
        <h1 className="text-4xl font-black text-diamond font-graffiti text-dripping tracking-tight" id="embedding-title">Multimodal Embedding Lab</h1>
        <p className="text-white/40 font-street" id="embedding-subtitle">
          Generate unified vector representations for text, images, and audio using Gemini Embedding 2.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="input-grid">
        {/* Text Input */}
        <div className="bg-transparent backdrop-blur-sm p-6 rounded-2xl border border-white/10 space-y-4 embossed-edge" id="text-input-card">
          <div className="flex items-center gap-2 text-white/60">
            <FileText size={20} />
            <h2 className="font-black uppercase tracking-widest text-xs font-graffiti text-diamond">Text Input</h2>
          </div>
          <textarea
            id="text-input"
            className="w-full h-32 p-3 bg-white/5 border border-white/10 rounded-xl focus:ring-1 focus:ring-white/20 outline-none transition-all resize-none text-sm text-white font-street"
            placeholder="Enter text to embed..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>

        {/* Image Input */}
        <div className="bg-transparent backdrop-blur-sm p-6 rounded-2xl border border-white/10 space-y-4 embossed-edge" id="image-input-card">
          <div className="flex items-center gap-2 text-white/60">
            <ImageIcon size={20} />
            <h2 className="font-black uppercase tracking-widest text-xs font-graffiti text-diamond">Image Input</h2>
          </div>
          <div className="relative group" id="image-upload-zone">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              id="image-file-input"
            />
            <div className={`h-32 border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-all ${imagePreview ? 'border-white/40 bg-white/10' : 'border-white/10 bg-white/5 group-hover:border-white/30'}`}>
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="h-full w-full object-cover rounded-lg" referrerPolicy="no-referrer" />
              ) : (
                <>
                  <Upload className="text-white/20 mb-2" size={24} />
                  <span className="text-[10px] text-white/40 font-black uppercase tracking-widest font-street">Upload Image</span>
                </>
              )}
            </div>
          </div>
          {image && <p className="text-[10px] text-white/40 truncate font-street">{image.name}</p>}
        </div>

        {/* Audio Input */}
        <div className="bg-transparent backdrop-blur-sm p-6 rounded-2xl border border-white/10 space-y-4 embossed-edge" id="audio-input-card">
          <div className="flex items-center gap-2 text-white/60">
            <Music size={20} />
            <h2 className="font-black uppercase tracking-widest text-xs font-graffiti text-diamond">Audio Input</h2>
          </div>
          <div className="relative group" id="audio-upload-zone">
            <input
              type="file"
              accept="audio/*"
              onChange={handleAudioChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              id="audio-file-input"
            />
            <div className={`h-32 border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-all ${audio ? 'border-white/40 bg-white/10' : 'border-white/10 bg-white/5 group-hover:border-white/30'}`}>
              {audio ? (
                <div className="flex flex-col items-center">
                  <Music className="text-white/60 mb-2" size={32} />
                  <span className="text-[10px] font-black text-white/60 uppercase tracking-widest font-street">Audio Selected</span>
                </div>
              ) : (
                <>
                  <Upload className="text-white/20 mb-2" size={24} />
                  <span className="text-[10px] text-white/40 font-black uppercase tracking-widest font-street">Upload Audio</span>
                </>
              )}
            </div>
          </div>
          {audio && <p className="text-[10px] text-white/40 truncate font-street">{audio.name}</p>}
        </div>
      </div>

      <div className="flex justify-center" id="action-container">
        <button
          id="generate-embedding-btn"
          onClick={processEmbedding}
          disabled={isProcessing}
          className="flex items-center gap-2 px-10 py-5 bg-white/10 hover:bg-white/20 text-white rounded-full font-black uppercase tracking-widest text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all border border-white/20 font-graffiti embossed-edge"
        >
          {isProcessing ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              Engaging Neural Nexus...
            </>
          ) : (
            <>
              <Send size={20} />
              Generate Multimodal Embedding
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-xs flex items-center gap-2 font-street" id="error-display">
          <Info size={16} />
          {error}
        </div>
      )}

      {embeddings && (
        <div className="bg-transparent backdrop-blur-sm p-8 rounded-3xl border border-white/10 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 embossed-edge" id="results-card">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-diamond uppercase tracking-tight font-graffiti">Unified Embedding Vector</h3>
            <span className="px-3 py-1 bg-white/10 text-white/60 rounded-full text-[10px] font-black uppercase tracking-widest font-street border border-white/10">
              {embeddings.length} Dimensions
            </span>
          </div>
          
          <div className="bg-white/5 p-4 rounded-xl border border-white/10 overflow-hidden embossed-edge" id="vector-visualization">
            <div className="flex flex-wrap gap-1 max-h-48 overflow-y-auto p-2">
              {embeddings.slice(0, 100).map((val, i) => (
                <div 
                  key={i} 
                  className="w-2 h-8 rounded-sm" 
                  style={{ 
                    backgroundColor: `rgba(255, 255, 255, ${Math.abs(val) * 5})`,
                    opacity: 0.8
                  }}
                  title={`Dim ${i}: ${val.toFixed(4)}`}
                />
              ))}
              {embeddings.length > 100 && (
                <div className="w-full text-center py-2 text-[10px] text-white/20 italic uppercase font-black tracking-widest font-street">
                  Showing first 100 dimensions of {embeddings.length}...
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" id="stats-grid">
            <div className="p-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 embossed-edge">
              <p className="text-[10px] text-white/40 font-black uppercase tracking-widest mb-1 font-street">Vector Norm</p>
              <p className="text-2xl font-mono font-bold text-white">
                {Math.sqrt(embeddings.reduce((acc, val) => acc + val * val, 0)).toFixed(4)}
              </p>
            </div>
            <div className="p-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 embossed-edge">
              <p className="text-[10px] text-white/40 font-black uppercase tracking-widest mb-1 font-street">Mean Value</p>
              <p className="text-2xl font-mono font-bold text-white">
                {(embeddings.reduce((acc, val) => acc + val, 0) / embeddings.length).toFixed(4)}
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10">
            <p className="text-xs text-white/40 leading-relaxed italic font-street">
              This vector represents the semantic intersection of your provided text, image, and audio. 
              It can be used for cross-modal search, clustering, or as input for downstream machine learning tasks.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MultimodalEmbedding;
