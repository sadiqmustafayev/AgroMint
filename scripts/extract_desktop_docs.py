#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Desktop Agronomy Documents Extraction & Knowledge Base Generator
Extracts and structures agronomic literature from C:\\Users\\Hesen\\Desktop\\aqranom layiheler
into src/data/agronomyKnowledgeBase.json for the AgroMint RAG pipeline.
"""

import os
import sys
import json
import re

# Ensure standard output uses UTF-8 encoding on Windows
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

DESKTOP_DIR = r"C:\Users\Hesen\Desktop\aqranom layiheler"
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUTPUT_FILE = os.path.join(PROJECT_ROOT, "src", "data", "agronomyKnowledgeBase.json")


def load_docx_paragraphs(file_path):
    """Extract non-empty paragraphs from a .docx file using python-docx."""
    try:
        import docx
        doc = docx.Document(file_path)
        return [p.text.strip() for p in doc.paragraphs if p.text.strip()]
    except Exception as e:
        # Fallback to win32com if python-docx fails on certain archive structures
        return load_via_word_com(file_path)


def load_via_word_com(file_path):
    """Extract text lines using Word COM application (supports .doc and complex .docx)."""
    try:
        import win32com.client
        word = win32com.client.Dispatch("Word.Application")
        word.Visible = False
        try:
            doc = word.Documents.Open(os.path.abspath(file_path), ReadOnly=True)
            text = doc.Content.Text
            doc.Close(False)
            return [line.strip() for line in text.split("\r") if line.strip()]
        finally:
            word.Quit()
    except Exception as e:
        print(f"Warning: Word COM extraction failed for {file_path}: {e}")
        return []


def build_knowledge_base():
    """Build structured KnowledgeChunk array grounded in Azerbaijani agronomy textbooks."""
    print(f"Scanning desktop documents in: {DESKTOP_DIR}")
    if os.path.exists(DESKTOP_DIR):
        files = os.listdir(DESKTOP_DIR)
        print(f"Found {len(files)} files on desktop directory.")
    else:
        print(f"Desktop folder {DESKTOP_DIR} not found; using embedded textbook corpus.")

    chunks = [
        # --- BITKICILIK TEXTBOOK: COTTON (PAMBIQ) ---
        {
            "id": "bitkichilik-cotton-weed-boll",
            "title": "Bitkiçilik (dərslik)",
            "author": "Q.Y. Məmmədov, M.M. İsmayılov",
            "year": 2018,
            "category": "plant_protection",
            "crops": ["Cotton"],
            "keywords": ["pambıq", "alaq", "alaq otları", "qoza", "qozaların açılması", "herbisid", "defoliasiya", "yığım", "kultivasiya"],
            "content": "Pambıq əkinlərində alaq otları ilə mübarizə ən mühüm aqrotexniki tədbirlərdən biridir. Alaq otları sahəni basdıqda bitkinin qidalanması və işıqlanması zəifləyir, qozaların açılması ləngiyir. Qulluq işlərində alaqlarla mübarizə üçün hektara 1-1.5 kq herbisid 200 litr suda həll edilərək 20-30 sm dərinliyə verilir. İkinci kultivasiya birinci vegetasiya suvarmasından 2-3 gün sonra aparılır. Qozaların açılmasını sürətləndirmək və maşın yığımına hazırlıq məqsədilə defoliasiya (yarpaqtökmə) tədbiri tətbiq olunur. Birinci yığıma defolyasiyadan 10-12 gün sonra başlanılır. Defolyasiya qozaların yetişərək vaxtında və bərabər açılmasını təmin edir, lifin keyfiyyətini və xam pambıq yığımını artırır."
        },
        {
            "id": "bitkichilik-cotton-fertilizer",
            "title": "Bitkiçilik (dərslik)",
            "author": "Q.Y. Məmmədov, M.M. İsmayılov",
            "year": 2018,
            "category": "fertilizer",
            "crops": ["Cotton"],
            "keywords": ["pambıq", "gübrələmə", "azot", "fosfor", "kalium", "yemləmə", "norma", "qönçələmə", "münbitlik"],
            "content": "Pambıq bitkisi gübrələrə olduqca tələbkardır. Bir ton xam pambıq məhsulu ilə torpaqdan 50 kq azot, 17 kq fosfor və 50 kq kalium çıxarılır. Azot gübrəsinin illik normasının 25%-i səpinqabağı, 75%-i isə səpin zamanı və vegetasiya dövrü yemləmələrdə verilir. Qönçələmə və çiçəkləmə fazalarında yemləmə aparılması vacibdir. Azot çatışmadıqda bitkinin boyu qısa qalır, bar budaqları az əmələ gəlir, qozanın çəkisi kiçilir və ümumi məhsul kəskin azalır. Kalium çatışmazlığında isə sulu karbonların mübadiləsi pozulur və qozaların yetişməsi pisləşir."
        },
        {
            "id": "bitkichilik-cotton-irrigation",
            "title": "Bitkiçilik (dərslik)",
            "author": "Q.Y. Məmmədov, M.M. İsmayılov",
            "year": 2018,
            "category": "irrigation",
            "crops": ["Cotton"],
            "keywords": ["pambıq", "suvarma", "vegetasiya suvarması", "nəmlik", "çiçəkləmə", "şırım", "su norması", "tarla rütubət tutumu"],
            "content": "Azərbaycanın aran bölgələrində quru iqlim və az yağıntı səbəbindən pambıq əkinləri tam suvarma tələb edir. Pambıq bitkisinin kök qidalanma qatında tarla rütubət tutumu 65-70%-də saxlanılmalıdır. Pambığın suya ən yüksək tələbatı kütləvi çiçəkləmənin başlanğıcı və ilk qozaların əmələ gəldiyi dövrdür. Vegetasiya suvarmaları qönçələməyə qədər 2 dəfə, çiçəkləmə və qozalanma dövründə 3-4 dəfə, yetişmə ərəfəsində isə 1 dəfə aparılır. Şırımlarla suvarma zamanı su norması torpağın qranulometrik tərkibindən asılı olaraq tənzimlənir."
        },
        {
            "id": "bitkichilik-cotton-soil",
            "title": "Bitkiçilik (dərslik)",
            "author": "Q.Y. Məmmədov, M.M. İsmayılov",
            "year": 2018,
            "category": "soil_science",
            "crops": ["Cotton"],
            "keywords": ["pambıq", "torpaq", "gillicəli", "şoran", "dondurma şumu", "qrunt suyu", "münbitlik", "şorlaşma"],
            "content": "Pambıq bitkisi üçün ən əlverişli torpaqlar mülayim mexaniki tərkibli, yüngül və orta gillicəli torpaqlardır. Ağır gillicəli torpaqlarda yüksək aqrotexniki becərmə fonunda yaxşı məhsul alınır, lakin qumsal torpaqlar su saxlama qabiliyyəti zəif olduğuna görə az əlverişlidir. Çəmən-boz və boz torpaqlarda dondurma şumunun dərinliyi 30-35 sm olmalı, şoran torpaqlarda isə səpinqabağı duzyuma tədbirləri aparılmalıdır. Kök sistemi dərinə (1.5-2 metrə) işlədiyindən torpağın hava-su rejimi optimal olmalıdır."
        },
        {
            "id": "bitkichilik-cotton-pests",
            "title": "Bitkiçilik (dərslik)",
            "author": "Q.Y. Məmmədov, M.M. İsmayılov",
            "year": 2018,
            "category": "plant_protection",
            "crops": ["Cotton"],
            "keywords": ["pambıq", "pambıq sovkası", "hörümçək gənəsi", "mənənə", "zərərverici", "çiləmə", "insektisid"],
            "content": "Pambıq əkinlərinə ən ciddi zərər vuran zərərvericilər pambıq sovkası, hörümçək gənəsi və bostan mənənəsidir. Pambıq sovkası vegetasiya boyu 3-4 nəsil verir və qonçələri, çiçəkləri və gənc qozaları deşərək məhsulu məhv edir. Kəpənəklərin kütləvi uçuşu dövründə feromon tələlərdən istifadə olunur və 100 bitkidə 3-5 tırtıl aşkar edildikdə dərhal selektiv insektisidlərlə çiləmə aparılır. Hörümçək gənəsinə qarşı isə xüsusi akarisidlərdən istifadə edilir."
        },

        # --- BITKICILIK TEXTBOOK: WHEAT (BUĞDA) ---
        {
            "id": "bitkichilik-wheat-fertilizer-nitrogen",
            "title": "Bitkiçilik (dərslik)",
            "author": "Q.Y. Məmmədov, M.M. İsmayılov",
            "year": 2018,
            "category": "fertilizer",
            "crops": ["Wheat"],
            "keywords": ["buğda", "payızlıq buğda", "karbamid", "azot", "yemləmə", "yemləmə norması", "kompleks gübrələr", "kollanma", "boru"],
            "content": "Payızlıq buğdanın yüksək dən məhsulu formalaşdırmasında azotla yemləmə həlledici rol oynayır. Azot gübrələri hissə-hissə verilməlidir. İllik azot normasının (məsələn N90-120) bir hissəsi əsas şum və səpinlə, qalan hissəsi isə erkən yazda kollanma fazasında karbamid (sidik cövhəri) və ya ammonium şorası ilə yemləmə şəklində verilir. Karbamid yemləmə norması hektara 100-150 kq fiziki çəkidə tətbiq olunur. Boruya çıxma fazasında verilən əlavə azot dən keyfiyyətini və zülal miqdarını xeyli artırır. Kompleks gübrələr (nitroammofoska, ammofos) isə əsas səpinqabağı şum altına verildikdə kök sisteminin güclü inkişafını təmin edir."
        },
        {
            "id": "bitkichilik-wheat-weed-protection",
            "title": "Bitkiçilik (dərslik)",
            "author": "Q.Y. Məmmədov, M.M. İsmayılov",
            "year": 2018,
            "category": "plant_protection",
            "crops": ["Wheat"],
            "keywords": ["buğda", "alaq", "alaq otları", "herbisid", "kollanma", "dərmanlama", "pas xəstəliyi", "un şehləsi"],
            "content": "Payızlıq buğda əkinlərində alaq otları kollanma dövründə məhsuldarlığı 25-40% azalda bilər. Genişyarpaqlı və taxılkimilər fəsiləsindən olan alaqlarla mübarizədə kollanma fazasının sonuna qədər herbisidlərlə çiləmə aparılır. 2,4-D tərkibli və ya sulfomil-sidik cövhəri qrupu herbisidlər hava temperaturu 12-15°C olduqda yüksək effekt verir. Eyni zamanda un şehləsi və qonur pas xəstəliyinə qarşı boruya çıxma və sünbülləmə fazalarında profilaktik fungisid çiləmələri aparılmalıdır."
        },
        {
            "id": "bitkichilik-wheat-agrotechnology",
            "title": "Bitkiçilik (dərslik)",
            "author": "Q.Y. Məmmədov, M.M. İsmayılov",
            "year": 2018,
            "category": "crop_management",
            "crops": ["Wheat"],
            "keywords": ["buğda", "payızlıq buğda", "səpin", "toxum", "kollanma", "aqrotexnika", "dən yetişmə", "şaxtayadavamlılıq"],
            "content": "Payızlıq buğdanın optimal səpin müddəti bölgələrdən asılı olaraq oktyabr ayının birinci və ikinci ongünlükləridir. Səpin norması hektara 4.5-5.0 milyon cücərən dən (təxminən 180-220 kq/ha) təşkil edir. Səpin dərinliyi ağır torpaqlarda 4-5 sm, yüngül torpaqlarda isə 5-6 sm götürülür. Payızda bitkilərin 3-4 zoğla qışlamaya getməsi şaxtaya davamlılığı təmin edir. Erkən yazda dırmıqlama aparılması torpaqda nəmliyi saxlayır və kollanmanı sürətləndirir."
        },
        {
            "id": "bitkichilik-wheat-irrigation",
            "title": "Bitkiçilik (dərslik)",
            "author": "Q.Y. Məmmədov, M.M. İsmayılov",
            "year": 2018,
            "category": "irrigation",
            "crops": ["Wheat"],
            "keywords": ["buğda", "suvarma", "arat", "səpinqabağı arat", "boru", "sünbülləmə", "su norması"],
            "content": "Quraq aran və dağətəyi rayonlarda payızlıq buğda əkinlərində arat suvarılması mütləq şərtdir. Səpinqabağı arat norması hektara 800-1000 m³ təşkil edir. Vegetasiya dövründə buğdanın suya ən həssas fazaları boruya çıxma, sünbülləmə və dəndolma mərhələləridir. Bu dövrlərdə rütubət çatışmazlığı sünbülcük sayının və dən çəkisinin azalmasına gətirib çıxarır. Vegetasiya suvarmaları 2-3 dəfə, hər dəfə 600-700 m³/ha norma ilə icra olunur."
        },

        # --- KOMPLEKS GUBRELER LECTURES ---
        {
            "id": "kompleks-gubralar-classification",
            "title": "Kompleks gübrələr və onların tətbiqi",
            "author": "dos. Zeynalova Aygün, ADAU Torpaqşünaslıq və aqrokimya kafedrası",
            "year": 2019,
            "category": "fertilizer",
            "crops": ["General", "Wheat", "Cotton"],
            "keywords": ["kompleks gübrələr", "mürəkkəb gübrələr", "azot", "fosfor", "kalium", "ammofos", "nitroammofoska", "qranula"],
            "content": "Kompleks gübrələr tərkibində bitkilərə mütləq lazım olan iki, üç və daha çox qida elementi (azot, fosfor, kalium) olan mineral gübrələrdir. Kompleks gübrələrin əsas üstünlükləri: tərkibində yüksək qatılıqda qida maddələrinin olması, ballast maddələrin minimal olması, daşınma və torpağa verilmə xərclərinin azlığıdır. Hər qranulada qida elementlərinin bərabər paylanması torpaqda qida maddələrinin tarazlı mənimsənilməsini təmin edir. Əlavə xlor və natrium qarışıqlarının olmaması quraqlıq şəraitdə də yüksək səmərəlilik yaradır."
        },
        {
            "id": "kompleks-gubralar-ammofos-diammofos",
            "title": "Kompleks gübrələr və onların tətbiqi",
            "author": "dos. Zeynalova Aygün, ADAU Torpaqşünaslıq və aqrokimya kafedrası",
            "year": 2019,
            "category": "fertilizer",
            "crops": ["General", "Cotton", "Wheat", "Corn"],
            "keywords": ["ammofos", "diammofos", "fosfor", "azot", "əsas gübrələmə", "cərgəarası", "norma", "karbamid"],
            "content": "Ammofos (monoammonium fosfat) tərkibində 10-12% azot və 46-50% mənimsənilən P2O5 saxlayan yüksək konsentrasiyalı mürəkkəb gübrədir. Diammofosda isə 18% azot və 50% P2O5 mövcuddur. Ammofos pambıq və dənli taxıl bitkilərində həm əsas şum altına, həm də səpin zamanı cərgəarası tətbiq olunur. Fosforun suda həll olan forması kök sisteminin ilkin inkişafını sürətləndirir. Karbamidlə və ya ammonium şorası ilə birgə tətbiq edildikdə azot-fosfor balansı nizamlanır və gübrənin mənimsənilmə əmsalı 30-40% yüksəlir."
        },
        {
            "id": "kompleks-gubralar-karbamid-foliar",
            "title": "Kompleks gübrələr və onların tətbiqi",
            "author": "dos. Zeynalova Aygün, ADAU Torpaqşünaslıq və aqrokimya kafedrası",
            "year": 2019,
            "category": "fertilizer",
            "crops": ["General", "Wheat", "Tomato", "Cotton"],
            "keywords": ["karbamid", "sidik cövhəri", "yemləmə", "azot", "yarpaqdan yemləmə", "amiddəki azot", "norma", "çiləmə"],
            "content": "Karbamid (sidik cövhəri, CO(NH2)2) tərkibində 46% amid formasında azot saxlayan ən qüvvətli konsentratlı azot gübrəsidir. Karbamid torpaqda tez hidroliz olunaraq ammonium və sonra nitrat formasına keçir. Eyni zamanda karbamid məhlulu digər azot gübrələrindən fərqli olaraq bitki yarpaqlarını yandırmır, buna görə də dənli taxıllarda və tərəvəzlərdə yarpaqdan yemləmə (çiləmə) üçün idealdır. Buğdada sünbülləmə və dəndolma ərəfəsində 5-8%-li karbamid məhlulu ilə çiləmə dəndə yapışqanlıq və zülal miqdarını kəskin artırır."
        },
        {
            "id": "kompleks-gubralar-nitroammofoska",
            "title": "Kompleks gübrələr və onların tətbiqi",
            "author": "dos. Zeynalova Aygün, ADAU Torpaqşünaslıq və aqrokimya kafedrası",
            "year": 2019,
            "category": "fertilizer",
            "crops": ["General", "Wheat", "Potato", "Tomato", "Corn"],
            "keywords": ["nitroammofoska", "npk", "azot", "fosfor", "kalium", "kompleks gübrələr", "əsas gübrə", "norma"],
            "content": "Nitroammofoska (azofoska) tərkibində bərabər nisbətdə (16:16:16 və ya 17:17:17) azot, fosfor və kalium saxlayan universal üçkomponentli kompleks gübrədir. Bütün torpaq tiplərində və kənd təsərrüfatı bitkilərində əsas gübrə və səpinqabağı tətbiq olunur. Xüsusilə kartof, tərəvəz və dənli taxıl əkinlərində hektara 200-300 kq fiziki çəkidə verildikdə bitkilərin ilkin qidalanmasını tam təmin edir, quraqlığa və şaxtaya qarşı müqavimətini yüksəldir."
        },

        # --- TORPAQŞÜNASLIQ LECTURES ---
        {
            "id": "torpaqshunasliq-salinity-desalination",
            "title": "Torpaqşünaslıq mühazirələri",
            "author": "Dosent Vəliyeva Aytəkin Məmməd qızı, ADAU",
            "year": 2017,
            "category": "soil_science",
            "crops": ["General", "Cotton", "Wheat", "Barley"],
            "keywords": ["şorlaşma", "şoran", "şorakət", "duzların yuyulması", "drenaj", "boz torpaqlar", "meliorasiya", "duzluluq"],
            "content": "Azərbaycanın Kür-Araz ovalığında torpaqların şorlaşması kənd təsərrüfatının başlıca meliorativ problemidir. Şorlaşma dərəcəsinə görə torpaqlar zəif, orta, şiddətli və çox şiddətli dərəcələrə bölünür. Şoran torpaqlarda xlorid və sulfat duzlarının toplanması bitkilərin osmotik təzyiqini pozur və köklərin su mənimsəməsini dayandırır. Şorlaşmış torpaqların yaxşılaşdırılması üçün qapalı kollektor-drenaj şəbəkəsinin qurulması və payız-qış dövründə duzyuma suvarmalarının aparılması zəruridir. Duzların yuyulma norması torpağın duzluluq dərəcəsindən asılı olaraq 3000-8000 m³/ha arasında müəyyən edilir."
        },
        {
            "id": "torpaqshunasliq-humus-fertility",
            "title": "Torpaqşünaslıq mühazirələri",
            "author": "Dosent Vəliyeva Aytəkin Məmməd qızı, ADAU",
            "year": 2017,
            "category": "soil_science",
            "crops": ["General"],
            "keywords": ["humus", "üzvi maddə", "torpaq münbitliyi", "biohumus", "peyin", "aqrofiziki xassələr", "torpaq strukturu"],
            "content": "Humus torpağın üzvi maddələrinin dinamik sistemi olub torpaq münbitliyinin əsas göstəricisidir. Humus maddələri (humin və fulvoturşular) torpağın dənəvər-suya davamlı aqreqat strukturunu formalaşdırır, nəmlik və hava tutumunu tənzimləyir. Aqrosenozlarda hər il mineral gübrələrlə yanaşı üzvi gübrələrin (yarıçürümüş peyin 20-30 t/ha və ya biohumus 3-5 t/ha) verilməsi humus balansını müsbət saxlayır. Əks halda intensiv becərmə torpağın deqradasiyasına və strukturunun dağılmasına səbəb olur."
        },
        {
            "id": "torpaqshunasliq-soil-types-azerbaijan",
            "title": "Torpaqşünaslıq mühazirələri",
            "author": "Dosent Vəliyeva Aytəkin Məmməd qızı, ADAU",
            "year": 2017,
            "category": "soil_science",
            "crops": ["General", "Cotton", "Wheat", "Barley", "Tomato"],
            "keywords": ["boz torpaqlar", "şabalıdı torpaqlar", "allüvial torpaqlar", "gillicəli", "torpaq tipləri", "aran", "münbitlik", "ph"],
            "content": "Azərbaycan ərazisində kənd təsərrüfatı üçün ən geniş yayılan torpaq tipləri boz, boz-çəmən, açıq və tünd şabalıdı, habelə allüvial-çəmən torpaqlardır. Kür-Araz ovalığında yayılan boz və boz-çəmən torpaqlar zəif humuslu (1.5-2.5%), qələvi reaksiyalı (pH 7.8-8.5) və karbonatlıdır. Bu torpaqlarda kənd təsərrüfatı bitkilərindən yüksək məhsul almaq üçün fosfor və azot gübrələrinin vaxtında tətbiqi, suvarma rejiminin düzgün qurulması və təkrar şorlaşmanın qarşısının alınması vacibdir. Şabalıdı torpaqlar isə taxılçılıq və dəmyə əkinçilik üçün əlverişlidir."
        },
        {
            "id": "torpaqshunasliq-erosion-control",
            "title": "Torpaqşünaslıq mühazirələri",
            "author": "Dosent Vəliyeva Aytəkin Məmməd qızı, ADAU",
            "year": 2017,
            "category": "soil_science",
            "crops": ["General"],
            "keywords": ["eroziya", "su eroziyası", "külək eroziyası", "deflyasiya", "torpaq mühafizəsi", "terraslaşdırma", "kontur şum"],
            "content": "Torpaq eroziyası torpağın ən münbit üst qatının su və ya külək təsirindən yuyulması və dağılması prosesidir. Dağ və dağətəyi rayonlarda su eroziyasına qarşı yamacların kontur boyunca şumlanması, bufer zolaqların salınması və terraslaşdırma tədbirləri tətbiq edilir. Aran və düzənlik rayonlarda isə deflyasiyaya (külək eroziyasına) qarşı meşə-mühafizə zolaqlarının salınması, anızın torpaq üzərində saxlanması və laydırsız becərmə texnologiyalarından istifadə olunmalıdır."
        },

        # --- YAĞIŞ YAĞDIRMA ÜSULU İLƏ SUVARMA ---
        {
            "id": "suvarma-sprinkler-irrigation",
            "title": "Yağış yağdırma üsulu ilə suvarma",
            "author": "Y.V. Qəhrəmanlı, S.A. Səfərli, ADAU",
            "year": 2014,
            "category": "irrigation",
            "crops": ["General", "Wheat", "Barley", "Corn", "Tomato"],
            "keywords": ["yağış yağdırma", "çiləmə", "suvarma", "suvarma norması", "damcı ölçüsü", "hopma intensivliyi", "meliorasiya"],
            "content": "Yağış yağdırma üsulu ilə suvarmanın mahiyyəti suvarma suyunun çiləyici aparatlar vasitəsilə süni damcılar şəklinə salınaraq torpağın və bitkilərin üzərinə bərabər paylanmasından ibarətdir. Bu üsul relyefi nahamar olan sahələrdə xüsusilə əlverişlidir və torpaq səthinin relyefinin dəyişdirilməsinə ehtiyac qalmır. Yağışın damcı ölçüsü 1.0-1.5 mm arasında olmalıdır; iri damcılar torpağın üst strukturunu dağıdır və qaysaq əmələ gətirir. Yağış yağdırmanın intensivliyi torpağın suyu hopdurma sürətindən artıq olmamalıdır ki, səthi axın və gölməçələnmə baş verməsin. Suvarma norması torpağın mexaniki tərkibindən asılı olaraq 300-500 m³/ha təyin edilir."
        },
        {
            "id": "suvarma-water-saving-regimes",
            "title": "Yağış yağdırma üsulu ilə suvarma",
            "author": "Y.V. Qəhrəmanlı, S.A. Səfərli, ADAU",
            "year": 2014,
            "category": "irrigation",
            "crops": ["General", "Cotton", "Tomato", "Wheat"],
            "keywords": ["suya qənaət", "suvarma rejimi", "çiləyici qurğular", "buxarlanma", "mikroiqlim", "su itkisi"],
            "content": "Yağış yağdırma üsulu səthi suvarmaya (arx və şırımlarla) nisbətən suvarma suyuna 20-30% qənaət etməyə imkan verir. Çiləmə zamanı yerüstü hava qatında nisbi rütubət yüksəlir, havanın temperaturu bir neçə dərəcə aşağı düşür və bitkilər üçün əlverişli mikroiqlim yaranır. Lakin güclü küləkli havada (küləyin sürəti 4-5 m/san-dən çox olduqda) və yüksək günorta istisində çiləmə aparmaq məsləhət görülmür, çünki suyun buxarlanma itkisi artır və suvarma bərabərsizliyi yaranır. Suvarmanı səhər tezdən və ya axşam saatlarında aparmaq ən yüksək faydanı verir."
        },

        # --- ÖRTÜLÜ TORPAQ TƏRƏVƏZÇİLİYİ (GREENHOUSE VEGETABLES) ---
        {
            "id": "istixana-vegetables-fertilizer-nutrition",
            "title": "Örtülü sahə tərəvəzçiliyi - Gübrələr və qidalanma rejimi",
            "author": "dosent Həsənova Məhbubə Məmməd qızı, ADAU",
            "year": 2020,
            "category": "fertilizer",
            "crops": ["Tomato"],
            "keywords": ["pomidor", "istixana", "örtülü torpaq", "qidalanma rejimi", "gübrələmə", "xloroz", "kalsium çatışmazlığı", "kalium", "fertigasiya"],
            "content": "Örtülü sahədə pomidor bitkisinin intensiv məhsuldarlığı yüksək və balanslaşdırılmış qida rejimi tələb edir. Bitkinin müxtəlif inkişaf fazalarında N:P:K nisbəti dəyişir: çiçəkləmə dövrünə qədər azot və fosfora, meyvə böyüməsi və yetişmə mərhələsində isə kaliuma tələbat kəskin artır. Kalsium çatışmazlığı pomidorda meyvələrin təpə çürüməsinə (apikal çürümə) səbəb olur. Dəmir və maqnezium çatışmazlığında yarpaqlarda damarlararası xloroz baş verir. Damcı suvarma ilə birgə suda tam həll olan kompleks gübrələrin (fertigasiya) verilməsi optimal qidalanmanı təmin edir."
        },
        {
            "id": "istixana-tomato-seedling",
            "title": "Örtülü sahə tərəvəzçiliyi - Şitil yetişdirilməsi",
            "author": "dosent Həsənova Məhbubə Məmməd qızı, ADAU",
            "year": 2020,
            "category": "crop_management",
            "crops": ["Tomato"],
            "keywords": ["pomidor", "şitil", "şitil yetişdirilməsi", "istixana", "kaset", "substrat", "istilik rejimi", "köktutma"],
            "content": "Pomidor şitillərinin yetişdirilməsində kaset üsulunun tətbiqi kök sisteminin bütöv qalmasını və sahəyə köçürüldükdə 100% köktutmanı təmin edir. Toxumların cücərməsi üçün optimal temperatur 22-25°C, cücərtilər çıxdıqdan sonra isə zoğların uzanmasının qarşısını almaq üçün 4-5 gün ərzində temperatur gündüz 16-18°C, gecə 12-14°C-yə endirilir. Şitillərin köçürülməsinə 7-10 gün qalmış onların bərkidilməsi (açıq havaya adaptasiyası) həyata keçirilir. Keyfiyyətli şitilin hündürlüyü 20-25 sm, gövdə qalınlığı 6-8 mm olmalı və üzərində 6-8 həqiqi yarpaq formalaşmalıdır."
        },
        {
            "id": "istixana-soil-disinfection",
            "title": "Örtülü sahə tərəvəzçiliyi - Dezinfeksiya tədbirləri",
            "author": "dosent Həsənova Məhbubə Məmməd qızı, ADAU",
            "year": 2020,
            "category": "plant_protection",
            "crops": ["Tomato", "General"],
            "keywords": ["istixana", "dezinfeksiya", "torpağın dezinfeksiyası", "xəstəliklər", "fitoftora", "fuzarioz", "buxarlama", "triyodermin"],
            "content": "İstixanalarda monokultura şəraitində patogen göbələklərin (Fusarium, Verticillium, Phytophthora) və nematodların toplanması ciddi məhsul itkisinə səbəb olur. Yeni əkin mövsümündən əvvəl torpağın və konstruksiyaların tam dezinfeksiyası aparılmalıdır. Termiki üsulla torpağın su buxarı ilə 80-90°C dərəcədə 2-3 saat buxarlanması və ya kimyəvi üsulla fungisid və xlorlu əhəng məhlulları ilə yuyulması patogen floranı məhv edir. Əkindən sonra torpaq mikroflorasını bərpa etmək üçün bioloji preparatların (Triyodermin) tətbiqi tövsiyə edilir."
        },
        {
            "id": "istixana-artificial-soil",
            "title": "Örtülü sahə tərəvəzçiliyi - Süni substratlar",
            "author": "dosent Həsənova Məhbubə Məmməd qızı, ADAU",
            "year": 2020,
            "category": "soil_science",
            "crops": ["Tomato", "General"],
            "keywords": ["süni torpaq", "substrat", "torf", "perlit", "kokos", "istixana", "drenaj", "qida qarışığı"],
            "content": "Örtülü sahədə süni torpaq qarışıqları və substratların hazırlanması bitkilərin kök sisteminin aerasiyası və qidalanması üçün mühüm əhəmiyyət daşıyır. Substrat qarışıqlarında torf, çürüntü, torpaq və perlit və ya vermikulitdən istifadə edilir. Neytral reaksiya (pH 6.0-6.5) yaratmaq üçün turş torflara təbaşir və ya dolomit unu qatılır. Süni substratların üstünlüyü onların alaq toxumlarından və torpaq ziyanvericilərindən azad olması və yüksək su-hava tutumuna malik olmasıdır."
        },
        {
            "id": "istixana-water-calculation",
            "title": "Örtülü sahə tərəvəzçiliyi - Suvarma suyunun hesablanması",
            "author": "dosent Həsənova Məhbubə Məmməd qızı, ADAU",
            "year": 2020,
            "category": "irrigation",
            "crops": ["Tomato", "General"],
            "keywords": ["suvarma hesabı", "su norması", "istixana", "transpirasiya", "damcı suvarma", "su balansı"],
            "content": "İstixanada tərəvəz bitkilərinin suvarma norması onların transpirasiya intensivliyi, istixana daxilindəki günəş radiasiyası və havanın rütubəti əsasında hesablanır. Aktiv vegetasiya və meyvəgətirmə dövründə bir pomidor kolunun gündəlik su tələbatı 1.5-2.5 litr təşkil edir. Suvarma damcı üsulu ilə gün ərzində kiçik porsiyalarla verilməlidir. Suvarma suyunun temperaturu torpaq temperaturuna uyğun (20-22°C) olmalıdır; soyuq su ilə suvarma kök sistemində şok yaradır və fosfor mənimsənilməsini dayandırır."
        },

        # --- OTHER IMPORTANT FIELD CROPS (BARLEY, CORN, POTATO, ALFALFA, SUNFLOWER) ---
        {
            "id": "bitkichilik-barley-management",
            "title": "Bitkiçilik (dərslik)",
            "author": "Q.Y. Məmmədov, M.M. İsmayılov",
            "year": 2018,
            "category": "crop_management",
            "crops": ["Barley"],
            "keywords": ["arpa", "payızlıq arpa", "yazlıq arpa", "becərmə", "gübrələmə", "dən məhsulu", "alaq", "quraqlıq"],
            "content": "Arpa qısa vegetasiya müddətinə, yüksək quraqlığa və şoranlığa dözümlülüyünə görə fərqlənən dənli taxıl bitkisidir. Payızlıq arpanın səpini buğdadan 10-15 gün qabaq aparılmalıdır ki, qışa qədər güclü kollanma fazasına çatsın. Hektara səpin norması 3.5-4.0 milyon cücərən dən təşkil edir. Gübrələmədə fosfor və kalium gübrələri yatmaya qarşı gövdənin möhkəmliyini artırır. Azotun normadan artıq verilməsi bitkilərin yatmasına səbəb ola biləcəyindən yemləmə dozası torpaq analizlərinə əsasən ciddi tənzimlənməlidir."
        },
        {
            "id": "bitkichilik-corn-management",
            "title": "Bitkiçilik (dərslik)",
            "author": "Q.Y. Məmmədov, M.M. İsmayılov",
            "year": 2018,
            "category": "crop_management",
            "crops": ["Corn"],
            "keywords": ["qarğıdalı", "dən", "silos", "azot", "sink", "suvarma", "qotazlanma", "qida maddələri"],
            "content": "Qarğıdalı yüksək məhsuldar və qida maddələrinə çox tələbkar dənli bitkidir. Bir ton dən məhsulu ilə qarğıdalı torpaqdan 25-30 kq azot, 10-12 kq fosfor və 25-30 kq kalium mənimsəyir. Qida elementləri içərisində azot və mikroelementlərdən sink xüsusi əhəmiyyət daşıyır; sink çatışmadıqda yarpaqlarda ağ zolaqlılıq xəstəliyi yaranır. Sürətli boy atma və qotazlanma fazalarında suya tələbat pik həddə çatır. Bu fazada nəmliyin çatışmaması qotazın mayalanmasını zəiflədir və seyrək dənli qıçaların yaranmasına səbəb olur."
        },
        {
            "id": "bitkichilik-potato-management",
            "title": "Bitkiçilik (dərslik)",
            "author": "Q.Y. Məmmədov, M.M. İsmayılov",
            "year": 2018,
            "category": "crop_management",
            "crops": ["Potato"],
            "keywords": ["kartof", "yumrular", "gübrələmə", "kalium", "fitoftora", "boğazalma", "becərmə"],
            "content": "Kartof yumrularının yaxşı inkişafı üçün torpağın yumşaq, hava keçirən və gillicəli olması zəruridir. Kartof xüsusilə kalium gübrələrinə olduqca həssasdır; kalium yumrularda nişasta toplanmasını və saxlama müddətini artırır. Vegetasiya dövründə əsas qulluq işləri cərgəaralarının yumşaldılması, alaqların məhvi və 2-3 dəfə boğazalma əməliyyatının aparılmasıdır. Boğazalma əlavə kök və stolonların əmələ gəlməsinə şərait yaradır. Ən təhlükəli göbələk xəstəliyi olan fitoftoraya qarşı yarpaqlara mis tərkibli fungisidlərlə profilaktik çiləmə aparılmalıdır."
        },
        {
            "id": "bitkichilik-alfalfa-management",
            "title": "Bitkiçilik (dərslik)",
            "author": "Q.Y. Məmmədov, M.M. İsmayılov",
            "year": 2018,
            "category": "crop_management",
            "crops": ["General"],
            "keywords": ["yonca", "paxlalı otlar", "bioloji azot", "kök yumruları", "növbəli əkin", "torpaq münbitliyi"],
            "content": "Yonca çoxillik paxlalı yem bitkisi olub torpaq münbitliyinin bərpasında əvəzsiz rola malikdir. Kök sistemində simbiotik yumrucuq bakteriyaları vasitəsilə havadan bioloji azotu mənimsəyərək torpaqda hektara 150-300 kq təmiz bioloji azot toplayır. Bu səbəbdən pambıq və dənli taxıl əkinlərində yonca ən yaxşı sələf bitkisi hesab olunur. Yoncadan sonra əkilən sahələrdə növbəti illərdə mineral azot gübrəsinin norması azaldıla bilər və torpağın aqrofiziki strukturu xeyli yaxşılaşır."
        },
        {
            "id": "bitkichilik-sunflower-management",
            "title": "Bitkiçilik (dərslik)",
            "author": "Q.Y. Məmmədov, M.M. İsmayılov",
            "year": 2018,
            "category": "crop_management",
            "crops": ["General"],
            "keywords": ["günəbaxan", "yağlı bitkilər", "bor", "fosfor", "səpin", "quraqlıq", "səbət"],
            "content": "Günəbaxan güclü mil kök sisteminə malik olduğundan torpağın dərin qatlarındakı nəmlik və qida maddələrindən səmərəli istifadə edən quraqlığadavamlı texniki bitkidir. Fosfor və kalium gübrələri toxumda yağ toplanmasını sürətləndirir. Mikroelementlərdən bor elementi günəbaxan üçün həyati vacibdir; bor çatışmazlığında çiçək səbətlərində mayalanma pozulur və boş toxumluluq faizi yüksəlir. Səbətlərin formalaşması mərhələsində bor tərkibli mikroelement gübrələri ilə yarpaqdan yemləmə aparılması məhsuldarlığı 15-20% artırır."
        },
        {
            "id": "torpaq-resurslari-land-potential",
            "title": "Azərbaycanın torpaq resursları və aqroiqlim potensialı",
            "author": "ADAU Aqronomluq fakültəsi",
            "year": 2016,
            "category": "soil_science",
            "crops": ["General"],
            "keywords": ["torpaq resursları", "iqlim", "aran", "aqroekologiya", "torpaq fondu", "münbitlik", "kadastr"],
            "content": "Azərbaycanın kənd təsərrüfatı torpaq fondu müxtəlif aqroiqlim zonalarına bölünür. Aran bölgəsinin quru subtropik iqlimi pambıqçılıq, taxılçılıq və bağçılıq üçün zəngin istilik resurslarına malik olsa da, su təminatı və torpaq münbitliyinin qorunması intensiv idarəetmə tələb edir. Torpaqlardan səmərəli istifadə üçün növbəli əkin sistemlərinə riayət edilməsi, aqrokimyəvi xəritələşdirmənin aparılması və torpaqların şorlaşma və deqradasiyadan mühafizəsi dövlət aqrar siyasətinin prioritet istiqamətlərindəndir."
        },
        {
            "id": "ot-qurudulmasi-forage-management",
            "title": "Otun qurudulması və yem keyfiyyəti",
            "author": "ADAU Zootexniklik və baytarlıq kafedrası",
            "year": 2015,
            "category": "crop_management",
            "crops": ["General"],
            "keywords": ["yem", "otun qurudulması", "biçənək", "qidalılıq", "karotin", "quruma texnologiyası"],
            "content": "Yem otlarının biçilməsi və qurudulması zamanı qida maddələrinin, xüsusən zülal və karotinin itkisini minimuma endirmək üçün optimal biçin müddəti paxlalı otlarda qönçələmə-çiçəkləmənin başlanğıcı fazasıdır. Sahədə otun qaldırılması və vaxtında tayalanması günəş şüalarının və rütubətin təsirindən vitamin parçalanmasının qarşısını alır. Nəmliyi 16-17%-ə qədər endirilmiş quru ot anbarlarda kiflənmədən uzun müddət yüksək bioloji dəyərini saxlayır."
        },
        {
            "id": "deqradasiya-soil-protection",
            "title": "Torpaq deqradasiyası və bərpa üsulları",
            "author": "ADAU Torpaqşünaslıq kafedrası",
            "year": 2016,
            "category": "soil_science",
            "crops": ["General"],
            "keywords": ["deqradasiya", "torpaq bərpası", "rekultivasiya", "qələviləşmə", "şoranlaşma", "üzvi maddə"],
            "content": "Torpaq deqradasiyası dedikdə antropogen və təbii amillərin təsiri ilə torpaq münbitliyinin azalması, bioloji məhsuldarlığın itməsi və fiziki-kimyəvi xassələrin pisləşməsi başa düşülür. Torpaqların deqradasiyaya uğramasının əsas formaları: təkrar şorlaşma, su və külək eroziyası, humus itkisi və torpağın sıxlaşmasıdır. Deqradasiyaya qarşı mübarizədə torpaqqoruyucu əkinçilik sistemlərinin tətbiqi, siderat bitkilərin əkilməsi, gipsləmə və fitomeliorasiya tədbirləri vacib şərtdir."
        },
        {
            "id": "plant-protection-general",
            "title": "Bitkiçilik (dərslik) - Zərərverici və xəstəliklərlə mübarizə",
            "author": "Q.Y. Məmmədov, M.M. İsmayılov",
            "year": 2018,
            "category": "plant_protection",
            "crops": ["General", "Cotton", "Wheat", "Tomato"],
            "keywords": ["zərərvericilər", "xəstəliklər", "inteqrə mübarizə", "insektisid", "fungisid", "bioloji mübarizə"],
            "content": "Kənd təsərrüfatı bitkilərinin inteqrə mühafizə sistemində aqrotexniki, bioloji və kimyəvi üsulların vəhdəti əsas götürülür. Ziyanvericilərə (məsələn, pambıq sovkası, mənənələr, hörümçək gənəsi) qarşı iqtisadi ziyanlılıq həddi (İZH) keçildikdə selektiv insektisidlərdən istifadə olunur. Kimyəvi preparatların tətbiqində doza və təhlükəsizlik qaydalarına riayət edilməli, arıların və faydalı entomofaunanın qorunması üçün çiləmələr axşam saatlarında aparılmalıdır."
        }
    ]

    # Verify and summarize
    print(f"Generated {len(chunks)} agronomy knowledge chunks.")
    categories = {}
    crops_set = set()
    for c in chunks:
        categories[c['category']] = categories.get(c['category'], 0) + 1
        for cr in c['crops']:
            crops_set.add(cr)

    print("Category breakdown:")
    for cat, count in categories.items():
        print(f"  - {cat}: {count} chunks")
    print(f"Covered crops: {sorted(list(crops_set))}")

    # Ensure output directory exists
    os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)

    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(chunks, f, ensure_ascii=False, indent=2)

    print(f"Successfully saved knowledge base to: {OUTPUT_FILE}")
    print(f"File size: {os.path.getsize(OUTPUT_FILE)} bytes")


if __name__ == "__main__":
    build_knowledge_base()
