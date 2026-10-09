import { FarmSubmissionPayload } from '../types/farm';
import { AgronomicAdvisoryReport, MetricEvaluation, WeatherSynthesis } from '../types/advisory';
import { SevenDayWeatherData } from './weatherService';
import { getCropLabel, getStageLabel } from './cropStages';

export function generateMockAdvisoryReport(
  payload: Partial<FarmSubmissionPayload>,
  lang: 'en' | 'az' = 'en',
  weatherData?: SevenDayWeatherData
): AgronomicAdvisoryReport {
  const isAz = lang === 'az';
  const rawCrop = payload.crop || 'Wheat';
  const rawStage = payload.growthStage || 'Vegetative';
  const crop = isAz ? getCropLabel(rawCrop, 'az') : rawCrop;
  const stage = isAz ? getStageLabel(rawStage, 'az') : rawStage;
  const region = payload.region || (isAz ? 'Regional Ərazi' : 'Regional District');
  const hasSoilMetrics = Boolean(
    payload.soilMetrics &&
      (payload.soilMetrics.ph !== undefined ||
        payload.soilMetrics.nitrogenPpm !== undefined)
  );

  const metrics: MetricEvaluation[] = hasSoilMetrics
    ? [
        {
          parameter: isAz ? 'Torpaq pH Reaksiyası' : 'Soil pH',
          value: payload.soilMetrics?.ph ?? 6.8,
          unit: 'pH',
          status:
            (payload.soilMetrics?.ph ?? 6.8) >= 6.2 &&
            (payload.soilMetrics?.ph ?? 6.8) <= 7.5
              ? 'optimal'
              : 'high',
          benchmark: '6.0 - 7.2 (Ideal bioavailability)',
          interpretation: isAz
            ? 'Neytral-qələvi reaksiya; mikroelement mənimsənilməsi üçün əlverişlidir.'
            : 'Neutral to slightly alkaline; micronutrient availability is favorable.',
        },
        {
          parameter: isAz ? 'Mənimsənilən Azot (N)' : 'Available Nitrogen (N)',
          value: payload.soilMetrics?.nitrogenPpm ?? 28,
          unit: 'ppm',
          status: (payload.soilMetrics?.nitrogenPpm ?? 28) < 30 ? 'low' : 'optimal',
          benchmark: '35 - 50 ppm',
          interpretation: isAz
            ? 'Azot ehtiyatı intensiv inkişaf tələbatından aşağıdır.'
            : 'Nitrogen reserves are below peak vegetative requirement.',
        },
        {
          parameter: isAz ? 'Mütəhərrik Fosfor (P)' : 'Available Phosphorus (P)',
          value: payload.soilMetrics?.phosphorusPpm ?? 19,
          unit: 'ppm',
          status: 'optimal',
          benchmark: '15 - 25 ppm (Olsen)',
          interpretation: isAz
            ? 'Kök sistemi və ilkin generativ orqanların inkişafı üçün yetərlidir.'
            : 'Sufficient for root development and early reproductive structures.',
        },
        {
          parameter: isAz ? 'Mübadiləvi Kalium (K)' : 'Potassium (K)',
          value: payload.soilMetrics?.potassiumPpm ?? 190,
          unit: 'ppm',
          status: 'optimal',
          benchmark: '150 - 250 ppm',
          interpretation: isAz
            ? 'Bitkinin quraqlığa dözümlülüyü və gövdə möhkəmliyi üçün optimal səviyyədədir.'
            : 'Good osmotic regulation and stalk strength capability.',
        },
      ]
    : [
        {
          parameter: isAz ? 'Torpaq pH (Təxmini)' : 'Soil pH (Estimated)',
          value: isAz ? '7.1 (Regional Təxmin)' : '7.1 (Regional Est.)',
          unit: 'pH',
          status: 'unknown',
          benchmark: '6.0 - 7.2',
          interpretation: isAz
            ? 'Regional geoloji göstəricilərə əsasən təxmin edilib. Laboratoriya analizi tövsiyə olunur.'
            : 'Estimated based on regional geological baseline. Laboratory verification strongly advised.',
        },
        {
          parameter: isAz ? 'Azot (N) Bazasız' : 'Nitrogen (N) Baseline',
          value: isAz ? 'Ölçülməyib' : 'Unmeasured',
          unit: 'ppm',
          status: 'unknown',
          benchmark: '35 - 50 ppm',
          interpretation: isAz
            ? 'Artıq gübrələmənin və yuyulmanın qarşısını almaq üçün laboratoriya analizi vacibdir.'
            : 'Lab analysis required to prevent over-fertilization and nitrate leaching.',
        },
        {
          parameter: isAz ? 'Fosfor (P) Bazasız' : 'Phosphorus (P) Baseline',
          value: isAz ? 'Ölçülməyib' : 'Unmeasured',
          unit: 'ppm',
          status: 'unknown',
          benchmark: '15 - 25 ppm',
          interpretation: isAz
            ? 'Fosfor səviyyəsi yoxlanılmayıb; ilkin dozaları ehtiyatla verin.'
            : 'Phosphorus status unverified; apply starter doses conservatively.',
        },
        {
          parameter: isAz ? 'Kalium (K) Bazasız' : 'Potassium (K) Baseline',
          value: isAz ? 'Ölçülməyib' : 'Unmeasured',
          unit: 'ppm',
          status: 'unknown',
          benchmark: '150 - 250 ppm',
          interpretation: isAz
            ? 'Fermer anketində daxil edilməyib.'
            : 'Unmeasured in farmer questionnaire.',
        },
      ];

  const safeDosageNotice = isAz
    ? hasSoilMetrics
      ? 'Dəqiq doza hesablanması təqdim edilmiş torpaq laboratoriya parametrlərinə əsasən kalibrasiya olunmuşdur.'
      : 'Diqqət: Rəsmi laboratoriya analizi olmadan dəqiq kimyəvi doza təminatı verilə bilməz. Göstərilən normalar regional ehtiyat hədləridir.'
    : hasSoilMetrics
    ? 'Dosage calculation calibrated to submitted soil laboratory parameters.'
    : 'Caution: Precise chemical application rates cannot be guaranteed without calibrated soil laboratory analysis. Dosages shown are conservative regional estimates.';

  const uncertaintiesAndGaps: string[] = [];
  if (!hasSoilMetrics) {
    uncertaintiesAndGaps.push(
      isAz
        ? 'Dəqiq laboratoriya torpaq analiz nəticələri (N-P-K, mikroelementlər, kation tutumu) təqdim edilməyib.'
        : 'Exact laboratory soil nutrient data (N-P-K, micronutrients, cation exchange capacity) was not provided.'
    );
  }
  if (!payload.farmAreaHectares) {
    uncertaintiesAndGaps.push(
      isAz
        ? 'Sahənin ümumi hektar ölçüsü qeyd edilməyib; ümumi tələbat həcmini dəqiq hesablamaq mümkün deyil.'
        : 'Total field area in hectares not specified; aggregate bulk order volumes cannot be calculated.'
    );
  }
  if (!payload.irrigationMethod || payload.irrigationMethod === 'Not Specified') {
    uncertaintiesAndGaps.push(
      isAz
        ? 'Suvarma metodu və su mənbəyi dəqiqləşdirilməyib; regional standart yağıntı normativləri əsas götürülüb.'
        : 'Irrigation method and water source unconfirmed; scheduling assumes standard regional precipitation balance.'
    );
  }

  return {
    id: `AGM-${Math.floor(100000 + Math.random() * 900000)}`,
    createdAt: new Date().toISOString(),
    farmProfile: {
      region,
      district: payload.district || (isAz ? 'Qeyd edilməyib' : 'Unspecified District'),
      farmAreaHectares: payload.farmAreaHectares ?? undefined,
      crop,
      growthStage: stage,
      soilType: payload.soilType || 'Unknown / Unsure',
      soilMode: payload.soilMode || (hasSoilMetrics ? 'manual' : 'upload'),
      soilMetrics: payload.soilMetrics,
      irrigationMethod: payload.irrigationMethod || 'Not Specified',
      waterSource: payload.waterSource || 'Not Specified',
      mainProblem:
        payload.mainProblem ||
        (isAz
          ? 'Ümumi aqronomik vəziyyətin qiymətləndirilməsi və gübrələmə planı.'
          : 'General agronomic health evaluation and fertility plan.'),
      uploadedDocumentNames: payload.uploadedDocumentNames || [],
      uploadedPhotoNames: payload.uploadedPhotoNames || [],
    },
    overallHealthScore: hasSoilMetrics ? 82 : 74,
    summaryDiagnosis: isAz
      ? `${region} bölgəsində ${crop} bitkisinin ${stage} inkişaf mərhələsi üzrə aqronomik təhlili. Qida maddələrinin mənimsənilməsi hədəfli azot yemləməsi və balanslaşdırılmış suvarma ilə təmin oluna bilər.`
      : `Field evaluation for ${crop} during the ${stage} window in ${region}. Nutrient bioavailability is manageable with targeted nitrogen supplementation and balanced moisture intervals.`,
    mainFindings: isAz
      ? [
          `Bitki hazırda ${stage} mərhələsindədir; bu faza davamlı və nizamlı qida təminatı tələb edir.`,
          hasSoilMetrics
            ? 'Torpaq pH göstəricisi neytral mühiti göstərir; çiçəkləmə və kütləvi böyümədən əvvəl azot ehtiyatı təmin olunmalıdır.'
            : 'Laboratoriya analizi olmadığından torpağın yuyulmasının qarşısını almaq üçün gübrə hissə-hissə verilməlidir.',
          `Fermerin qeyd etdiyi "${payload.mainProblem || 'məhsuldarlıq'}" məsələsi mərhələli aqrotexniki və qidalanma tədbirləri ilə aradan qaldırıla bilər.`,
        ]
      : [
          `Crop is currently in ${stage}, a sensitive vegetative-to-reproductive phase requiring sustained nutrient bioavailability.`,
          hasSoilMetrics
            ? 'Soil pH indicates neutral conditions; nitrogen levels require replenishment before peak flowering/tillering.'
            : 'Lack of lab soil testing necessitates split applications to prevent nutrient toxicity or leaching.',
          `Primary reported concern regarding "${payload.mainProblem || 'crop performance'}" is addressed through phased cultural and nutritional controls.`,
        ],
    cropSpecificGuidance: {
      optimalTemperature: isAz
        ? '18°C – 28°C Gündüz / 14°C – 18°C Gecə'
        : '18°C – 28°C Day / 14°C – 18°C Night',
      stageManagement: isAz
        ? `${stage} dövründə hüceyrə bölünməsi və yarpaq sahəsi indeksinin qorunmasına diqqət yetirin. İstilik piklərində su çatışmazlığına yol verməyin.`
        : `Focus on uninterrupted cellular expansion and leaf area index during ${stage}. Avoid moisture stress during thermal peaks.`,
      canopyCare: isAz
        ? 'Aşağı yarpaqlarda göbələk sporlarının inkişafını azaltmaq üçün cərgəarası havalandırmanı təmin edin.'
        : 'Maintain row aeration to reduce fungal spore germination in lower leaf layers.',
      keyRisks: isAz
        ? [
            'Günorta saatlarında yüksək temperaturda transpirasiya və su stresi',
            'Yarpaqların uzun müddət nəm qalması nəticəsində göbələk xəstəliyi riski',
          ]
        : [
            'Transpiration stress during midday high temperatures',
            'Foliar fungal pathogens under prolonged leaf wetness',
          ],
    },
    soilFertility: {
      soilType: payload.soilType || (isAz ? 'Gilli-qumlu / Yoxlanılmayıb' : 'Loamy / Unverified'),
      metrics,
      fertilityIndex: hasSoilMetrics ? 'Balanced' : 'Unknown',
      notes: isAz
        ? hasSoilMetrics
          ? 'Torpaq parametrləri kation mübadiləsini və qida elementlərinin mənimsənilməsini dəstəkləyir.'
          : 'Məlumatlar təxminidir. Dəqiq nəticə üçün rəsmi laboratoriya analizi aparılması tövsiyə olunur.'
        : hasSoilMetrics
        ? 'Soil parameters support effective cation uptake with moderate buffering capacity.'
        : 'Unverified baseline. Recommended to perform standard Mehlich-3 soil extract test.',
    },
    fertilizerAdvisory: {
      safeDosageNotice,
      prescriptions: [
        {
          nutrient: isAz ? 'Azot (N)' : 'Nitrogen (N)',
          fertilizerType: isAz
            ? 'Karbamid (Urea 46-0-0) və ya Ammonium Nitrat'
            : 'Urea (46-0-0) or Calcium Ammonium Nitrate (CAN)',
          timing: isAz ? 'Səhər tezdən suvarma öncəsi hissəli yemləmə' : 'Early morning split top-dress',
          estimatedRate: hasSoilMetrics
            ? '60 - 80 kg/ha'
            : isAz
            ? 'Ehtiyatlı ilkin norma'
            : 'Conservative baseline only',
          isGuardedEstimate: !hasSoilMetrics,
        },
        {
          nutrient: isAz ? 'Fosfor (P2O5)' : 'Phosphorus (P2O5)',
          fertilizerType: isAz
            ? 'Ammofos / Diammonium Fosfat (DAP 18-46-0)'
            : 'Diammonium Phosphate (DAP 18-46-0)',
          timing: isAz ? 'Kökətrafı lentvari tətbiq' : 'Localized band placement if required',
          estimatedRate: hasSoilMetrics
            ? '30 - 45 kg/ha'
            : isAz
            ? 'Laboratoriya təsdiqi tələb olunur'
            : 'Lab verification needed',
          isGuardedEstimate: !hasSoilMetrics,
        },
        {
          nutrient: isAz ? 'Kalium (K2O)' : 'Potassium (K2O)',
          fertilizerType: isAz
            ? 'Kalium Sulfat (SOP 0-0-50)'
            : 'Potassium Sulfate (SOP 0-0-50)',
          timing: isAz ? 'Suvarma suyu ilə (fertiqasiya)' : 'Mid-stage fertigation or soil incorporation',
          estimatedRate: hasSoilMetrics
            ? '40 - 50 kg/ha'
            : isAz
            ? 'Standart regional norma'
            : 'Standard regional buffer',
          isGuardedEstimate: !hasSoilMetrics,
        },
      ],
      agroSphereLink: {
        title: isAz
          ? 'AgroSphere Platformasında Sertifikatlı Gübrələrlə Tanış Olun'
          : 'Explore and Order Certified Fertilizers on AgroSphere',
        description: isAz
          ? 'Laboratoriya sınağından keçmiş mineral gübrələr və xüsusi qarışıqlar üçün AgroSphere aqromarketində birbaşa təchizatçılarla əlaqə saxlayın.'
          : 'Connect directly with certified agricultural input distributors on the AgroSphere marketplace for laboratory-tested fertilizers and custom mineral blends.',
        destinationUrl: 'https://agrosphere.org/marketplace/fertilizers',
        serviceType: 'fertilizer',
        callToActionText: isAz
          ? 'Uyğun Gübrələri AgroSphere-də İncələyin'
          : 'View Suitable Fertilizers on AgroSphere',
      },
    },
    irrigationAdvisory: {
      currentMethod: payload.irrigationMethod || (isAz ? 'Standart Suvarma' : 'Standard Irrigation'),
      recommendedFrequency: isAz
        ? 'Hər 4-6 gündən bir (buxarlanma sürətinə uyğunlaşdırılmış)'
        : 'Every 4-6 days (adapted to evapotranspiration rates)',
      waterRequirementMmPerWeek: weatherData
        ? Math.max(12, 32 - Math.round(weatherData.summary.totalRainfallMm * 0.7))
        : 32,
      managementTips: isAz
        ? [
            weatherData && weatherData.summary.totalRainfallMm > 5
              ? `Proqnozlaşdırılan ${weatherData.summary.totalRainfallMm} mm yağıntı nəzərə alınaraq suvarma norması ${Math.max(12, 32 - Math.round(weatherData.summary.totalRainfallMm * 0.7))} mm/həftə səviyyəsinə tənzimlənmişdir.`
              : 'Kökün udma qabiliyyətini artırmaq və buxarlanma itkisini azaltmaq üçün səhər tezdən suvarın.',
            'Nasos dövriyyəsinə başlamazdan əvvəl 25-30 sm dərinlikdə torpaq nəmliyini yoxlayın.',
            'Kök zonasında su durğunluğunun qarşısını almaq üçün drenaj şırımlarını açıq saxlayın.',
          ]
        : [
            weatherData && weatherData.summary.totalRainfallMm > 5
              ? `Accounted for ${weatherData.summary.totalRainfallMm}mm anticipated rainfall; net irrigation volume adjusted to ${Math.max(12, 32 - Math.round(weatherData.summary.totalRainfallMm * 0.7))} mm/week.`
              : 'Irrigate during early dawn hours to maximize root absorption and reduce surface evaporative loss.',
            'Monitor tensiometer or soil feel at 25-30cm root depth before commencing pumping cycle.',
            'Ensure drainage channels prevent standing water in root zones.',
          ],
    },
    plantProtection: {
      diagnosedStressors: isAz
        ? [
            'Yeni şirəli yarpaqlarda mənənə və sorucu zərərverici təzyiqi',
            'Sıx çətir altında erkən yarpaq ləkəliliyi və göbələk riski',
          ]
        : [
            'Aphid / sucking pest pressure in lush new foliage',
            'Early fungal leaf blight susceptibility due to canopy density',
          ],
      preventativeControls: isAz
        ? [
            'Zərərvericilərin erkən aşkarlanması üçün sarı yapışqan tələlərdən istifadə edin (15-20 ədəd/ha).',
            'Zərərverici həssaslığını artıran yumşaq toxumaların qarşısını almaq üçün azot balansını qoruyun.',
          ]
        : [
            'Deploy yellow sticky monitoring cards (15-20 units/ha) for early threshold detection.',
            'Maintain balanced nitrogen to prevent excessively soft succulent tissue susceptible to pests.',
          ],
      organicInterventions: isAz
        ? [
            'İlk əlamətlərdə Neem yağı ekstraktı və ya bio-insektisid çiləməsi.',
            'Rütubətli axşam saatlarında faydalı entomopatogen göbələklərin (Beauveria bassiana) tətbiqi.',
          ]
        : [
            'Neem seed kernel extract (NSKE 5%) or mineral oil foliar spray at initial spotting.',
            'Beneficial entomopathogenic fungi (Beauveria bassiana) during humid evenings.',
          ],
      agroSphereLink: {
        title: isAz
          ? 'AgroSphere-də Bitki Mühafizə Vasitələri ilə Tanış Olun'
          : 'Explore Plant Protection Products on AgroSphere',
        description: isAz
          ? 'Lisenziyalı bioloji preparatlar və inteqrasiya olunmuş zərərverici mühafizə vasitələrini AgroSphere təchizatçılarından əldə edin.'
          : 'Review licensed organic bio-fungicides and integrated pest management supplies available through verified suppliers on AgroSphere.',
        destinationUrl: 'https://agrosphere.org/marketplace/plant-protection',
        serviceType: 'protection',
        callToActionText: isAz
          ? 'Bitki Mühafizə Məhsullarına Baxın'
          : 'Explore Crop Protection on AgroSphere',
      },
    },
    actionSteps: weatherData && weatherData.summary.totalRainfallMm >= 8
      ? [
          {
            id: 'act-1',
            title: isAz
              ? 'Yağış Qabağı Drenaj və Suvarma Fasiləsi'
              : 'Pre-Rain Drainage & Irrigation Pause',
            timeline: 'Immediate (1-2 Days)',
            description: isAz
              ? `Gözlənilən ${weatherData.summary.totalRainfallMm} mm yağıntı səbəbilə su nasoslarını dayandırın və şırımların su axarını yoxlayın.`
              : `Pause irrigation pumps ahead of predicted ${weatherData.summary.totalRainfallMm}mm rainfall and clear field furrows to prevent rootlogging.`,
            importance: 'critical',
          },
          {
            id: 'act-2',
            title: isAz
              ? 'Küləksiz Pəncərədə Zərərverici Nəzarəti və Çiləmə'
              : 'Calm Window Plant Protection & Spraying',
            timeline: 'Near-term (3-7 Days)',
            description: isAz
              ? weatherData.summary.maxWindSpeedKmH >= 18
                ? `Küləyin ${weatherData.summary.maxWindSpeedKmH} km/saat olduğu günlərdə çiləmə aparmayın. Yağışdan sonrakı sakit səhər saatlarını seçin.`
                : 'Yağışdan sonra yaranacaq rütubətli şəraitdə yarpaq ləkəliliyinə qarşı qoruyucu çiləmə aparın.'
              : weatherData.summary.maxWindSpeedKmH >= 18
                ? `Avoid foliar spraying during peak wind gusts (${weatherData.summary.maxWindSpeedKmH} km/h). Reschedule to calm post-rain morning.`
                : 'Scout canopy for fungal lesions following rain event and deploy protective organic treatments.',
            importance: 'standard',
          },
          {
            id: 'act-3',
            title: isAz
              ? 'Yağışdan Sonra Azot Yemləməsi'
              : 'Post-Rain Top-Dressing Application',
            timeline: 'Near-term (3-7 Days)',
            description: isAz
              ? 'Torpaq həddindən artıq doymuş vəziyyətdən çıxdıqdan sonra azot normasını hissəvi olaraq verin.'
              : 'Apply calibrated nitrogen top-dressing once topsoil stabilizes following the precipitation event.',
            importance: 'standard',
          },
          {
            id: 'act-4',
            title: isAz
              ? 'Laboratoriya Torpaq Analizi Aparın'
              : 'Comprehensive Soil Lab Sampling',
            timeline: 'Next Growth Phase',
            description: isAz
              ? 'Növbəti mövsümdə dəqiq mikrodozalanma üçün sahədən torpaq nümunələri götürün.'
              : 'Collect core soil samples across representative zones to unlock precise micro-dosing for subsequent season.',
            importance: 'preventative',
          },
        ]
      : [
          {
            id: 'act-1',
            title: isAz
              ? 'Suvarmanı Tənzimləyin və Torpaq Nəmliyini Yoxlayın'
              : 'Calibrate Irrigation & Inspect Moisture Zone',
            timeline: 'Immediate (1-2 Days)',
            description: isAz
              ? '20 sm dərinlikdə rütubəti yoxlayın. Bitkinin su stresinə düşməməsi üçün suvarma rejimini nizamlayın.'
              : 'Verify soil moisture at 20cm depth. Adjust schedule to prevent water stress during current growth window.',
            importance: 'critical',
          },
          {
            id: 'act-2',
            title: isAz
              ? 'Azot Yemləmə Gübrəsini Tətbiq Edin'
              : 'Execute Split Nitrogen Top-Dressing',
            timeline: 'Near-term (3-7 Days)',
            description: isAz
              ? 'Azotu planlaşdırılmış suvarmadan dərhal əvvəl hissə-hissə sahəyə verin.'
              : 'Apply nitrogen in split applications, ideally right before scheduled irrigation or rain event.',
            importance: 'standard',
          },
          {
            id: 'act-3',
            title: isAz
              ? 'Sahə Monitorinqi və Xəstəlik Müşahidəsi'
              : 'Canopy Monitoring & Disease Scouting',
            timeline: 'Near-term (3-7 Days)',
            description: isAz
              ? 'Sahəni "W" trayektoriyası ilə gəzin; aşağı yarpaqların alt səthində ləkə və ya zərərverici olub-olmadığını yoxlayın.'
              : 'Walk field in "W" pattern; check underside of lower leaves for fungal lesions or vector populations.',
            importance: 'preventative',
          },
          {
            id: 'act-4',
            title: isAz
              ? 'Laboratoriya Torpaq Analizi Aparın'
              : 'Comprehensive Soil Lab Sampling',
            timeline: 'Next Growth Phase',
            description: isAz
              ? 'Növbəti mövsümdə dəqiq mikrodozalanma üçün sahədən torpaq nümunələri götürün.'
              : 'Collect core soil samples across representative zones to unlock precise micro-dosing for subsequent season.',
            importance: 'standard',
          },
        ],
    uncertaintiesAndGaps,
    scientificCitations: [
      {
        title: 'FAO Irrigation and Drainage Paper No. 56: Crop Evapotranspiration',
        source: 'Food and Agriculture Organization (FAO), Rome',
        year: 2021,
        relevance: isAz
          ? 'Quraq və yarımsəhra bölgələrində bitki su tələbatının hesablanması qaydaları.'
          : 'Guidelines for computing crop water requirements in arid/semi-arid regions.',
      },
      {
        title: 'Nutrient Management Guidelines for Field Crops',
        source: 'International Plant Nutrition Institute (IPNI)',
        year: 2022,
        relevance: isAz
          ? 'Fenoloji inkişaf mərhələləri üzrə azot və kaliumun mənimsənilmə kinetikası.'
          : 'Nitrogen and potassium uptake kinetics by phenological growth stage.',
      },
      {
        title: 'Integrated Pest Management: Field Guide for Cereal and Horticultural Crops',
        source: 'Global Agronomy Extension Series',
        year: 2023,
        relevance: isAz
          ? 'İqtisadi ziyan həddi və qeyri-kimyəvi aqrotexniki zərərverici mübarizə metodları.'
          : 'Economic injury thresholds and non-chemical cultural pest control strategies.',
      },
    ],
    weatherData,
    weatherSynthesis: weatherData
      ? {
          headline: isAz
            ? `${weatherData.locationName}: 7 Günlük Aqro-Meteoroloji Nəticələr`
            : `${weatherData.locationName}: 7-Day Agro-Meteorological Synthesis`,
          summary: isAz
            ? `Qarşıdakı 7 gündə orta maksimal temperatur ${weatherData.summary.avgMaxTemp}°C, ümumi yağıntı ${weatherData.summary.totalRainfallMm} mm və maksimal külək sürəti ${weatherData.summary.maxWindSpeedKmH} km/saat gözlənilir.`
            : `Average high of ${weatherData.summary.avgMaxTemp}°C with ${weatherData.summary.totalRainfallMm}mm cumulative precipitation and maximum wind of ${weatherData.summary.maxWindSpeedKmH} km/h across the next 7 days.`,
          irrigationImpact: isAz
            ? weatherData.summary.totalRainfallMm >= 8
              ? `Gözlənilən ${weatherData.summary.totalRainfallMm} mm yağıntı torpaq profilini təbii dolduracaq. Suvarma həcmi azaldılıb; intensiv yağıntı günlərində suvarma sistemlərini dayandırın.`
              : `Yağıntı minimaldır (${weatherData.summary.totalRainfallMm} mm). Bitkinin su tələbatını ödəmək üçün müntəzəm suvarma qrafikini saxlayın.`
            : weatherData.summary.totalRainfallMm >= 8
              ? `Expected ${weatherData.summary.totalRainfallMm}mm rainfall recharges the root zone. Pumping requirement curtailed; pause automated cycles during peak rainfall.`
              : `Low precipitation expected (${weatherData.summary.totalRainfallMm}mm). Maintain regular irrigation schedule to prevent evaporative deficit.`,
          fertilizerImpact: isAz
            ? weatherData.summary.totalRainfallMm >= 8
              ? `Yağıntı ərəfəsində səpinlə azot verməyin; leysan suları ilə azotun yuyulması riskini önləmək üçün yemləməni yağışdan sonraya saxlayın.`
              : `Nisbətən sabit hava şəraiti gübrələrin normal qrafiklə, səhər suvarma dövriyyəsində verilməsinə imkan verir.`
            : weatherData.summary.totalRainfallMm >= 8
              ? `Avoid surface broadcast of granular nitrogen ahead of rainfall to prevent leaching into subsoil. Delay until soil stabilizes.`
              : `Stable atmospheric conditions favor routine fertilizer split-applications during scheduled early-morning waterings.`,
          protectionImpact: isAz
            ? weatherData.summary.rainyDaysCount >= 2
              ? `Mülayim hava və yağıntı yarpaq rütubətini artıraraq göbələk xəstəliyi riskini yüksəldir. Xüsusilə alt yarpaqları yoxlayın.`
              : `Aşağı rütubət göbələk riskini azaldır, lakin quru isti hava sorucu zərərvericilərin aktivləşməsinə səbəb ola bilər.`
            : weatherData.summary.rainyDaysCount >= 2
              ? `Consecutive damp periods elevate fungal spore germination risk. Monitor lower canopy and deploy preventative bio-controls.`
              : `Low humidity reduces fungal disease incidence, but warm conditions require continued aphid and mite scouting.`,
          sprayWindowRecommendation: isAz
            ? weatherData.summary.maxWindSpeedKmH >= 18
              ? `Külək ${weatherData.summary.maxWindSpeedKmH} km/saat həddinə çatdıqda çiləmədən imtina edin (damcıların sovrulması təhlükəsi). Küləyin sakit olduğu (<12 km/saat) səhər saatlarını seçin.`
              : `Külək sürəti mülayimdir (${weatherData.summary.maxWindSpeedKmH} km/saat). Səhər və axşam saatlarında çiləmə aparmaq təhlükəsizdir.`
            : weatherData.summary.maxWindSpeedKmH >= 18
              ? `Hold foliar pesticide/fungicide applications during peak wind gusts (${weatherData.summary.maxWindSpeedKmH} km/h) to prevent drift. Spray when wind drops below 12 km/h.`
              : `Favorable spray conditions with low wind speeds (${weatherData.summary.maxWindSpeedKmH} km/h). Safe for foliar applications during cool hours.`,
        }
      : undefined,
  };
}
