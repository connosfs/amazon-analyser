# Amazon Spending Analysis / Ausgaben-Analyse

**Chrome Extension – Version 5.7**

---

## 🇩🇪 Installation (Deutsch)

1. Entpacke diese ZIP-Datei in einen Ordner deiner Wahl.
2. Öffne Chrome und navigiere zu: `chrome://extensions/`
3. Aktiviere den **Entwicklermodus** (Schalter oben rechts).
4. Klicke auf **"Entpackte Erweiterung laden"**.
5. Wähle den Ordner `amazon-extension` aus.
6. Die Extension erscheint in der Extensions-Leiste.

### Benutzung

1. Klicke auf das Extension-Symbol in der Toolbar.
2. Klicke **"Bestellübersicht öffnen"** → Amazon-Bestellseite.
3. Im Panel rechts unten wähle den Auslesemodus:
   - **Diese Seite** – nur die aktuelle Seite (merge)
   - **Alle Seiten** – alle Seiten des aktuellen Filters (frisch)
   - **Jahre wählen** – ein oder mehrere Jahre per Multi-Select + Go (frisch)
   - **Alle Jahre** – alle verfügbaren Jahre (frisch)
4. **"CSV herunterladen"** klicken.
5. **"Analyse-Dashboard"** öffnen → CSV importieren.
6. Sprache umschalten: **DE/EN** Buttons oben rechts im Dashboard.

### Features

- **Dashboard:** KPIs, Donut-Chart, Monats-/Jahres-Charts (interaktiv & klickbar)
- **Multi-Select Kategorie-Filter** auf Dashboard und Bestellungen-View
- **Multi-Select Monatsfilter** in der Bestellungen-View
- **25+ automatische Kategorien** (Scoring-Algorithmus mit 1.100+ Keywords)
- **Re-Kategorisierung:** Einzeln per Dropdown oder Multiselekt für 1-Artikel-Bestellungen
- **Eigene Keywords:** CSV herunterladen, bearbeiten, hochladen
- **Excel-Export:** Formatierte XLSX-Dateien mit Kategorien und Spaltenbreiten
- **PDF-Export:** Druckoptimierte Berichte mit Charts und QR-Code
- **Backup & Restore:** JSON-Export/-Import aller Daten inkl. Kategorien und Keywords
- **Zweisprachig:** DE/EN mit automatischer Browser-Erkennung und manuellem Umschalter
- **100% lokal:** Keine Daten verlassen deinen Browser

---

## 🇬🇧 Installation (English)

1. Unzip this file to a folder of your choice.
2. Open Chrome and navigate to: `chrome://extensions/`
3. Enable **Developer mode** (toggle in top right).
4. Click **"Load unpacked"**.
5. Select the `amazon-extension` folder.
6. The extension appears in your extensions bar.

### Usage

1. Click the extension icon in the browser toolbar.
2. Click **"Open order history"** → Amazon orders page.
3. In the panel (bottom right) choose the read mode:
   - **This page** – current page only (merge)
   - **All pages** – all pages of current filter (fresh)
   - **Select years** – one or more years via multi-select + Go (fresh)
   - **All years** – all available years (fresh)
4. Click **"Download CSV"**.
5. Open **"Analysis Dashboard"** → import the CSV.
6. Switch language: **DE/EN** buttons in the top right of dashboard.

### Features

- **Dashboard:** KPIs, donut chart, monthly/yearly charts (interactive & clickable)
- **Multi-select category filter** on dashboard and orders view
- **Multi-select month filter** on orders view
- **25+ automatic categories** (scoring algorithm with 1,100+ keywords)
- **Re-categorization:** Single dropdown or multi-select for single-item orders
- **Custom keywords:** Download CSV, edit, upload
- **Excel export:** Formatted XLSX files with categories and column widths
- **PDF export:** Print-optimized reports with charts and QR code
- **Backup & Restore:** JSON export/import of all data including categories and keywords
- **Bilingual:** DE/EN with automatic browser detection and manual toggle
- **100% local:** No data ever leaves your browser

---

## Dateien / Files

| Datei / File | Beschreibung / Description |
|---|---|
| `manifest.json` | Extension-Konfiguration / Extension configuration |
| `content.js` / `.css` | Panel auf der Amazon-Bestellseite / Panel on Amazon order page |
| `dashboard.html` / `.js` / `.css` | Analyse-Dashboard / Analysis dashboard |
| `i18n.js` | Übersetzungen DE/EN / Translations DE/EN |
| `popup.html` / `.js` | Extension-Popup / Extension popup |
| `background.js` | Service Worker |
| `icons/` | Extension-Icons (16/32/48/128px) |

## Datenschutz / Privacy

Alle Daten werden ausschließlich lokal in deinem Browser gespeichert (`localStorage` / `chrome.storage.local`). Es erfolgt **keine Übertragung** an externe Server.

All data is stored exclusively in your browser (`localStorage` / `chrome.storage.local`). There is **no transmission** to external servers.

## Spenden / Donate

Wenn dir dieses Tool hilft, freue ich mich über eine freiwillige Unterstützung:
If this tool helps you, I appreciate a voluntary donation:

**[PayPal Donate](https://www.paypal.com/donate/?hosted_button_id=LBAGVGGLPXMYQ)**

---

© 2026 Falk Scherer · Alle Daten bleiben lokal / All data stays local.
