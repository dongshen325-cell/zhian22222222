
import React from 'react';

interface AILogoProps {
  className?: string;
  size?: number;
  transparent?: boolean;
}

const AILogo: React.FC<AILogoProps> = ({ className, size = 64 }) => {
  return (
    <div 
      className={`${className} flex items-center justify-center transition-all duration-700 hover:rotate-3 hover:scale-105 active:scale-95`}
      style={{ width: size, height: size }}
    >
      <svg 
        width="100%" 
        height="100%" 
        viewBox="0 0 200 200" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-[0_10px_25px_rgba(0,0,0,0.2)]"
      >
        <defs>
          {/* 鸽子羽翼：深蓝到亮蓝的渐变 */}
          <linearGradient id="wing-grad" x1="100" y1="20" x2="100" y2="100" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#1E293B" />
            <stop offset="60%" stopColor="#1E40AF" />
            <stop offset="100%" stopColor="#3B82F6" />
          </linearGradient>

          {/* 羽毛金边渐变 */}
          <linearGradient id="feather-gold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#FEF3C7" />
          </linearGradient>

          {/* 锁链金属感 */}
          <linearGradient id="chain-grad" x1="20" y1="130" x2="180" y2="160" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#94A3B8" />
            <stop offset="50%" stopColor="#F1F5F9" />
            <stop offset="100%" stopColor="#475569" />
          </linearGradient>

          <filter id="soft-glow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* --- 1. 底部：展开的典籍 (The Sacred Book) --- */}
        <g id="book">
          {/* 蓝色硬质封面 */}
          <path d="M100 170L25 150V135L100 155L175 135V150L100 170Z" fill="#1E3A8A" />
          {/* 金色纸张层叠层 */}
          <path d="M100 155C60 155 35 145 30 130H100V155Z" fill="#FEF3C7" />
          <path d="M100 155C140 155 165 145 170 130H100V155Z" fill="#FEF3C7" opacity="0.9" />
          {/* 书页边缘刻画 */}
          <path d="M35 135C60 135 90 140 100 142M165 135C140 135 110 140 100 142" stroke="#B45309" strokeWidth="0.5" opacity="0.3" />
        </g>

        {/* --- 2. 中间：断裂的锁链 (The Broken Shackle) --- */}
        <g id="broken-chain" stroke="url(#chain-grad)" strokeWidth="6" strokeLinecap="round">
          {/* 左侧环扣 */}
          <path d="M30 120C20 110 15 100 18 90" strokeWidth="7" />
          <path d="M10 125L25 115" strokeWidth="4" />
          {/* 右侧环扣 - 形成一个圆弧趋势 */}
          <path d="M170 120C180 110 185 100 182 90" strokeWidth="7" />
          <path d="M190 125L175 115" strokeWidth="4" />
          {/* 崩开的小碎片 */}
          <circle cx="55" cy="110" r="1.5" fill="#CBD5E1" />
          <circle cx="145" cy="110" r="1.5" fill="#CBD5E1" />
        </g>

        {/* --- 3. 核心：冲天而起的和平鸽 (The Soaring Dove) --- */}
        <g id="dove" filter="url(#soft-glow)">
          {/* 扇形尾羽 */}
          <path d="M85 105C80 115 70 120 60 118C65 110 75 100 85 95L85 105Z" fill="url(#wing-grad)" />
          
          {/* 左侧大翅膀 - 带有羽毛错落感 */}
          <path d="M90 90C60 90 20 60 15 20" stroke="url(#wing-grad)" strokeWidth="12" strokeLinecap="round" />
          <path d="M90 92C65 92 35 70 30 40" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
          <path d="M90 85C70 85 45 70 40 55" stroke="white" strokeWidth="1" strokeLinecap="round" opacity="0.3" />

          {/* 右侧大翅膀 */}
          <path d="M110 90C140 90 180 60 185 20" stroke="url(#wing-grad)" strokeWidth="12" strokeLinecap="round" />
          <path d="M110 92C135 92 165 70 170 40" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
          <path d="M110 85C130 85 155 70 160 55" stroke="white" strokeWidth="1" strokeLinecap="round" opacity="0.3" />

          {/* 身体主体 */}
          <path d="M90 95C95 105 105 105 110 95C115 85 110 65 100 55C90 65 85 85 90 95Z" fill="#1E293B" />
          
          {/* 头部与神态 */}
          <circle cx="100" cy="52" r="13" fill="#1E293B" />
          <circle cx="104" cy="49" r="2.2" fill="white" /> {/* 眼睛 */}
          <path d="M110 48L124 52L110 56" fill="#FBBF24" /> {/* 锐利的金喙 */}
        </g>

        {/* 动态点缀：真相的火花 */}
        <g>
          <circle cx="100" cy="30" r="1" fill="#22D3EE">
            <animate attributeName="opacity" values="0;1;0" dur="2s" repeatCount="indefinite" />
          </circle>
          <path d="M25 40L20 35" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
          <path d="M175 40L180 35" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
        </g>
      </svg>
    </div>
  );
};

export default AILogo;
