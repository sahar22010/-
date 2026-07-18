
import React, { useState, useEffect, useRef } from 'react';
import { ReunionGroup, GroupMember } from '../types';
import { db, auth } from '../firebase';
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  onSnapshot, 
  getDocFromServer 
} from 'firebase/firestore';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged,
  signInAnonymously,
  User,
  updateProfile
} from 'firebase/auth';

interface ReunionViewProps {
  language: string;
  isDarkMode: boolean;
  onClose: () => void;
}

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

const ReunionView: React.FC<ReunionViewProps> = ({ language, isDarkMode, onClose }) => {
  const isAr = language === 'ar';
  const [user, setUser] = useState<User | null>(auth.currentUser);
  const [group, setGroup] = useState<ReunionGroup | null>(null);
  const [groupIdInput, setGroupIdInput] = useState('');
  const [userNameInput, setUserNameInput] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [showNameInput, setShowNameInput] = useState(false);
  const [pendingAction, setPendingAction] = useState<'create' | 'join' | null>(null);
  const [error, setError] = useState<string | null>(null);
  const locationInterval = useRef<NodeJS.Timeout | null>(null);

  const t = {
    title: isAr ? 'لمّ الشمل' : 'Reunion',
    desc: isAr ? 'شارك موقعك مع عائلتك أو حملتك لضمان سلامة الجميع.' : 'Share your location with your family or campaign to ensure everyone\'s safety.',
    createGroup: isAr ? 'إنشاء مجموعة جديدة' : 'Create New Group',
    joinGroup: isAr ? 'الانضمام لمجموعة' : 'Join Group',
    groupIdPlaceholder: isAr ? 'أدخل رمز المجموعة...' : 'Enter Group Code...',
    namePlaceholder: isAr ? 'أدخل اسمك للمجموعة...' : 'Enter your name...',
    members: isAr ? 'أعضاء المجموعة' : 'Group Members',
    noGroup: isAr ? 'لست في أي مجموعة حالياً' : 'You are not in any group currently',
    shareLoc: isAr ? 'مشاركة موقعي' : 'Share My Location',
    stopShare: isAr ? 'إيقاف المشاركة' : 'Stop Sharing',
    groupCode: isAr ? 'رمز المجموعة:' : 'Group Code:',
    copy: isAr ? 'نسخ' : 'Copy',
    signIn: isAr ? 'ابدأ الآن' : 'Start Now',
    signInBtn: isAr ? 'دخول سريع (بدون حساب)' : 'Quick Start (No Account)',
    googleSignIn: isAr ? 'دخول بجوجل' : 'Sign in with Google',
    error: isAr ? 'حدث خطأ ما' : 'Something went wrong',
    continue: isAr ? 'متابعة' : 'Continue'
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!group || !user) return;

    // Update location every 10 seconds if sharing is active
    locationInterval.current = setInterval(() => {
      updateMyLocation();
    }, 10000);

    return () => {
      if (locationInterval.current) clearInterval(locationInterval.current);
    };
  }, [group, user]);

  const handleFirestoreError = (error: any, operationType: OperationType, path: string | null) => {
    const errInfo = {
      error: error instanceof Error ? error.message : String(error),
      authInfo: {
        userId: auth.currentUser?.uid,
        email: auth.currentUser?.email,
        emailVerified: auth.currentUser?.emailVerified,
      },
      operationType,
      path
    };
    console.error('Firestore Error: ', JSON.stringify(errInfo));
    setError(t.error);
  };

  const updateMyLocation = () => {
    if (!user || !group) return;

    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      const member: GroupMember = {
        uid: user.uid,
        name: user.displayName || 'User',
        latitude,
        longitude,
        lastUpdated: Date.now(),
        photoURL: user.photoURL || undefined
      };

      try {
        const groupRef = doc(db, 'groups', group.id);
        await updateDoc(groupRef, {
          [`members.${user.uid}`]: member
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `groups/${group.id}`);
      }
    });
  };

  const handleSignIn = async () => {
    try {
      await signInAnonymously(auth);
    } catch (err) {
      console.error('Anonymous sign in error:', err);
      setError(isAr ? 'فشل الدخول السريع' : 'Quick start failed');
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error('Sign in error:', err);
      setError(isAr ? 'فشل تسجيل الدخول' : 'Sign in failed');
    }
  };

  const handleNameSubmit = async () => {
    if (!user || !userNameInput) return;
    setIsCreating(true);
    try {
      await updateProfile(user, { displayName: userNameInput });
      setShowNameInput(false);
      if (pendingAction === 'create') {
        handleCreateGroup();
      } else if (pendingAction === 'join') {
        handleJoinGroup();
      }
    } catch (err) {
      setError(isAr ? 'فشل تحديث الاسم' : 'Failed to update name');
    } finally {
      setIsCreating(false);
    }
  };

  const handleCreateGroup = async () => {
    if (!user) return;
    if (!user.displayName) {
      setPendingAction('create');
      setShowNameInput(true);
      return;
    }
    setIsCreating(true);
    setError(null);

    const groupId = Math.random().toString(36).substring(7).toUpperCase();
    
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      const member: GroupMember = {
        uid: user.uid,
        name: user.displayName || 'User',
        latitude,
        longitude,
        lastUpdated: Date.now(),
        photoURL: user.photoURL || undefined
      };

      const newGroup: ReunionGroup = {
        id: groupId,
        name: isAr ? `مجموعة ${user.displayName}` : `${user.displayName}'s Group`,
        adminUid: user.uid,
        members: { [user.uid]: member }
      };

      try {
        await setDoc(doc(db, 'groups', groupId), newGroup);
        subscribeToGroup(groupId);
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, `groups/${groupId}`);
      } finally {
        setIsCreating(false);
      }
    }, (err) => {
      setError(isAr ? 'يرجى تفعيل تحديد الموقع' : 'Please enable location services');
      setIsCreating(false);
    });
  };

  const handleJoinGroup = async () => {
    if (!user || !groupIdInput) return;
    if (!user.displayName) {
      setPendingAction('join');
      setShowNameInput(true);
      return;
    }
    setIsCreating(true);
    setError(null);

    const groupId = groupIdInput.toUpperCase();
    try {
      const groupRef = doc(db, 'groups', groupId);
      const groupSnap = await getDoc(groupRef);

      if (!groupSnap.exists()) {
        setError(isAr ? 'المجموعة غير موجودة' : 'Group not found');
        setIsCreating(false);
        return;
      }

      navigator.geolocation.getCurrentPosition(async (pos) => {
        const { latitude, longitude } = pos.coords;
        const member: GroupMember = {
          uid: user.uid,
          name: user.displayName || 'User',
          latitude,
          longitude,
          lastUpdated: Date.now(),
          photoURL: user.photoURL || undefined
        };

        await updateDoc(groupRef, {
          [`members.${user.uid}`]: member
        });
        subscribeToGroup(groupId);
        setIsCreating(false);
      }, (err) => {
        setError(isAr ? 'يرجى تفعيل تحديد الموقع' : 'Please enable location services');
        setIsCreating(false);
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `groups/${groupId}`);
      setIsCreating(false);
    }
  };

  const subscribeToGroup = (groupId: string) => {
    onSnapshot(doc(db, 'groups', groupId), (doc) => {
      if (doc.exists()) {
        setGroup(doc.data() as ReunionGroup);
      }
    }, (err) => {
      handleFirestoreError(err, OperationType.GET, `groups/${groupId}`);
    });
  };

  if (!user) {
    return (
      <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center p-6 ${isDarkMode ? 'bg-[#1F1715]' : 'bg-[#FAF3E0]'}`}>
        <button onClick={onClose} className="absolute top-6 left-6 material-symbols-outlined">close</button>
        <div className="size-24 bg-[#C59E39]/10 rounded-full flex items-center justify-center mb-6">
          <span className="material-symbols-outlined text-[#C59E39] text-6xl">bolt</span>
        </div>
        <h2 className={`text-2xl font-black mb-2 ${isDarkMode ? 'text-white' : 'text-[#5D4037]'}`}>{t.signIn}</h2>
        <p className="text-sm text-gray-500 mb-8 text-center">{t.desc}</p>
        <div className="w-full flex flex-col gap-4">
          <button 
            onClick={handleSignIn}
            className="w-full py-4 bg-[#C59E39] text-white rounded-2xl font-black shadow-xl tap-scale flex items-center justify-center gap-3"
          >
            <span className="material-symbols-outlined">flash_on</span>
            {t.signInBtn}
          </button>
          <button 
            onClick={handleGoogleSignIn}
            className={`w-full py-4 border-2 rounded-2xl font-black tap-scale flex items-center justify-center gap-3 ${
              isDarkMode ? 'bg-[#2D221F] border-[#5D4037] text-white' : 'bg-white border-gray-100 text-[#5D4037]'
            }`}
          >
            <span className="material-symbols-outlined">login</span>
            {t.googleSignIn}
          </button>
        </div>
      </div>
    );
  }

  if (showNameInput) {
    return (
      <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center p-6 ${isDarkMode ? 'bg-[#1F1715]' : 'bg-[#FAF3E0]'}`}>
        <button onClick={() => setShowNameInput(false)} className="absolute top-6 left-6 material-symbols-outlined">arrow_back</button>
        <div className="size-24 bg-[#C59E39]/10 rounded-full flex items-center justify-center mb-6">
          <span className="material-symbols-outlined text-[#C59E39] text-6xl">badge</span>
        </div>
        <h2 className={`text-2xl font-black mb-2 ${isDarkMode ? 'text-white' : 'text-[#5D4037]'}`}>{isAr ? 'ما هو اسمك؟' : 'What is your name?'}</h2>
        <p className="text-sm text-gray-500 mb-8 text-center">{isAr ? 'سيظهر هذا الاسم لأعضاء مجموعتك فقط.' : 'This name will only be visible to your group members.'}</p>
        <div className="w-full flex flex-col gap-4">
          <input 
            value={userNameInput}
            onChange={(e) => setUserNameInput(e.target.value)}
            placeholder={t.namePlaceholder}
            className={`w-full p-4 rounded-2xl border-2 outline-none focus:ring-2 focus:ring-[#C59E39] font-bold ${
              isDarkMode ? 'bg-[#2D221F] border-[#5D4037] text-white' : 'bg-white border-gray-100 text-[#5D4037]'
            }`}
          />
          <button 
            onClick={handleNameSubmit}
            disabled={!userNameInput || isCreating}
            className="w-full py-4 bg-[#C59E39] text-white rounded-2xl font-black shadow-xl tap-scale disabled:opacity-50"
          >
            {isCreating ? '...' : t.continue}
          </button>
        </div>
      </div>
    );
  }

  const copyToClipboard = () => {
    if (group) {
      navigator.clipboard.writeText(group.id);
      // Optional: show a toast or feedback
    }
  };

  const MiniMap = ({ members }: { members: Record<string, GroupMember> }) => {
    const memberList = Object.values(members);
    if (memberList.length === 0) return null;

    // Calculate bounds
    const lats = memberList.map(m => m.latitude);
    const lngs = memberList.map(m => m.longitude);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);

    const latRange = maxLat - minLat || 0.001;
    const lngRange = maxLng - minLng || 0.001;

    return (
      <div className={`relative w-full aspect-square rounded-[40px] overflow-hidden border-4 ${isDarkMode ? 'bg-[#1A1110] border-[#5D4037]' : 'bg-[#FDF8F0] border-white'} shadow-2xl mb-8`}>
        {/* Grid lines */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#C59E39 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
        
        {/* Compass */}
        <div className="absolute top-4 right-4 size-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
          <span className="text-[10px] font-black text-[#C59E39]">N</span>
        </div>

        {memberList.map((m) => {
          const x = ((m.longitude - minLng) / lngRange) * 80 + 10; // 10% padding
          const y = 100 - (((m.latitude - minLat) / latRange) * 80 + 10);
          
          return (
            <div 
              key={m.uid}
              className="absolute transition-all duration-1000 ease-in-out"
              style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}
            >
              <div className="relative group">
                <div className={`size-12 rounded-full border-4 shadow-xl overflow-hidden ${m.uid === user?.uid ? 'border-[#C59E39]' : 'border-white'}`}>
                  {m.photoURL ? <img src={m.photoURL} className="w-full h-full object-cover" /> : (
                    <div className="w-full h-full bg-[#5D4037] text-white flex items-center justify-center font-black text-xs">
                      {m.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black/80 text-white text-[8px] px-2 py-1 rounded-full font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                  {m.name}
                </div>
                {m.uid === user?.uid && (
                  <div className="absolute -top-1 -right-1 size-4 bg-[#C59E39] rounded-full border-2 border-white flex items-center justify-center">
                    <span className="material-symbols-outlined text-[10px] text-white font-black">person</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
          <p className="text-[8px] text-white font-black uppercase tracking-widest flex items-center gap-2">
            <span className="size-1.5 bg-[#C59E39] rounded-full animate-pulse"></span>
            {isAr ? 'مواقع مباشرة' : 'Live Locations'}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className={`fixed inset-0 z-50 flex flex-col ${isDarkMode ? 'bg-[#1F1715]' : 'bg-[#FAF3E0]'} animate-in slide-in-from-bottom duration-500`}>
      <div className={`p-6 flex items-center justify-between border-b ${isDarkMode ? 'bg-[#2D221F] border-white/5' : 'bg-white border-gray-100'}`}>
        <button onClick={onClose} className={`material-symbols-outlined ${isDarkMode ? 'text-gray-400' : 'text-[#5D4037]'}`}>close</button>
        <h2 className={`font-black text-lg font-amiri ${isDarkMode ? 'text-white' : 'text-[#5D4037]'}`}>{t.title}</h2>
        <div className="size-6"></div>
      </div>

      {error && (
        <div className="mx-6 mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3">
          <span className="material-symbols-outlined text-red-500">error</span>
          <p className="text-xs font-bold text-red-500">{error}</p>
          <button onClick={() => setError(null)} className="ml-auto material-symbols-outlined text-red-500 text-sm">close</button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-6">
        {!group ? (
          <div className="flex flex-col gap-8 items-center text-center pt-10">
            <div className="size-24 bg-[#C59E39]/10 rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-[#C59E39] text-6xl">group_add</span>
            </div>
            <div>
              <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-[#5D4037]'}`}>{t.noGroup}</h3>
              <p className="text-sm text-gray-500 mt-2 max-w-xs mx-auto">{t.desc}</p>
            </div>

            <div className="w-full flex flex-col gap-4 mt-4">
              <button 
                onClick={handleCreateGroup}
                disabled={isCreating}
                className="w-full py-4 bg-[#C59E39] text-white rounded-2xl font-black shadow-xl tap-scale disabled:opacity-50"
              >
                {isCreating ? '...' : t.createGroup}
              </button>

              <div className="flex items-center gap-3 py-4">
                <div className="h-px flex-1 bg-gray-300"></div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{isAr ? 'أو' : 'OR'}</span>
                <div className="h-px flex-1 bg-gray-300"></div>
              </div>

              <div className="flex flex-col gap-2">
                <input 
                  value={groupIdInput}
                  onChange={(e) => setGroupIdInput(e.target.value)}
                  placeholder={t.groupIdPlaceholder}
                  className={`w-full p-4 rounded-2xl border-2 outline-none focus:ring-2 focus:ring-[#C59E39] font-bold ${
                    isDarkMode ? 'bg-[#2D221F] border-[#5D4037] text-white' : 'bg-white border-gray-100 text-[#5D4037]'
                  }`}
                />
                <button 
                  onClick={handleJoinGroup}
                  disabled={isCreating || !groupIdInput}
                  className="w-full py-4 bg-[#5D4037] text-white rounded-2xl font-black shadow-xl tap-scale disabled:opacity-50"
                >
                  {isCreating ? '...' : t.joinGroup}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <div className={`p-6 rounded-[32px] border-2 ${isDarkMode ? 'bg-[#2D221F] border-[#5D4037]' : 'bg-white border-gray-100'} shadow-sm`}>
              <div className="flex justify-between items-center mb-4">
                <h3 className={`font-black text-lg ${isDarkMode ? 'text-white' : 'text-[#5D4037]'}`}>{group.name}</h3>
                <span className="bg-green-500/10 text-green-500 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Active</span>
              </div>
              <div className="flex items-center justify-between bg-[#FAF3E0] dark:bg-black/20 p-4 rounded-2xl">
                <div>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{t.groupCode}</p>
                  <p className={`text-xl font-black tracking-widest ${isDarkMode ? 'text-[#C59E39]' : 'text-[#5D4037]'}`}>{group.id}</p>
                </div>
                <button 
                  onClick={copyToClipboard}
                  className="bg-[#C59E39] text-white px-4 py-2 rounded-xl text-[10px] font-black tap-scale shadow-md"
                >
                  {t.copy}
                </button>
              </div>
            </div>

            <MiniMap members={group.members} />

            <div className="flex flex-col gap-4">
              <h4 className={`text-xs font-black uppercase tracking-widest ${isDarkMode ? 'text-[#C59E39]' : 'text-[#5D4037]'}`}>{t.members}</h4>
              {Object.values(group.members).map((member: any) => (
                <div key={member.uid} className={`flex items-center justify-between p-4 rounded-2xl border ${isDarkMode ? 'bg-[#2D221F] border-[#5D4037]' : 'bg-white border-gray-50'}`}>
                  <div className="flex items-center gap-4">
                    <div className="size-12 rounded-full bg-[#C59E39]/20 overflow-hidden flex items-center justify-center text-[#C59E39] font-black">
                      {member.photoURL ? <img src={member.photoURL} className="w-full h-full object-cover" /> : member.name.charAt(0)}
                    </div>
                    <div>
                      <p className={`font-bold ${isDarkMode ? 'text-white' : 'text-[#5D4037]'}`}>{member.name}</p>
                      <p className="text-[10px] text-gray-500">
                        {isAr ? 'آخر تحديث: ' : 'Last seen: '}
                        {new Date(member.lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="size-2 bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>

            <button 
              onClick={updateMyLocation}
              className="mt-6 w-full py-4 bg-[#C59E39] text-white rounded-2xl font-black shadow-xl tap-scale flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined">sync</span>
              {t.shareLoc}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReunionView;
