/**
 * Amazon Spending Analysis / Ausgaben-Analyse – Content Script v5.5
 * EN: Scrapes Amazon order pages, auto-pagination, CSV export, bilingual panel
 * DE: Liest Amazon-Bestellseiten aus, Auto-Pagination, CSV-Export, zweisprachiges Panel
 */
(function () {
  "use strict";
  if (window.__amzAnalyseLoaded) return;
  window.__amzAnalyseLoaded = true;

  var MONTHS = { 'januar':'01','februar':'02','märz':'03','april':'04','mai':'05','juni':'06','juli':'07','august':'08','september':'09','oktober':'10','november':'11','dezember':'12' };

  function extractOrders(doc) {
    var orders = [];
    (doc || document).querySelectorAll('.a-box-group').forEach(function(group) {
      var header = group.querySelector('.order-header');
      if (!header) return;
      var o = { items: [], date: '', total: 0, id: '' };
      var dm = header.textContent.match(/(\d{1,2})\.\s*(Januar|Februar|März|April|Mai|Juni|Juli|August|September|Oktober|November|Dezember)\s*(\d{4})/i);
      if (dm) o.date = dm[3] + '-' + MONTHS[dm[2].toLowerCase()] + '-' + dm[1].padStart(2, '0');
      var tm = header.textContent.match(/([\d.]+,\d{2})\s*€/);
      if (tm) o.total = parseFloat(tm[1].replace('.', '').replace(',', '.')) || 0;
      var bdi = group.querySelector('bdi[dir="ltr"]');
      if (bdi) o.id = bdi.textContent.trim();
      if (!o.id) { var m = group.textContent.match(/(\d{3}-\d{7}-\d{7})/); if (m) o.id = m[0]; }
      if (!o.id) o.id = 'u-' + Math.random().toString(36).slice(2, 8);
      var titles = group.querySelectorAll('.yohtmlc-product-title');
      var seen = {};
      titles.forEach(function(t) {
        var n = t.textContent.trim();
        if (!n || n.length < 3 || seen[n]) return;
        seen[n] = true;
        o.items.push({ name: n, price: 0, qty: 1 });
      });
      if (o.items.length === 1) o.items[0].price = o.total;
      else if (o.items.length > 1) {
        var each = Math.round((o.total / o.items.length) * 100) / 100;
        o.items.forEach(function(it) { it.price = each; });
      }
      if (o.date && o.items.length > 0) orders.push(o);
    });
    return orders;
  }

  function loadStored() {
    return new Promise(function(resolve) { chrome.storage.local.get(['amzOrders'], function(r) { resolve(r.amzOrders || []); }); });
  }
  function saveOrders(orders) {
    return new Promise(function(resolve) { chrome.storage.local.set({ amzOrders: orders }, resolve); });
  }
  function orderKey(o) {
    // Create a stable key from date + total + first item name (not random ID)
    var firstItem = o.items.length > 0 ? o.items[0].name.slice(0, 50) : '';
    return o.date + '|' + o.total.toFixed(2) + '|' + firstItem;
  }

  function mergeAndSave(newOrders) {
    return loadStored().then(function(existing) {
      var keys = {};
      existing.forEach(function(o) { keys[orderKey(o)] = true; keys[o.id] = true; });
      var added = 0;
      newOrders.forEach(function(o) {
        var k = orderKey(o);
        if (!keys[k] && !keys[o.id]) {
          existing.push(o);
          keys[k] = true;
          keys[o.id] = true;
          added++;
        }
      });
      existing.sort(function(a, b) { return b.date.localeCompare(a.date); });
      return saveOrders(existing).then(function() { return { total: existing.length, added: added }; });
    });
  }

  function clearAndSave(freshOrders) {
    // Replace all stored orders with fresh data (used before full re-scans)
    freshOrders.sort(function(a, b) { return b.date.localeCompare(a.date); });
    return saveOrders(freshOrders).then(function() { return { total: freshOrders.length }; });
  }

  function ordersToCSV(orders) {
    var header = 'Datum;Bestellnummer;Artikel;Preis;Menge';
    var rows = [];
    orders.forEach(function(o) { o.items.forEach(function(it) {
      rows.push(o.date + ';' + o.id + ';"' + it.name.replace(/"/g, '""') + '";' + it.price.toFixed(2).replace('.', ',') + ';' + it.qty);
    }); });
    return '\uFEFF' + [header].concat(rows).join('\n');
  }

  function downloadFile(content, filename, type) {
    var blob = new Blob([content], { type: type });
    var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = filename; a.click();
  }

  function loadPageViaIframe(url) {
    return new Promise(function(resolve) {
      var iframe = document.createElement('iframe');
      iframe.style.cssText = 'position:fixed;top:-9999px;width:1200px;height:800px;opacity:0;pointer-events:none';
      iframe.src = url;
      var timeout = setTimeout(function() { try { document.body.removeChild(iframe); } catch (e) {} resolve([]); }, 15000);
      iframe.onload = function() {
        setTimeout(function() {
          var result = [];
          try { result = extractOrders(iframe.contentDocument); } catch (e) {}
          clearTimeout(timeout);
          try { document.body.removeChild(iframe); } catch (e) {}
          resolve(result);
        }, 2500);
      };
      iframe.onerror = function() { clearTimeout(timeout); try { document.body.removeChild(iframe); } catch (e) {} resolve([]); };
      document.body.appendChild(iframe);
    });
  }

  async function collectAllPages(timeFilter, onProgress) {
    var page = 0, empty = false;
    var allCollected = [];
    while (!empty) {
      if (onProgress) onProgress(page + 1);
      var orders = await loadPageViaIframe('/your-orders/orders?timeFilter=' + timeFilter + '&startIndex=' + (page * 10));
      if (orders.length === 0) empty = true;
      else { allCollected = allCollected.concat(orders); page++; }
      await new Promise(function(r) { setTimeout(r, 300); });
    }
    // Deduplicate within collected batch
    var seen = {};
    var unique = [];
    allCollected.forEach(function(o) {
      var k = orderKey(o);
      if (!seen[k]) { seen[k] = true; unique.push(o); }
    });
    // Merge with existing storage
    var res = await mergeAndSave(unique);
    return res.added;
  }

  // ─── i18n (content script) ──────────────────────────────
  var CL = ((navigator.language || '').startsWith('en')) ? 'en' : 'de';
  var CT = {
    de: {
      title:'Ausgaben-Analyse',thisPage:'\uD83D\uDD0D Diese Seite auslesen',
      allPages:'\uD83D\uDCDA Alle Seiten (aktueller Filter)',readYears:'\uD83D\uDE80 Auslesen',
      allYears:'\uD83D\uDCC5 Alle Jahre auslesen',csvDownload:'\uD83D\uDCC4 CSV herunterladen',
      dashboard:'\uD83D\uDCCA Analyse-Dashboard',stored:'{n} Bestellungen \u00B7 {t}',
      reading:'\u23F3 Lese Bestellungen aus...',noOrders:'\u26A0\uFE0F Keine Bestellungen auf dieser Seite.',
      newOrders:'\u2705 {a} neue ({t} gesamt)',loading:'\uD83D\uDCC4 {l} \u2013 Seite {p}...',
      yearLoading:'\uD83D\uDCC5 {y} \u2013 Seite {p}...',yearLabel:'\uD83D\uDCC5 {y}...',
      done:'\u2705 {n} Bestellungen geladen',page:'Seite'
    },
    en: {
      title:'Spending Analysis',thisPage:'\uD83D\uDD0D Read this page',
      allPages:'\uD83D\uDCDA All pages (current filter)',readYears:'\uD83D\uDE80 Read selected',
      allYears:'\uD83D\uDCC5 Read all years',csvDownload:'\uD83D\uDCC4 Download CSV',
      dashboard:'\uD83D\uDCCA Analysis Dashboard',stored:'{n} orders \u00B7 {t}',
      reading:'\u23F3 Reading orders...',noOrders:'\u26A0\uFE0F No orders found on this page.',
      newOrders:'\u2705 {a} new ({t} total)',loading:'\uD83D\uDCC4 {l} \u2013 page {p}...',
      yearLoading:'\uD83D\uDCC5 {y} \u2013 page {p}...',yearLabel:'\uD83D\uDCC5 {y}...',
      done:'\u2705 {n} orders loaded',page:'page'
    }
  };
  function ct(k){ return (CT[CL]&&CT[CL][k])||CT.de[k]||k; }
  function ctR(k,r){ var s=ct(k);for(var x in r)s=s.replace('{'+x+'}',r[x]);return s; }

  // ─── UI ────────────────────────────────────────────────
  function createUI() {
    document.getElementById('amz-ausgaben-panel')?.remove();

    var cy = new Date().getFullYear();
    var years = [cy, cy-1, cy-2, cy-3, cy-4];

    var panel = document.createElement('div');
    panel.id = 'amz-ausgaben-panel';
    panel.innerHTML =
      '<div class="aa-card">' +
        '<div class="aa-header">' +
          '<span class="aa-logo">\uD83D\uDCCA</span>' +
          '<span class="aa-title">'+ct('title')+' <span style="font-size:10px;color:#5E6B80;font-weight:400">5.5</span></span>' +
          '<button class="aa-close" id="aa-minimize">\u2212</button>' +
        '</div>' +
        '<div class="aa-body" id="aa-body">' +

          '<button class="aa-btn aa-primary" id="aa-this-page">'+ct('thisPage')+'</button>' +
          '<button class="aa-btn aa-filter-btn" id="aa-all-pages">'+ct('allPages')+'</button>' +

          '<div class="aa-divider"></div>' +

          '<div class="aa-yr-row">' +
            years.map(function(y) { return '<button class="aa-yr" data-yr="' + y + '">' + y + '</button>'; }).join('') +
          '</div>' +
          '<button class="aa-btn aa-yr-go" id="aa-yr-go" style="display:none">'+ct('readYears')+'</button>' +

          '<button class="aa-btn aa-all-years" id="aa-all-years">'+ct('allYears')+'</button>' +

          '<div class="aa-status" id="aa-status"></div>' +
          '<div class="aa-bar-bg" id="aa-bar-bg" style="display:none"><div class="aa-bar" id="aa-bar"></div></div>' +

          '<div id="aa-export-btns" style="display:none">' +
            '<button class="aa-btn aa-secondary" id="aa-csv">'+ct('csvDownload')+'</button>' +
            '<button class="aa-btn aa-secondary" id="aa-dashboard">'+ct('dashboard')+'</button>' +
          '</div>' +

          '<div class="aa-stored" id="aa-stored"></div>' +
        '</div>' +
      '</div>' +
      '<button class="aa-fab" id="aa-fab" style="display:none">\uD83D\uDCCA</button>';
    document.body.appendChild(panel);

    var statusEl = document.getElementById('aa-status');
    var barBg = document.getElementById('aa-bar-bg');
    var barEl = document.getElementById('aa-bar');
    var exportBtns = document.getElementById('aa-export-btns');
    var storedEl = document.getElementById('aa-stored');
    var bodyEl = document.getElementById('aa-body');
    var fab = document.getElementById('aa-fab');
    var yrGoBtn = document.getElementById('aa-yr-go');
    var selectedYears = [];
    var running = false;

    function setStatus(msg, type) {
      statusEl.textContent = msg;
      statusEl.className = 'aa-status' + (type ? ' aa-' + type : '');
      statusEl.style.display = msg ? 'block' : 'none';
    }
    function setProgress(pct) {
      barBg.style.display = pct >= 0 ? 'block' : 'none';
      barEl.style.width = pct + '%';
    }
    async function refreshStored() {
      var all = await loadStored();
      if (all.length > 0) {
        var loc = CL === 'en' ? 'en-US' : 'de-DE';
        var tot = all.reduce(function(s, o) { return s + o.total; }, 0);
        storedEl.innerHTML = '<strong>' + all.length + '</strong> ' + (CL==='en'?'orders':'Bestellungen') + ' \u00B7 <strong>' + tot.toLocaleString(loc, {style:'currency',currency:'EUR'}) + '</strong>';
        exportBtns.style.display = 'block';
      }
    }
    function disableAll() { running = true; panel.querySelectorAll('.aa-btn').forEach(function(b) { b.disabled = true; }); }
    function enableAll() { running = false; panel.querySelectorAll('.aa-btn').forEach(function(b) { b.disabled = false; }); }

    refreshStored();

    // ── Year multi-select ──
    document.querySelectorAll('.aa-yr').forEach(function(btn) {
      btn.addEventListener('click', function() {
        if (running) return;
        var yr = btn.getAttribute('data-yr');
        if (btn.classList.contains('active')) {
          btn.classList.remove('active');
          selectedYears = selectedYears.filter(function(y) { return y !== yr; });
        } else {
          btn.classList.add('active');
          selectedYears.push(yr);
        }
        yrGoBtn.style.display = selectedYears.length > 0 ? 'block' : 'none';
        if (selectedYears.length > 0) {
          yrGoBtn.textContent = '\uD83D\uDE80 ' + selectedYears.slice().sort().join(', ');
        }
      });
    });

    // ── 1. Diese Seite ──
    document.getElementById('aa-this-page').addEventListener('click', async function() {
      if (running) return;
      disableAll();
      setStatus(ct('reading'), 'loading');
      var newOrders = extractOrders();
      if (newOrders.length === 0) {
        setStatus(ct('noOrders'), 'warning');
        enableAll(); return;
      }
      var result = await mergeAndSave(newOrders);
      setStatus(ctR('newOrders',{a:result.added,t:result.total}), 'success');
      await refreshStored();
      enableAll();
    });

    // ── 2. Alle Seiten (aktueller Filter) – frischer Scan ──
    document.getElementById('aa-all-pages').addEventListener('click', async function() {
      if (running) return;
      disableAll();
      setProgress(0);
      await saveOrders([]);
      var params = new URL(location.href).searchParams;
      var tf = params.get('timeFilter') || params.get('orderFilter') || '';
      if (!tf) { var sel = document.getElementById('time-filter'); if (sel) tf = sel.value; }
      if (!tf) tf = 'months-3';
      var label = tf.replace('year-', '');

      var collected = await collectAllPages(tf, function(pg) {
        setStatus(ctR('loading',{l:label,p:pg}), 'loading');
        setProgress(Math.min(90, pg * 5));
      });
      setProgress(100);
      var all = await loadStored();
      setStatus(ctR('done',{n:all.length}), 'success');
      await refreshStored();
      enableAll();
    });

    // ── 3. Ausgewählte Jahre – frischer Scan ──
    yrGoBtn.addEventListener('click', async function() {
      if (running || selectedYears.length === 0) return;
      disableAll();
      setProgress(0);
      await saveOrders([]);
      var grandTotal = 0;
      var sorted = selectedYears.slice().sort();
      for (var i = 0; i < sorted.length; i++) {
        var yr = sorted[i];
        var collected = await collectAllPages('year-' + yr, function(pg) {
          setStatus(ctR('yearLoading',{y:yr,p:pg}), 'loading');
          setProgress((i / sorted.length) * 100 + Math.min(pg * 2, 100 / sorted.length));
        });
        grandTotal += collected;
      }
      setProgress(100);
      var all = await loadStored();
      setStatus(ctR('done',{n:all.length}), 'success');
      await refreshStored();
      enableAll();
    });

    // ── 4. Alle Jahre – frischer Scan ──
    document.getElementById('aa-all-years').addEventListener('click', async function() {
      if (running) return;
      disableAll();
      setProgress(0);
      await saveOrders([]);
      var grandTotal = 0;
      var year = new Date().getFullYear();
      var emptyStreak = 0;

      while (emptyStreak < 2 && year >= 2000) {
        setStatus(ctR('yearLabel',{y:year}), 'loading');
        var collected = await collectAllPages('year-' + year, function(pg) {
          setStatus(ctR('yearLoading',{y:year,p:pg}), 'loading');
        });
        if (collected === 0) emptyStreak++;
        else { emptyStreak = 0; grandTotal += collected; }
        year--;
      }

      setProgress(100);
      var all = await loadStored();
      setStatus(ctR('done',{n:all.length}), 'success');
      await refreshStored();
      enableAll();
    });

    // ── Exports ──
    document.getElementById('aa-csv').addEventListener('click', async function() {
      var o = await loadStored(); downloadFile(ordersToCSV(o), 'amazon-bestellungen-' + new Date().toISOString().slice(0,10) + '.csv', 'text/csv;charset=utf-8');
    });
    document.getElementById('aa-dashboard').addEventListener('click', function() {
      chrome.runtime.sendMessage({ action: 'openDashboard' });
    });

    // ── Minimize ──
    document.getElementById('aa-minimize').addEventListener('click', function() {
      bodyEl.style.display = 'none'; panel.querySelector('.aa-header').style.display = 'none'; fab.style.display = 'flex';
    });
    fab.addEventListener('click', function() {
      bodyEl.style.display = ''; panel.querySelector('.aa-header').style.display = ''; fab.style.display = 'none';
    });
  }

  if (document.readyState === 'complete') createUI();
  else window.addEventListener('load', createUI);
})();
