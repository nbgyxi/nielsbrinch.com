// Bakes the DC ("omelette") design-tool export into a single static
// index.html suitable for GitHub Pages. Run: `node build.js`.
// Source of truth is extracted/Niels Brinch.dc.html plus the image sidecar.
const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, 'extracted');
let html = fs.readFileSync(path.join(SRC, 'Niels Brinch.dc.html'), 'utf8');
const slots = JSON.parse(fs.readFileSync(path.join(SRC, '.image-slots.state.json'), 'utf8'));

const dataUrl = (id) => {
  const v = slots[id];
  if (!v) return null;
  return typeof v === 'string' ? v : v.u;
};

// --- Build config (mirrors the DCLogic component defaults) ---
const ACCENT = '#c06a3f';   // props.accent default
// showDecor default is true -> decorative blobs kept.

// Slots that play a looping video instead of a still. The baked still (if
// any) becomes the <video> poster so a frame shows instantly while it loads.
const VIDEO_SLOTS = { 'fourI-hero': 'assets/4i-hero.mp4' };

// --- Replace each <image-slot ...></image-slot> with a baked <img>/<video>. ---
// Every stored slot is fit=cover, s:1,x:0,y:0 -> plain center-cover media.
html = html.replace(/<image-slot\b([^>]*)><\/image-slot>/g, (m, attrs) => {
  const idMatch = attrs.match(/id="([^"]+)"/);
  const phMatch = attrs.match(/placeholder="([^"]*)"/);
  const id = idMatch ? idMatch[1] : '';
  const url = dataUrl(id);
  const alt = phMatch ? phMatch[1].replace(/"/g, '&quot;') : '';
  const mediaStyle = 'position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center;display:block;';
  if (VIDEO_SLOTS[id]) {
    const poster = url ? ` poster="${url}"` : '';
    const vid = 'video-' + id;
    // Autoplays muted (browsers require it); the button unmutes on a user
    // gesture, which is allowed. Starts in the muted "Tap for sound" state;
    // the sound-toggle script keeps its icon/label in sync.
    return `<video id="${vid}" src="${VIDEO_SLOTS[id]}"${poster} autoplay muted loop playsinline preload="metadata" aria-label="${alt}" style="${mediaStyle}"></video>
      <button type="button" class="sound-toggle" data-target="${vid}" aria-pressed="false" aria-label="Enable sound" style="position:absolute;right:14px;top:14px;z-index:3;display:inline-flex;align-items:center;gap:8px;font-family:var(--mono);font-size:11.5px;letter-spacing:0.06em;color:var(--ink);background:rgba(0,0,0,0.55);border:1px solid rgba(244,237,228,0.20);padding:8px 13px;border-radius:999px;cursor:pointer;backdrop-filter:blur(6px);line-height:1;">
        <span class="sound-toggle-icon" aria-hidden="true" style="display:inline-flex;"></span><span class="sound-toggle-label">Tap for sound</span>
      </button>
      <div style="position:absolute;left:16px;bottom:14px;z-index:3;max-width:calc(100% - 32px);font-family:var(--mono);font-size:11.5px;letter-spacing:0.03em;color:rgba(244,237,228,0.92);text-shadow:0 1px 4px rgba(0,0,0,0.65);pointer-events:none;">Created by Hello_Satan with <a href="https://4i.app" target="_blank" rel="noopener" style="color:inherit;text-decoration:underline;text-underline-offset:2px;pointer-events:auto;">4i.app</a></div>`;
  }
  if (!url) {
    return `<div style="position:absolute;inset:0;background:rgba(127,127,127,.08);"></div>`;
  }
  return `<img src="${url}" alt="${alt}" loading="lazy" style="${mediaStyle}">`;
});

// --- Expand the PageRain roster (sc-for over prArtists). ---
const C = { r: '#f0603a', y: '#e6b23c', g: '#3fb95e' };
const raw = [
  ['Neon Harbor', '@neon_harbor', 22, 'g', 'Empties Fri, Dec 11 · 141 days left'],
  ['Velvet Choir', '@velvet_choir', 36, 'g', 'Empties Sat, Jan 16 · 176 days left'],
  ['Paper Astronauts', '@paper_astronauts', 0, 'r', 'Queue is empty · 0 days left'],
  ['Cassette Tigers', '@cassette_tigers', 7, 'y', 'Low · 5 days left'],
  ['Hollow Coast', '@hollow_coast', 60, 'g', 'Empties Fri, May 28 · 308 days left'],
  ['Ivory Pilots', '@ivory_pilots', 25, 'g', 'Empties Sun, May 30 · 310 days left'],
  ['Gold Radio', '@gold_radio', 6, 'y', 'Low · 6 days left'],
  ['Ruby Transit', '@ruby_transit', 33, 'g', 'Empties Mon, Mar 9 · 228 days left'],
  ['Bitter Lake', '@bitter_lake', 0, 'r', 'Queue is empty · 0 days left'],
  ['Echo Field', '@echo_field', 52, 'g', 'Empties Thu, Jul 2 · 343 days left'],
];
// Deterministic fill for green bars (baked once instead of Math.random at runtime).
const greenFills = [72, 66, 84, 61, 78, 69, 88, 63, 81, 74];
let gi = 0;
const fillFor = (h) => (h === 'r' ? '10%' : h === 'y' ? '42%' : greenFills[gi++ % greenFills.length] + '%');
raw.sort((a, b) => a[2] - b[2]);
const cards = raw.map(([name, handle, num, h, status]) => {
  const fill = fillFor(h);
  const barColor = C[h];
  const numColor = h === 'r' ? '#6b7280' : '#ffffff';
  const statusColor = h === 'r' ? '#f0603a' : '#8b929c';
  return `<div style="background:#12161b;border:1px solid rgba(255,255,255,0.06);border-radius:12px;padding:16px;display:flex;flex-direction:column;gap:14px;">
                <div style="display:flex;gap:12px;align-items:stretch;">
                  <div style="position:relative;width:34px;height:82px;border-radius:10px;background:#0b0e11;border:1px solid rgba(255,255,255,0.06);overflow:hidden;flex:0 0 auto;">
                    <div style="position:absolute;left:0;right:0;bottom:0;height:${fill};background:${barColor};"></div>
                    <span style="position:absolute;left:0;right:0;top:6px;text-align:center;font-family:var(--mono);font-size:12px;font-weight:600;color:${numColor};">${num}</span>
                  </div>
                  <div style="min-width:0;">
                    <div style="font-weight:600;font-size:14.5px;line-height:1.2;text-wrap:balance;">${name}</div>
                    <div style="font-family:var(--mono);font-size:11.5px;color:#6b7280;margin-top:3px;">${handle}</div>
                  </div>
                </div>
                <div style="font-size:11.5px;color:${statusColor};">${status}</div>
              </div>`;
}).join('\n            ');

