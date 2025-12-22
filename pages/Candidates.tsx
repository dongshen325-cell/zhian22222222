
import React, { useState, useEffect } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { TRANSLATIONS, HERO_GENERATION_PROMPT, HEROES_CACHE_KEY } from '../constants';
import { Language, Candidate } from '../types';
import { MapPin, Award, ThumbsUp, Quote, X, Calendar, FileText, Loader2, Sparkles, RefreshCcw, Search } from 'lucide-react';

const Candidates: React.FC<{ lang: Language }> = ({ lang }) => {
  const t = TRANSLATIONS[lang];
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedArchive, setSelectedArchive] = useState<Candidate | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchHeroes = async (force = false) => {
    setIsLoading(true);
    const cached = localStorage.getItem(HEROES_CACHE_KEY + '_' + lang);
    if (cached && !force) {
      setCandidates(JSON.parse(cached));
      setIsLoading(false);
      return;
    }

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: HERO_GENERATION_PROMPT(lang === 'zh' ? 'Chinese' : 'English'),
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.INTEGER },
                name: { type: Type.STRING },
                region: { type: Type.STRING },
                bio: { type: Type.STRING },
                achievement: { type: Type.STRING },
                votes: { type: Type.INTEGER },
                publishDate: { type: Type.STRING },
                sourceType: { type: Type.STRING },
                fullArchive: { type: Type.STRING }
              },
              required: ['id', 'name', 'region', 'bio', 'achievement', 'votes', 'publishDate', 'sourceType', 'fullArchive']
            }
          }
        }
      });

      const data = JSON.parse(response.text);
      // Inject images based on region keywords
      const enrichedData = data.map((c: Candidate, idx: number) => ({
        ...c,
        imageUrl: `https://images.unsplash.com/photo-${1500000000000 + idx}?q=80&w=800&auto=format&fit=crop&sig=${idx}` // Better strategy: use varied newsroom/portrait/region photos
      }));
      
      // Override with more thematic placeholder images
      const themes = ['investigation', 'newsroom', 'camera', 'newspaper', 'portrait', 'world'];
      const themedEnrichedData = enrichedData.map((c: Candidate, i: number) => ({
        ...c,
        imageUrl: `https://source.unsplash.com/featured/800x1000? journalist,${themes[i % themes.length]},${c.region.split(' ')[0]}`
      }));

      setCandidates(themedEnrichedData);
      localStorage.setItem(HEROES_CACHE_KEY + '_' + lang, JSON.stringify(themedEnrichedData));
    } catch (err) {
      console.error("Hero generation failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHeroes();
  }, [lang]);

  const handleVote = (id: number) => {
    setCandidates(prev => {
      const updated = prev.map(c => c.id === id ? { ...c, votes: c.votes + 1 } : c);
      localStorage.setItem(HEROES_CACHE_KEY + '_' + lang, JSON.stringify(updated));
      return updated;
    });
  };

  const filteredCandidates = candidates.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.region.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-slate-50 min-h-screen py-16 md:py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 md:mb-24 relative">
          <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-black mb-6 uppercase tracking-widest animate-fade-in">
            <Award size={16} /> {t.candidateBadge}
          </div>
          <h1 className="text-5xl md:text-8xl font-black text-slate-900 mb-6 serif-font tracking-tight leading-none animate-fade-in">
            {t.navCandidates}
          </h1>
          <p className="text-slate-500 text-lg md:text-xl max-w-3xl mx-auto font-medium leading-relaxed mb-12 animate-fade-in" style={{ animationDelay: '100ms' }}>
            {t.candidateSub}
          </p>

          <div className="max-w-xl mx-auto flex gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="text"
                placeholder={lang === 'zh' ? "搜索英雄或地区..." : "Search heroes or regions..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500 transition-all font-medium outline-none"
              />
            </div>
            <button 
              onClick={() => fetchHeroes(true)}
              className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm hover:bg-slate-50 transition-all text-slate-500"
              title="Refresh Archives"
            >
              <RefreshCcw size={24} className={isLoading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-40 space-y-8">
             <div className="relative">
                <Loader2 size={80} className="text-blue-500 animate-spin opacity-40" />
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="w-12 h-12 bg-blue-600/10 rounded-full animate-ping"></div>
                </div>
             </div>
             <div className="text-center">
                <p className="text-2xl font-black text-slate-900 serif-font italic opacity-60 tracking-tight">{t.gameAiGenerating}</p>
                <div className="flex justify-center gap-1.5 mt-4">
                   <div className="w-1.5 h-1.5 rounded-full bg-blue-600/20 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                   <div className="w-1.5 h-1.5 rounded-full bg-blue-600/20 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                   <div className="w-1.5 h-1.5 rounded-full bg-blue-600/20 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
             </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {filteredCandidates.map((candidate, idx) => (
              <div 
                key={candidate.id} 
                className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border border-slate-100 flex flex-col group animate-fade-in"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={candidate.imageUrl} 
                    alt={candidate.name} 
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-110 group-hover:scale-100" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-60"></div>
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur text-blue-600 rounded-lg text-[10px] font-black flex items-center gap-1.5 shadow-lg uppercase tracking-wider">
                      <MapPin size={12} /> {candidate.region}
                    </span>
                  </div>
                </div>

                <div className="p-8 flex-grow flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                     <h3 className="text-2xl font-black text-slate-900 serif-font leading-tight">{candidate.name}</h3>
                     <div className="bg-slate-50 px-3 py-1 rounded-lg flex items-center gap-2 border border-slate-100">
                        <ThumbsUp size={14} className="text-blue-600" />
                        <span className="font-black text-xs">{candidate.votes.toLocaleString()}</span>
                     </div>
                  </div>

                  <p className="text-slate-500 text-xs font-bold leading-relaxed mb-6 line-clamp-3">
                    {candidate.bio}
                  </p>

                  <div className="mt-auto pt-6 border-t border-slate-50 flex gap-3">
                    <button 
                      onClick={() => setSelectedArchive(candidate)} 
                      className="flex-1 px-4 py-3 bg-slate-900 text-white rounded-xl font-black text-xs hover:bg-blue-600 transition-all flex items-center justify-center gap-2"
                    >
                      <FileText size={16} /> {t.viewDetails}
                    </button>
                    <button 
                      onClick={() => handleVote(candidate.id)} 
                      className="px-4 py-3 bg-white border border-slate-100 text-slate-400 hover:text-blue-600 hover:border-blue-100 rounded-xl transition-all"
                    >
                      <ThumbsUp size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Archive Detail Modal */}
      {selectedArchive && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-10 bg-slate-950/90 backdrop-blur-2xl animate-fade-in">
          <div className="bg-white w-full max-w-5xl max-h-[90vh] rounded-[3rem] shadow-4xl relative overflow-hidden flex flex-col border border-white/20">
            {/* Header */}
            <div className="p-6 md:p-10 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
               <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-xl group-hover:rotate-6 transition-transform">
                    <FileText size={32} />
                  </div>
                  <div>
                     <h2 className="text-2xl md:text-3xl font-black text-slate-900 serif-font tracking-tight">{selectedArchive.name}</h2>
                     <div className="flex flex-wrap items-center gap-4 mt-2">
                        <span className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest"><Calendar size={12} /> {selectedArchive.publishDate}</span>
                        <span className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest"><Award size={12} /> {selectedArchive.sourceType}</span>
                        <span className="flex items-center gap-1.5 text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase tracking-widest"><MapPin size={12} /> {selectedArchive.region}</span>
                     </div>
                  </div>
               </div>
               <button onClick={() => setSelectedArchive(null)} className="p-3 bg-slate-100 hover:bg-red-50 text-slate-400 hover:text-red-600 transition-all rounded-2xl">
                <X size={28} />
               </button>
            </div>

            {/* Content Body */}
            <div className="p-8 md:p-16 overflow-y-auto scrollbar-hide flex-grow bg-slate-50/50">
               <div className="max-w-3xl mx-auto">
                  <div className="mb-12 relative">
                    <Quote size={48} className="absolute -top-8 -left-8 text-blue-100 opacity-50" />
                    <p className="text-2xl md:text-3xl font-bold text-slate-800 italic leading-snug relative z-10 serif-font">
                      “{selectedArchive.achievement}”
                    </p>
                  </div>

                  <div className="prose-archive prose-slate">
                    {selectedArchive.fullArchive.split('\n').map((line, i) => {
                      if (line.startsWith('### ')) return <h3 key={i} className="text-3xl font-black text-slate-900 mt-12 mb-6 serif-font border-l-8 border-blue-600 pl-6 uppercase tracking-tighter">{line.replace('### ', '')}</h3>;
                      if (line.trim() === '') return <div key={i} className="h-4"></div>;
                      return <p key={i} className="text-lg text-slate-600 mb-6 leading-[1.8] font-medium">{line}</p>;
                    })}
                  </div>

                  <div className="mt-20 pt-10 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-4 bg-green-50 px-6 py-4 rounded-2xl border border-green-100">
                       <div className="w-10 h-10 bg-green-600 text-white rounded-xl flex items-center justify-center shadow-lg"><Award size={20} /></div>
                       <div>
                         <p className="text-xs font-black text-green-800 uppercase tracking-widest leading-none">{t.archiveVerified}</p>
                         <p className="text-[10px] text-green-600 font-bold uppercase tracking-widest mt-1">Immutable Web3 Record</p>
                       </div>
                    </div>
                    <button 
                      onClick={() => setSelectedArchive(null)} 
                      className="w-full md:w-auto px-12 py-5 bg-slate-900 text-white rounded-2xl font-black text-lg shadow-xl hover:bg-blue-600 transition-all active:scale-95"
                    >
                      {t.closeArchive}
                    </button>
                  </div>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Candidates;
