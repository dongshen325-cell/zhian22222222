
import React from 'react';
import { Link } from 'react-router-dom';
import { TRANSLATIONS } from '../constants';
import { Language } from '../types';
import { ArrowRight, Globe, Lock, ShieldCheck, Quote, Fingerprint, Zap } from 'lucide-react';
import AILogo from '../components/AILogo';

const Home: React.FC<{ lang: Language }> = ({ lang }) => {
  const t = TRANSLATIONS[lang];

  return (
    <div className="animate-fade-in bg-white overflow-hidden">
      {/* Cinematic Hero Section */}
      <section className="relative min-h-screen flex items-center px-4">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=2070&auto=format&fit=crop" 
            className="w-full h-full object-cover grayscale opacity-40 mix-blend-multiply scale-105" 
            alt="Hero Background" 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-transparent"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto w-full pt-20">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-blue-600/10 border border-blue-500/30 text-blue-400 text-[10px] font-black mb-10 tracking-[0.4em] uppercase backdrop-blur-3xl animate-fade-in">
              <AILogo size={32} className="mr-1" transparent={true} />
              {t.heroBadge}
            </div>
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-white mb-10 leading-[0.95] serif-font tracking-tighter drop-shadow-2xl">
               {t.heroTitle.split('，').map((part, i) => (
                 <span key={i} className="block">{part}</span>
               ))}
            </h1>
            <p className="text-xl md:text-3xl text-slate-400 mb-12 font-light leading-relaxed max-w-2xl border-l-2 border-blue-600/50 pl-8">
              {t.heroSub}
            </p>
            <div className="flex flex-wrap gap-6">
              <Link to="/voting" className="group px-10 py-5 bg-blue-600 hover:bg-white hover:text-blue-600 text-white rounded-2xl font-black flex items-center gap-4 transition-all shadow-2xl shadow-blue-600/20 text-xl active:scale-95">
                {t.heroCtaVote} <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
              </Link>
              <Link to="/relax" className="px-10 py-5 bg-white/5 hover:bg-white/10 backdrop-blur-xl text-white rounded-2xl font-black border border-white/10 transition-all text-xl hover:border-white/30 active:scale-95">
                {t.heroCtaLab}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Manifesto Section */}
      <section className="py-32 bg-white px-4 border-y border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="relative">
              <div className="relative z-10 p-12 bg-slate-50 rounded-[4rem] border border-slate-100">
                <Quote size={80} className="text-blue-200 mb-8" />
                <h2 className="text-4xl md:text-6xl font-black text-slate-900 serif-font leading-[1.2] mb-10">
                  {lang === 'zh' ? '真相不是权力的点缀，而是生命的底色。' : 'Truth is not an ornament of power, but the foundation of life.'}
                </h2>
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-xl">
                    <AILogo size={40} transparent={true} />
                  </div>
                  <div>
                    <p className="font-black text-slate-900 text-sm uppercase tracking-widest">ZHIAN Protocol</p>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Founding Manifesto</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-12">
               <div className="space-y-4">
                  <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
                    <Zap className="text-blue-600" /> {lang === 'zh' ? '为何智安？' : 'Why ZHIAN?'}
                  </h3>
                  <p className="text-lg text-slate-500 leading-relaxed font-medium">
                    {lang === 'zh' ? '在信息过载与审查交织的时代，真相变得比黄金更稀缺。我们建立不可篡改的协议，让证据在分布式网络中永生。' : 'Truth is scarcer than gold. We build immutable protocols to ensure evidence lives forever on the network.'}
                  </p>
               </div>
               <div className="grid grid-cols-2 gap-8">
                  <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100">
                    <h4 className="font-black text-slate-900 mb-2 uppercase text-xs tracking-widest">{lang === 'zh' ? '分布式存储' : 'Distributed'}</h4>
                    <p className="text-xs text-slate-400 font-bold">No central kill switch.</p>
                  </div>
                  <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100">
                    <h4 className="font-black text-slate-900 mb-2 uppercase text-xs tracking-widest">{lang === 'zh' ? '不可篡改' : 'Immutable'}</h4>
                    <p className="text-xs text-slate-400 font-bold">Records verified by nodes.</p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-40 bg-slate-950 text-white overflow-hidden px-4">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-24">
             <span className="text-blue-400 font-black uppercase tracking-[0.6em] text-xs mb-6 block">Real-time Global Pulse</span>
             <h2 className="text-5xl md:text-8xl font-black serif-font tracking-tighter leading-none">
                {lang === 'zh' ? '这不仅是数字' : 'Not Just Numbers'}<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">
                  {lang === 'zh' ? '更是真相的低语' : 'Whispers of Truth'}
                </span>
             </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="p-12 md:p-16 bg-white/5 border border-white/10 rounded-[4rem] backdrop-blur-xl group hover:bg-white/10 transition-all">
               <div className="flex justify-between items-start mb-10">
                  <div className="w-20 h-20 bg-red-600/20 text-red-500 rounded-3xl flex items-center justify-center shadow-2xl">
                    <Lock size={40} />
                  </div>
                  <span className="px-4 py-2 bg-red-600/20 text-red-500 rounded-full text-[10px] font-black uppercase tracking-widest">{t.statCensorshipTitle}</span>
               </div>
               <div className="mb-8">
                  <div className="text-7xl md:text-9xl font-black serif-font tracking-tighter mb-4">{t.statCensorshipValue}</div>
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                     <div className="h-full bg-red-600 w-[68%] animate-shimmer"></div>
                  </div>
               </div>
               <p className="text-slate-400 text-xl font-light leading-relaxed">{t.statCensorshipDesc}</p>
            </div>

            <div className="p-12 md:p-16 bg-blue-600 text-white rounded-[4rem] shadow-3xl shadow-blue-600/20 relative group hover:-translate-y-2 transition-all">
               <div className="relative z-10">
                  <div className="flex justify-between items-start mb-10">
                    <div className="w-20 h-20 bg-white/20 text-white rounded-3xl flex items-center justify-center shadow-2xl">
                      <ShieldCheck size={40} />
                    </div>
                    <span className="px-4 py-2 bg-white/20 text-white rounded-full text-[10px] font-black uppercase tracking-widest">{t.statJournalistTitle}</span>
                  </div>
                  <div className="mb-8">
                    <div className="text-7xl md:text-9xl font-black serif-font tracking-tighter mb-4">{t.statJournalistValue}</div>
                    <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
                      <div className="h-full bg-white w-[42%] animate-shimmer"></div>
                    </div>
                  </div>
                  <p className="text-blue-50 text-xl font-light leading-relaxed">{t.statJournalistDesc}</p>
               </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
