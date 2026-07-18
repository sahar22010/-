
import { ServiceLocation, UserCategory, City } from './types';

export const COLORS = {
  PRIMARY: '#5D4037', // Spiritual Deep Brown
  GOLD: '#C59E39',    // Noble Gold
  BEIGE: '#FFF9F0',   // Warm Light Beige Background
  WHITE: '#FFFFFF',
  BLACK: '#1A1110',
  GRAY_LIGHT: '#F5F1E9',
  DARK_BG: '#1A1110', // Deepest Brown (Almost Black)
  DARK_CARD: '#251B19', // Rich Dark Brown Card
  DARK_BORDER: '#3D2F2B',
  DARK_TEXT: '#E5D3B3',
  ACCENT_BROWN: '#8D6E63'
};

export const OFFICIAL_LINKS = {
  GOLF_CARTS: 'https://carts.alharamain.gov.sa/',
  HARAMAIN_MAIN: 'https://alharamain.gov.sa',
  IFTA: 'https://www.alifta.gov.sa',
  NUSUK: 'https://alharamain.gov.sa/public/?page=nusuk-ar'
};

export const HARAM_LOCATIONS: ServiceLocation[] = [
  {
    id: 'k1',
    name: 'The Holy Kaaba & Mataf',
    nameAr: 'أقرب مسار للمطاف',
    category: 'kaaba',
    latitude: 21.4225,
    longitude: 39.8262,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDbLtBBnJ0Q5U7tIpfNqRrK3rapYwjjGvJEjciHnqbA7AWi9ee-zLEUVhQspqbjJIB89UDgzeDh2IX9p_LcxnY4P98uH3K--OwJ43wkyYBANbcPDTPYuxsH333GM65klNH2luzNFNol-rOBaEUg8qCcx3RzK_P5pAS4r3p7PXQl_3eiO4PDX_SEdGhnf2NQDOXERKith4_HeGwHDFdPtQQAnjdrLAJV_deMlpBtTaMeVOF9ofFMCxCn5cdzZkS6UHg2MscuJuWCvsWM',
    source: 'Official Haramain',
    relevance: [UserCategory.HAJJ, UserCategory.UMRAH, UserCategory.VISITOR],
    city: City.MAKKAH
  },
  {
    id: 'm1',
    name: "Masa'a Area (Safa & Marwa)",
    nameAr: 'أقرب مدخل للمسعى',
    category: 'masaa',
    latitude: 21.4230,
    longitude: 39.8275,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC-F9fUJgbBAwTWqutKxW_CiNsZM_Jdamcj-dEhLuT9Y3b5qIBWzXDphQlAW45DhZVdyR95g32VivbA7mS8dd275RaNVg3-zAkCEGnwAto71fAyN9A5lgEJVwSVUI4N2NcRGJsKK658TryRwLXhDCQ-bpTpHZmVm5WoAo8D60ys1axq_EaRY99lq6xwTefp3_IzI3LhzRH0yIBdpxDSGDsSJgMSxNGHTt1KajCfIzPif5X8ZatWNM8hueTc5l-ZLfEJ9ERaaqxF98oc',
    source: 'Official Haramain',
    relevance: [UserCategory.HAJJ, UserCategory.UMRAH],
    city: City.MAKKAH
  },
  {
    id: 'h1',
    name: 'Mina Tents Area',
    nameAr: 'مخيمات منى',
    category: 'hajj',
    latitude: 21.4161,
    longitude: 39.8833,
    imageUrl: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?q=80&w=1000&auto=format&fit=crop',
    source: 'Official Hajj',
    relevance: [UserCategory.HAJJ],
    city: City.MAKKAH
  },
  {
    id: 'h2',
    name: 'Arafat Plain',
    nameAr: 'صعيد عرفات',
    category: 'hajj',
    latitude: 21.3547,
    longitude: 39.9842,
    imageUrl: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?q=80&w=1000&auto=format&fit=crop',
    source: 'Official Hajj',
    relevance: [UserCategory.HAJJ],
    city: City.MAKKAH
  },
  {
    id: 'v1',
    name: 'Exhibition of the Two Holy Mosques',
    nameAr: 'معرض عمارة الحرمين الشريفين',
    category: 'tourism',
    latitude: 21.4225,
    longitude: 39.7500,
    imageUrl: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?q=80&w=1000&auto=format&fit=crop',
    source: 'Official Tourism',
    relevance: [UserCategory.VISITOR, UserCategory.UMRAH, UserCategory.HAJJ],
    city: City.MAKKAH
  },
  {
    id: 'md1',
    name: "Prophet's Mosque",
    nameAr: 'المسجد النبوي الشريف',
    category: 'haram',
    latitude: 24.4672,
    longitude: 39.6111,
    imageUrl: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?q=80&w=1000&auto=format&fit=crop',
    source: 'Official Madinah',
    relevance: [UserCategory.VISITOR, UserCategory.HAJJ, UserCategory.UMRAH],
    city: City.MADINAH
  },
  {
    id: 'md2',
    name: 'Quba Mosque',
    nameAr: 'مسجد قباء',
    category: 'religious',
    latitude: 24.4392,
    longitude: 39.6172,
    imageUrl: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?q=80&w=1000&auto=format&fit=crop',
    source: 'Official Madinah',
    relevance: [UserCategory.VISITOR, UserCategory.HAJJ, UserCategory.UMRAH],
    city: City.MADINAH
  }
];

