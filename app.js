const SHEET_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRWNPlJVMK7e3hi2ZxNYUMWnvv9yndpajgvUUyYTy1GDV9C5pG2oTmStyyYtMOSE9RpPeWQjTESQUr8/pub?gid=688887543&single=true&output=csv";
const TARGET_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRWNPlJVMK7e3hi2ZxNYUMWnvv9yndpajgvUUyYTy1GDV9C5pG2oTmStyyYtMOSE9RpPeWQjTESQUr8/pub?gid=0&single=true&output=csv";
const Y2025_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRWNPlJVMK7e3hi2ZxNYUMWnvv9yndpajgvUUyYTy1GDV9C5pG2oTmStyyYtMOSE9RpPeWQjTESQUr8/pub?gid=948017490&single=true&output=csv";
const CRM_TARGET_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRWNPlJVMK7e3hi2ZxNYUMWnvv9yndpajgvUUyYTy1GDV9C5pG2oTmStyyYtMOSE9RpPeWQjTESQUr8/pub?gid=1318951729&single=true&output=csv";
const CORS_PROXIES = [
  (u) => "https://corsproxy.io/?" + encodeURIComponent(u),
  (u) => "https://api.allorigins.win/raw?url=" + encodeURIComponent(u),
];
const AUTO_REFRESH_MS = 5 * 60 * 1000;
const FALLBACK = null;
const FALLBACK_TARGET = [
  {
    bulan: "Januari",
    target: 1613917475,
    realisasi: 1115870956,
    selisih: -498046519,
  },
  {
    bulan: "Februari",
    target: 2452229585,
    realisasi: 1186236661,
    selisih: -1265992924,
  },
  {
    bulan: "Maret",
    target: 3285591627,
    realisasi: 3364532817,
    selisih: 78941190,
  },
  {
    bulan: "April",
    target: 1494718193,
    realisasi: 1139506651,
    selisih: -355211542,
  },
  {
    bulan: "Mei",
    target: 2342925908,
    realisasi: 1631860437,
    selisih: -711065471,
  },
  {
    bulan: "Juni",
    target: 1771031474,
    realisasi: 1289438294,
    selisih: -481593180,
  },
  {
    bulan: "Juli",
    target: 1978324998,
    realisasi: 29486000,
    selisih: -1948838998,
  },
  { bulan: "Agustus", target: 1840010352, realisasi: 0, selisih: -1840010352 },
  {
    bulan: "September",
    target: 1809396009,
    realisasi: 0,
    selisih: -1809396009,
  },
  { bulan: "Oktober", target: 1795597254, realisasi: 0, selisih: -1795597254 },
  { bulan: "November", target: 1747264768, realisasi: 0, selisih: -1747264768 },
  { bulan: "Desember", target: 1878012027, realisasi: 0, selisih: -1878012027 },
];
const FALLBACK_Y2025 = [
  {
    bulan: "Januari",
    target: 1613917475,
    realisasi: 1215870956,
    selisih: -398046519,
  },
  {
    bulan: "Februari",
    target: 2452229585,
    realisasi: 1086236661,
    selisih: -1365992924,
  },
  {
    bulan: "Maret",
    target: 3285591627,
    realisasi: 3764532817,
    selisih: 478941190,
  },
  {
    bulan: "April",
    target: 1494718193,
    realisasi: 1939506651,
    selisih: 444788458,
  },
  {
    bulan: "Mei",
    target: 2342925908,
    realisasi: 1231860437,
    selisih: -1111065471,
  },
  {
    bulan: "Juni",
    target: 1771031474,
    realisasi: 1392775086,
    selisih: -378256388,
  },
  { bulan: "Juli", target: 1978324998, realisasi: 0, selisih: -1978324998 },
  { bulan: "Agustus", target: 1840010352, realisasi: 0, selisih: -1840010352 },
  {
    bulan: "September",
    target: 1809396009,
    realisasi: 0,
    selisih: -1809396009,
  },
  { bulan: "Oktober", target: 1795597254, realisasi: 0, selisih: -1795597254 },
  { bulan: "November", target: 1747264768, realisasi: 0, selisih: -1747264768 },
  { bulan: "Desember", target: 1878012027, realisasi: 0, selisih: -1878012027 },
];

let ALL = [];
let TARGET_DATA = []; // [{bulan, target, realisasi, selisih}] 2026
let Y2025_DATA = []; // realisasi 2025 per bulan
let CRM_TARGET_DATA = []; // [{crm, pertumbuhan, months:{Januari:n,...}, total_target}]
let FILTER_OPTS = {
  programs: [],
  jenis_list: [],
  user_inserts: [],
  crms: [],
  via_himpuns: [],
  min_date: "",
  max_date: "",
};
let charts = {};
let dataSource = "none"; // live | snapshot

const COLORS = [
  "#22c55e",
  "#3b82f6",
  "#fbbf24",
  "#a855f7",
  "#f87171",
  "#94a3b8",
  "#38bdf8",
  "#c084fc",
  "#fb923c",
  "#4ade80",
];

function formatRp(n) {
  if (n == null || isNaN(n)) return "Rp 0";
  if (n >= 1e9) return "Rp " + (n / 1e9).toFixed(2) + " M";
  if (n >= 1e6) return "Rp " + (n / 1e6).toFixed(1) + " jt";
  if (n >= 1e3) return "Rp " + (n / 1e3).toFixed(0) + " rb";
  return "Rp " + Number(n).toLocaleString("id-ID");
}
function formatFull(n) {
  return "Rp " + Math.round(n || 0).toLocaleString("id-ID");
}

// Label angka di ujung batang (untuk screenshot)
const barValueLabelsPlugin = {
  id: "barValueLabels",
  afterDatasetsDraw(chart, args, opts) {
    if (opts && opts.display === false) return;
    const { ctx } = chart;
    const horizontal = chart.options.indexAxis === "y";
    chart.data.datasets.forEach((ds, di) => {
      const meta = chart.getDatasetMeta(di);
      if (meta.hidden) return;
      meta.data.forEach((el, i) => {
        const v = ds.data[i];
        if (v == null || Number(v) === 0) return;
        const pos = el.tooltipPosition();
        ctx.save();
        ctx.fillStyle = opts && opts.color ? opts.color : "#334155";
        ctx.font =
          (opts && opts.font) || "600 9px DM Sans, system-ui, sans-serif";
        ctx.textBaseline = "middle";
        let text;
        if (opts && opts.fullNumber) {
          text = Math.round(Number(v)).toLocaleString("id-ID");
        } else {
          text = typeof formatRp === "function" ? formatRp(v) : String(v);
        }
        if (horizontal) {
          ctx.textAlign = "left";
          ctx.fillText(text, pos.x + 6, pos.y);
        } else {
          ctx.textAlign = "center";
          ctx.fillText(text, pos.x, pos.y - 8);
        }
        ctx.restore();
      });
    });
  },
};

function getSelected(sel) {
  return Array.from(sel.selectedOptions).map((o) => o.value);
}

function setStatus(type, text) {
  const el = document.getElementById("statusBadge");
  el.className = "badge " + type;
  el.textContent = text;
}

function parseNominal(v) {
  if (v == null || v === "") return 0;
  const raw = String(v).trim();
  // Decimal form: 5000.00 or 5000,00 (1–2 digits after separator)
  if (/^\d+[.,]\d{1,2}$/.test(raw)) {
    const n = parseFloat(raw.replace(",", "."));
    return isNaN(n) ? 0 : Math.round(n);
  }
  // Thousand separators (10.000 / 10,000) or plain integer
  const cleaned = raw.replace(/[^\d-]/g, "");
  const n = parseInt(cleaned, 10);
  return isNaN(n) ? 0 : n;
}

