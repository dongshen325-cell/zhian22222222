
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { 
  Menu, X, Globe, Wallet, Shield, Award, Users, 
  Gamepad2, Fingerprint, QrCode, ExternalLink, Info, CheckCircle, Mail,
  RefreshCw, ArrowRight, Languages
} from 'lucide-react';
import { Language } from './types';
import { TRANSLATIONS } from './constants';
import AILogo from './components/AILogo';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Candidates from './pages/Candidates';
import Voting from './pages/Voting';
import Games from './pages/Games';
import Admin from './pages/Admin';

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('zh');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [zaBalance, setZaBalance] = useState<number>(0);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    const browserLang = navigator.language.split('-')[0];
    if (browserLang === 'en' || browserLang === 'zh') {
      setLang(browserLang as Language);
    }
  }, []);

  const simulateConnection = () => {
    setIsConnecting(true);
    setTimeout(() => {
      const mockAddr = '0x' + Array.from({length: 40}, () => Math.floor(Math.random() * 16).toString(16)).join('');
      setWalletAddress(mockAddr);
      setZaBalance(1250);
      setIsConnecting(false);
      setShowWalletModal(false);
    }, 1500);
  };

  const toggleLanguage = () => {
    setLang(prev => prev === 'zh' ? 'en' : 'zh');
  };

  const t = TRANSLATIONS[lang];

  return (
    <Router>
      <div className="min-h-screen flex flex-col font-sans bg-gray-50 selection:bg-blue-600 selection:text-white">
        {/* Navigation */}
        <nav className="bg-white/90 backdrop-blur-xl sticky top-0 z-[100] border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-20 items-center">
              <div className="flex items-center gap-3">
                <Link to="/" className="flex items-center gap-2 group">
                  <div className="relative">
                    <div className="absolute inset-0 bg-blue-600/10 rounded-full blur-xl group-hover:blur-2xl transition-all opacity-0 group-hover:opacity-100"></div>
                    <AILogo size={64} className="relative" />
                  </div>
                  <div className="flex flex-col -ml-1">
                    <span className="text-xl md:text-2xl font-black text-slate-900 leading-none tracking-tighter uppercase">ZHIAN {lang === 'zh' && '智安'}</span>
                    <span className="text-[9px] text-blue-600 font-black uppercase tracking-[0.3em] mt-1">Press Freedom</span>
                  </div>
                </Link>
              </div>

              {/* Desktop Nav */}
              <div className="hidden lg:flex items-center space-x-1">
                <Link to="/" className="px-4 py-2 text-sm font-black text-slate-600 hover:text-blue-600 transition-all rounded-xl hover:bg-slate-50">{t.navHome}</Link>
                <Link to="/about" className="px-4 py-2 text-sm font-black text-slate-600 hover:text-blue-600 transition-all rounded-xl hover:bg-slate-50">{t.navAbout}</Link>
                <Link to="/candidates" className="px-4 py-2 text-sm font-black text-slate-600 hover:text-blue-600 transition-all rounded-xl hover:bg-slate-50">{t.navCandidates}</Link>
                <Link to="/voting" className="px-4 py-2 text-sm font-black text-slate-600 hover:text-blue-600 transition-all rounded-xl hover:bg-slate-50">{t.navVoting}</Link>
                <Link to="/relax" className="px-4 py-2 text-sm font-black text-slate-600 hover:text-blue-600 transition-all rounded-xl hover:bg-slate-50">{t.navRelax}</Link>
                
                <div className="w-px h-6 bg-slate-200 mx-3"></div>

                <button 
                  onClick={toggleLanguage}
                  className="p-3 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all mr-2 flex items-center gap-2"
                  title="Switch Language"
                >
                  <Languages size={20} />
                  <span className="text-xs font-black">{lang === 'zh' ? 'EN' : '中文'}</span>
                </button>

                <button 
                  onClick={() => setShowWalletModal(true)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-black transition-all shadow-xl active:scale-95 ${walletAddress ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-slate-900 text-white hover:bg-blue-600 shadow-slate-900/10 hover:shadow-blue-600/20'}`}
                >
                  <Wallet size={16} />
                  {walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : t.connectWallet}
                </button>
              </div>

              <div className="lg:hidden flex items-center gap-4">
                <button onClick={toggleLanguage} className="p-2 text-slate-500 bg-slate-100 rounded-xl font-bold text-xs uppercase">
                  {lang === 'zh' ? 'EN' : '中文'}
                </button>
                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-3 text-slate-900 bg-slate-100 rounded-2xl">
                  {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </div>
          </div>
        </nav>

        {isMenuOpen && (
           <div className="lg:hidden bg-white border-b border-slate-100 animate-fade-in p-6 space-y-4">
              <Link to="/" className="block text-lg font-black text-slate-900" onClick={() => setIsMenuOpen(false)}>{t.navHome}</Link>
              <Link to="/about" className="block text-lg font-black text-slate-900" onClick={() => setIsMenuOpen(false)}>{t.navAbout}</Link>
              <Link to="/candidates" className="block text-lg font-black text-slate-900" onClick={() => setIsMenuOpen(false)}>{t.navCandidates}</Link>
              <Link to="/voting" className="block text-lg font-black text-slate-900" onClick={() => setIsMenuOpen(false)}>{t.navVoting}</Link>
              <Link to="/relax" className="block text-lg font-black text-slate-900" onClick={() => setIsMenuOpen(false)}>{t.navRelax}</Link>
              <button onClick={() => { setIsMenuOpen(false); setShowWalletModal(true); }} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black">{t.connectWallet}</button>
           </div>
        )}

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home lang={lang} />} />
            <Route path="/about" element={<About lang={lang} />} />
            <Route path="/candidates" element={<Candidates lang={lang} />} />
            <Route path="/voting" element={<Voting lang={lang} walletAddress={walletAddress} zaBalance={zaBalance} />} />
            <Route path="/relax" element={<Games lang={lang} />} />
            <Route path="/admin-secret" element={<Admin lang={lang} />} />
          </Routes>
        </main>

        <footer className="bg-slate-950 text-slate-400 py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
              <div className="col-span-1 md:col-span-2">
                <div className="flex items-center gap-4 mb-6 group cursor-default">
                  <AILogo size={80} className="group-hover:rotate-6 transition-transform" transparent={true} />
                  <div className="flex flex-col">
                    <span className="text-2xl font-black text-white tracking-tighter uppercase leading-none">ZHIAN</span>
                    <span className="text-[10px] text-blue-400 font-black uppercase tracking-[0.4em] mt-2">{lang === 'zh' ? '全球智安基金会' : 'GLOBAL FOUNDATION'}</span>
                  </div>
                </div>
                <p className="max-w-md mb-8 leading-relaxed italic text-lg text-slate-300 font-light">{t.footerQuote}</p>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8 max-w-sm">
                   <h5 className="text-white text-[10px] font-black uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                      <Mail size={12} className="text-blue-400" /> {t.footerContact}
                   </h5>
                   <a href="mailto:yedong8500@outlook.com" className="text-base font-mono text-blue-400 hover:text-blue-300 transition-colors break-all">
                      yedong8500@outlook.com
                   </a>
                </div>
              </div>
              <div>
                <h4 className="text-white font-black uppercase text-xs tracking-[0.4em] mb-6 opacity-40">{t.footerArchive}</h4>
                <ul className="space-y-4 text-sm font-bold">
                  <li><Link to="/about" className="hover:text-white transition-colors">Whitepaper</Link></li>
                  <li><Link to="/candidates" className="hover:text-white transition-colors">Media Heroes</Link></li>
                  <li><Link to="/relax" className="hover:text-white transition-colors">Truth Lab</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-black uppercase text-xs tracking-[0.4em] mb-6 opacity-40">{t.footerGovernance}</h4>
                <ul className="space-y-4 text-sm font-bold">
                  <li><Link to="/voting" className="hover:text-white transition-colors">Voting Rules</Link></li>
                  <li><a href="#" className="hover:text-white transition-colors">Nodes</a></li>
                  <li><Link to="/about" className="hover:text-white transition-colors">Legal</Link></li>
                </ul>
              </div>
            </div>
            <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em]">
              <p>© 2024 ZHIAN FOUNDATION | BREAKING THE CHAINS.</p>
              <div className="flex items-center gap-4 text-slate-600">
                <span>v2.0-Production-Ready</span>
                <span>Mainnet-Mock</span>
              </div>
            </div>
          </div>
        </footer>

        {showWalletModal && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <div className="bg-white w-full max-w-md rounded-[2rem] p-8 shadow-4xl animate-fade-in">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-black text-slate-900 serif-font uppercase tracking-tight">Connect Wallet</h2>
                <button onClick={() => setShowWalletModal(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-all"><X size={20} /></button>
              </div>
              <div className="space-y-3">
                <button 
                  onClick={simulateConnection}
                  disabled={isConnecting}
                  className="w-full p-4 bg-slate-50 hover:bg-blue-50 border border-slate-100 hover:border-blue-200 rounded-2xl transition-all flex items-center justify-between group disabled:opacity-50"
                >
                  <div className="flex items-center gap-3">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Logo.svg" className="w-8 h-8" alt="MetaMask" />
                    <span className="font-black text-slate-700">MetaMask</span>
                  </div>
                  {isConnecting ? <RefreshCw className="animate-spin text-blue-500" size={18} /> : <ArrowRight className="text-slate-300 group-hover:text-blue-500 transition-colors" size={18} />}
                </button>
              </div>
              <p className="mt-6 text-[10px] text-slate-400 font-medium leading-relaxed text-center uppercase tracking-widest">
                Read-only access to address and ZA balance.
              </p>
            </div>
          </div>
        )}
      </div>
    </Router>
  );
};

export default App;
