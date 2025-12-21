
import React from 'react';
import { TRANSLATIONS } from '../constants';
import { Language } from '../types';
import { ShieldCheck, Info, Wallet, Gavel, CheckCircle2 } from 'lucide-react';

interface VotingProps {
  lang: Language;
  walletAddress: string | null;
  zaBalance: number;
}

const Voting: React.FC<VotingProps> = ({ lang, walletAddress, zaBalance }) => {
  const t = TRANSLATIONS[lang];
  const canVote = walletAddress && zaBalance >= 500;

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 md:py-24 animate-fade-in">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 serif-font tracking-tight">{t.votingTitle}</h1>
        <p className="text-slate-600 text-lg font-medium">{t.votingSub}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="p-8 rounded-[2rem] bg-blue-50 border border-blue-100">
          <div className="flex items-center gap-3 mb-6 text-blue-600 font-bold uppercase tracking-widest text-xs">
            <ShieldCheck size={20} /> {t.votingThreshold}
          </div>
          <ul className="space-y-4 text-sm text-slate-600 font-medium">
            <li className="flex gap-2"><span>•</span> {lang === 'zh' ? '必须连接 Web3 钱包（只读权限）' : 'Web3 Wallet required (Read-only)'}</li>
            <li className="flex gap-2"><span>•</span> {lang === 'zh' ? '账户余额需持有 ≥ 500 ZA' : 'Hold at least 500 ZA tokens'}</li>
            <li className="flex gap-2"><span>•</span> {lang === 'zh' ? '每个钱包地址每年仅限 3 次投票' : '3 votes per address per year'}</li>
            <li className="flex gap-2"><span>•</span> {lang === 'zh' ? '投票过程完全去中心化、可追溯' : 'Fully decentralized and traceable'}</li>
          </ul>
        </div>
        <div className="p-8 rounded-[2rem] bg-slate-100 border border-slate-200">
          <div className="flex items-center gap-3 mb-6 text-slate-600 font-bold uppercase tracking-widest text-xs">
            <Info size={20} /> {t.votingPurpose}
          </div>
          <p className="text-sm text-slate-500 leading-relaxed font-medium">
            {t.votingPurposeDesc}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl border border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-5">
          <Gavel size={120} />
        </div>
        
        <h3 className="text-xl md:text-2xl font-black text-slate-900 mb-10 flex items-center gap-3 uppercase tracking-tight">
          <Wallet className="text-blue-600" /> {t.votingStatus}
        </h3>

        {!walletAddress ? (
          <div className="text-center py-12">
            <p className="text-slate-500 mb-8 font-medium">{t.votingWalletStatus}</p>
            <div className="animate-pulse inline-block px-10 py-3 bg-slate-100 rounded-full text-slate-400 font-black text-xs uppercase tracking-widest">Awaiting Link...</div>
          </div>
        ) : (
          <div className="space-y-10">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8 p-8 bg-slate-50 rounded-[1.5rem] border border-slate-100">
              <div className="text-center md:text-left">
                <div className="text-[10px] uppercase text-slate-400 font-black mb-2 tracking-widest">Account Address</div>
                <div className="font-mono text-blue-600 font-bold text-sm break-all">{walletAddress}</div>
              </div>
              <div className="text-center md:text-right">
                <div className="text-[10px] uppercase text-slate-400 font-black mb-2 tracking-widest">{t.votingPower}</div>
                <div className="text-4xl font-black text-slate-900">{zaBalance.toLocaleString()} <span className="text-sm font-normal text-slate-400">ZA</span></div>
              </div>
            </div>

            <div className="p-8 border-4 border-dashed border-slate-100 rounded-[2rem] text-center">
              {canVote ? (
                <div className="animate-fade-in">
                  <div className="mb-6 text-green-600 flex justify-center items-center gap-2 font-black uppercase text-sm tracking-widest">
                    <CheckCircle2 size={24} /> {t.votingQualified}
                  </div>
                  <button className="px-12 py-5 bg-blue-600 text-white rounded-2xl font-black text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 active:scale-95">
                    {t.votingAction}
                  </button>
                </div>
              ) : (
                <div className="text-red-500 font-black uppercase tracking-widest text-sm p-4 bg-red-50 rounded-xl inline-block">
                  {t.votingInsufficient}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Voting;
