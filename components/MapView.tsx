
import React, { useState, useMemo, useEffect } from 'react';
import { HARAM_LOCATIONS, COLORS } from '../constants';
import { AccessibilityMode, MapCategory, ServiceLocation, UserCategory, City } from '../types';
import ReunionView from './ReunionView';

interface MapViewProps {
  language: string;
  isDarkMode: boolean;
  accessibility: AccessibilityMode;
  userCategory: UserCategory;
  currentCity: City;
}

const MapView: React.FC<MapViewProps> = ({ language, isDarkMode, accessibility, userCategory, currentCity }) => {
  const isAr = language === 'ar';
  const [selectedCategory, setSelectedCategory] = useState<MapCategory>(MapCategory.HARAM);
  const [showReunion, setShowReunion] = useState(false);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);

  const filteredLocations = useMemo(() => {
    return HARAM_LOCATIONS.filter(loc => {
      const matchesCategory = !loc.relevance || loc.relevance.includes(userCategory);
      const matchesCity = loc.city === currentCity;
      return matchesCategory && matchesCity;
    });
  }, [userCategory, currentCity]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
    });
  }, []);

  const nearestService = useMemo(() => {
    if (!userLocation || filteredLocations.length === 0) return filteredLocations[0] || HARAM_LOCATIONS[0];
    
    return [...filteredLocations].sort((a, b) => {
      const distA = Math.sqrt(Math.pow(a.latitude - userLocation.lat, 2) + Math.pow(a.longitude - userLocation.lng, 2));
      const distB = Math.sqrt(Math.pow(b.latitude - userLocation.lat, 2) + Math.pow(b.longitude - userLocation.lng, 2));
      return distA - distB;
    })[0];
  }, [userLocation, filteredLocations]);
  
  const mapLinks: Record<MapCategory, string> = {
    [MapCategory.RELIGIOUS]: '1Be8g3PpqiALoYvZx4Rm4FhCXiaNvAJo',
    [MapCategory.SPORTS]: '1XU0lHZxzm8G5a4IUzuEc63jNlax5iUE',
    [MapCategory.HEALTH]: '1XGlYPzcgOB-CEHiMrFmQbeJAzmJZjKg',
    [MapCategory.HAJJ_TASHRIQ]: '1nuR1-IL-xoXOpVYiNQzEJSPNOfsfL88',
    [MapCategory.HARAM]: '1Rie5pUJfJo86RQ7LS_Kbmt4T1wLx_iE',
    [MapCategory.HAJJ]: '1Bh_baOiKfyfb9-LOoVwS5sm0nTPqXMY',
    [MapCategory.TOURISM]: '1-u5TVGRZr1INueOPOhMXGVZDBqFl8Bw',
    [MapCategory.MINA]: '18We8Y-7jmXE0WFR9qMjvZXBeiAl8iIk',
    [MapCategory.TRANSPORT]: '18eqNtC7G1-xHq4c-N22Gi8PrfTh3YAw',
    [MapCategory.HOTELS]: '1Bh_baOiKfyfb9-LOoVwS5sm0nTPqXMY',
  };

  const categoryLabels: Record<MapCategory, { ar: string, en: string, icon: string }> = {
    [MapCategory.RELIGIOUS]: { ar: 'الخدمات الدينية', en: 'Religious Services', icon: 'mosque' },
    [MapCategory.SPORTS]: { ar: 'الأندية والرياضة', en: 'Sports & Clubs', icon: 'sports_soccer' },
    [MapCategory.HEALTH]: { ar: 'الخدمات الصحية', en: 'Health Services', icon: 'medical_services' },
    [MapCategory.HAJJ_TASHRIQ]: { ar: 'أيام التشريق', en: 'Tashriq Days', icon: 'event' },
    [MapCategory.HARAM]: { ar: 'الحرم المكي', en: 'Al-Haram', icon: 'account_balance' },
    [MapCategory.HAJJ]: { ar: 'مشاعر الحج', en: 'Hajj Rituals', icon: 'landscape' },
    [MapCategory.TOURISM]: { ar: 'الخدمات السياحية', en: 'Tourism Services', icon: 'map' },
    [MapCategory.MINA]: { ar: 'مشعر منى', en: 'Mina Area', icon: 'tent' },
    [MapCategory.TRANSPORT]: { ar: 'خدمات النقل', en: 'Transport Services', icon: 'directions_bus' },
    [MapCategory.HOTELS]: { ar: 'الفنادق', en: 'Hotels', icon: 'hotel' },
  };

  const t = {
    current: isAr ? 'موقعي الحالي' : 'Current Location',
    inside: currentCity === City.MAKKAH 
      ? (isAr ? 'داخل أسوار الحرم المكي' : 'Inside Makkah Haram')
      : (isAr ? 'داخل أسوار الحرم النبوي' : 'Inside Prophet\'s Mosque'),
    outside: isAr ? 'خارج حدود الحرم' : 'Outside Haram Perimeter',
    navigate: isAr ? 'ابدأ الملاحة' : 'Navigate',
    accuracy: isAr ? 'دقة عالية (5م)' : 'High Accuracy (5m)',
    locName: currentCity === City.MAKKAH
      ? (isAr ? 'الساحات الشمالية - توسعة الملك عبدالله' : 'Northern Grounds - King Abdullah Ext.')
      : (isAr ? 'الساحات الغربية - باب السلام' : 'Western Grounds - Bab Al-Salam'),
    searchPlaceholder: isAr ? 'ابحث عن أقرب مرفق...' : 'Search for nearest service...',
    mapTitle: isAr ? 'الخرائط التفاعلية' : 'Interactive Maps',
    reunion: isAr ? 'لمّ الشمل' : 'Reunion'
  };

  const ServiceCard: React.FC<{ item: ServiceLocation }> = ({ item }) => (
    <div className={`relative w-full aspect-[16/9] rounded-2xl overflow-hidden shadow-lg mb-6 group cursor-pointer border-2 ${isDarkMode ? 'border-[#5D4037]' : 'border-white/20'}`}>
      <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent flex flex-col justify-end p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[#C59E39] text-2xl">
              {item.category === 'kaaba' ? 'mosque' : item.category === 'haram' ? 'account_balance' : item.category === 'religious' ? 'temple_hindu' : item.category === 'zamzam' ? 'water_drop' : item.category === 'toilet' ? 'wc' : item.category === 'hajj' ? 'landscape' : item.category === 'tourism' ? 'map' : 'location_on'}
            </span>
            <h3 className="text-white font-bold text-lg">{isAr ? item.nameAr : item.name}</h3>
          </div>
          <span className="text-white bg-[#C59E39] px-3 py-1 rounded-full text-[10px] font-black tracking-widest shadow-lg">120M</span>
        </div>
        <p className="text-white/80 text-[10px] mt-1 font-bold uppercase tracking-wider">{isAr ? 'متاح الآن' : 'Available Now'}</p>
        <div className="flex gap-2 mt-3">
           <button className="flex-1 py-2 bg-[#5D4037] text-white rounded-xl text-xs font-bold tap-scale shadow-xl flex items-center justify-center gap-2">
             <span className="material-symbols-outlined text-sm">near_me</span>
             {t.navigate}
           </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`flex flex-col h-full ${isDarkMode ? 'bg-[#1F1715]' : 'bg-[#FAF3E0]'}`}>
      {/* Header Search & Current Loc */}
      <div className={`p-5 ${isDarkMode ? 'bg-[#2D221F]' : 'bg-white'} border-b ${isDarkMode ? 'border-[#5D4037]' : 'border-gray-100'}`}>
        <div className="relative mb-4">
          <span className={`material-symbols-outlined absolute ${isAr ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-gray-400`}>search</span>
          <input 
            className={`w-full ${isAr ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-3 rounded-2xl border-none outline-none focus:ring-2 focus:ring-[#C59E39] text-sm ${isDarkMode ? 'bg-[#1F1715] text-white' : 'bg-gray-100 text-[#5D4037]'}`}
            placeholder={t.searchPlaceholder}
          />
        </div>
        
        <div className="flex flex-col gap-4">
          {nearestService && (
            <div className={`p-4 rounded-2xl border-2 ${isDarkMode ? 'bg-[#C59E39]/10 border-[#C59E39]/30' : 'bg-[#C59E39]/5 border-[#C59E39]/20'} mb-2 flex items-center justify-between gap-4`}>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="material-symbols-outlined text-[#C59E39] text-sm animate-pulse">explore</span>
                  <span className="text-[10px] font-black text-[#C59E39] uppercase tracking-widest">{isAr ? 'موقع مقترح' : 'Suggested Location'}</span>
                </div>
                <p className={`text-xs font-bold ${isDarkMode ? 'text-white' : 'text-[#5D4037]'}`}>
                  {isAr ? `أنت قريب من ${nearestService.nameAr}` : `You are near ${nearestService.name}`}
                </p>
              </div>
              <button 
                onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${nearestService.latitude},${nearestService.longitude}`, '_blank')}
                className="px-4 py-2 rounded-xl bg-[#C59E39] text-white text-[10px] font-black uppercase tracking-widest tap-scale shadow-lg shadow-[#C59E39]/20"
              >
                {t.navigate}
              </button>
            </div>
          )}

          <div className="flex items-center justify-between overflow-x-auto scrollbar-hide gap-2 py-2">
            {Object.values(MapCategory).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black whitespace-nowrap transition-all flex items-center gap-2 border ${
                  selectedCategory === cat 
                    ? 'bg-[#C59E39] text-white border-[#C59E39] shadow-lg' 
                    : (isDarkMode ? 'bg-[#1F1715] text-gray-400 border-[#3D2F2B]' : 'bg-white text-[#5D4037] border-gray-100 shadow-sm')
                }`}
              >
                <span className="material-symbols-outlined text-sm">{categoryLabels[cat].icon}</span>
                {isAr ? categoryLabels[cat].ar : categoryLabels[cat].en}
              </button>
            ))}
          </div>

          <div className={`relative w-full aspect-[16/10] rounded-3xl overflow-hidden border-2 ${isDarkMode ? 'border-[#5D4037]' : 'border-white'} shadow-2xl`}>
            <iframe 
              src={`https://www.google.com/maps/d/embed?mid=${mapLinks[selectedCategory]}&ehbc=2E312F`} 
              width="100%" 
              height="100%" 
              style={{ border: 0 }}
              title="Rafeeq Map"
            ></iframe>
            <div className="absolute top-4 right-4 bg-[#C59E39] text-white p-2 rounded-xl shadow-lg animate-pulse">
              <span className="material-symbols-outlined text-sm">{categoryLabels[selectedCategory].icon}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pt-8">
        <div className={`p-5 rounded-3xl border mb-8 ${isDarkMode ? 'bg-black/20 border-[#5D4037]' : 'bg-white border-[#5D4037]/10'} relative shadow-sm`}>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                <span className={`text-xs font-black uppercase tracking-widest ${isDarkMode ? 'text-[#C59E39]' : 'text-[#5D4037]'}`}>{t.current}</span>
              </div>
              <h2 className={`text-base font-bold mb-1 font-amiri ${isDarkMode ? 'text-white' : 'text-[#5D4037]'}`}>{t.locName}</h2>
              <p className="text-[10px] text-gray-500 font-bold">{t.accuracy}</p>
            </div>
            <button className="bg-[#5D4037] text-white p-3 rounded-2xl shadow-xl tap-scale">
              <span className="material-symbols-outlined">my_location</span>
            </button>
          </div>
        </div>

        <div className={`border-${isAr ? 'r' : 'l'}-4 border-[#C59E39] ${isAr ? 'pr-3' : 'pl-3'} mb-6 flex justify-between items-center`}>
           <h2 className={`font-black text-xl font-amiri ${isDarkMode ? 'text-white' : 'text-[#5D4037]'}`}>{t.inside}</h2>
           <button 
             onClick={() => setShowReunion(true)}
             className="text-[10px] font-black text-[#C59E39] uppercase tracking-widest flex items-center gap-1 tap-scale"
           >
             <span className="material-symbols-outlined text-sm">group</span>
             {t.reunion}
           </button>
        </div>
        
        {showReunion && <ReunionView language={language} isDarkMode={isDarkMode} onClose={() => setShowReunion(false)} />}
        
        {filteredLocations.map(loc => <ServiceCard key={loc.id} item={loc} />)}

        <div className={`border-${isAr ? 'r' : 'l'}-4 border-[#C59E39] ${isAr ? 'pr-3' : 'pl-3'} mt-10 mb-6`}>
           <h2 className={`font-black text-xl font-amiri ${isDarkMode ? 'text-white' : 'text-[#5D4037]'}`}>{t.outside}</h2>
        </div>

        {/* Categories Grid from mockup */}
        <div className="grid grid-cols-2 gap-3 mb-12">
          {['local_pharmacy', 'local_taxi', 'currency_exchange', 'contactless'].map((icon, idx) => (
            <div key={idx} className={`p-4 rounded-2xl shadow-sm border flex flex-col items-center text-center gap-2 transition-all cursor-pointer tap-scale ${isDarkMode ? 'bg-[#2D221F] border-[#5D4037] group hover:bg-[#5D4037]' : 'bg-white border-gray-100 group hover:bg-[#5D4037]'}`}>
              <span className={`material-symbols-outlined text-2xl transition-colors group-hover:text-white ${isDarkMode ? 'text-[#C59E39]' : 'text-[#5D4037]'}`}>{icon}</span>
              <span className={`text-[10px] font-bold uppercase tracking-tight transition-colors group-hover:text-white ${isDarkMode ? 'text-gray-300' : 'text-[#5D4037]'}`}>
                {idx === 0 ? (isAr ? 'الصيدليات' : 'Pharmacy') : idx === 1 ? (isAr ? 'المواصلات' : 'Taxi') : idx === 2 ? (isAr ? 'الصرافة' : 'Exchange') : (isAr ? 'الاتصالات' : 'Telecom')}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MapView;
