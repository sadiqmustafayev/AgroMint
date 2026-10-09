export interface CropDefinition {
  name: string;
  category: 'Cereals' | 'Industrial Crops' | 'Vegetables' | 'Orchards & Fruits' | 'Legumes';
  stages: string[];
}

export const CROP_DATABASE: Record<string, CropDefinition> = {
  Wheat: {
    name: 'Wheat',
    category: 'Cereals',
    stages: [
      'Germination & Emergence',
      'Vegetative / Tillering',
      'Stem Elongation / Jointing',
      'Booting & Heading',
      'Flowering / Anthesis',
      'Grain Filling / Maturation',
      'Harvest Readiness',
    ],
  },
  Barley: {
    name: 'Barley',
    category: 'Cereals',
    stages: [
      'Emergence & Tillering',
      'Stem Extension',
      'Heading',
      'Grain Development',
      'Ripening',
    ],
  },
  Cotton: {
    name: 'Cotton',
    category: 'Industrial Crops',
    stages: [
      'Seedling & Emergence',
      'Vegetative Branching',
      'Squaring / Flowering',
      'Boll Formation & Development',
      'Boll Opening & Defoliation',
      'Harvest Stage',
    ],
  },
  Tomato: {
    name: 'Tomato',
    category: 'Vegetables',
    stages: [
      'Transplant Establishment',
      'Vegetative Growth',
      'Flowering & Fruit Set',
      'Fruit Enlargement',
      'Breaker & Ripening',
      'Active Harvest Period',
    ],
  },
  Potato: {
    name: 'Potato',
    category: 'Vegetables',
    stages: [
      'Sprout Development',
      'Vegetative Canopy Growth',
      'Tuber Initiation',
      'Tuber Bulking',
      'Maturation & Skin Set',
    ],
  },
  Corn: {
    name: 'Corn (Maize)',
    category: 'Cereals',
    stages: [
      'Vegetative Emergence (VE-V6)',
      'Rapid Vegetative Growth (V7-V18)',
      'Tasseling & Silking (VT-R1)',
      'Kernel Blister & Milk (R2-R3)',
      'Dough & Dent (R4-R5)',
      'Black Layer & Maturity (R6)',
    ],
  },
  Apple: {
    name: 'Apple',
    category: 'Orchards & Fruits',
    stages: [
      'Dormancy & Bud Break',
      'Pink Bud & Blossom',
      'Petal Fall & Fruit Set',
      'Fruit Sizing / Cell Division',
      'Color Break & Maturation',
      'Post-Harvest Dormancy',
    ],
  },
  Pomegranate: {
    name: 'Pomegranate',
    category: 'Orchards & Fruits',
    stages: [
      'Bud Swell & Leafing Out',
      'Flowering & Anthesis',
      'Fruit Development',
      'Aril Coloration & Maturation',
      'Harvest',
    ],
  },
  Soybean: {
    name: 'Soybean',
    category: 'Legumes',
    stages: [
      'Emergence (VE)',
      'Vegetative (V1-Vn)',
      'Beginning Bloom (R1-R2)',
      'Pod Development (R3-R4)',
      'Seed Fill (R5-R6)',
      'Full Maturity (R7-R8)',
    ],
  },
};

export const AVAILABLE_CROPS: string[] = Object.keys(CROP_DATABASE);

export const DEFAULT_GROWTH_STAGES: string[] = [
  'Emergence / Seedling',
  'Vegetative',
  'Flowering / Reproductive',
  'Fruit / Grain Filling',
  'Maturity / Harvest',
];

export const CROP_LABELS_AZ: Record<string, string> = {
  Wheat: 'Buğda',
  Barley: 'Arpa',
  Cotton: 'Pambıq',
  Tomato: 'Pomidor',
  Potato: 'Kartof',
  'Corn (Maize)': 'Qarğıdalı',
  Corn: 'Qarğıdalı',
  Apple: 'Alma',
  Pomegranate: 'Nar',
  Soybean: 'Soya',
  'Other / Unlisted Crop': 'Digər / Siyahıda olmayan bitki',
};

