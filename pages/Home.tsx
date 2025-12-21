
import React from 'react';
import { Link } from 'react-router-dom';
import { TRANSLATIONS, LOGO_SRC } from '../constants';
import { Language } from '../types';
import { ArrowRight, ShieldAlert, Camera, PenTool, Lightbulb, Globe, Lock, ShieldCheck, Heart } from 'lucide-react';

const Home: React.FC<{ lang: Language }> = ({ lang }) => {
  const t = TRANSLATIONS[lang];

  return (
    <div className="animate-fade-in bg-white">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-slate-950 px-4">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=2070&auto=format&fit=crop" 
            className="w-full h-full object-cover opacity-30 mix-blend-overlay scale-110 blur-[1px]" 
            alt="Hero Background" 
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-slate-950/80 to-slate-950"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto w-full">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-blue-600/20 border border-blue-500/40 text-blue-400 text-[10px] font-black mb-8 tracking-[0.3em] uppercase backdrop-blur-xl">
              <img src={LOGO_SRC} className="w-4 h-4 rounded-full object-cover mr-1" alt="Logo" />
              {t.heroBadge}
            </div>
            <h1 className="text-4xl md:text-7xl lg:text-8xl font-black text-white mb-8 leading-[1.1] serif-font tracking-tight drop-shadow-2xl">
               {t.heroTitle}
            </h1>
            <p className="text-lg md:text-2xl text-slate-300 mb-10 font-light leading-relaxed max-w-3xl border-l-4 border-blue-600 pl-6 md:pl-10 italic">
              {t.heroQuote}
              <span className="block mt-4 text-blue-400 font-black uppercase tracking-[0.2em] text-xs not-italic flex items-center gap-3">
                 <span className="h-px w-8 bg-blue-500"></span>
                 {t.heroQuoteSub}
              </span>
            </p>
            <div className="flex flex-wrap gap-4 md:gap-6">
              <Link to="/voting" className="group px-8 py-4 bg-blue-600 hover:bg-white hover:text-blue-600 text-white rounded-2xl font-black flex items-center gap-3 transition-all shadow-xl text-lg">
                {t.heroCtaVote} <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
              </Link>
              <Link to="/relax" className="px-8 py-4 bg-white/5 hover:bg-white/10 backdrop-blur-md text-white rounded-2xl font-black border border-white/20 transition-all text-lg hover:border-white/50">
                {t.heroCtaLab}
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute bottom-10 right-10 opacity-5 pointer-events-none hidden xl:block">
           <img src={LOGO_SRC} className="w-[400px] grayscale brightness-200 rotate-[-12deg] animate-pulse" alt="Logo Icon" />
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-slate-50 border-y border-slate-100 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="group relative bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden hover:-translate-y-2 transition-all">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <Lock size={100} className="text-red-600" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center shadow-md"><ShieldAlert size={24} /></div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500">{t.statCensorshipTitle}</span>
                </div>
                <div className="mb-6">
                  <h3 className="text-5xl md:text-6xl font-black text-slate-900 mb-2 serif-font tracking-tighter">
                    {t.statCensorshipValue} <span className="text-xl font-light text-slate-400">{t.statCensorshipUnit}</span>
                  </h3>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-red-500 w-[68%]"></div>
                  </div>
                </div>
                <p className="text-slate-500 text-base leading-relaxed font-medium">{t.statCensorshipDesc}</p>
                <div className="mt-6 flex items-center gap-2 text-red-600 font-bold text-[10px] uppercase tracking-wider">
                   <div className="w-2 h-2 rounded-full bg-red-600 animate-ping"></div> {t.statCensorshipSource}
                </div>
              </div>
            </div>

            <div className="group relative bg-slate-900 p-8 md:p-12 rounded-[2.5rem] shadow-xl border border-slate-800 overflow-hidden hover:-translate-y-2 transition-all">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <PenTool size={100} className="text-amber-500" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-amber-500/10 text-amber-500 rounded-xl flex items-center justify-center shadow-md"><Heart size={24} /></div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-500">{t.statJournalistTitle}</span>
                </div>
                <div className="mb-6">
                  <h3 className="text-5xl md:text-6xl font-black text-white mb-2 serif-font tracking-tighter">
                    {t.statJournalistValue} <span className="text-xl font-light text-slate-500">{t.statJournalistUnit}</span>
                  </h3>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 w-[42%]"></div>
                  </div>
                </div>
                <p className="text-slate-400 text-base leading-relaxed font-medium">{t.statJournalistDesc}</p>
                <div className="mt-6 flex items-center gap-2 text-amber-500 font-bold text-[10px] uppercase tracking-wider">
                   <ShieldCheck size={16} /> {t.statJournalistSource}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Soul-Stirring Section */}
      <section className="py-24 md:py-40 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-16 md:gap-24">
            <div className="lg:w-1/2 relative">
              <div className="absolute -inset-8 bg-blue-600/5 rounded-full blur-[80px]"></div>
              <div className="relative rounded-[3rem] overflow-hidden shadow-2xl group">
                <img src="https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" alt="Story" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60"></div>
              </div>
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-white p-3 rounded-2xl shadow-2xl hidden md:block animate-float">
                <img src={LOGO_SRC} className="w-full h-full object-cover rounded-xl" alt="Breakthrough" />
              </div>
            </div>

            <div className="lg:w-1/2 space-y-10">
               <div className="inline-flex items-center gap-3 text-blue-600 bg-blue-50 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
                  <Globe size={18} /> DECENTRALIZED TRUTH
               </div>
               <h2 className="text-4xl md:text-6xl font-black text-slate-900 serif-font leading-tight">
                  {lang === 'zh' ? '比谎言传播更快的，' : 'Faster than lies spread,'}<br/>
                  <span className="text-blue-600 underline decoration-blue-100 decoration-8 underline-offset-4">
                    {lang === 'zh' ? '是永恒的共识。' : 'is eternal consensus.'}
                  </span>
               </h2>
               <p className="text-slate-500 text-lg md:text-xl font-light leading-relaxed">
                  ZHIAN ensures every brave testimony is indexed permanently through blockchain. Truth is no longer a fragile island.
               </p>
               
               <div className="grid grid-cols-1 gap-6">
                  <div className="flex gap-6 p-8 bg-slate-50 rounded-[2rem] border border-slate-100 hover:bg-white hover:shadow-xl transition-all group">
                     <div className="w-16 h-16 shrink-0 bg-white rounded-xl text-blue-600 shadow-md flex items-center justify-center group-hover:scale-110 transition-transform"><Camera size={32} /></div>
                     <div>
                        <h4 className="text-xl font-black text-slate-900 mb-2">Multidimensional Archives</h4>
                        <p className="text-slate-500 text-sm font-medium">Photos, audio, and video are stored across thousands of nodes in encrypted shards.</p>
                     </div>
                  </div>
                  <div className="flex gap-6 p-8 bg-blue-600 text-white rounded-[2rem] shadow-xl group hover:scale-[1.02] transition-all">
                     <div className="w-16 h-16 shrink-0 bg-white/10 rounded-xl text-white shadow-inner flex items-center justify-center group-hover:rotate-6 transition-transform"><Lightbulb size={32} /></div>
                     <div>
                        <h4 className="text-xl font-black mb-2">Power of ZhanCoin (ZA)</h4>
                        <p className="text-blue-50 text-sm font-medium opacity-80">ZA represents your voice for truth. Economic incentives empower truth guardians everywhere.</p>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
