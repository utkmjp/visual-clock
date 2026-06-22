const elements = {
  root: document.documentElement,
  body: document.body,
  time: document.getElementById("time"),
  seconds: document.getElementById("seconds"),
  date: document.getElementById("date"),
  dayPercent: document.getElementById("dayPercent"),
  secondLayer: document.getElementById("secondLayer"),
  settingsButton: document.getElementById("settingsButton"),
  panel: document.getElementById("panel"),
  bgColor: document.getElementById("bgColor"),
  riseColor: document.getElementById("riseColor"),
  riseOpacity: document.getElementById("riseOpacity"),
  textColor: document.getElementById("textColor"),
  accentColor: document.getElementById("accentColor"),
  resetButton: document.getElementById("resetButton"),
};

const storageKey = "visual-clock-light-settings-v1";

const defaults = {
  bgColor: "#0f1115",
  riseColor: "#ffffff",
  riseOpacity: 14,
  textColor: "#ffffff",
  accentColor: "#ffffff",
};

const weekdays = ["日", "月", "火", "水", "木", "金", "土"];
let settings = loadSettings();
let lastSecond = -1;

function loadSettings() {
  try {
    const saved = localStorage.getItem(storageKey);
    return saved ? { ...defaults, ...JSON.parse(saved) } : { ...defaults };
  } catch {
    return { ...defaults };
  }
}

function saveSettings() {
  localStorage.setItem(storageKey, JSON.stringify(settings));
}

function hexToRgba(hex, opacity) {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity / 100})`;
}

function applySettings() {
  elements.root.style.setProperty("--bg", settings.bgColor);
  elements.root.style.setProperty("--text", settings.textColor);
  elements.root.style.setProperty("--accent", settings.accentColor);
  elements.root.style.setProperty("--rise", hexToRgba(settings.riseColor, settings.riseOpacity));

  elements.bgColor.value = settings.bgColor;
  elements.riseColor.value = settings.riseColor;
  elements.riseOpacity.value = settings.riseOpacity;
  elements.textColor.value = settings.textColor;
  elements.accentColor.value = settings.accentColor;
}

function updateClock() {
  const now = new Date();
  const second = now.getSeconds();

  if (second === lastSecond) return;
  lastSecond = second;

  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  elements.time.textContent = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
  elements.seconds.textContent = `${String(seconds).padStart(2, "0")}秒`;
  elements.date.textContent = `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日（${weekdays[now.getDay()]}）`;

  const secondsInHour = minutes * 60 + seconds;
  const hourDeg = (secondsInHour / 3600) * 360;
  elements.root.style.setProperty("--hour-deg", `${hourDeg}deg`);

  const secondsToday = hours * 3600 + minutes * 60 + seconds;
  const dayProgress = secondsToday / 86400;
  const percent = Math.floor(dayProgress * 100);
  elements.root.style.setProperty("--day-percent", `${dayProgress * 100}%`);
  elements.dayPercent.textContent = `${percent}%`;
}

function syncSecondLayer() {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const now = new Date();
  const elapsed = now.getSeconds() + now.getMilliseconds() / 1000;

  if (reduceMotion) {
    elements.secondLayer.style.transform = `scaleY(${elapsed / 60})`;
    return;
  }

  elements.secondLayer.style.animation = "none";
  elements.secondLayer.offsetHeight;
  elements.secondLayer.style.animation = "rise-minute 60s linear infinite";
  elements.secondLayer.style.animationDelay = `-${elapsed}s`;
}

function setListeners() {
  elements.settingsButton.addEventListener("click", () => {
    elements.panel.classList.toggle("open");
  });

  elements.bgColor.addEventListener("input", () => {
    settings.bgColor = elements.bgColor.value;
    applySettings();
    saveSettings();
  });

  elements.riseColor.addEventListener("input", () => {
    settings.riseColor = elements.riseColor.value;
    applySettings();
    saveSettings();
  });

  elements.riseOpacity.addEventListener("input", () => {
    settings.riseOpacity = Number(elements.riseOpacity.value);
    applySettings();
    saveSettings();
  });

  elements.textColor.addEventListener("input", () => {
    settings.textColor = elements.textColor.value;
    applySettings();
    saveSettings();
  });

  elements.accentColor.addEventListener("input", () => {
    settings.accentColor = elements.accentColor.value;
    applySettings();
    saveSettings();
  });

  elements.resetButton.addEventListener("click", () => {
    settings = { ...defaults };
    applySettings();
    saveSettings();
  });

  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) {
      syncSecondLayer();
      updateClock();
    }
  });

  document.addEventListener("dblclick", () => {
    elements.body.classList.toggle("hide-ui");
  });
}

function registerServiceWorker() {
  if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
    navigator.serviceWorker.register("./service-worker.js").catch(() => {});
  }
}

function startClock() {
  updateClock();
  const now = new Date();
  const delay = 1020 - now.getMilliseconds();
  window.setTimeout(startClock, delay);
}

applySettings();
syncSecondLayer();
startClock();
setInterval(syncSecondLayer, 60 * 1000);
setListeners();
registerServiceWorker();
