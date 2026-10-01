import React, { useState } from 'react';
import { generatePoultryPdf } from '../utils/pdfGenerator';
import { DiagnosticResult } from '../types/poultry';
import { FileText, Download, X, CheckCircle2, ShieldCheck, Wheat, DollarSign } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PdfReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  flockSize: number;
  latestDiagnostic: DiagnosticResult | null;
}

export const PdfReportModal: React.FC<PdfReportModalProps> = ({
  isOpen,
  onClose,
  flockSize,
  latestDiagnostic,
}) => {
  const [breed, setBreed] = useState<string>('Ross-308 (Standart)');
  const [feedPrice, setFeedPrice] = useState<number>(6500);
  const [meatPrice, setMeatPrice] = useState<number>(29000);
  const [includeDiagnostic, setIncludeDiagnostic] = useState<boolean>(true);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleDownload = () => {
    setIsGenerating(true);
    try {
      generatePoultryPdf({
        flockSize,
        breedName: breed,
        feedPricePerKg: feedPrice,
        meatPricePerKg: meatPrice,
        latestDiagnostic: includeDiagnostic ? latestDiagnostic : null,
      });

      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.6 },
      });

      setTimeout(() => {
        setIsGenerating(false);
        onClose();
      }, 800);
    } catch (err) {
      console.error('PDF error:', err);
      setIsGenerating(false);
      alert('PDF yaratishda xatolik yuz berdi.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-xl w-full border-2 border-amber-300 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-linear-to-r from-amber-500 to-yellow-400 p-5 text-amber-950 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/90 flex items-center justify-center text-xl shadow-xs">
              📄
            </div>
            <div>
              <h3 className="font-black text-lg text-slate-900 leading-tight">
                PDF Hisobotni Shakllantirish
              </h3>
              <p className="text-xs text-amber-900 font-semibold">
                {flockSize.toLocaleString()} ta broyler uchun to‘liq parrandachilik pasporti
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-amber-900/10 hover:bg-amber-900/20 text-amber-950 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 overflow-y-auto">
          {/* Summary items included in PDF */}
          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs space-y-2">
            <span className="font-extrabold text-amber-950 block text-sm">
              📋 PDF Hisobot ichiga nimalar kiritiladi:
            </span>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700">
              <li className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>45 kunlik jami yem va qoplar soni</span>
              </li>
              <li className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Start, Rost, Finish bosqichlari</span>
              </li>
              <li className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>5 ta asosiy vaksina jadvali</span>
              </li>
              <li className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Kunbay harorat (gradus) rejimi</span>
              </li>
              <li className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Veterinariya va dori-darmon tartibi</span>
              </li>
              <li className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Kutilayotgan go‘sht va daromad hisobi</span>
              </li>
            </ul>
          </div>

          {/* Settings Fields */}
          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Tovuq zoti (Gibrid):
              </label>
              <select
                value={breed}
                onChange={(e) => setBreed(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-300 text-xs font-bold text-slate-900"
              >
                <option value="Ross-308 (Standart)">Ross-308 (Tez semiruvchi, baquvvat ko‘krak go‘shti)</option>
                <option value="Cobb-500 (Oq go‘sht)">Cobb-500 (Ozuqani aʼlo o‘zlashtiruvchi)</option>
                <option value="Hubbard Classic">Hubbard Classic (Chidamli va mustahkam)</option>
                <option value="Arbor Acres Plus">Arbor Acres Plus</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  1 kg Yem narxi (so‘m):
                </label>
                <input
                  type="number"
                  value={feedPrice}
                  onChange={(e) => setFeedPrice(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-300 text-xs font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  1 kg Go‘sht narxi (so‘m):
                </label>
                <input
                  type="number"
                  value={meatPrice}
                  onChange={(e) => setMeatPrice(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-300 text-xs font-bold text-slate-900"
                />
              </div>
            </div>

            {/* If diagnostic exists */}
            {latestDiagnostic && (
              <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl flex items-center justify-between">
                <div>
                  <strong className="text-xs text-indigo-950 block">
                    AI Rasm Tahlilini PDFga kiritish
                  </strong>
                  <span className="text-[11px] text-indigo-700">
                    Tashxis: {latestDiagnostic.diagnosis}
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={includeDiagnostic}
                  onChange={(e) => setIncludeDiagnostic(e.target.checked)}
                  className="w-5 h-5 accent-indigo-600 rounded cursor-pointer"
                />
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200 transition-colors"
          >
            Bekor qilish
          </button>

          <button
            onClick={handleDownload}
            disabled={isGenerating}
            className="px-5 py-2.5 bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs sm:text-sm font-black shadow-lg shadow-emerald-200 transition-all flex items-center gap-2 active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>{isGenerating ? 'PDF Tayyorlanmoqda...' : 'PDF Hisobotni Yuklab Olish'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
