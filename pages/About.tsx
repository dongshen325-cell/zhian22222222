
import React from 'react';
import { TRANSLATIONS } from '../constants';
import { Language } from '../types';
import { BookOpen, Target, Coins, ShieldCheck, AlertCircle } from 'lucide-react';

const About: React.FC<{ lang: Language }> = ({ lang }) => {
  const t = TRANSLATIONS[lang];

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 md:py-24 animate-fade-in">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 serif-font">{t.aboutTitle}</h1>
        <p className="text-slate-600 text-lg font-medium">{t.aboutSub}</p>
      </div>

      <div className="space-y-16">
        <section>
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-xl"><Target size={28} /></div>
            <h2 className="text-2xl font-bold text-slate-800">{t.missionTitle}</h2>
          </div>
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
            <p className="text-slate-600 leading-relaxed text-lg">{t.missionDesc}</p>
          </div>
        </section>

        <section className="bg-slate-900 text-white rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Coins size={120} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-10">
              <div className="p-3 bg-white/10 text-amber-400 rounded-xl"><BookOpen size={28} /></div>
              <h2 className="text-2xl font-bold">{t.tokenModelTitle}</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <h3 className="text-amber-400 font-bold text-lg border-l-4 border-amber-400 pl-4 uppercase tracking-wider">{t.tokenDistTitle}</h3>
                <ul className="space-y-4 text-sm text-slate-300">
                  <li className="flex justify-between border-b border-white/10 pb-2"><span>{lang === 'zh' ? '开发团队' : 'Team'}</span> <span className="text-white font-mono">15%</span></li>
                  <li className="flex justify-between border-b border-white/10 pb-2"><span>{lang === 'zh' ? '运营成本' : 'Operations'}</span> <span className="text-white font-mono">5%</span></li>
                  <li className="flex justify-between border-b border-white/10 pb-2"><span>{lang === 'zh' ? '注册空投' : 'Airdrop'}</span> <span className="text-white font-mono">10%</span></li>
                  <li className="flex justify-between border-b border-white/10 pb-2"><span>{lang === 'zh' ? '长期激励' : 'Eco-Incentives'}</span> <span className="text-white font-mono">70%</span></li>
                </ul>
              </div>
              <div className="space-y-6">
                <h3 className="text-amber-400 font-bold text-lg border-l-4 border-amber-400 pl-4 uppercase tracking-wider">{t.tokenRewardTitle}</h3>
                <p className="text-sm text-slate-400 leading-relaxed font-medium">{t.tokenRewardDesc}</p>
              </div>
            </div>
            
            <div className="mt-12 p-6 bg-white/5 border border-white/10 rounded-2xl flex gap-4 items-start">
              <AlertCircle className="text-amber-500 shrink-0 mt-1" size={24} />
              <div>
                <h4 className="font-bold text-sm mb-2 uppercase tracking-widest">{t.tokenComplianceTitle}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{t.tokenComplianceDesc}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-slate-50 p-8 rounded-[2rem] border border-slate-200">
          <div className="flex items-center gap-3 mb-4 text-slate-700">
            <ShieldCheck size={20} />
            <h3 className="font-bold uppercase tracking-wider text-sm">{t.legalDisclaimerTitle}</h3>
          </div>
          <p className="text-sm text-slate-500 leading-relaxed italic">{t.legalDisclaimerDesc}</p>
        </section>
      </div>
    </div>
  );
};

export default About;
