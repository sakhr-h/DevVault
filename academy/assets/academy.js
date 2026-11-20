(() => {
const $ = (s, r = document) => r.querySelector(s);
const h = (t, c, x) => { const e = document.createElement(t); if (c) e.className = c; if (x !== undefined) e.textContent = x; return e; };
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const rich = s => esc(s)
  .replace(/`([^`]+)`/g, '<code class="font-mono text-[0.85em] bg-slate-800 text-emerald-300 px-1.5 py-0.5 rounded" dir="ltr">$1</code>')
  .replace(/\*\*([^*]+)\*\*/g, '<strong class="text-slate-100">$1</strong>')
  .replace(/\[\[([^\]]+)\]\]/g, '<span class="ar text-emerald-300/90" dir="rtl" lang="ar">($1)</span>');
const R = (k, d) => { try { const v = JSON.parse(localStorage.getItem(k)); return v ?? d; } catch (e) { return d; } };
const W = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };
const PK = 'acad_progress_v1', AK = 'acad_ar';

const LIST = [
  { id: 'bettercap', n: '01', title: 'Bettercap', live: true, level: 'Beginner', dur: '45–60 min', cat: 'Network Security', desc: 'Bettercap Fundamentals & Passive Network Reconnaissance', keywords: 'passive recon arp monitoring' },
  { id: 'osint', n: '02', title: 'OSINT Fundamentals & Passive Information Gathering', live: true, level: 'Beginner', dur: '35–45 min', cat: 'OSINT', desc: 'Ethical passive research, source evaluation, privacy, and documentation.', keywords: 'osint passive privacy' },
  { id: 'beef', n: '03', title: 'BeEF Architecture & Browser Security Concepts', live: true, level: 'Beginner', dur: '35–45 min', cat: 'Browser Security', desc: 'Browser trust boundaries, architecture, detection, and defenses.', keywords: 'beef browser architecture' },
  { id: 'file-threats', n: '04', title: 'File & Image-Based Threat Mechanics', live: true, level: 'Beginner', dur: '40–50 min', cat: 'Threat Analysis', desc: 'Risky file delivery, safe inspection, and containment.', keywords: 'file image metadata malware' },
  { id: 'kali', n: '05', title: 'Kali Linux Fundamentals', live: true, level: 'Beginner', dur: '35–45 min', cat: 'Linux', desc: 'Navigate Kali safely, manage packages, permissions, and lab hygiene.', keywords: 'kali linux terminal' },
  { id: 'network-defenses', n: '06', title: 'DNS, MITM & Network Poisoning Defenses', live: true, level: 'Beginner', dur: '45–55 min', cat: 'Network Defense', desc: 'Recognize name-resolution and traffic-manipulation risks and strengthen defenses.', keywords: 'dns mitm poisoning arp dhcp' },
  { id: 'scanning', n: '07', title: 'Network Scanning, Zenmap & Metasploit', live: true, level: 'Beginner', dur: '45–55 min', cat: 'Assessment', desc: 'Interpret authorized inventory results and understand framework governance.', keywords: 'zenmap metasploit nmap inventory' },
  { id: 'wireless', n: '08', title: 'Wireless Security', live: true, level: 'Beginner', dur: '35–45 min', cat: 'Wireless', desc: 'Wi-Fi security, configuration risks, monitoring, and response.', keywords: 'wireless wifi wpa' },
  { id: 'wireshark', n: '09', title: 'Wireshark & Traffic Analysis', live: true, level: 'Beginner', dur: '40–50 min', cat: 'Traffic Analysis', desc: 'Read packet captures, use display filters, and identify defensive signals.', keywords: 'wireshark pcap tcp dns' }
];
const TOTAL = {};
const P = () => R(PK, {});
const doneSet = c => (P()[c] || {}).done || {};
const pct = c => Math.min(100, Math.round(100 * Object.keys(doneSet(c)).length / (LIST.find(x => x.id === c)?.sectionCount || 5)));
const setDone = (c, s, v) => { const p = P(); const d = (p[c] = p[c] || {}).done = p[c].done || {}; v ? d[s] = 1 : delete d[s]; W(PK, p); };

let tt, te;
const toast = m => {
  if (!te) { te = h('div', 'fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-800 border border-slate-700 text-sm rounded-lg px-4 py-2.5 transition-opacity'); te.setAttribute('role', 'status'); document.body.append(te); }
  te.textContent = m; te.style.opacity = 1; clearTimeout(tt); tt = setTimeout(() => te.style.opacity = 0, 1800);
};
async function clip(t) {
  try { await navigator.clipboard.writeText(t); }
  catch (e) { const a = h('textarea'); a.value = t; document.body.append(a); a.select(); document.execCommand('copy'); a.remove(); }
}
const applyAR = () => {
  const on = R(AK, true); document.documentElement.classList.toggle('noar', !on);
  const b = $('#arBtn'); if (b) { b.textContent = 'Arabic hints: ' + (on ? 'ON' : 'OFF'); b.setAttribute('aria-pressed', on); }
};
const bar = p => { const o = h('div', 'h-1.5 rounded bg-slate-800 overflow-hidden'); const i = h('div', 'h-full bg-emerald-500 transition-all'); i.style.width = p + '%'; o.append(i); return o; };
const para = (t, c = 'text-slate-300 leading-7') => { const e = h('p', c); e.innerHTML = rich(t); return e; };
const arnote = t => { const e = h('div', 'ar arbox rounded-lg border border-emerald-500/20 bg-emerald-500/5 text-emerald-100/90 text-sm leading-7 px-4 py-2.5 my-3'); e.dir = 'rtl'; e.append(h('strong', 'ms-2', 'بالعربي:'), document.createTextNode(t)); return e; };
const list = (tag, arr) => { const e = h(tag, 'space-y-1.5 text-slate-300 leading-7 ps-6 ' + (tag === 'ul' ? 'list-disc' : 'list-decimal')); arr.forEach(x => { const l = h('li'); l.innerHTML = rich(x); e.append(l); }); return e; };

function hdr() {
  const e = h('header', 'sticky top-0 z-20 border-b border-slate-800 bg-slate-900/70 backdrop-blur-md');
  const menu = LIST.map(c => c.live
    ? `<a class="block px-3 py-2 rounded hover:bg-slate-800" href="course.html?c=${c.id}">${c.n} · ${c.title}</a>`
    : `<span class="block px-3 py-2 text-slate-500">${c.n} · ${c.title} <span class="text-[10px]">(soon)</span></span>`).join('');
  e.innerHTML = `<div class="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
   <a href="index.html" class="flex items-center gap-2 font-bold text-emerald-400"><span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>DevVault <span class="text-slate-400 font-normal">Cybersecurity Academy</span></a>
   <nav class="flex items-center gap-2 text-sm">
    <details class="relative"><summary class="cursor-pointer list-none px-3 py-1.5 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700">Courses ▾</summary>
     <div class="absolute end-0 mt-2 w-64 rounded-xl border border-slate-800 bg-slate-900 p-1 shadow-xl">${menu}</div></details>
    <button id="arBtn" class="px-3 py-1.5 rounded-lg border border-slate-700 text-slate-200 hover:bg-slate-800"></button>
    <a href="../index.html" class="px-3 py-1.5 rounded-lg text-slate-400 hover:text-slate-100">← DevVault</a>
   </nav></div>`;
  return e;
}

function hub() {
  const g = $('#cards');
  LIST.forEach(c => {
    const el = h(c.live ? 'a' : 'div', 'rounded-2xl border p-5 flex flex-col gap-3 ' + (c.live ? 'border-slate-800 bg-slate-900 hover:border-emerald-500/60 transition' : 'border-slate-800/60 bg-slate-900/40 opacity-60'));
    if (c.live) el.href = 'course.html?c=' + c.id;
    el.append(h('span', 'font-mono text-xs text-emerald-400', 'COURSE ' + c.n), h('h2', 'text-lg font-semibold text-slate-100', c.title));
    if (c.live) {
      const ch = h('div', 'flex flex-wrap gap-2');
      [c.level, c.cat, c.dur].forEach(x => ch.append(h('span', 'text-xs rounded-md border border-slate-700 text-slate-300 px-2 py-0.5', x)));
      const p = pct(c.id);
      el.append(h('p', 'text-sm text-slate-400', c.desc), ch, bar(p), h('span', 'text-xs text-slate-400', p + '% complete'));
    } else el.append(h('p', 'text-sm text-slate-500', 'Coming soon'));
    g.append(el);
  });
}

const BADGE = { no: ['NO ROOT', 'emerald'], yes: ['ROOT REQUIRED', 'rose'], s: ['IN BETTERCAP SESSION', 'sky'], none: ['NO NETWORK IMPACT', 'emerald'], pm: ['PASSIVE MONITORING', 'amber'], lab: ['LAB ONLY', 'rose'] };
const COL = { emerald: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30', rose: 'bg-rose-500/10 text-rose-300 border-rose-500/30', sky: 'bg-sky-500/10 text-sky-300 border-sky-500/30', amber: 'bg-amber-500/10 text-amber-300 border-amber-500/30' };
const badge = k => { const [t, c] = BADGE[k]; return h('span', 'text-[10px] font-semibold tracking-wide border rounded px-2 py-0.5 ' + COL[c], t); };
const LANG = { bash: 'Bash', bettercap: 'Bettercap console', caplet: 'Bettercap Caplet' };
const TOOL = { bash: 'Terminal · Kali Linux', bettercap: 'Bettercap', caplet: 'Bettercap' };
const WARN = 'LAB ONLY: this command starts a network monitoring session.\n\nRun it only on an isolated lab network or on systems you own or have explicit permission to test.\n\nمخصص للمختبر والشبكات المصرح بها فقط.\n\nCopy this command?';

function paint(code, lang) {
  const pre = h('pre', 'bg-slate-950 px-4 py-3 overflow-x-auto text-[13px] leading-6 font-mono text-left'); pre.dir = 'ltr';
  const c = h('code'); pre.append(c);
  if (lang === 'bash') { c.className = 'language-bash'; c.textContent = code; try { hljs.highlightElement(c); } catch (e) {} }
  else code.split('\n').forEach((ln, i, a) => {
    const m = ln.match(/^(\s*)(\S+)(.*)$/);
    if (m) { c.append(m[1], h('span', 'text-emerald-300', m[2])); m[3].split(/(<[^>]+>)/).forEach(p => c.append(/^<.*>$/.test(p) ? h('span', 'text-amber-300', p) : p)); } else c.append(ln);
    if (i < a.length - 1) c.append('\n');
  });
  return pre;
}
const row = (l, t) => { const d = h('div', 'text-sm text-slate-300 leading-6'); d.append(h('span', 'font-semibold text-slate-100 me-1.5', l + ':')); const s = h('span'); s.innerHTML = rich(t); d.append(s); return d; };

function cmd(o) {
  const w = h('div', 'rounded-xl border border-slate-800 bg-slate-900 overflow-hidden my-5');
  const top = h('div', 'flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 border-b border-slate-800');
  const l = h('div'); l.append(h('div', 'font-medium text-slate-100 text-sm', o.name), h('div', 'text-xs text-slate-400 mt-0.5', 'Tool: ' + TOOL[o.lang] + '  ·  Language: ' + LANG[o.lang]));
  const acts = h('div', 'flex gap-2');
  const pre = paint(o.code, o.lang);
  const bt = (t, f) => { const b = h('button', 'text-xs rounded-md border border-slate-700 px-2.5 py-1 text-slate-200 hover:bg-slate-800', t); b.type = 'button'; b.onclick = () => f(b); return b; };
  acts.append(
    bt('Hide code', b => { pre.classList.toggle('hidden'); b.textContent = pre.classList.contains('hidden') ? 'Show code' : 'Hide code'; }),
    bt('Copy', b => { if (o.lab && !confirm(WARN)) return; clip(o.code); b.textContent = 'Copied ✓'; toast('Command copied'); setTimeout(() => b.textContent = 'Copy', 1500); }));
  top.append(l, acts);
  const bd = h('div', 'flex flex-wrap gap-1.5 px-4 pt-3');
  [o.root, o.ik, o.lab && 'lab'].filter(Boolean).forEach(k => bd.append(badge(k)));
  w.append(top);
  if (bd.children.length) w.append(bd);
  if (o.lab) w.append(h('div', 'mx-4 mt-3 rounded-lg border border-amber-500/30 bg-amber-500/5 px-3 py-2 text-xs text-amber-200', '⚠ Affects network activity. Run only on an isolated or authorized lab network.'));
  const body = h('div', 'px-4 py-3 space-y-1');
  w.append(h('div', 'mt-3'), pre, body);
  if (o.why) body.append(row(o.wl || 'Explanation', o.why));
  if (o.imp) body.append(row('Network impact', o.imp));
  if (o.exp) body.append(row('Expected result', o.exp));
  if (o.ar) body.append(arnote(o.ar));
  return w;
}

function quiz(C, cid, after) {
  const box = h('div', 'rounded-xl border border-slate-800 bg-slate-900 p-5 mt-4'); let i = 0, sc = 0;
  const draw = () => {
    box.replaceChildren();
    if (i >= C.quiz.length) {
      const p = P(); const best = Math.max(sc, (p[cid] || {}).best || 0); (p[cid] = p[cid] || {}).best = best; W(PK, p);
      setDone(cid, 'quiz', true); after();
      const b = h('button', 'px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium', 'Retake quiz'); b.onclick = () => { i = 0; sc = 0; draw(); };
      box.append(h('h3', 'text-xl font-semibold text-slate-100', 'Your score: ' + sc + ' / ' + C.quiz.length), h('p', 'text-slate-400 my-2', 'Best score: ' + best + ' / ' + C.quiz.length), b); return;
    }
    const q = C.quiz[i], fb = h('div'), t = h('p', 'text-slate-100 font-medium mb-3'); t.innerHTML = rich(q.q);
    box.append(h('p', 'text-xs text-slate-400 mb-2', 'Question ' + (i + 1) + ' of ' + C.quiz.length), t);
    const btns = q.o.map((o, k) => {
      const b = h('button', 'block w-full text-start rounded-lg border border-slate-700 px-4 py-2.5 mb-2 text-sm text-slate-200 hover:border-emerald-500/60');
      b.innerHTML = '<span class="font-mono text-slate-400 me-2">' + 'ABCD'[k] + '.</span>' + rich(o);
      b.onclick = () => {
        btns.forEach((x, j) => { x.disabled = true; x.classList.remove('border-slate-700', 'hover:border-emerald-500/60'); x.classList.add(j === q.a ? 'border-emerald-500' : j === k ? 'border-rose-500' : 'border-slate-800'); if (j === q.a) x.classList.add('bg-emerald-500/10'); else if (j === k) x.classList.add('bg-rose-500/10'); });
        if (k === q.a) sc++;
        const nx = h('button', 'mt-3 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium', i + 1 < C.quiz.length ? 'Next question' : 'See score'); nx.onclick = () => { i++; draw(); };
        fb.append(h('p', 'text-sm mt-2 font-medium ' + (k === q.a ? 'text-emerald-300' : 'text-rose-300'), k === q.a ? 'Correct.' : 'Not quite. The correct answer is ' + 'ABCD'[q.a] + '.'), para(q.e, 'text-sm text-slate-300 leading-6 mt-1'), nx);
      };
      box.append(b); return b;
    });
    box.append(fb);
  };
  draw(); return box;
}

function item(it, C, cid, after) {
  switch (it[0]) {
    case 'p': return para(it[1]);
    case 'h': return h('h3', 'text-lg font-semibold text-slate-100 mt-7 mb-2', it[1]);
    case 'ul': return list('ul', it[1]);
    case 'ol': return list('ol', it[1]);
    case 'ar': return arnote(it[1]);
    case 'cmd': return cmd(it[1]);
    case 'warn': { const d = h('div', 'rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 my-4'); d.append(h('div', 'font-semibold text-amber-300 mb-1', '⚠ ' + it[1])); it[2].forEach(t => d.append(para(t, 'text-amber-100/90 leading-7'))); if (it[3]) d.append(arnote(it[3])); return d; }
    case 'prob': { const o = it[1], d = h('div', 'rounded-xl border border-slate-800 bg-slate-900 p-4 my-4'); d.append(h('h3', 'font-semibold text-slate-100 mb-2', o.t), row('Possible cause', o.cause), row('Solution', o.fix)); if (o.cmd) d.append(cmd(o.cmd)); return d; }
    case 'refs': { const d = h('ul', 'list-disc ps-6 text-slate-300 space-y-1'); it[1].forEach(([t, u]) => { const l = h('li'), a = h('a', 'text-emerald-400 hover:underline', t); a.href = u; a.target = '_blank'; a.rel = 'noopener noreferrer'; l.append(a); d.append(l); }); return d; }
    case 'quiz': return quiz(C, cid, after);
  }
}

function build(C, cid) {
  document.title = C.title + ' | DevVault Academy';
  const app = $('#app'), secs = C.sections; let cur;
  const hero = h('section', 'mb-8 max-w-3xl');
  const chips = h('div', 'flex flex-wrap gap-2 my-3'); [C.level, C.category, C.duration].forEach(x => chips.append(h('span', 'text-xs rounded-md border border-slate-700 text-slate-300 px-2.5 py-1', x)));
  hero.append(h('p', 'font-mono text-xs text-emerald-400', 'COURSE ' + C.num), h('h1', 'text-3xl font-bold mt-1', C.title), chips, para(C.desc), arnote(C.ar));
  const side = h('aside', 'lg:sticky lg:top-20 self-start space-y-4'), main = h('div', 'min-w-0');
  const pl = h('div', 'text-sm text-slate-300'), pb = bar(0), res = h('div', 'space-y-2 text-sm'), nav = h('nav', 'space-y-1'), nb = {};
  const search = h('input', 'w-full rounded-lg bg-slate-900 border border-slate-800 px-3 py-2 text-sm focus:outline-none focus:border-emerald-500'); search.type = 'search'; search.placeholder = 'Search lessons…'; search.setAttribute('aria-label', 'Search lessons');
  secs.forEach(s => { const a = h('a', 'flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-slate-800'); a.href = '#' + s.id; const ck = h('span', 'w-4 text-emerald-400'); a.append(ck, h('span', '', s.short)); a._ck = ck; nb[s.id] = a; nav.append(a); });
  side.append(pl, pb, search, res, nav);
  const refresh = () => {
    const d = doneSet(cid), n = secs.filter(s => d[s.id]).length, p = Math.round(100 * n / secs.length);
    pl.textContent = 'Progress: ' + p + '% (' + n + ' of ' + secs.length + ' complete)'; pb.firstChild.style.width = p + '%';
    secs.forEach(s => { nb[s.id]._ck.textContent = d[s.id] ? '✓' : ''; nb[s.id].classList.toggle('bg-slate-800', cur === s.id); });
  };
  const show = id => {
    const i = Math.max(0, secs.findIndex(s => s.id === id)), s = secs[i]; cur = s.id; main.replaceChildren();
    main.append(h('h2', 'text-2xl font-semibold text-slate-100 mb-4', s.title));
    const after = () => { refresh(); const c = main.querySelector('input[type=checkbox]'); if (c) c.checked = true; };
    s.items.forEach(it => { const e = item(it, C, cid, after); if (e) main.append(e); });
    const lab = h('label', 'flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 mt-8 cursor-pointer');
    const cb = h('input', 'h-4 w-4 accent-emerald-500'); cb.type = 'checkbox'; cb.checked = !!doneSet(cid)[s.id]; cb.onchange = () => { setDone(cid, s.id, cb.checked); refresh(); };
    lab.append(cb, h('span', 'text-sm text-slate-200', 'Mark this lesson as complete')); main.append(lab);
    const nv = h('div', 'flex justify-between mt-4 text-sm');
    const lk = (t, j) => { const a = h('a', 'text-slate-300 hover:text-emerald-400', t); a.href = '#' + secs[j].id; return a; };
    nv.append(i > 0 ? lk('← ' + secs[i - 1].short, i - 1) : h('span'), i < secs.length - 1 ? lk(secs[i + 1].short + ' →', i + 1) : h('span')); main.append(nv);
    refresh(); window.scrollTo({ top: 0 });
  };
  const txt = v => typeof v === 'string' ? v : Array.isArray(v) ? v.map(txt).join(' ') : v && typeof v === 'object' ? Object.values(v).map(txt).join(' ') : '';
  search.oninput = () => {
    const q = search.value.trim().toLowerCase(); res.replaceChildren(); if (q.length < 2) return;
    const hits = secs.map(s => ({ s, t: txt([s.title, s.items]).replace(/[`*]|\[\[|\]\]/g, '') })).filter(x => x.t.toLowerCase().includes(q));
    if (!hits.length) { res.append(h('p', 'text-slate-500 px-1', 'No results.')); return; }
    hits.forEach(({ s, t }) => { const k = t.toLowerCase().indexOf(q), a = h('a', 'block rounded-lg border border-slate-800 px-3 py-2 hover:border-emerald-500/60'); a.href = '#' + s.id; a.append(h('div', 'text-slate-100', s.short), h('div', 'text-xs text-slate-400 mt-0.5', '…' + t.slice(Math.max(0, k - 30), k + 60).replace(/\s+/g, ' ') + '…')); res.append(a); });
  };
  const grid = h('div', 'grid lg:grid-cols-[17rem_minmax(0,1fr)] gap-8'); grid.append(side, main);
  app.replaceChildren(hero, grid);
  addEventListener('hashchange', () => show(location.hash.slice(1)));
  show(location.hash.slice(1));
}

function course() {
  const id = new URLSearchParams(location.search).get('c'), app = $('#app');
  if (!LIST.some(c => c.live && c.id === id)) { app.append(h('p', 'text-slate-400 py-20 text-center', 'Course not found. Choose a course from the Academy home.')); return; }
  const s = h('script'); s.src = 'courses/' + id + '.js';
  s.onload = () => build(window.COURSES[id], id); s.onerror = () => { app.textContent = 'Could not load the course.'; };
  document.head.append(s);
}

const el = hdr(); $('#hdr').replaceWith(el);
$('#arBtn').onclick = () => { W(AK, !R(AK, true)); applyAR(); };
applyAR();
document.body.dataset.page === 'hub' ? hub() : course();
})();
