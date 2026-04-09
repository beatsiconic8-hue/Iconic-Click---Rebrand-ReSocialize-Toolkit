
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { ThumbnailPrompt, TrendData, RebrandResults, Platform, AspectRatio } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const THUMBNAIL_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    conceptName: { type: Type.STRING },
    visualDescription: { type: Type.STRING, description: "Detailed AI image generation prompt for the background and main subjects." },
    textOverlay: { type: Type.STRING, description: "Highly legible text to be placed on the thumbnail." },
    compositionNotes: { type: Type.STRING, description: "Notes on framing, lighting, and focal points for mobile visibility." },
    psychologicalTrigger: { type: Type.STRING, description: "The specific emotion or curiosity gap being exploited." },
    ctrRating: { type: Type.NUMBER, description: "Estimated click potential from 1-100." },
    tags: { type: Type.ARRAY, items: { type: Type.STRING } }
  },
  required: ["conceptName", "visualDescription", "textOverlay", "compositionNotes", "psychologicalTrigger", "ctrRating", "tags"]
};

const REBRAND_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING },
    description: { type: Type.STRING, description: "Full SEO-primed description. DO NOT include the timestamps here as they are in the 'timestamps' field." },
    hashtagBlock: { type: Type.STRING, description: "Hashtags formatted as [#tag][#tag]" },
    keywordBlock: { type: Type.STRING, description: "Keywords formatted as [keyword, keyword], under 500 chars total." },
    pinnedComment: { type: Type.STRING },
    timestamps: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          time: { type: Type.STRING, description: "Format like 0:00, 1:24, etc." },
          label: { type: Type.STRING, description: "The title of the segment or chapter." }
        },
        required: ["time", "label"]
      }
    },
    thumbnailPrompts: {
      type: Type.ARRAY,
      items: THUMBNAIL_SCHEMA
    }
  },
  required: ["title", "description", "hashtagBlock", "keywordBlock", "pinnedComment", "timestamps", "thumbnailPrompts"]
};

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

async function callWithRetry<T>(fn: () => Promise<T>, maxRetries = 3): Promise<T> {
  let lastError: any;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      const status = error?.status || error?.error?.status;
      const message = error?.message || error?.error?.message || "";
      
      if (status === 429 || message.includes("quota") || message.includes("429")) {
        const waitTime = Math.pow(2, i) * 2000;
        console.warn(`Quota exceeded. Retrying in ${waitTime}ms...`);
        await delay(waitTime);
        continue;
      }
      throw error;
    }
  }
  throw lastError;
}

