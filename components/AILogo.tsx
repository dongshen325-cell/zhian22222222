
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { BRAND_LOGO_PROMPT, LOGO_CACHE_KEY } from '../constants';
import { Loader2, Shield } from 'lucide-react';

interface AILogoProps {
  className?: string;
  size?: number;
  transparent?: boolean;
}

const AILogo: React.FC<AILogoProps> = ({ className, size = 64, transparent = true }) => {
  const [logoUrl, setLogoUrl] = useState<string | null>(localStorage.getItem(LOGO_CACHE_KEY));
  const [isLoading, setIsLoading] = useState(!logoUrl);

  useEffect(() => {
    if (logoUrl) return;

    const generateLogo = async () => {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash-image',
          contents: { parts: [{ text: BRAND_LOGO_PROMPT }] },
          config: { 
            imageConfig: { 
              aspectRatio: "1:1"
            } 
          }
        });

        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            const dataUrl = `data:image/png;base64,${part.inlineData.data}`;
            setLogoUrl(dataUrl);
            localStorage.setItem(LOGO_CACHE_KEY, dataUrl);
            break;
          }
        }
      } catch (err) {
        console.error("Logo Generation Failed:", err);
      } finally {
        setIsLoading(false);
      }
    };

    generateLogo();
  }, [logoUrl]);

  if (isLoading) {
    return (
      <div className={`${className} flex items-center justify-center bg-slate-900/5 rounded-2xl animate-pulse`} style={{ width: size, height: size }}>
        <Loader2 className="text-blue-500 animate-spin" size={size * 0.4} />
      </div>
    );
  }

  if (!logoUrl) {
    return (
      <div className={`${className} flex items-center justify-center bg-blue-600 rounded-2xl text-white`} style={{ width: size, height: size }}>
        <Shield size={size * 0.6} />
      </div>
    );
  }

  return (
    <div 
      className={`${className} overflow-hidden transition-transform duration-500 hover:scale-110 flex items-center justify-center`} 
      style={{ 
        width: size, 
        height: size,
      }}
    >
      <img 
        src={logoUrl} 
        alt="ZHIAN Branding" 
        className="w-full h-full object-contain"
        style={{ 
          mixBlendMode: transparent ? 'multiply' : 'normal',
          imageRendering: 'crisp-edges'
        }} 
      />
    </div>
  );
};

export default AILogo;
