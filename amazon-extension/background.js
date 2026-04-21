// Amazon Spending Analysis / Ausgaben-Analyse – Background Service Worker
// EN: Handles inter-component messaging (opens dashboard tab on request)
// DE: Verwaltet Kommunikation zwischen Komponenten (öffnet Dashboard-Tab auf Anfrage)
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === 'openDashboard') {
    chrome.tabs.create({ url: chrome.runtime.getURL('dashboard.html') });
  }
});
