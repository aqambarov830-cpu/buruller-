import React, { useState } from 'react';
import { HeaderNavbar } from './components/HeaderNavbar';
import { FeedCalculator } from './components/FeedCalculator';
import { VaccineSchedule } from './components/VaccineSchedule';
import { TemperatureGuide } from './components/TemperatureGuide';
import { MedicineGuide } from './components/MedicineGuide';
import { AiPhotoDiagnostic } from './components/AiPhotoDiagnostic';
import { TelegramBotSimulator } from './components/TelegramBotSimulator';
import { PdfReportModal } from './components/PdfReportModal';
import { DiagnosticResult } from './types/poultry';
import { FileText, Camera, Bell, MessageSquare, Send, Sparkles, Heart } from 'lucide-react';

export default function App() {
  const [flockSize, setFlockSize] = useState<number>(1000);
  const [activeTab, setActiveTab] = useState<'calculator' | 'vaccines' | 'temperature' | 'medicines' | 'ai-photo' | 'bot-chat'>('calculator');
  const [placementDate, setPlacementDate] = useState<string>(() => {
    // Default to 12 days ago so current age looks realistic
    const d = new Date();
    d.setDate(d.getDate() - 11);
    return d.toISOString().split('T')[0];
  });
  const [latestDiagnostic, setLatestDiagnostic] = useState<DiagnosticResult | null>(null);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState<boolean>(false);

  // Calculate chick age
  const chickAgeDays = Math.max(
    1,
    Math.min(
      45,
      Math.floor((new Date().getTime() - new Date(placementDate).getTime()) / (1000 * 60 * 60 * 24)) + 1
    )
  );

  return (
    <div className="min-h-screen bg-linear-to-b from-amber-50/60 via-yellow-50/30 to-amber-100/40 text-slate-800 flex flex-col font-sans">
      {/* Top Navbar */}
      <HeaderNavbar
        flockSize={flockSize}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenPdfModal={() => setIsPdfModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-6 sm:py-8">
        {activeTab === 'calculator' && (
          <FeedCalculator
            flockSize={flockSize}
            setFlockSize={setFlockSize}
            onOpenPdfModal={() => setIsPdfModalOpen(true)}
            onGoToVaccines={() => setActiveTab('vaccines')}
            onGoToDiagnostic={() => setActiveTab('ai-photo')}
          />
        )}

        {activeTab === 'vaccines' && (
          <VaccineSchedule
            flockSize={flockSize}
            placementDate={placementDate}
            setPlacementDate={setPlacementDate}
          />
        )}

        {activeTab === 'temperature' && (
          <TemperatureGuide />
        )}

        {activeTab === 'medicines' && (
          <MedicineGuide
            flockSize={flockSize}
          />
        )}

        {activeTab === 'ai-photo' && (
          <AiPhotoDiagnostic
            flockSize={flockSize}
            chickAgeDays={chickAgeDays}
            latestDiagnostic={latestDiagnostic}
            setLatestDiagnostic={setLatestDiagnostic}
            onOpenPdfModal={() => setIsPdfModalOpen(true)}
          />
        )}

        {activeTab === 'bot-chat' && (
          <TelegramBotSimulator
            flockSize={flockSize}
            setFlockSize={setFlockSize}
            onOpenPdfModal={() => setIsPdfModalOpen(true)}
            onSwitchTab={setActiveTab}
          />
        )}
      </main>

      {/* Bottom Floating Quick Actions (Mobile Friendly) */}
      <div className="fixed bottom-4 right-4 z-40 flex items-center gap-2">
        <button
          onClick={() => setActiveTab('ai-photo')}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-full font-bold text-xs shadow-lg shadow-rose-300 transition-all hover:scale-105 active:scale-95"
        >
          <Camera className="w-4 h-4" />
          <span className="hidden sm:inline">AI Rasm Tahlili</span>
          <span className="sm:hidden">Rasm</span>
        </button>

        <button
          onClick={() => setIsPdfModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full font-bold text-xs shadow-lg shadow-emerald-300 transition-all hover:scale-105 active:scale-95"
        >
          <FileText className="w-4 h-4" />
          <span className="hidden sm:inline">PDF Hisobot</span>
          <span className="sm:hidden">PDF</span>
        </button>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-amber-200/80 py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🐣</span>
            <span className="font-bold text-slate-800">
              Broyler Master — Parrandachilik va Veterinariya Yordamchisi
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium text-slate-600">
            <span>Telegram Bot: <strong>@broyler_master_bot</strong></span>
            <span>•</span>
            <span>Ross-308 & Cobb-500 Standarti</span>
            <span>•</span>
            <span>45 Kunlik Nazorat</span>
          </div>
        </div>
      </footer>

      {/* PDF Modal */}
      <PdfReportModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        flockSize={flockSize}
        latestDiagnostic={latestDiagnostic}
      />
    </div>
  );
}
