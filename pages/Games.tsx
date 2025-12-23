
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { TRANSLATIONS, RANKS, RUNNER_OBSTACLES } from '../constants';
import { LOGIC_DB, TRAP_DB, RESTORATION_DB, REPORTER_TITLES, getTitleByCorrectCount, QuizQuestion } from '../gameData';
import { Language, RankInfo } from '../types';
import { 
  ChevronLeft, RefreshCw, Trophy, Zap, Flame, Award, Wind, Play, Shield, Target,
  CheckCircle2, AlertCircle, HelpCircle, Brain, MessageSquare, Send, Loader2, Star, Sparkles
} from 'lucide-react';

type GameMode = 'main' | 'verifier' | 'traps' | 'manipulation' | 'runner';

const Games: React.FC<{ lang: Language }> = ({ lang }) => {
  const t = TRANSLATIONS[lang];
  
  const [mode, setMode] = useState<GameMode>('main');
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  
  // Quiz states
  const [totalCorrect, setTotalCorrect] = useState(() => {
    return parseInt(localStorage.getItem('zhian_total_correct') || '0');
  });
  const [activeQuestions, setActiveQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [rankAnimate, setRankAnimate] = useState(false);

  // Runner Game states (Persistent and polished)
  const [displayDistance, setDisplayDistance] = useState(0);
  const [displayRank, setDisplayRank] = useState<RankInfo>(RANKS[0]);
  const [runnerRankAnimate, setRunnerRankAnimate] = useState(false);

  // Fisher-Yates Shuffle for true randomness
  const shuffle = (array: any[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const handleModeSelect = (newMode: GameMode) => {
    setMode(newMode);
    setGameOver(false);
    setGameStarted(false);
    setCurrentIndex(0);
    setSelectedOption(null);
    setShowExplanation(false);

    // Initialize with shuffled built-in data
    if (newMode === 'verifier') setActiveQuestions(shuffle(LOGIC_DB));
    else if (newMode === 'traps') setActiveQuestions(shuffle(TRAP_DB));
    else if (newMode === 'manipulation') setActiveQuestions(shuffle(RESTORATION_DB));
  };

  // AI Generation for infinite content after 150 questions (Dynamic Expansion)
  const fetchAiQuestions = async () => {
    if (isLoadingMore) return;
    setIsLoadingMore(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `You are a world-class news verification analyst. Generate 10 additional professional multiple-choice questions for news verification training. 
                      Category: ${mode}. Language: ${lang === 'zh' ? 'Chinese' : 'English'}.
                      Level: Expert. Focus on subtle manipulation and professional fact-checking skills.
                      Return strictly JSON array of objects with keys: id, text, options (array of 4), answer (index 0-3), explanation.`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.INTEGER },
                text: { type: Type.STRING },
                options: { type: Type.ARRAY, items: { type: Type.STRING } },
                answer: { type: Type.INTEGER },
                explanation: { type: Type.STRING }
              },
              required: ['id', 'text', 'options', 'answer', 'explanation']
            }
          }
        }
      });
      const data = JSON.parse(response.text);
      setActiveQuestions(prev => [...prev, ...data]);
    } catch (err) {
      console.error("AI question expansion failed", err);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handleAnswer = (idx: number) => {
    setSelectedOption(idx);
    setShowExplanation(true);
    if (idx === activeQuestions[currentIndex].answer) {
      const newTotal = totalCorrect + 1;
      setTotalCorrect(newTotal);
      localStorage.setItem('zhian_total_correct', newTotal.toString());
      
      // Promotion Moment: Every 20 correct answers
      if (newTotal > 0 && newTotal % 20 === 0) {
        setRankAnimate(true);
        // Haptic feedback simulation for mobile
        if (navigator.vibrate) navigator.vibrate(200);
        setTimeout(() => setRankAnimate(false), 3000);
      }
    }
  };

  const handleNext = () => {
    const nextIdx = currentIndex + 1;
    
    // Background Trigger: Fetch more content when approaching the end of built-in bank
    if (nextIdx >= activeQuestions.length - 5 && activeQuestions.length >= 10) {
      fetchAiQuestions();
    }

    if (nextIdx < activeQuestions.length) {
      setCurrentIndex(nextIdx);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      setGameOver(true);
    }
  };

  const currentTitle = getTitleByCorrectCount(totalCorrect);

  // Runner Logic (Optimized for Mobile Touch)
  const runnerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<HTMLDivElement>(null);
  const obstaclesRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef({
    distance: 0,
    runnerY: 50,
    targetY: 50,
    obstacles: [] as any[],
    lastSpawn: 0,
    isDragging: false,
    gameOver: false,
    active: false
  });
  const requestRef = useRef<number>(null);

  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    stateRef.current.distance = 0;
    stateRef.current.runnerY = 50;
    stateRef.current.targetY = 50;
    stateRef.current.obstacles = [];
    stateRef.current.lastSpawn = 0;
    stateRef.current.gameOver = false;
    stateRef.current.active = true;
    setDisplayDistance(0);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!stateRef.current.isDragging || !gameRef.current) return;
    // Fix for mobile browser behavior: prevent scroll
    if (e.pointerType === 'touch') {
      // e.preventDefault() is handled by touch-action: none
    }
    const rect = gameRef.current.getBoundingClientRect();
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    stateRef.current.targetY = Math.max(8, Math.min(92, y));
  };

  useEffect(() => {
    if (mode !== 'runner' || gameOver || !gameStarted) return;
    const gameLoop = (time: number) => {
      const s = stateRef.current;
      if (s.gameOver || !s.active) return;

      const difficulty = s.distance / 100;
      const speed = 0.55 + Math.pow(difficulty, 2.5) * 10;
      s.distance += 0.009;
      if (s.distance >= 100) { s.gameOver = true; setGameOver(true); return; }

      // Smooth interp for movement
      s.runnerY += (s.targetY - s.runnerY) * 0.22;
      if (runnerRef.current) {
        runnerRef.current.style.top = `${s.runnerY}%`;
        const tilt = (s.targetY - s.runnerY) * 2.2;
        runnerRef.current.style.transform = `translateY(-50%) rotate(${tilt}deg)`;
      }
      if (progressBarRef.current) progressBarRef.current.style.width = `${s.distance}%`;

      if (time - s.lastSpawn > (380 - difficulty * 160)) {
        const pool = RUNNER_OBSTACLES[lang][Math.random() > 0.5 ? 'top' : 'bottom'];
        const text = pool[Math.floor(Math.random() * pool.length)];
        const isMobile = window.innerWidth < 768;
        const widthFactor = isMobile ? (lang === 'zh' ? 6.5 : 3.5) : (lang === 'zh' ? 5.0 : 2.5);
        s.obstacles.push({
          id: Date.now() + Math.random(),
          x: 110,
          y: 10 + Math.random() * 80,
          text: text,
          width: text.length * widthFactor + (difficulty * 15),
          height: isMobile ? 10 : 7,
          isDanger: Math.random() > 0.4
        });
        s.lastSpawn = time;
      }

      s.obstacles = s.obstacles.map(o => ({ ...o, x: o.x - speed })).filter(o => o.x > -50);
      
      // Collision (Smaller hitboxes for mobile fairness)
      const pBox = { x: 25, y: s.runnerY - 2.5, w: 2, h: 5 };
      for (const o of s.obstacles) {
        if (o.x < 35 && o.x + o.width > 15) {
          if (pBox.x < o.x + o.width && pBox.x + pBox.w > o.x && pBox.y < o.y + o.height && pBox.y + pBox.h > o.y) {
            s.gameOver = true; 
            setGameOver(true); 
            if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
            break;
          }
        }
      }

      if (obstaclesRef.current) {
        obstaclesRef.current.innerHTML = s.obstacles.map(o => `
          <div style="position:absolute; left:${o.x}%; top:${o.y}%; width:${o.width}%; height:${o.height}%;"
               class="flex items-center justify-center border-2 rounded-2xl backdrop-blur-xl ${o.isDanger ? 'bg-red-950/85 border-red-500/70 text-red-100 shadow-[0_0_15px_rgba(239,68,68,0.3)]' : 'bg-slate-900/90 border-blue-500/50 text-blue-100'}">
            <span class="font-black text-[10px] md:text-xs px-2 truncate leading-none uppercase tracking-tighter">${o.text}</span>
          </div>
        `).join('');
      }

      if (Math.floor(s.distance) !== Math.floor(displayDistance)) {
        setDisplayDistance(s.distance);
        const matched = Object.entries(RANKS).reverse().find(([k]) => s.distance >= Number(k));
        if (matched && matched[1].name !== displayRank.name) {
          setDisplayRank(matched[1]);
          setRunnerRankAnimate(true);
          setTimeout(() => setRunnerRankAnimate(false), 2000);
        }
      }
      requestRef.current = requestAnimationFrame(gameLoop);
    };
    requestRef.current = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(requestRef.current!);
  }, [mode, gameOver, gameStarted, lang, displayDistance]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 md:py-24 animate-fade-in relative min-h-screen pb-32">
      
      {/* Rank Promotion Overlay (Full Screen) */}
      {rankAnimate && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center pointer-events-none p-6">
          <div className="bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 text-white p-10 md:p-16 rounded-[3rem] md:rounded-[5rem] shadow-[0_0_200px_rgba(245,158,11,0.7)] animate-pop-up flex flex-col items-center border-4 border-white/30 text-center">
             <Trophy size={140} className="mb-8 text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.6)] animate-bounce" />
             <span className="text-sm font-black uppercase tracking-[0.6em] opacity-80 mb-3">CONGRATULATIONS</span>
             <h2 className="text-5xl md:text-8xl font-black italic serif-font text-white tracking-tighter mb-10 leading-none">
               {lang === 'zh' ? '职级晋升' : 'RANK UP'}
             </h2>
             <div className="bg-white/10 px-8 py-4 rounded-3xl backdrop-blur-md border border-white/20">
                <p className="text-3xl md:text-5xl font-black">{currentTitle}</p>
             </div>
             <div className="mt-12 flex gap-5">
                {[...Array(5)].map((_, i) => <Star key={i} fill="white" size={32} className="animate-pulse" style={{ animationDelay: `${i*150}ms` }} />)}
             </div>
          </div>
        </div>
      )}

      <div className="text-center mb-16">
        {mode !== 'main' && (
          <button onClick={() => setMode('main')} className="mb-10 flex items-center gap-2 mx-auto px-8 py-3 bg-slate-900 text-white rounded-full text-xs font-black uppercase tracking-[0.2em] hover:scale-110 active:scale-95 transition-all shadow-xl">
            <ChevronLeft size={16} /> {t.labBack}
          </button>
        )}
        <h1 className="text-5xl md:text-9xl font-black text-slate-900 mb-8 serif-font italic tracking-tighter uppercase leading-none">{t.labTitle}</h1>
        
        {/* Status Dashboard */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 px-4">
           <div className="w-full md:w-auto px-10 py-5 bg-white border border-slate-100 rounded-[2.5rem] shadow-2xl flex items-center gap-6 group transition-all hover:border-blue-500">
             <div className="p-4 bg-blue-600 rounded-2xl text-white group-hover:rotate-12 transition-transform shadow-xl"><Award size={36} /></div>
             <div className="text-left">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">Career Rank</p>
                <p className="text-2xl md:text-3xl font-black text-slate-900 leading-none">{currentTitle}</p>
             </div>
           </div>
           <div className="w-full md:w-auto flex items-center gap-8 bg-slate-100/40 px-10 py-5 rounded-[2.5rem] border border-slate-200/50 backdrop-blur-sm">
              <div className="text-left">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">Truth Shards</p>
                <p className="text-2xl md:text-3xl font-black text-slate-900 leading-none">{totalCorrect}</p>
              </div>
              <div className="flex-grow w-32 h-4 bg-white rounded-full overflow-hidden border border-slate-200 shadow-inner">
                <div className="h-full bg-blue-600 transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(37,99,235,0.5)]" style={{ width: `${(totalCorrect % 20) * 5}%` }}></div>
              </div>
           </div>
        </div>
      </div>

      {mode === 'main' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
          {[
            { id: 'runner', title: '真相之跃', desc: '在谎言之海中御剑飞行，跨越八阶职级障碍。', icon: <Flame size={40} />, color: 'orange' },
            { id: 'verifier', title: '逻辑拆解', desc: '训练你在精心编排的叙事中，精准识别逻辑陷阱。', icon: <Brain size={40} />, color: 'blue' },
            { id: 'traps', title: '情绪陷阱', desc: '识别 200+ 煽动性标题，建立强大的情感防火墙。', icon: <Target size={40} />, color: 'amber' },
            { id: 'manipulation', title: '真相还原', desc: '模拟新闻审查：从随机出现的涂黑段落推理事实。', icon: <MessageSquare size={40} />, color: 'red' }
          ].map((item) => (
            <button key={item.id} onClick={() => handleModeSelect(item.id as GameMode)} className="group relative bg-white p-10 md:p-12 rounded-[4rem] border border-slate-100 shadow-sm hover:shadow-3xl hover:-translate-y-2 transition-all flex flex-col h-[480px] text-left overflow-hidden active:scale-95">
              <div className={`w-24 h-24 bg-${item.color}-50 text-${item.color}-600 rounded-[2.5rem] flex items-center justify-center mb-10 shadow-lg group-hover:scale-110 group-hover:bg-${item.color}-600 group-hover:text-white transition-all duration-500`}>{item.icon}</div>
              <h3 className="text-3xl font-black mb-6 serif-font leading-tight">{item.title}</h3>
              <p className="text-slate-500 font-medium text-base leading-relaxed mb-10">{item.desc}</p>
              <div className="mt-auto flex items-center justify-between opacity-30 group-hover:opacity-100 transition-all">
                <span className="font-black text-xs uppercase tracking-[0.3em] text-slate-900">Start Mission</span>
                <div className="p-4 bg-slate-900 text-white rounded-full group-hover:bg-blue-600 shadow-xl transition-all"><Send size={24} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /></div>
              </div>
            </button>
          ))}
        </div>
      )}

      {(mode === 'verifier' || mode === 'traps' || mode === 'manipulation') && !gameOver && (
        <div className="max-w-4xl mx-auto space-y-12 animate-fade-in px-2">
          {/* Progress Bar */}
          <div className="mb-14">
            <div className="flex justify-between text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 mb-6">
              <span>Sequence {currentIndex + 1} / {activeQuestions.length}</span>
              <span className="text-blue-600 font-black">{mode.toUpperCase()} ACTIVE</span>
            </div>
            <div className="h-5 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200 shadow-inner">
               <div className="h-full bg-blue-600 transition-all duration-700 ease-out shadow-[0_0_25px_rgba(37,99,235,0.4)]" style={{ width: `${((currentIndex + 1) / activeQuestions.length) * 100}%` }}></div>
            </div>
          </div>

          {/* Question Card */}
          <div className="bg-white p-10 md:p-24 rounded-[4.5rem] md:rounded-[6rem] border border-slate-100 shadow-7xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-24 opacity-[0.02] text-blue-600 rotate-12 pointer-events-none">
               <Brain size={500} />
            </div>

            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-16 leading-[1.3] serif-font tracking-tight">
                 {activeQuestions[currentIndex]?.text}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                {activeQuestions[currentIndex]?.options.map((opt, i) => (
                  <button
                    key={i}
                    disabled={showExplanation}
                    onClick={() => handleAnswer(i)}
                    className={`w-full p-8 md:p-10 text-left rounded-[2.5rem] md:rounded-[3rem] border-2 transition-all font-black text-xl md:text-2xl flex justify-between items-center group
                      ${selectedOption === null ? 'border-slate-50 bg-slate-50 hover:border-blue-500 hover:bg-white active:scale-95' : 
                        i === activeQuestions[currentIndex].answer ? 'border-green-500 bg-green-50 text-green-700 shadow-[0_0_40px_rgba(34,197,94,0.15)]' :
                        selectedOption === i ? 'border-red-500 bg-red-50 text-red-700' : 'border-slate-50 opacity-40'}
                    `}
                  >
                    <span className="flex-1 pr-4">{opt}</span>
                    {showExplanation && i === activeQuestions[currentIndex].answer && (
                      <div className="p-2 bg-green-600 text-white rounded-full shadow-lg"><CheckCircle2 size={32} className="animate-pop-up" /></div>
                    )}
                  </button>
                ))}
              </div>

              {showExplanation && (
                <div className="mt-16 md:mt-24 p-10 md:p-16 bg-slate-950 text-white rounded-[4rem] md:rounded-[5rem] animate-pop-up shadow-7xl border border-white/10 relative">
                  <div className="flex items-center gap-6 mb-10 text-blue-400">
                    <Sparkles size={36} className="animate-pulse" />
                    <span className="font-black uppercase text-base md:text-lg tracking-[0.5em]">真相拆解 / Analysis</span>
                  </div>
                  <p className="text-slate-200 text-xl md:text-3xl leading-relaxed font-medium mb-16 md:mb-20">
                    {activeQuestions[currentIndex]?.explanation}
                  </p>
                  <button onClick={handleNext} className="w-full py-10 md:py-12 bg-blue-600 text-white rounded-[3.5rem] font-black text-2xl md:text-4xl hover:bg-white hover:text-blue-600 transition-all flex items-center justify-center gap-8 shadow-5xl group active:scale-95">
                    {isLoadingMore ? <Loader2 className="animate-spin" /> : (currentIndex < activeQuestions.length - 1 ? '继续挑战 NEXT' : '达成目标 FINISH')} 
                    <Send size={36} className="group-hover:translate-x-5 transition-transform" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Runner Game Integrated (Mobile Perfected) */}
      {mode === 'runner' && (
        <div className="max-w-6xl mx-auto bg-white rounded-[4rem] md:rounded-[7rem] shadow-7xl border border-slate-100 overflow-hidden relative">
          <div className="absolute top-0 left-0 right-0 h-6 md:h-8 bg-slate-900 z-[70] flex items-center overflow-hidden border-b border-white/5">
             <div ref={progressBarRef} className="h-full bg-gradient-to-r from-blue-700 via-cyan-400 to-white transition-all duration-300 shadow-[0_0_35px_rgba(34,211,238,0.9)]"></div>
          </div>
          <div ref={gameRef} className="relative h-[650px] md:h-[850px] bg-slate-950 overflow-hidden cursor-crosshair select-none touch-none"
               style={{ touchAction: 'none' }}
               onPointerDown={(e) => { if(!gameStarted) startGame(); stateRef.current.isDragging=true; }}
               onPointerMove={handlePointerMove}
               onPointerUp={() => stateRef.current.isDragging = false}
               onPointerLeave={() => stateRef.current.isDragging = false}>
            
            <div className="absolute top-20 left-12 md:left-20 z-50 flex flex-col gap-6 pointer-events-none">
              <div className={`px-10 py-5 rounded-[2.5rem] border-2 transition-all duration-700 backdrop-blur-3xl flex items-center gap-6 ${displayRank.bgColor} ${displayRank.shadowColor} ${runnerRankAnimate ? 'scale-110 border-blue-400 shadow-[0_0_80px_rgba(59,130,246,0.7)]' : 'border-white/5'}`}>
                <Award className={runnerRankAnimate ? 'text-blue-500 animate-spin' : 'text-slate-400'} size={48} />
                <div className="flex flex-col">
                  <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest leading-none mb-2">Current Phase</span>
                  <span className={`font-black text-3xl md:text-5xl uppercase tracking-tighter leading-none ${displayRank.color}`}>{displayRank.name}</span>
                </div>
              </div>
            </div>

            <div ref={runnerRef} className="absolute left-[24%] w-36 h-36 md:w-56 md:h-56 flex flex-col items-center justify-center pointer-events-none z-30 transition-none" style={{ transform: 'translateY(-50%)' }}>
               <img src={`data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0zMiA5Nkw2NCAxMTJMOTYgOTZMNjQgODBMMzIgOTZaIiBmaWxsPSIjMjJEM0VFIiBmaWxsLW9wYWNpdHk9IjAuNiIvPgo8cGF0aCBkPSJNMjAgMTAwTDEwOCAxMDBMMTEyIDEwNEwyMCAxMDRMMjAgMTAwWiIgZmlsbD0id2hpdGUiLz4KPGNpcmNsZSBjeD0iNjQiIGN5PSI0OCIgcj0iMjAiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik00NCA3MkM0NCA2MCA4NCA2MCA4NCA3Mkw4NCA4MEw0NCA4MEw0NCA3MloiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik01NiA0NEg3MlY1Mkg1NlY0NFoiIGZpbGw9IiMzQjgyRjYiLz4KPHBhdGggZD0iTTMwIDExMEwxMDAgMTEwIiBzdHJva2U9IiMyMkQzRUUiIHN0cm9rZS13aWR0aD0iNCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtZGFzaGFycmF5PSI4IDQiLz4KPC9zdmc+`} className="w-full h-full object-contain filter drop-shadow-[0_0_35px_rgba(34,211,238,0.8)] scale-x-[-1]" />
            </div>
            
            <div ref={obstaclesRef} className="absolute inset-0 pointer-events-none z-20"></div>

            {!gameStarted && (
              <div className="absolute inset-0 flex flex-col items-center justify-center z-[90] bg-slate-950/80 backdrop-blur-3xl cursor-pointer" onClick={startGame}>
                <div className="bg-slate-900/90 backdrop-blur-3xl p-24 md:p-32 rounded-[7rem] md:rounded-[10rem] border border-white/10 text-white flex flex-col items-center gap-16 md:gap-24 shadow-[0_0_180px_rgba(34,211,238,0.4)] transition-all active:scale-95">
                   <div className="p-20 md:p-28 bg-blue-600 rounded-full animate-pulse shadow-[0_0_100px_rgba(37,99,235,0.7)]"><Play size={100} fill="currentColor" /></div>
                   <div className="text-center">
                      <h2 className="text-7xl md:text-9xl font-black italic serif-font tracking-[0.5em] uppercase leading-none mb-10">御剑 启程</h2>
                      <p className="text-blue-400 font-black text-lg uppercase tracking-[0.4em] opacity-60">纵向滑动避障，跨越真相终局</p>
                   </div>
                </div>
              </div>
            )}

            {gameOver && (
              <div className="absolute inset-0 bg-slate-950/98 flex flex-col items-center justify-center animate-fade-in text-center z-[110] backdrop-blur-3xl p-16 md:p-24">
                <Trophy size={180} className="text-amber-400 mb-16 md:mb-20 animate-bounce shadow-2xl" />
                <h2 className="text-7xl md:text-9xl font-black text-white italic serif-font mb-20 md:mb-24 uppercase tracking-tighter">任务结束 / END</h2>
                <div className="flex flex-col md:flex-row gap-20 md:gap-32 mb-24 md:mb-32">
                  <div className="text-center">
                    <p className="text-slate-500 font-black uppercase tracking-widest text-lg mb-6">Total Distance</p>
                    <p className="text-8xl md:text-[12rem] font-black text-white italic tracking-tighter leading-none">{displayDistance.toFixed(1)}m</p>
                  </div>
                  <div className="text-center">
                    <p className="text-slate-500 font-black uppercase tracking-widest text-lg mb-6">Achievement Rank</p>
                    <p className={`text-8xl md:text-[12rem] font-black italic tracking-tighter leading-none ${displayRank.color}`}>{displayRank.name}</p>
                  </div>
                </div>
                <button onClick={() => handleModeSelect('runner')} className="px-32 py-12 md:py-16 bg-blue-600 text-white rounded-[5rem] font-black text-4xl md:text-6xl shadow-7xl hover:bg-white hover:text-blue-600 transition-all hover:scale-110 active:scale-95">重新出发</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Standard Game Over View */}
      {gameOver && mode !== 'runner' && (
        <div className="max-w-4xl mx-auto bg-white p-24 md:p-32 rounded-[7rem] md:rounded-[9rem] text-center shadow-7xl border border-slate-100 animate-pop-up">
           <div className="p-20 bg-blue-50 inline-block rounded-full mb-16 shadow-inner border border-blue-100">
             <Trophy size={160} className="text-blue-600 animate-bounce" />
           </div>
           <h2 className="text-8xl font-black text-slate-900 serif-font mb-10 leading-none">阶段性大成</h2>
           <p className="text-slate-500 text-4xl font-medium mb-24 leading-relaxed px-4">
             你的真相觉醒度已达到 <span className="text-blue-600 font-black underline decoration-4 underline-offset-8">{currentTitle}</span>。
           </p>
           <button onClick={() => setMode('main')} className="w-full py-12 md:py-16 bg-slate-900 text-white rounded-[5rem] font-black text-4xl md:text-5xl hover:bg-blue-600 transition-all shadow-7xl active:scale-95">
             返回实验室大厅
           </button>
        </div>
      )}
    </div>
  );
};

export default Games;
