
import React, { useState, useMemo } from 'react';
import { getMockCandidates, TRANSLATIONS } from '../constants';
import { Language } from '../types';
import { MapPin, Award, ThumbsUp, Quote, X, Calendar, FileText, Share2, Printer } from 'lucide-react';

const Candidates: React.FC<{ lang: Language }> = ({ lang }) => {
  const t = TRANSLATIONS[lang];
  const mockCandidates = useMemo(() => getMockCandidates(lang), [lang]);
  const [candidates, setCandidates] = useState(mockCandidates);
  const [selectedArchive, setSelectedArchive] = useState<typeof mockCandidates[0] | null>(null);

  // Re-sync local state if lang changes
  React.useEffect(() => {
    setCandidates(mockCandidates);
  }, [mockCandidates]);

  const handleVote = (id: number) => {
    setCandidates(prev => prev.map(c => 
      c.id === id ? { ...c, votes: c.votes + 1 } : c
    ));
  };

  return (
    <div className="bg-slate-50 min-h-screen py-16 md:py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 md:mb-24">
          <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-black mb-6 uppercase tracking-widest">
            <Award size={16} /> {t.candidateBadge}
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-6 serif-font tracking-tight">{t.navCandidates}</h1>
          <p className="text-slate-500 text-lg md:text-xl max-w-3xl mx-auto font-medium leading-relaxed">
            {t.candidateSub}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
          {candidates.map((candidate) => (
            <div key={candidate.id} className="bg-white rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden shadow-2xl border border-slate-100 group flex flex-col md:flex-row transition-all hover:shadow-blue-600/5">
              <div className="relative md:w-2/5 h-64 md:h-auto overflow-hidden">
                <img src={candidate.imageUrl} alt={candidate.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur text-blue-600 rounded-lg text-[10px] font-black flex items-center gap-1.5 shadow-lg uppercase tracking-wider">
                    <MapPin size={12} /> {candidate.region}
                  </span>
                </div>
              </div>

              <div className="p-8 md:p-10 md:w-3/5 flex flex-col">
                <div className="flex justify-between items-start mb-6 gap-4">
                   <h3 className="text-2xl md:text-3xl font-black text-slate-900 serif-font leading-tight">{candidate.name}</h3>
                   <div className="bg-blue-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 shadow-lg shrink-0">
                      <ThumbsUp size={16} className="text-amber-300" />
                      <span className="font-black text-base">{candidate.votes.toLocaleString()}</span>
                   </div>
                </div>

                <div className="flex items-start gap-3 mb-6 text-slate-400 italic font-medium">
                  <Quote size={18} className="shrink-0 text-blue-200 mt-1" />
                  <p className="text-sm md:text-base leading-relaxed">{candidate.achievement}</p>
                </div>
                
                <p className="text-slate-500 text-xs md:text-sm mb-8 leading-relaxed line-clamp-3 font-medium">
                  {candidate.bio}
                </p>

                <div className="mt-auto pt-6 border-t border-slate-100 flex gap-3">
                  <button onClick={() => setSelectedArchive(candidate)} className="flex-1 px-4 py-3 md:py-4 bg-slate-900 text-white rounded-xl font-black text-xs md:text-sm hover:bg-slate-800 transition-all flex items-center justify-center gap-2 active:scale-95">
                    <FileText size={16} /> {t.viewDetails}
                  </button>
                  <button onClick={() => handleVote(candidate.id)} className="px-4 py-3 md:py-4 bg-blue-50 text-blue-600 rounded-xl font-black text-xs md:text-sm hover:bg-blue-100 transition-all border border-blue-100 flex items-center gap-2 active:scale-95">
                    <ThumbsUp size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedArchive && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl animate-fade-in">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[2.5rem] shadow-4xl relative overflow-hidden flex flex-col">
            <div className="p-6 md:p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg"><FileText size={20} /></div>
                  <div>
                     <h2 className="text-base md:text-lg font-black text-slate-900 uppercase tracking-tight">{t.archiveTitle}: {selectedArchive.name}</h2>
                     <p className="text-[9px] md:text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] flex items-center gap-3">
                        <span className="flex items-center gap-1"><Calendar size={10} /> {selectedArchive.publishDate}</span>
                        <span className="flex items-center gap-1"><Award size={10} /> {selectedArchive.sourceType}</span>
                     </p>
                  </div>
               </div>
               <button onClick={() => setSelectedArchive(null)} className="p-2 text-slate-400 hover:text-red-600 transition-all"><X size={24} /></button>
            </div>

            <div className="p-8 md:p-12 overflow-y-auto scrollbar-hide flex-grow">
               <div className="max-w-2xl mx-auto prose prose-slate">
                  {selectedArchive.fullArchive.split('\n').map((line, i) => {
                    if (line.startsWith('### ')) return <h3 key={i} className="text-2xl font-black text-slate-900 mt-8 mb-4 serif-font border-l-4 border-blue-600 pl-4">{line.replace('### ', '')}</h3>;
                    if (line.startsWith('**前言：**') || line.startsWith('**Foreword:**')) return <p key={i} className="text-base font-medium text-slate-500 italic mb-8 bg-slate-50 p-6 rounded-xl">{line}</p>;
                    return <p key={i} className="text-base text-slate-600 mb-4 leading-relaxed">{line}</p>;
                  })}
               </div>
               <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
                  <div className="flex items-center gap-3">
                     <div className="w-8 h-8 bg-green-50 text-green-600 rounded-lg flex items-center justify-center border border-green-100"><Award size={16} /></div>
                     <div className="text-left"><p className="text-[9px] font-black text-slate-900 uppercase tracking-wider">{t.archiveVerified}</p></div>
                  </div>
                  <button onClick={() => setSelectedArchive(null)} className="w-full md:w-auto px-10 py-4 bg-slate-900 text-white rounded-xl font-black text-sm active:scale-95">{t.closeArchive}</button>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Candidates;