export const CROP_STAGE_LABELS_AZ: Record<string, string> = {
  'Germination & Emergence': 'Cücərmə və Çıxış',
  'Vegetative / Tillering': 'Vegetativ / Kollanma',
  'Stem Elongation / Jointing': 'Boruya çıxma',
  'Booting & Heading': 'Sünbülləmə',
  'Flowering / Anthesis': 'Çiçəkləmə',
  'Grain Filling / Maturation': 'Dənyetişmə / Süd-mum yetişməsi',
  'Harvest Readiness': 'Tam yetişmə və Məhsul yığımı',
  // Barley
  'Emergence & Tillering': 'Çıxış və Kollanma',
  'Stem Extension': 'Gövdə uzanması / Boruya çıxma',
  'Heading': 'Sünbülləmə',
  'Grain Development': 'Dən inkişafı',
  'Ripening': 'Yetişmə',
  // Cotton
  'Seedling & Emergence': 'Cücərtilərin çıxışı',
  'Vegetative Branching': 'Vegetativ budaqlanma',
  'Squaring / Flowering': 'Qoza qoyma / Çiçəkləmə',
  'Boll Formation & Development': 'Qozaların formalaşması və inkişafı',
  'Boll Opening & Defoliation': 'Qozaların açılması və Defolyasiya',
  'Harvest Stage': 'Yığım mərhələsi',
  // Tomato
  'Transplant Establishment': 'Şitilin kök tutması',
  'Vegetative Growth': 'Vegetativ inkişaf',
  'Flowering & Fruit Set': 'Çiçəkləmə və Meyvə bağlama',
  'Fruit Enlargement': 'Meyvələrin böyüməsi',
  'Breaker & Ripening': 'Qızarma və Yetişmə',
  'Active Harvest Period': 'Aktiv yığım dövrü',
  // Potato
  'Sprout Development': 'Cücərtilərin inkişafı',
  'Vegetative Canopy Growth': 'Yerüstü gövdə inkişafı',
  'Tuber Initiation': 'Yumruların əmələ gəlməsi',
  'Tuber Bulking': 'Yumruların iriləşməsi',
  'Maturation & Skin Set': 'Yetişmə və Qabıq bərkiməsi',
  // Corn
  'Vegetative Emergence (VE-V6)': 'Vegetativ çıxış (VE-V6)',
  'Rapid Vegetative Growth (V7-V18)': 'Sürətli vegetativ artım (V7-V18)',
  'Tasseling & Silking (VT-R1)': 'Qotazlanma və Çiçəkləmə (VT-R1)',
  'Kernel Blister & Milk (R2-R3)': 'Dən əmələgəlmə və Süd yetişməsi (R2-R3)',
  'Dough & Dent (R4-R5)': 'Xəmir və Mum yetişməsi (R4-R5)',
  'Black Layer & Maturity (R6)': 'Tam yetişmə (R6)',
  // Apple
  'Dormancy & Bud Break': 'Sakitlik dövrü və Qönçələmə',
  'Pink Bud & Blossom': 'Çəhrayı qönçə və Çiçəkləmə',
  'Petal Fall & Fruit Set': 'Ləçəktökmə və Meyvə bağlama',
  'Fruit Sizing / Cell Division': 'Meyvələrin böyüməsi',
  'Color Break & Maturation': 'Rənglənmə və Dərilmə',
  'Post-Harvest Dormancy': 'Məhsuldan sonrakı sakitlik dövrü',
  // Pomegranate
  'Bud Swell & Leafing Out': 'Tumurcuq oyanması və Yarpaqlama',
  'Flowering & Anthesis': 'Çiçəkləmə və Mayalanma',
  'Fruit Development': 'Meyvələrin böyüməsi',
  'Aril Coloration & Maturation': 'Dənələrin şirələnməsi və Yetişmə',
  'Harvest': 'Yığım',
  // Soybean
  'Emergence (VE)': 'Çıxış (VE)',
  'Vegetative (V1-Vn)': 'Vegetativ (V1-Vn)',
  'Beginning Bloom (R1-R2)': 'Çiçəkləmənin başlanğıcı (R1-R2)',
  'Pod Development (R3-R4)': 'Paxlaların formalaşması (R3-R4)',
  'Seed Fill (R5-R6)': 'Dən dolması (R5-R6)',
  'Full Maturity (R7-R8)': 'Tam yetişmə (R7-R8)',
  // Default stages
  'Emergence / Seedling': 'Çıxış / Cücərti',
  'Vegetative': 'Vegetativ inkişaf',
  'Flowering / Reproductive': 'Çiçəkləmə / Reproduktiv',
  'Fruit / Grain Filling': 'Meyvə / Dən dolması',
  'Maturity / Harvest': 'Yetişmə / Yığım',
};

export function getCropGrowthStages(cropName: string): string[] {
  if (!cropName) return DEFAULT_GROWTH_STAGES;
  const match = CROP_DATABASE[cropName];
  if (match && match.stages && match.stages.length > 0) {
    return match.stages;
  }
  return DEFAULT_GROWTH_STAGES;
}

export function getCropLabel(crop: string, lang: 'en' | 'az' = 'en'): string {
  if (lang === 'az' && CROP_LABELS_AZ[crop]) {
    return CROP_LABELS_AZ[crop];
  }
  return crop;
}

export function getStageLabel(stage: string, lang: 'en' | 'az' = 'en'): string {
  if (lang === 'az' && CROP_STAGE_LABELS_AZ[stage]) {
    return CROP_STAGE_LABELS_AZ[stage];
  }
  return stage;
}
