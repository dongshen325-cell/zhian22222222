
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { TRANSLATIONS, RANKS, RUNNER_OBSTACLES } from '../constants';
import { LOGIC_DB, TRAP_DB, RESTORATION_DB, getTitleByCorrectCount, QuizQuestion } from '../gameData';
import { Language, RankInfo } from '../types';
import { 
  ChevronLeft, Trophy, Award, Flame, Play, 
  CheckCircle2, Brain, MessageSquare, Send, Loader2, Star, Sparkles, Target,
  RotateCcw, Zap, Info
} from 'lucide-react';

type GameMode = 'main' | 'verifier' | 'traps' | 'manipulation' | 'runner';

/**
 * 赛博记者之鸽 (The Journalist Cyber Dove)
 * 强化了“记者”身份特征：佩戴观察镜、软帽及 PRESS 战术背包
 */
const DoveHero = ({ tilt = 0 }: { tilt?: number }) => (
  <svg width="100%" height="100%" viewBox="0 0 200 200" className="drop-shadow-[0_0_25px_rgba(59,130,246,0.6)]" style={{ transform: `rotate(${tilt}deg)` }}>
    <defs>
      <linearGradient id="dove-body-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#1E293B" />
        <stop offset="100%" stopColor="#3B82F6" />
      </linearGradient>
      <linearGradient id="wing-energy" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#60A5FA" />
        <stop offset="100%" stopColor="#2563EB" opacity="0.4" />
      </linearGradient>
      <filter id="glow-effect">
        <feGaussianBlur stdDeviation="3" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>

    {/* 飞行尾迹：流光粒子 */}
    <g>
      {[...Array(5)].map((_, i) => (
        <circle key={i} r="1.5" fill="#60A5FA">
          <animate attributeName="cx" values="60; -20" dur={`${0.3 + i * 0.1}s`} repeatCount="indefinite" />
          <animate attributeName="cy" values={`${95 + (i-2)*4}; ${95 + (i-2)*6}`} dur={`${0.3 + i * 0.1}s`} repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.8;0" dur={`${0.3 + i * 0.1}s`} repeatCount="indefinite" />
        </circle>
      ))}
    </g>

    {/* 核心：赛博鸽子主体 */}
    <g filter="url(#glow-effect)">
      {/* 动态主翼 */}
      <path d="M100 85 C70 30, 10 50, 5 85 C25 90, 70 90, 100 85" fill="url(#wing-energy)">
        <animate attributeName="d" 
          values="M100 85 C70 30, 10 50, 5 85 C25 90, 70 90, 100 85;
                  M100 85 C70 0, 10 10, 5 50 C25 60, 70 80, 100 85;
                  M100 85 C70 30, 10 50, 5 85 C25 90, 70 90, 100 85" 
          dur="0.3s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.2 1; 0.4 0 0.2 1" />
      </path>

      {/* 身体与战术背包 */}
      <path d="M85 95 C85 75, 125 75, 135 90 L145 95 C150 100, 140 120, 130 120 C105 120, 85 115, 85 95" fill="url(#dove-body-grad)" />
      
      {/* 战术背包/身份带 (PRESS Sash) */}
      <path d="M105 82 L125 115" stroke="#F59E0B" strokeWidth="4" opacity="0.8" />
      <rect x="110" y="95" width="16" height="10" rx="2" fill="#F59E0B" />
      <text x="111" y="102" fill="white" fontSize="4" fontWeight="900" fontFamily="sans-serif">PRESS</text>

      {/* 头部细节：记者帽与观察镜 */}
      <circle cx="142" cy="95" r="14" fill="#1E293B" />
      {/* 记者软帽剪影 */}
      <path d="M130 85 Q142 75, 154 85 L152 88 Q142 82, 132 88 Z" fill="#334155" />
      {/* 赛博观察镜 (Lens) */}
      <circle cx="148" cy="94" r="5" fill="#0F172A" stroke="#22D3EE" strokeWidth="1" />
      <circle cx="149" cy="93" r="1.5" fill="#22D3EE">
        <animate attributeName="opacity" values="1;0.2;1" dur="1.2s" repeatCount="indefinite" />
      </circle>
    </g>

    {/* 衔着的真相钢笔 */}
    <g transform="translate(148, 102) rotate(10)">
      <path d="M0 0 L35 4 L30 10 L-5 6 Z" fill="#F59E0B" filter="url(#glow-effect)" />
      <path d="M35 4 L48 6 L35 8 Z" fill="#FDE68A" />
      <circle cx="48" cy="6" r="2" fill="white">
        <animate attributeName="r" values="1;4;1" dur="0.6s" repeatCount="indefinite" />
      </circle>
    </g>
  </svg>
);

