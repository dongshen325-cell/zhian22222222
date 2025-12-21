
import React, { useState, useEffect, useMemo } from 'react';
// Fixed: Removed non-existent and unused exports TITLE_TRAPS and MANIPULATION_CASES
import { getMockNews, TRANSLATIONS } from '../constants';
import { Language } from '../types';
import { 
  Gamepad2, Check, X, ArrowRight, RefreshCw, Trophy, 
  Sparkles, MousePointer2, Scissors, Info, Share2, 
  AlertTriangle, Lock, PartyPopper, ChevronLeft
} from 'lucide-react';

type GameMode = 'main' | 'verifier' | 'traps' | 'manipulation';

const Games: React.FC<{ lang: Language }> = ({ lang }) => {
  const t = TRANSLATIONS[lang];
  const newsPool = useMemo(() => getMockNews(lang), [lang]);
  
  const [mode, setMode] = useState<GameMode>('main');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [lastResult, setLastResult] = useState<boolean | null>(null);
  const [celebrate, setCelebrate] = useState(false);

  // Manipulation Game State
  const [isManipulated, setIsManipulated] = useState(false);

  useEffect(() => {
    if (streak === 10 && !celebrate) {
      setCelebrate(true);
      const timer = setTimeout(() => setCelebrate(false), 6000);
      return () => clearTimeout(timer);
    }
  }, [streak]);

  const resetBase = () => {
    setCurrentIdx(0);
    setScore(0);
    setStreak(0);
    setGameOver(false);
    setShowExplanation(false);
    setLastResult(null);
    setCelebrate(false);
  };

  const handleModeSelect = (newMode: GameMode) => {
    setMode(newMode);
    resetBase();
  };

  const handleVerifierAnswer = (userChoice: boolean) => {
    const isCorrect = userChoice === newsPool[currentIdx].isTrue;
    setLastResult(isCorrect);
    if (isCorrect) {
      setScore(score + 10);
      setStreak(prev => prev + 1);
    } else {
      setStreak(0);
    }
    setShowExplanation(true);
  };

  const nextQuestion = (pool: any[]) => {
    setShowExplanation(false);
    setLastResult(null);
    if (currentIdx < pool.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      setGameOver(true);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 md:py-24 animate-fade-in relative min-h-screen">
      <div className="text-center mb-16">
        {mode !== 'main' && (
          <div className="flex justify-center mb-8">
            <button onClick={() => setMode('main')} className="flex items-center gap-2 px-6 py-2 bg-slate-100 text-slate-600 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all">
              <ChevronLeft size={16} /> {t.labBack}
            </button>
          </div>
        )}
        <h1 className="text-4xl md:text-7xl font-black text-slate-900 mb-6 serif-font tracking-tight">{t.labTitle}</h1>
        <p className="text-slate-500 max-w-2xl mx-auto text-lg font-medium">{t.labSub}</p>
      </div>

      {mode === 'main' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {[
            { id: 'verifier', title: t.gameVerifierTitle, desc: t.gameVerifierDesc, icon: <Gamepad2 size={40} />, color: 'blue' },
            { id: 'traps', title: t.gameTrapsTitle, desc: t.gameTrapsDesc, icon: <MousePointer2 size={40} />, color: 'amber' },
            { id: 'manipulation', title: t.gameManipulationTitle, desc: t.gameManipulationDesc, icon: <Scissors size={40} />, color: 'red' }
          ].map((item) => (
            <button 
              key={item.id}
              onClick={() => handleModeSelect(item.id as GameMode)}
              className="group bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all text-left flex flex-col items-start"
            >
              <div className={`w-20 h-20 bg-${item.color}-50 text-${item.color}-600 rounded-2xl flex items-center justify-center mb-10 group-hover:scale-110 transition-transform shadow-lg`}>
                {item.icon}
              </div>
              <h3 className="text-2xl font-black mb-4 serif-font">{item.title}</h3>
              <p className="text-slate-500 mb-10 leading-relaxed font-medium text-sm">{item.desc}</p>
              <span className={`mt-auto px-6 py-3 bg-${item.color}-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-xl shadow-${item.color}-600/20 group-hover:px-8 transition-all`}>Start <ArrowRight size={14} /></span>
            </button>
          ))}
        </div>
      )}

      {mode === 'verifier' && (
        <div className="bg-white rounded-[2.5rem] md:rounded-[4rem] p-8 md:p-20 shadow-3xl border border-slate-100 min-h-[600px] flex flex-col justify-center relative overflow-hidden">
          {!gameOver ? (
            <div className="relative z-10 w-full max-w-4xl mx-auto">
              <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-6">
                <div className="flex gap-2">
                  {newsPool.map((_, i) => (
                    <div key={i} className={`h-1.5 w-6 rounded-full transition-all duration-500 ${i === currentIdx ? 'bg-blue-600 w-10' : i < currentIdx ? 'bg-green-400' : 'bg-slate-100'}`}></div>
                  ))}
                </div>
                <div className="px-6 py-2 bg-slate-900 text-white rounded-xl font-black text-xl flex items-center gap-3 shadow-xl">
                  <Trophy size={20} className="text-amber-400" /> {score}
                </div>
              </div>

              <div className="relative mb-20 text-center">
                 <h2 className="text-3xl md:text-5xl font-black text-slate-800 leading-tight serif-font">
                   {newsPool[currentIdx].title}
                 </h2>
              </div>

              {!showExplanation ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
                  <button onClick={() => handleVerifierAnswer(true)} className="group p-8 bg-white border-2 border-slate-100 rounded-[2rem] hover:bg-green-600 hover:border-green-600 transition-all flex flex-col items-center gap-4 shadow-lg">
                    <Check size={40} className="text-green-600 group-hover:text-white" />
                    <span className="font-black text-slate-900 group-hover:text-white text-xl uppercase tracking-tighter">{lang === 'zh' ? '确有其事' : 'Fact'}</span>
                  </button>
                  <button onClick={() => handleVerifierAnswer(false)} className="group p-8 bg-white border-2 border-slate-100 rounded-[2rem] hover:bg-red-600 hover:border-red-600 transition-all flex flex-col items-center gap-4 shadow-lg">
                    <X size={40} className="text-red-600 group-hover:text-white" />
                    <span className="font-black text-slate-900 group-hover:text-white text-xl uppercase tracking-tighter">{lang === 'zh' ? '这是假象' : 'Fake'}</span>
                  </button>
                </div>
              ) : (
                <div className="animate-fade-in text-center max-w-2xl mx-auto">
                  <div className={`text-4xl font-black mb-8 serif-font ${lastResult ? 'text-green-600' : 'text-red-600'}`}>
                    {lastResult ? t.gameCorrect : t.gameWrong}
                  </div>
                  <div className="p-8 bg-slate-50 rounded-[2rem] text-slate-600 text-lg leading-relaxed mb-10 border border-slate-100">
                    <p className="font-medium italic">“{newsPool[currentIdx].explanation}”</p>
                  </div>
                  <button onClick={() => nextQuestion(newsPool)} className="group px-12 py-5 bg-slate-900 text-white rounded-xl font-black text-lg flex items-center gap-3 mx-auto shadow-xl active:scale-95">
                    {t.gameNext} <ArrowRight size={20} />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center animate-fade-in">
              <Trophy size={100} className="mx-auto text-amber-400 mb-8" />
              <h2 className="text-5xl font-black text-slate-900 mb-4 serif-font">{t.gameFinish}</h2>
              <p className="text-2xl text-slate-500 mb-12">{lang === 'zh' ? '真相积分' : 'Score'}: <span className="text-blue-600 font-black">{score}</span></p>
              <button onClick={resetBase} className="px-10 py-4 bg-slate-900 text-white rounded-xl font-black text-lg flex items-center gap-3 mx-auto shadow-xl"><RefreshCw size={20} /> {t.gameRestart}</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Games;
