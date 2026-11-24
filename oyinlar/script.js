'use strict';
/* ========== YORDAMCHI FUNKSIYALAR ========== */
const $ = s => document.querySelector(s);
const rnd = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
const pick = a => a[rnd(0, a.length - 1)];
const sh = a => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = rnd(0, i);[a[i], a[j]] = [a[j], a[i]]; } return a; };
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const store = {
  get(k, d) { try { const v = localStorage.getItem('meta_' + k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem('meta_' + k, JSON.stringify(v)); } catch (e) { } }
};
const today = () => new Date().toLocaleDateString('sv');

/* ========== HOLAT ========== */
const S = { name: store.get('name', ''), age: store.get('age', null), theme: store.get('theme', 'dark'), sound: store.get('sound', true), results: store.get('results', []) };
let V = { v: 'welcome', f: 'all', q: '' };
let P = null; // joriy o'yin
const CATS = [
  { r: '3–5 yosh', min: 3, max: 5, ic: '🧸', n: 'Kichik kashfiyotchilar', d: 'Ranglar, hayvonlar, shakllar va xotira bilan o‘ynab o‘rganing.' },
  { r: '6–9 yosh', min: 6, max: 9, ic: '🎨', n: 'Zukko o‘quvchilar', d: 'Hisoblash, so‘z topish, labirint va mantiqiy jumboqlar.' },
  { r: '10–15 yosh', min: 10, max: 15, ic: '🚀', n: 'Mantiq kashshoflari', d: 'IQ testlar, shifrlar, geometriya va tezkor fikrlash.' },
  { r: '16–20 yosh', min: 16, max: 20, ic: '🧠', n: 'Brain Masters', d: 'Strategiya, deduksiya, analitika va murakkab masalalar.' }
];
const catOf = a => CATS.findIndex(c => a >= c.min && a <= c.max);

/* ========== OVOZ ========== */
let AC;
function beep(f, d, t = 'sine', s = 0) {
  if (!S.sound) return;
  try {
    AC = AC || new (window.AudioContext || window.webkitAudioContext)();
    const o = AC.createOscillator(), g = AC.createGain(), T = AC.currentTime + s;
    o.type = t; o.frequency.value = f; g.gain.setValueAtTime(.08, T); g.gain.exponentialRampToValueAtTime(.0001, T + d);
    o.connect(g); g.connect(AC.destination); o.start(T); o.stop(T + d);
  } catch (e) { }
}
const snd = k => k === 'ok' ? (beep(660, .12), beep(880, .22, 'sine', .12)) : k === 'bad' ? beep(180, .3, 'sawtooth') : beep(520, .05);

/* ========== SAVOL GENERATORLARI ========== */
function mc(p, a, w, x = {}) {
  w = [...new Set(w)].filter(v => v !== a);
  const o = sh([a, ...w.slice(0, 3)]);
  return { t: 'mc', p, o, a: o.indexOf(a), ...x };
}
function nums(a, s = 3, mn = 0) {
  const w = new Set(); let g = 0;
  while (w.size < 3 && g++ < 60) { const v = a + rnd(-s, s); if (v !== a && v >= mn) w.add(v); }
  let k = 1; while (w.size < 3) w.add(a + s + k++);
  return [...w].map(String);
}
const numQ = (p, a, s, mn = 0) => mc(p, String(a), nums(a, s, mn));
const bk = items => { let s = []; return i => { if (i === 0 || !s.length) s = sh(items); const x = s[i % s.length]; return mc(x[0], x[1], x.slice(2)); }; };
function seqQ(set, hard) {
  const [A, B, C] = sh(set), m = { A, B, C };
  const Pt = hard ? [['ABBABB', 'A'], ['ABCABC', 'A'], ['AABAAB', 'A'], ['ABACABA', 'C']] : [['ABABA', 'B'], ['AABAA', 'B'], ['ABCAB', 'C']];
  const [s, r] = pick(Pt), ans = m[r];
  return mc(`<div class="big">${[...s].map(c => m[c]).join(' ')} ❓</div>`, ans, sh(set.filter(x => x !== ans)));
}
function memQ(k, ms, pool, pos) {
  const it = sh(pool).slice(0, k), flash = `<div class="big">${it.join(' ')}</div>`;
  if (pos) { const j = rnd(0, k - 1); return mc(`${j + 1}-element qaysi edi?`, it[j], sh(it.filter((_, x) => x !== j)), { flash, ms }); }
  return mc("Qaysi biri ko'rsatilgan edi?", pick(it), sh(pool.filter(x => !it.includes(x))), { flash, ms });
}
function oddQ(n, pairs) {
  const [b, o] = sh(pick(pairs)), cells = Array(n * n).fill(b), a = rnd(0, n * n - 1);
  cells[a] = o; return { t: 'odd', p: 'Boshqacha rasmni toping! 🔎', cells, a, cols: n };
}
function maxQ(a) { return a; }
const caesar = (w, k) => [...w].map(c => String.fromCharCode((c.charCodeAt(0) - 65 + k) % 26 + 65)).join('');
const cipherQ = k => { const w = pick(WD); return mc(`Shifr: <b>${caesar(w, k)}</b><br>Har harf alifboda ${k} qadam oldinga siljigan. Asl so'z qaysi?`, w, sh(WD)); };

/* ========== MA'LUMOTLAR ========== */
const COL = [["Qizil", "#ef4444"], ["Ko'k", "#3b82f6"], ["Sariq", "#facc15"], ["Yashil", "#22c55e"], ["To'q sariq", "#fb923c"], ["Binafsha", "#a855f7"], ["Pushti", "#ec4899"]];
const dot = c => `<i class="dot" style="background:${c}"></i>`;
const ANI = [["🐶", "It"], ["🐱", "Mushuk"], ["🐮", "Sigir"], ["🐷", "Cho'chqa"], ["🐸", "Baqa"], ["🐵", "Maymun"], ["🦁", "Sher"], ["🐘", "Fil"], ["🐰", "Quyon"], ["🐔", "Tovuq"], ["🐴", "Ot"], ["🐻", "Ayiq"]];
const FR = ["🍎", "🍌", "🍇", "🍓", "🍊", "🍉", "🍐", "🍒"], TH = ["🚗", "⚽", "🧸", "🏠", "👟", "✏️", "🪑", "🚲"], VEH = ["🚗", "🚌", "🚲", "✈️", "🚀", "🚢"];
const SHP = [["Doira", "●", "#ef4444"], ["Kvadrat", "■", "#3b82f6"], ["Uchburchak", "▲", "#22c55e"], ["Yurak", "♥", "#ec4899"], ["Yulduz", "★", "#facc15"]];
const shp = s => `<span style="color:${s[2]};font-size:3rem">${s[1]}</span>`;
const CSET = ["🔴", "🔵", "🟡", "🟢", "🟣", "🟠"], SSET = ["🔺", "🟦", "⭕", "⭐", "🔶", "🟩"];
const EM = [...ANI.map(a => a[0]), ...FR];
const NUM = Array.from({ length: 90 }, (_, i) => String(i + 10));
const WORDS = [["🍎", "OLMA"], ["✏️", "QALAM"], ["📖", "KITOB"], ["🏫", "MAKTAB"], ["🌳", "DARAXT"], ["☀️", "QUYOSH"], ["🐟", "BALIQ"], ["🚗", "MASHINA"], ["🌸", "GUL"], ["⏰", "SOAT"], ["🥚", "TUXUM"]];
const WD = ["KITOB", "MAKTAB", "QALAM", "DARAXT", "OLMA", "BOLA", "SOAT", "STOL", "DAFTAR", "XONA", "TOSH", "SUV"];
const DIFF = [["🐶", "🐕"], ["😀", "😃"], ["🍎", "🍏"], ["🌞", "🌝"], ["🔴", "🟠"], ["⭐", "🌟"], ["🐱", "🐈"], ["🌷", "🌹"]];
const SENT = ["Men maktabda o'qiyman", "Bugun havo juda issiq", "Dadam ishga mashinada ketdi", "Biz kitoblarni kutubxonadan oldik", "Akam menga yangi daftar sovg'a qildi", "Bahorda daraxtlar gullaydi", "Toshkent shahri O'zbekistonning poytaxti hisoblanadi", "Opam har kuni ertalab yuguradi", "Bolalar bog'da quvnoq o'ynashmoqda", "Men kelajakda dasturchi bo'lmoqchiman"];

const G = (n, i, d, f, o = {}) => ({ n, i, d, f, k: 8, t: 15, ...o });
const sameQ = (e, n) => `<div class="big">${e.repeat(n)}</div>`;

/* ========== 40 TA O'YIN ========== */
const GAMES = [
  /* ---- 3–5 yosh ---- */
  [
    G("Ranglarni top", "🎨", "Berilgan rangni tanlang.", () => { const s = sh(COL), t = s[0]; return mc(`<b>${t[0]}</b> rangni top`, dot(t[1]), s.slice(1, 4).map(x => dot(x[1]))); }, { t: 20 }),
    G("Hayvonlarni tanish", "🐶", "Hayvon rasmini toping.", () => { const s = sh(ANI); return mc(`<b>${s[0][1]}</b>ni top`, s[0][0], s.slice(1, 4).map(x => x[0])); }, { t: 20 }),
    G("Shakllarni top", "🔺", "Doira, kvadrat, uchburchak...", () => { const s = sh(SHP); return mc(`<b>${s[0][0]}</b>ni top`, shp(s[0]), s.slice(1, 4).map(shp)); }, { t: 20 }),
    G("Katta yoki kichik", "🐘", "Predmetlarni taqqoslang.", () => {
      const e = pick(["🐘", "🏠", "🌳", "🚗", "🍎", "⚽"]), big = Math.random() < .5, f = z => `<span style="font-size:${z}px;line-height:1">${e}</span>`, t = big ? 90 : 34;
      return mc(`Qaysi biri <b>${big ? 'katta' : 'kichik'}</b>?`, f(t), [90, 60, 34].filter(z => z !== t).map(f));
    }, { t: 20 }),
    G("Mevalarni top", "🍎", "Mevalarni ajrating.", () => {
      if (Math.random() < .5) return mc("Qaysi biri <b>meva</b>?", pick(FR), sh(TH));
      return mc("Qaysi biri <b>meva emas</b>?", pick(TH), sh(FR));
    }, { t: 20 }),
    G("Xotira kartalari", "🃏", "Bir xil rasmlarni toping.", null, { sp: 'cards', k: 3 }),
    G("Sanash o'yini", "🔢", "1 dan 10 gacha sanang.", () => { const n = rnd(1, 10), e = pick(["🍎", "⭐", "🐟", "🎈", "🍓"]); return mc(sameQ(e, n) + "Nechta?", String(n), nums(n, 2, 1)); }, { t: 25 }),
    G("Ortiqchasini top", "🧩", "Boshqalardan farqli predmet.", () => {
      const c = { a: ANI.map(x => x[0]), f: FR, v: VEH }, ks = sh(Object.keys(c)), x = sh(c[ks[0]]), o = pick(c[ks[1]]);
      return mc("Ortiqchasini top!", o, x.slice(0, 3));
    }, { t: 20 }),
    G("Soyani top", "👤", "Predmetning soyasini toping.", () => {
      const s = sh(EM), f = e => `<span class="sh">${e}</span>`;
      return mc(`<div class="big">${s[0]}</div>ning soyasini top`, f(s[0]), s.slice(1, 4).map(f));
    }, { t: 20 }),
    G("Rangli ketma-ketlik", "🔴", "Ranglarni davom ettiring.", () => seqQ(CSET, false), { t: 20 })
  ],
  /* ---- 6–9 yosh ---- */
  [
    G("Matematik misollar", "➕", "Qo'shish va ayirish.", i => {
      const m = 10 + Math.min(i, 5) * 2; let a = rnd(1, m), b = rnd(1, m);
      if (Math.random() < .5) return numQ(`${a} + ${b} = ?`, a + b, 3);
      if (a < b) [a, b] = [b, a]; return numQ(`${a} − ${b} = ?`, a - b, 3);
    }, { k: 10, t: 15 }),
    G("So'z topish", "🔤", "Harflardan so'z tuzing.", () => {
      const [e, w] = pick(WORDS); let s = w; for (let g = 0; g < 30 && s === w; g++) s = sh([...w]).join('');
      return mc(`<div class="big">${e}</div><div class="big">${s}</div>So'zni toping`, w, sh(WORDS.map(x => x[1])));
    }, { t: 25 }),
    G("Xotira testi", "🧠", "Ko'rganingizni eslab qoling.", () => memQ(4, 3000, EM, false), { t: 15 }),
    G("Raqamlar ketma-ketligi", "🔢", "Keyingi sonni toping.", i => {
      if (i % 3 === 2) { const a = rnd(1, 4); return numQ(`${a}, ${a * 2}, ${a * 4}, ${a * 8}, ?`, a * 16, 6); }
      const a = rnd(1, 20), d = rnd(2, 6); return numQ(`${a}, ${a + d}, ${a + 2 * d}, ${a + 3 * d}, ?`, a + 4 * d, 4);
    }, { t: 20 }),
    G("Mantiqiy savollar", "💡", "Mantiq bilan javob bering.", bk([
      ["Mushukning 4 ta oyog'i bor. 2 ta mushukning nechta oyog'i bor?", "8", "6", "4", "10"],
      ["Qaysi biri eng kichik: kun, hafta, oy, yil?", "kun", "oy", "hafta", "yil"],
      ["Qaysi biri ortiqcha: olma, nok, sabzi, shaftoli?", "sabzi", "olma", "nok", "shaftoli"],
      ["Bugun dushanba. Ertaga qaysi kun?", "Seshanba", "Chorshanba", "Yakshanba", "Juma"],
      ["Qaysi og'irroq: 1 kg paxta yoki 1 kg temir?", "Ikkalasi teng", "Paxta", "Temir", "Bilmayman"],
      ["Ali Validan baland, Vali Soliddan baland. Eng past kim?", "Solid", "Ali", "Vali", "Hammasi teng"],
      ["Savatda 5 ta olma bor edi, 2 tasini yedik. Nechta qoldi?", "3", "2", "4", "7"],
      ["Yilda nechta fasl bor?", "4", "3", "5", "6"],
      ["Qaysi biri hayvon emas: sher, bo'ri, stol, tulki?", "stol", "sher", "bo'ri", "tulki"],
      ["Haftada necha kun bor?", "7", "5", "6", "8"]
    ]), { t: 25 }),
    G("Farqlarni top", "🔎", "Boshqacha rasmni toping.", i => oddQ(Math.min(3 + Math.floor(i / 3), 6), DIFF), { t: 20 }),
    G("Labirintdan chiqish", "🌀", "Yo'lni topib, finishga yeting.", null, { sp: 'maze', k: 3 }),
    G("Shakllar ketma-ketligi", "🔺", "Shakllarni davom ettiring.", () => seqQ(SSET, true), { t: 20 }),
    G("Tez hisoblash", "⚡", "Tez hisoblang — 6 soniya!", i => {
      const k = i % 3;
      if (k === 0) { const a = rnd(5, 30), b = rnd(5, 30); return numQ(`${a} + ${b} = ?`, a + b, 4); }
      if (k === 1) { const a = rnd(20, 50), b = rnd(1, 19); return numQ(`${a} − ${b} = ?`, a - b, 4); }
      const a = pick([2, 3, 4, 5, 10]), b = rnd(2, 9); return numQ(`${a} × ${b} = ?`, a * b, 4);
    }, { k: 10, t: 6 }),
    G("Jumboq yechish", "🧩", "Jumboqlarning javobini toping.", bk([
      ["Doim yuradi, lekin joyidan jilmaydi. Bu nima?", "Soat", "Mashina", "Daryo", "Bulut"],
      ["Uyi bor, eshigi yo'q. Ichida sariq va oq bor. Bu nima?", "Tuxum", "Qovun", "Olma", "Non"],
      ["Men doim oldinda turaman, lekin hech kim meni ko'ra olmaydi. Men nimaman?", "Kelajak", "Soya", "Yo'l", "Shamol"],
      ["Qaysi sonni 2 ga ko'paytirsang ham, 2 ga qo'shsang ham bir xil natija chiqadi?", "2", "1", "0", "4"],
      ["3 ta olma bor. Sen 2 tasini olding. Sening nechta olmang bor?", "2", "1", "3", "5"],
      ["Qaysi oy eng qisqa?", "Fevral", "Aprel", "Iyun", "Mart"],
      ["Bir juft paypoqda nechta paypoq bor?", "2", "1", "4", "3"],
      ["Qaysi sonni 0 ga ko'paytirsang 0 chiqadi?", "Har qanday son", "Faqat 1", "Faqat 0", "Hech qaysi"]
    ]), { t: 30 })
  ],
  /* ---- 10–15 yosh ---- */
  [
    G("IQ test", "🎯", "Mantiqiy IQ savollari.", bk([
      ["2, 4, 8, 16, ?", "32", "24", "30", "64"],
      ["Ko'z : ko'rish = quloq : ?", "eshitish", "gapirish", "hidlash", "yurish"],
      ["Qaysi biri tub son emas: 3, 5, 9, 11?", "9", "3", "5", "11"],
      ["5 ta mashina 5 daqiqada 5 ta detal yasasa, 100 ta mashina 100 ta detalni necha daqiqada yasaydi?", "5", "100", "20", "50"],
      ["1, 1, 2, 3, 5, 8, ?", "13", "11", "12", "15"],
      ["Soat 3:00 da soat va minut millari orasidagi burchak necha gradus?", "90", "60", "120", "180"],
      ["Uchta ketma-ket sonning yig'indisi 42. Eng kichigi qaysi?", "13", "12", "14", "15"],
      ["To'g'ri to'rtburchakning uzunligi 8, eni 5. Perimetri?", "26", "40", "13", "30"],
      ["Eng katta bir xonali son va eng kichik ikki xonali son yig'indisi?", "19", "18", "20", "10"],
      ["Qaysi biri boshqalardan farq qiladi: kvadrat, to'g'ri to'rtburchak, uchburchak, romb?", "uchburchak", "kvadrat", "to'g'ri to'rtburchak", "romb"]
    ]), { k: 10, t: 40 }),
    G("Matematik challenge", "🧮", "Ko'paytirish, daraja, foiz.", i => {
      const k = i % 4;
      if (k === 0) { const a = rnd(12, 25), b = rnd(3, 9); return numQ(`${a} × ${b} = ?`, a * b, 10); }
      if (k === 1) { const a = rnd(11, 20); return numQ(`${a}² = ?`, a * a, 15); }
      if (k === 2) { const p = pick([10, 20, 25, 50, 75]), n = pick([40, 80, 120, 200, 360]); return numQ(`${n} sonining ${p}% i qancha?`, n * p / 100, 10); }
      const a = rnd(2, 9), b = rnd(2, 9), c = rnd(2, 9); return numQ(`(${a} + ${b}) × ${c} = ?`, (a + b) * c, 8);
    }, { k: 10, t: 25 }),
    G("Murakkab xotira testi", "🧠", "Raqamlar ketma-ketligini eslang.", () => memQ(6, 4000, NUM, true), { t: 15 }),
    G("Mantiqiy ketma-ketlik", "🔗", "Qonuniyatni toping.", i => {
      const k = rnd(0, 5), a = rnd(1, 5);
      if (k === 0) return numQ(`${a}, ${a * 3}, ${a * 9}, ${a * 27}, ?`, a * 81, 20);
      if (k === 1) return numQ(`${a}, ${a + 3}, ${a + 2}, ${a + 5}, ${a + 4}, ?`, a + 7, 3);
      if (k === 2) { const n = rnd(3, 7); return numQ(`${[...Array(4)].map((_, j) => (n + j) ** 2).join(', ')}, ?`, (n + 4) ** 2, 8); }
      if (k === 3) return numQ('1, 3, 6, 10, 15, ?', 21, 4);
      if (k === 4) return numQ(`${a}, ${a + 1}, ${a + 3}, ${a + 6}, ${a + 10}, ?`, a + 15, 3);
      const x = rnd(1, 4), y = rnd(2, 5); return numQ(`${x}, ${y}, ${x + y}, ${x + 2 * y}, ${2 * x + 3 * y}, ?`, 3 * x + 5 * y, 5);
    }, { t: 30 }),
    G("So'zlardan gap tuzish", "📝", "To'g'ri gapni tanlang.", i => {
      const s = SENT[i % SENT.length], w = s.split(' ');
      const alt = new Set(); let g = 0;
      while (alt.size < 3 && g++ < 80) { const x = sh(w).join(' '); if (x !== s) alt.add(x); }
      return mc(`<div class="qp">So'zlar: <b>${sh(w).join(' · ')}</b></div>To'g'ri gapni tanlang`, s, [...alt]);
    }, { t: 30, _s: 1 }),
    G("Matematik detektiv", "🕵️", "Yashirin sonni toping.", i => {
      if (i % 2) { const a = rnd(10, 30), b = rnd(2, 9); return numQ(`Ikki son yig'indisi ${a + b}, ayirmasi ${a - b}. Katta son qaysi?`, a, 5); }
      const x = rnd(2, 15), m = rnd(2, 5), b = rnd(1, 9);
      return numQ(`Men o'ylagan sonni ${m} ga ko'paytirib, ${b} qo'shsam, ${x * m + b} chiqadi. Qaysi son?`, x, 4);
    }, { t: 30 }),
    G("Shifrni yechish", "🔐", "Shifrlangan so'zni toping.", () => cipherQ(rnd(1, 3)), { t: 40 }),
    G("Geometrik mantiq", "📐", "Yuza, perimetr, burchak.", i => {
      const k = i % 5;
      if (k === 0) { const a = rnd(3, 15), b = rnd(3, 15); return numQ(`Uzunligi ${a}, eni ${b} bo'lgan to'g'ri to'rtburchak yuzasi?`, a * b, 8); }
      if (k === 1) { const a = rnd(3, 20); return numQ(`Kvadrat tomoni ${a}. Perimetri?`, 4 * a, 6); }
      if (k === 2) { const a = rnd(30, 80), b = rnd(30, 80); return numQ(`Uchburchakning ikki burchagi ${a}° va ${b}°. Uchinchi burchagi necha gradus?`, 180 - a - b, 10); }
      if (k === 3) { const t = pick([[3, 4, 5], [6, 8, 10], [5, 12, 13], [9, 12, 15]]); return numQ(`To'g'ri burchakli uchburchak katetlari ${t[0]} va ${t[1]}. Gipotenuza?`, t[2], 3); }
      const n = rnd(5, 9); return numQ(`${n} burchakli ko'pburchak ichki burchaklari yig'indisi necha gradus?`, (n - 2) * 180, 180);
    }, { k: 10, t: 40 }),
    G("Tezkor fikrlash", "⚡", "5 soniyada javob bering!", i => {
      const k = i % 3;
      if (k === 0) { const a = rnd(6, 15), b = rnd(6, 15); return numQ(`${a} × ${b} = ?`, a * b, 10); }
      if (k === 1) { const a = rnd(10, 50), b = rnd(10, 50), c = rnd(10, 50); return numQ(`${a} + ${b} + ${c} = ?`, a + b + c, 8); }
      let a = rnd(6, 12), b = rnd(6, 12), c = rnd(6, 12), d = rnd(6, 12); while (a * b === c * d) c = rnd(6, 12);
      const A = `${a} × ${b}`, B = `${c} × ${d}`; return mc("Qaysi ifoda katta?", a * b > c * d ? A : B, [a * b > c * d ? B : A, "Teng"]);
    }, { k: 10, t: 6 }),
    G("Murakkab jumboqlar", "🧩", "Qiyin masalalar.", bk([
      ["Qalam va daftar birgalikda 11 000 so'm. Daftar qalamdan 10 000 so'm qimmat. Qalam necha so'm?", "500", "1 000", "1 500", "0"],
      ["Ota 40 yoshda, o'g'li 10 yoshda. Necha yildan keyin ota o'g'ildan 3 baravar katta bo'ladi?", "5", "10", "15", "20"],
      ["5 ta ketma-ket toq sonning yig'indisi 55. Eng kichigi?", "7", "5", "9", "11"],
      ["Hovuzda nilufar har kuni ikki baravar ko'payadi. 30 kunda hovuz to'ladi. Yarmi qaysi kuni to'ladi?", "29", "15", "28", "20"],
      ["1 dan 100 gacha nechta son 9 raqamini o'z ichiga oladi?", "19", "20", "10", "18"],
      ["Qutida 10 ta qizil va 10 ta ko'k paypoq bor. Qorong'uda kamida nechta olsang, bir xil rangli juft kafolatlanadi?", "3", "2", "11", "4"],
      ["Soat 6 marta urganda 5 soniya ketadi. 12 marta urganda necha soniya ketadi?", "11", "10", "12", "22"],
      ["Qaysi sonni 2 ga bo'lib, 3 ga ko'paytirsangiz 27 chiqadi?", "18", "9", "13", "54"],
      ["3 ta mushuk 3 ta sichqonni 3 daqiqada tutadi. 100 ta mushuk 100 ta sichqonni necha daqiqada tutadi?", "3", "100", "1", "33"],
      ["1 dan 10 gacha barcha sonlar yig'indisi?", "55", "50", "45", "60"]
    ]), { k: 10, t: 50 })
  ],
  /* ---- 16–20 yosh ---- */
  [
    G("Advanced IQ Challenge", "🎯", "Murakkab IQ savollari.", bk([
      ["3, 7, 15, 31, ?", "63", "47", "62", "61"],
      ["Barcha mushuklar hayvon. Ba'zi hayvonlar uyda yashaydi. Qaysi xulosa albatta to'g'ri?", "Barcha mushuklar hayvon", "Barcha mushuklar uyda yashaydi", "Hech bir hayvon uyda yashamaydi", "Ba'zi mushuklar uyda yashamaydi"],
      ["Agar 3x + 7 = 28 bo'lsa, x = ?", "7", "6", "8", "9"],
      ["2, 3, 5, 7, 11, 13, ?", "17", "15", "19", "21"],
      ["4, 9, 16, 25, ?", "36", "30", "35", "49"],
      ["log₂(64) = ?", "6", "5", "8", "4"],
      ["Ba'zi A lar B, barcha B lar C bo'lsa, qaysi xulosa to'g'ri?", "Ba'zi A lar C", "Barcha A lar C", "Hech bir A C emas", "Barcha C lar A"],
      ["Kub qirrasi 3 ga teng. Hajmi?", "27", "9", "18", "36"],
      ["1, 4, 9, 16, 25 sonlarining o'rtacha arifmetigi?", "11", "10", "12", "15"],
      ["AZ, BY, CX, ?", "DW", "DV", "EW", "CW"]
    ]), { k: 10, t: 45 }),
    G("Matematik strategiya", "♟️", "Ifodalar, foiz, tenglama.", i => {
      const k = i % 4;
      if (k === 0) { const a = rnd(2, 9), b = rnd(2, 9), c = rnd(2, 9), d = rnd(1, Math.min(9, a + b * c)); return numQ(`${a} + ${b} × ${c} − ${d} = ?`, a + b * c - d, 6); }
      if (k === 1) { const b = pick([200, 400, 800, 1000]), d1 = pick([10, 25]), d2 = pick([10, 20, 50]); return numQ(`Narx ${b} so'm. Avval ${d1}%, keyin yana ${d2}% chegirma qilindi. Yakuniy narx (so'm)?`, b * (100 - d1) * (100 - d2) / 10000, 12); }
      if (k === 2) { const x = rnd(2, 12), a = rnd(2, 9), b = rnd(1, 20); return numQ(`${a}x + ${b} = ${a * x + b}. x = ?`, x, 4, 1); }
      const a = rnd(8, 15), b = rnd(2, 7); return numQ(`${a}² − ${b}² = ?`, a * a - b * b, 12);
    }, { k: 10, t: 40 }),
    G("Murakkab mantiqiy masalalar", "🧩", "Chuqur mantiqiy tahlil.", bk([
      ["Anvar Boburdan katta, Sardor Anvardan katta. Eng kichigi kim?", "Bobur", "Anvar", "Sardor", "Aniq emas"],
      ["Ikki qo'riqchidan biri doim rost, biri doim yolg'on gapiradi. Qaysi usul ishonchli?", "Bir qo'riqchiga \"Ikkinchisi qaysi eshikni ko'rsatadi?\" deb so'rab, teskarisini tanlash", "Ikkalasiga \"Siz rostmisiz?\" deb so'rash", "Tanga tashlash", "Birinchi eshikni tanlash"],
      ["Kechagi kun juma bo'lsa, ertaga qaysi kun?", "Yakshanba", "Shanba", "Dushanba", "Juma"],
      ["5 kishi bir-biri bilan bir martadan qo'l siqsa, jami nechta qo'l siqish bo'ladi?", "10", "20", "15", "25"],
      ["Qaysi eng kichik son 3 ga bo'lganda 2, 5 ga bo'lganda 3 qoldiq qoladi?", "8", "5", "13", "23"],
      ["Barcha A lar B, barcha B lar C. Barcha A lar C ga kiradimi?", "Ha", "Yo'q", "Ba'zan", "Aniq emas"],
      ["Poyezd soatiga 60 km tezlikda 2,5 soatda necha km yuradi?", "150", "120", "140", "160"],
      ["8 ta tangadan biri og'irroq. Pallali tarozida kamida necha marta tortib uni topish kafolatlanadi?", "2", "1", "3", "4"],
      ["3 ta sonning o'rtachasi 20. Ikkitasi 15 va 25. Uchinchisi?", "20", "10", "30", "25"],
      ["Qaysi biri eng katta?", "2¹⁰", "3⁶", "10³", "5⁴"]
    ]), { k: 10, t: 50 }),
    G("Raqamli shifrlar", "🔐", "Raqamlar va kodlarni yeching.", i => {
      const k = i % 3;
      if (k === 0) { const w = pick(WD); return mc(`Kod: <b>${[...w].map(c => c.charCodeAt(0) - 64).join('-')}</b><br>(A=1, B=2, ... Z=26) So'zni toping`, w, sh(WD)); }
      if (k === 1) { const v = rnd(9, 63); return numQ(`<b>${v.toString(2)}</b> ikkilik son o'nlik sanoq sistemasida nechaga teng?`, v, 8); }
      return cipherQ(rnd(3, 7));
    }, { k: 10, t: 45 }),
    G("Analitik fikrlash", "📊", "Ma'lumotlarni tahlil qiling.", () => {
      const D = ["Dushanba", "Seshanba", "Chorshanba", "Payshanba"]; let v;
      do { v = [0, 0, 0, 0].map(() => rnd(5, 20) * 10); } while (new Set(v).size < 4 || v.reduce((a, b) => a + b) % 4);
      const s = v.reduce((a, b) => a + b), t = `<div class="qp">Kunlik savdo (dona):<br>${D.map((d, j) => `${d}: <b>${v[j]}</b>`).join(' · ')}</div>`, k = rnd(0, 3);
      if (k === 0) return mc(t + "Eng ko'p savdo qaysi kun bo'lgan?", D[v.indexOf(Math.max(...v))], D.filter(x => x !== D[v.indexOf(Math.max(...v))]));
      if (k === 1) return mc(t + "Jami savdo qancha?", String(s), nums(s, 30).map(String));
      if (k === 2) return mc(t + "O'rtacha kunlik savdo qancha?", String(s / 4), nums(s / 4, 15));
      const d = Math.max(...v) - Math.min(...v); return mc(t + "Eng ko'p va eng kam savdo farqi?", String(d), nums(d, 20));
    }, { k: 10, t: 45 }),
    G("Xotira chempionati", "🏆", "8 ta sonni eslab qoling.", () => memQ(8, 5000, NUM, true), { k: 10, t: 15 }),
    G("Strategik qarorlar", "♞", "Yutuqli yurishni toping.", i => {
      const k = i % 3;
      if (k === 0) { let n; do { n = rnd(5, 30); } while (n % 4 === 0); return mc(`Ustma-ust ${n} ta tosh. Navbat bilan 1–3 tadan olinadi, oxirgi toshni olgan yutadi. Siz birinchi yurasiz. Nechta tosh olasiz?`, String(n % 4), ["1", "2", "3"]); }
      if (k === 1) { let n; do { n = rnd(6, 30); } while (n % 5 === 0); return mc(`Ustma-ust ${n} ta tosh. Navbat bilan 1–4 tadan olinadi, oxirgi toshni olgan yutadi. Siz birinchi yurasiz. Nechta tosh olasiz?`, String(n % 5), ["1", "2", "3", "4"]); }
      let x, y, p, q; do { x = pick([100, 200, 300, 400]); y = pick([100, 200, 300, 400]); p = pick([5, 10, 15, 20]); q = pick([5, 10, 15, 20]); } while (x * p === y * q);
      return mc(`A: ${x} ming so'm, foyda ${p}%. B: ${y} ming so'm, foyda ${q}%. Qaysi biri ko'proq foyda beradi?`, x * p > y * q ? "A" : "B", [x * p > y * q ? "B" : "A", "Teng", "Aniqlab bo'lmaydi"]);
    }, { k: 10, t: 45 }),
    G("Murakkab ketma-ketlik", "🔗", "Chuqur qonuniyatlar.", () => {
      const k = rnd(0, 4), a = rnd(2, 5);
      if (k === 0) { const n = rnd(1, 4); return numQ(`${[...Array(5)].map((_, j) => (n + j) * (n + j + 1)).join(', ')}, ?`, (n + 5) * (n + 6), 10); }
      if (k === 1) return numQ(`${a}, ${a * 10}, ${a + 1}, ${(a + 1) * 10}, ${a + 2}, ${(a + 2) * 10}, ?`, a + 3, 3);
      if (k === 2) return numQ(`${a}, ${a + 1}, ${a + 3}, ${a + 6}, ${a + 10}, ${a + 15}, ?`, a + 21, 4);
      if (k === 3) return numQ(`${a}, ${2 * a - 1}, ${4 * a - 3}, ${8 * a - 7}, ?`, 16 * a - 15, 8);
      const n = rnd(1, 4); return numQ(`${[...Array(4)].map((_, j) => (n + j) ** 3).join(', ')}, ?`, (n + 4) ** 3, 20);
    }, { k: 10, t: 50 }),
    G("Deduktiv fikrlash", "🔍", "Xulosa chiqaring.", bk([
      ["Barcha sutemizuvchilar issiq qonli. Kit sutemizuvchi. Xulosa?", "Kit issiq qonli", "Kit sovuq qonli", "Kit baliq emas", "Hech narsa demak"],
      ["Hech bir o'quvchi dangasa emas. Ali o'quvchi. Xulosa?", "Ali dangasa emas", "Ali dangasa", "Ali o'qituvchi", "Aniq emas"],
      ["Agar yomg'ir yog'sa, yer ho'l bo'ladi. Yer ho'l emas. Xulosa?", "Yomg'ir yog'magan", "Yomg'ir yog'gan", "Yer quruq bo'lishi mumkin emas", "Aniq emas"],
      ["Agar yomg'ir yog'sa, yer ho'l bo'ladi. Yer ho'l. Xulosa?", "Yomg'ir yog'gan bo'lishi shart emas", "Yomg'ir yog'gan", "Yomg'ir yog'magan", "Quyosh chiqqan"],
      ["Barcha dasturchilar mantiqiy fikrlaydi. Dilnoza mantiqiy fikrlaydi. Dilnoza dasturchimi?", "Aniq emas", "Ha", "Yo'q", "Faqat ertalab"],
      ["Ba'zi shoirlar rassom. Barcha rassomlar ijodkor. Xulosa?", "Ba'zi shoirlar ijodkor", "Barcha shoirlar rassom", "Hech bir shoir ijodkor emas", "Barcha ijodkorlar shoir"],
      ["Faqat a'zolar kiradi. Sardor kirdi. Xulosa?", "Sardor a'zo", "Sardor a'zo emas", "Sardor mehmon", "Aniq emas"],
      ["Mehmonlardan biri o'g'irlagan: Ali yoki Vali. Ali o'g'irlamagan. Xulosa?", "Vali o'g'irlagan", "Ali o'g'irlagan", "Ikkalasi", "Hech kim"],
      ["Barcha ilonlar sudralib yuruvchi. Ba'zi sudralib yuruvchilar zaharli. Ilon zaharlimi?", "Aniq aytib bo'lmaydi", "Ha", "Yo'q", "Hammasi zaharli"]
    ]), { k: 9, t: 45 }),
    G("Brain Master Challenge", "👑", "Barcha turlardan aralash savollar.", () => pick(GAMES[3].slice(0, 9).filter(g => !g.sp)).f(rnd(1, 9)), { k: 10, t: 50 })
  ]
];

/* ========== O'YIN DVIGATELI ========== */
const stopT = () => { if (P) { clearInterval(P.iv); clearTimeout(P.tid); } };
function askName(cb) {
  modal(`<h3>👤 Username kiriting</h3><p>O'yinni boshlash uchun ismingizni yozing.</p><input id="nm" maxlength="20" value="${esc(S.name)}" placeholder="Masalan: Muhammadqodir"><p id="er" class="err"></p><div class="row"><button class="btn ghost" data-act="mclose">Bekor qilish</button><button class="btn" id="nmok">Davom etish</button></div>`);
  const inp = $('#nm');
  const ok = () => { const v = inp.value.trim(); if (v.length < 2) { $('#er').textContent = "Username kamida 2 ta belgidan iborat bo'lishi kerak."; return; } S.name = v; store.set('name', v); closeModal(); cb(); };
  $('#nmok').onclick = ok; inp.onkeydown = e => { if (e.key === 'Enter') ok(); }; inp.focus();
}
function openGame(c, g) { askName(() => beginGame(c, g)); }
function beginGame(c, g) {
  stopT();
  const gm = GAMES[c][g];
  P = { c, g, gm, i: 0, ok: 0, no: 0, sc: 0, t0: Date.now(), iv: null, tid: null, lock: false };
  V.v = 'play'; render();
  $('#pg').style.width = '0';
  if (gm.sp === 'cards') runCards(); else if (gm.sp === 'maze') runMaze(); else showQ();
}
function showQ() {
  const gm = P.gm; P.q = gm.f(P.i); P.lock = false;
  $('#qn').textContent = `${P.i + 1}/${gm.k}`; $('#pg').style.width = (P.i / gm.k * 100) + '%';
  if (P.q.flash) {
    $('#qa').innerHTML = `<p class="hint">👀 Yaxshilab eslab qoling!</p>${P.q.flash}`; $('#tm').textContent = '…';
    const me = P; P.tid = setTimeout(() => { if (P === me) present(); }, P.q.ms);
  } else present();
}
function present() {
  const q = P.q, gm = P.gm;
  let h = `<div class="qp">${q.p}</div>`;
  if (q.t === 'odd') h += `<div class="odd" style="grid-template-columns:repeat(${q.cols},1fr)">${q.cells.map((c, i) => `<button class="opt cell" data-act="ans" data-i="${i}">${c}</button>`).join('')}</div>`;
  else h += `<div class="opts">${q.o.map((o, i) => `<button class="opt" data-act="ans" data-i="${i}">${o}</button>`).join('')}</div>`;
  $('#qa').innerHTML = h + `<div id="fb" class="fb"></div><div id="nx"></div>`;
  P.qs = Date.now(); P.left = gm.t; $('#tm').textContent = gm.t;
  const me = P;
  P.iv = setInterval(() => { if (P !== me) return; P.left = Math.max(0, gm.t - (Date.now() - P.qs) / 1000); $('#tm').textContent = Math.ceil(P.left); if (P.left <= 0) answer(-1); }, 100);
}
function answer(i) {
  if (!P || P.lock || !P.q) return; P.lock = true; stopT();
  const q = P.q, ok = i === q.a, os = [...document.querySelectorAll('#qa .opt')];
  os.forEach(b => b.disabled = true);
  if (os[q.a]) os[q.a].classList.add('good'); if (!ok && os[i]) os[i].classList.add('bad');
  const nm = esc(S.name);
  if (ok) { P.ok++; P.sc += 10 + Math.round(P.left / P.gm.t * 10); snd('ok'); $('#fb').className = 'fb g'; $('#fb').textContent = pick([`Barakalla, ${S.name}! 🎉`, `Zo'r, ${S.name}! ⭐`, `Ajoyib, ${S.name}! 🔥`]); }
  else { P.no++; snd('bad'); $('#fb').className = 'fb b'; $('#fb').textContent = i === -1 ? `Vaqt tugadi, ${S.name}! ⏰ Yashil javob to'g'ri edi.` : `Xafa bo'lma, ${S.name}! Yashil javob to'g'ri edi. 💪`; }
  $('#sc').textContent = P.sc;
  const last = P.i + 1 >= P.gm.k;
  $('#nx').innerHTML = `<button class="btn" data-act="next">${last ? "🏁 Natijalarni ko'rish" : 'Keyingi savol ➡'}</button>`;
}
function nextQ() { P.i++; if (P.i >= P.gm.k) finish(); else showQ(); }

/* --- Xotira kartalari --- */
function runCards() {
  P.round = 0; const me = P;
  P.iv = setInterval(() => { if (P === me) $('#tm').textContent = Math.round((Date.now() - P.t0) / 1000) + 's'; }, 500);
  cardsRound();
}
function cardsRound() {
  const n = [3, 4, 6][P.round], em = sh(EM).slice(0, n);
  P.cd = sh([...em, ...em]); P.open = []; P.done = 0; P.n = n; P.lock = false;
  $('#qn').textContent = `${P.round + 1}/3`; $('#pg').style.width = (P.round / 3 * 100) + '%';
  $('#qa').innerHTML = `<div class="qp">Bir xil rasmlarni toping 🃏</div><div class="cards" style="grid-template-columns:repeat(${n === 3 ? 3 : 4},1fr)">${P.cd.map((c, i) => `<button class="card" data-act="flip" data-i="${i}"><span class="fr">❓</span><span class="bk">${c}</span></button>`).join('')}</div>`;
}
function flip(i) {
  const me = P, bs = document.querySelectorAll('.card'), b = bs[i];
  if (!P || P.lock || P.open.includes(i) || b.classList.contains('ok')) return;
  b.classList.add('on'); P.open.push(i);
  if (P.open.length < 2) return;
  P.lock = true; const [x, y] = P.open;
  if (P.cd[x] === P.cd[y]) {
    P.ok++; P.sc += 10; snd('ok'); bs[x].className = bs[y].className = 'card ok'; P.open = []; P.lock = false; P.done++; $('#sc').textContent = P.sc;
    if (P.done === P.n) setTimeout(() => { if (P !== me) return; P.round++; if (P.round >= 3) finish(); else cardsRound(); }, 800);
  } else {
    P.no++; snd('bad');
    setTimeout(() => { if (P !== me) return; bs[x].classList.remove('on'); bs[y].classList.remove('on'); P.open = []; P.lock = false; }, 700);
  }
}

/* --- Labirint --- */
function genMaze(n) {
  const N = 2 * n + 1, g = Array.from({ length: N }, () => Array(N).fill(1)), st = [[1, 1]]; g[1][1] = 0;
  while (st.length) {
    const [x, y] = st[st.length - 1];
    const d = sh([[2, 0], [-2, 0], [0, 2], [0, -2]]).filter(([dx, dy]) => { const a = x + dx, b = y + dy; return a > 0 && b > 0 && a < N - 1 && b < N - 1 && g[b][a] === 1; });
    if (!d.length) { st.pop(); continue; }
    const [dx, dy] = d[0]; g[y + dy / 2][x + dx / 2] = 0; g[y + dy][x + dx] = 0; st.push([x + dx, y + dy]);
  }
  return g;
}
function runMaze() {
  P.round = 0; const me = P;
  P.iv = setInterval(() => {
    if (P !== me) return; P.left--; $('#tm').textContent = Math.max(P.left, 0) + 's';
    if (P.left <= 0) { P.no++; snd('bad'); toast(`Vaqt tugadi, ${S.name}! Keyingi labirint.`); mazeNext(); }
  }, 1000);
  mazeRound();
}
function mazeRound() {
  const n = [3, 4, 5][P.round]; P.mz = genMaze(n); P.N = 2 * n + 1; P.px = 1; P.py = 1; P.left = 45 + n * 5;
  $('#qn').textContent = `${P.round + 1}/3`; $('#pg').style.width = (P.round / 3 * 100) + '%'; $('#tm').textContent = P.left + 's';
  $('#qa').innerHTML = `<div class="qp">Finish 🏁 ga yeting! (strelkalar yoki tugmalar)</div><div id="mz" class="maze" style="grid-template-columns:repeat(${P.N},1fr)"></div><div class="pad"><span></span><button data-act="mv" data-d="0,-1">⬆️</button><span></span><button data-act="mv" data-d="-1,0">⬅️</button><button data-act="mv" data-d="0,1">⬇️</button><button data-act="mv" data-d="1,0">➡️</button></div>`;
  mazeDraw();
}
function mazeDraw() {
  let h = ''; const N = P.N;
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) h += `<div class="${P.mz[y][x] ? 'w' : 'p'}">${x === P.px && y === P.py ? '🐭' : (x === N - 2 && y === N - 2 ? '🏁' : '')}</div>`;
  $('#mz').innerHTML = h;
}
function mazeMove(dx, dy) {
  if (!P || P.gm.sp !== 'maze') return; const x = P.px + dx, y = P.py + dy;
  if (P.mz[y] === undefined || P.mz[y][x] !== 0) { snd('click'); return; }
  P.px = x; P.py = y; mazeDraw();
  if (x === P.N - 2 && y === P.N - 2) { P.ok++; P.sc += 30 + Math.max(P.left, 0); snd('ok'); $('#sc').textContent = P.sc; toast(`Barakalla, ${S.name}! 🎉`); mazeNext(); }
}
function mazeNext() { P.round++; if (P.round >= 3) finish(); else mazeRound(); }

