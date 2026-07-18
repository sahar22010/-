import React, { useState } from 'react';
import { COLORS, TAWAF_DUAS } from '../constants';

interface TawafCounterProps {
  language: string;
  isDarkMode: boolean;
}

const TawafCounter: React.FC<TawafCounterProps> = ({ language, isDarkMode }) => {
  const [count, setCount] = useState(0);
  const [duaIndex, setDuaIndex] = useState(0);
  const isAr = language === 'ar';

  const getLapText = (c: number) => {
    if (!isAr) return `Lap ${c} of 7`;
    const texts = ['', 'الأول', 'الثاني', 'الثالث', 'الرابع', 'الخامس', 'السادس', 'السابع'];
    return c > 0 ? `الشوط ${texts[c]}` : 'ابدأ الطواف';
  };

  const increment = () => { if (count < 7) setCount(prev => prev + 1); };
  const reset = () => setCount(0);

  const nextDua = () => setDuaIndex(prev => (prev + 1) % TAWAF_DUAS.length);
  const prevDua = () => setDuaIndex(prev => (prev - 1 + TAWAF_DUAS.length) % TAWAF_DUAS.length);

  // SVG parameters for consistent scaling
  const size = 280;
  const center = size / 2;
  const radius = 105;
  const strokeWidth = 22;
  const circumference = 2 * Math.PI * radius;

  const currentDua = TAWAF_DUAS[duaIndex];

  return (
    <div className="px-6 py-6 space-y-6 animate-in slide-in-from-bottom-10 duration-500 pb-20">
      {/* Main Counter Card */}
      <div className={`relative flex flex-col items-center justify-center p-8 md:p-12 rounded-[60px] border-2 transition-all shadow-2xl ${
        isDarkMode ? 'bg-[#251B19] border-[#5D4037]/60 shadow-black/50' : 'bg-white border-[#D4AF37]/10 shadow-[#C59E39]/5'
      }`}>
        <div className="relative w-full max-w-[280px] aspect-square flex items-center justify-center">
          <svg 
            viewBox={`0 0 ${size} ${size}`} 
            className="absolute w-full h-full -rotate-90 drop-shadow-sm"
          >
            {/* Background Track */}
            <circle 
              cx={center} 
              cy={center} 
              r={radius} 
              fill="none" 
              stroke={isDarkMode ? '#3D2F2B' : '#FDF8F0'} 
              strokeWidth={strokeWidth} 
            />
            {/* Progress Bar */}
            <circle
              cx={center} 
              cy={center} 
              r={radius} 
              fill="none" 
              stroke={COLORS.GOLD} 
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - count / 7)}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-in-out"
            />
          </svg>
          
          <div className="flex flex-col items-center z-10">
            <span className={`text-8xl font-black mb-1 font-amiri leading-none ${isDarkMode ? 'text-white' : 'text-[#5D4037]'}`}>
              {count}
            </span>
            <span className={`text-[12px] font-black uppercase tracking-[5px] ${isDarkMode ? 'text-[#C59E39]' : 'text-gray-400'}`}>
              {isAr ? 'أشواط' : 'Laps'}
            </span>
          </div>
        </div>

        <div className="text-center mt-10">
          <p className="text-3xl font-black text-[#C59E39] font-amiri mb-2">
            {getLapText(count)}
          </p>
          <div className={`h-1.5 w-12 bg-[#C59E39]/30 rounded-full mx-auto`}></div>
        </div>

        <div className="mt-12 flex gap-4 w-full">
          <button
            onClick={increment}
            className="flex-1 py-6 bg-[#C59E39] text-white rounded-[35px] font-black shadow-xl shadow-[#C59E39]/20 tap-scale hover:brightness-110 active:brightness-90 uppercase tracking-widest text-[11px]"
          >
            {isAr ? 'إضافة شوط +' : 'Add Lap +'}
          </button>
          <button
            onClick={reset}
            className={`p-6 rounded-[35px] border-2 flex items-center justify-center tap-scale transition-all ${
              isDarkMode 
                ? 'bg-[#1A1110] border-[#5D4037] text-[#C59E39] hover:bg-[#2D221F]' 
                : 'bg-[#FAF3E0] border-[#D4AF37]/20 text-[#5D4037] hover:bg-white'
            }`}
          >
            <span className="material-symbols-outlined text-3xl">refresh</span>
          </button>
        </div>
      </div>

      {/* Dua Card */}
      <div className={`p-8 rounded-[50px] border shadow-xl transition-all ${
        isDarkMode ? 'bg-[#251B19] border-[#5D4037]/40 shadow-black/40' : 'bg-white border-[#FAF3E0] shadow-[#C59E39]/5'
      }`}>
         <div className={`flex items-center justify-between mb-6 ${isAr ? 'flex-row-reverse' : ''}`}>
           <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-2xl bg-[#C59E39]/10 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[#C59E39]">menu_book</span>
             </div>
             <h4 className={`font-black text-[11px] uppercase tracking-[3px] ${isDarkMode ? 'text-[#E5D3B3]' : 'text-[#5D4037]'}`}>
               {isAr ? 'الأدعية المأثورة' : 'Authentic Supplications'}
             </h4>
           </div>
           <span className="text-[10px] font-black text-[#C59E39]">{duaIndex + 1} / {TAWAF_DUAS.length}</span>
         </div>
         
         <div className="min-h-[120px] flex items-center justify-center">
           <p className={`leading-relaxed font-amiri text-2xl text-center px-4 ${isDarkMode ? 'text-white/90' : 'text-[#5D4037]'}`}>
              {currentDua.text}
           </p>
         </div>

         <div className="flex gap-4 mt-8">
            <button 
              onClick={prevDua}
              className={`flex-1 py-4 rounded-2xl border-2 flex items-center justify-center gap-2 tap-scale ${
                isDarkMode ? 'border-[#5D4037] text-white' : 'border-[#FAF3E0] text-[#5D4037]'
              }`}
            >
              <span className="material-symbols-outlined">{isAr ? 'arrow_forward' : 'arrow_back'}</span>
              <span className="text-[10px] font-black uppercase tracking-widest">{isAr ? 'السابق' : 'Prev'}</span>
            </button>
            <button 
              onClick={nextDua}
              className="flex-1 py-4 bg-[#5D4037] text-white rounded-2xl flex items-center justify-center gap-2 tap-scale shadow-lg"
            >
              <span className="text-[10px] font-black uppercase tracking-widest">{isAr ? 'التالي' : 'Next'}</span>
              <span className="material-symbols-outlined">{isAr ? 'arrow_back' : 'arrow_forward'}</span>
            </button>
         </div>
      </div>
    </div>
  );
};

export default TawafCounter;