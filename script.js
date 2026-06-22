"use strict";

const storageKey = "visualClockBigSettings_v2";

const defaultSettings = {
  bgColor: "#0f1115",
  riseColor: "#ffffff",
  riseOpacity: 14,
  textColor: "#ffffff",
  accentColor: "#ffffff",
  lineColor: "#2a2d35",
  uiSize: 145
};

let settings = loadSettings();

const els = {
  time: document.getElementById("time"),
  date: document.getElementById("date"),
  dayPercent: document.getElementById("dayPercent"),
  dayBar: document.getElementById("dayBar"),
  hourCircle: document.getElementById("hourCircle"),
  secondFill: document.getElementById("secondFill"),
  settingsButton: document.getElementById("settingsButton"),
  settingsPanel: document.getElementById("settingsPanel"),
  closeSettingsButton: document.getElementById("closeSettingsButton"),
  fullscreenButton: document.getElementById("fullscreenButton"),
  resetButton: document.getElementById("resetButton"),
  uiSize: document.getElementById("uiSize"),
  bgColor: document.getElementById("bgColor"),
  riseColor: document.getElementById("riseColor"),
  riseOpacity: document.getElementById("riseOpacity"),
  textColor: document.getElementById("textColor"),
  accentColor: document.getElementById("accentColor"),
  lineColor: document.getElementById("lineColor")
};

const ringRadius = 135;
const ringCircumference = 2 * Math.PI * ringRadius;
els.hourCircle.style.strokeDasharray = String(ringCircumference);
els.hourCircle.style.strokeDashoffset = String(ringCircumference);

function loadSettings() {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return { ...defaultSettings };
    return { ...defaultSettings, ...JSON.parse(raw) };
  } catch {
    return { ...defaultSettings };
  }
}

function saveSettings() {
  localStorage.setItem(storageKey, JSON.stringify(settings));
}

function hexToRgba(hex, opacityPercent) {
  const normalized = /^#[0-9a-fA-F]{6}$/.test(hex) ? hex : "#ffffff";
  const r = parseInt(normalized.slice(1, 3), 16);
  const g = parseInt(normalized.slice(3, 5), 16);
  const b = parseInt(normalized.slice(5, 7), 16);
  const a = Math.max(0, Math.min(100, Number(opacityPercent))) / 100;
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

function applySettings() {
  const root = document.documentElement;

  root.style.setProperty("--bg-color", settings.bgColor);
  root.style.setProperty("--text-color", settings.textColor);
  root.style.setProperty("--accent-color", settings.accentColor);
  root.style.setProperty("--line-bg-color", settings.lineColor);
  root.style.setProperty("--rise-bg", hexToRgba(settings.riseColor, settings.riseOpacity));

  els.uiSize.value = settings.uiSize;
  els.bgColor.value = settings.bgColor;
  els.riseColor.value = settings.riseColor;
  els.riseOpacity.value = settings.riseOpacity;
  els.textColor.value = settings.textColor;
  els.accentColor.value = settings.accentColor;
  els.lineColor.value = settings.lineColor;

  updateLayout();
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function updateLayout() {
  const root = document.documentElement;
  const width = window.innerWidth || document.documentElement.clientWidth;
  const height = window.innerHeight || document.documentElement.clientHeight;
  const scale = settings.uiSize / 100;

  // 画面幅で円は頭打ちになりやすいので、
  // 中央の時刻文字もUIサイズに合わせて強めに大きくする。
  const reservedBelow = clamp(height * 0.18, 118, 190);
  const circleBase = Math.min(width * 0.97, height - reservedBelow, 820);
  const hardMax = Math.min(width * 0.985, height - 112, 860);

  let circleSize = circleBase * scale;
  circleSize = clamp(circleSize, 285, Math.max(285, hardMax));

  const textBoost = clamp(scale, 1, 1.8);
  const timeSize = clamp(circleSize * (0.30 + (textBoost - 1) * 0.11), 92, Math.min(width * 0.50, 210));
  const labelSize = clamp(circleSize * 0.050, 17, 34);
  const dayLabelSize = clamp(circleSize * 0.048, 17, 32);
  const dateSize = clamp(circleSize * 0.058, 20, 38);
  const barWidth = clamp(circleSize * 1.23, Math.min(width * 0.86, 320), Math.min(width * 0.96, 860));
  const barHeight = clamp(circleSize * 0.072, 24, 54);

  root.style.setProperty("--circle-size", `${Math.round(circleSize)}px`);
  root.style.setProperty("--time-size", `${Math.round(timeSize)}px`);
  root.style.setProperty("--label-size", `${Math.round(labelSize)}px`);
  root.style.setProperty("--day-label-size", `${Math.round(dayLabelSize)}px`);
  root.style.setProperty("--date-size", `${Math.round(dateSize)}px`);
  root.style.setProperty("--bar-width", `${Math.round(barWidth)}px`);
  root.style.setProperty("--bar-height", `${Math.round(barHeight)}px`);
}

function syncSecondFill() {
  const now = new Date();
  const seconds = now.getSeconds() + now.getMilliseconds() / 1000;

  els.secondFill.style.animation = "none";
  void els.secondFill.offsetHeight;
  els.secondFill.style.animation = "riseMinute 60s linear infinite";
  els.secondFill.style.animationDelay = `${-seconds}s`;
}

function updateClock() {
  const now = new Date();

  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = now.getSeconds();

  els.time.textContent = `${hours}:${minutes}`;

  const weekdays = ["日", "月", "火", "水", "木", "金", "土"];
  els.date.textContent =
    `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日（${weekdays[now.getDay()]}）`;

  const hourProgress = (now.getMinutes() * 60 + seconds) / 3600;
  els.hourCircle.style.strokeDashoffset = String(ringCircumference * (1 - hourProgress));

  const secondsToday = now.getHours() * 3600 + now.getMinutes() * 60 + seconds;
  const dayProgress = secondsToday / 86400;
  els.dayBar.style.width = `${dayProgress * 100}%`;
  els.dayPercent.textContent = `${Math.floor(dayProgress * 100)}%`;
}

function bindSetting(input, key, isNumber = false) {
  input.addEventListener("input", () => {
    settings[key] = isNumber ? Number(input.value) : input.value;
    applySettings();
    saveSettings();
  });
}

bindSetting(els.uiSize, "uiSize", true);
bindSetting(els.bgColor, "bgColor");
bindSetting(els.riseColor, "riseColor");
bindSetting(els.riseOpacity, "riseOpacity", true);
bindSetting(els.textColor, "textColor");
bindSetting(els.accentColor, "accentColor");
bindSetting(els.lineColor, "lineColor");

els.settingsButton.addEventListener("click", () => {
  document.body.classList.remove("ui-hidden");
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
document.addEventListener("pointerup", (event) => {
  const interactive = event.target.closest("button, input, label, .settings-panel");
  if (interactive) return;

  const now = Date.now();
  if (now - lastTap < 320) {
    els.settingsPanel.classList.remove("open");
    document.body.classList.toggle("ui-hidden");
  }
  lastTap = now;
});

window.addEventListener("resize", updateLayout);
window.addEventListener("orientationchange", () => {
  setTimeout(updateLayout, 250);
});

document.addEventListener("visibilitychange", () => {
  if (!document.hidden) {
    updateClock();
    syncSecondFill();
  }
});

applySettings();
syncSecondFill();
updateClock();

setInterval(updateClock, 1000);
setInterval(syncSecondFill, 60 * 1000);

if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js").catch(() => {});
  });
}