/* --- Yakun --- */
function gradeOf(p) { return p >= 90 ? "A'lo ⭐⭐⭐" : p >= 70 ? 'Yaxshi ⭐⭐' : p >= 50 ? 'Qoniqarli ⭐' : 'Yana mashq qiling 💪'; }
function finish() {
  stopT();
  const tot = P.ok + P.no, pct = tot ? Math.round(P.ok / tot * 100) : 0;
  const r = { name: S.name, game: P.gm.n, icon: P.gm.i, c: P.c, g: P.g, ok: P.ok, no: P.no, sc: P.sc, time: Math.round((Date.now() - P.t0) / 1000), grade: gradeOf(pct), pct, day: today(), ts: Date.now() };
  S.results.push(r); store.set('results', S.results.slice(-300)); S.results = S.results.slice(-300);
  snd('ok'); const c = P.c, g = P.g; P = null; V.v = 'result'; V.r = r; render(); V.c = c; V.g = g;
}

/* ========== EKRANLAR ========== */
function modal(h) { const m = $('#modal'); m.innerHTML = `<div class="mb glass">${h}</div>`; m.classList.remove('hidden'); }
function closeModal() { $('#modal').classList.add('hidden'); }
let tt; function toast(t) { const e = $('#toast'); e.textContent = t; e.classList.add('show'); clearTimeout(tt); tt = setTimeout(() => e.classList.remove('show'), 2600); }
function go(v, o = {}) { stopT(); P = null; V = { ...V, v, ...o }; render(); scrollTo(0, 0); }
const best = (n, game) => Math.max(0, ...S.results.filter(r => r.name === n && r.game === game).map(r => r.sc));
const hi = () => S.name ? esc(S.name) : "do'st";

