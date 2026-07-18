
import React from 'react';
import { HARAM_LOCATIONS, COLORS } from '../constants';
import { UserCategory, City } from '../types';

interface HomeProps {
  language: string;
  isDarkMode: boolean;
  onAction: (action: string) => void;
  userCategory: UserCategory;
  currentCity: City;
}

const Home: React.FC<HomeProps> = ({ language, isDarkMode, onAction, userCategory, currentCity }) => {
  const isAr = language === 'ar';

  const filteredLocations = HARAM_LOCATIONS.filter(loc => {
    const matchesCategory = !loc.relevance || loc.relevance.includes(userCategory);
    const matchesCity = loc.city === currentCity;
    return matchesCategory && matchesCity;
  });

  const labels = {
    currentLoc: isAr ? 'موقعي الحالي' : 'Current Location',
    haramGrounds: currentCity === City.MAKKAH ? (isAr ? 'ساحات الحرم المكي' : 'Makkah Haram Grounds') : (isAr ? 'ساحات المسجد النبوي' : 'Prophet\'s Mosque Grounds'),
    gateInfo: currentCity === City.MAKKAH ? (isAr ? 'قريب من باب الملك فهد' : 'Near King Fahd Gate') : (isAr ? 'قريب من باب السلام' : 'Near Bab Al-Salam'),
    quickServices: isAr ? 'الخدمات السريعة' : 'Quick Services',
    tawaf: isAr ? 'الطواف' : 'Tawaf',
    sai: isAr ? 'السعي' : 'Sa’i',
    barber: isAr ? 'التحلل والحلاقة' : 'Barber Shops',
    hotels: isAr ? 'الفنادق القريبة' : 'Nearby Hotels',
    reunion: isAr ? 'لمّ الشمل' : 'Reunion',
    insideHaram: isAr ? 'داخل الحرم' : 'Inside Haram',
    usefulLinks: isAr ? 'روابط مفيدة' : 'Useful Links'
  };

  const categoryLinks = {
    [UserCategory.HAJJ]: [
      { name: isAr ? 'منصة نسك حج' : 'Nusuk Hajj', url: 'https://hajj.nusuk.sa/' },
      { name: isAr ? 'وزارة الحج' : 'Ministry of Hajj', url: 'https://www.haj.gov.sa/' }
    ],
    [UserCategory.UMRAH]: [
      { name: isAr ? 'منصة نسك' : 'Nusuk Platform', url: 'https://www.nusuk.sa/' },
      { name: isAr ? 'حجز الروضة' : 'Rawdah Booking', url: 'https://www.nusuk.sa/' }
    ],
    [UserCategory.VISITOR]: [
      { name: isAr ? 'روح السعودية' : 'Visit Saudi', url: 'https://www.visitsaudi.com/' },
      { name: isAr ? 'فعاليات المدينة' : 'Madinah Events', url: 'https://www.visitsaudi.com/' }
    ],
    [UserCategory.STAFF]: [
      { name: isAr ? 'بوابة الموظفين' : 'Staff Portal', url: '#' },
      { name: isAr ? 'التعليمات التنظيمية' : 'Regulations', url: '#' }
    ],
    [UserCategory.VOLUNTEER]: [
      { name: isAr ? 'منصة التطوع' : 'Volunteer Platform', url: 'https://volunteer.haj.gov.sa/' },
      { name: isAr ? 'فرص التطوع' : 'Volunteer Opportunities', url: 'https://volunteer.haj.gov.sa/' }
    ]
  };

  const links = categoryLinks[userCategory] || [];

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-700">
      {/* Current Location Section */}
      <div className="p-5">
        <div className={`rounded-3xl p-5 shadow-sm border ${isDarkMode ? 'bg-[#251B19] border-[#3D2F2B]' : 'bg-white border-gray-100'}`}>
          <div className="flex justify-between items-start">
            <div>
              <div className={`flex items-center gap-2 text-xs font-bold ${isDarkMode ? 'text-[#C59E39]' : 'text-[#5D4037]'}`}>
                <span className="w-3 h-3 bg-red-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(248,113,113,0.5)]"></span>
                {labels.currentLoc}
              </div>
              <h2 className={`font-bold mt-1 text-lg ${isDarkMode ? 'text-white' : 'text-[#5D4037]'}`}>
                {labels.haramGrounds}
              </h2>
              <p className="text-[10px] text-gray-500">{labels.gateInfo}</p>
            </div>
            <button 
              onClick={() => onAction('reunion')}
              className="bg-[#5D4037] text-white p-3 rounded-2xl tap-scale shadow-lg flex items-center gap-2"
            >
              <span className="material-symbols-outlined">group</span>
              <span className="text-[10px] font-black uppercase tracking-widest">{labels.reunion}</span>
            </button>
          </div>
          <div className={`mt-4 h-24 rounded-2xl flex items-center justify-center border-2 border-dashed ${isDarkMode ? 'bg-black/20 border-white/5' : 'bg-gray-50 border-gray-100'}`}>
             <div className="flex flex-col items-center gap-2 opacity-40">
                <div className="w-3 h-3 bg-[#C59E39] rounded-full animate-ping"></div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#5D4037]">Location Engine Active</span>
             </div>
          </div>
        </div>
      </div>

      {/* Quick Services Grid */}
      <div className="px-5">
        <h2 className={`font-bold border-r-4 border-[#C59E39] pr-3 mb-5 ${isDarkMode ? 'text-white' : 'text-[#5D4037]'}`}>
          {labels.quickServices}
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {[
            { id: 'rituals', icon: 'directions_walk', label: labels.tawaf },
            { id: 'rituals', icon: 'route', label: labels.sai },
            { id: 'reunion', icon: 'group', label: labels.reunion },
            { id: 'services', icon: 'grid_view', label: labels.hotels }
          ].map((service, idx) => (
            <button 
              key={idx} 
              onClick={() => onAction(service.id)}
              className={`p-5 rounded-2xl shadow-sm border flex flex-col items-center gap-2 transition-all tap-scale ${
                isDarkMode ? 'bg-[#251B19] border-[#3D2F2B]' : 'bg-white border-gray-100'
              }`}
            >
              <span className="material-symbols-outlined text-[#C59E39] text-3xl">{service.icon}</span>
              <span className={`text-xs font-bold ${isDarkMode ? 'text-white/80' : 'text-[#5D4037]'}`}>{service.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Useful Links Section */}
      {links.length > 0 && (
        <div className="px-5">
          <h2 className={`font-bold border-r-4 border-[#C59E39] pr-3 mb-5 ${isDarkMode ? 'text-white' : 'text-[#5D4037]'}`}>
            {labels.usefulLinks}
          </h2>
          <div className="grid grid-cols-1 gap-3">
            {links.map((link, idx) => (
              <a 
                key={idx}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`p-4 rounded-2xl shadow-sm border flex items-center justify-between transition-all tap-scale ${
                  isDarkMode ? 'bg-[#2D221F] border-[#5D4037]' : 'bg-white border-gray-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#C59E39]">link</span>
                  <span className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-[#5D4037]'}`}>{link.name}</span>
                </div>
                <span className="material-symbols-outlined text-gray-400 text-sm">open_in_new</span>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Inside Haram Section */}
      <div className="px-5 mt-4 pb-10">
        <h2 className={`font-bold border-r-4 border-[#C59E39] pr-3 mb-5 ${isDarkMode ? 'text-white' : 'text-[#5D4037]'}`}>
          {currentCity === City.MAKKAH ? labels.insideHaram : (isAr ? 'داخل المسجد النبوي' : 'Inside Prophet\'s Mosque')}
        </h2>
        <div className="flex flex-col gap-4">
          {filteredLocations.map((loc) => (
            <div key={loc.id} className="relative aspect-[16/9] rounded-2xl overflow-hidden shadow-xl group cursor-pointer tap-scale">
              <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src={loc.imageUrl} alt={loc.nameAr} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div className="absolute bottom-0 inset-x-0 p-4">
                <span className="font-bold text-white text-lg font-amiri">{isAr ? loc.nameAr : loc.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
