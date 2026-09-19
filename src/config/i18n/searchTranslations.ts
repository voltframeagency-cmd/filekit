// 39-Locale Dictionary for Tool Search & Hero Discovery (ToolHero.tsx)
import { SupportedLocale } from "./locales";

export interface SearchI18nEntry {
  quickJump: string;
  noToolsFound: string;
  searchAriaLabel: string;
  resultsAriaLabel: string;
}

export const SEARCH_I18N: Record<SupportedLocale, SearchI18nEntry> = {
  en: {
    quickJump: "Quick jump:",
    noToolsFound: "No tools found matching",
    searchAriaLabel: "Search tools",
    resultsAriaLabel: "Tool search results",
  },
  es: {
    quickJump: "Acceso rápido:",
    noToolsFound: "No se encontraron herramientas para",
    searchAriaLabel: "Buscar herramientas",
    resultsAriaLabel: "Resultados de búsqueda de herramientas",
  },
  "es-419": {
    quickJump: "Acceso rápido:",
    noToolsFound: "No se encontraron herramientas para",
    searchAriaLabel: "Buscar herramientas",
    resultsAriaLabel: "Resultados de búsqueda de herramientas",
  },
  de: {
    quickJump: "Schnellzugriff:",
    noToolsFound: "Keine Werkzeuge gefunden für",
    searchAriaLabel: "Werkzeuge durchsuchen",
    resultsAriaLabel: "Suchergebnisse für Werkzeuge",
  },
  fr: {
    quickJump: "Accès rapide :",
    noToolsFound: "Aucun outil trouvé correspondant à",
    searchAriaLabel: "Rechercher des outils",
    resultsAriaLabel: "Résultats de recherche d'outils",
  },
  pt: {
    quickJump: "Acesso rápido:",
    noToolsFound: "Nenhuma ferramenta encontrada para",
    searchAriaLabel: "Pesquisar ferramentas",
    resultsAriaLabel: "Resultados da pesquisa de ferramentas",
  },
  "pt-BR": {
    quickJump: "Acesso rápido:",
    noToolsFound: "Nenhuma ferramenta encontrada para",
    searchAriaLabel: "Pesquisar ferramentas",
    resultsAriaLabel: "Resultados da pesquisa de ferramentas",
  },
  it: {
    quickJump: "Accesso rapido:",
    noToolsFound: "Nessuno strumento trovato per",
    searchAriaLabel: "Cerca strumenti",
    resultsAriaLabel: "Risultati ricerca strumenti",
  },
  nl: {
    quickJump: "Snelle toegang:",
    noToolsFound: "Geen tools gevonden voor",
    searchAriaLabel: "Zoek tools",
    resultsAriaLabel: "Zoekresultaten voor tools",
  },
  ca: {
    quickJump: "Accés ràpid:",
    noToolsFound: "No s'han trobat eines per a",
    searchAriaLabel: "Cerca eines",
    resultsAriaLabel: "Resultats de cerca d'eines",
  },
  sv: {
    quickJump: "Snabbval:",
    noToolsFound: "Inga verktyg hittades för",
    searchAriaLabel: "Sök verktyg",
    resultsAriaLabel: "Sökresultat för verktyg",
  },
  da: {
    quickJump: "Hurtig adgang:",
    noToolsFound: "Ingen værktøjer fundet til",
    searchAriaLabel: "Søg værktøjer",
    resultsAriaLabel: "Søgeresultater for værktøjer",
  },
  fi: {
    quickJump: "Pikavalinta:",
    noToolsFound: "Työkaluja ei löytynyt haulla",
    searchAriaLabel: "Hae työkaluja",
    resultsAriaLabel: "Työkalujen hakutulokset",
  },
  no: {
    quickJump: "Snarveier:",
    noToolsFound: "Ingen verktøy funnet for",
    searchAriaLabel: "Søk verktøy",
    resultsAriaLabel: "Søkeresultater for verktøy",
  },
  pl: {
    quickJump: "Szybki dostęp:",
    noToolsFound: "Nie znaleziono narzędzi dla",
    searchAriaLabel: "Szukaj narzędzi",
    resultsAriaLabel: "Wyniki wyszukiwania narzędzi",
  },
  cs: {
    quickJump: "Rychlý skok:",
    noToolsFound: "Nebyly nalezeny žádné nástroje pro",
    searchAriaLabel: "Hledat nástroje",
    resultsAriaLabel: "Výsledky vyhledávání nástrojů",
  },
  hu: {
    quickJump: "Gyors ugrás:",
    noToolsFound: "Nincs találat a következőre:",
    searchAriaLabel: "Eszközök keresése",
    resultsAriaLabel: "Eszköz keresési eredmények",
  },
  ro: {
    quickJump: "Acces rapid:",
    noToolsFound: "Nu s-au găsit instrumente pentru",
    searchAriaLabel: "Căutare instrumente",
    resultsAriaLabel: "Rezultate căutare instrumente",
  },
  bg: {
    quickJump: "Бърз достъп:",
    noToolsFound: "Няма намерени инструменти за",
    searchAriaLabel: "Търсене на инструменти",
    resultsAriaLabel: "Резултати от търсенето на инструменти",
  },
  el: {
    quickJump: "Γρήγορη πρόσβαση:",
    noToolsFound: "Δεν βρέθηκαν εργαλεία για",
    searchAriaLabel: "Αναζήτηση εργαλείων",
    resultsAriaLabel: "Αποτελέσματα αναζήτησης εργαλείων",
  },
  sk: {
    quickJump: "Rýchly skok:",
    noToolsFound: "Nenašli sa žiadne nástroje pre",
    searchAriaLabel: "Hľadať nástroje",
    resultsAriaLabel: "Výsledky vyhľadávania nástrojov",
  },
  sl: {
    quickJump: "Hitri dostop:",
    noToolsFound: "Ni najdenih orodij za",
    searchAriaLabel: "Iskanje orodij",
    resultsAriaLabel: "Rezultati iskanja orodij",
  },
  ru: {
    quickJump: "Быстрый переход:",
    noToolsFound: "Инструменты не найдены по запросу",
    searchAriaLabel: "Поиск инструментов",
    resultsAriaLabel: "Результаты поиска инструментов",
  },
  uk: {
    quickJump: "Швидкий перехід:",
    noToolsFound: "Інструментів не знайдено для",
    searchAriaLabel: "Пошук інструментів",
    resultsAriaLabel: "Результати пошуку інструментів",
  },
  lv: {
    quickJump: "Ātrā piekļuve:",
    noToolsFound: "Nav atrasts neviens rīks vaicājumam",
    searchAriaLabel: "Meklēt rīkus",
    resultsAriaLabel: "Rīku meklēšanas rezultāti",
  },
  lt: {
    quickJump: "Greitoji prieiga:",
    noToolsFound: "Nerasta įrankių pagal užklausą",
    searchAriaLabel: "Ieškoti įrankių",
    resultsAriaLabel: "Įrankių paieškos rezultatai",
  },
  tr: {
    quickJump: "Hızlı geçiş:",
    noToolsFound: "Eşleşen araç bulunamadı:",
    searchAriaLabel: "Araçları ara",
    resultsAriaLabel: "Araç arama sonuçları",
  },
  ar: {
    quickJump: "وصول سريع:",
    noToolsFound: "لم يتم العثور على أدوات تطابق",
    searchAriaLabel: "البحث في الأدوات",
    resultsAriaLabel: "نتائج البحث عن الأدوات",
  },
  he: {
    quickJump: "גישה מהירה:",
    noToolsFound: "לא נמצאו כלים התואמים ל-",
    searchAriaLabel: "חיפוש כלים",
    resultsAriaLabel: "תוצאות חיפוש כלים",
  },
  hi: {
    quickJump: "त्वरित पहुँच:",
    noToolsFound: "कोई उपकरण नहीं मिला:",
    searchAriaLabel: "उपकरण खोजें",
    resultsAriaLabel: "उपकरण खोज परिणाम",
  },
  id: {
    quickJump: "Akses cepat:",
    noToolsFound: "Tidak ada alat yang cocok dengan",
    searchAriaLabel: "Cari alat",
    resultsAriaLabel: "Hasil pencarian alat",
  },
  ms: {
    quickJump: "Pantas capai:",
    noToolsFound: "Tiada alat ditemui untuk",
    searchAriaLabel: "Cari alat",
    resultsAriaLabel: "Keputusan carian alat",
  },
  th: {
    quickJump: "การเข้าถึงด่วน:",
    noToolsFound: "ไม่พบเครื่องมือที่ตรงกับ",
    searchAriaLabel: "ค้นหาเครื่องมือ",
    resultsAriaLabel: "ผลการค้นหาเครื่องมือ",
  },
  vi: {
    quickJump: "Truy cập nhanh:",
    noToolsFound: "Không tìm thấy công cụ nào phù hợp với",
    searchAriaLabel: "Tìm kiếm công cụ",
    resultsAriaLabel: "Kết quả tìm kiếm công cụ",
  },
  fil: {
    quickJump: "Mabilisang access:",
    noToolsFound: "Walang nahanap na mga tool para sa",
    searchAriaLabel: "Maghanap ng mga tool",
    resultsAriaLabel: "Mga resulta ng paghahanap ng tool",
  },
  ja: {
    quickJump: "クイックアクセス:",
    noToolsFound: "一致するツールが見つかりません:",
    searchAriaLabel: "ツールを検索",
    resultsAriaLabel: "ツール検索結果",
  },
  ko: {
    quickJump: "빠른 이동:",
    noToolsFound: "일치하는 도구를 찾을 수 없습니다:",
    searchAriaLabel: "도구 검색",
    resultsAriaLabel: "도구 검색 결과",
  },
  "zh-CN": {
    quickJump: "快速跳转:",
    noToolsFound: "未找到匹配的工具:",
    searchAriaLabel: "搜索工具",
    resultsAriaLabel: "工具搜索结果",
  },
  "zh-TW": {
    quickJump: "快速跳轉:",
    noToolsFound: "找不到相符的工具:",
    searchAriaLabel: "搜尋工具",
    resultsAriaLabel: "工具搜尋結果",
  },
};
