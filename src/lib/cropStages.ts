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

export function getCropGrowthStages(cropName: string): string[] {
  if (!cropName) return DEFAULT_GROWTH_STAGES;
  const match = CROP_DATABASE[cropName];
  if (match && match.stages && match.stages.length > 0) {
    return match.stages;
  }
  return DEFAULT_GROWTH_STAGES;
}
