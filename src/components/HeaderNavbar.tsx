import React from 'react';
import { FileText, Camera, Bell, MessageSquare, Calculator, Sparkles, Send } from 'lucide-react';

interface HeaderNavbarProps {
  flockSize: number;
  activeTab: 'calculator' | 'vaccines' | 'temperature' | 'medicines' | 'ai-photo' | 'bot-chat';
  setActiveTab: (tab: 'calculator' | 'vaccines' | 'temperature' | 'medicines' | 'ai-photo' | 'bot-chat') => void;
  onOpenPdfModal: () => void;
}

export const HeaderNavbar: React.FC<HeaderNavbarProps> = ({
  flockSize,
  activeTab,
  setActiveTab,
  onOpenPdfModal,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-amber-200/80 shadow-xs">
      {/* Top Telegram Bot Status Bar */}
      <div className="bg-linear-to-r from-amber-500 via-amber-400 to-yellow-400 px-4 py-1.5 text-amber-950 font-medium text-xs flex items-center justify-between shadow-inner">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
          </span>
          <span className="font-semibold tracking-wide flex items-center gap-1">
            <Send className="w-3 h-3 text-amber-900" />
            Telegram Bot: @broyler_master_bot
          </span>
          <span className="hidden sm:inline-block bg-amber-100/80 text-amber-900 text-[10px] px-2 py-0.5 rounded-full font-bold">
            Onlayn 24/7
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="bg-amber-900/10 px-2 py-0.5 rounded-sm text-[11px] font-semibold">
            Poda: <strong className="text-amber-950">{flockSize.toLocaleString()}</strong> tovuq
          </span>
          <button
            onClick={() => setActiveTab('bot-chat')}
            className="hidden md:flex items-center gap-1 bg-amber-900 text-amber-100 hover:bg-amber-800 text-[11px] px-2.5 py-0.5 rounded-full transition-all font-semibold shadow-xs"
          >
            <MessageSquare className="w-3 h-3" />
            Telegram Chat Rejimi
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5">
        <div className="flex items-center justify-between gap-2">
          {/* Logo & Chick Brand */}
          <div
            onClick={() => setActiveTab('calculator')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-linear-to-tr from-amber-400 via-yellow-300 to-amber-200 border-2 border-amber-300 shadow-md flex items-center justify-center text-2xl group-hover:scale-105 transition-transform">
              🐣
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base sm:text-lg text-slate-900 tracking-tight flex items-center gap-1">
                  Broyler <span className="text-amber-600">Master</span>
                </span>
                <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded-md border border-amber-300/60">
                  45 Kun
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden xs:block">
                Parrandachilik & AI Veterinariya Yordamchisi
              </p>
            </div>
          </div>

          {/* Action Buttons: PDF and Photo AI */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('ai-photo')}
              className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-xs ${
                activeTab === 'ai-photo'
                  ? 'bg-rose-500 text-white shadow-rose-200 ring-2 ring-rose-400'
                  : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
              }`}
            >
              <Camera className="w-4 h-4 text-rose-600 animate-pulse" />
              <span>Rasm Tahlili</span>
              <span className="bg-rose-200 text-rose-800 text-[10px] px-1.5 py-0.2 rounded-full font-extrabold hidden sm:inline">
                AI
              </span>
            </button>

            <button
              onClick={onOpenPdfModal}
              className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bold bg-linear-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-500 hover:to-teal-500 shadow-md shadow-emerald-200 transition-all active:scale-95"
            >
              <FileText className="w-4 h-4 text-emerald-100" />
              <span>PDF Hisobot</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 mt-2.5 overflow-x-auto pb-1 scrollbar-none text-xs sm:text-sm">
          <button
            onClick={() => setActiveTab('calculator')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold whitespace-nowrap transition-all ${
              activeTab === 'calculator'
                ? 'bg-amber-500 text-amber-950 shadow-xs ring-1 ring-amber-400'
                : 'text-slate-600 hover:text-slate-900 hover:bg-amber-50'
            }`}
          >
            <Calculator className="w-4 h-4 text-amber-900" />
            <span>📊 45 Kunlik Yem</span>
          </button>

          <button
            onClick={() => setActiveTab('vaccines')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold whitespace-nowrap transition-all ${
              activeTab === 'vaccines'
                ? 'bg-amber-500 text-amber-950 shadow-xs ring-1 ring-amber-400'
                : 'text-slate-600 hover:text-slate-900 hover:bg-amber-50'
            }`}
          >
            <Bell className="w-4 h-4 text-amber-900" />
            <span>💉 Vaksinalar & Eslatmalar</span>
          </button>

          <button
            onClick={() => setActiveTab('temperature')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold whitespace-nowrap transition-all ${
              activeTab === 'temperature'
                ? 'bg-amber-500 text-amber-950 shadow-xs ring-1 ring-amber-400'
                : 'text-slate-600 hover:text-slate-900 hover:bg-amber-50'
            }`}
          >
            <span>🌡️ Harorat & Gradus</span>
          </button>

          <button
            onClick={() => setActiveTab('medicines')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold whitespace-nowrap transition-all ${
              activeTab === 'medicines'
                ? 'bg-amber-500 text-amber-950 shadow-xs ring-1 ring-amber-400'
                : 'text-slate-600 hover:text-slate-900 hover:bg-amber-50'
            }`}
          >
            <span>💊 Dori-Darmon Qo‘llanmasi</span>
          </button>

          <button
            onClick={() => setActiveTab('ai-photo')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold whitespace-nowrap transition-all ${
              activeTab === 'ai-photo'
                ? 'bg-rose-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-rose-50'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>📸 Jo‘ja Rasm Tahlili (AI)</span>
          </button>

          <button
            onClick={() => setActiveTab('bot-chat')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold whitespace-nowrap transition-all ${
              activeTab === 'bot-chat'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-blue-700 hover:bg-blue-50 bg-blue-50/60'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-blue-500" />
            <span>🤖 Telegram Bot</span>
          </button>
        </div>
      </div>
    </header>
  );
};
