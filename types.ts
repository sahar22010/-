
export enum Language {
  AR = 'ar',
  EN = 'en',
  UR = 'ur',
  ID = 'id',
  TR = 'tr',
  FR = 'fr',
  BN = 'bn',
  MS = 'ms',
  FA = 'fa',
  HA = 'ha'
}

export const LanguageNames: Record<Language, string> = {
  [Language.EN]: 'English',
  [Language.AR]: 'العربية',
  [Language.UR]: 'اردو',
  [Language.ID]: 'Bahasa Indonesia',
  [Language.TR]: 'Türkçe',
  [Language.FR]: 'Français',
  [Language.BN]: 'বাংলা',
  [Language.MS]: 'Bahasa Melayu',
  [Language.FA]: 'فارسی',
  [Language.HA]: 'Hausa'
};

export enum City {
  MAKKAH = 'makkah',
  MADINAH = 'madinah'
}

export const CityNames: Record<City, { ar: string, en: string }> = {
  [City.MAKKAH]: { ar: 'مكة المكرمة', en: 'Makkah' },
  [City.MADINAH]: { ar: 'المدينة المنورة', en: 'Madinah' }
};

export enum AccessibilityMode {
  NORMAL = 'normal',
  VISUAL = 'visual',
  WHEELCHAIR = 'wheelchair',
  HEARING = 'hearing'
}

export enum MapCategory {
  RELIGIOUS = 'religious',
  SPORTS = 'sports',
  HEALTH = 'health',
  HAJJ_TASHRIQ = 'hajj_tashriq',
  HARAM = 'haram',
  HAJJ = 'hajj',
  TOURISM = 'tourism',
  MINA = 'mina',
  TRANSPORT = 'transport',
  HOTELS = 'hotels'
}

export interface GroupMember {
  uid: string;
  name: string;
  latitude: number;
  longitude: number;
  lastUpdated: number;
  photoURL?: string;
}

export interface ReunionGroup {
  id: string;
  name: string;
  adminUid: string;
  members: Record<string, GroupMember>;
}

export enum UserCategory {
  HAJJ = 'hajj',
  UMRAH = 'umrah',
  VISITOR = 'visitor',
  VOLUNTEER = 'volunteer',
  STAFF = 'staff'
}

export enum GuidanceMode {
  FATWA = 'fatwa',
  TRANSLATION = 'translation',
  EXPLANATION = 'explanation'
}

export interface Place {
  id: number;
  name: string;
  name_en: string;
  type: 'hotel' | 'restaurant' | 'cafe' | 'mall';
  category: string;
  address: string;
  latitude: number;
  longitude: number;
  phone: string;
  website: string;
  description: string;
  rating: number;
  price_range: string;
  photo: string;
  features: string[];
}

export interface ServiceLocation {
  id: string;
  name: string;
  nameAr: string;
  category: 'toilet' | 'zamzam' | 'shoes' | 'medical' | 'entrance' | 'carts' | 'kaaba' | 'masaa' | 'hotel' | 'hajj' | 'tourism' | 'haram' | 'religious';
  latitude: number;
  longitude: number;
  imageUrl: string;
  source: string;
  relevance?: UserCategory[];
  city: City;
}