const Games: React.FC<{ lang: Language }> = ({ lang }) => {
  const t = TRANSLATIONS[lang];
  const [mode, setMode] = useState<GameMode>('main');
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  
  const [totalCorrect, setTotalCorrect] = useState(() => parseInt(localStorage.getItem('zhian_total_correct') || '0'));
  const [activeQuestions, setActiveQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [rankAnimate, setRankAnimate] = useState(false);

  const [displayDistance, setDisplayDistance] = useState(0);
  const [displayRank, setDisplayRank] = useState<RankInfo>(RANKS[0]);
  const [runnerRankAnimate, setRunnerRankAnimate] = useState(false);

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

    if (newMode === 'verifier') setActiveQuestions(shuffle(LOGIC_DB));
    else if (newMode === 'traps') setActiveQuestions(shuffle(TRAP_DB));
    else if (newMode === 'manipulation') setActiveQuestions(shuffle(RESTORATION_DB));
  };

  const handleAnswer = (idx: number) => {
    setSelectedOption(idx);
    setShowExplanation(true);
    if (idx === activeQuestions[currentIndex].answer) {
      const newTotal = totalCorrect + 1;
      setTotalCorrect(newTotal);
      localStorage.setItem('zhian_total_correct', newTotal.toString());
      if (newTotal > 0 && newTotal % 20 === 0) {
        setRankAnimate(true);
        if (navigator.vibrate) navigator.vibrate(200);
        setTimeout(() => setRankAnimate(false), 3000);
      }
    }
  };

  const handleNext = () => {
    const nextIdx = currentIndex + 1;
    if (nextIdx < activeQuestions.length) {
      setCurrentIndex(nextIdx);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      setGameOver(true);
    }
  };

  const currentTitle = getTitleByCorrectCount(totalCorrect);

  const gameRef = useRef<HTMLDivElement>(null);
  const obstaclesRef = useRef<HTMLDivElement>(null);
  const runnerRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef({
    distance: 0,
    runnerY: 50,
    targetY: 50,
    obstacles: [] as any[],
    lastSpawn: 0,
    isDragging: false,
    gameOver: false,
    active: false,
    tilt: 0
  });
  const requestRef = useRef<number>(null);

  const startRunner = () => {
    setGameStarted(true);
    setGameOver(false);
    stateRef.current = {
      distance: 0,
      runnerY: 50,
      targetY: 50,
      obstacles: [],
      lastSpawn: 0,
      isDragging: false,
      gameOver: false,
      active: true,
      tilt: 0
    };
    setDisplayDistance(0);
  };

  // 手机端优化：更精准的垂直坐标捕获
  const handlePointerMove = (e: React.PointerEvent) => {
    if (!stateRef.current.isDragging || !gameRef.current) return;
    const rect = gameRef.current.getBoundingClientRect();
    const clientY = e.clientY || (e as any).touches?.[0]?.clientY;
    const y = ((clientY - rect.top) / rect.height) * 100;
    stateRef.current.targetY = Math.max(12, Math.min(88, y));
  };

  useEffect(() => {
    if (mode !== 'runner' || gameOver || !gameStarted) return;
    
    const gameLoop = (time: number) => {
      const s = stateRef.current;
      if (s.gameOver || !s.active) return;

      const difficulty = s.distance / 100;
      // 手机端稍微降低基础速度，增加容错率
      const speed = 0.75 + Math.pow(difficulty, 2) * 1.5;
      s.distance += 0.014;
      
      if (s.distance >= 100) {
        s.gameOver = true;
        setGameOver(true);
        return;
      }

      const prevY = s.runnerY;
      s.runnerY += (s.targetY - s.runnerY) * 0.24; // 增加平滑跟随
      s.tilt = (s.runnerY - prevY) * 5;

      if (runnerRef.current) {
        runnerRef.current.style.top = `${s.runnerY}%`;
        runnerRef.current.style.transform = `translateY(-50%) rotate(${s.tilt}deg)`;
      }
      if (progressBarRef.current) progressBarRef.current.style.width = `${s.distance}%`;

      const spawnRate = Math.max(280, 850 - (difficulty * 600));
      if (time - s.lastSpawn > spawnRate) {
        const pool = RUNNER_OBSTACLES[lang][Math.random() > 0.5 ? 'top' : 'bottom'];
        const text = pool[Math.floor(Math.random() * pool.length)];
        const isMobile = window.innerWidth < 768;
        
        s.obstacles.push({
          id: Date.now() + Math.random(),
          x: 120,
          y: 10 + Math.random() * 80,
          text: text,
          // 根据手机屏宽调整障碍物比例
          width: isMobile ? 38 : 22,
          height: isMobile ? 10 : 8,
          isDanger: Math.random() > 0.4
        });
        s.lastSpawn = time;
      }

      s.obstacles = s.obstacles.map(o => ({ ...o, x: o.x - speed })).filter(o => o.x > -80);
      
      // 缩小碰撞体积中心，使游戏体验更公平
      const pBox = { x: 28, y: s.runnerY - 4, w: 8, h: 8 };
      for (const o of s.obstacles) {
        if (o.x < 45 && o.x + o.width > 22) {
          if (pBox.x < o.x + o.width && pBox.x + pBox.w > o.x && pBox.y < o.y + o.height && pBox.y + pBox.h > o.y) {
            s.gameOver = true;
            setGameOver(true);
            if (navigator.vibrate) navigator.vibrate([150, 100]);
            break;
          }
        }
      }

      if (obstaclesRef.current) {
        obstaclesRef.current.innerHTML = s.obstacles.map(o => `
          <div style="position:absolute; left:${o.x}%; top:${o.y}%; width:${o.width}%; height:${o.height}%;"
               class="flex items-center justify-center border-2 rounded-2xl md:rounded-[2rem] backdrop-blur-2xl shadow-xl transition-transform duration-300 ${o.isDanger ? 'bg-red-950/85 border-red-500/70 text-red-100' : 'bg-slate-900/90 border-blue-500/50 text-blue-50'}">
            <span class="font-black text-[11px] md:text-lg px-4 truncate uppercase tracking-tighter italic">${o.text}</span>
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
  }, [mode, gameOver, gameStarted, lang, displayDistance, displayRank.name]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-24 animate-fade-in relative min-h-screen pb-20 overflow-hidden">
      
      {/* 晋升全屏动画 - 手机优化 */}
      {rankAnimate && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-2xl">
          <div className="bg-gradient-to-br from-blue-700 to-indigo-950 text-white p-10 md:p-32 rounded-[4rem] md:rounded-[8rem] shadow-7xl animate-pop-up text-center border-2 border-white/20 w-full max-w-lg">
             <Trophy size={80} className="mx-auto mb-8 text-amber-400 animate-bounce md:w-32 md:h-32" />
             <span className="text-xs font-black uppercase tracking-[0.6em] text-blue-300 mb-6 block">Rank Promoted</span>
             <h2 className="text-4xl md:text-8xl font-black serif-font italic tracking-tighter mb-10">{currentTitle}</h2>
             <div className="flex gap-4 justify-center">
                {[...Array(3)].map((_, i) => <Sparkles key={i} className="text-white animate-pulse" size={24} />)}
             </div>
          </div>
        </div>
      )}

      {/* 顶部状态栏 - 紧凑型 */}
      <div className={`text-center transition-all duration-500 ${mode !== 'main' ? 'mb-8 md:mb-16' : 'mb-16 md:mb-28'}`}>
        {mode !== 'main' && (
          <button onClick={() => setMode('main')} className="mb-6 flex items-center gap-3 mx-auto px-8 py-3 bg-slate-900 text-white rounded-full text-xs font-black uppercase tracking-widest hover:bg-blue-600 transition-all border border-white/10">
            <ChevronLeft size={16} /> {t.labBack}
          </button>
        )}
        
        <h1 className={`font-black text-slate-900 serif-font italic tracking-tighter uppercase leading-none transition-all ${mode !== 'main' ? 'text-4xl md:text-9xl mb-6' : 'text-6xl md:text-[10rem] mb-12'}`}>
          {t.labTitle}
        </h1>
        
        {/* 数据面板 - 竖屏优化 */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-10 px-4">
           <div className="w-full md:w-auto px-8 py-5 bg-white border border-slate-100 rounded-[2rem] shadow-xl flex items-center gap-5">
             <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-lg"><Award size={20} /></div>
             <div className="text-left">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Clearance</p>
                <p className="text-lg md:text-2xl font-black text-slate-900 leading-none">{currentTitle}</p>
             </div>
           </div>
           <div className="w-full md:w-auto flex items-center gap-6 bg-slate-100/60 px-8 py-5 rounded-[2rem] border border-slate-200/50 backdrop-blur-md">
              <div className="text-left">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Truth Shards</p>
                <p className="text-lg md:text-2xl font-black text-slate-900 leading-none">{totalCorrect}</p>
              </div>
              <div className="w-24 md:w-40 h-3 bg-white rounded-full overflow-hidden border border-slate-200">
                <div className="h-full bg-blue-500 rounded-full transition-all duration-1000" style={{ width: `${(totalCorrect % 20) * 5}%` }}></div>
              </div>
           </div>
        </div>
      </div>

      {/* 模块选择菜单 */}
      {mode === 'main' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
          {[
            { id: 'runner', title: '真相之跃', desc: '扮演王牌信使，衔笔穿梭在信息铁幕中。', icon: <Flame size={32} />, color: 'blue' },
            { id: 'verifier', title: '逻辑拆解', desc: '识别权威话术中的逻辑陷阱与谎言。', icon: <Brain size={32} />, color: 'indigo' },
            { id: 'traps', title: '情绪陷阱', desc: '警惕针对性情感操纵，保持客观洞察。', icon: <Target size={32} />, color: 'amber' },
            { id: 'manipulation', title: '真相还原', desc: '从重重审查的档案中，拼凑出历史原貌。', icon: <MessageSquare size={32} />, color: 'slate' }
          ].map((item) => (
            <button key={item.id} onClick={() => handleModeSelect(item.id as GameMode)} className="group bg-white p-8 md:p-12 rounded-[3.5rem] border border-slate-100 shadow-xl hover:shadow-4xl transition-all flex flex-col text-left active:scale-95">
              <div className={`w-16 h-16 md:w-20 md:h-20 bg-${item.color}-50 text-${item.color}-600 rounded-[1.5rem] md:rounded-[2.5rem] flex items-center justify-center mb-8 group-hover:bg-${item.color}-600 group-hover:text-white transition-all shadow-sm`}>{item.icon}</div>
              <h3 className="text-2xl md:text-4xl font-black mb-4 serif-font">{item.title}</h3>
              <p className="text-slate-500 font-medium text-sm md:text-lg leading-relaxed mb-8">{item.desc}</p>
              <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between opacity-30 group-hover:opacity-100 transition-opacity">
                <span className="font-black text-[10px] uppercase tracking-widest">Connect...</span>
                <Send size={18} />
              </div>
            </button>
          ))}
        </div>
      )}

      {/* 游戏区域 - 高度响应式适配 */}
      {mode === 'runner' && (
        <div className="max-w-5xl mx-auto bg-slate-950 rounded-[2.5rem] md:rounded-[5rem] shadow-7xl border border-white/10 overflow-hidden relative">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-white/5 z-50">
             <div ref={progressBarRef} className="h-full bg-blue-500 shadow-[0_0_15px_#3b82f6] transition-all duration-300"></div>
          </div>

          <div 
            ref={gameRef} 
            className="relative h-[65vh] md:h-[750px] bg-slate-950 overflow-hidden touch-none select-none cursor-crosshair"
            style={{ touchAction: 'none' }}
            onPointerDown={(e) => { 
              if(!gameStarted) startRunner(); 
              stateRef.current.isDragging = true; 
              handlePointerMove(e); 
            }}
            onPointerMove={handlePointerMove}
            onPointerUp={() => stateRef.current.isDragging = false}
            onPointerLeave={() => stateRef.current.isDragging = false}
          >
            {/* 实时看板 - 手机缩小版 */}
            <div className="absolute top-8 left-6 md:top-14 md:left-10 z-40 pointer-events-none">
              <div className={`px-5 py-3 md:px-8 md:py-5 rounded-2xl md:rounded-[2.5rem] border backdrop-blur-3xl flex items-center gap-4 transition-all duration-500 ${displayRank.bgColor} ${displayRank.shadowColor} ${runnerRankAnimate ? 'scale-110 border-blue-400' : 'border-white/10'}`}>
                <Zap className={runnerRankAnimate ? 'text-blue-400 animate-pulse' : 'text-slate-700'} size={20} />
                <div className="flex flex-col">
                  <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Status</span>
                  <span className={`font-black text-sm md:text-2xl uppercase ${displayRank.color}`}>{displayRank.name}</span>
                </div>
              </div>
            </div>

            {/* 信使鸽 Sprite */}
            <div ref={runnerRef} className="absolute left-[15%] w-32 h-32 md:w-56 md:h-56 flex items-center justify-center pointer-events-none z-30 transition-none" style={{ transform: 'translateY(-50%)' }}>
               <DoveHero tilt={stateRef.current.tilt} />
            </div>
            
            <div ref={obstaclesRef} className="absolute inset-0 pointer-events-none z-20"></div>

            {/* 准备界面 - 移动端全屏覆盖 */}
            {!gameStarted && !gameOver && (
              <div className="absolute inset-0 flex flex-col items-center justify-center z-[100] bg-slate-950/90 backdrop-blur-xl cursor-pointer p-6" onClick={startRunner}>
                <div className="w-full max-w-sm p-12 rounded-[3rem] border border-white/10 text-center flex flex-col items-center gap-8 shadow-8xl bg-slate-900/50">
                   <div className="w-24 h-24 bg-blue-600 rounded-[2rem] flex items-center justify-center animate-pulse shadow-4xl">
                    <Play size={48} className="text-white ml-2" fill="currentColor" />
                   </div>
                   <div className="space-y-4">
                      <h2 className="text-4xl md:text-7xl font-black text-white serif-font tracking-tighter italic uppercase">真理之跃</h2>
                      <p className="text-blue-400 font-black text-[10px] md:text-base uppercase tracking-[0.4em] opacity-80">滑动操控信使，撕裂虚假信息的铁幕</p>
                   </div>
                </div>
              </div>
            )}

            {/* 失败结算 - 竖屏优化 */}
            {gameOver && (
              <div className="absolute inset-0 bg-slate-950/98 flex flex-col items-center justify-center z-[110] backdrop-blur-3xl p-6 animate-fade-in">
                <div className="max-w-md w-full text-center space-y-8">
                  <Trophy size={80} className="text-amber-500 mx-auto drop-shadow-2xl" />
                  
                  <div className="space-y-3">
                    <h2 className="text-4xl md:text-8xl font-black text-white serif-font italic tracking-tighter uppercase leading-none">Lost Link</h2>
                    <p className="text-slate-500 font-black text-[9px] uppercase tracking-[0.6em]">Encrypted data synchronizing...</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 p-6 rounded-[2rem] border border-white/10">
                      <p className="text-[9px] text-slate-500 font-black uppercase mb-2">Distance</p>
                      <p className="text-3xl font-black text-white">{displayDistance.toFixed(1)}<span className="text-xs ml-1 text-slate-500">m</span></p>
                    </div>
                    <div className="bg-white/5 p-6 rounded-[2rem] border border-white/10">
                      <p className="text-[9px] text-slate-500 font-black uppercase mb-2">Rank</p>
                      <p className={`text-xl font-black ${displayRank.color}`}>{displayRank.name}</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 pt-6">
                    <button 
                      onClick={startRunner} 
                      className="w-full py-6 bg-blue-600 text-white rounded-[2rem] font-black text-xl flex items-center justify-center gap-5 hover:bg-white hover:text-blue-600 transition-all shadow-4xl"
                    >
                      <RotateCcw size={24} /> RE-IGNITE
                    </button>
                    <button 
                      onClick={() => setMode('main')} 
                      className="w-full py-4 bg-slate-900/60 text-slate-500 rounded-[2rem] font-black text-[10px] uppercase tracking-widest border border-white/5"
                    >
                      ABORT & EXIT
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 问答模式 - 移动端间距调整 */}
      {(mode === 'verifier' || mode === 'traps' || mode === 'manipulation') && !gameOver && (
        <div className="max-w-4xl mx-auto space-y-10 animate-fade-in px-2">
          <div className="mb-8">
            <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-4">
              <span>Investigation {currentIndex + 1} / {activeQuestions.length}</span>
              <span className="text-blue-600">{mode.toUpperCase()}</span>
            </div>
            <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200 p-0.5">
               <div className="h-full bg-blue-600 rounded-full transition-all duration-700" style={{ width: `${((currentIndex + 1) / activeQuestions.length) * 100}%` }}></div>
            </div>
          </div>

          <div className="bg-white p-8 md:p-24 rounded-[3.5rem] md:rounded-[6rem] border border-slate-100 shadow-5xl">
            <h2 className="text-2xl md:text-5xl font-black text-slate-900 mb-12 leading-tight serif-font">
               {activeQuestions[currentIndex]?.text}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
              {activeQuestions[currentIndex]?.options.map((opt, i) => (
                <button
                  key={i}
                  disabled={showExplanation}
                  onClick={() => handleAnswer(i)}
                  className={`w-full p-6 md:p-10 text-left rounded-[2rem] md:rounded-[3rem] border-2 transition-all font-black text-lg md:text-2xl
                    ${selectedOption === null ? 'border-slate-50 bg-slate-50 hover:border-blue-500 hover:bg-white' : 
                      i === activeQuestions[currentIndex].answer ? 'border-green-500 bg-green-50 text-green-700' :
                      selectedOption === i ? 'border-red-500 bg-red-50 text-red-700' : 'border-slate-50 opacity-20'}
                  `}
                >
                  {opt}
                </button>
              ))}
            </div>
            
            {showExplanation && (
              <div className="mt-12 p-8 md:p-16 bg-slate-950 text-white rounded-[3rem] animate-pop-up shadow-6xl">
                <div className="flex items-center gap-4 mb-6 text-blue-400 font-black uppercase text-[10px] tracking-widest">
                  <Info size={18} /> Field Intelligence
                </div>
                <p className="text-slate-300 text-lg md:text-3xl leading-relaxed mb-10 font-medium italic">
                  {activeQuestions[currentIndex]?.explanation}
                </p>
                <button onClick={handleNext} className="w-full py-6 md:py-10 bg-blue-600 text-white rounded-[2rem] font-black text-xl md:text-4xl hover:bg-white hover:text-blue-600 transition-all flex items-center justify-center gap-6 active:scale-95 shadow-3xl">
                  {currentIndex < activeQuestions.length - 1 ? 'PROCEED' : 'REVEAL TRUTH'} 
                  <Send size={24} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 模块达成展示 - 竖屏优化 */}
      {gameOver && mode !== 'runner' && (
        <div className="max-w-3xl mx-auto bg-white p-12 md:p-32 rounded-[4rem] md:rounded-[8rem] text-center shadow-7xl border border-slate-50 animate-pop-up">
           <Trophy size={80} className="text-blue-600 mx-auto mb-10 md:w-40 md:h-40" />
           <h2 className="text-4xl md:text-8xl font-black text-slate-900 serif-font mb-6 tracking-tighter uppercase">Mission Success</h2>
           <p className="text-slate-500 text-xl md:text-4xl font-medium mb-16 leading-relaxed">
             认知防火墙已加固，职级：<br/>
             <span className="text-blue-600 font-black text-3xl md:text-7xl italic mt-6 block tracking-tighter">{currentTitle}</span>
           </p>
           <button onClick={() => setMode('main')} className="w-full py-7 bg-slate-950 text-white rounded-[2.5rem] font-black text-xl md:text-4xl hover:bg-blue-600 transition-all active:scale-95 shadow-5xl">
             返回核心终端
           </button>
        </div>
      )}
    </div>
  );
};

export default Games;
