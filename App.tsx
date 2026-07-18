
import React, { useState, useMemo, useEffect } from 'react';
import Layout from './components/Layout';
import Home from './components/Home';
import RitualsView from './components/RitualsView';
import GuidanceChat from './components/GuidanceChat';
import MapView from './components/MapView';
import ReunionView from './components/ReunionView';
import { Language, LanguageNames, AccessibilityMode, UserCategory, City, CityNames } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [language, setLanguage] = useState<Language>(Language.AR);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [onboarded, setOnboarded] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [accessibility, setAccessibility] = useState<AccessibilityMode>(AccessibilityMode.NORMAL);
  const [userCategory, setUserCategory] = useState<UserCategory>(UserCategory.UMRAH);
  const [currentCity, setCurrentCity] = useState<City>(City.MAKKAH);

  const isAr = language === Language.AR;
  const showCitySelection = [UserCategory.VISITOR, UserCategory.VOLUNTEER, UserCategory.STAFF].includes(userCategory);

  // Default Hajj/Umrah to Makkah if they were in Madinah
  useEffect(() => {
    if (!showCitySelection && currentCity === City.MADINAH) {
      setCurrentCity(City.MAKKAH);
    }
  }, [userCategory, showCitySelection, currentCity]);

  const translations = useMemo(() => ({
// ... existing translations ...
    [Language.AR]: {
      setupTitle: 'تفضيلات الاستخدام',
      setupDesc: 'خصص تجربتك للحصول على خدمة احترافية تليق بضيف الرحمن.',
      langLabel: 'اللغة المفضلـة',
      catLabel: 'فئة المستخدم',
      accLabel: 'احتياجات الوصول',
      cityLabel: 'الموقع الحالي',
      nextBtn: 'المتابعة',
      startBtn: 'البدء الآن',
      skipBtn: 'تخطي الإعداد',
      hotelsTitle: 'الفنادق المجاورة',
      bookNow: 'احجز الآن',
      categories: {
        [UserCategory.HAJJ]: 'حاج',
        [UserCategory.UMRAH]: 'معتمر',
        [UserCategory.VISITOR]: 'زائر',
        [UserCategory.VOLUNTEER]: 'متطوع',
        [UserCategory.STAFF]: 'موظف / كادر'
      },
      accModes: {
        [AccessibilityMode.NORMAL]: 'الوضع العادي',
        [AccessibilityMode.VISUAL]: 'إعاقة بصرية (توجيه صوتي)',
        [AccessibilityMode.HEARING]: 'إعاقة سمعية (تنبيهات مرئية)',
        [AccessibilityMode.WHEELCHAIR]: 'مستخدمي الكراسي (مسارات ميسرة)',
      }
    },
    [Language.EN]: {
      setupTitle: 'App Preferences',
      setupDesc: 'Customize your journey for a professional experience as a guest of Allah.',
      langLabel: 'Preferred Language',
      catLabel: 'User Category',
      accLabel: 'Accessibility Needs',
      cityLabel: 'Current Location',
      nextBtn: 'Continue',
      startBtn: 'Start Now',
      skipBtn: 'Skip Setup',
      hotelsTitle: 'Nearby Hotels',
      bookNow: 'BOOK NOW',
      categories: {
        [UserCategory.HAJJ]: 'Hajj Pilgrim',
        [UserCategory.UMRAH]: 'Umrah Pilgrim',
        [UserCategory.VISITOR]: 'Visitor',
        [UserCategory.VOLUNTEER]: 'Volunteer',
        [UserCategory.STAFF]: 'Staff / Official'
      },
      accModes: {
        [AccessibilityMode.NORMAL]: 'Normal Mode',
        [AccessibilityMode.VISUAL]: 'Visual Impairment (Voice)',
        [AccessibilityMode.HEARING]: 'Hearing Impairment (Visual Alerts)',
        [AccessibilityMode.WHEELCHAIR]: 'Wheelchair (Level Routes)',
      }
    },
    // Adding placeholders for other languages to ensure the app doesn't crash
    // In a real app, these would be fully translated
    [Language.UR]: { langLabel: 'اردو', setupTitle: 'ایپ کی ترجیحات', nextBtn: 'جاری رکھیں', startBtn: 'ابھی شروع کریں' },
    [Language.ID]: { langLabel: 'Bahasa Indonesia', setupTitle: 'Preferensi Aplikasi', nextBtn: 'Lanjutkan', startBtn: 'Mulai Sekarang' },
    [Language.TR]: { langLabel: 'Türkçe', setupTitle: 'Uygulama Tercihleri', nextBtn: 'Devam Et', startBtn: 'Şimdi Başla' },
    [Language.FR]: { langLabel: 'Français', setupTitle: 'Préférences de l\'application', nextBtn: 'Continuer', startBtn: 'Commencer maintenant' },
    [Language.BN]: { langLabel: 'বাংলা', setupTitle: 'অ্যাপের পছন্দ', nextBtn: 'চালিয়ে যান', startBtn: 'এখনই শুরু করুন' },
    [Language.MS]: { langLabel: 'Bahasa Melayu', setupTitle: 'Pilihan Aplikasi', nextBtn: 'Teruskan', startBtn: 'Mula Sekarang' },
    [Language.FA]: { langLabel: 'فارسی', setupTitle: 'تنظیمات برنامه', nextBtn: 'ادامه', startBtn: 'شروع کنید' },
    [Language.HA]: { langLabel: 'Hausa', setupTitle: 'Abubuwan da aka fi so', nextBtn: 'Ci gaba', startBtn: 'Fara Yanzu' },
  }), []);

  const t = {
    ...(translations[Language.EN] as any),
    ...(translations[language] as any),
    categories: { ...(translations[Language.EN].categories as any), ...(translations[language]?.categories as any) },
    accModes: { ...(translations[Language.EN].accModes as any), ...(translations[language]?.accModes as any) }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <Home language={language} isDarkMode={isDarkMode} onAction={(action) => setActiveTab(action)} userCategory={userCategory} currentCity={currentCity} />;
      case 'rituals':
        return <RitualsView language={language} isDarkMode={isDarkMode} />;
      case 'assistant':
        return <GuidanceChat language={language} isDarkMode={isDarkMode} />;
      case 'map':
        return <MapView language={language} isDarkMode={isDarkMode} accessibility={accessibility} userCategory={userCategory} currentCity={currentCity} />;
      case 'reunion':
        return (
          <div className="h-full relative">
            <MapView language={language} isDarkMode={isDarkMode} accessibility={accessibility} userCategory={userCategory} currentCity={currentCity} />
            <ReunionView language={language} isDarkMode={isDarkMode} onClose={() => setActiveTab('map')} />
          </div>
        );
      case 'services':
        return (
          <div className="px-6 py-6 space-y-6 animate-in fade-in pb-24">
            <h3 className={`font-black text-xl mb-6 ${isDarkMode ? 'text-white' : 'text-[#5D4037]'}`}>{isAr ? 'الخدمات المتاحة' : 'Available Services'}</h3>
            
            {/* User Category Switcher */}
            <div className={`rounded-[40px] border shadow-xl ${isDarkMode ? 'bg-[#2D221F] border-[#5D4037]' : 'bg-white border-gray-100'} p-6`}>
              <h4 className={`font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-[#5D4037]'}`}>{isAr ? 'فئة المستخدم' : 'User Category'}</h4>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(t.categories).map(([code, name]) => (
                  <button
                    key={code}
                    onClick={() => setUserCategory(code as UserCategory)}
                    className={`py-3 rounded-2xl font-bold transition-all border-2 text-xs ${
                      userCategory === code 
                        ? 'bg-[#5D4037] text-white border-[#5D4037]' 
                        : (isDarkMode ? 'bg-[#1F1715] border-[#5D4037] text-gray-400' : 'bg-gray-50 border-gray-100 text-[#5D4037]')
                    }`}
                  >
                    {name as string}
                  </button>
                ))}
              </div>
            </div>

            {/* Language Switcher */}
            <div className={`rounded-[40px] border shadow-xl ${isDarkMode ? 'bg-[#2D221F] border-[#5D4037]' : 'bg-white border-gray-100'} p-6`}>
              <h4 className={`font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-[#5D4037]'}`}>{t.langLabel}</h4>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(LanguageNames).map(([code, name]) => (
                  <button
                    key={code}
                    onClick={() => setLanguage(code as Language)}
                    className={`py-3 rounded-2xl font-bold transition-all border-2 text-sm ${
                      language === code 
                        ? 'bg-[#C59E39] text-white border-[#C59E39]' 
                        : (isDarkMode ? 'bg-[#1F1715] border-[#5D4037] text-gray-400' : 'bg-gray-50 border-gray-100 text-[#5D4037]')
                    }`}
                  >
                    {name as string}
                  </button>
                ))}
              </div>
            </div>

            {/* City Switcher */}
            {showCitySelection && (
              <div className={`rounded-[40px] border shadow-xl ${isDarkMode ? 'bg-[#2D221F] border-[#5D4037]' : 'bg-white border-gray-100'} p-6`}>
                <h4 className={`font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-[#5D4037]'}`}>{t.cityLabel}</h4>
                <div className="flex gap-3">
                  {Object.entries(CityNames).map(([code, names]) => (
                    <button
                      key={code}
                      onClick={() => setCurrentCity(code as City)}
                      className={`flex-1 py-3 rounded-2xl font-bold transition-all border-2 ${
                        currentCity === code 
                          ? 'bg-[#5D4037] text-white border-[#5D4037]' 
                          : (isDarkMode ? 'bg-[#1F1715] border-[#5D4037] text-gray-400' : 'bg-gray-50 border-gray-100 text-[#5D4037]')
                      }`}
                    >
                      {isAr ? names.ar : names.en}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Reunion Quick Access */}
            <div 
              onClick={() => setActiveTab('reunion')}
              className={`rounded-[40px] overflow-hidden border shadow-xl ${isDarkMode ? 'bg-[#2D221F] border-[#5D4037]' : 'bg-white border-gray-100'} p-6 flex items-center gap-4 cursor-pointer tap-scale`}
            >
              <div className="w-16 h-16 bg-[#C59E39] rounded-3xl flex items-center justify-center shadow-lg">
                <span className="material-symbols-outlined text-white text-3xl">group</span>
              </div>
              <div>
                <h4 className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-[#5D4037]'}`}>{isAr ? 'لمّ الشمل' : 'Reunion'}</h4>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{isAr ? 'تتبع مجموعتك' : 'Track your group'}</p>
              </div>
            </div>

            <h3 className={`font-black text-xl mt-10 mb-6 ${isDarkMode ? 'text-white' : 'text-[#5D4037]'}`}>{t.hotelsTitle}</h3>
            {[
              { name: 'فيرمونت برج الساعة', nameEn: 'Fairmont Clock Tower', dist: '50m', img: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/29267232.jpg?k=7a2e5d99', link: 'https://www.booking.com/hotel/sa/makkah-clock-royal-tower-a-fairmont.html' },
              { name: 'رافلز مكة بالاس', nameEn: 'Raffles Makkah Palace', dist: '100m', img: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/11883100.jpg?k=7a2e5d99', link: 'https://www.booking.com/hotel/sa/raffles-makkah-palace.html' }
            ].map((hotel, i) => (
              <div key={i} className={`rounded-[40px] overflow-hidden border shadow-xl ${isDarkMode ? 'bg-[#2D221F] border-[#5D4037]' : 'bg-white border-gray-100'} p-2 mb-6`}>
                <a href={hotel.link} target="_blank" rel="noopener noreferrer" className="block cursor-pointer">
                  <img src={hotel.img} className="w-full h-48 object-cover rounded-[32px] transition-transform hover:scale-[1.02] active:scale-95" />
                </a>
                <div className="p-5 flex justify-between items-center">
                  <div>
                    <h4 className={`font-bold ${isDarkMode ? 'text-white' : 'text-[#5D4037]'}`}>{isAr ? hotel.name : hotel.nameEn}</h4>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{hotel.dist} {isAr ? 'من الحرم' : 'from Haram'}</p>
                  </div>
                  <button onClick={() => window.open(hotel.link, '_blank')} className="bg-[#C59E39] text-white px-6 py-2.5 rounded-2xl text-[10px] font-black shadow-lg tap-scale">
                    {t.bookNow}
                  </button>
                </div>
              </div>
            ))}
          </div>
        );
      default:
        return <Home language={language} isDarkMode={isDarkMode} onAction={(action) => setActiveTab(action)} />;
    }
  };

  if (!onboarded) {
    return (
      <div className={`flex flex-col h-screen ${isDarkMode ? 'bg-[#1F1715]' : 'bg-[#FAF3E0]'} transition-colors duration-500 font-sans`} dir={isAr ? 'rtl' : 'ltr'}>
        <div className="h-10 px-8 flex justify-between items-center bg-transparent pt-4">
          <div className="flex items-center gap-2">
            {onboardingStep > 0 && (
              <button 
                onClick={() => setOnboardingStep(onboardingStep - 1)}
                className={`p-2 transition-transform active:scale-90 ${isDarkMode ? 'text-[#C59E39]' : 'text-[#5D4037]'}`}
              >
                <span className="material-symbols-outlined text-[20px]">{isAr ? 'arrow_forward' : 'arrow_back'}</span>
              </button>
            )}
            <span className={`text-xs font-bold ${isDarkMode ? 'text-[#C59E39]' : 'text-[#5D4037]'}`}>9:41</span>
          </div>
          <div className="flex gap-2 items-center">
            <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2 transition-transform active:scale-90">
              <span className={`material-symbols-outlined text-[20px] ${isDarkMode ? 'text-[#C59E39]' : 'text-[#5D4037]'}`}>
                {isDarkMode ? 'light_mode' : 'dark_mode'}
              </span>
            </button>
          </div>
        </div>

        <header className="px-8 py-8 flex flex-col items-center">
            <h1 className={`font-extrabold text-4xl tracking-tight font-amiri ${isDarkMode ? 'text-white' : 'text-[#5D4037]'}`}>رفيق</h1>
            <div className="h-1.5 w-12 bg-[#C59E39] rounded-full mt-2"></div>
        </header>

        <main className="flex-1 px-8 flex flex-col pt-4 overflow-y-auto">
          <div className="text-center mb-10">
            <h2 className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-[#5D4037]'}`}>{t.setupTitle}</h2>
            <p className={`text-sm mt-3 leading-relaxed ${isDarkMode ? 'text-gray-400' : 'text-[#5D4037]/70'}`}>{t.setupDesc}</p>
          </div>

          <div className="flex flex-col gap-6">
            {onboardingStep === 0 && (
              <div className="flex flex-col gap-4 animate-in slide-in-from-bottom-4 duration-500">
                <label className={`text-[11px] font-bold uppercase tracking-widest px-1 text-center ${isDarkMode ? 'text-[#C59E39]' : 'text-[#5D4037]'}`}>{t.langLabel}</label>
                <div className="flex flex-col gap-3">
                  {Object.entries(LanguageNames).map(([code, name]) => (
                    <button
                      key={code}
                      onClick={() => setLanguage(code as Language)}
                      className={`p-5 rounded-2xl font-black text-lg transition-all border-2 flex items-center justify-between ${
                        language === code 
                          ? 'bg-[#C59E39] text-white border-[#C59E39] shadow-lg scale-[1.02]' 
                          : (isDarkMode ? 'bg-[#2D221F] border-[#5D4037] text-white' : 'bg-white border-[#5D4037]/20 text-[#5D4037]')
                      }`}
                    >
                      <span>{name as string}</span>
                      {language === code && <span className="material-symbols-outlined">check_circle</span>}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {onboardingStep === 1 && (
              <div className="flex flex-col gap-6 animate-in slide-in-from-bottom-4 duration-500">
                <div className="flex flex-col gap-2">
                  <label className={`text-[11px] font-bold uppercase tracking-widest px-1 ${isDarkMode ? 'text-[#C59E39]' : 'text-[#5D4037]'}`}>{t.catLabel}</label>
                  <div className="grid grid-cols-1 gap-3">
                    {Object.entries(t.categories).map(([cat, label]) => (
                      <button
                        key={cat}
                        onClick={() => setUserCategory(cat as UserCategory)}
                        className={`p-4 rounded-2xl font-bold text-left transition-all border-2 flex items-center justify-between ${
                          userCategory === cat 
                            ? 'bg-[#5D4037] text-white border-[#5D4037] shadow-lg' 
                            : (isDarkMode ? 'bg-[#2D221F] border-[#5D4037] text-white' : 'bg-white border-[#5D4037]/20 text-[#5D4037]')
                        }`}
                      >
                        <span className={isAr ? 'text-right w-full' : ''}>{label as string}</span>
                        {userCategory === cat && <span className="material-symbols-outlined">check_circle</span>}
                      </button>
                    ))}
                  </div>
                </div>

                {showCitySelection && (
                  <div className="flex flex-col gap-2">
                    <label className={`text-[11px] font-bold uppercase tracking-widest px-1 ${isDarkMode ? 'text-[#C59E39]' : 'text-[#5D4037]'}`}>{t.cityLabel}</label>
                    <div className="grid grid-cols-2 gap-3">
                      {Object.entries(CityNames).map(([code, names]) => (
                        <button
                          key={code}
                          onClick={() => setCurrentCity(code as City)}
                          className={`p-4 rounded-2xl font-bold transition-all border-2 flex flex-col items-center gap-2 ${
                            currentCity === code 
                              ? 'bg-[#C59E39] text-white border-[#C59E39] shadow-lg' 
                              : (isDarkMode ? 'bg-[#2D221F] border-[#5D4037] text-white' : 'bg-white border-[#5D4037]/20 text-[#5D4037]')
                          }`}
                        >
                          <span className="material-symbols-outlined text-3xl">{code === City.MAKKAH ? 'mosque' : 'temple_hindu'}</span>
                          <span className="text-xs">{isAr ? names.ar : names.en}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {onboardingStep === 2 && (
              <div className="flex flex-col gap-4 animate-in slide-in-from-bottom-4 duration-500">
                <label className={`text-[11px] font-bold uppercase tracking-widest px-1 text-center ${isDarkMode ? 'text-[#C59E39]' : 'text-[#5D4037]'}`}>{t.accLabel}</label>
                <div className="grid grid-cols-1 gap-3">
                  {Object.entries(t.accModes).map(([mode, label]) => (
                    <button
                      key={mode}
                      onClick={() => setAccessibility(mode as AccessibilityMode)}
                      className={`p-5 rounded-2xl font-bold transition-all border-2 flex items-center justify-between ${
                        accessibility === mode 
                          ? 'bg-[#C59E39] text-white border-[#C59E39] shadow-lg' 
                          : (isDarkMode ? 'bg-[#2D221F] border-[#5D4037] text-white' : 'bg-white border-[#5D4037]/20 text-[#5D4037]')
                      }`}
                    >
                      <span className={isAr ? 'text-right w-full' : ''}>{label as string}</span>
                      {accessibility === mode && <span className="material-symbols-outlined">check_circle</span>}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="mt-auto pt-10 pb-8 flex flex-col items-center">
            <button 
              onClick={() => {
                if (onboardingStep < 2) {
                  setOnboardingStep(onboardingStep + 1);
                } else {
                  setOnboarded(true);
                }
              }}
              className="w-full py-5 bg-[#5D4037] text-white font-black text-lg rounded-2xl shadow-xl shadow-[#5D4037]/20 tap-scale transition-all"
            >
              {onboardingStep === 2 ? t.startBtn : t.nextBtn}
            </button>
            <button onClick={() => setOnboarded(true)} className={`w-full py-4 mt-2 font-bold text-sm opacity-60 ${isDarkMode ? 'text-[#C59E39]' : 'text-[#5D4037]'}`}>
              {t.skipBtn}
            </button>
            
            <div className="flex gap-2 mt-4">
              {[0, 1, 2].map(step => (
                <div key={step} className={`h-1.5 rounded-full transition-all duration-300 ${onboardingStep === step ? 'w-8 bg-[#C59E39]' : 'w-2 bg-gray-300'}`}></div>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <Layout 
      activeTab={activeTab} 
      onTabChange={setActiveTab} 
      language={language} 
      isDarkMode={isDarkMode} 
      toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
      onLanguageChange={(lang) => setLanguage(lang as Language)}
    >
      {renderContent()}
    </Layout>
  );
};

export default App;