function parseDate(str) {
  if (!str) return null;
  const m = String(str)
    .trim()
    .match(/(\d{1,2})\/(\d{1,2})\/(\d{4})\s+(\d{1,2}):(\d{2})(?::(\d{2}))?/);
  if (!m) return null;
  const d = new Date(+m[3], +m[2] - 1, +m[1], +m[4], +m[5], +(m[6] || 0));
  return isNaN(d.getTime()) ? null : d;
}
function toYMD(d) {
  return (
    d.getFullYear() +
    "-" +
    String(d.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(d.getDate()).padStart(2, "0")
  );
}

function processRows(rawRows) {
  const records = [];
  const progSet = new Set(),
    jenisSet = new Set(),
    userSet = new Set(),
    crmSet = new Set(),
    viaSet = new Set();
  let minD = null,
    maxD = null;

  rawRows.forEach((row) => {
    // Kolom baru: Tanggal→Tgl Transaksi, Nominal→Transaksi (tetap support nama lama)
    const tglRaw =
      row["Tgl Transaksi"] ||
      row["Tanggal"] ||
      row["tanggal"] ||
      row["Tgl Input"] ||
      "";
    const dt = parseDate(tglRaw);
    if (!dt) return;

    const nominal = parseNominal(
      row["Transaksi"] || row["Nominal"] || row["nominal"] || row["TRANSAKSI"],
    );
    const program = String(row["Program"] || "").trim();
    const userInsert = String(row["User Insert"] || "").trim();
    const crm = String(
      row["Fundraiser"] ||
        row["FUNDRAISER"] ||
        row["CRM"] ||
        row["CRM / FUNDRAISER"] ||
        "",
    ).trim();
    const via = String(row["Via Himpun"] || "").trim();
    const nama = String(row["Nama Donatur"] || "").trim();
    const jenis = String(row["Jenis Transaksi"] || "").trim();
    // Kecualikan Non Cash dari seluruh dashboard (Global & Operasional)
    const jenisNorm = jenis.toLowerCase().replace(/\s+/g, "");
    if (jenisNorm === "noncash") return;
    const sumber = String(row["Sumber Dana"] || "").trim();
    const jenisDonatur = String(row["Jenis Donatur"] || "").trim();
    const idDonatur = String(row["ID Donatur"] || "").trim();
    const ymd = toYMD(dt);

    records.push({
      tgl: ymd,
      waktu:
        String(dt.getDate()).padStart(2, "0") +
        "/" +
        String(dt.getMonth() + 1).padStart(2, "0") +
        " " +
        String(dt.getHours()).padStart(2, "0") +
        ":" +
        String(dt.getMinutes()).padStart(2, "0"),
      jam: dt.getHours(),
      ts: Math.floor(dt.getTime() / 1000),
      nama,
      program,
      nominal,
      user_insert: userInsert,
      crm,
      jenis,
      via_himpun: via,
      sumber,
      jenis_donatur: jenisDonatur,
      id_donatur: idDonatur,
    });

    if (program) progSet.add(program);
    if (jenis) jenisSet.add(jenis);
    if (userInsert) userSet.add(userInsert);
    if (crm) crmSet.add(crm);
    if (via) viaSet.add(via);
    if (!minD || dt < minD) minD = dt;
    if (!maxD || dt > maxD) maxD = dt;
  });

  records.sort((a, b) => b.ts - a.ts);
  FILTER_OPTS = {
    programs: [...progSet].sort(),
    jenis_list: [...jenisSet].sort(),
    user_inserts: [...userSet].sort(),
    crms: ["-"].concat([...crmSet].sort()),
    via_himpuns: [...viaSet].sort(),
    min_date: minD ? toYMD(minD) : "",
    max_date: maxD ? toYMD(maxD) : "",
  };
  ALL = records;
  return records;
}

function applyFallback() {
  // No embedded snapshot — keep existing ALL if any, otherwise empty
  dataSource = "offline";
  if (!ALL.length) {
    FILTER_OPTS = {
      programs: [],
      jenis_list: [],
      user_inserts: [],
      crms: [],
      via_himpuns: [],
      min_date: "",
      max_date: "",
    };
    initFilterUI(false);
    document.getElementById("kpiGrid").innerHTML =
      '<div class="empty-state" style="grid-column:1/-1;padding:40px">Tidak dapat memuat data dari Google Sheets.<br><small style="color:var(--muted)">Coba klik Refresh atau buka lewat http://localhost</small></div>';
    document.getElementById("filterCount").textContent = "—";
  } else {
    // keep last successful data on screen
    applyFilters();
  }
  setStatus(
    "err",
    ALL.length
      ? "Offline · data terakhir " + ALL.length.toLocaleString("id-ID") + " trx"
      : "Offline · gagal load",
  );
  document.getElementById("loadingOverlay").classList.add("hidden");
  if (location.protocol === "file:") {
    document.getElementById("fileWarn").classList.add("show");
  }
}

function fillSelect(id, items) {
  const sel = document.getElementById(id);
  const prev = getSelected(sel);
  sel.innerHTML = "";
  items.forEach((v) => {
    const opt = document.createElement("option");
    opt.value = v;
    opt.textContent = v;
    if (prev.includes(v)) opt.selected = true;
    sel.appendChild(opt);
  });
}

function initFilterUI(preserveDates) {
  const df = document.getElementById("fDateFrom");
  const dt = document.getElementById("fDateTo");
  const oldFrom = df.value,
    oldTo = dt.value;
  // Batas: 1 Jan 2026 s/d hari ini
  // Default mulai: awal bulan ini
  const yearStart = "2026-01-01";
  const today = toYMD(new Date());
  const now = new Date();
  const monthStart =
    now.getFullYear() +
    "-" +
    String(now.getMonth() + 1).padStart(2, "0") +
    "-01";
  df.min = yearStart;
  df.max = today;
  dt.min = yearStart;
  dt.max = today;
  if (!preserveDates || !oldFrom) {
    df.value = monthStart;
    dt.value = today;
  } else {
    df.value =
      oldFrom < yearStart ? yearStart : oldFrom > today ? today : oldFrom;
    dt.value = oldTo > today ? today : oldTo < yearStart ? yearStart : oldTo;
  }
  fillSelect("fProgram", FILTER_OPTS.programs);
  fillSelect("fJenis", FILTER_OPTS.jenis_list || []);
  fillSelect("fUserInsert", FILTER_OPTS.user_inserts);
  fillSelect("fCRM", FILTER_OPTS.crms);
  fillSelect("fViaHimpun", FILTER_OPTS.via_himpuns);
}

async function tryFetch(url) {
  const resp = await fetch(url, {
    method: "GET",
    mode: "cors",
    cache: "no-store",
    redirect: "follow",
    credentials: "omit",
  });
  if (!resp.ok) throw new Error("HTTP " + resp.status);
  const text = await resp.text();
  if (!text || text.length < 20) throw new Error("Response kosong");
  // Accept transaction CSV or target CSV (BULAN/TARGET)
  const looksCsv = text.includes(",");
  const looksTxn = /Transaksi|Nominal|Tanggal|Tgl Transaksi|Program/i.test(
    text,
  );
  const looksTarget =
    /BULAN|TARGET|REALISASI|FUNDRAISER|JANUARI|AGUSTUS|CRM/i.test(text);
  if (!looksCsv || (!looksTxn && !looksTarget)) {
    throw new Error("Bukan CSV valid");
  }
  return text;
}

function parseNum(v) {
  if (v == null || v === "") return 0;
  const s = String(v).replace(/[^\d-]/g, "");
  const n = parseInt(s, 10);
  return isNaN(n) ? 0 : n;
}

function processTargetRows(rawRows) {
  const rows = [];
  rawRows.forEach((row) => {
    const bulan = String(
      row["BULAN"] || row["Bulan"] || row["bulan"] || "",
    ).trim();
    if (!bulan) return;
    const target = parseNum(row["TARGET"] || row["Target"] || row["target"]);
    const realisasi = parseNum(
      row["REALISASI"] || row["Realisasi"] || row["realisasi"],
    );
    const selisih = parseNum(
      row["SELISIH"] || row["Selisih"] || row["selisih"],
    );
    rows.push({
      bulan,
      target,
      realisasi,
      selisih: selisih || realisasi - target,
    });
  });
  TARGET_DATA = rows;
  return rows;
}

async function loadY2025Data() {
  const baseUrl =
    Y2025_CSV_URL +
    (Y2025_CSV_URL.includes("?") ? "&" : "?") +
    "_t=" +
    Date.now();
  const urlsToTry = [baseUrl, ...CORS_PROXIES.map((fn) => fn(baseUrl))];
  for (const url of urlsToTry) {
    try {
      const text = await tryFetch(url);
      const results = Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: false,
      });
      if (!results.data || !results.data.length)
        throw new Error("Y2025 kosong");
      const rows = [];
      results.data.forEach((row) => {
        const bulan = String(
          row["BULAN"] || row["Bulan"] || row["bulan"] || "",
        ).trim();
        if (!bulan) return;
        const target = parseNum(
          row["TARGET"] || row["Target"] || row["target"],
        );
        const realisasi = parseNum(
          row["REALISASI"] || row["Realisasi"] || row["realisasi"],
        );
        const selisih = parseNum(
          row["SELISIH"] || row["Selisih"] || row["selisih"],
        );
        rows.push({
          bulan,
          target,
          realisasi,
          selisih: selisih || realisasi - target,
        });
      });
      if (rows.length) {
        Y2025_DATA = rows;
        return true;
      }
    } catch (e) {
      /* silent */
    }
  }
  if (!Y2025_DATA.length) Y2025_DATA = FALLBACK_Y2025.slice();
  return false;
}