export const generateThumbnailPrompts = async (
  title: string, 
  niche: string, 
  audience: string, 
  platform: Platform,
  context: string[] = [],
  isDevMode: boolean = false
): Promise<ThumbnailPrompt[]> => {
  if (isDevMode) {
    await delay(1000);
    return [
      {
        id: Math.random().toString(36).substr(2, 9),
        conceptName: "Mock Concept: The Secret Sauce",
        visualDescription: "A high-contrast close-up of a producer's hands on a MIDI controller with glowing neon lights.",
        textOverlay: "THE SECRET SAUCE",
        compositionNotes: "Rule of thirds, shallow depth of field.",
        psychologicalTrigger: "Curiosity / Scarcity",
        ctrRating: 92,
        tags: ["production", "secret", "tutorial"],
        createdAt: new Date().toISOString()
      },
      {
        id: Math.random().toString(36).substr(2, 9),
        conceptName: "Mock Concept: Why You Fail",
        visualDescription: "A split screen showing a frustrated producer vs a successful one with a massive gold plaque.",
        textOverlay: "WHY YOU FAIL",
        compositionNotes: "Symmetrical balance, bright colors on the right.",
        psychologicalTrigger: "Fear of Failure / Aspiration",
        ctrRating: 88,
        tags: ["motivation", "success", "mistakes"],
        createdAt: new Date().toISOString()
      }
    ];
  }
  const systemInstruction = `
    You are an Elite SEO & Meta-Data Engineer specializing in ${platform}.
    Your goal is to generate 3 distinct asset concepts optimized for high engagement based on REAL-TIME trending data.
    
    EVOLUTIONARY KNOWLEDGE BASE (Use these insights):
    ${context.length > 0 ? context.join(". ") : "No prior evolutionary data. Research fresh trends."}
    
    MISSION:
    1. Use the search tool to identify CURRENT visual trends, trending keywords, and high-performance psychological triggers for the ${niche} niche on ${platform}.
    2. Synthesize these trends with the provided Evolutionary Knowledge Base.
    3. Generate 3 thumbnail concepts that are mathematically primed for high CTR.
  `;

  return callWithRetry(async () => {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Perform a real-time audit of ${platform} trends for the topic "${title}" in the ${niche} niche. Then, create 3 SEO-primed thumbnail concepts targeting ${audience}.`,
      config: {
        systemInstruction,
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: { type: Type.ARRAY, items: THUMBNAIL_SCHEMA }
      }
    });
    const results = JSON.parse(response.text || "[]");
    return results.map((item: any) => ({
      ...item,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    }));
  });
};

export const rebrandVideo = async (url: string, niche: string, context: string[] = [], isDevMode: boolean = false): Promise<RebrandResults> => {
  if (isDevMode) {
    await delay(1500);
    return {
      title: "REBRANDED: How to Master Music Production in 2024",
      description: "This is a mock description optimized for SEO. We researched the video at " + url + " and found it's about " + niche + ".",
      hashtagBlock: "#MusicProduction #Beatmaking #IconicBeats",
      keywordBlock: "music production, beatmaking, fl studio, ableton, iconic beats, music tutorial, producer life, studio setup",
      pinnedComment: "Thanks for watching! Check out the free guide in the description.",
      timestamps: [
        { time: "0:00", label: "Introduction" },
        { time: "2:15", label: "The Core Secret" },
        { time: "5:45", label: "Final Results" }
      ],
      thumbnailPrompts: [
        {
          id: "mock-1",
          conceptName: "Mock Rebrand Concept",
          visualDescription: "Professional studio background with neon accents.",
          textOverlay: "MASTERED",
          compositionNotes: "Center focus.",
          psychologicalTrigger: "Authority",
          ctrRating: 95,
          tags: ["rebrand", "pro"],
          createdAt: new Date().toISOString()
        }
      ]
    };
  }
  const systemInstruction = `
    You are the "Iconic Rebrand Nexus" - the world's most powerful AI for video optimization.
    
    STRATEGIC CONTEXT (Adopted Trends):
    ${context.join(". ")}

    REBRAND PROTOCOL:
    1. USE GOOGLE SEARCH to research the exact video content at URL: "${url}". 
    2. FIND THE TRANSCRIPT or EXISTING CHAPTERS to extract accurate timestamps. If multiple audio tracks or segments exist, ensure they are all accounted for.
    3. IDENTIFY specific high-value keywords and visual cues that are currently driving views in the ${niche} niche.
    4. RE-OPTIMIZE the metadata with razor-sharp accuracy.
    
    CONSTRAINTS:
    - Title: High curiosity gap, SEO-weighted.
    - Timestamps: Extract a detailed list (e.g., 0:00 - Intro, 2:30 - Main Content, etc.).
    - Hashtags: Exactly [#tag][#tag] format.
    - Keywords: Exactly [keyword, keyword] format. Total character count MUST be between 450 and 500.
    - Thumbnail Prompts: Incorporate the latest visual cues.
  `;

  const prompt = `Perform a total Brand Re-Optimization for the video at this URL: ${url}. 
  The niche is ${niche}. 
  Crucial: Identify all segment transitions and provide a full timestamp breakdown for the description. 
  Synthesize your findings with the strategic context to provide the ultimate SEO metadata block and 3 thumbnail forge prompts.`;

  return callWithRetry(async () => {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        systemInstruction,
        thinkingConfig: { thinkingBudget: 32768 },
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: REBRAND_SCHEMA
      }
    });
    return JSON.parse(response.text || "{}");
  });
};

export const generateImage = async (prompt: string, size: "1K" | "2K" | "4K", aspectRatio: AspectRatio = "16:9", isDevMode: boolean = false): Promise<string> => {
  if (isDevMode) {
    await delay(2000);
    const [w, h] = aspectRatio.split(':').map(Number);
    const width = 1024;
    const height = Math.round((width * h) / w);
    return `https://picsum.photos/seed/${encodeURIComponent(prompt)}/${width}/${height}`;
  }

  return callWithRetry(async () => {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: { parts: [{ text: prompt }] },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio,
          imageSize: size
        }
      },
    });
    
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image generated");
  });
};

export const editImage = async (base64Image: string, editPrompt: string, isDevMode: boolean = false): Promise<string> => {
  if (isDevMode) {
    await delay(1500);
    return base64Image;
  }
  return callWithRetry(async () => {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { inlineData: { data: base64Image.split(',')[1], mimeType: 'image/png' } },
          { text: editPrompt }
        ]
      }
    });
    
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("Image edit failed");
  });
};

export const researchTrends = async (niche: string, isDevMode: boolean = false): Promise<TrendData[]> => {
  if (isDevMode) {
    await delay(1200);
    return [
      {
        topic: "Lo-fi Aesthetic",
        momentum: "rising",
        visualStyle: "Grainy, nostalgic, pastel colors",
        visualCues: ["VHS overlay", "Anime-style characters", "Soft lighting"],
        keywords: ["lofi", "chill", "study beats"]
      },
      {
        topic: "Extreme Expressions",
        momentum: "peaked",
        visualStyle: "High contrast, saturated colors",
        visualCues: ["Shocked face", "Bright arrows", "Red circles"],
        keywords: ["omg", "unbelievable", "secret"]
      }
    ];
  }
  return callWithRetry(async () => {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Search for high-performance visual trends and SEO metadata shifts in the ${niche} niche as of today.`,
      config: { tools: [{ googleSearch: {} }] }
    });

    const structuredResponse = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Based on: "${response.text}", extract 5 granular trending patterns.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              topic: { type: Type.STRING },
              momentum: { type: Type.STRING, enum: ['rising', 'peaked', 'fading'] },
              visualStyle: { type: Type.STRING },
              visualCues: { type: Type.ARRAY, items: { type: Type.STRING } },
              keywords: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["topic", "momentum", "visualStyle", "visualCues", "keywords"]
          }
        }
      }
    });
    return JSON.parse(structuredResponse.text || "[]");
  });
};