function render() {
  const A = $('#app'), v = V.v;
  document.body.className = (v === 'welcome' || v === 'age' ? 'plain' : '');
  document.documentElement.dataset.theme = S.theme;
  $('#thm').textContent = S.theme === 'dark' ? '🌙' : '☀️'; $('#snd').textContent = S.sound ? '🔊' : '🔇';
  const nav = { home: 'home', games: 'games', play: 'games', result: 'results', results: 'results', profile: 'profile' }[v];
  document.querySelectorAll('nav button').forEach(b => b.classList.toggle('on', b.dataset.go === nav));
  A.innerHTML = ({ welcome: vWelcome, age: vAge, home: vHome, games: vGames, play: vPlay, result: vResult, results: vResults, profile: vProfile })[v]();
  if (v === 'age') { const a = $('#age'); a.focus(); a.onkeydown = e => { if (e.key === 'Enter') setAge(); }; }
  if (v === 'games') { $('#sq').oninput = e => { V.q = e.target.value; $('#gl').innerHTML = gameList(); }; }
}
const vWelcome = () => `<section class="hero"><div class="logo">🧠</div><h1>META IT O'YINLARI</h1><p>Aqlni charxlovchi 40 ta o'yin: xotira, mantiq, matematika, shifrlar va jumboqlar. Har bir yosh uchun alohida o'yinlar tayyor!</p><button class="btn big" data-act="start">🚀 Boshlash</button></section>`;
const vAge = () => `<section class="box glass"><div style="font-size:3rem">🎂</div><h2>Yoshingiz nechada?</h2><p>3 yoshdan 20 yoshgacha bo'lgan qatnashuvchilar uchun.</p><input id="age" type="number" min="3" max="20" placeholder="Yoshingizni kiriting"><p id="er" class="err"></p><button class="btn" data-act="setage">Davom etish</button></section>`;
function setAge() {
  const raw = $('#age').value.trim(), a = Number(raw);
  if (raw === '' || !Number.isFinite(a) || !Number.isInteger(a)) { $('#er').textContent = "Iltimos, yoshingizni butun son bilan kiriting."; return; }
  if (a < 3) { $('#er').textContent = "Kechirasiz, o'yinlar 3 yoshdan boshlab mavjud. Kattalar bilan keling! 🧸"; return; }
  if (a > 20) { $('#er').textContent = "Kechirasiz, platforma 20 yoshgacha bo'lganlar uchun mo'ljallangan."; return; }
  S.age = a; store.set('age', a); const c = catOf(a); toast(`Kategoriya tanlandi: ${CATS[c].r} ${CATS[c].ic}`); go('games', { f: String(c), q: '' });
}
function vHome() {
  const my = S.age ? catOf(S.age) : -1, mine = S.results.filter(r => r.name === S.name);
  return `<div class="greet glass"><h2>Salom, ${hi()}! 👋</h2><p>Bugun miyangni sinovdan o'tkazishga tayyormisan?</p></div>
  <div class="stats"><span>🎮 O'yinlar: <b>${mine.length}</b></span><span>⭐ Jami ball: <b>${mine.reduce((a, r) => a + r.sc, 0)}</b></span><span>🏆 Eng yaxshi: <b>${Math.max(0, ...mine.map(r => r.sc))}</b></span></div>
  <div class="grid4">${CATS.map((c, i) => `<div class="cc glass">${i === my ? '<span class="badge">Sizning kategoriyangiz</span>' : ''}<div class="ic">${c.ic}</div><h3>${c.n}</h3><small>${c.r} · ${GAMES[i].length} ta o'yin</small><p>${c.d}</p><button class="btn" data-act="cat" data-c="${i}">O'yinlarni ko'rish</button></div>`).join('')}</div>`;
}
function gameList() {
  const q = V.q.trim().toLowerCase(); let h = '';
  GAMES.forEach((cg, c) => cg.forEach((g, i) => {
    if (V.f !== 'all' && String(c) !== V.f) return;
    if (q && !(g.n + ' ' + g.d).toLowerCase().includes(q)) return;
    const b = S.name ? best(S.name, g.n) : 0;
    h += `<div class="gc glass"><div class="gi">${g.i}</div><h4>${g.n}</h4><p>${g.d}</p><small>${CATS[c].r}${b ? ' · 🏆 Rekord: ' + b : ''}</small><button class="btn sm" data-act="play" data-c="${c}" data-g="${i}">▶ O'ynash</button></div>`;
  }));
  return h || `<div class="empty">Hech narsa topilmadi. Boshqa so'z yoki kategoriyani sinab ko'ring.</div>`;
}
const vGames = () => `<div class="greet glass"><h2>Salom, ${hi()}! 👋</h2><p>Bugun miyangni sinovdan o'tkazishga tayyormisan?</p></div>
<div class="bar"><button class="btn ghost sm" data-act="home">← Orqaga</button><input id="sq" type="search" placeholder="🔍 O'yin qidirish..." value="${esc(V.q)}"></div>
<div class="bar"><button class="chip ${V.f === 'all' ? 'on' : ''}" data-act="filter" data-f="all">Hammasi (40)</button>${CATS.map((c, i) => `<button class="chip ${V.f === String(i) ? 'on' : ''}" data-act="filter" data-f="${i}">${c.ic} ${c.r}</button>`).join('')}</div>
<div class="gl" id="gl">${gameList()}</div>`;
const vPlay = () => `<section><div class="playbar"><button class="btn ghost sm" data-act="back">← Orqaga</button><h2>${P.gm.i} ${P.gm.n}</h2><button class="btn ghost sm" data-act="restart">🔄 Qayta boshlash</button></div>
<div class="stats"><span>📋 Savol: <b id="qn">1</b></span><span>⭐ Ball: <b id="sc">0</b></span><span>⏱ <b id="tm">0</b></span><span>👤 ${esc(S.name)}</span></div><div class="prog"><i id="pg"></i></div><div id="qa" class="glass qa"></div></section>`;
const mmss = s => s >= 60 ? `${Math.floor(s / 60)} daq ${s % 60} son` : `${s} soniya`;
function vResult() {
  const r = V.r;
  return `<section class="res glass"><div class="tr">${r.pct >= 70 ? '🏆' : r.pct >= 50 ? '👏' : '💪'}</div><h2>${r.pct >= 50 ? 'Barakalla' : 'Yaxshi urinish'}, ${esc(r.name)}!</h2>
<table><tr><td>👤 Qatnashuvchi</td><td><b>${esc(r.name)}</b></td></tr><tr><td>${r.icon} O'yin</td><td><b>${r.game}</b></td></tr><tr><td>✅ To'g'ri javoblar</td><td><b>${r.ok}</b></td></tr><tr><td>❌ Noto'g'ri javoblar</td><td><b>${r.no}</b></td></tr><tr><td>⭐ Umumiy ball</td><td><b>${r.sc}</b></td></tr><tr><td>⏱ Sarflangan vaqt</td><td><b>${mmss(r.time)}</b></td></tr><tr><td>🎓 Baho</td><td><b>${r.grade}</b> (${r.pct}%)</td></tr></table>
<div class="row"><button class="btn" data-act="replay">🔁 Qayta o'ynash</button><button class="btn ghost" data-act="games">🎮 O'yinlar</button><button class="btn ghost" data-act="results">📊 Natijalar</button></div></section>`;
}
function vResults() {
  const day = S.results.filter(r => r.day === today()).sort((a, b) => b.sc - a.sc).slice(0, 5);
  const tot = {}; S.results.forEach(r => tot[r.name] = (tot[r.name] || 0) + r.sc);
  const rate = Object.entries(tot).sort((a, b) => b[1] - a[1]).slice(0, 10), md = ['🥇', '🥈', '🥉'];
  const all = [...S.results].reverse().slice(0, 50);
  return `<h2 style="margin-bottom:14px">📊 Natijalar</h2><div class="two"><div class="glass"><h3>🌟 Kunlik eng yaxshi natijalar</h3>${day.length ? `<table class="tb">${day.map((r, i) => `<tr><td>${md[i] || i + 1}</td><td>${esc(r.name)}</td><td>${r.game}</td><td><b>${r.sc}</b></td></tr>`).join('')}</table>` : `<div class="empty">Bugun hali natija yo'q. Birinchi bo'ling!</div>`}</div>
<div class="glass"><h3>🏅 Reyting (jami ball)</h3>${rate.length ? `<table class="tb">${rate.map((r, i) => `<tr><td>${md[i] || i + 1}</td><td>${esc(r[0])}</td><td><b>${r[1]}</b></td></tr>`).join('')}</table>` : `<div class="empty">Reyting hali bo'sh.</div>`}</div></div>
<div class="glass tbw"><h3 style="padding:8px">🕘 So'nggi natijalar</h3>${all.length ? `<table class="tb"><tr><th>Ism</th><th>O'yin</th><th>✅</th><th>❌</th><th>Ball</th><th>Vaqt</th><th>Baho</th><th>Sana</th></tr>${all.map(r => `<tr><td>${esc(r.name)}</td><td>${r.icon} ${r.game}</td><td>${r.ok}</td><td>${r.no}</td><td><b>${r.sc}</b></td><td>${r.time}s</td><td>${r.grade}</td><td>${r.day}</td></tr>`).join('')}</table>` : `<div class="empty">Natijalar yo'q. Birorta o'yin o'ynang!</div>`}</div>
<div class="row"><button class="btn ghost sm" data-act="clear">🗑 Natijalarni tozalash</button></div>`;
}
function vProfile() {
  const m = S.results.filter(r => r.name === S.name), c = S.age ? catOf(S.age) : -1;
  return `<section class="box glass" style="max-width:480px"><div style="font-size:3rem">👤</div><h2>${hi()}</h2><p>${S.age ? `Yosh: ${S.age} · ${CATS[c].r} ${CATS[c].ic}` : 'Yosh kiritilmagan'}</p>
<input id="pn" maxlength="20" placeholder="Username" value="${esc(S.name)}"><p id="er" class="err"></p>
<div class="stats" style="justify-content:center"><span>🎮 ${m.length} o'yin</span><span>⭐ ${m.reduce((a, r) => a + r.sc, 0)} ball</span><span>📈 O'rtacha ${m.length ? Math.round(m.reduce((a, r) => a + r.pct, 0) / m.length) : 0}%</span></div>
<div class="row"><button class="btn" data-act="savename">💾 Saqlash</button><button class="btn ghost" data-act="age">🎂 Yoshni o'zgartirish</button></div></section>`;
}

