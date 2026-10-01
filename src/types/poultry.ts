export type FeedPhase = 'start' | 'rost' | 'finish';

export interface DayFeedNorm {
  day: number;
  phase: FeedPhase;
  phaseName: string;
  dailyFeedPerBirdGrams: number;
  cumulativeFeedPerBirdGrams: number;
  targetWeightGrams: number;
  tempCelsius: number;
  humidityPercent: number;
  lightingHours: number;
  notes?: string;
}

export interface VaccineItem {
  id: string;
  day: number;
  ageText: string;
  name: string;
  diseaseName: string;
  applicationMethod: string;
  importance: 'shart' | 'muhim' | 'tavsiya';
  instructions: string;
  completed?: boolean;
}

export interface MedicineItem {
  id: string;
  category: 'profilaktika' | 'antibiotik' | 'koktsidiostatik' | 'vitamin' | 'antistress' | 'jigar_tozalovchi';
  categoryTitle: string;
  name: string;
  activeSubstance: string;
  symptoms: string[];
  symptomSummary: string;
  dayRecommended?: string;
  dosage: string;
  waterRatio: string;
  duration: string;
  withdrawalPeriod: string; // so'yishdan oldin kutish muddati
  instructions: string;
  warning?: string;
}

export interface TemperatureGuideItem {
  days: string;
  dayStart: number;
  dayEnd: number;
  roomTemp: string;
  floorTemp: string;
  humidity: string;
  ventilation: string;
  lighting: string;
  chickBehaviorSign: string;
  status: 'critical' | 'moderate' | 'maintenance';
}

export interface DiagnosticResult {
  diagnosis: string;
  urgency: 'shoshilinch' | 'ortacha' | 'past' | 'profilaktika';
  confidenceScore?: string;
  identifiedSigns: string[];
  immediateSteps: string[];
  recommendedMedicines: {
    name: string;
    purpose: string;
    dosage: string;
    duration: string;
    notes?: string;
  }[];
  temperatureAndClimate: string;
  biosecurityAdvice: string;
  warning?: string;
}