export const TAWAF_DUAS = [
  { id: 'd1', text: 'سُبْحَانَ اللهِ، وَالْحَمْدُ للهِ، وَلَا إِلَهَ إِلَّا اللهُ، وَاللهُ أَكْبَرُ، وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللهِ' },
  { id: 'd2', text: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَدَابَ النَّارِ' },
  { id: 'd3', text: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ' },
  { id: 'd4', text: 'اللَّهُمَّ اجْعَلْهُ حَجًّا مَبْرُورًا وَذَنْبًا مَغْفُورًا وَسَعْيًا مَشْكُورًا' },
  { id: 'd5', text: 'اللَّهُمَّ اغْفِرْ وَارْحَمْ وَاعْفُ عَمَّا تَعْلَمْ وَأَنْتَ الْأَعَزُّ الْأَكْرَمُ' },
  { id: 'd6', text: 'اللَّهُمَّ قِنِي عَذَابَكَ يَوْمَ تَبْعَثُ عِبَادَكَ' },
  { id: 'd7', text: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ الرِّضَا بَعْدَ الْقَضَاءِ وَبَرْدَ الْعَيْشِ بَعْدَ الْمَوْتِ' },
  { id: 'd8', text: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْفَوْزَ بِالْجَنَّةِ وَالنَّجَاةَ مِنَ النَّارِ' },
  { id: 'd9', text: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الشَّكِّ وَالشِّرْكِ وَالشِّقَاقِ وَالنِّفَاقِ وَسُوءِ الْأَخْلَاقِ' },
  { id: 'd10', text: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنَ الْخَيْرِ كُلِّهِ عَاجِلِهِ وَآجِلِهِ مَا عَلِمْتُ مِنْهُ وَمَا لَمْ أَعْلَمْ' },
  { id: 'd11', text: 'اللَّهُمَّ حَبِّبْ إِلَيْنَا الْإِيمَانَ وَزَيِّنْهُ فِي قُلُوبِنَا وَكَرِّهْ إِلَيْنَا الْكُفْرَ وَالْفُسُوقَ وَالْعِصْيَانَ' },
  { id: 'd12', text: 'اللَّهُمَّ تَوَفَّنَا مُسْلِمِينَ وَأَحْيِنَا مُسْلِمِينَ وَأَلْحِقْنَا بِالصَّالِحِينَ غَيْرَ خَزَايَا وَلَا مَفْتُونِينَ' },
  { id: 'd13', text: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ عِيشَةً نَقِيَّةً وَمِيتَةً سَوِيَّةً وَمَرَدًّا غَيْرَ مَخْزِيٍّ وَلَا فَاضِحٍ' },
  { id: 'd14', text: 'اللَّهُمَّ قَنِّعْنِي بِمَا رَزَقْتَنِي وَبَارِكْ لِي فِيهِ وَاخْلُفْ عَلَى كُلِّ غَائِبَةٍ لِي بِخَيْرٍ' },
  { id: 'd15', text: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْهُدَى وَالتُّقَى وَالْعَفَافَ وَالْغِنَى' }
];

export const SAI_DUAS = [
  { id: 's1', text: 'لَا إِلَهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ' },
  { id: 's2', text: 'لَا إِلَهَ إِلَّا اللهُ وَحْدَهُ، أَنْجَزَ وَعْدَهُ، وَنَصَرَ عَبْدَهُ، وَهَزَمَ الْأَحْزَابَ وَحْدَهُ' },
  { id: 's3', text: 'رَبِّ اغْفِرْ وَارْحَمْ وَتَجَاوَزْ عَمَّا تَعْلَمْ إِنَّكَ أَنْتَ الْأَعَزُّ الْأَكْرَمُ' },
  { id: 's4', text: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ مُوجِبَاتِ رَحْمَتِكَ وَعَزَائِمَ مَغْفِرَتِكَ وَالسَّلَامَةَ مِنْ كُلِّ إِثْمٍ' },
  { id: 's5', text: 'اللَّهُمَّ اجْعَلْ فِي قَلْبِي نُورًا وَفِي لِسَانِي نُورًا وَاجْعَلْ فِي بَصَرِي نُورًا وَفِي سَمْعِي نُورًا' },
  { id: 's6', text: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ وَالْعَجْزِ وَالْكَسَلِ وَالْبُخْلِ وَالْجُبْنِ' },
  { id: 's7', text: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْهُدَى وَالتُّقَى وَالْعَفَافَ وَالْغِنَى' },
  { id: 's8', text: 'اللَّهُمَّ لَا تَدَعْ لَنَا ذَنْبًا إِلَّا غَفَرْتَهُ وَلَا هَمًّا إِلَّا فَرَّجْتَهُ وَلَا دَيْنًا إِلَّا قَضَيْتَهُ' },
  { id: 's9', text: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا وَرِزْقًا طَيِّبًا وَعَمَلًا مُتَقَبَّلًا' },
  { id: 's10', text: 'اللَّهُمَّ بَارِكْ لَنَا فِيمَا رَزَقْتَنَا وَقِنَا عَذَابَ النَّارِ' },
  { id: 's11', text: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْجَنَّةَ وَمَا قَرَّبَ إِلَيْهَا مِنْ قَوْلٍ أَوْ عَمَلٍ' },
  { id: 's12', text: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ النَّارِ وَمَا قَرَّبَ إِلَيْهَا مِنْ قَوْلٍ أَوْ عَمَلٍ' },
  { id: 's13', text: 'اللَّهُمَّ أَصْلِحْ لِي دِينِي الَّذِي هُوَ عِصْمَةُ أَمْرِي وَأَصْلِحْ لِي دُنْيَايَ الَّتِي فِيهَا مَعَاشِي' },
  { id: 's14', text: 'اللَّهُمَّ اجْعَلِ الْحَيَاةَ زِيَادَةً لِي فِي كُلِّ خَيْرٍ وَاجْعَلِ الْمَوْتَ رَاحَةً لِي مِنْ كُلِّ شَرٍّ' },
  { id: 's15', text: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ حُسْنَ الْخَاتِمَةِ وَالْعَفْوَ عِنْدَ الْحِسَابِ' }
];
