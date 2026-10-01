import { jsPDF } from 'jspdf';
import { DAILY_FEED_NORMS, VACCINE_SCHEDULE, TEMPERATURE_GUIDE, MEDICINE_GUIDE } from '../data/broilerData';
import { DiagnosticResult } from '../types/poultry';

export interface ReportOptions {
  flockSize: number;
  breedName?: string;
  startDate?: string;
  feedPricePerKg?: number;
  chickPrice?: number;
  meatPricePerKg?: number;
  latestDiagnostic?: DiagnosticResult | null;
}

export function generatePoultryPdf(options: ReportOptions) {
  const {
    flockSize,
    breedName = 'Ross-308 / Cobb-500',
    startDate = new Date().toISOString().split('T')[0],
    feedPricePerKg = 6000,
    chickPrice = 7000,
    meatPricePerKg = 28000,
    latestDiagnostic = null,
  } = options;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;

  // Totals calculation
  let startFeedKg = 0;
  let rostFeedKg = 0;
  let finishFeedKg = 0;

  DAILY_FEED_NORMS.forEach((norm) => {
    const totalDayKg = (norm.dailyFeedPerBirdGrams * flockSize) / 1000;
    if (norm.phase === 'start') startFeedKg += totalDayKg;
    else if (norm.phase === 'rost') rostFeedKg += totalDayKg;
    else finishFeedKg += totalDayKg;
  });

  const totalFeedKg = startFeedKg + rostFeedKg + finishFeedKg;
  const startBags50kg = Math.ceil(startFeedKg / 50);
  const rostBags50kg = Math.ceil(rostFeedKg / 50);
  const finishBags50kg = Math.ceil(finishFeedKg / 50);
  const totalBags50kg = startBags50kg + rostBags50kg + finishBags50kg;

  const avgBirdLiveWeightKg = 2.85;
  const expectedTotalLiveWeightKg = Math.round(flockSize * avgBirdLiveWeightKg * 0.95); // 5% mortality norm
  const totalFeedCost = totalFeedKg * feedPricePerKg;
  const totalChicksCost = flockSize * chickPrice;
  const estimatedRevenue = expectedTotalLiveWeightKg * meatPricePerKg;
  const estimatedProfit = estimatedRevenue - (totalFeedCost + totalChicksCost);

  // Helper for text
  let y = 16;

  // Header Banner
  doc.setFillColor(245, 158, 11); // Amber-500
  doc.rect(margin, y, pageWidth - margin * 2, 24, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('BROYLER MASTER - 45 KUNLIK FERMERLIK HISOBOTI', margin + 6, y + 9);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Tovuqlar soni: ${flockSize.toLocaleString()} ta | Zoti: ${breedName} | Sana: ${startDate}`, margin + 6, y + 16);
  doc.text('Telegram Bot: @broyler_master_bot | Yem, Harorat, Vaksinalar va Dorilar', margin + 6, y + 21);

  y += 30;

  // Summary Cards Box
  doc.setFillColor(254, 243, 199); // Amber-100
  doc.roundedRect(margin, y, pageWidth - margin * 2, 28, 2, 2, 'F');

  doc.setTextColor(146, 64, 14); // Amber-800
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('UMUMIY YEM SARFI VA KUTILAYOTGAN GO\'SHT HOSILI (45 KUN)', margin + 4, y + 7);

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(30, 41, 59);

  const colW = (pageWidth - margin * 2 - 8) / 4;
  // Card 1
  doc.text('Jami Yem Miqdori:', margin + 4, y + 14);
  doc.setFont('helvetica', 'bold');
  doc.text(`${(totalFeedKg / 1000).toFixed(2)} Tonna (${totalFeedKg.toLocaleString()} kg)`, margin + 4, y + 19);
  doc.setFont('helvetica', 'normal');
  doc.text(`50 kg lik qoplar: ${totalBags50kg} ta`, margin + 4, y + 24);

  // Card 2
  doc.text('1 ta Jo\'jaga Yem:', margin + 4 + colW, y + 14);
  doc.setFont('helvetica', 'bold');
  doc.text(`${(totalFeedKg / flockSize).toFixed(2)} kg / jo'ja`, margin + 4 + colW, y + 19);
  doc.setFont('helvetica', 'normal');
  doc.text(`FCR koeffitsienti: ~1.70`, margin + 4 + colW, y + 24);

  // Card 3
  doc.text('Kutilgan Tirik Go\'sht:', margin + 4 + colW * 2, y + 14);
  doc.setFont('helvetica', 'bold');
  doc.text(`${expectedTotalLiveWeightKg.toLocaleString()} kg`, margin + 4 + colW * 2, y + 19);
  doc.setFont('helvetica', 'normal');
  doc.text(`O'rtacha vazn: ~${avgBirdLiveWeightKg} kg`, margin + 4 + colW * 2, y + 24);

  // Card 4
  doc.text('Kutilayotgan Foyda:', margin + 4 + colW * 3, y + 14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(22, 101, 52); // Green-800
  doc.text(`${Math.round(estimatedProfit / 1000000).toFixed(1)} mln so'm`, margin + 4 + colW * 3, y + 19);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(30, 41, 59);
  doc.text(`Yem tannarxi: ${(totalFeedCost / 1000000).toFixed(1)}M`, margin + 4 + colW * 3, y + 24);

  y += 34;

  // Section 1: Feed Phases Breakdown Table
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(180, 83, 9);
  doc.text('1. 45 KUNLIK YEM BOSQICHLARI VA QOPLAR HISOBI', margin, y);
  y += 5;

  // Table Header
  doc.setFillColor(243, 244, 246);
  doc.rect(margin, y, pageWidth - margin * 2, 7, 'F');
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);

  doc.text('Bosqich Nomi', margin + 2, y + 5);
  doc.text('Kunlar', margin + 42, y + 5);
  doc.text('1 Jo\'jaga (g)', margin + 64, y + 5);
  doc.text('Podaga Jami (kg)', margin + 92, y + 5);
  doc.text('50kg Qoplar', margin + 126, y + 5);
  doc.text('Asosiy Tarkibi', margin + 152, y + 5);
  y += 8;

  const phasesData = [
    {
      name: 'START (Boshlang\'ich)',
      days: '1 - 10 kun (10 kun)',
      perBird: `${Math.round(startFeedKg * 1000 / flockSize)} g`,
      totalKg: `${Math.round(startFeedKg).toLocaleString()} kg`,
      bags: `${startBags50kg} qop`,
      desc: 'Protein 22-23%, Mayda krupka',
    },
    {
      name: 'ROST (O\'sish / Grower)',
      days: '11 - 24 kun (14 kun)',
      perBird: `${Math.round(rostFeedKg * 1000 / flockSize)} g`,
      totalKg: `${Math.round(rostFeedKg).toLocaleString()} kg`,
      bags: `${rostBags50kg} qop`,
      desc: 'Protein 20-21%, Granula 2.5mm',
    },
    {
      name: 'FINISH (Semirtirish)',
      days: '25 - 45 kun (21 kun)',
      perBird: `${Math.round(finishFeedKg * 1000 / flockSize)} g`,
      totalKg: `${Math.round(finishFeedKg).toLocaleString()} kg`,
      bags: `${finishBags50kg} qop`,
      desc: 'Protein 18-19%, Energiya 3200kkal',
    },
  ];

  doc.setFont('helvetica', 'normal');
  phasesData.forEach((p, idx) => {
    if (idx % 2 === 1) {
      doc.setFillColor(250, 250, 250);
      doc.rect(margin, y - 1, pageWidth - margin * 2, 7, 'F');
    }
    doc.text(p.name, margin + 2, y + 4);
    doc.text(p.days, margin + 42, y + 4);
    doc.text(p.perBird, margin + 64, y + 4);
    doc.text(p.totalKg, margin + 92, y + 4);
    doc.text(p.bags, margin + 126, y + 4);
    doc.text(p.desc, margin + 152, y + 4);
    y += 7;
  });

  y += 4;

  // Section 2: Vaccine Schedule Table
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(180, 83, 9);
  doc.text('2. VAKSINATSIYA VA EMLASH TAQVIMI (ESLATMALAR)', margin, y);
  y += 5;

  doc.setFillColor(243, 244, 246);
  doc.rect(margin, y, pageWidth - margin * 2, 7, 'F');
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);

  doc.text('Kuni', margin + 2, y + 5);
  doc.text('Vaksina Nomi', margin + 20, y + 5);
  doc.text('Qaysi Kasallikka', margin + 74, y + 5);
  doc.text('Berish Usuli', margin + 125, y + 5);
  y += 8;

  doc.setFont('helvetica', 'normal');
  VACCINE_SCHEDULE.forEach((v, idx) => {
    if (idx % 2 === 1) {
      doc.setFillColor(254, 252, 232);
      doc.rect(margin, y - 1, pageWidth - margin * 2, 7, 'F');
    }
    doc.text(`${v.day}-kun`, margin + 2, y + 4);
    doc.text(v.name, margin + 20, y + 4);
    doc.text(v.diseaseName, margin + 74, y + 4);
    doc.text(v.applicationMethod.substring(0, 36), margin + 125, y + 4);
    y += 7;
  });

  y += 4;

  // Section 3: Temperature Guide Table
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(180, 83, 9);
  doc.text('3. HARORAT (GRADUS) VA IQLIM REJIMI', margin, y);
  y += 5;

  doc.setFillColor(243, 244, 246);
  doc.rect(margin, y, pageWidth - margin * 2, 7, 'F');
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);

  doc.text('Yosh Davri', margin + 2, y + 5);
  doc.text('Xona Harorati', margin + 44, y + 5);
  doc.text('Pol Harorati', margin + 82, y + 5);
  doc.text('Namlik', margin + 120, y + 5);
  doc.text('Yorug\'lik', margin + 148, y + 5);
  y += 8;

  doc.setFont('helvetica', 'normal');
  TEMPERATURE_GUIDE.forEach((t, idx) => {
    if (idx % 2 === 1) {
      doc.setFillColor(250, 250, 250);
      doc.rect(margin, y - 1, pageWidth - margin * 2, 6.5, 'F');
    }
    doc.text(t.days, margin + 2, y + 4);
    doc.text(t.roomTemp, margin + 44, y + 4);
    doc.text(t.floorTemp.substring(0, 20), margin + 82, y + 4);
    doc.text(t.humidity, margin + 120, y + 4);
    doc.text(t.lighting.substring(0, 22), margin + 148, y + 4);
    y += 6.5;
  });

  // PAGE 2: Veterinary Pharmacy, Preventive Medications, and AI Diagnostics
  doc.addPage();
  y = 16;

  // Header 2
  doc.setFillColor(16, 185, 129); // Emerald-500
  doc.rect(margin, y, pageWidth - margin * 2, 14, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('4. VETERINARIYA VA DORI-DARMONLAR QO\'LLANMASI', margin + 6, y + 9);
  y += 20;

  // Preventive medicine schedule
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('A. 45 KUNLIK PROFILAKTIK DORI BERISH TARTIBI (KUNBAY):', margin, y);
  y += 6;

  const routineItems = [
    { day: '1 - 3 kun', med: 'Glyukoza (5%) + Keng spektrli antibiotik (Baytril 10% yoki Enrofloksatsin)', dose: '1 litr suvga 0.5-1 ml + Chiktonik 1 ml' },
    { day: '4 - 6 kun', med: 'Toza ichimlik suvi + Probiotik yoki Multivitamin', dose: 'Suv tizimini tozalash' },
    { day: '7-kun', med: '💉 Nyukasl + Bronxit vaksinasi (ko\'zga 1 tomchi)', dose: 'Hech qanday antibiotik berilmaydi' },
    { day: '8 - 10 kun', med: 'Koktsidioz profilaktikasi: Baykoks 2.5% (Toltrazuril)', dose: '1 litr suvga 1 ml (ketma-ket 2 kun)' },
    { day: '11 - 13 kun', med: 'Multivitamin (Chiktonik) + Vitamin C (antistress)', dose: 'Vaksina oldi tayyorgarligi' },
    { day: '14-kun', med: '💉 Gamboro 1-vaksinasi (ichimlik suviga 2 soat chanqatib)', dose: 'Xlorsiz suv + 2g sut kukuni' },
    { day: '15 - 17 kun', med: 'Gepatoprotektor (jigar-buyrak tozalovchi) + Kalsiy-D3', dose: '1 litr suvga 1-2 ml' },
    { day: '21-kun', med: '💉 Nyukasl (La-Sota) 2-vaksinasi (suv orqali)', dose: '2 soat chanqatiladi' },
    { day: '28-kun', med: '💉 Gamboro 2-revaksinatsiyasi (yakuniy qalqon)', dose: 'Suv orqali beriladi' },
    { day: '37 - 45 kun', med: '🛑 KARETSIYA DAVRI: Faqat toza ichimlik suvi!', dose: 'Barcha antibiotik va dorilar to\'xtatiladi' },
  ];

  doc.setFontSize(8);
  routineItems.forEach((r, idx) => {
    if (idx % 2 === 1) {
      doc.setFillColor(248, 250, 252);
      doc.rect(margin, y - 1, pageWidth - margin * 2, 6, 'F');
    }
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(180, 83, 9);
    doc.text(r.day, margin + 2, y + 3.5);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(30, 41, 59);
    doc.text(r.med, margin + 28, y + 3.5);

    doc.setTextColor(100, 116, 139);
    doc.text(r.dose, margin + 130, y + 3.5);

    y += 6;
  });

  y += 5;

  // Emergency Symptoms and Drugs
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('B. QANAQA BELGI BO\'LGANDA QANAQA DORI BERILADI:', margin, y);
  y += 6;

  doc.setFontSize(7.5);
  MEDICINE_GUIDE.slice(0, 5).forEach((m) => {
    doc.setFillColor(254, 242, 242);
    doc.roundedRect(margin, y, pageWidth - margin * 2, 13, 1, 1, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(185, 28, 28);
    doc.text(`${m.name} (${m.categoryTitle})`, margin + 3, y + 4);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 65, 85);
    doc.text(`Alomatlar: ${m.symptomSummary}`, margin + 3, y + 8);
    doc.text(`Dozasi: ${m.dosage} | Davomiyligi: ${m.duration} | Kutish (karetsiya): ${m.withdrawalPeriod}`, margin + 3, y + 11.5);

    y += 15;
  });

  // If latest diagnostic exists, append AI Diagnostic findings!
  if (latestDiagnostic) {
    y += 2;
    doc.setFillColor(238, 242, 255); // Indigo-50
    doc.roundedRect(margin, y, pageWidth - margin * 2, 34, 2, 2, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(67, 56, 202);
    doc.text('C. AI VETERINAR RASM TAHLILI VA TASHXISI:', margin + 4, y + 6);

    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(`Tashxis: ${latestDiagnostic.diagnosis} (Xavf darajasi: ${latestDiagnostic.urgency.toUpperCase()})`, margin + 4, y + 12);

    doc.setFont('helvetica', 'normal');
    const firstStep = latestDiagnostic.immediateSteps?.[0] || 'Zudlik bilan sanitariya choralarini ko\'ring.';
    doc.text(`Zudlik bilan chora: ${firstStep.substring(0, 95)}`, margin + 4, y + 17);

    const firstMed = latestDiagnostic.recommendedMedicines?.[0];
    if (firstMed) {
      doc.text(`Tavsiya dori: ${firstMed.name} - Dozasi: ${firstMed.dosage} (${firstMed.duration})`, margin + 4, y + 22);
    }
    doc.text(`Iqlim tavsiyasi: ${latestDiagnostic.temperatureAndClimate.substring(0, 95)}`, margin + 4, y + 27);
    y += 38;
  }

  // Footer notes
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text('Eslatma: Ushbu hujjat parrandachilik me\'yorlari va veterinariya qoidalariga asoslangan holda avtomatik generatsiya qilindi.', margin, pageHeight - 8);
  doc.text('Broyler Master Telegram Bot tizimi tomonidan taqdim etildi.', pageWidth - margin - 75, pageHeight - 8);

  // Save the PDF
  doc.save(`Broyler_${flockSize}_ta_45_kunlik_hisobot.pdf`);
}