html = html.replace(/<sc-for\b[^>]*>[\s\S]*?<\/sc-for>/, cards);

// --- Resolve the showDecor sc-if wrapper (default true: keep inner content). ---
html = html.replace(/<sc-if\b[^>]*>([\s\S]*?)<\/sc-if>/g, '$1');

// --- Substitute remaining template placeholders. ---
html = html.replace(/\{\{\s*accent\s*\}\}/g, ACCENT);

// --- Pull <helmet> contents (font links + <style>) up into <head>. ---
const helmetMatch = html.match(/<helmet>([\s\S]*?)<\/helmet>/);
let helmetInner = helmetMatch ? helmetMatch[1] : '';
// Drop the image-slot runtime script; not needed in the static build.
helmetInner = helmetInner.replace(/<script src="\.\/image-slot\.js"><\/script>\s*/g, '');
html = html.replace(/<helmet>[\s\S]*?<\/helmet>/, '');

// --- Strip DC scaffolding. ---
html = html.replace(/<script src="\.\/support\.js"><\/script>\s*/g, '');
html = html.replace(/<x-dc>\s*/, '');
html = html.replace(/\s*<\/x-dc>/, '');
html = html.replace(/<script type="text\/x-dc"[\s\S]*?<\/script>/, '');

// --- Add meta/title/helmet content to <head>. ---
const headExtras = `<title>Niels Brinch: independent developer</title>
<meta name="description" content="Niels Brinch, independent developer. Maker of 4i (turn any song into a music video), PageRain, the Pixel Pusher album, Space Mazing, Gyxi and more.">
<meta name="author" content="Niels Brinch">
<link rel="canonical" href="https://nielsbrinch.com/">
<meta property="og:type" content="website">
<meta property="og:title" content="Niels Brinch, independent developer">
<meta property="og:description" content="Independent developer. Mostly music software and creator tools, plus a game. Main project: 4i.">
<meta property="og:url" content="https://nielsbrinch.com/">
<meta name="twitter:card" content="summary_large_image">
${helmetInner.trim()}`;

html = html.replace(/<\/head>/, headExtras + '\n</head>');

// --- Sound-toggle behaviour for autoplaying-muted videos. ---
const soundScript = `<script>
(function () {
  var MUTED = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H2v6h4l5 4z"/><line x1="22" y1="9" x2="16" y2="15"/><line x1="16" y1="9" x2="22" y2="15"/></svg>';
  var LOUD = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H2v6h4l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M18.8 5.2a9 9 0 0 1 0 13.6"/></svg>';
  document.querySelectorAll('.sound-toggle').forEach(function (btn) {
    var video = document.getElementById(btn.getAttribute('data-target'));
    if (!video) return;
    var icon = btn.querySelector('.sound-toggle-icon');
    var label = btn.querySelector('.sound-toggle-label');
    function sync() {
      var on = !video.muted;
      btn.setAttribute('aria-pressed', String(on));
      btn.setAttribute('aria-label', on ? 'Mute sound' : 'Enable sound');
      if (icon) icon.innerHTML = on ? LOUD : MUTED;
      if (label) label.textContent = on ? 'Sound on' : 'Tap for sound';
    }
    btn.addEventListener('click', function () {
      video.muted = !video.muted;
      if (!video.muted) { var p = video.play(); if (p && p.catch) p.catch(function () {}); }
      sync();
    });
    // Reflect any state the browser lands on (e.g. autoplay blocked -> muted).
    video.addEventListener('volumechange', sync);
    sync();
  });
})();
</script>`;
html = html.replace(/<\/body>/, soundScript + '\n</body>');

// Clean up leftover blank lines from removed scripts.
html = html.replace(/\n{3,}/g, '\n\n');

fs.writeFileSync(path.join(__dirname, 'index.html'), html, 'utf8');
console.log('Wrote index.html (' + html.length + ' bytes)');

// Sanity checks: no DC leftovers should remain.
const leftovers = ['x-dc', 'sc-if', 'sc-for', 'image-slot', 'helmet', '{{', 'text/x-dc', 'support.js'];
const found = leftovers.filter((t) => html.includes(t));
console.log(found.length ? 'WARNING leftover tokens: ' + found.join(', ') : 'Clean: no DC tokens remain.');
