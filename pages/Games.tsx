
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { getMockNews, TRANSLATIONS, RANKS, RUNNER_OBSTACLES } from '../constants';
import { Language, NewsItem, RankInfo } from '../types';
import { 
  Gamepad2, Check, X, ArrowRight, RefreshCw, Trophy, 
  Sparkles, MousePointer2, Scissors, Info, Share2, 
  AlertTriangle, Lock, PartyPopper, ChevronLeft, Loader2, Zap, Flame,
  Search, Eye, EyeOff, Hash, Newspaper, Terminal, User, Camera, Shield,
  FastForward, Award, Wind, Star, Sword
} from 'lucide-react';

type GameMode = 'main' | 'verifier' | 'traps' | 'manipulation' | 'runner';

interface Obstacle {
  id: number;
  x: number;
  y: number;
  text: string;
  width: number;
  height: number;
  isDanger: boolean;
}

const Games: React.FC<{ lang: Language }> = ({ lang }) => {
  const t = TRANSLATIONS[lang];
  
  const [mode, setMode] = useState<GameMode>('main');
  const [gameOver, setGameOver] = useState(false);
  const [loadingAi, setLoadingAi] = useState(false);
  
  // UI States (Separated from physics for performance)
  const [displayDistance, setDisplayDistance] = useState(0);
  const [displayRank, setDisplayRank] = useState<RankInfo>(RANKS[0]);
  const [rankAnimate, setRankAnimate] = useState(false);
  const [charUrl, setCharUrl] = useState<string | null>(null);

  // Performance Critical Refs
  const gameRef = useRef<HTMLDivElement>(null);
  const runnerRef = useRef<HTMLDivElement>(null);
  const obstaclesContainerRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef({
    distance: 0,
    runnerY: 50,
    targetY: 50,
    obstacles: [] as Obstacle[],
    lastSpawn: 0,
    isDragging: false,
    gameOver: false,
  });
  const requestRef = useRef<number>(null);

  const fetchCharacter = async () => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
      const prompt = "Transparent background cartoon hero journalist standing majestically on a glowing blue digital sword. Anime style, vibrant, high quality, white background.";
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ text: prompt }] },
        config: { imageConfig: { aspectRatio: "1:1" } }
      });
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          setCharUrl(`data:image/png;base64,${part.inlineData.data}`);
          break;
        }
      }
    } catch (e) {
      console.error("Char failed", e);
    }
  };

  const handleModeSelect = (newMode: GameMode) => {
    setMode(newMode);
    setGameOver(false);
    stateRef.current = {
      distance: 0,
      runnerY: 50,
      targetY: 50,
      obstacles: [],
      lastSpawn: 0,
      isDragging: false,
      gameOver: false,
    };
    setDisplayDistance(0);
    setDisplayRank(RANKS[0]);
    if (newMode === 'runner' && !charUrl) fetchCharacter();
  };

  // High-Performance Game Loop
  useEffect(() => {
    if (mode !== 'runner' || gameOver) return;

    const gameLoop = (time: number) => {
      const s = stateRef.current;
      if (s.gameOver) return;

      // 1. Update Distance & Speed
      const difficulty = s.distance / 100;
      const speed = 0.55 + Math.pow(difficulty, 2.5) * 6.5;
      s.distance += 0.009;
      
      if (s.distance >= 100) {
        s.gameOver = true;
        setGameOver(true);
        return;
      }

      // 2. Linear Interpolation for Smooth Movement
      s.runnerY += (s.targetY - s.runnerY) * 0.18; // Silk smooth lag-free movement
      if (runnerRef.current) {
        runnerRef.current.style.top = `${s.runnerY}%`;
      }

      // 3. Obstacle Management
      if (time - s.lastSpawn > (400 - difficulty * 150)) {
        const pool = [...RUNNER_OBSTACLES[lang].top, ...RUNNER_OBSTACLES[lang].bottom];
        const text = pool[Math.floor(Math.random() * pool.length)];
        const baseWidth = lang === 'zh' ? text.length * 4.2 : text.length * 1.5;
        
        s.obstacles.push({
          id: Date.now() + Math.random(),
          x: 120,
          y: 5 + Math.random() * 85,
          text: text,
          width: baseWidth + (difficulty * 10),
          height: 6 + (difficulty * 2),
          isDanger: Math.random() > 0.4
        });
        s.lastSpawn = time;
      }

      // 4. Move and Physics
      s.obstacles = s.obstacles.map(o => ({ ...o, x: o.x - speed })).filter(o => o.x > -50);

      // 5. Precision Collision Check
      // We only check the small center of the character image to avoid invisible hits
      const playerHitbox = { x: 20 + 3, y: s.runnerY - 3.5, w: 2.5, h: 7 };
      for (const o of s.obstacles) {
        // Only check if it's in the strike zone
        if (o.x < 40 && o.x + o.width > 15) {
          const oBox = { x: o.x, y: o.y, w: o.width, h: o.height };
          if (
            playerHitbox.x < oBox.x + oBox.w &&
            playerHitbox.x + playerHitbox.w > oBox.x &&
            playerHitbox.y < oBox.y + oBox.h &&
            playerHitbox.y + playerHitbox.h > oBox.y
          ) {
            s.gameOver = true;
            setGameOver(true);
            break;
          }
        }
      }

      // 6. Manual DOM Injection (Avoids React re-render bottleneck)
      if (obstaclesContainerRef.current) {
        obstaclesContainerRef.current.innerHTML = s.obstacles.map(o => `
          <div style="position:absolute; left:${o.x}%; top:${o.y}%; width:${o.width}%; height:${o.height}%;"
               class="flex items-center justify-center border rounded-xl backdrop-blur-md transition-colors ${o.isDanger ? 'bg-red-950/80 border-red-500/50 text-red-100 shadow-[0_0_20px_rgba(239,68,68,0.2)]' : 'bg-slate-900/90 border-blue-500/40 text-blue-100'}">
            <span class="font-black text-[10px] md:text-xs px-2 truncate leading-none">${o.text}</span>
          </div>
        `).join('');
      }

      // 7. Slow UI Updates
      if (Math.floor(s.distance) !== Math.floor(displayDistance)) {
        setDisplayDistance(s.distance);
        const matched = Object.entries(RANKS).reverse().find(([k]) => s.distance >= Number(k));
        if (matched && matched[1].name !== displayRank.name) {
          setDisplayRank(matched[1]);
          setRankAnimate(true);
          setTimeout(() => setRankAnimate(false), 2000);
        }
      }

      requestRef.current = requestAnimationFrame(gameLoop);
    };

    requestRef.current = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(requestRef.current!);
  }, [mode, gameOver, lang, displayDistance, displayRank.name]);

  const onPointerMove = (e: React.PointerEvent) => {
    if (!stateRef.current.isDragging || gameOver) return;
    if (gameRef.current) {
      const rect = gameRef.current.getBoundingClientRect();
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      stateRef.current.targetY = Math.min(Math.max(y, 10), 90);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 md:py-24 animate-fade-in relative min-h-screen">
      <div className="text-center mb-16">
        {mode !== 'main' && (
          <button onClick={() => setMode('main')} className="group mb-8 flex items-center gap-2 mx-auto px-6 py-2 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:scale-105 transition-all">
            <ChevronLeft size={16} /> {t.labBack}
          </button>
        )}
        <h1 className="text-5xl md:text-8xl font-black text-slate-900 mb-6 serif-font tracking-tighter">{t.labTitle}</h1>
        <p className="text-slate-500 max-w-2xl mx-auto text-lg font-medium">{t.labSub}</p>
      </div>

      {mode === 'main' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { id: 'runner', title: lang === 'zh' ? '真相之跃' : 'Leap of Truth', desc: lang === 'zh' ? '御剑躲避信息的迷雾，只有坚持到最后的人才能见证真相。' : 'Swerve through the noise of deception.', icon: <Flame size={32} />, color: 'orange' },
            { id: 'verifier', title: t.gameVerifierTitle, desc: t.gameVerifierDesc, icon: <Zap size={32} />, color: 'blue' },
            { id: 'traps', title: t.gameTrapsTitle, desc: t.gameTrapsDesc, icon: <Eye size={32} />, color: 'amber' },
            { id: 'manipulation', title: t.gameManipulationTitle, desc: t.gameManipulationDesc, icon: <Terminal size={32} />, color: 'red' }
          ].map((item) => (
            <button key={item.id} onClick={() => handleModeSelect(item.id as GameMode)} className="group relative bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all flex flex-col h-[400px] text-left">
              <div className={`w-16 h-16 bg-${item.color}-50 text-${item.color}-600 rounded-2xl flex items-center justify-center mb-10 shadow-lg`}>{item.icon}</div>
              <h3 className="text-2xl font-black mb-4 serif-font">{item.title}</h3>
              <p className="text-slate-500 font-medium text-sm leading-relaxed mb-10">{item.desc}</p>
              <div className="mt-auto font-black text-[10px] uppercase tracking-widest text-slate-400 group-hover:text-slate-900">START MISSION →</div>
            </button>
          ))}
        </div>
      )}

      {mode === 'runner' && (
        <div className="max-w-5xl mx-auto bg-white rounded-[4rem] shadow-4xl border border-slate-100 overflow-hidden relative">
          <div 
            ref={gameRef} 
            className="relative h-[650px] bg-slate-950 overflow-hidden cursor-crosshair select-none touch-none"
            onPointerDown={() => stateRef.current.isDragging = true}
            onPointerUp={() => stateRef.current.isDragging = false}
            onPointerLeave={() => stateRef.current.isDragging = false}
            onPointerMove={onPointerMove}
          >
            {/* HUD */}
            <div className="absolute top-8 left-8 z-50 flex flex-col gap-3 pointer-events-none">
              <div className={`px-6 py-3 rounded-2xl border-2 transition-all duration-700 backdrop-blur-md flex items-center gap-4 ${displayRank.bgColor} ${displayRank.shadowColor} ${rankAnimate ? 'scale-110 border-blue-400' : 'border-white/5'}`}>
                <Award className={rankAnimate ? 'text-blue-500 animate-spin' : 'text-slate-400'} size={24} />
                <div className="flex flex-col">
                  <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-0.5">Player Title</span>
                  <span className={`font-black text-lg uppercase tracking-tighter ${displayRank.color}`}>{displayRank.name}</span>
                </div>
              </div>
              <div className="px-5 py-2 bg-white/5 border border-white/10 rounded-xl backdrop-blur-sm text-white font-black italic">{displayDistance.toFixed(1)}m</div>
            </div>

            {/* Background Grid */}
            <div className="absolute inset-0 opacity-[0.08] z-10" style={{ background: 'linear-gradient(90deg, #3b82f6 1px, transparent 1px), linear-gradient(#3b82f6 1px, transparent 1px)', backgroundSize: '60px 60px', transform: `translateX(-${(displayDistance * 1200) % 60}px)` }}></div>

            {/* Runner */}
            <div 
              ref={runnerRef}
              className="absolute left-[20%] w-32 h-32 flex flex-col items-center justify-center pointer-events-none z-30"
              style={{ transform: 'translateY(-50%)' }}
            >
               <div className="relative">
                  <div className="relative z-20 w-28 h-28">
                     {charUrl ? <img src={charUrl} alt="Truth Seeker" className="w-full h-full object-contain mix-blend-screen" /> : <Loader2 className="animate-spin text-blue-500 mx-auto mt-10" />}
                  </div>
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-44 h-4 bg-gradient-to-r from-transparent via-cyan-400 to-transparent rounded-full blur-[2px] shadow-[0_0_40px_rgba(34,211,238,0.8)]"></div>
                  <div className="absolute top-1/2 left-0 -translate-x-full -translate-y-1/2 flex flex-col gap-1.5 opacity-60">
                     <div className="w-32 h-1 bg-cyan-500 blur-md animate-pulse"></div>
                     <div className="w-24 h-1 bg-blue-400 blur-md" style={{ animationDelay: '0.2s' }}></div>
                  </div>
               </div>
            </div>

            {/* High Perf Obstacles */}
            <div ref={obstaclesContainerRef} className="absolute inset-0 pointer-events-none z-20"></div>

            {gameOver && (
              <div className="absolute inset-0 bg-slate-950/98 flex flex-col items-center justify-center animate-fade-in p-8 text-center z-[100] backdrop-blur-3xl">
                <div className="mb-10 p-10 bg-slate-900 rounded-[3rem] border border-blue-600/20">
                  {displayDistance >= 100 ? <Trophy size={140} className="text-amber-400 animate-bounce" /> : <Shield size={100} className="text-red-500 opacity-60" />}
                </div>
                <h2 className="text-7xl md:text-9xl font-black text-white serif-font mb-12 uppercase italic">
                  {displayDistance >= 100 ? (lang === 'zh' ? '剑证传奇' : 'LEGEND BORN') : (lang === 'zh' ? '使命未达' : 'FAILED')}
                </h2>
                <div className="flex gap-24 mb-16">
                   <div className="text-center">
                      <p className="text-slate-500 text-xs font-black uppercase tracking-[0.5em] mb-4">Final Distance</p>
                      <p className="text-7xl font-black text-white italic">{displayDistance.toFixed(1)}m</p>
                   </div>
                   <div className="text-center">
                      <p className="text-slate-500 text-xs font-black uppercase tracking-[0.5em] mb-4">Final Title</p>
                      <p className={`text-7xl font-black italic ${displayRank.color}`}>{displayRank.name}</p>
                   </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-8">
                  <button onClick={() => handleModeSelect('runner')} className="px-24 py-8 bg-blue-600 text-white rounded-[3rem] font-black text-3xl flex items-center gap-6 hover:bg-white hover:text-blue-600 transition-all shadow-4xl active:scale-95">
                    <RefreshCw size={36} /> {t.gameRestart}
                  </button>
                  <button onClick={() => setMode('main')} className="px-16 py-8 bg-slate-800 text-slate-300 rounded-[3rem] font-black text-2xl flex items-center gap-4">
                    <ChevronLeft size={32} /> {t.labBack}
                  </button>
                </div>
              </div>
            )}

            {/* Guide */}
            {displayDistance < 3 && !gameOver && (
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-50">
                <div className="bg-slate-900/60 backdrop-blur-3xl px-20 py-16 rounded-[5rem] border border-white/10 text-white animate-fade-in flex flex-col items-center gap-10">
                   <div className="p-10 bg-blue-600 rounded-full shadow-4xl animate-bounce">
                     <MousePointer2 size={80} />
                   </div>
                   <div className="text-center space-y-6">
                      <div className="font-black text-4xl uppercase tracking-[0.6em]">{lang === 'zh' ? '按住角色 御剑躲避' : 'HOLD TO SWERVE'}</div>
                      <p className="text-blue-300 text-lg font-bold opacity-70 uppercase tracking-widest max-w-lg leading-relaxed">
                        {lang === 'zh' ? '操控已优化：告别卡顿，精准避障' : 'Smooth movement, precision hitboxes.'}
                      </p>
                   </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Games;
