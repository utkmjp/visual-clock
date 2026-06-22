const els = {
  app: document.getElementById("app"),
  secondFill: document.getElementById("secondFill"),
  hourCircle: document.getElementById("hourCircle"),
  time: document.getElementById("time"),
  date: document.getElementById("date"),
  dayBar: document.getElementById("dayBar"),
  dayPercent: document.getElementById("dayPercent"),
  settingsButton: document.getElementById("settingsButton"),
  closeSettingsButton: document.getElementById("closeSettingsButton"),
  settingsPanel: document.getElementById("settingsPanel"),
  fullscreenButton: document.getElementById("fullscreenButton"),
  uiSize: document.getElementById("uiSize"),
  bgColor: document.getElementById("bgColor"),
  riseColor: document.getElementById("riseColor"),
  riseOpacity: document.getElementById("riseOpacity"),
  textColor: document.getElementById("textColor"),
  accentColor: document.getElementById("accentColor"),
  lineColor: document.getElementById("lineColor"),
  resetButton: document.getElementById("resetButton")
};

const radius = 135;
const circumference = 2 * Math.PI * radius;
els.hourCircle.style.strokeDasharray = circumference;
els.hourCircle.style.strokeDashoffset = circumference;

const storageKey = "visualClockVerticalSafeSettings_v1";

const defaultSettings = {
  bgColor: "#0f1115",
  riseColor: "#ffffff",
  riseOpacity: 14,
  textColor: "#ffffff",
  accentColor: "#ffffff",
  lineColor: "#2a2d35",
  uiSize: 118
};

let settings = loadSettings();

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function loadSettings() {
  try {
    const saved = localStorage.getItem(storageKey);
    if (!saved) return { ...defaultSettings };
    return { ...defaultSettings, ...JSON.parse(saved) };
  } catch {
    return { ...defaultSettings };
  }
}

function saveSettings() {
  localStorage.setItem(storageKey, JSON.stringify(settings));
}