async function loadTargetData() {
  const baseUrl =
    TARGET_CSV_URL +
    (TARGET_CSV_URL.includes("?") ? "&" : "?") +
    "_t=" +
    Date.now();
  const urlsToTry = [baseUrl, ...CORS_PROXIES.map((fn) => fn(baseUrl))];
  for (const url of urlsToTry) {
    try {
      const text = await tryFetch(url);
      const results = Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: false,
      });
      if (!results.data || !results.data.length)
        throw new Error("Target kosong");
      processTargetRows(results.data);
      if (TARGET_DATA.length) return true;
    } catch (e) {
      // silent retry — proxy 403/CORS is expected from some hosts
    }
  }
  // Keep last good TARGET_DATA if any; otherwise use embedded fallback
  if (!TARGET_DATA.length) TARGET_DATA = FALLBACK_TARGET.slice();
  return false;
}

async function loadData(isManual) {
  document.getElementById("loadingOverlay").classList.remove("hidden");
  setStatus("loading", isManual ? "Refreshing..." : "Loading...");
  document.getElementById("fileWarn").classList.remove("show");

  const baseUrl =
    SHEET_CSV_URL +
    (SHEET_CSV_URL.includes("?") ? "&" : "?") +
    "_t=" +
    Date.now();
  const urlsToTry = [baseUrl, ...CORS_PROXIES.map((fn) => fn(baseUrl))];

  let lastErr = null;
  for (const url of urlsToTry) {
    try {
      const text = await tryFetch(url);
      const results = Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: false,
      });
      if (!results.data || !results.data.length)
        throw new Error("Tidak ada baris data");

      processRows(results.data);
      if (!ALL.length) throw new Error("0 baris setelah parse tanggal");

      dataSource = "live";
      initFilterUI(isManual);
      applyFilters();
      const timeStr = new Date().toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      });
      setStatus(
        "live",
        "Live · " + ALL.length.toLocaleString("id-ID") + " trx · " + timeStr,
      );
      document.getElementById("loadingOverlay").classList.add("hidden");
      return;
    } catch (e) {
      console.warn(
        "Fetch attempt failed:",
        url.substring(0, 60) + "...",
        e.message,
      );
      lastErr = e;
    }
  }

  // All live attempts failed → fallback
  console.warn("All live fetches failed, using snapshot. Last error:", lastErr);
  applyFallback();
}

function resetFilters() {
  const today = toYMD(new Date());
  const now = new Date();
  const monthStart =
    now.getFullYear() +
    "-" +
    String(now.getMonth() + 1).padStart(2, "0") +
    "-01";
  document.getElementById("fDateFrom").value = monthStart;
  document.getElementById("fDateTo").value = today;
  ["fProgram", "fJenis", "fUserInsert", "fCRM", "fViaHimpun"].forEach((id) => {
    Array.from(document.getElementById(id).options).forEach(
      (o) => (o.selected = false),
    );
  });
  applyFilters();
}

function applyFilters() {
  const dateFrom = document.getElementById("fDateFrom").value;
  const dateTo = document.getElementById("fDateTo").value;
  const programs = getSelected(document.getElementById("fProgram"));
  const jenisList = getSelected(document.getElementById("fJenis"));
  const users = getSelected(document.getElementById("fUserInsert"));
  const crms = getSelected(document.getElementById("fCRM"));
  const vias = getSelected(document.getElementById("fViaHimpun"));

  const filtered = ALL.filter((r) => {
    if (dateFrom && r.tgl < dateFrom) return false;
    if (dateTo && r.tgl > dateTo) return false;
    if (programs.length && !programs.includes(r.program)) return false;
    if (jenisList.length && !jenisList.includes(r.jenis)) return false;
    if (users.length && !users.includes(r.user_insert)) return false;
    if (crms.length) {
      const isEmpty = !r.crm || r.crm === "";
      const matchEmpty = crms.includes("-") && isEmpty;
      const matchNamed = !isEmpty && crms.includes(r.crm);
      if (!matchEmpty && !matchNamed) return false;
    }
    if (vias.length && !vias.includes(r.via_himpun)) return false;
    return true;
  });

  document.getElementById("filterCount").innerHTML =
    "Menampilkan <strong>" +
    filtered.length.toLocaleString("id-ID") +
    "</strong> dari " +
    ALL.length.toLocaleString("id-ID") +
    " transaksi";
  renderAll(filtered);
}

function aggregate(rows) {
  const total = rows.reduce((s, r) => s + r.nominal, 0);
  const count = rows.length;
  const uniqueDonors = new Set(rows.map((r) => r.id_donatur)).size;
  const avg = count ? total / count : 0;
  const maxN = rows.length ? Math.max(...rows.map((r) => r.nominal)) : 0;

  const dailyMap = {};
  rows.forEach((r) => {
    if (!dailyMap[r.tgl]) dailyMap[r.tgl] = { total: 0, count: 0 };
    dailyMap[r.tgl].total += r.nominal;
    dailyMap[r.tgl].count += 1;
  });
  const dailyLabels = Object.keys(dailyMap).sort();
  const dailyTotals = dailyLabels.map((d) => dailyMap[d].total);
  const dailyCounts = dailyLabels.map((d) => dailyMap[d].count);

  // 24 jam (00–23), selalu tampil meski kosong
  const hourlyTotals = Array(24).fill(0);
  const hourlyCounts = Array(24).fill(0);
  rows.forEach((r) => {
    let h = r.jam;
    if (h == null || h === "") {
      // fallback dari ts
      if (r.ts) h = new Date(r.ts * 1000).getHours();
      else return;
    }
    h = Number(h);
    if (h < 0 || h > 23 || isNaN(h)) return;
    hourlyTotals[h] += r.nominal;
    hourlyCounts[h] += 1;
  });
  const hourlyLabels = Array.from({ length: 24 }, (_, i) =>
    String(i).padStart(2, "0"),
  );

  const progMap = {};
  rows.forEach((r) => {
    if (!progMap[r.program]) progMap[r.program] = { total: 0, count: 0 };
    progMap[r.program].total += r.nominal;
    progMap[r.program].count += 1;
  });
  const progSorted = Object.entries(progMap).sort(
    (a, b) => b[1].total - a[1].total,
  );

  const jenisMap = {},
    viaMap = {},
    sumberMap = {},
    jdMap = {},
    crmMap = {},
    donorMap = {};
  rows.forEach((r) => {
    const j = r.jenis || "Lainnya";
    jenisMap[j] = (jenisMap[j] || 0) + r.nominal;
    const v = r.via_himpun || "Lainnya";
    viaMap[v] = (viaMap[v] || 0) + r.nominal;
    const s = r.sumber || "Lainnya";
    sumberMap[s] = (sumberMap[s] || 0) + r.nominal;
    const d = r.jenis_donatur || "Lainnya";
    jdMap[d] = (jdMap[d] || 0) + r.nominal;
    // Fundraiser: tampil terpisah + bar gabungan Alfin dengan kosong (-)
    {
      const crmRaw = (r.crm || "").trim();
      const isEmptyCrm = !crmRaw;
      const isAlfin = crmRaw.toLowerCase() === "m alfin al-haris";
      const crmKey = isEmptyCrm ? "-" : crmRaw;
      if (!crmMap[crmKey]) crmMap[crmKey] = { total: 0, count: 0 };
      crmMap[crmKey].total += r.nominal;
      crmMap[crmKey].count += 1;
      if (isEmptyCrm || isAlfin) {
        const combo = "M Alfin Al-Haris (+ -)";
        if (!crmMap[combo]) crmMap[combo] = { total: 0, count: 0 };
        crmMap[combo].total += r.nominal;
        crmMap[combo].count += 1;
      }
    }
    const nm = r.nama || "Tanpa Nama";
    donorMap[nm] = (donorMap[nm] || 0) + r.nominal;
  });

  return {
    total,
    count,
    uniqueDonors,
    avg,
    maxN,
    dailyLabels,
    dailyTotals,
    dailyCounts,
    hourlyLabels,
    hourlyTotals,
    hourlyCounts,
    progSorted,
    jenisMap,
    viaMap,
    sumberMap,
    jdMap,
    crmSorted: Object.entries(crmMap)
      .sort((a, b) => b[1].total - a[1].total)
      .slice(0, 10),
    topDonors: Object.entries(donorMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15),
    recent: [...rows].sort((a, b) => b.ts - a.ts).slice(0, 30),
  };
}

