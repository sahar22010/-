
import React, { useState } from 'react';
import TawafCounter from './TawafCounter';
import SaiCounter from './SaiCounter';

interface RitualsViewProps {
  language: string;
  isDarkMode: boolean;
}

const RitualsView: React.FC<RitualsViewProps> = ({ language, isDarkMode }) => {
  const [activeSubTab, setActiveSubTab] = useState<'tawaf' | 'sai'>('tawaf');
  const isAr = language === 'ar';

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500">
      {/* Sub-navigation Segmented Control */}
      <div className="px-6 pt-6">
        <div className={`flex p-1.5 rounded-3xl ${isDarkMode ? 'bg-[#251B19]' : 'bg-white'} shadow-sm border ${isDarkMode ? 'border-[#3D2F2B]' : 'border-gray-100'}`}>
          <button 
            onClick={() => setActiveSubTab('tawaf')}
            className={`flex-1 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
              activeSubTab === 'tawaf' 
                ? 'bg-[#C59E39] text-white shadow-lg' 
                : (isDarkMode ? 'text-gray-400' : 'text-[#5D4037]')
            }`}
          >
            {isAr ? 'عداد الطواف' : 'Tawaf Counter'}
          </button>
          <button 
            onClick={() => setActiveSubTab('sai')}
            className={`flex-1 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
              activeSubTab === 'sai' 
                ? 'bg-[#C59E39] text-white shadow-lg' 
                : (isDarkMode ? 'text-gray-400' : 'text-[#5D4037]')
            }`}
          >
            {isAr ? 'عداد السعي' : 'Sa’i Counter'}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {activeSubTab === 'tawaf' ? (
          <TawafCounter language={language} isDarkMode={isDarkMode} />
        ) : (
          <SaiCounter language={language} isDarkMode={isDarkMode} />
        )}
      </div>
    </div>
  );
};

export default RitualsView;
