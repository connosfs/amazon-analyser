// Amazon Spending Analysis / Ausgaben-Analyse – i18n (Internationalization)
// EN: Translation system – all UI strings in German and English, locale-aware formatting
// DE: Übersetzungssystem – alle UI-Texte auf Deutsch und Englisch, locale-abhängige Formatierung
// Supported: de (German), en (English)

var LANG = localStorage.getItem('amz-lang') || ((navigator.language || '').startsWith('en') ? 'en' : 'de');

var I18N = {
  de: {
    // App
    appTitle: 'Amazon Ausgaben',
    analysis: 'Ausgaben-Analyse',
    exportedOn: 'Exportiert am',

    // Nav
    dashboard: 'Dashboard',
    orders: 'Bestellungen',
    import: '+ Import',
    all: 'Alle',

    // Sub-nav
    overview: '\uD83D\uDCCA \u00DCbersicht',
    topSpending: '\uD83C\uDFC6 Top-Ausgaben',

    // KPIs
    spending: 'Ausgaben',
    orderCount: 'Bestellungen',
    articles: 'Artikel',
    avgPerMonth: '\u00D8 / Monat',

    // Charts
    categories: 'Kategorien',
    monthlySpending: 'Monatliche Ausgaben',
    yearlySpending: 'J\u00E4hrliche Ausgaben',
    total: 'GESAMT',
    avg: '\u00D8',

    // Top
    topSpendingItems: 'Top-Ausgaben (Einzelartikel)',

    // Recent
    recentOrders: 'Letzte Bestellungen',
    allArrow: 'Alle \u2192',

    // Orders
    search: '\uD83D\uDD0D Suchen...',
    clearFilters: '\u2715 Alle Filter entfernen',
    filtered: 'gefiltert',
    multiSelect: 'Mehrfachauswahl',
    selected: 'ausgew\u00E4hlt',
    assignTo: 'Zuordnen zu',
    deselectAll: 'Auswahl aufheben',
    selectAllSingle: 'Alle 1-Artikel-Bestellungen',
    orderNr: 'Bestellnr.',
    article: 'Artikel',
    category: 'Kategorie',
    price: 'Preis',
    date: 'Datum',
    amount: 'Betrag',
    share: 'Anteil',
    totalSum: 'Gesamt',
    month: 'Monat',
    year: 'Jahr',
    rank: '#',

    // Months
    months: ['Jan','Feb','M\u00E4r','Apr','Mai','Jun','Jul','Aug','Sep','Okt','Nov','Dez'],

    // Import
    csvImport: 'CSV Importieren',
    csvFormat: 'Format: Datum;Bestellnummer;Artikel;Preis;Menge',
    csvPaste: 'Oder CSV hier einfügen...',
    importBtn: 'Importieren',
    back: 'Zur\u00FCck',
    duplicatesAuto: 'Duplikate werden automatisch erkannt.',
    restoreBackup: 'Backup wiederherstellen',
    restoreDesc: 'JSON-Backup laden (inkl. Kategorie-Korrekturen und eigene Keyword-Regeln):',
    loadBackupFile: '\uD83D\uDCC2 Backup-Datei laden (.json)',
    dataManage: 'Daten verwalten',
    deleteBtn: '\uD83D\uDDD1 L\u00F6schen',
    backupBtn: '\uD83D\uDCBE Backup erstellen',
    deleteConfirm: 'Alle Daten l\u00F6schen?',

    // Keywords
    kwTitle: 'Kategorisierungsregeln',
    kwDesc: 'Lade die komplette Keyword-Liste herunter, bearbeite sie in Excel (Keyword verschieben, Gewichtung \u00E4ndern, neue hinzuf\u00FCgen) und lade sie wieder hoch. Deine \u00C4nderungen werden gespeichert und \u00FCberleben Browser-Neustarts.',
    kwDownload: 'Keywords herunterladen (CSV)',
    kwUpload: 'Keywords hochladen',
    kwReset: 'Auf Standard zur\u00FCcksetzen',
    kwWeight: 'Gewichtung',
    kwSource: 'Quelle',
    kwUser: 'Benutzer',
    kwBuiltin: 'Standard',
    kwUserRules: 'eigene Regeln',
    kwFormat: 'CSV-Format: Keyword;Kategorie;Gewichtung;Quelle \u2014 Spalte "Quelle" ist optional, nur "Keyword", "Kategorie" und "Gewichtung" werden beim Upload ausgewertet.',
    kwParseError: 'Die Keyword-Datei konnte nicht gelesen werden. Bitte pr\u00FCfe das Format.',
    kwImportSuccess: '{count} eigene Keyword-Regeln geladen. Alle Artikel wurden neu kategorisiert.',
    kwResetConfirm: 'Alle eigenen Keyword-\u00C4nderungen l\u00F6schen und auf Standardregeln zur\u00FCcksetzen?',

    // Empty state
    emptyTitle: 'Ausgaben-Analyse',
    emptyDesc: 'Importiere deine Amazon-Bestellungen als CSV um loszulegen.',

    // Delete year
    deleteYearBtn: '\uD83D\uDDD1 Daten f\u00FCr {year} l\u00F6schen',
    deleteYearConfirm: 'Alle Daten f\u00FCr {year} unwiderruflich l\u00F6schen?',

    // Export
    excel: '\uD83D\uDCCA Excel',
    pdf: '\uD83D\uDCC4 PDF',

    // Alerts
    csvError: 'CSV konnte nicht geparst werden.',
    importSuccess: '\u2705 {count} neue Bestellungen importiert ({total} gesamt)',
    backupRestored: '\u2705 Backup wiederhergestellt: {count} Bestellungen geladen.',
    backupInvalid: 'Keine g\u00FCltigen Bestellungen in der Datei gefunden.',
    backupFormatError: 'Ung\u00FCltiges Backup-Format.',
    backupReadError: 'Fehler beim Lesen der Backup-Datei: ',

    // Metrics
    metrics: 'Kennzahlen',
    totalSpending: 'Gesamtausgaben',

    // Categories (labels)
    catLabels: {
      elektronik:'Elektronik',haus_garten:'Haus & Garten',kleidung:'Kleidung',gesundheit:'Gesundheit',
      medien:'Medien',kinder:'Kinder',werkzeug:'Werkzeug',koerperpflege:'K\u00F6rperpflege',
      sport_outdoor:'Sport & Outdoor',lebensmittel:'Lebensmittel',tickets:'Tickets',
      auto_motorrad:'Auto & Motorrad',buero:'B\u00FCro & Schreibwaren',haustier:'Haustier',
      abo_digital:'Abo & Digital',kueche:'K\u00FCche & Haushalt',geschenke:'Geschenke & Gutscheine',
      sonstiges:'Sonstiges'
    }
  },

  en: {
    appTitle: 'Amazon Spending',
    analysis: 'Spending Analysis',
    exportedOn: 'Exported on',

    dashboard: 'Dashboard',
    orders: 'Orders',
    import: '+ Import',
    all: 'All',

    overview: '\uD83D\uDCCA Overview',
    topSpending: '\uD83C\uDFC6 Top Spending',

    spending: 'Spending',
    orderCount: 'Orders',
    articles: 'Items',
    avgPerMonth: '\u00D8 / Month',

    categories: 'Categories',
    monthlySpending: 'Monthly Spending',
    yearlySpending: 'Yearly Spending',
    total: 'TOTAL',
    avg: '\u00D8',

    topSpendingItems: 'Top Spending (Individual Items)',

    recentOrders: 'Recent Orders',
    allArrow: 'All \u2192',

    search: '\uD83D\uDD0D Search...',
    clearFilters: '\u2715 Clear all filters',
    filtered: 'filtered',
    multiSelect: 'Multi-select',
    selected: 'selected',
    assignTo: 'Assign to',
    deselectAll: 'Deselect all',
    selectAllSingle: 'All single-item orders',
    orderNr: 'Order No.',
    article: 'Item',
    category: 'Category',
    price: 'Price',
    date: 'Date',
    amount: 'Amount',
    share: 'Share',
    totalSum: 'Total',
    month: 'Month',
    year: 'Year',
    rank: '#',

    months: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],

    csvImport: 'CSV Import',
    csvFormat: 'Format: Date;OrderNumber;Item;Price;Quantity',
    csvPaste: 'Or paste CSV here...',
    importBtn: 'Import',
    back: 'Back',
    duplicatesAuto: 'Duplicates are detected automatically.',
    restoreBackup: 'Restore Backup',
    restoreDesc: 'Load JSON backup (including category corrections and custom keyword rules):',
    loadBackupFile: '\uD83D\uDCC2 Load backup file (.json)',
    dataManage: 'Manage Data',
    deleteBtn: '\uD83D\uDDD1 Delete',
    backupBtn: '\uD83D\uDCBE Create Backup',
    deleteConfirm: 'Delete all data?',

    // Keywords
    kwTitle: 'Categorization Rules',
    kwDesc: 'Download the full keyword list, edit it in Excel (move keywords between categories, change weights, add new ones) and upload it back. Your changes are saved and persist across browser restarts.',
    kwDownload: 'Download Keywords (CSV)',
    kwUpload: 'Upload Keywords',
    kwReset: 'Reset to Defaults',
    kwWeight: 'Weight',
    kwSource: 'Source',
    kwUser: 'User',
    kwBuiltin: 'Built-in',
    kwUserRules: 'custom rules',
    kwFormat: 'CSV format: Keyword;Category;Weight;Source \u2014 The "Source" column is optional, only "Keyword", "Category" and "Weight" are used on upload.',
    kwParseError: 'Could not read the keyword file. Please check the format.',
    kwImportSuccess: '{count} custom keyword rules loaded. All items have been re-categorized.',
    kwResetConfirm: 'Delete all custom keyword changes and reset to default rules?',

    emptyTitle: 'Spending Analysis',
    emptyDesc: 'Import your Amazon orders as CSV to get started.',

    deleteYearBtn: '\uD83D\uDDD1 Delete data for {year}',
    deleteYearConfirm: 'Permanently delete all data for {year}?',

    excel: '\uD83D\uDCCA Excel',
    pdf: '\uD83D\uDCC4 PDF',

    csvError: 'Could not parse CSV.',
    importSuccess: '\u2705 {count} new orders imported ({total} total)',
    backupRestored: '\u2705 Backup restored: {count} orders loaded.',
    backupInvalid: 'No valid orders found in the file.',
    backupFormatError: 'Invalid backup format.',
    backupReadError: 'Error reading backup file: ',

    metrics: 'Key Metrics',
    totalSpending: 'Total Spending',

    catLabels: {
      elektronik:'Electronics',haus_garten:'Home & Garden',kleidung:'Clothing',gesundheit:'Health',
      medien:'Media',kinder:'Kids',werkzeug:'Tools',koerperpflege:'Personal Care',
      sport_outdoor:'Sports & Outdoor',lebensmittel:'Groceries',tickets:'Tickets',
      auto_motorrad:'Auto & Motorcycle',buero:'Office Supplies',haustier:'Pets',
      abo_digital:'Subscriptions & Digital',kueche:'Kitchen & Household',geschenke:'Gifts & Vouchers',
      sonstiges:'Other'
    }
  }
};