function destroyCharts() {
  Object.values(charts).forEach((c) => {
    try {
      c.destroy();
    } catch (e) {}
  });
  charts = {};
}

function monthKeyFromYmd(ymd) {
  // ymd YYYY-MM-DD -> Indonesian month name
  const map = {
    1: "Januari",
    2: "Februari",
    3: "Maret",
    4: "April",
    5: "Mei",
    6: "Juni",
    7: "Juli",
    8: "Agustus",
    9: "September",
    10: "Oktober",
    11: "November",
    12: "Desember",
  };
  const m = parseInt(ymd.slice(5, 7), 10);
  return map[m] || "";
}

function processCrmTargetRows(rawRows) {
  const monthCols = {
    JANUARI: "Januari",
    FEBRUARI: "Februari",
    MARET: "Maret",
    APRIL: "April",
    MEI: "Mei",
    JUNI: "Juni",
    JULI: "Juli",
    AGUSTUS: "Agustus",
    SEPTEMBER: "September",
    OKTOBER: "Oktober",
    NOVEMBER: "November",
    DESEMBER: "Desember",
  };
  const rows = [];
  rawRows.forEach((row) => {
    const crm = String(
      row["Fundraiser"] ||
        row["FUNDRAISER"] ||
        row["CRM / FUNDRAISER"] ||
        row["CRM"] ||
        "",
    ).trim();
    if (!crm) return;
    const lower = crm.toLowerCase();
    if (lower === "total" || lower.startsWith("total")) return;
    const months = {};
    Object.keys(monthCols).forEach((k) => {
      // find column case-insensitive
      let val = 0;
      for (const col of Object.keys(row)) {
        if (String(col).trim().toUpperCase() === k) {
          val = parseNum(row[col]);
          break;
        }
      }
      months[monthCols[k]] = val;
    });
    let totalTarget = 0;
    for (const col of Object.keys(row)) {
      if (/total/i.test(String(col))) {
        totalTarget = parseNum(row[col]);
        break;
      }
    }
    if (!totalTarget)
      totalTarget = Object.values(months).reduce((s, v) => s + v, 0);
    rows.push({
      crm,
      pertumbuhan: String(
        row["PERTUMBUHAN"] || row["Pertumbuhan"] || "",
      ).trim(),
      months,
      total_target: totalTarget,
    });
  });
  CRM_TARGET_DATA = rows;
  return rows;
}

async function loadCrmTargetData() {
  const baseUrl =
    CRM_TARGET_CSV_URL +
    (CRM_TARGET_CSV_URL.includes("?") ? "&" : "?") +
    "_t=" +
    Date.now();
  const urlsToTry = [baseUrl, ...CORS_PROXIES.map((fn) => fn(baseUrl))];
  for (const url of urlsToTry) {
    try {
      const text = await tryFetch(url);
      const results = Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: false,
      });
      if (!results.data || !results.data.length)
        throw new Error("CRM target kosong");
      processCrmTargetRows(results.data);
      if (CRM_TARGET_DATA.length) return true;
    } catch (e) {
      /* silent */
    }
  }
  return false;
}

function getCrmRealisasiByMonth() {
  // month name -> { crmName -> total }
  // Fundraiser kosong (-) dihitung ke M Alfin Al-Haris
  const map = {};
  ALL.forEach((r) => {
    const b = monthKeyFromYmd(r.tgl);
    if (!b) return;
    if (!map[b]) map[b] = {};
    let crm = (r.crm || "").trim();
    if (!crm) crm = "M Alfin Al-Haris";
    map[b][crm] = (map[b][crm] || 0) + r.nominal;
  });
  return map;
}

const PUNDI_MEMBERS = [
  "apip yunus 1",
  "apip yunus 2",
  "muhamad sidik 1",
  "muhammad sidik 1",
];

