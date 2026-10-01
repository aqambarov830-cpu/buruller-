import React, { useState } from 'react';
import { MEDICINE_GUIDE } from '../data/broilerData';
import { MedicineItem } from '../types/poultry';
import { Pill, Search, ShieldAlert, CheckCircle2, AlertTriangle, Droplet, Clock, Sparkles } from 'lucide-react';

interface MedicineGuideProps {
  flockSize: number;
}

export const MedicineGuide: React.FC<MedicineGuideProps> = ({ flockSize }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedMed, setSelectedMed] = useState<MedicineItem>(MEDICINE_GUIDE[0]);

  const categories = [
    { id: 'all', label: 'Barcha Dorilar' },
    { id: 'koktsidiostatik', label: '🩸 Koktsidiozga (Qonli axlat)' },
    { id: 'antibiotik', label: '🦠 Antibiotiklar (Xirillash, Ich ketish)' },
    { id: 'vitamin', label: '🌿 Vitaminlar & Kalsiy (Oyoqdan qolish)' },
    { id: 'jigar_tozalovchi', label: '🧪 Jigar & Toksin tozalovchi' },
    { id: 'antistress', label: '☀️ Antistress & Isitma tushiruvchi' },
  ];

  const filteredMeds = MEDICINE_GUIDE.filter((med) => {
    const matchesCategory = selectedCategory === 'all' || med.category === selectedCategory;
    const matchesSearch =
      med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      med.symptoms.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
      med.activeSubstance.toLowerCase().includes(searchQuery.toLowerCase()) ||
      med.symptomSummary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-linear-to-r from-amber-400 via-yellow-400 to-amber-300 rounded-3xl p-5 sm:p-6 border-2 border-amber-300 shadow-md">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/10 text-amber-950 font-bold text-xs mb-2">
          <Pill className="w-4 h-4 text-amber-950" />
          <span>Veterinariya Dorixonasi & Davolash Rejasi</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900">
          Qanaqa Holatda Qanaqa Dori Beriladi?
        </h2>
        <p className="text-xs sm:text-sm text-slate-700 mt-1 max-w-2xl">
          Broylerlarda uchraydigan kasallik belgilari (qonli axlat, xirillash, oyoqdan qolish) bo‘yicha kerakli dorilar, ularning dozasi va qoidalarini aniqlang.
        </p>
      </div>

      {/* 45 Days Preventive Schedule Highlight (Routine Calendar) */}
      <div className="bg-linear-to-br from-emerald-50 to-teal-50 border-2 border-emerald-300 rounded-3xl p-5 shadow-xs">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-5 h-5 text-emerald-700" />
          <h3 className="font-extrabold text-slate-900 text-base">
            45 Kunlik Standart Profilaktik Dori Dasturi (Kunbay)
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
          <div className="bg-white p-3.5 rounded-2xl border border-emerald-200 shadow-xs">
            <span className="font-black text-emerald-800 block text-sm">
              1 - 3 kunlar
            </span>
            <strong className="text-slate-900 block mt-1">
              Start Antibiotik + Glyukoza
            </strong>
            <p className="text-slate-500 text-[11px] mt-1">
              Enrofloksatsin yoki Baytril (1L/0.5ml) + Chiktonik. Infeksiyalarni oldini olish.
            </p>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-emerald-200 shadow-xs">
            <span className="font-black text-emerald-800 block text-sm">
              8 - 10 kunlar
            </span>
            <strong className="text-slate-900 block mt-1">
              Koktsidioz Profilaktikasi
            </strong>
            <p className="text-slate-500 text-[11px] mt-1">
              Baykoks 2.5% (1L/1ml). Qonli ich ketishning oldini oluvchi eng muhim kurs.
            </p>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-emerald-200 shadow-xs">
            <span className="font-black text-emerald-800 block text-sm">
              15 - 17 kunlar
            </span>
            <strong className="text-slate-900 block mt-1">
              Jigar Tozalovchi + Kalsiy
            </strong>
            <p className="text-slate-500 text-[11px] mt-1">
              Gepatoprotektor + Kalsiy-D3. Suyaklar baquvvat bo‘lib, jigar toksinlardan tozalanadi.
            </p>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-emerald-200 shadow-xs">
            <span className="font-black text-emerald-800 block text-sm">
              22 - 25 kunlar
            </span>
            <strong className="text-slate-900 block mt-1">
              Vitamin Kompleksi
            </strong>
            <p className="text-slate-500 text-[11px] mt-1">
              Chiktonik yoki Aminovital (1L/1-2ml). Tez vazn olishni rag‘batlantirish.
            </p>
          </div>

          <div className="bg-rose-50 p-3.5 rounded-2xl border-2 border-rose-300 shadow-xs">
            <span className="font-black text-rose-800 block text-sm">
              38 - 45 kunlar 🛑
            </span>
            <strong className="text-rose-950 block mt-1">
              Karetsiya (Faqat Toza Suv!)
            </strong>
            <p className="text-rose-700 text-[11px] mt-1">
              So‘yishdan 7 kun oldin hamma dori to‘xtatiladi. Go‘shtda dori qoldig‘i qolmasligi shart.
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Kasallik alomati yoki dori nomini qidiring (masalan: qonli axlat, xirillash, baykoks, kalsiy)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white rounded-2xl border-2 border-amber-300 text-slate-900 placeholder:text-slate-400 text-sm focus:outline-hidden focus:ring-4 focus:ring-amber-400/40 shadow-xs"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-amber-500 text-amber-950 shadow-xs'
                  : 'bg-white hover:bg-amber-50 text-slate-700 border border-amber-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Medicine Cards + Detail Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Medicine Cards List */}
        <div className="lg:col-span-2 space-y-3">
          {filteredMeds.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-3xl border border-dashed border-amber-300">
              <p className="text-slate-500 text-sm">
                Qidiruv bo‘yicha dori topilmadi. Boshqa so‘z bilan izlab ko‘ring.
              </p>
            </div>
          ) : (
            filteredMeds.map((med) => {
              const isSelected = selectedMed.id === med.id;

              return (
                <div
                  key={med.id}
                  onClick={() => setSelectedMed(med)}
                  className={`p-4 sm:p-5 rounded-2xl border-2 transition-all cursor-pointer ${
                    isSelected
                      ? 'border-amber-500 bg-amber-50/70 shadow-md ring-2 ring-amber-300/40'
                      : 'border-slate-200 bg-white hover:border-amber-300'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
                        {med.categoryTitle}
                      </span>
                      <h4 className="font-extrabold text-base sm:text-lg text-slate-900 mt-1">
                        {med.name}
                      </h4>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-black text-amber-900 bg-amber-200/80 px-2.5 py-1 rounded-lg">
                        Dozasi: {med.dosage}
                      </span>
                    </div>
                  </div>

                  {/* Symptoms Tags */}
                  <div className="space-y-1 mt-2">
                    <span className="text-xs font-semibold text-slate-500 block">
                      Qachon beriladi (Alomatlar):
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {med.symptoms.map((sym, sIdx) => (
                        <span
                          key={sIdx}
                          className="text-[11px] bg-white border border-slate-200 text-slate-700 px-2 py-0.5 rounded-md font-medium"
                        >
                          • {sym}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 mt-3 pt-2 border-t border-slate-100 text-xs text-slate-600">
                    <div>
                      Muddati: <strong>{med.duration}</strong>
                    </div>
                    <div className="text-rose-700 font-semibold">
                      Kutish (so‘yishgacha): {med.withdrawalPeriod}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Selected Medicine Detail Card */}
        <div className="bg-linear-to-b from-white to-amber-50/60 rounded-3xl p-5 border-2 border-amber-300 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-amber-200 pb-3">
            <span className="text-xs font-bold text-amber-800 uppercase">
              Tanlangan Dori Pasporti
            </span>
            <span className="text-xs font-bold text-slate-500">
              {selectedMed.activeSubstance}
            </span>
          </div>

          <div>
            <h3 className="text-lg font-black text-slate-900">
              {selectedMed.name}
            </h3>
            <p className="text-xs text-amber-900 font-semibold mt-0.5">
              {selectedMed.categoryTitle}
            </p>
          </div>

          <div className="space-y-3 text-xs">
            {/* Calculated Dose for Flock */}
            <div className="p-3 bg-amber-100 rounded-xl border border-amber-200">
              <span className="text-slate-700 block text-[11px] font-semibold">
                Sizning podangiz ({flockSize.toLocaleString()} tovuq) uchun:
              </span>
              <strong className="text-amber-950 font-black text-sm block mt-0.5">
                {selectedMed.dosage}
              </strong>
              <span className="text-[11px] text-amber-900 mt-1 block">
                {selectedMed.waterRatio}
              </span>
            </div>

            <div className="p-3 bg-white rounded-xl border border-amber-200 space-y-1">
              <strong className="text-slate-900 block">Qabul qilish tartibi:</strong>
              <p className="text-slate-600 leading-relaxed">
                {selectedMed.instructions}
              </p>
            </div>

            <div className="p-3 bg-white rounded-xl border border-amber-200 space-y-1">
              <strong className="text-slate-900 block">Davomiyligi:</strong>
              <p className="text-slate-700 font-medium">
                {selectedMed.duration}
              </p>
              {selectedMed.dayRecommended && (
                <p className="text-amber-800 text-[11px] font-semibold">
                  Tavsiya kunlar: {selectedMed.dayRecommended}
                </p>
              )}
            </div>

            {selectedMed.warning && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-rose-900 text-xs block">Muhim ogohlantirish:</strong>
                  <p className="text-rose-800 text-[11px] mt-0.5">
                    {selectedMed.warning}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
