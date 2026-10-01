import React, { useState, useEffect } from 'react';
import { VACCINE_SCHEDULE } from '../data/broilerData';
import { VaccineItem } from '../types/poultry';
import { Bell, CheckCircle2, Clock, AlertTriangle, ShieldCheck, Calendar, Droplets, Eye, Send } from 'lucide-react';
import confetti from 'canvas-confetti';

interface VaccineScheduleProps {
  flockSize: number;
  placementDate: string;
  setPlacementDate: (date: string) => void;
}

export const VaccineSchedule: React.FC<VaccineScheduleProps> = ({
  flockSize,
  placementDate,
  setPlacementDate,
}) => {
  const [completedVaccines, setCompletedVaccines] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('completed_vaccines');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [notificationEnabled, setNotificationEnabled] = useState<boolean>(true);
  const [selectedVaccine, setSelectedVaccine] = useState<VaccineItem>(VACCINE_SCHEDULE[1]); // default Day 7

  // Calculate current chick age in days based on placement date
  const calculateChickAge = (): number => {
    const start = new Date(placementDate).getTime();
    const now = new Date().getTime();
    const diffDays = Math.floor((now - start) / (1000 * 60 * 60 * 24)) + 1;
    return Math.max(1, Math.min(45, diffDays));
  };

  const currentAgeDays = calculateChickAge();

  const toggleComplete = (id: string) => {
    const updated = { ...completedVaccines, [id]: !completedVaccines[id] };
    setCompletedVaccines(updated);
    localStorage.setItem('completed_vaccines', JSON.stringify(updated));

    if (!completedVaccines[id]) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });
    }
  };

  // Get status for each vaccine
  const getVaccineStatus = (day: number, id: string) => {
    if (completedVaccines[id]) {
      return { label: 'Bajarildi ✅', color: 'bg-emerald-100 text-emerald-800 border-emerald-300', isPast: false, isToday: false };
    }
    if (day === currentAgeDays) {
      return { label: 'BUGUN EMLASH KUNI! 🚨', color: 'bg-rose-500 text-white font-black animate-pulse border-rose-600', isPast: false, isToday: true };
    }
    if (currentAgeDays < day) {
      const daysLeft = day - currentAgeDays;
      return { label: `${daysLeft} kundan keyin`, color: 'bg-amber-100 text-amber-800 border-amber-300', isPast: false, isToday: false };
    }
    return { label: 'Muddati o‘tgan ⚠️', color: 'bg-orange-100 text-orange-800 border-orange-300', isPast: true, isToday: false };
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-linear-to-r from-amber-400 via-yellow-400 to-amber-300 rounded-3xl p-5 sm:p-6 border-2 border-amber-300 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/10 text-amber-950 font-bold text-xs mb-2">
              <ShieldCheck className="w-4 h-4 text-emerald-800" />
              <span>Broyler Immuniteti & Profilaktika Taqvimi</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              Vaksina Qilish Jadvali va Eslatmalari
            </h2>
            <p className="text-xs sm:text-sm text-slate-700 mt-1 max-w-xl">
              Jo‘jalarni vaksina qilish vaqtini aniqlash uchun keltirilgan sanani belgilang. Tizim qaysi kuni qaysi vaksina qilinishini eslatib turadi.
            </p>
          </div>

          {/* Date Picker & Current Age */}
          <div className="bg-white/90 backdrop-blur-xs p-4 rounded-2xl border border-amber-300 shadow-xs flex flex-wrap items-center gap-4">
            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">
                📅 Jo‘jalar keltirilgan sana:
              </label>
              <input
                type="date"
                value={placementDate}
                onChange={(e) => setPlacementDate(e.target.value)}
                className="px-3 py-1.5 bg-amber-50 text-slate-900 font-bold text-sm rounded-xl border border-amber-300 focus:outline-hidden focus:ring-2 focus:ring-amber-400"
              />
            </div>

            <div className="bg-amber-100/80 px-3.5 py-2 rounded-xl text-center border border-amber-200">
              <span className="text-[10px] uppercase font-bold text-amber-900 block">
                Bugun yoshi:
              </span>
              <strong className="text-lg font-black text-amber-950">
                {currentAgeDays}-kunlik
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* Reminder Notification Banner */}
      <div className="bg-amber-50/80 border-2 border-amber-300/80 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-400 text-amber-950 flex items-center justify-center font-bold text-lg shadow-xs">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
              <span>Telegram Bot Vaksina Eslatmasi</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-black px-2 py-0.5 rounded-full">
                Faol
              </span>
            </h4>
            <p className="text-xs text-slate-600">
              Har bir vaksina kuni soat 07:00 da Telegram bot orqali tayyorgarlik ko‘rsatmalari yuboriladi.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            alert("✅ Eslatma muvaffaqiyatli yoqildi! @broyler_master_bot orqali har bir emlash kuni ertalab xabar olasiz.");
          }}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Telegramga Eslatma Bog‘lash</span>
        </button>
      </div>

      {/* Vaccine Timeline & Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Timeline List */}
        <div className="lg:col-span-2 space-y-3">
          <h3 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <span>💉 Emlash Bosqichlari (1 - 28 Kunlar)</span>
          </h3>

          {VACCINE_SCHEDULE.map((vac) => {
            const status = getVaccineStatus(vac.day, vac.id);
            const isSelected = selectedVaccine.id === vac.id;
            const isCompleted = !!completedVaccines[vac.id];

            // Calculate actual date
            const targetDate = new Date(placementDate);
            targetDate.setDate(targetDate.getDate() + (vac.day - 1));
            const formattedDate = targetDate.toLocaleDateString('uz-UZ', { month: 'short', day: 'numeric' });

            return (
              <div
                key={vac.id}
                onClick={() => setSelectedVaccine(vac)}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative ${
                  isSelected
                    ? 'border-amber-500 bg-amber-50/80 shadow-md ring-2 ring-amber-300/40'
                    : 'border-slate-200/90 bg-white hover:border-amber-300'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-xl bg-amber-400 text-amber-950 font-black text-sm flex items-center justify-center shadow-xs">
                      {vac.day}
                    </span>
                    <div>
                      <span className="text-xs font-bold text-slate-500 block">
                        {formattedDate} ({vac.day}-kun)
                      </span>
                      <h4 className="font-extrabold text-base text-slate-900">
                        {vac.name}
                      </h4>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${status.color}`}>
                      {status.label}
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleComplete(vac.id);
                      }}
                      className={`p-1.5 rounded-xl border transition-all ${
                        isCompleted
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-slate-100 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 border-slate-200'
                      }`}
                      title={isCompleted ? 'Qilindi deb belgilangan' : 'Bajarilgan deb belgilash'}
                    >
                      <CheckCircle2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-600 mt-2 border-t border-slate-100 pt-2">
                  <div>
                    <span className="text-slate-400">Kasallik:</span>{' '}
                    <strong className="text-slate-800">{vac.diseaseName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">Usuli:</span>{' '}
                    <strong className="text-amber-900 bg-amber-100/60 px-1.5 py-0.5 rounded-md font-semibold">
                      {vac.applicationMethod}
                    </strong>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Vaccine Full Instruction Card */}
        <div className="bg-linear-to-b from-white to-amber-50/50 rounded-3xl p-5 border-2 border-amber-300 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-amber-200 pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
              Vaksina Qo‘llanmasi
            </span>
            <span className="text-xs font-black bg-amber-200 text-amber-950 px-2 py-0.5 rounded-full">
              {selectedVaccine.day}-kun
            </span>
          </div>

          <div>
            <h3 className="text-lg font-black text-slate-900 leading-tight">
              {selectedVaccine.name}
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              Himoya: <strong>{selectedVaccine.diseaseName}</strong>
            </p>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-amber-100/60 rounded-xl border border-amber-200">
              <span className="font-bold text-amber-950 block mb-0.5 flex items-center gap-1.5">
                {selectedVaccine.applicationMethod.includes('Ko‘z') ? (
                  <Eye className="w-4 h-4 text-amber-800" />
                ) : (
                  <Droplets className="w-4 h-4 text-amber-800" />
                )}
                Qo‘llash usuli:
              </span>
              <p className="text-slate-700 font-medium">
                {selectedVaccine.applicationMethod}
              </p>
            </div>

            <div className="p-3 bg-white rounded-xl border border-amber-200">
              <span className="font-bold text-slate-900 block mb-1">
                📋 Batafsil ko‘rsatma va texnikasi:
              </span>
              <p className="text-slate-600 leading-relaxed">
                {selectedVaccine.instructions}
              </p>
            </div>

            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl">
              <span className="font-bold text-rose-900 block mb-1 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                Qatʼiy qoidalar:
              </span>
              <ul className="list-disc list-inside space-y-1 text-[11px] text-rose-800">
                <li>Vaksina kuni va ertasi kuni suvga antibiotik qo‘shilmaydi!</li>
                <li>Suv xlorlanmagan, toza quduq yoki tindirilgan suv bo‘lsin.</li>
                <li>Eritilgan vaksina 2 soat ichida to‘liq ichirilishi shart.</li>
                <li>Vaksinadan so‘ng antistress (Vitamin C yoki Chiktonik) beriladi.</li>
              </ul>
            </div>
          </div>

          <button
            onClick={() => toggleComplete(selectedVaccine.id)}
            className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${
              completedVaccines[selectedVaccine.id]
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-amber-500 hover:bg-amber-400 text-amber-950 shadow-sm'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>
              {completedVaccines[selectedVaccine.id]
                ? 'Vaksina qilindi (Bajarilgan)'
                : 'Ushbu vaksinani qilindi deb belgilash'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