function isPundiMember(name) {
  const n = String(name || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
  return PUNDI_MEMBERS.includes(n);
}

function isPundiTargetRow(crmName) {
  return /^pundi/i.test(String(crmName || "").trim());
}

// Alias nama fundraiser di transaksi → nama di sheet target
const CRM_NAME_ALIASES = {
  "muhammad sidik": "JEMPUT DT",
  "muhamad sidik": "JEMPUT DT",
  "muhammad sidik 1": "Muhamad Sidik 1", // tetap untuk PUNDI member; JEMPUT DT terpisah
};

function normalizeCrmAlias(name) {
  const n = String(name || "").trim();
  if (!n) return n;
  const mapped = CRM_NAME_ALIASES[n.toLowerCase()];
  return mapped || n;
}

function sumRealisasiForCrm(realBag, crmName) {
  // realBag: { crmName -> total } for one month (or aggregated)
  if (!realBag) return 0;
  const keys = Object.keys(realBag);
  if (isPundiTargetRow(crmName)) {
    let s = 0;
    keys.forEach((k) => {
      if (isPundiMember(k) || isPundiTargetRow(k)) s += realBag[k] || 0;
    });
    return s;
  }
  // JEMPUT DT: sheet name + transaksi "Muhammad sidik" (tanpa angka 1)
  if (
    /jemput\s*dt/i.test(String(crmName)) ||
    /^muhammad?\s+sidik$/i.test(String(crmName).trim())
  ) {
    let s = 0;
    keys.forEach((k) => {
      const kl = k.toLowerCase().trim();
      if (
        /jemput\s*dt/i.test(k) ||
        kl === "muhammad sidik" ||
        kl === "muhamad sidik"
      ) {
        if (/\s+1$/.test(kl)) return; // sidik 1 → PUNDI
        s += realBag[k] || 0;
      }
    });
    return s;
  }
  // exact then case-insensitive
  if (realBag[crmName] != null) return realBag[crmName];
  const key = keys.find(
    (k) => k.toLowerCase() === String(crmName).toLowerCase(),
  );
  if (key) return realBag[key];
  // coba alias terbalik
  const aliasKey = keys.find(
    (k) => normalizeCrmAlias(k).toLowerCase() === String(crmName).toLowerCase(),
  );
  return aliasKey ? realBag[aliasKey] : 0;
}

function mergeRealisasiAllMonths(realMap, months) {
  const merged = {};
  months.forEach((m) => {
    const part = realMap[m] || {};
    Object.keys(part).forEach((k) => {
      merged[k] = (merged[k] || 0) + part[k];
    });
  });
  return merged;
}

function renderCrmTargetDashboard() {
  const months = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];
  const sel = document.getElementById("fCrmTargetMonth");
  if (!sel) return;

  const ALL_MONTHS_VAL = "__ALL__";
  const prev = sel.value;
  if (!sel.options.length) {
    const optAll = document.createElement("option");
    optAll.value = ALL_MONTHS_VAL;
    optAll.textContent = "Semua bulan (YTD)";
    sel.appendChild(optAll);
    months.forEach((m) => {
      const opt = document.createElement("option");
      opt.value = m;
      opt.textContent = m;
      sel.appendChild(opt);
    });
    const now = new Date();
    sel.value = months[now.getMonth()] || "Agustus";
    sel.onchange = () => renderCrmTargetDashboard();
  }
  if (prev && (prev === ALL_MONTHS_VAL || months.includes(prev)))
    sel.value = prev;

  const bulan = sel.value || months[new Date().getMonth()];
  const isAllMonths = bulan === ALL_MONTHS_VAL;
  const realMap = getCrmRealisasiByMonth();
  const realBag = isAllMonths
    ? mergeRealisasiAllMonths(realMap, months)
    : realMap[bulan] || {};

  const rows = (CRM_TARGET_DATA || [])
    .map((t) => {
      let target = 0;
      if (isAllMonths) {
        target =
          t.total_target ||
          Object.values(t.months || {}).reduce((s, v) => s + (v || 0), 0);
      } else {
        target = (t.months && t.months[bulan]) || 0;
      }
      const real = sumRealisasiForCrm(realBag, t.crm);
      const pct = target ? (real / target) * 100 : real ? 100 : 0;
      const gap = target - real;
      let label = t.crm;
      if (isPundiTargetRow(t.crm)) label = "PUNDI";
      else if (
        /jemput\s*dt/i.test(t.crm) ||
        /^muhammad?\s+sidik$/i.test(String(t.crm).trim())
      )
        label = "JEMPUT DT";
      return {
        crm: t.crm,
        label,
        target,
        real,
        pct,
        gap,
        pertumbuhan: t.pertumbuhan,
      };
    })
    .filter((r) => r.target > 0 || r.real > 0);
  // urutan mengikuti sheet (jangan di-sort ulang)

  const sumT = rows.reduce((s, r) => s + r.target, 0);
  const sumR = rows.reduce((s, r) => s + r.real, 0);
  const pctAll = sumT ? (sumR / sumT) * 100 : 0;
  const above = rows.filter((r) => r.pct >= 100).length;
  const below = rows.filter((r) => r.pct < 100).length;
  const periodLabel = isAllMonths ? "Semua bulan" : bulan;

  const kpiEl = document.getElementById("crmTargetKpiGrid");
  if (kpiEl) {
    kpiEl.innerHTML = `
      <div class="kpi-card blue"><div class="label">Target Fundraiser ${periodLabel}</div><div class="value">${formatRp(sumT)}</div><div class="sub">${formatFull(sumT)}</div></div>
      <div class="kpi-card green"><div class="label">Realisasi Fundraiser ${periodLabel}</div><div class="value">${formatRp(sumR)}</div><div class="sub">${formatFull(sumR)}</div></div>
      <div class="kpi-card ${pctAll >= 100 ? "green" : "orange"}"><div class="label">Pencapaian</div><div class="value">${pctAll.toFixed(1)}%</div><div class="sub">agregat semua fundraiser</div></div>
      <div class="kpi-card teal"><div class="label">Fundraiser ≥ Target</div><div class="value">${above}</div><div class="sub">dari ${rows.length} fundraiser</div></div>
      <div class="kpi-card red"><div class="label">Fundraiser &lt; Target</div><div class="value">${below}</div><div class="sub">belum tercapai</div></div>
      <div class="kpi-card purple"><div class="label">Sisa Target</div><div class="value">${formatRp(Math.max(0, sumT - sumR))}</div><div class="sub">${sumR > sumT ? "Surplus " + formatRp(sumR - sumT) : formatFull(Math.max(0, sumT - sumR))}</div></div>
    `;
  }

  // chart — SEMUA CRM, horizontal bar
  const chartRows = rows;
  if (charts.crmTarget) {
    try {
      charts.crmTarget.destroy();
    } catch (e) {}
  }
  const canvas = document.getElementById("chartCrmTarget");
  if (canvas) {
    // tinggi menyesuaikan jumlah CRM
    const wrap = canvas.parentElement;
    if (wrap)
      wrap.style.height = Math.max(420, chartRows.length * 28 + 80) + "px";
    charts.crmTarget = new Chart(canvas, {
      type: "bar",
      plugins: [barValueLabelsPlugin],
      data: {
        labels: chartRows.map((r) => r.label || r.crm),
        datasets: [
          {
            label: "Target",
            data: chartRows.map((r) => r.target),
            backgroundColor: "rgba(37,99,235,0.65)",
            // borderColor: '#2563eb',
            // borderWidth: 1,
            borderRadius: 4,
          },
          {
            label: "Realisasi",
            data: chartRows.map((r) => r.real),
            backgroundColor: "rgba(5,150,105,0.75)",
            // borderColor: '#059669',
            // borderWidth: 1,
            borderRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: "y",
        layout: { padding: { right: 0 } },
        interaction: { mode: "nearest", axis: "y", intersect: true },
        plugins: {
          legend: { labels: { color: "#64748b", font: { size: 11 } } },
          barValueLabels: { display: true, color: "#334155", fullNumber: true },
          tooltip: {
            // index + axis y: tampilkan Target & Realisasi untuk CRM yang sama
            mode: "index",
            axis: "y",
            intersect: false,
            position: "nearest",
            backgroundColor: "#fff",
            titleColor: "#0f172a",
            bodyColor: "#0f172a",
            borderColor: "#e2e8f0",
            borderWidth: 1,
            callbacks: {
              title: (items) => {
                if (!items.length) return "";
                const idx = items[0].dataIndex;
                const labels = items[0].chart.data.labels || [];
                return labels[idx] != null ? String(labels[idx]) : "";
              },
              label: (ctx) =>
                " " + ctx.dataset.label + ": " + formatFull(ctx.raw),
              afterBody: (items) => {
                if (!items.length) return "";
                const byLabel = {};
                items.forEach((it) => {
                  byLabel[it.dataset.label] = it.raw || 0;
                });
                const target =
                  byLabel["Target"] != null
                    ? byLabel["Target"]
                    : items[0].raw || 0;
                const real =
                  byLabel["Realisasi"] != null
                    ? byLabel["Realisasi"]
                    : items[1]
                      ? items[1].raw
                      : 0;
                if (!target) return "";
                const pct = (real / target) * 100;
                const gap = target - real;
                return [
                  " Pencapaian: " + pct.toFixed(1) + "%",
                  gap >= 0
                    ? " Kurang: " + formatFull(gap)
                    : " Surplus: " + formatFull(-gap),
                ];
              },
            },
          },
        },
        scales: {
          x: {
            ticks: { color: "#64748b", callback: (v) => formatRp(v) },
            grid: { display: false },
          },
          y: {
            ticks: { color: "#64748b", font: { size: 10 } },
            grid: { color: "rgba(226,232,240,0.9)" },
          },
        },
      },
    });
  }

  const tbody = document.querySelector("#tableCrmTarget tbody");
  if (tbody) {
    tbody.innerHTML = "";
    rows.forEach((r, i) => {
      const tr = document.createElement("tr");
      const gapLabel =
        r.gap >= 0 ? formatFull(r.gap) : "Surplus " + formatFull(-r.gap);
      tr.innerHTML = `<td><span class="rank rank-flat">${i}</span></td>
        <td>${r.label || r.crm}</td>
        <td class="num">${formatFull(r.target)}</td>
        <td class="num">${formatFull(r.real)}</td>
        <td class="num">${r.pct.toFixed(1)}%</td>
        <td class="num">${gapLabel}</td>`;
      tbody.appendChild(tr);
    });
    if (!rows.length) {
      tbody.innerHTML =
        '<tr><td colspan="6" class="empty-state">Data target fundraiser belum tersedia</td></tr>';
    }
  }
}

function getRealisasi2026ByMonth() {
  const liveByMonth = {};
  ALL.forEach((r) => {
    const b = monthKeyFromYmd(r.tgl);
    if (!b) return;
    liveByMonth[b] = (liveByMonth[b] || 0) + r.nominal;
  });
  const map = {};
  TARGET_DATA.forEach((t) => {
    if (liveByMonth[t.bulan] != null && liveByMonth[t.bulan] > 0)
      map[t.bulan] = liveByMonth[t.bulan];
    else map[t.bulan] = t.realisasi || 0;
  });
  return map;
}

function renderYoyChart() {
  const months = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];
  const map25 = {};
  (Y2025_DATA.length ? Y2025_DATA : FALLBACK_Y2025).forEach((t) => {
    map25[t.bulan] = t.realisasi || 0;
  });
  const map26 = getRealisasi2026ByMonth();

  const labels = months;
  const data25 = months.map((m) => map25[m] || 0);
  const data26 = months.map((m) => map26[m] || 0);

  if (charts.yoy) {
    try {
      charts.yoy.destroy();
    } catch (e) {}
  }
  const canvas = document.getElementById("chartYoy");
  if (!canvas) return;

  charts.yoy = new Chart(canvas, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Realisasi 2025",
          data: data25,
          backgroundColor: "rgba(217, 119, 6, 0.7)",
          // borderColor: "#64748b",
          // borderWidth: 1,
          borderRadius: 4,
        },
        {
          label: "Realisasi 2026",
          data: data26,
          backgroundColor: "rgba(5, 150, 105, 0.75)",
          // borderColor: "#059669",
          // borderWidth: 1,
          borderRadius: 4,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: "index", axis: "x", intersect: false },
      plugins: {
        legend: { labels: { color: "#64748b", font: { size: 11 } } },
        tooltip: {
          mode: "index",
          intersect: false,
          backgroundColor: "#ffffff",
          titleColor: "#0f172a",
          bodyColor: "#0f172a",
          borderColor: "#e2e8f0",
          borderWidth: 1,
          callbacks: {
            title: (items) => {
              if (!items.length) return "";
              const idx = items[0].dataIndex;
              const labels = items[0].chart.data.labels || [];
              return labels[idx] != null ? String(labels[idx]) : "";
            },
            label: (ctx) =>
              " " + ctx.dataset.label + ": " + formatFull(ctx.raw),
            afterBody: (items) => {
              if (items.length < 2) return "";
              const byLabel = {};
              items.forEach((it) => {
                byLabel[it.dataset.label] = it.raw || 0;
              });
              const a =
                byLabel["Realisasi 2025"] != null
                  ? byLabel["Realisasi 2025"]
                  : items[0].raw || 0;
              const b =
                byLabel["Realisasi 2026"] != null
                  ? byLabel["Realisasi 2026"]
                  : items[1].raw || 0;
              if (!a) return " Δ —";
              const pct = ((b - a) / a) * 100;
              return (
                " Δ " + (pct >= 0 ? "+" : "") + pct.toFixed(1) + "% vs 2025"
              );
            },
          },
        },
      },
      scales: {
        x: {
          ticks: { color: "#64748b", font: { size: 10 } },
          grid: { color: "rgba(226,232,240,0.9)" },
        },
        y: {
          ticks: { color: "#64748b", callback: (v) => formatRp(v) },
          grid: { color: "rgba(226,232,240,0.9)" },
        },
      },
    },
  });

  // YoY KPIs — compare same months that have data in either year up to current calendar month
  const now = new Date();
  const curIdx = now.getMonth(); // 0-based
  const monthsToDate = months.slice(0, curIdx + 1);
  const sum25 = monthsToDate.reduce((s, m) => s + (map25[m] || 0), 0);
  const sum26 = monthsToDate.reduce((s, m) => s + (map26[m] || 0), 0);
  const sum25Full = data25.reduce((s, v) => s + v, 0);
  const sum26Full = data26.reduce((s, v) => s + v, 0);
  const growth = sum25 ? ((sum26 - sum25) / sum25) * 100 : 0;
  const curMonth = months[curIdx];
  const m25 = map25[curMonth] || 0;
  const m26 = map26[curMonth] || 0;
  const growthM = m25 ? ((m26 - m25) / m25) * 100 : m26 ? 100 : 0;

  const yoyEl = document.getElementById("yoyKpiGrid");
  if (yoyEl) {
    yoyEl.innerHTML = `
      <div class="kpi-card purple"><div class="label">Realisasi 2025 (YTD)</div><div class="value">${formatRp(sum25)}</div><div class="sub">Jan–${curMonth}</div></div>
      <div class="kpi-card teal"><div class="label">Realisasi 2026 (YTD)</div><div class="value">${formatRp(sum26)}</div><div class="sub">Jan–${curMonth}</div></div>
      <div class="kpi-card ${growth >= 0 ? "orange" : "red"}"><div class="label">Pertumbuhan YTD</div><div class="value">${growth >= 0 ? "+" : ""}${growth.toFixed(1)}%</div><div class="sub">2026 vs 2025 periode sama</div></div>
      <div class="kpi-card cyan"><div class="label">${curMonth} 2025</div><div class="value">${formatRp(m25)}</div><div class="sub">${formatFull(m25)}</div></div>
      <div class="kpi-card blue"><div class="label">${curMonth} 2026</div><div class="value">${formatRp(m26)}</div><div class="sub">${formatFull(m26)}</div></div>
      <div class="kpi-card ${growthM >= 0 ? "green" : "red"}"><div class="label">Δ ${curMonth}</div><div class="value">${growthM >= 0 ? "+" : ""}${growthM.toFixed(1)}%</div><div class="sub">bulan ini vs tahun lalu</div></div>
    `;
  }
}