/* ========== HODISALAR ========== */
document.addEventListener('click', e => {
  const g = e.target.closest('[data-go]');
  if (g) { snd('click'); go(S.age ? g.dataset.go : 'age'); return; }
  const b = e.target.closest('[data-act]'); if (!b) return;
  const a = b.dataset.act, d = b.dataset; snd('click');
  switch (a) {
    case 'start': go(S.age ? 'home' : 'age'); break;
    case 'setage': setAge(); break;
    case 'age': go('age'); break;
    case 'home': go('home'); break;
    case 'games': go('games', { f: V.c !== undefined ? String(V.c) : 'all' }); break;
    case 'results': go('results'); break;
    case 'cat': go('games', { f: d.c, q: '' }); break;
    case 'filter': V.f = d.f; render(); break;
    case 'play': openGame(+d.c, +d.g); break;
    case 'mclose': closeModal(); break;
    case 'ans': answer(+d.i); break;
    case 'next': nextQ(); break;
    case 'flip': flip(+d.i); break;
    case 'mv': { const [x, y] = d.d.split(',').map(Number); mazeMove(x, y); break; }
    case 'back': go('games', { f: String(P ? P.c : 'all') }); break;
    case 'restart': if (P) beginGame(P.c, P.g); break;
    case 'replay': askName(() => beginGame(V.c, V.g)); break;
    case 'clear': if (confirm("Barcha natijalar o'chirilsinmi?")) { S.results = []; store.set('results', []); render(); toast("Natijalar tozalandi"); } break;
    case 'savename': { const v = $('#pn').value.trim(); if (v.length < 2) { $('#er').textContent = "Username kamida 2 ta belgi bo'lsin."; break; } S.name = v; store.set('name', v); render(); toast(`Saqlandi, ${v}! ✅`); break; }
  }
});
document.addEventListener('keydown', e => {
  const m = { ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0] }[e.key];
  if (m && P && P.gm && P.gm.sp === 'maze') { e.preventDefault(); mazeMove(...m); }
});
$('#thm').onclick = () => { S.theme = S.theme === 'dark' ? 'light' : 'dark'; store.set('theme', S.theme); render(); };
$('#snd').onclick = () => { S.sound = !S.sound; store.set('sound', S.sound); render(); snd('click'); };
render();
