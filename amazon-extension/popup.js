var lang = localStorage.getItem('amz-lang') || ((navigator.language || '').startsWith('en') ? 'en' : 'de');

var tx = {
  de: {
    title: 'Amazon Ausgaben',
    openOrders: '\uD83D\uDCE6 Bestellübersicht öffnen',
    dashboard: '\uD83D\uDCCA Analyse-Dashboard',
    info: '<strong>Anleitung:</strong><br>1. Öffne die Amazon-Bestellübersicht<br>2. Wähle den gewünschten Zeitraum<br>3. Klicke im Panel auf "Alle Seiten auslesen"<br>4. Lade die CSV herunter oder öffne das Dashboard',
    donate: '\u2764\uFE0F Spenden via PayPal'
  },
  en: {
    title: 'Amazon Spending',
    openOrders: '\uD83D\uDCE6 Open order history',
    dashboard: '\uD83D\uDCCA Analysis Dashboard',
    info: '<strong>How to use:</strong><br>1. Open the Amazon order history<br>2. Select the desired time period<br>3. Click "Read all pages" in the panel<br>4. Download the CSV or open the Dashboard',
    donate: '\u2764\uFE0F Donate via PayPal'
  }
};

var t = tx[lang] || tx.de;
document.getElementById('title').textContent = t.title;
document.getElementById('orderLink').innerHTML = t.openOrders;
document.getElementById('openDashboard').innerHTML = t.dashboard;
document.getElementById('instructions').innerHTML = t.info;
document.getElementById('donateLink').textContent = t.donate;

document.getElementById('openDashboard').addEventListener('click', function() {
  chrome.tabs.create({ url: chrome.runtime.getURL('dashboard.html') });
});