function renderTargetChart() {
  // Live realisasi per bulan from ALL transactions (not affected by filters)
  const liveByMonth = {};
  ALL.forEach((r) => {
    const b = monthKeyFromYmd(r.tgl);
    if (!b) return;
    liveByMonth[b] = (liveByMonth[b] || 0) + r.nominal;
  });

  const labels = TARGET_DATA.map((t) => t.bulan);
  const targets = TARGET_DATA.map((t) => t.target);
  const realisasi = TARGET_DATA.map((t) => {
    // prefer live sum if available for that month, else sheet value
    if (liveByMonth[t.bulan] != null && liveByMonth[t.bulan] > 0)
      return liveByMonth[t.bulan];
    return t.realisasi || 0;
  });

  if (charts.target) {
    try {
      charts.target.destroy();
    } catch (e) {}
  }

  const canvas = document.getElementById("chartTarget");
  if (!canvas) return;

  charts.target = new Chart(canvas, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Target",
          data: targets,
          backgroundColor: "rgba(37,99,235,0.65)",
          // borderColor: "#2563eb",
          // borderWidth: 1,
          borderRadius: 4,
        },
        {
          label: "Realisasi",
          data: realisasi,
          backgroundColor: "rgba(22,163,74,0.75)",
          // borderColor: "#16a34a",
          // borderWidth: 1,
          borderRadius: 4,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: "index", axis: "x", intersect: false },
      plugins: {
        legend: { labels: { color: "#64748b", font: { size: 11 } } },
        tooltip: {
          mode: "index",
          axis: "x",
          intersect: false,
          backgroundColor: "#ffffff",
          titleColor: "#0f172a",
          bodyColor: "#0f172a",
          borderColor: "#e2e8f0",
          borderWidth: 1,
          callbacks: {
            title: (items) => {
              if (!items.length) return "";
              const idx = items[0].dataIndex;
              const labels = items[0].chart.data.labels || [];
              return labels[idx] != null ? String(labels[idx]) : "";
            },
            label: (ctx) =>
              " " + ctx.dataset.label + ": " + formatFull(ctx.raw),
            afterBody: (items) => {
              if (!items.length) return "";
              const byLabel = {};
              items.forEach((it) => {
                byLabel[it.dataset.label] = it.raw || 0;
              });
              const target =
                byLabel["Target"] != null
                  ? byLabel["Target"]
                  : items[0].raw || 0;
              const real =
                byLabel["Realisasi"] != null
                  ? byLabel["Realisasi"]
                  : items[1]
                    ? items[1].raw
                    : 0;
              if (!target) return " Pencapaian: —";
              const pct = (real / target) * 100;
              const sisa = target - real;
              return [
                " Pencapaian: " + pct.toFixed(1) + "%",
                sisa >= 0
                  ? " Kurang: " + formatFull(sisa)
                  : " Surplus: " + formatFull(-sisa),
              ];
            },
          },
        },
      },
      scales: {
        x: {
          ticks: { color: "#64748b", font: { size: 10 } },
          grid: { color: "rgba(226,232,240,0.9)" },
        },
        y: {
          ticks: { color: "#64748b", callback: (v) => formatRp(v) },
          grid: { color: "rgba(226,232,240,0.9)" },
        },
      },
    },
  });

  // Target KPI: calendar month (or latest month in ALL) — independent of filters
  let curMonth = "";
  const now = new Date();
  const monthNames = {
    1: "Januari",
    2: "Februari",
    3: "Maret",
    4: "April",
    5: "Mei",
    6: "Juni",
    7: "Juli",
    8: "Agustus",
    9: "September",
    10: "Oktober",
    11: "November",
    12: "Desember",
  };
  const calMonth = monthNames[now.getMonth() + 1];
  if (TARGET_DATA.some((t) => t.bulan === calMonth)) {
    curMonth = calMonth;
  } else if (ALL.length) {
    const maxTgl = ALL.reduce((m, r) => (r.tgl > m ? r.tgl : m), ALL[0].tgl);
    curMonth = monthKeyFromYmd(maxTgl);
  } else if (TARGET_DATA.length) {
    curMonth = "Agustus";
  }
  const tRow = TARGET_DATA.find((t) => t.bulan === curMonth);
  const liveReal = liveByMonth[curMonth] || (tRow ? tRow.realisasi : 0) || 0;
  const tgt = tRow ? tRow.target : 0;
  const pct = tgt ? (liveReal / tgt) * 100 : 0;
  const sisa = tgt - liveReal;

  const kpiEl = document.getElementById("targetKpiGrid");
  if (kpiEl) {
    kpiEl.innerHTML = `
      <div class="kpi-card blue"><div class="label">Target ${curMonth || "-"}</div><div class="value">${formatRp(tgt)}</div><div class="sub">${formatFull(tgt)}</div></div>
      <div class="kpi-card green"><div class="label">Realisasi ${curMonth || "-"}</div><div class="value">${formatRp(liveReal)}</div><div class="sub">${formatFull(liveReal)}</div></div>
      <div class="kpi-card ${pct >= 100 ? "green" : "orange"}"><div class="label">Pencapaian</div><div class="value">${pct.toFixed(1)}%</div><div class="sub">dari target bulan</div></div>
      <div class="kpi-card red"><div class="label">Sisa Target</div><div class="value">${formatRp(Math.max(0, sisa))}</div><div class="sub">${sisa < 0 ? "Surplus " + formatRp(-sisa) : formatFull(Math.max(0, sisa))}</div></div>
      <div class="kpi-card purple"><div class="label">Target Tahunan</div><div class="value">${formatRp(TARGET_DATA.reduce((s, t) => s + t.target, 0))}</div><div class="sub">12 bulan</div></div>
      <div class="kpi-card teal"><div class="label">Realisasi YTD</div><div class="value">${formatRp(realisasi.reduce((s, v) => s + v, 0))}</div><div class="sub">semua bulan di chart</div></div>
    `;
  }
}

