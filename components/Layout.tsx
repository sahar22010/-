
import React from 'react';
import { COLORS } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
  language: string;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  onLanguageChange: (lang: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange, language, isDarkMode, toggleDarkMode, onLanguageChange }) => {
  const isAr = language === 'ar';

  const NavItem = ({ id, label, materialIcon }: { id: string, label: string, materialIcon: string }) => (
    <button
      onClick={() => onTabChange(id)}
      className={`flex flex-col items-center transition-all duration-300 tap-scale relative group ${
        activeTab === id || (activeTab === 'reunion' && id === 'map') ? 'text-[#C59E39]' : isDarkMode ? 'text-white/40' : 'text-[#5D4037]/40'
      }`}
    >
      <div className={`size-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${
        activeTab === id || (activeTab === 'reunion' && id === 'map') ? 'bg-[#C59E39]/10' : 'bg-transparent'
      }`}>
        <span className={`material-symbols-outlined text-2xl ${activeTab === id || (activeTab === 'reunion' && id === 'map') ? 'fill-1' : ''}`}>
          {materialIcon}
        </span>
      </div>
      <span className="text-[9px] font-black mt-1 uppercase tracking-widest">{label}</span>
      {(activeTab === id || (activeTab === 'reunion' && id === 'map')) && (
        <div className="absolute -top-1 w-1 h-1 bg-[#C59E39] rounded-full"></div>
      )}
    </button>
  );

  return (
    <div className={`flex flex-col h-screen transition-colors duration-500 ${isDarkMode ? 'bg-[#1A1110] text-white' : 'bg-[#FFF9F0] text-[#5D4037]'} ${isAr ? 'rtl' : 'ltr'}`} dir={isAr ? 'rtl' : 'ltr'}>
      <header className={`px-4 py-4 flex flex-col shrink-0 shadow-lg z-50 ${isDarkMode ? 'bg-[#251B19]' : 'bg-[#5D4037]'} text-white`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-[#C59E39] p-2 rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-white">mosque</span>
            </div>
            <div>
              <h1 className="font-bold text-lg leading-none">
                {isAr ? 'رفيق' : 'Rafeeq'}
              </h1>
              <p className="text-[10px] opacity-70 mt-1 uppercase tracking-widest">
                {isAr ? 'رفيق الحرمين الشريفين' : 'Rafeeq Companion'}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => onLanguageChange(isAr ? 'en' : 'ar')} 
              className="px-3 h-10 flex items-center justify-center bg-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest"
            >
              {isAr ? 'EN' : 'عربي'}
            </button>
            <button onClick={toggleDarkMode} className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-full">
              <span className="material-symbols-outlined">{isDarkMode ? 'light_mode' : 'dark_mode'}</span>
            </button>
            <button className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-full">
              <span className="material-symbols-outlined">account_circle</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pb-28">
        {children}
      </main>

      <nav className={`fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[500px] backdrop-blur-xl border-t px-4 py-3 pb-8 flex justify-between items-center z-[100] ${
        isDarkMode ? 'bg-[#251B19]/95 border-white/5' : 'bg-white/95 border-gray-100 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]'
      }`}>
        <NavItem id="home" label={isAr ? 'الرئيسية' : 'Home'} materialIcon="home" />
        <NavItem id="rituals" label={isAr ? 'المناسك' : 'Rituals'} materialIcon="mosque" />
        <NavItem id="assistant" label={isAr ? 'رفيق' : 'Assistant'} materialIcon="support_agent" />
        <NavItem id="map" label={isAr ? 'الخريطة' : 'Map'} materialIcon="explore" />
        <NavItem id="services" label={isAr ? 'الخدمات' : 'Services'} materialIcon="grid_view" />
      </nav>
    </div>
  );
};

export default Layout;
