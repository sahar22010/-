import React, { useState, useRef, useEffect } from 'react';
import { getGuidanceResponse } from '../services/guidanceService';
import { GuidanceMode } from '../types';

interface GuidanceChatProps {
  language: string;
  isDarkMode: boolean;
}

const GuidanceChat: React.FC<GuidanceChatProps> = ({ language, isDarkMode }) => {
  const isAr = language === 'ar';
  const [mode, setMode] = useState<GuidanceMode | null>(null);
  const [messages, setMessages] = useState<{role: 'user' | 'assistant', content: string, time: string}[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const startChat = (selectedMode: GuidanceMode) => {
    setMode(selectedMode);
    const welcomeMsgs = {
      [GuidanceMode.EXPLANATION]: isAr ? 'أهلاً بك. أنا رفيق، جاهز لشرح خطوات النسك لك بالتفصيل بناءً على موقع دار الإفتاء. عن ماذا تود أن تسأل؟' : 'Welcome. I am Rafeeq, ready to explain rituals in detail based on the Saudi Ifta office. What would you like to ask?',
      [GuidanceMode.FATWA]: isAr ? 'مرحباً بك في خدمة الفتاوى. تفضل بطرح سؤالك الشرعي المتعلق بالحج والعمرة.' : 'Welcome to the Fatwa service. Please ask your religious question regarding Hajj or Umrah.',
      [GuidanceMode.TRANSLATION]: isAr ? 'أهلاً بك في خدمة الترجمة الفورية. اكتب أي جملة أو سؤال وسأقوم بترجمته لك فوراً إلى أي لغة تطلبها.' : 'Welcome to the instant translation service. Type any sentence or question and I will translate it for you immediately into any language you request.'
    };
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages([{ role: 'assistant', content: welcomeMsgs[selectedMode], time: now }]);
  };

  const handleSend = async () => {
    if (!input.trim() || !mode) return;
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg, time: now }]);
    setIsLoading(true);

    const guidanceResponse = await getGuidanceResponse(userMsg, mode, language);
    setMessages(prev => [...prev, { role: 'assistant', content: guidanceResponse, time: now }]);
    setIsLoading(false);
  };

  if (!mode) {
    return (
      <div className="px-6 py-10 flex flex-col gap-6 animate-in slide-in-from-bottom-5 duration-700">
        <div className="text-center mb-4">
          <div className="size-20 bg-[#C59E39]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-[#C59E39] text-5xl">support_agent</span>
          </div>
          <h2 className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-[#5D4037]'}`}>
            {isAr ? 'كيف يمكن لرفيق مساعدتك؟' : 'How can Rafeeq help you?'}
          </h2>
          <p className="text-sm text-gray-500 mt-2">{isAr ? 'اختر نوع الخدمة التي ترغب بها' : 'Select the type of service you need'}</p>
        </div>

        <div className="flex flex-col gap-4">
          <button 
            onClick={() => startChat(GuidanceMode.EXPLANATION)}
            className={`flex items-center gap-5 p-6 rounded-[32px] border-2 transition-all tap-scale ${isDarkMode ? 'bg-[#251B19] border-[#3D2F2B] hover:border-[#C59E39]' : 'bg-white border-gray-100 hover:border-[#C59E39] shadow-sm'}`}
          >
            <div className="size-14 rounded-2xl bg-[#5D4037] text-white flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-3xl">menu_book</span>
            </div>
            <div className="text-right">
              <h3 className={`font-bold ${isDarkMode ? 'text-white' : 'text-[#5D4037]'}`}>{isAr ? 'شرح صفة النسك' : 'Ritual Explanation'}</h3>
              <p className="text-[10px] text-gray-500">{isAr ? 'تعلم خطوات العمرة والحج من المصادر الرسمية' : 'Learn rituals from official sources'}</p>
            </div>
          </button>

          <button 
            onClick={() => startChat(GuidanceMode.FATWA)}
            className={`flex items-center gap-5 p-6 rounded-[32px] border-2 transition-all tap-scale ${isDarkMode ? 'bg-[#251B19] border-[#3D2F2B] hover:border-[#C59E39]' : 'bg-white border-gray-100 hover:border-[#C59E39] shadow-sm'}`}
          >
            <div className="size-14 rounded-2xl bg-[#C59E39] text-white flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-3xl">gavel</span>
            </div>
            <div className="text-right">
              <h3 className={`font-bold ${isDarkMode ? 'text-white' : 'text-[#5D4037]'}`}>{isAr ? 'طلب فتوى شرعية' : 'Religious Ruling (Fatwa)'}</h3>
              <p className="text-[10px] text-gray-500">{isAr ? 'إجابات من دار الإفتاء السعودية alifta.gov.sa' : 'Answers from Saudi Ifta office'}</p>
            </div>
          </button>

          <button 
            onClick={() => startChat(GuidanceMode.TRANSLATION)}
            className={`flex items-center gap-5 p-6 rounded-[32px] border-2 transition-all tap-scale ${isDarkMode ? 'bg-[#251B19] border-[#3D2F2B] hover:border-[#C59E39]' : 'bg-white border-gray-100 hover:border-[#C59E39] shadow-sm'}`}
          >
            <div className="size-14 rounded-2xl bg-[#8D6E63] text-white flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-3xl">translate</span>
            </div>
            <div className="text-right">
              <h3 className={`font-bold ${isDarkMode ? 'text-white' : 'text-[#5D4037]'}`}>{isAr ? 'ترجمة فورية' : 'Instant Translation'}</h3>
              <p className="text-[10px] text-gray-500">{isAr ? 'ترجمة إلى أي لغة تطلبها' : 'Translate to any language you request'}</p>
            </div>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-full ${isDarkMode ? 'bg-[#1F1715]' : 'bg-[#FAF3E0]'}`}>
      <div className={`p-4 border-b flex items-center justify-between ${isDarkMode ? 'bg-[#2D221F] border-white/5' : 'bg-white border-gray-100'}`}>
        <button onClick={() => setMode(null)} className={`material-symbols-outlined ${isDarkMode ? 'text-gray-400' : 'text-[#5D4037]'}`}>arrow_back</button>
        <span className={`font-bold text-xs uppercase tracking-widest ${isDarkMode ? 'text-[#C59E39]' : 'text-[#5D4037]'}`}>
          {mode === GuidanceMode.FATWA ? (isAr ? 'خدمة الفتاوى' : 'Fatwa Service') : mode === GuidanceMode.EXPLANATION ? (isAr ? 'شرح النسك' : 'Ritual Guide') : (isAr ? 'ترجمة فورية' : 'Translation')}
        </span>
        <div className="size-6"></div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((m, i) => (
          <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'} gap-1.5`}>
            <div className={`flex items-start gap-2.5 max-w-[85%] ${isAr ? 'flex-row-reverse' : ''}`}>
              {m.role === 'assistant' && (
                <div className="size-8 rounded-full bg-white border border-[#C59E39]/30 flex items-center justify-center shrink-0 mt-1 shadow-sm">
                  <span className="material-symbols-outlined text-[#C59E39] text-lg">support_agent</span>
                </div>
              )}
              <div className={`p-4 rounded-2xl shadow-sm ${
                m.role === 'user' 
                  ? 'bg-[#5D4037] text-white rounded-tr-none' 
                  : (isDarkMode ? 'bg-[#2D221F] text-gray-200 border-[#5D4037]' : 'bg-white text-[#5D4037] border-gray-100')
              } border`}>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.content}</p>
                {m.role === 'assistant' && i > 0 && (
                  <div className="bg-[#FAF3E0]/50 dark:bg-black/20 p-3 rounded-lg border-l-4 border-[#C59E39] italic text-[10px] mt-3 opacity-80 flex items-center gap-2">
                     <span className="material-symbols-outlined text-xs">verified</span>
                     {isAr ? 'المصدر: دار الإفتاء alifta.gov.sa' : 'Source: Saudi Ifta alifta.gov.sa'}
                  </div>
                )}
              </div>
            </div>
            <span className={`text-[10px] text-gray-400 font-medium ${isAr ? 'mr-10' : 'ml-10'}`}>{m.time}</span>
          </div>
        ))}
        {isLoading && (
          <div className={`flex items-start gap-2.5 ${isAr ? 'flex-row-reverse' : ''}`}>
            <div className="size-8 rounded-full bg-white border border-[#C59E39]/30 flex items-center justify-center shrink-0 mt-1 shadow-sm">
              <span className="material-symbols-outlined text-[#C59E39] text-lg">support_agent</span>
            </div>
            <div className="bg-white dark:bg-[#2D221F] p-4 rounded-2xl border border-[#C59E39]/20 flex gap-1.5">
               <div className="size-1.5 bg-[#C59E39] rounded-full animate-bounce"></div>
               <div className="size-1.5 bg-[#C59E39] rounded-full animate-bounce [animation-delay:0.1s]"></div>
               <div className="size-1.5 bg-[#C59E39] rounded-full animate-bounce [animation-delay:0.2s]"></div>
            </div>
          </div>
        )}
      </div>

      <div className={`p-4 border-t ${isDarkMode ? 'bg-[#1F1715] border-white/5' : 'bg-white border-gray-100'} shrink-0`}>
        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              className={`w-full border-none rounded-full px-5 py-3.5 text-sm focus:ring-2 focus:ring-[#C59E39] ${isDarkMode ? 'bg-[#2D221F] text-white placeholder:text-gray-500 shadow-inner' : 'bg-gray-100 text-[#5D4037]'}`}
              placeholder={isAr ? 'اكتب سؤالك هنا...' : 'Type your question...'}
              type="text"
            />
          </div>
          <button onClick={handleSend} className="size-12 rounded-full bg-[#5D4037] flex items-center justify-center text-white shadow-lg transition-all active:scale-90 shrink-0">
            <span className="material-symbols-outlined">send</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default GuidanceChat;