function renderAll(rows) {
  const a = aggregate(rows);
  destroyCharts();
  renderTargetChart();
  renderYoyChart();
  renderCrmTargetDashboard();

  document.getElementById("kpiGrid").innerHTML = `
    <div class="kpi-card green"><div class="label">Total Dana</div><div class="value">${formatRp(a.total)}</div><div class="sub">${formatFull(a.total)}</div></div>
    <div class="kpi-card blue"><div class="label">Jumlah Transaksi</div><div class="value">${a.count.toLocaleString("id-ID")}</div><div class="sub">filtered</div></div>
    <div class="kpi-card purple"><div class="label">Donatur Unik</div><div class="value">${a.uniqueDonors.toLocaleString("id-ID")}</div><div class="sub">ID berbeda</div></div>
    <div class="kpi-card orange"><div class="label">Rata-rata</div><div class="value">${formatRp(a.avg)}</div><div class="sub">per transaksi</div></div>
    <div class="kpi-card red"><div class="label">Donasi Terbesar</div><div class="value">${formatRp(a.maxN)}</div><div class="sub">single trx</div></div>
    <div class="kpi-card cyan"><div class="label">Hari dalam Filter</div><div class="value">${a.dailyLabels.length}</div><div class="sub">hari aktif</div></div>`;

  if (a.count === 0) {
    // still show target chart with sheet data only
    return;
  }

  charts.daily = new Chart(document.getElementById("chartDaily"), {
    type: "bar",
    data: {
      labels: a.dailyLabels.map((d) => d.slice(8) + "/" + d.slice(5, 7)),
      datasets: [
        {
          label: "Nominal (Rp)",
          data: a.dailyTotals,
          backgroundColor: "rgba(22,163,74,0.75)",
          borderColor: "#16a34a",
          borderWidth: 1,
          borderRadius: 4,
          yAxisID: "y",
        },
        {
          label: "Jumlah Trx",
          data: a.dailyCounts,
          type: "line",
          borderColor: "#2563eb",
          backgroundColor: "rgba(37,99,235,0.1)",
          tension: 0.3,
          fill: true,
          yAxisID: "y1",
          pointRadius: 3,
          pointBackgroundColor: "#2563eb",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: "index", axis: "x", intersect: false },
      plugins: {
        legend: { labels: { color: "#64748b", font: { size: 11 } } },
        tooltip: {
          mode: "index",
          axis: "x",
          intersect: false,
          backgroundColor: "#ffffff",
          titleColor: "#0f172a",
          bodyColor: "#0f172a",
          borderColor: "#e2e8f0",
          borderWidth: 1,
          callbacks: {
            label: (ctx) => {
              if (ctx.dataset.yAxisID === "y1") {
                return (
                  " Jumlah Trx: " +
                  Number(ctx.raw).toLocaleString("id-ID") +
                  " trx"
                );
              }
              return " Nominal (Rp): " + formatFull(ctx.raw);
            },
          },
        },
      },
      scales: {
        x: {
          ticks: { color: "#64748b", font: { size: 10 } },
          grid: { color: "rgba(226,232,240,0.9)" },
        },
        y: {
          position: "left",
          ticks: { color: "#64748b", callback: (v) => formatRp(v) },
          grid: { color: "rgba(226,232,240,0.9)" },
        },
        y1: {
          position: "right",
          ticks: { color: "#64748b" },
          grid: { drawOnChartArea: false },
        },
      },
    },
  });

  // Tren per jam (00–23) — mengikuti filter
  const hourlyCanvas = document.getElementById("chartHourly");
  if (hourlyCanvas) {
    charts.hourly = new Chart(hourlyCanvas, {
      type: "bar",
      data: {
        labels: a.hourlyLabels.map((h) => h + ":00"),
        datasets: [
          {
            label: "Nominal (Rp)",
            data: a.hourlyTotals,
            backgroundColor: "rgba(5,150,105,0.75)",
            borderColor: "#059669",
            borderWidth: 1,
            borderRadius: 4,
            yAxisID: "y",
          },
          {
            label: "Jumlah Trx",
            data: a.hourlyCounts,
            type: "line",
            borderColor: "#d97706",
            backgroundColor: "rgba(217,119,6,0.12)",
            tension: 0.3,
            fill: true,
            yAxisID: "y1",
            pointRadius: 2,
            pointBackgroundColor: "#d97706",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: "index", axis: "x", intersect: false },
        plugins: {
          legend: { labels: { color: "#64748b", font: { size: 11 } } },
          tooltip: {
            mode: "index",
            axis: "x",
            intersect: false,
            backgroundColor: "#ffffff",
            titleColor: "#0f172a",
            bodyColor: "#0f172a",
            borderColor: "#e2e8f0",
            borderWidth: 1,
            callbacks: {
              title: (items) => {
                const h = items[0] ? items[0].label : "";
                // 00:00 berarti 00:00–00:59
                const base = (h || "00:00").slice(0, 2);
                return "Jam " + base + ":00–" + base + ":59";
              },
              label: (ctx) => {
                if (ctx.dataset.yAxisID === "y1") {
                  return (
                    " Jumlah Trx: " +
                    Number(ctx.raw).toLocaleString("id-ID") +
                    " trx"
                  );
                }
                return " Nominal (Rp): " + formatFull(ctx.raw);
              },
            },
          },
        },
        scales: {
          x: {
            ticks: {
              color: "#64748b",
              font: { size: 9 },
              maxRotation: 0,
              autoSkip: false,
            },
            grid: { color: "rgba(226,232,240,0.9)" },
          },
          y: {
            position: "left",
            ticks: { color: "#64748b", callback: (v) => formatRp(v) },
            grid: { color: "rgba(226,232,240,0.9)" },
          },
          y1: {
            position: "right",
            ticks: { color: "#64748b" },
            grid: { drawOnChartArea: false },
          },
        },
      },
    });
  }

  const topProg = a.progSorted.slice(0, 8);
  const otherProg = a.progSorted.slice(8).reduce((s, x) => s + x[1].total, 0);
  const progLabels = topProg.map((x) => x[0]),
    progData = topProg.map((x) => x[1].total);
  if (otherProg > 0) {
    progLabels.push("Lainnya");
    progData.push(otherProg);
  }

  charts.program = new Chart(document.getElementById("chartProgram"), {
    type: "doughnut",
    data: {
      labels: progLabels,
      datasets: [
        {
          data: progData,
          backgroundColor: COLORS,
          borderWidth: 0,
          hoverOffset: 6,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "right",
          labels: { color: "#64748b", font: { size: 10 }, boxWidth: 11 },
        },
        tooltip: {
          callbacks: {
            label: (ctx) => {
              const tot = ctx.dataset.data.reduce((a, b) => a + b, 0);
              return (
                " " +
                formatFull(ctx.raw) +
                " (" +
                ((ctx.raw / tot) * 100).toFixed(1) +
                "%)"
              );
            },
          },
        },
      },
    },
  });

  const jenisEntries = Object.entries(a.jenisMap).sort((x, y) => y[1] - x[1]);
  charts.jenis = new Chart(document.getElementById("chartJenis"), {
    type: "doughnut",
    data: {
      labels: jenisEntries.map((x) => x[0]),
      datasets: [
        {
          data: jenisEntries.map((x) => x[1]),
          backgroundColor: [
            "#22c55e",
            "#3b82f6",
            "#fbbf24",
            "#a855f7",
            "#f87171",
          ],
          borderWidth: 0,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: "bottom", labels: { color: "#64748b" } },
        tooltip: {
          callbacks: {
            label: (ctx) => {
              const tot = ctx.dataset.data.reduce((a, b) => a + b, 0);
              return (
                " " +
                formatFull(ctx.raw) +
                " (" +
                ((ctx.raw / tot) * 100).toFixed(1) +
                "%)"
              );
            },
          },
        },
      },
    },
  });

  const viaEntries = Object.entries(a.viaMap).sort((x, y) => y[1] - x[1]);
  charts.via = new Chart(document.getElementById("chartVia"), {
    type: "bar",
    data: {
      labels: viaEntries.map((x) => x[0]),
      datasets: [
        {
          label: "Dana",
          data: viaEntries.map((x) => x[1]),
          backgroundColor: COLORS.slice(0, viaEntries.length),
          borderRadius: 6,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: "y",
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: (ctx) => " " + formatFull(ctx.raw) } },
      },
      scales: {
        x: {
          ticks: { color: "#64748b", callback: (v) => formatRp(v) },
          grid: { color: "rgba(226,232,240,0.9)" },
        },
        y: {
          ticks: { color: "#64748b", font: { size: 11 } },
          grid: { display: false },
        },
      },
    },
  });

  const sumberEntries = Object.entries(a.sumberMap).sort((x, y) => y[1] - x[1]);
  charts.sumber = new Chart(document.getElementById("chartSumber"), {
    type: "doughnut",
    data: {
      labels: sumberEntries.map((x) => x[0]),
      datasets: [
        {
          data: sumberEntries.map((x) => x[1]),
          backgroundColor: COLORS,
          borderWidth: 0,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom",
          labels: { color: "#64748b", font: { size: 10 } },
        },
        tooltip: {
          callbacks: {
            label: (ctx) => {
              const tot = ctx.dataset.data.reduce((a, b) => a + b, 0);
              return (
                " " +
                formatFull(ctx.raw) +
                " (" +
                ((ctx.raw / tot) * 100).toFixed(1) +
                "%)"
              );
            },
          },
        },
      },
    },
  });

  const jdEntries = Object.entries(a.jdMap).sort((x, y) => y[1] - x[1]);
  charts.donatur = new Chart(document.getElementById("chartDonatur"), {
    type: "pie",
    data: {
      labels: jdEntries.map((x) => x[0]),
      datasets: [
        {
          data: jdEntries.map((x) => x[1]),
          backgroundColor: COLORS,
          borderWidth: 0,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: "bottom", labels: { color: "#64748b" } },
        tooltip: {
          callbacks: {
            label: (ctx) => {
              const tot = ctx.dataset.data.reduce((a, b) => a + b, 0);
              return (
                " " +
                formatFull(ctx.raw) +
                " (" +
                ((ctx.raw / tot) * 100).toFixed(1) +
                "%)"
              );
            },
          },
        },
      },
    },
  });

  charts.crm = new Chart(document.getElementById("chartCRM"), {
    type: "bar",
    data: {
      labels: a.crmSorted.map((x) => x[0]),
      datasets: [
        {
          label: "Total Dana",
          data: a.crmSorted.map((x) => x[1].total),
          backgroundColor: "rgba(147,51,234,0.7)",
          borderColor: "#9333ea",
          borderWidth: 1,
          borderRadius: 4,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: "y",
      interaction: { mode: "nearest", axis: "y", intersect: true },
      plugins: {
        legend: { display: false },
        tooltip: {
          mode: "nearest",
          axis: "y",
          intersect: true,
          callbacks: {
            title: (items) => (items[0] ? items[0].label : ""),
            label: (ctx) => " " + formatFull(ctx.raw),
          },
        },
      },
      scales: {
        x: {
          ticks: { color: "#64748b", callback: (v) => formatRp(v) },
          grid: { color: "rgba(226,232,240,0.9)" },
        },
        y: {
          ticks: { color: "#64748b", font: { size: 10 } },
          grid: { display: false },
        },
      },
    },
  });

  const donorsBody = document.querySelector("#tableDonors tbody");
  donorsBody.innerHTML = "";
  a.topDonors.forEach((d, i) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td><span class="rank">${i + 1}</span></td><td>${d[0]}</td><td class="num">${formatFull(d[1])}</td>`;
    donorsBody.appendChild(tr);
  });
  if (!a.topDonors.length)
    donorsBody.innerHTML =
      '<tr><td colspan="3" class="empty-state">Tidak ada data</td></tr>';

  const progBody = document.querySelector("#tableProgram tbody");
  progBody.innerHTML = "";
  a.progSorted.forEach((p, i) => {
    const pct = a.total ? ((p[1].total / a.total) * 100).toFixed(1) : 0;
    const tr = document.createElement("tr");
    tr.innerHTML = `<td><span class="rank">${i + 1}</span></td><td>${p[0]}<div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div></td><td class="num">${formatRp(p[1].total)}</td><td class="num">${p[1].count}</td>`;
    progBody.appendChild(tr);
  });
  if (!a.progSorted.length)
    progBody.innerHTML =
      '<tr><td colspan="4" class="empty-state">Tidak ada data</td></tr>';

  const recentBody = document.querySelector("#tableRecent tbody");
  recentBody.innerHTML = "";
  a.recent.forEach((r) => {
    const cls =
      r.jenis === "Cash" ? "cash" : r.jenis === "Bank" ? "bank" : "noncash";
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${r.waktu}</td><td>${(r.nama || "").substring(0, 28)}</td><td>${(r.program || "").substring(0, 32)}</td><td class="num">${formatFull(r.nominal)}</td><td><span class="tag ${cls}">${r.jenis || "-"}</span></td><td>${r.via_himpun || "-"}</td><td>${r.crm || "-"}</td>`;
    recentBody.appendChild(tr);
  });
  if (!a.recent.length)
    recentBody.innerHTML =
      '<tr><td colspan="7" class="empty-state">Tidak ada data</td></tr>';
}

function downloadCrmTargetChart() {
  const chart = charts.crmTarget;
  if (!chart || !chart.canvas) {
    alert("Grafik belum siap. Tunggu data termuat lalu coba lagi.");
    return;
  }
  try {
    // canvas dengan background putih agar screenshot tidak transparan
    const src = chart.canvas;
    const out = document.createElement("canvas");
    out.width = src.width;
    out.height = src.height;
    const ctx = out.getContext("2d");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, out.width, out.height);
    ctx.drawImage(src, 0, 0);
    const url = out.toDataURL("image/png");
    const a = document.createElement("a");
    const bulanEl = document.getElementById("fCrmTargetMonth");
    const bulan =
      bulanEl && bulanEl.value
        ? String(bulanEl.value).replace(/[^\w\-]+/g, "_")
        : "fundraiser";
    const stamp = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = "target-realisasi-fundraiser-" + bulan + "-" + stamp + ".png";
    document.body.appendChild(a);
    a.click();
    a.remove();
  } catch (e) {
    console.warn(e);
    alert("Gagal mengunduh gambar grafik.");
  }
}

function switchTab(name) {
  document.querySelectorAll(".tab-btn").forEach((b) => {
    b.classList.toggle("active", b.getAttribute("data-tab") === name);
  });
  document.querySelectorAll(".tab-panel").forEach((p) => {
    p.classList.toggle("active", p.id === "tab-" + name);
  });
  // Chart.js: canvas di panel display:none punya ukuran 0 — redraw saat tab aktif
  setTimeout(() => {
    if (name === "ops" && ALL.length) {
      applyFilters();
    } else if (name === "global") {
      renderTargetChart();
      renderYoyChart();
    } else if (name === "crm") {
      renderCrmTargetDashboard();
    }
  }, 30);
}

// ===== AUTH (simple, no database) =====
const AUTH_USER = "admin";
const AUTH_PASS = "Admin123";
const AUTH_KEY = "dashboard_auth_ok";

function isLoggedIn() {
  return sessionStorage.getItem(AUTH_KEY) === "1";
}

function logout() {
  sessionStorage.removeItem(AUTH_KEY);
  location.reload();
}

function showApp() {
  document.getElementById("loginOverlay").classList.add("hidden");
  document.getElementById("appRoot").classList.remove("hidden");
}

async function startDashboard() {
  document.getElementById("loadingOverlay").classList.remove("hidden");
  await loadTargetData();
  await loadY2025Data();
  await loadCrmTargetData();
  await loadData(false);
  setInterval(async () => {
    await loadTargetData();
    await loadY2025Data();
    await loadCrmTargetData();
    await loadData(true);
  }, AUTO_REFRESH_MS);
}

document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const user = document.getElementById("loginUser").value.trim();
  const pass = document.getElementById("loginPass").value;
  const err = document.getElementById("loginError");
  if (user === AUTH_USER && pass === AUTH_PASS) {
    sessionStorage.setItem(AUTH_KEY, "1");
    err.classList.remove("show");
    showApp();
    startDashboard();
  } else {
    err.classList.add("show");
    document.getElementById("loginPass").value = "";
    document.getElementById("loginPass").focus();
  }
});

// Boot
if (isLoggedIn()) {
  showApp();
  startDashboard();
}
