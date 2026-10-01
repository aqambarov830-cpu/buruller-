import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

app.use(express.json({ limit: '25mb' }));

// Initialize Gemini SDK with server-side API Key
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// AI Poultry Health Image Analysis Endpoint
app.post('/api/analyze-poultry', async (req: Request, res: Response) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg', description, chickAgeDays, flockSize } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'Rasm yuborilmadi (Image base64 is required)' });
    }

    // Clean base64 if it includes prefix
    const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');

    const systemPrompt = `Siz broyler tovuqlari va jo'jalari bo'yicha yuqori malakali bosh veterinarsiz (Poultry Veterinarian Specialist).
Foydalanuvchi broyler tovuq/jo'jalari, ularning axlati (tezagi), ko'zlari, oyog'i yoki fermadagi holatining rasmini yukladi.
Fermer holati:
- Jo'jalar yoshi: ${chickAgeDays ? chickAgeDays + ' kunlik' : 'Nomaʼlum'}
- Parrandalar soni: ${flockSize ? flockSize + ' ta' : 'Nomaʼlum'}
- Foydalanuvchi izohi: ${description || 'Izoh berilmagan'}

Vazifangiz:
Ushbu rasmni chuqur tahlil qilib, o'zbek tilida aniq, tushunarli va professional tavsiya berish.
Javobni quyidagi JSON formatida qaytaring:
{
  "diagnosis": "Ehtimoliy tashxis yoki holat nomi (masalan: Koksidioz (Eimeria), Kolibakterioz, Mikoplazmoz, Aspergillyoz, Raxt, Shamollash, yoki Sog'lom norma)",
  "urgency": "shoshilinch" (agar hayotiy xavfli bo'lsa) YOKI "ortacha" YOKI "past" YOKI "profilaktika",
  "confidenceScore": "ehtimollik foizi, masalan: 85%",
  "identifiedSigns": ["Aniqlangan 1-belgi", "Aniqlangan 2-belgi"],
  "immediateSteps": [
    "1-qadam: Zudlik bilan nima qilish kerak (masalan, kasallangan jo'jalarni darhol ajratish)",
    "2-qadam: Suv tizimini tozalash yoki to'xtatish",
    "3-qadam: Katakni quritish"
  ],
  "recommendedMedicines": [
    {
      "name": "Dori nomi (masalan: Baykoks 2.5% yoki Toltrazuril)",
      "purpose": "Nima uchun beriladi (Koksidiyalarni yo'qotish)",
      "dosage": "Aniq dozasi: 1 litr toza ichimlik suviga 1 ml (yoki 1000 ta jo'jaga hisobi)",
      "duration": "Necha kun beriladi (masalan: ketma-ket 2 kun)",
      "notes": "Eslatma: dorili suvni 24 soat ichida ichirib tugatish kerak"
    }
  ],
  "temperatureAndClimate": "Ushbu holatda xona harorati (gradus) va namlikni nima qilish kerak (masalan: haroratni 1-2°C ga ko'taring, ventilyatsiyani tekshiring)",
  "biosecurityAdvice": "Katak tozaligi, taglik (podstilka) va profilaktika choralari",
  "warning": "Muhim ogohlantirish yoki shifokor ko'rigi talab qilinishi"
}

Javobingiz faqat to'g'ri JSON bo'lsin, oraliq belgilar yoki markdown belgisiz (yoki toza JSON) bering.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: {
        parts: [
          {
            inlineData: {
              data: cleanBase64,
              mimeType: mimeType,
            },
          },
          {
            text: systemPrompt,
          },
        ],
      },
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '{}';
    let parsedData;
    try {
      parsedData = JSON.parse(text);
    } catch {
      // Clean fallback if markdown codeblock was included
      const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      parsedData = JSON.parse(cleaned);
    }

    return res.json({ success: true, data: parsedData });
  } catch (error: any) {
    console.error('Veterinary analysis error:', error);
    return res.status(500).json({
      error: 'Tahlil qilishda xatolik yuz berdi: ' + (error?.message || 'Nomaʼlum xatolik'),
    });
  }
});

// AI Quick Consult / Chat Endpoint
app.post('/api/ask-vet', async (req: Request, res: Response) => {
  try {
    const { question, chickAgeDays, flockSize, history = [] } = req.body;

    if (!question) {
      return res.status(400).json({ error: 'Savol matni kiritilmadi' });
    }

    const systemInstruction = `Siz parrandachilik va broyler tovuqlari bo'yicha 20 yillik tajribaga ega yetakchi veterinarsiz.
Foydalanuvchi fermer sizdan broyler tovuqlarini boqish, dorilari, 45 kunlik yem ratsioni, gradus (harorat) va vaksinalari bo'yicha maslahat so'ramoqda.
Doimo do'stona, aniq, professional va o'zbek tilida amaliy (dorilar nomi, dozasi, harorat gradusi bilan) maslahat bering.
Jo'jalar soni: ${flockSize || 'Nomaʼlum'}, Yoshi: ${chickAgeDays ? chickAgeDays + ' kunlik' : 'Nomaʼlum'}.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Savol: ${question}`,
      config: {
        systemInstruction,
      },
    });

    return res.json({
      success: true,
      answer: response.text,
    });
  } catch (error: any) {
    console.error('Ask vet error:', error);
    return res.status(500).json({
      error: 'Maslahat olishda xatolik: ' + (error?.message || 'Nomaʼlum xato'),
    });
  }
});

// Mount Vite or static server
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Broyler Master Server running on port ${PORT}`);
  });
}

startServer();
