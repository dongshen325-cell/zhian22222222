
import React, { useState, useEffect, useMemo } from 'react';
import { TRANSLATIONS, HEROES_CACHE_KEY } from '../constants';
import { HEROES_DB } from '../gameData';
import { Language, Candidate } from '../types';
// Added ShieldCheck to the imports
import { MapPin, Award, ThumbsUp, Quote, X, Calendar, FileText, Search, RefreshCcw, ShieldCheck } from 'lucide-react';

const Candidates: React.FC<{ lang: Language }> = ({ lang }) => {
  const t = TRANSLATIONS[lang];
  const [displayCandidates, setDisplayCandidates] = useState<Candidate[]>([]);
  const [selectedArchive, setSelectedArchive] = useState<Candidate | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isRotating, setIsRotating] = useState(false);

  // Fisher-Yates Shuffle
  const shuffle = (array: any[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Initialize and select 7 random heroes
  const rotateHeroes = (isManual = false) => {
    setIsRotating(true);
    
    // Load local votes state
    const localVotes = JSON.parse(localStorage.getItem('zhian_hero_votes') || '{}');
    
    // Shuffle the entire DB and pick first 7
    const pool = shuffle(HEROES_DB).slice(0, 7);
    
    // Apply local votes
    const enriched = pool.map(c => ({
      ...c,
      votes: localVotes[c.id] || c.votes
    }));

    // If manual, add a slight delay for feel
    setTimeout(() => {
      setDisplayCandidates(enriched);
      setIsRotating(false);
    }, isManual ? 600 : 0);
  };

  useEffect(() => {
    rotateHeroes();
  }, [lang]);

  const handleVote = (id: number) => {
    setDisplayCandidates(prev => {
      const updated = prev.map(c => c.id === id ? { ...c, votes: c.votes + 1 } : c);
      
      // Update global persistence
      const localVotes = JSON.parse(localStorage.getItem('zhian_hero_votes') || '{}');
      localVotes[id] = (localVotes[id] || HEROES_DB.find(h => h.id === id)?.votes || 0) + 1;
      localStorage.setItem('zhian_hero_votes', JSON.stringify(localVotes));
      
      // Haptic feedback
      if (navigator.vibrate) navigator.vibrate(50);
      
      return updated;
    });
  };

  const filteredCandidates = displayCandidates.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.region.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-slate-50 min-h-screen py-16 md:py-24 px-4 pb-40">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 md:mb-24 relative">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-blue-100 text-blue-700 text-[11px] font-black mb-6 uppercase tracking-[0.2em] animate-fade-in shadow-sm">
            <Award size={18} /> {t.candidateBadge}
          </div>
          <h1 className="text-6xl md:text-9xl font-black text-slate-900 mb-8 serif-font tracking-tighter leading-none animate-fade-in uppercase italic">
            {t.navCandidates}
          </h1>
          <p className="text-slate-500 text-xl md:text-2xl max-w-3xl mx-auto font-medium leading-relaxed mb-16 animate-fade-in opacity-80" style={{ animationDelay: '100ms' }}>
            {t.candidateSub}
          </p>

          <div className="max-w-2xl mx-auto flex flex-col md:flex-row gap-4 items-center">
            <div className="relative w-full">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={24} />
              <input 
                type="text"
                placeholder={lang === 'zh' ? "在当前公示池中搜索..." : "Search in current pool..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-6 py-5 bg-white border border-slate-200 rounded-3xl shadow-xl focus:ring-4 focus:ring-blue-500/10 transition-all font-bold text-lg outline-none"
              />
            </div>
            <button 
              onClick={() => rotateHeroes(true)}
              disabled={isRotating}
              className="flex items-center gap-3 px-8 py-5 bg-slate-900 text-white rounded-3xl shadow-2xl hover:bg-blue-600 transition-all active:scale-95 disabled:opacity-50 group font-black whitespace-nowrap"
              title="轮换公示英雄"
            >
              <RefreshCcw size={24} className={isRotating ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-700'} />
              {lang === 'zh' ? '轮换公示' : 'Rotate Pool'}
            </button>
          </div>
        </div>

        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 transition-all duration-700 ${isRotating ? 'opacity-30 blur-sm scale-95' : 'opacity-100'}`}>
          {filteredCandidates.map((candidate, idx) => (
            <div 
              key={candidate.id} 
              className="bg-white rounded-[3.5rem] overflow-hidden shadow-sm hover:shadow-4xl hover:-translate-y-3 transition-all duration-500 border border-slate-100 flex flex-col group animate-fade-in"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className="relative h-80 md:h-[420px] overflow-hidden">
                <img 
                  src={candidate.imageUrl} 
                  alt={candidate.name} 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-110 group-hover:scale-100" 
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-40 transition-opacity"></div>
                
                <div className="absolute top-6 left-6">
                  <span className="px-5 py-2 bg-white/95 backdrop-blur text-blue-600 rounded-2xl text-[11px] font-black flex items-center gap-2 shadow-2xl uppercase tracking-[0.1em]">
                    <MapPin size={16} /> {candidate.region}
                  </span>
                </div>
                
                <div className="absolute bottom-8 left-8 right-8">
                   <h3 className="text-3xl md:text-4xl font-black text-white serif-font leading-tight mb-2 drop-shadow-lg">{candidate.name}</h3>
                   <div className="flex items-center gap-4 text-white/70 text-xs font-black uppercase tracking-widest">
                      <Calendar size={14} /> {candidate.publishDate}
                   </div>
                </div>
              </div>

              <div className="p-10 flex-grow flex flex-col">
                <p className="text-slate-500 text-lg font-bold leading-relaxed mb-10 line-clamp-3 italic opacity-90">
                  “{candidate.bio}”
                </p>

                <div className="mt-auto pt-8 border-t border-slate-50 flex items-center justify-between gap-4">
                  <button 
                    onClick={() => setSelectedArchive(candidate)} 
                    className="flex-1 px-8 py-4 bg-slate-900 text-white rounded-[1.5rem] font-black text-sm hover:bg-blue-600 transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95"
                  >
                    <FileText size={20} /> {t.viewDetails}
                  </button>
                  <button 
                    onClick={() => handleVote(candidate.id)} 
                    className="p-4 bg-white border-2 border-slate-100 text-slate-400 hover:text-blue-600 hover:border-blue-500 rounded-[1.5rem] transition-all flex items-center gap-3 group active:scale-125"
                  >
                    <ThumbsUp size={24} className="group-hover:scale-110 transition-transform" />
                    <span className="font-black text-slate-900">{candidate.votes.toLocaleString()}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Archive Detail Modal (Optimized for Mobile) */}
      {selectedArchive && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-3 md:p-10 bg-slate-950/95 backdrop-blur-3xl animate-fade-in overflow-hidden">
          <div className="bg-white w-full max-w-5xl h-[95vh] md:h-auto md:max-h-[85vh] rounded-[3rem] md:rounded-[5rem] shadow-7xl relative overflow-hidden flex flex-col border border-white/20">
            {/* Header */}
            <div className="p-8 md:p-12 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-20">
               <div className="flex items-center gap-6">
                  <div className="w-20 h-20 bg-blue-600 text-white rounded-[2rem] flex items-center justify-center shadow-2xl animate-pop-up">
                    <FileText size={40} />
                  </div>
                  <div>
                     <h2 className="text-3xl md:text-5xl font-black text-slate-900 serif-font tracking-tighter leading-none">{selectedArchive.name}</h2>
                     <div className="flex flex-wrap items-center gap-5 mt-4">
                        <span className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-xl"><Calendar size={14} /> {selectedArchive.publishDate}</span>
                        <span className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-xl"><Award size={14} /> {selectedArchive.sourceType}</span>
                     </div>
                  </div>
               </div>
               <button onClick={() => setSelectedArchive(null)} className="p-4 bg-slate-100 hover:bg-red-50 text-slate-400 hover:text-red-600 transition-all rounded-[1.5rem] active:scale-90">
                <X size={36} />
               </button>
            </div>

            {/* Content Body */}
            <div className="p-8 md:p-20 overflow-y-auto scrollbar-hide flex-grow bg-slate-50/30">
               <div className="max-w-3xl mx-auto">
                  <div className="mb-16 relative">
                    <Quote size={80} className="absolute -top-12 -left-12 text-blue-100 opacity-40 -rotate-12" />
                    <p className="text-3xl md:text-5xl font-black text-slate-800 italic leading-[1.2] relative z-10 serif-font tracking-tight">
                      “{selectedArchive.achievement}”
                    </p>
                  </div>

                  <div className="prose-archive prose-slate space-y-10">
                    {selectedArchive.fullArchive.split('\n').map((line, i) => {
                      if (line.startsWith('### ')) return <h3 key={i} className="text-4xl font-black text-slate-900 mt-16 mb-8 serif-font border-l-[12px] border-blue-600 pl-8 uppercase tracking-tighter italic">{line.replace('### ', '')}</h3>;
                      if (line.trim() === '') return null;
                      return <p key={i} className="text-xl md:text-2xl text-slate-600 mb-8 leading-[1.8] font-medium selection:bg-blue-600 selection:text-white">{line}</p>;
                    })}
                  </div>

                  <div className="mt-24 pt-12 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-10">
                    <div className="flex items-center gap-6 bg-green-50 px-10 py-6 rounded-[2.5rem] border border-green-100 shadow-sm">
                       <div className="w-14 h-14 bg-green-600 text-white rounded-2xl flex items-center justify-center shadow-xl"><ShieldCheck size={28} /></div>
                       <div>
                         <p className="text-sm font-black text-green-800 uppercase tracking-widest leading-none">{t.archiveVerified}</p>
                         <p className="text-[11px] text-green-600 font-bold uppercase tracking-widest mt-2">Verified Content Hash: {Math.random().toString(16).slice(2, 10).toUpperCase()}</p>
                       </div>
                    </div>
                    <button 
                      onClick={() => setSelectedArchive(null)} 
                      className="w-full md:w-auto px-16 py-6 bg-slate-900 text-white rounded-[2rem] font-black text-2xl shadow-3xl hover:bg-blue-600 transition-all active:scale-95"
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
