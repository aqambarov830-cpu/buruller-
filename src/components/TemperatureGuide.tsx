import React, { useState } from 'react';
import { TEMPERATURE_GUIDE } from '../data/broilerData';
import { Thermometer, Wind, Droplets, Sun, AlertCircle, CheckCircle2, Flame, Snowflake, HelpCircle } from 'lucide-react';

export const TemperatureGuide: React.FC = () => {
  const [testDay, setTestDay] = useState<number>(1);
  const [currentTempInput, setCurrentTempInput] = useState<number>(33);

  // Find recommended temperature for test day
  const targetGuide = TEMPERATURE_GUIDE.find(
    (g) => testDay >= g.dayStart && testDay <= g.dayEnd
  ) || TEMPERATURE_GUIDE[0];

  // Evaluate temperature status
  const evaluateTemp = () => {
    // extract numbers from "33°C - 34°C"
    const match = targetGuide.roomTemp.match(/(\d+\.?\d*)/g);
    if (!match || match.length < 2) return { status: 'ok', msg: 'Harorat meʼyorda' };

    const min = parseFloat(match[0]);
    const max = parseFloat(match[1]);

    if (currentTempInput < min - 1) {
      return {
        status: 'cold',
        label: 'JO‘JALARGA SOVUQ! 🥶',
        color: 'text-blue-600 bg-blue-50 border-blue-200',
        advice: `Xona harorati kamida ${min}°C bo‘lishi kerak. Isitgichlarni yoqing, skvoznyakni yoping! Jo‘jalar sovuqdan to‘planib ezilib qolishi mumkin.`,
      };
    }
    if (currentTempInput > max + 1) {
      return {
        status: 'hot',
        label: 'JO‘JALARGA ISSIQ! 🥵',
        color: 'text-rose-600 bg-rose-50 border-rose-200',
        advice: `Xona harorati ${max}°C dan oshmasligi kerak. Ventilyatsiyani oshiring, salqin toza suv bering va C vitamini qo‘shing.`,
      };
    }
    return {
      status: 'good',
      label: 'HARORAT IDEAL MEʼYORDA! ✅',
      color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      advice: `Ayni ${testDay}-kunlik broylerlar uchun ${currentTempInput}°C juda qulay. Jo‘jalar bir tekis o‘sadi va yemni yaxshi hazm qiladi.`,
    };
  };

  const tempResult = evaluateTemp();

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-linear-to-r from-amber-400 via-yellow-400 to-amber-300 rounded-3xl p-5 sm:p-6 border-2 border-amber-300 shadow-md">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/10 text-amber-950 font-bold text-xs mb-2">
          <Thermometer className="w-4 h-4 text-amber-900" />
          <span>Gradus & Iqlim Meʼyorlari</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900">
          Broyler Harorat (Gradus), Namlik va Ventilyatsiya Rejimi
        </h2>
        <p className="text-xs sm:text-sm text-slate-700 mt-1 max-w-2xl">
          Jo‘janing 1-kunidan 45-kunigacha qaysi kunda necha gradusda saqlash kerakligi, pol harorati va jo‘janing xatti-harakatiga qarab to‘g‘rilash qoidalari.
        </p>
      </div>

      {/* Interactive Day & Temp Checker */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-amber-300/80 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">🌡️</span>
          <div>
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
              Interaktiv Gradus Nazoratchisi
            </h3>
            <p className="text-xs text-slate-500">
              Jo‘jalaringiz necha kunlik va hozir xonada necha gradus ekanini tekshiring
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-amber-50/60 rounded-2xl border border-amber-200">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              Jo‘jalar yoshi (kunlik):
            </label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="1"
                max="45"
                value={testDay}
                onChange={(e) => setTestDay(parseInt(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <span className="w-12 text-center py-1 bg-white font-black text-amber-950 border border-amber-300 rounded-lg text-sm">
                {testDay} kun
              </span>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              Hozirgi xona gradusi (°C):
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                step="0.5"
                min="15"
                max="42"
                value={currentTempInput}
                onChange={(e) => setCurrentTempInput(parseFloat(e.target.value) || 20)}
                className="w-full px-3 py-1.5 bg-white font-black text-slate-900 border border-amber-300 rounded-lg text-sm"
              />
              <span className="text-xs font-bold text-slate-600">°C</span>
            </div>
          </div>

          <div>
            <span className="text-xs font-bold text-slate-700 block mb-1">
              Tavsiya meʼyor:
            </span>
            <div className="bg-white px-3 py-1.5 rounded-lg border border-amber-200">
              <strong className="text-amber-900 text-sm font-black">
                {targetGuide.roomTemp}
              </strong>
              <span className="text-[10px] text-slate-500 block">
                Pol harorati: {targetGuide.floorTemp.split(' ')[0]}
              </span>
            </div>
          </div>

          <div>
            <span className="text-xs font-bold text-slate-700 block mb-1">
              Tavsiya namlik:
            </span>
            <div className="bg-white px-3 py-1.5 rounded-lg border border-amber-200">
              <strong className="text-blue-900 text-sm font-black">
                {targetGuide.humidity}
              </strong>
              <span className="text-[10px] text-slate-500 block">
                Yorug‘lik: {targetGuide.lighting.substring(0, 15)}
              </span>
            </div>
          </div>
        </div>

        {/* Evaluation Banner */}
        <div className={`mt-4 p-4 rounded-2xl border-2 flex items-start gap-3 ${tempResult.color}`}>
          <div className="text-2xl mt-0.5">
            {tempResult.status === 'good' ? '🟢' : tempResult.status === 'cold' ? '❄️' : '🔥'}
          </div>
          <div>
            <h4 className="font-black text-sm">{tempResult.label}</h4>
            <p className="text-xs mt-0.5 leading-relaxed font-medium">
              {tempResult.advice}
            </p>
          </div>
        </div>
      </div>

      {/* Chick Behavior Chart: Visual Guide */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-amber-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-amber-600" />
              <span>Jo‘jalar Xatti-Harakati Orqali Gradusni Aniqlash</span>
            </h3>
            <p className="text-xs text-slate-500">
              Termometr bo‘lmasa ham jo‘jalarning holatiga qarab xona haroratini bilish mumkin
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Cold */}
          <div className="p-4 rounded-2xl bg-blue-50/70 border-2 border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-extrabold text-blue-900 uppercase">
                SOVUQ HOLAT 🥶
              </span>
              <Snowflake className="w-4 h-4 text-blue-600" />
            </div>
            <div className="h-28 bg-white/80 rounded-xl border border-blue-200 p-2 flex flex-col items-center justify-center text-center">
              <div className="text-3xl mb-1">🐣🐣🐣</div>
              <span className="text-[11px] font-bold text-blue-950">
                Chiroq tagiga to‘planib qisiladi
              </span>
            </div>
            <p className="text-xs text-blue-900 mt-2.5 font-medium leading-relaxed">
              Jo‘jalar qattiq chiyillaydi, lampochka ostida bir-birining ustiga chiqib eziladi. <strong>Darhol haroratni ko‘taring!</strong>
            </p>
          </div>

          {/* Hot */}
          <div className="p-4 rounded-2xl bg-rose-50/70 border-2 border-rose-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-extrabold text-rose-900 uppercase">
                ISSIQ HOLAT 🥵
              </span>
              <Flame className="w-4 h-4 text-rose-600" />
            </div>
            <div className="h-28 bg-white/80 rounded-xl border border-rose-200 p-2 flex flex-col items-center justify-center text-center">
              <div className="text-3xl mb-1">🐥 💨 🐥</div>
              <span className="text-[11px] font-bold text-rose-950">
                Devorlarga qarab qochadi
              </span>
            </div>
            <p className="text-xs text-rose-900 mt-2.5 font-medium leading-relaxed">
              Qanotlarini yozib, og‘zini ochib hansiraydi. Isitgichdan uzoqlashadi. <strong>Haroratni 2-3°C ga tushiring.</strong>
            </p>
          </div>

          {/* Draft / Wind */}
          <div className="p-4 rounded-2xl bg-slate-100 border-2 border-slate-300">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-extrabold text-slate-800 uppercase">
                SKVOZNYAK (SHAMOL) 💨
              </span>
              <Wind className="w-4 h-4 text-slate-600" />
            </div>
            <div className="h-28 bg-white/80 rounded-xl border border-slate-300 p-2 flex flex-col items-center justify-center text-center">
              <div className="text-3xl mb-1">➡️ 🐥🐥🐥</div>
              <span className="text-[11px] font-bold text-slate-800">
                Bir burchakka to‘planadi
              </span>
            </div>
            <p className="text-xs text-slate-700 mt-2.5 font-medium leading-relaxed">
              Shamol kelayotgan tuynukdan qochib, qarama-qarshi tomonga yig‘iladi. <strong>Darhol teshiklarni yoping!</strong>
            </p>
          </div>

          {/* Ideal */}
          <div className="p-4 rounded-2xl bg-emerald-50/70 border-2 border-emerald-300">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-extrabold text-emerald-900 uppercase">
                IDEAL MEʼYOR ✅
              </span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="h-28 bg-white/80 rounded-xl border border-emerald-200 p-2 flex flex-col items-center justify-center text-center">
              <div className="text-3xl mb-1">🐥 🐥 🐥 🐥</div>
              <span className="text-[11px] font-bold text-emerald-950">
                Xonaga tekis tarqalgan
              </span>
            </div>
            <p className="text-xs text-emerald-900 mt-2.5 font-medium leading-relaxed">
              Xotirjam yuradi, ovqatlanadi va suv ichadi. Chiyillamaydi. <strong>Bu eng to‘g‘ri sharoit.</strong>
            </p>
          </div>
        </div>
      </div>

      {/* Complete 45-day Temperature Table */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-amber-200/80 shadow-xs">
        <h3 className="text-base sm:text-lg font-extrabold text-slate-900 mb-3 flex items-center gap-2">
          <span>📋 45 Kunlik To‘liq Iqlim Rejimi Jadvali</span>
        </h3>

        <div className="overflow-x-auto rounded-2xl border border-amber-200">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-amber-100 text-amber-950 font-bold uppercase text-[11px]">
              <tr>
                <th className="py-3 px-3">Yosh Davri</th>
                <th className="py-3 px-3">Xona Harorati (°C)</th>
                <th className="py-3 px-3">Pol Harorati</th>
                <th className="py-3 px-3">Namlik (%)</th>
                <th className="py-3 px-3">Ventilyatsiya Tezligi</th>
                <th className="py-3 px-3">Yorug‘lik Rejimi</th>
                <th className="py-3 px-3">Holat Belgisi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-100">
              {TEMPERATURE_GUIDE.map((row, idx) => (
                <tr
                  key={idx}
                  className={idx % 2 === 0 ? 'bg-white' : 'bg-amber-50/40'}
                >
                  <td className="py-3 px-3 font-extrabold text-slate-900">
                    {row.days}
                  </td>
                  <td className="py-3 px-3 font-black text-amber-900 text-sm">
                    {row.roomTemp}
                  </td>
                  <td className="py-3 px-3 text-slate-700 font-semibold">
                    {row.floorTemp}
                  </td>
                  <td className="py-3 px-3 text-blue-800 font-bold">
                    {row.humidity}
                  </td>
                  <td className="py-3 px-3 text-slate-600">
                    {row.ventilation}
                  </td>
                  <td className="py-3 px-3 text-slate-600">
                    {row.lighting}
                  </td>
                  <td className="py-3 px-3 text-slate-600 text-[11px]">
                    {row.chickBehaviorSign}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
