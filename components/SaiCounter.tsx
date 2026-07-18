import React, { useState } from 'react';
import { COLORS, SAI_DUAS } from '../constants';

interface SaiCounterProps {
  language: string;
  isDarkMode: boolean;
}

const SaiCounter: React.FC<SaiCounterProps> = ({ language, isDarkMode }) => {
  const [laps, setLaps] = useState(0);
  const [duaIndex, setDuaIndex] = useState(0);
  const [direction, setDirection] = useState<'toMarwa' | 'toSafa'>('toMarwa');
  const [isStarted, setIsStarted] = useState(false);
  const isAr = language === 'ar';

  const increment = (newDir: 'toMarwa' | 'toSafa') => {
    if (laps < 7 && newDir !== direction) {
      setLaps(prev => prev + 1);
      setDirection(newDir);
    } else if (laps === 0 && newDir === 'toMarwa') {
      setLaps(1);
      setDirection('toMarwa');
    }
  };

  const reset = () => { 
    setLaps(0); 
    setDirection('toMarwa'); 
    setIsStarted(false);
  };

  const nextDua = () => setDuaIndex(prev => (prev + 1) % SAI_DUAS.length);
  const prevDua = () => setDuaIndex(prev => (prev - 1 + SAI_DUAS.length) % SAI_DUAS.length);

  const currentDua = SAI_DUAS[duaIndex];

  return (
    <div className="px-6 py-6 space-y-6 animate-in slide-in-from-bottom-10 duration-500 pb-24">
      <div className={`rounded-[60px] p-10 md:p-12 space-y-12 border-2 transition-all shadow-2xl ${
        isDarkMode ? 'bg-[#251B19] border-[#5D4037]/60 shadow-black/50' : 'bg-white border-[#D4AF37]/10 shadow-[#C59E39]/5'
      }`}>
        {/* Progress Visualizer */}
        <div className="flex justify-between items-center relative">
          <div className="flex flex-col items-center z-10">
            <div className={`w-20 h-20 rounded-[30px] flex items-center justify-center transition-all duration-500 font-black text-2xl shadow-lg ${
              (isStarted && direction === 'toSafa') || (isStarted && laps === 0) 
                ? 'bg-[#C59E39] text-white shadow-[#C59E39]/40' 
                : (isDarkMode ? 'bg-[#1A1110] text-[#5D4037]' : 'bg-[#FDF8F0] text-gray-300')
            }`}>
              {isAr ? 'ص' : 'S'}
            </div>
            <span className={`mt-3 text-[10px] font-black uppercase tracking-[3px] ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{isAr ? 'الصفا' : 'Safa'}</span>
          </div>
          
          <div className={`flex-1 h-3 mx-4 rounded-full relative overflow-hidden ${isDarkMode ? 'bg-[#1A1110]' : 'bg-[#FDF8F0]'}`}>
             <div className="absolute h-full bg-[#C59E39] transition-all duration-1000 shadow-[0_0_15px_rgba(197,158,57,0.6)]" 
               style={{ width: `${(laps/7) * 100}%`, [isAr ? 'right' : 'left']: 0 }} 
             />
          </div>

          <div className="flex flex-col items-center z-10">
            <div className={`w-20 h-20 rounded-[30px] flex items-center justify-center transition-all duration-500 font-black text-2xl shadow-lg ${
              isStarted && direction === 'toMarwa' && laps > 0
                ? 'bg-[#C59E39] text-white shadow-[#C59E39]/40' 
                : (isDarkMode ? 'bg-[#1A1110] text-[#5D4037]' : 'bg-[#FDF8F0] text-gray-300')
            }`}>
              {isAr ? 'م' : 'M'}
            </div>
            <span className={`mt-3 text-[10px] font-black uppercase tracking-[3px] ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{isAr ? 'المروة' : 'Marwa'}</span>
          </div>
        </div>

        {/* Counter Display */}
        <div className="flex flex-col items-center justify-center py-4">
          <span className={`text-9xl font-black font-amiri leading-none ${isDarkMode ? 'text-white' : 'text-[#C59E39]'}`}>{laps}</span>
          <span className={`text-[12px] uppercase font-black tracking-[8px] mt-6 ${isDarkMode ? 'text-[#C59E39]/70' : 'text-gray-400'}`}>
            {isAr ? 'أشواط السعي' : 'Sa’i Laps'}
          </span>
        </div>

        {/* Control Buttons */}
        {!isStarted ? (
          <div className="flex justify-center">
            <button
              onClick={() => { setIsStarted(true); increment('toMarwa'); }}
              className="w-full py-8 bg-[#C59E39] text-white rounded-[45px] font-black text-xl shadow-2xl tap-scale flex items-center justify-center gap-4"
            >
              <span className="material-symbols-outlined text-4xl">check_circle</span>
              {isAr ? 'ابدأ السعي' : 'Start Sa’i'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-6">
            <button
              onClick={() => increment('toMarwa')}
              disabled={laps === 7 || (direction === 'toMarwa' && laps > 0)}
              className={`flex flex-col items-center p-10 rounded-[45px] transition-all tap-scale border-2 shadow-xl ${
                direction === 'toSafa' || laps === 0 
                  ? 'bg-[#C59E39] border-[#C59E39] text-white shadow-[#C59E39]/30 active:scale-95' 
                  : (isDarkMode ? 'bg-[#1A1110] border-[#5D4037] text-[#5D4037] opacity-20' : 'bg-gray-50 border-gray-100 text-gray-200 cursor-not-allowed')
              }`}
            >
              <span className="material-symbols-outlined text-4xl mb-3">arrow_forward</span>
              <span className="text-[10px] font-black uppercase tracking-widest">{isAr ? 'إلى المروة' : 'To Marwa'}</span>
            </button>
            
            <button
              onClick={() => increment('toSafa')}
              disabled={laps === 7 || direction === 'toSafa'}
              className={`flex flex-col items-center p-10 rounded-[45px] transition-all tap-scale border-2 shadow-xl ${
                direction === 'toMarwa' 
                  ? 'bg-[#C59E39] border-[#C59E39] text-white shadow-[#C59E39]/30 active:scale-95' 
                  : (isDarkMode ? 'bg-[#1A1110] border-[#5D4037] text-[#5D4037] opacity-20' : 'bg-gray-50 border-gray-100 text-gray-200 cursor-not-allowed')
              }`}
            >
              <span className="material-symbols-outlined text-4xl mb-3">arrow_back</span>
              <span className="text-[10px] font-black uppercase tracking-widest">{isAr ? 'إلى الصفا' : 'To Safa'}</span>
            </button>
          </div>
        )}

        <button 
          onClick={reset} 
          className={`w-full py-4 text-[10px] font-black uppercase tracking-[6px] tap-scale opacity-60 hover:opacity-100 transition-opacity ${isDarkMode ? 'text-[#E5D3B3]' : 'text-gray-400'}`}
        >
          {isAr ? 'إعادة ضبط العداد' : 'Reset Counter'}
        </button>
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
           <span className="text-[10px] font-black text-[#C59E39]">{duaIndex + 1} / {SAI_DUAS.length}</span>
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

export default SaiCounter;