function t(key) {
  return (I18N[LANG] && I18N[LANG][key]) || (I18N.de[key]) || key;
}

function tReplace(key, replacements) {
  var str = t(key);
  for (var k in replacements) {
    str = str.replace('{' + k + '}', replacements[k]);
  }
  return str;
}

function catLabel(key) {
  var labels = I18N[LANG] && I18N[LANG].catLabels;
  return (labels && labels[key]) || CATS[key].label;
}

function monthName(idx) {
  // idx 0-based
  return t('months')[idx] || '';
}

function setLang(newLang) {
  LANG = newLang;
  localStorage.setItem('amz-lang', LANG);
}

// Locale-aware formatting
function fmtE(n) {
  if (LANG === 'en') return '\u20AC' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return n.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' });
}

function fmtD(d) {
  try {
    if (LANG === 'en') return new Date(d).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
    return new Date(d).toLocaleDateString('de-DE', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch (e) { return d; }
}

function fmtM(m) {
  var p = m.split('-');
  return monthName(parseInt(p[1]) - 1) + "'" + p[0].slice(2);
}

function fmtDateExport() {
  if (LANG === 'en') return new Date().toLocaleDateString('en-US');
  return new Date().toLocaleDateString('de-DE');
}

// ─── DONATE ──────────────────────────────────────────────
var PAYPAL_URL = 'https://www.paypal.com/donate/?hosted_button_id=LBAGVGGLPXMYQ';
var DONATE_QR_BASE64 = 'data:image/jpeg;base64,' + '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';

var DONATE_TEXT = {
  de: {
    banner: '\u2764\uFE0F Gef\u00E4llt dir dieses Tool? Unterst\u00FCtze meine Arbeit mit einer Spende!',
    button: '\u2764\uFE0F Spenden via PayPal',
    importTitle: 'Spenden',
    importText: 'Vielen Dank, dass du meine Arbeit unterst\u00FCtzt! Diese Erweiterung ist kostenlos und wird in meiner Freizeit entwickelt. Wenn sie dir hilft, freue ich mich \u00FCber eine freiwillige Unterst\u00FCtzung.',
    pdfFooter: 'Hat dieses Tool geholfen? Unterst\u00FCtze meine Arbeit mit einer Spende:'
  },
  en: {
    banner: '\u2764\uFE0F Like this tool? Support my work with a donation!',
    button: '\u2764\uFE0F Donate via PayPal',
    importTitle: 'Donate',
    importText: 'Thank you for supporting my work! This extension is free and developed in my spare time. If it helps you, I would appreciate a voluntary contribution.',
    pdfFooter: 'Found this tool useful? Support my work with a donation:'
  }
};

function dt(key) {
  return (DONATE_TEXT[LANG] && DONATE_TEXT[LANG][key]) || DONATE_TEXT.de[key] || key;
}
