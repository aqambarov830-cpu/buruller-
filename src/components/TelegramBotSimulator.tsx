import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Check, CheckCheck, Paperclip, Sparkles, FileText, ChevronRight, Share2, HelpCircle } from 'lucide-react';
import { DAILY_FEED_NORMS, VACCINE_SCHEDULE } from '../data/broilerData';

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  time: string;
  buttons?: { label: string; action: string }[];
  isHtml?: boolean;
}

interface TelegramBotSimulatorProps {
  flockSize: number;
  setFlockSize: (size: number) => void;
  onOpenPdfModal: () => void;
  onSwitchTab: (tab: any) => void;
}

export const TelegramBotSimulator: React.FC<TelegramBotSimulatorProps> = ({
  flockSize,
  setFlockSize,
  onOpenPdfModal,
  onSwitchTab,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-1',
      sender: 'bot',
      text: `Assalomu alaykum, hurmatli fermer! 🐣\n\nMen **Broyler Master** Telegram botiman.\n\nSiz hozir **${flockSize.toLocaleString()} ta** broyler uchun hisob-kitob qilmoqdasiz.\n\nQuyidagi tugmalardan birini bosing yoki tovuqlar sonini yuboring (masalan: "2000" yoki "500 ta"):`,
      time: '09:00',
      buttons: [
        { label: '📊 45 Kunlik Yem Hisobi', action: 'feed_calc' },
        { label: '💉 Vaksina Eslatmalari', action: 'vaccines' },
        { label: '🌡️ Gradus & Harorat', action: 'temp' },
        { label: '💊 Qanaqa Dori Berish Kerak?', action: 'medicines' },
        { label: '📸 Rasm Tahlili (AI)', action: 'ai_photo' },
        { label: '📄 PDF Hisobot Yuklab Olish', action: 'pdf_download' },
      ],
    },
  ]);

  const [inputVal, setInputVal] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const getCurrentTime = () => {
    const d = new Date();
    return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  };

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputVal.trim();
    if (!text) return;

    setInputVal('');

    // Add user message
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      time: getCurrentTime(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    // Process logic
    setTimeout(async () => {
      // Check if user entered a number of chickens
      const parsedNum = parseInt(text.replace(/\D/g, ''));
      if (parsedNum && parsedNum >= 10 && parsedNum <= 500000 && (text.includes('ta') || text.length <= 6)) {
        setFlockSize(parsedNum);

        let sKg = 0, rKg = 0, fKg = 0;
        DAILY_FEED_NORMS.forEach(n => {
          const kg = (n.dailyFeedPerBirdGrams * parsedNum) / 1000;
          if (n.phase === 'start') sKg += kg;
          else if (n.phase === 'rost') rKg += kg;
          else fKg += kg;
        });
        const totalKg = sKg + rKg + fKg;
        const totalBags = Math.ceil(totalKg / 50);

        const botReply: Message = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: `✅ Poda soni **${parsedNum.toLocaleString()} ta** deb qabul qilindi!\n\n📋 **45 Kunlik Yem Hisobi:**\n• 🟡 Start (1-10 kun): **${Math.round(sKg).toLocaleString()} kg** (${Math.ceil(sKg / 50)} qop)\n• 🟠 Rost (11-24 kun): **${Math.round(rKg).toLocaleString()} kg** (${Math.ceil(rKg / 50)} qop)\n• 🟡 Finish (25-45 kun): **${Math.round(fKg).toLocaleString()} kg** (${Math.ceil(fKg / 50)} qop)\n\n🎯 **Jami Yem:** ${(totalKg / 1000).toFixed(2)} Tonna (${Math.round(totalKg).toLocaleString()} kg)\n📦 **Jami 50 kg Qoplar:** **${totalBags} ta qop**\n🍗 **Kutilgan go‘sht:** ~${Math.round(parsedNum * 2.85 * 0.96).toLocaleString()} kg`,
          time: getCurrentTime(),
          buttons: [
            { label: '📄 PDF Hisobotini Olish', action: 'pdf_download' },
            { label: '💉 Vaksina Sanalari', action: 'vaccines' },
            { label: '🌡️ Harorat Rejimi', action: 'temp' },
          ],
        };
        setMessages((prev) => [...prev, botReply]);
        setIsTyping(false);
        return;
      }

      // If user asks question, call ask-vet API
      try {
        const res = await fetch('/api/ask-vet', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            question: text,
            flockSize,
            chickAgeDays: 12,
          }),
        });
        const data = await res.json();
        const replyText = data.success && data.answer
          ? data.answer
          : `Tushunarli! Broylerlar uchun veterinariya va yem sarfi bo‘yicha to‘liq maʼlumot tayyor.`;

        const botReply: Message = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: replyText,
          time: getCurrentTime(),
          buttons: [
            { label: '📊 45 Kunlik Yem Kalkulyatori', action: 'feed_calc' },
            { label: '📸 Jo‘ja Rasmini Tekshirish', action: 'ai_photo' },
            { label: '📄 PDF Yuklab Olish', action: 'pdf_download' },
          ],
        };
        setMessages((prev) => [...prev, botReply]);
      } catch (err) {
        const botReply: Message = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: `Savolingiz qabul qilindi. 45 kunlik parvarish bo‘yicha to‘liq kalkulyator yoki veterinariya bo‘limiga o‘tishingiz mumkin.`,
          time: getCurrentTime(),
        };
        setMessages((prev) => [...prev, botReply]);
      } finally {
        setIsTyping(false);
      }
    }, 600);
  };

  const handleButtonClick = (action: string) => {
    if (action === 'feed_calc') {
      handleSend('45 kunlik yem sarfini ko‘rsat');
    } else if (action === 'vaccines') {
      onSwitchTab('vaccines');
    } else if (action === 'temp') {
      onSwitchTab('temperature');
    } else if (action === 'medicines') {
      onSwitchTab('medicines');
    } else if (action === 'ai_photo') {
      onSwitchTab('ai-photo');
    } else if (action === 'pdf_download') {
      onOpenPdfModal();
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {/* Telegram App Container */}
      <div className="bg-slate-100 rounded-3xl overflow-hidden border-2 border-slate-300 shadow-xl flex flex-col h-[680px]">
        {/* Telegram Header */}
        <div className="bg-[#24A1DE] px-4 py-3 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-xl shadow-xs">
                🐣
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#24A1DE]"></span>
            </div>

            <div>
              <div className="flex items-center gap-1.5 font-bold text-sm">
                <span>Broyler Master Bot</span>
                <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded-full font-bold">
                  bot
                </span>
              </div>
              <div className="text-[11px] text-blue-100 font-medium">
                @broyler_master_bot • onlayn
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenPdfModal}
              className="bg-white/20 hover:bg-white/30 text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1 transition-all"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>PDF</span>
            </button>
          </div>
        </div>

        {/* Telegram Chat Message History */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#E4ECF2] scrollbar-thin">
          <div className="text-center my-2">
            <span className="bg-slate-200/90 text-slate-600 text-[10px] font-bold px-3 py-1 rounded-full shadow-2xs">
              Bugun
            </span>
          </div>

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${
                msg.sender === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-3.5 text-xs shadow-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-[#EEFFDE] text-slate-900 rounded-tr-xs border border-emerald-200'
                    : 'bg-white text-slate-900 rounded-tl-xs border border-slate-200'
                }`}
              >
                <div className="whitespace-pre-line font-normal">{msg.text}</div>

                <div className="flex items-center justify-end gap-1 text-[10px] text-slate-400 mt-1">
                  <span>{msg.time}</span>
                  {msg.sender === 'user' && <CheckCheck className="w-3.5 h-3.5 text-blue-500" />}
                </div>
              </div>

              {/* Bot Inline Keyboard Buttons */}
              {msg.buttons && (
                <div className="flex flex-wrap gap-1.5 mt-2 max-w-[85%]">
                  {msg.buttons.map((btn, bIdx) => (
                    <button
                      key={bIdx}
                      onClick={() => handleButtonClick(btn.action)}
                      className="px-3 py-1.5 bg-white/90 hover:bg-white text-[#24A1DE] border border-blue-200 rounded-xl text-xs font-bold shadow-2xs transition-all active:scale-95 flex items-center gap-1"
                    >
                      <span>{btn.label}</span>
                      <ChevronRight className="w-3 h-3 text-blue-400" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-slate-500 text-xs italic bg-white/70 px-3 py-1.5 rounded-full w-fit">
              <span>Broyler Master yozmoqda...</span>
              <span className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
              </span>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Telegram Chat Input Bar */}
        <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
          <button
            onClick={() => onSwitchTab('ai-photo')}
            className="p-2 text-slate-500 hover:text-blue-500 rounded-full hover:bg-slate-100 transition-colors"
            title="Jo‘ja rasmini yuborish"
          >
            <Paperclip className="w-5 h-5" />
          </button>

          <input
            type="text"
            placeholder="Tovuqlar sonini yozing (masalan: 1000) yoki savol bering..."
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend();
            }}
            className="flex-1 bg-slate-100 text-slate-900 px-4 py-2.5 rounded-full text-xs sm:text-sm border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-[#24A1DE]"
          />

          <button
            onClick={() => handleSend()}
            disabled={!inputVal.trim()}
            className="w-10 h-10 rounded-full bg-[#24A1DE] hover:bg-[#208fbf] disabled:opacity-40 text-white flex items-center justify-center shadow-md transition-all shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Share to Telegram Callout */}
      <div className="bg-amber-100/70 border border-amber-300 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <span className="text-xl">✈️</span>
          <div>
            <strong className="text-slate-900 block font-bold">
              Telegramda Do‘stlaringiz va Fermerlarga Ulashing
            </strong>
            <span className="text-slate-600">
              Ushbu botni Telegram guruhlaringizga yuboring yoki o‘zingizning botingizga ulang.
            </span>
          </div>
        </div>

        <button
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            alert("✅ Havola nusxalandi! Telegram orqali do'stlaringizga yuborishingiz mumkin.");
          }}
          className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Havolani Nusxalash</span>
        </button>
      </div>
    </div>
  );
};