function hexToRgba(hex, opacityPercent) {
  const safeHex = /^#[0-9a-fA-F]{6}$/.test(hex) ? hex : "#ffffff";
  const r = parseInt(safeHex.slice(1, 3), 16);
  const g = parseInt(safeHex.slice(3, 5), 16);
  const b = parseInt(safeHex.slice(5, 7), 16);
  const a = clamp(Number(opacityPercent), 0, 100) / 100;
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

function updateMutedColor() {
  document.documentElement.style.setProperty("--muted-color", hexToRgba(settings.textColor, 68));
}

function applySettings() {
  const root = document.documentElement;

  root.style.setProperty("--bg-color", settings.bgColor);
  root.style.setProperty("--text-color", settings.textColor);
  root.style.setProperty("--accent-color", settings.accentColor);
  root.style.setProperty("--line-bg-color", settings.lineColor);
  root.style.setProperty("--rise-bg", hexToRgba(settings.riseColor, settings.riseOpacity));
  updateMutedColor();

  els.bgColor.value = settings.bgColor;
  els.riseColor.value = settings.riseColor;
  els.riseOpacity.value = settings.riseOpacity;
  els.textColor.value = settings.textColor;
  els.accentColor.value = settings.accentColor;
  els.lineColor.value = settings.lineColor;
  els.uiSize.value = settings.uiSize;

  updateLayout();
}

function updateLayout() {
  const root = document.documentElement;
  const width = window.innerWidth || document.documentElement.clientWidth;
  const height = window.innerHeight || document.documentElement.clientHeight;

  // UIサイズは「大きく見せる希望値」として扱う。
  // ただし最終サイズは必ず画面内に収まるように上限をかける。
  const scale = clamp(settings.uiSize / 100, 0.8, 1.5);

  const topReserve = clamp(height * 0.11, 76, 108);
  const bottomReserve = clamp(height * 0.025, 12, 26);
  const dayBlock = clamp(height * 0.105, 74, 112);
  const dateBlock = clamp(height * 0.052, 34, 52);
  const gaps = clamp(height * 0.055, 34, 62);

  const availableForCircle = height - topReserve - bottomReserve - dayBlock - dateBlock - gaps;
  const circleHardMax = Math.min(width * 0.88, availableForCircle, 520);
  const circleWanted = circleHardMax * (0.84 + (scale - 1) * 0.28);
  const circleSize = clamp(circleWanted, 230, Math.max(230, circleHardMax));

  // ここが一番大事。数字は必ず円と画面幅の中に収める。
  const timeSize = clamp(circleSize * 0.285, 64, Math.min(circleSize * 0.32, width * 0.245, 132));

  const dayLabelSize = clamp(width * 0.047, 15, 24);
  const dateSize = clamp(width * 0.057, 18, 30);
  const barWidth = clamp(width * 0.78, 280, Math.min(width * 0.92, 660));
  const barHeight = clamp(circleSize * 0.075, 22, 38);
  const gapMain = clamp(height * 0.026, 14, 28);

  root.style.setProperty("--circle-size", `${Math.round(circleSize)}px`);
  root.style.setProperty("--time-size", `${Math.round(timeSize)}px`);
  root.style.setProperty("--day-label-size", `${Math.round(dayLabelSize)}px`);
  root.style.setProperty("--date-size", `${Math.round(dateSize)}px`);
  root.style.setProperty("--bar-width", `${Math.round(barWidth)}px`);
  root.style.setProperty("--bar-height", `${Math.round(barHeight)}px`);
  root.style.setProperty("--gap-main", `${Math.round(gapMain)}px`);
}

function syncSecondFill() {
  const now = new Date();
  const secondProgress = (now.getSeconds() + now.getMilliseconds() / 1000) / 60;
  els.secondFill.style.animation = "none";
  els.secondFill.style.height = `${secondProgress * 100}%`;
  void els.secondFill.offsetHeight;
  els.secondFill.style.animation = `riseMinute ${60 - secondProgress * 60}s linear forwards`;
}

function updateClock() {
  const now = new Date();

  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = now.getSeconds();
  const milliseconds = now.getMilliseconds();

  els.time.textContent = `${hours}:${minutes}`;

  const weekdays = ["日", "月", "火", "水", "木", "金", "土"];
  els.date.textContent =
    `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日（${weekdays[now.getDay()]}）`;

  const hourProgress =
    (now.getMinutes() * 60 + seconds + milliseconds / 1000) / 3600;

  els.hourCircle.style.strokeDashoffset =
    circumference * (1 - hourProgress);

  const secondsToday =
    now.getHours() * 3600 +
    now.getMinutes() * 60 +
    seconds +
    milliseconds / 1000;

  const dayProgress = secondsToday / 86400;
  const percent = Math.floor(dayProgress * 100);

  els.dayBar.style.width = `${dayProgress * 100}%`;
  els.dayPercent.textContent = `${percent}%`;
}

function bindColorInput(input, key) {
  input.addEventListener("input", () => {
    settings[key] = input.value;
    applySettings();
    saveSettings();
  });
}

bindColorInput(els.bgColor, "bgColor");
bindColorInput(els.riseColor, "riseColor");
bindColorInput(els.textColor, "textColor");
bindColorInput(els.accentColor, "accentColor");
bindColorInput(els.lineColor, "lineColor");

els.riseOpacity.addEventListener("input", () => {
  settings.riseOpacity = Number(els.riseOpacity.value);
  applySettings();
  saveSettings();
});

els.uiSize.addEventListener("input", () => {
  settings.uiSize = Number(els.uiSize.value);
  applySettings();
  saveSettings();
});

els.settingsButton.addEventListener("click", () => {
  els.settingsPanel.classList.toggle("open");
});

els.closeSettingsButton.addEventListener("click", () => {
  els.settingsPanel.classList.remove("open");
});

els.resetButton.addEventListener("click", () => {
  settings = { ...defaultSettings };
  applySettings();
  saveSettings();
  syncSecondFill();
});

els.fullscreenButton.addEventListener("click", async () => {
  try {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    } else if (document.documentElement.requestFullscreen) {
      await document.documentElement.requestFullscreen();
    }
  } catch {
    // iPhone SafariではFullscreen APIが使えない場合がある。
    // ホーム画面に追加して開くと、よりアプリらしく表示できる。
  }
});

let lastTap = 0;
document.addEventListener("pointerup", () => {
  const now = Date.now();
  if (now - lastTap < 320) {
    document.body.classList.toggle("ui-hidden");
    els.settingsPanel.classList.remove("open");
  }
  lastTap = now;
});

window.addEventListener("resize", () => {
  updateLayout();
  syncSecondFill();
});

window.addEventListener("orientationchange", () => {
  setTimeout(() => {
    updateLayout();
    syncSecondFill();
  }, 250);
});

document.addEventListener("visibilitychange", () => {
  if (!document.hidden) {
    updateLayout();
    updateClock();
    syncSecondFill();
  }
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js").catch(() => {});
  });
}

applySettings();
syncSecondFill();
updateClock();
setInterval(updateClock, 1000);
setInterval(syncSecondFill, 60000);
