import React, { useState } from 'react';
import { DAILY_FEED_NORMS } from '../data/broilerData';
import { FeedPhase } from '../types/poultry';
import { Layers, Wheat, Package, TrendingUp, DollarSign, Calendar, Info, CheckCircle2, ChevronRight } from 'lucide-react';

interface FeedCalculatorProps {
  flockSize: number;
  setFlockSize: (size: number) => void;
  onOpenPdfModal: () => void;
  onGoToVaccines: () => void;
  onGoToDiagnostic: () => void;
}

export const FeedCalculator: React.FC<FeedCalculatorProps> = ({
  flockSize,
  setFlockSize,
  onOpenPdfModal,
  onGoToVaccines,
  onGoToDiagnostic,
}) => {
  const [selectedPhase, setSelectedPhase] = useState<'all' | FeedPhase>('all');
  const [feedPricePerKg, setFeedPricePerKg] = useState<number>(6500); // 6,500 so'm/kg
  const [chickPrice, setChickPrice] = useState<number>(7500); // 7,500 so'm/jo'ja
  const [meatPricePerKg, setMeatPricePerKg] = useState<number>(29000); // 29,000 so'm/kg tirik vazn
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [showFinance, setShowFinance] = useState<boolean>(false);

  // Totals calculations
  let startKg = 0;
  let rostKg = 0;
  let finishKg = 0;

  DAILY_FEED_NORMS.forEach((norm) => {
    const dayTotalKg = (norm.dailyFeedPerBirdGrams * flockSize) / 1000;
    if (norm.phase === 'start') startKg += dayTotalKg;
    else if (norm.phase === 'rost') rostKg += dayTotalKg;
    else finishKg += dayTotalKg;
  });

  const totalFeedKg = startKg + rostKg + finishKg;
  const startBags = Math.ceil(startKg / 50);
  const rostBags = Math.ceil(rostKg / 50);
  const finishBags = Math.ceil(finishKg / 50);
  const totalBags = startBags + rostBags + finishBags;

  // Expected outcomes
  const avgBirdWeightKg = 2.85;
  const totalLiveWeightKg = Math.round(flockSize * avgBirdWeightKg * 0.96); // 4% loss
  const totalFeedCost = Math.round(totalFeedKg * feedPricePerKg);
  const totalChicksCost = Math.round(flockSize * chickPrice);
  const estimatedRevenue = Math.round(totalLiveWeightKg * meatPricePerKg);
  const estimatedNetProfit = estimatedRevenue - (totalFeedCost + totalChicksCost);

  // Filtered days
  const filteredDays = DAILY_FEED_NORMS.filter((d) => {
    if (selectedPhase === 'all') return true;
    return d.phase === selectedPhase;
  });

  const activeDayData = DAILY_FEED_NORMS.find((d) => d.day === selectedDay) || DAILY_FEED_NORMS[0];

  return (
    <div className="space-y-6">
      {/* Hero: Chick Flock Input & Visual Controls */}
      <div className="bg-linear-to-br from-amber-400 via-amber-300 to-yellow-200 rounded-3xl p-5 sm:p-7 shadow-lg border-2 border-amber-300 relative overflow-hidden">
        {/* Background Decorative Chicks */}
        <div className="absolute -right-6 -bottom-6 text-9xl opacity-20 pointer-events-none select-none">
          🐥
        </div>
        <div className="absolute right-24 -top-8 text-7xl opacity-15 pointer-events-none select-none">
          🥚
        </div>

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-900/10 text-amber-950 font-bold text-xs mb-3">
            <span>🐣 45 Kunlik Broyler Ratsioni</span>
            <span className="text-amber-800">•</span>
            <span>Ross-308 / Cobb-500 Standarti</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Broyler tovuqlaringiz sonini kiriting:
          </h1>
          <p className="text-slate-700 text-sm mt-1 max-w-xl font-medium">
            Tizim 45 kun davomida Start, Rost va Finish bosqichlarida qancha don (yem) yeyishi va necha qop yem kerakligini darhol hisoblab beradi.
          </p>

          {/* Input & Presets */}
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <div className="relative flex items-center">
              <input
                type="number"
                min="1"
                max="500000"
                value={flockSize}
                onChange={(e) => setFlockSize(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-44 sm:w-52 px-4 py-3 bg-white text-slate-900 text-xl font-black rounded-2xl border-2 border-amber-400 focus:outline-hidden focus:ring-4 focus:ring-amber-400/40 shadow-inner"
              />
              <span className="absolute right-4 text-sm font-bold text-amber-900">
                ta jo‘ja
              </span>
            </div>

            {/* Quick Presets */}
            <div className="flex flex-wrap items-center gap-1.5">
              {[100, 300, 500, 1000, 2000, 5000].map((preset) => (
                <button
                  key={preset}
                  onClick={() => setFlockSize(preset)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                    flockSize === preset
                      ? 'bg-amber-950 text-white shadow-md'
                      : 'bg-white/80 hover:bg-white text-amber-950 border border-amber-300/80'
                  }`}
                >
                  {preset.toLocaleString()} ta
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main KPI Stats Grid: 45 Days Total Feed & Bags */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Feed */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-amber-200/80 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-center justify-between text-amber-600 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Jami Yem (45 Kun)
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800">
              <Wheat className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900">
            {(totalFeedKg / 1000).toFixed(2)} <span className="text-sm font-bold text-slate-600">Tonna</span>
          </div>
          <div className="text-xs font-semibold text-amber-700 mt-1">
            {Math.round(totalFeedKg).toLocaleString()} kg umumiy hajm
          </div>
          <div className="mt-2 text-[11px] text-slate-500 bg-amber-50/80 px-2 py-1 rounded-md">
            1 ta tovuqqa: ~{(totalFeedKg / flockSize).toFixed(2)} kg yem
          </div>
        </div>

        {/* 50kg Bags */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-amber-200/80 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-center justify-between text-amber-600 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Jami 50 kg Qoplar
            </span>
            <div className="w-8 h-8 rounded-xl bg-orange-100 flex items-center justify-center text-orange-800">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900">
            {totalBags} <span className="text-sm font-bold text-slate-600">qop</span>
          </div>
          <div className="text-xs font-semibold text-orange-700 mt-1">
            50 kg standart qadoqlarda
          </div>
          <div className="mt-2 text-[11px] text-slate-500 bg-orange-50/80 px-2 py-1 rounded-md">
            Yoki {Math.ceil(totalFeedKg / 25)} ta (25 kg qop)
          </div>
        </div>

        {/* Expected Meat Weight */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-amber-200/80 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-center justify-between text-emerald-600 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Kutilgan Tirik Go‘sht
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900">
            {totalLiveWeightKg.toLocaleString()} <span className="text-sm font-bold text-slate-600">kg</span>
          </div>
          <div className="text-xs font-semibold text-emerald-700 mt-1">
            O‘rtacha vazn: ~{avgBirdWeightKg} kg / tovuq
          </div>
          <div className="mt-2 text-[11px] text-slate-500 bg-emerald-50/80 px-2 py-1 rounded-md">
            FCR konversiyasi: ~1.70 (Aʼlo natija)
          </div>
        </div>

        {/* Expected Profit / Economics */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-amber-200/80 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-center justify-between text-blue-600 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Kutilgan Sof Foyda
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center text-blue-800">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-emerald-600">
            {(estimatedNetProfit / 1000000).toFixed(1)} <span className="text-sm font-bold text-slate-600">mln so‘m</span>
          </div>
          <div className="text-xs font-semibold text-slate-600 mt-1">
            Tushum: {(estimatedRevenue / 1000000).toFixed(1)} mln so‘m
          </div>
          <button
            onClick={() => setShowFinance(!showFinance)}
            className="mt-2 text-[11px] text-blue-700 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded-md font-bold flex items-center justify-between w-full"
          >
            <span>{showFinance ? 'Kalkulyatorni yopish' : 'Narxlar & Hisob-kitob'}</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Expandable Finance Calculator */}
      {showFinance && (
        <div className="bg-amber-50/70 border-2 border-amber-300 rounded-3xl p-5 sm:p-6 transition-all animate-fadeIn">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xl">💰</span>
              <h3 className="font-extrabold text-base sm:text-lg text-slate-900">
                Parrandachilik Moliya va Foyda Kalkulyatori
              </h3>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              Narxlarni o‘zingizga moslab o‘zgartiring
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-3.5 rounded-xl border border-amber-200">
              <label className="text-xs font-bold text-slate-600 block mb-1">
                1 kg Yem narxi (so‘m):
              </label>
              <input
                type="number"
                step="100"
                value={feedPricePerKg}
                onChange={(e) => setFeedPricePerKg(Math.max(1000, parseInt(e.target.value) || 0))}
                className="w-full px-3 py-2 text-base font-bold bg-amber-50/50 rounded-lg border border-amber-300 text-slate-900"
              />
              <div className="text-[11px] text-slate-500 mt-1">
                Jami yem xarajati: <strong>{(totalFeedCost / 1000000).toFixed(2)} mln so‘m</strong>
              </div>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-amber-200">
              <label className="text-xs font-bold text-slate-600 block mb-1">
                1 dona Jo‘ja sotib olish (so‘m):
              </label>
              <input
                type="number"
                step="500"
                value={chickPrice}
                onChange={(e) => setChickPrice(Math.max(1000, parseInt(e.target.value) || 0))}
                className="w-full px-3 py-2 text-base font-bold bg-amber-50/50 rounded-lg border border-amber-300 text-slate-900"
              />
              <div className="text-[11px] text-slate-500 mt-1">
                Jami jo‘ja xarajati: <strong>{(totalChicksCost / 1000000).toFixed(2)} mln so‘m</strong>
              </div>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-amber-200">
              <label className="text-xs font-bold text-slate-600 block mb-1">
                1 kg Tirik Go‘sht sotish narxi (so‘m):
              </label>
              <input
                type="number"
                step="500"
                value={meatPricePerKg}
                onChange={(e) => setMeatPricePerKg(Math.max(5000, parseInt(e.target.value) || 0))}
                className="w-full px-3 py-2 text-base font-bold bg-amber-50/50 rounded-lg border border-amber-300 text-slate-900"
              />
              <div className="text-[11px] text-emerald-700 mt-1 font-semibold">
                Kutilgan jami tushum: <strong>{(estimatedRevenue / 1000000).toFixed(2)} mln so‘m</strong>
              </div>
            </div>
          </div>

          <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-xs text-emerald-900 font-medium">
                Xarajatlar (Yem + Jo‘ja): {((totalFeedCost + totalChicksCost) / 1000000).toFixed(2)} mln so‘m
              </div>
              <div className="text-lg sm:text-xl font-extrabold text-emerald-900">
                Kutilayotgan Sof Foyda: {(estimatedNetProfit / 1000000).toFixed(2)} mln so‘m
                <span className="text-xs font-normal text-emerald-700 ml-2">
                  (1 ta tovuqdan ~{Math.round(estimatedNetProfit / flockSize).toLocaleString()} so‘m)
                </span>
              </div>
            </div>

            <button
              onClick={onOpenPdfModal}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
            >
              <span>📄 Ushbu hisob-kitobni PDF qilish</span>
            </button>
          </div>
        </div>
      )}

      {/* 3 Main Feed Phases Breakdown Cards */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-amber-600" />
              <span>3 Bosqichli Yem Taxtasi (Start, Rost, Finish)</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Har bir bosqichda don tarkibi, qoplar soni va isteʼmol meʼyori farq qiladi
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Phase 1: START */}
          <div className="bg-linear-to-b from-amber-50 to-white rounded-2xl p-5 border-2 border-amber-300/80 shadow-xs relative">
            <div className="flex items-center justify-between mb-3">
              <span className="bg-amber-400 text-amber-950 font-black text-xs px-2.5 py-1 rounded-lg">
                1 - 10 KUN
              </span>
              <span className="text-xs font-bold text-amber-800">
                Boshlang‘ich
              </span>
            </div>

            <h3 className="font-extrabold text-lg text-slate-900">
              START (Starter)
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              Protein: 22-23%, mayda krupka / yorma shaklida
            </p>

            <div className="mt-4 space-y-2 border-t border-amber-200/60 pt-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600">1 jo‘jaga jami:</span>
                <strong className="text-slate-900 font-bold">~345 gramm</strong>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600">Podaga jami yem:</span>
                <strong className="text-amber-900 font-extrabold text-sm">
                  {Math.round(startKg).toLocaleString()} kg
                </strong>
              </div>
              <div className="flex items-center justify-between text-xs bg-amber-100/70 p-2 rounded-lg">
                <span className="font-bold text-amber-950">50 kg lik Qoplar:</span>
                <strong className="text-amber-950 font-black text-base">
                  {startBags} ta qop
                </strong>
              </div>
            </div>

            <div className="mt-3 text-[11px] text-amber-900 bg-amber-100/40 p-2 rounded-lg border border-amber-200">
              💡 <strong>Tavsiya:</strong> 1-kuni 24 soat issiq (33-34°C) va shirin antistress suvi beriladi.
            </div>
          </div>

          {/* Phase 2: ROST / GROWER */}
          <div className="bg-linear-to-b from-orange-50 to-white rounded-2xl p-5 border-2 border-orange-300/80 shadow-xs relative">
            <div className="flex items-center justify-between mb-3">
              <span className="bg-orange-400 text-orange-950 font-black text-xs px-2.5 py-1 rounded-lg">
                11 - 24 KUN
              </span>
              <span className="text-xs font-bold text-orange-800">
                O‘sish davri
              </span>
            </div>

            <h3 className="font-extrabold text-lg text-slate-900">
              ROST (Grower)
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              Protein: 20-21%, 2.5 mm granula, suyak mustahkamlash
            </p>

            <div className="mt-4 space-y-2 border-t border-orange-200/60 pt-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600">1 jo‘jaga jami:</span>
                <strong className="text-slate-900 font-bold">~1,701 gramm</strong>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600">Podaga jami yem:</span>
                <strong className="text-orange-950 font-extrabold text-sm">
                  {Math.round(rostKg).toLocaleString()} kg
                </strong>
              </div>
              <div className="flex items-center justify-between text-xs bg-orange-100/70 p-2 rounded-lg">
                <span className="font-bold text-orange-950">50 kg lik Qoplar:</span>
                <strong className="text-orange-950 font-black text-base">
                  {rostBags} ta qop
                </strong>
              </div>
            </div>

            <div className="mt-3 text-[11px] text-orange-900 bg-orange-100/40 p-2 rounded-lg border border-orange-200">
              💡 <strong>Tavsiya:</strong> 14-kuni Gamboro vaksinasi, kalsiy-D3 beriladi (tizzada emaklamaslik uchun).
            </div>
          </div>

          {/* Phase 3: FINISH */}
          <div className="bg-linear-to-b from-yellow-50 to-white rounded-2xl p-5 border-2 border-yellow-400/80 shadow-xs relative">
            <div className="flex items-center justify-between mb-3">
              <span className="bg-yellow-400 text-yellow-950 font-black text-xs px-2.5 py-1 rounded-lg">
                25 - 45 KUN
              </span>
              <span className="text-xs font-bold text-yellow-800">
                Semirtirish
              </span>
            </div>

            <h3 className="font-extrabold text-lg text-slate-900">
              FINISH (Finisher)
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              Protein: 18-19%, yuqori energiya (3200 kkal), 3-3.5 mm granula
            </p>

            <div className="mt-4 space-y-2 border-t border-yellow-200/60 pt-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600">1 jo‘jaga jami:</span>
                <strong className="text-slate-900 font-bold">~4,075 gramm</strong>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600">Podaga jami yem:</span>
                <strong className="text-yellow-950 font-extrabold text-sm">
                  {Math.round(finishKg).toLocaleString()} kg
                </strong>
              </div>
              <div className="flex items-center justify-between text-xs bg-yellow-200/70 p-2 rounded-lg">
                <span className="font-bold text-yellow-950">50 kg lik Qoplar:</span>
                <strong className="text-yellow-950 font-black text-base">
                  {finishBags} ta qop
                </strong>
              </div>
            </div>

            <div className="mt-3 text-[11px] text-yellow-950 bg-yellow-100/40 p-2 rounded-lg border border-yellow-300">
              💡 <strong>Tavsiya:</strong> So‘yishdan 7 kun oldin (38-kundan) barcha antibiotik to‘xtatiladi!
            </div>
          </div>
        </div>
      </div>

      {/* Day Inspector & 45-Day Table */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-amber-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-amber-600" />
              <span>45 Kunlik Kunbay Ratsion Jadvali</span>
            </h3>
            <p className="text-xs text-slate-500">
              Istalgan kunni tanlang yoki jadvaldan kunlik isteʼmolni ko‘ring
            </p>
          </div>

          {/* Phase Filter Tabs */}
          <div className="flex items-center gap-1 bg-amber-50 p-1 rounded-xl border border-amber-200/60 text-xs">
            <button
              onClick={() => setSelectedPhase('all')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                selectedPhase === 'all'
                  ? 'bg-amber-500 text-amber-950 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Hammasi (45 kun)
            </button>
            <button
              onClick={() => setSelectedPhase('start')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                selectedPhase === 'start'
                  ? 'bg-amber-500 text-amber-950 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Start (1-10)
            </button>
            <button
              onClick={() => setSelectedPhase('rost')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                selectedPhase === 'rost'
                  ? 'bg-amber-500 text-amber-950 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Rost (11-24)
            </button>
            <button
              onClick={() => setSelectedPhase('finish')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                selectedPhase === 'finish'
                  ? 'bg-amber-500 text-amber-950 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Finish (25-45)
            </button>
          </div>
        </div>

        {/* Selected Day Highlight Card */}
        <div className="mb-5 p-4 rounded-2xl bg-linear-to-r from-amber-100 via-amber-50 to-yellow-100 border border-amber-300 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-amber-950 font-black text-xl flex items-center justify-center shadow-xs">
              {activeDayData.day}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900 text-base">
                  {activeDayData.day}-kun: {activeDayData.phaseName}
                </span>
                {activeDayData.notes?.includes('💉') && (
                  <span className="bg-rose-100 text-rose-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-rose-200">
                    Vaksina Kuni
                  </span>
                )}
              </div>
              <p className="text-xs text-amber-900 font-medium mt-0.5">
                {activeDayData.notes}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <div className="bg-white/80 px-3 py-1.5 rounded-xl border border-amber-200">
              <span className="text-slate-500 block text-[10px]">1 Jo‘jaga:</span>
              <strong className="text-amber-950 text-sm">{activeDayData.dailyFeedPerBirdGrams} g</strong>
            </div>
            <div className="bg-white/80 px-3 py-1.5 rounded-xl border border-amber-200">
              <span className="text-slate-500 block text-[10px]">Podaga (Bugun):</span>
              <strong className="text-amber-950 text-sm">
                {((activeDayData.dailyFeedPerBirdGrams * flockSize) / 1000).toFixed(1)} kg
              </strong>
            </div>
            <div className="bg-white/80 px-3 py-1.5 rounded-xl border border-amber-200">
              <span className="text-slate-500 block text-[10px]">Harorat / Namlik:</span>
              <strong className="text-amber-950 text-sm">{activeDayData.tempCelsius}°C / {activeDayData.humidityPercent}%</strong>
            </div>
            <div className="bg-white/80 px-3 py-1.5 rounded-xl border border-amber-200">
              <span className="text-slate-500 block text-[10px]">Kutilgan vazn:</span>
              <strong className="text-emerald-700 text-sm">~{activeDayData.targetWeightGrams} g</strong>
            </div>
          </div>
        </div>

        {/* 45 Days Scrollable Table */}
        <div className="overflow-x-auto max-h-96 overflow-y-auto rounded-2xl border border-amber-200/80">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="sticky top-0 bg-amber-100/90 text-amber-950 font-bold uppercase text-[11px] tracking-wider z-10 backdrop-blur-xs">
              <tr>
                <th className="py-2.5 px-3">Kun</th>
                <th className="py-2.5 px-3">Yem Bosqichi</th>
                <th className="py-2.5 px-3">1 Jo‘jaga (g)</th>
                <th className="py-2.5 px-3">Podaga Bugun (kg)</th>
                <th className="py-2.5 px-3">To‘plangan Yem (kg)</th>
                <th className="py-2.5 px-3">Vazn Meʼyori</th>
                <th className="py-2.5 px-3">Gradus (°C)</th>
                <th className="py-2.5 px-3">Veterinariya & Rejim Eslatmasi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-100">
              {filteredDays.map((item) => {
                const dayKg = ((item.dailyFeedPerBirdGrams * flockSize) / 1000).toFixed(1);
                const cumKg = Math.round((item.cumulativeFeedPerBirdGrams * flockSize) / 1000);
                const isSelected = item.day === selectedDay;

                return (
                  <tr
                    key={item.day}
                    onClick={() => setSelectedDay(item.day)}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-amber-200/80 font-bold text-amber-950'
                        : item.day % 2 === 0
                        ? 'bg-amber-50/30 hover:bg-amber-100/50'
                        : 'bg-white hover:bg-amber-100/50'
                    }`}
                  >
                    <td className="py-2 px-3 font-extrabold">
                      <span className="inline-block w-6 h-6 rounded-full bg-amber-200/70 text-center leading-6 text-amber-900 text-xs">
                        {item.day}
                      </span>
                    </td>
                    <td className="py-2 px-3 font-semibold text-slate-800">
                      {item.phase === 'start' && <span className="text-amber-700">Start</span>}
                      {item.phase === 'rost' && <span className="text-orange-700">Rost</span>}
                      {item.phase === 'finish' && <span className="text-yellow-800">Finish</span>}
                    </td>
                    <td className="py-2 px-3 font-bold text-slate-900">
                      {item.dailyFeedPerBirdGrams} g
                    </td>
                    <td className="py-2 px-3 font-black text-amber-900">
                      {dayKg} kg
                    </td>
                    <td className="py-2 px-3 text-slate-600">
                      {cumKg.toLocaleString()} kg
                    </td>
                    <td className="py-2 px-3 text-emerald-700 font-semibold">
                      ~{item.targetWeightGrams} g
                    </td>
                    <td className="py-2 px-3 text-slate-700 font-semibold">
                      {item.tempCelsius}°C
                    </td>
                    <td className="py-2 px-3 text-slate-600 text-[11px]">
                      {item.notes}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Quick Footer Navigation */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-500">
            <Info className="w-4 h-4 text-amber-600" />
            <span>Ko‘rsatilgan miqdorlar xalqaro Ross-308 / Cobb-500 meʼyorlariga asoslangan</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onGoToVaccines}
              className="px-3 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold transition-all"
            >
              💉 Emlash Jadvaliga O‘tish
            </button>
            <button
              onClick={onGoToDiagnostic}
              className="px-3 py-1.5 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-900 font-bold transition-all"
            >
              📸 Jo‘ja Rasmini Tahlil Qilish
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
