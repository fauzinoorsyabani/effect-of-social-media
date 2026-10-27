/**
 * PulseAI - Interactive Frontend Application Logic (V2)
 * Features:
 * - Real-time ML Inference without page reload
 * - Dual-Mode Persistence (Device Local Storage & SQLite Cloud Sync)
 * - Longitudinal Personal Journey Tracker & Chart.js Visualizations
 * - Zero-Emoji Restorative Cognitive Design
 */

let state = {
  daily_usage_hours: 4.5,
  sleep_duration_hours: 7.0,
  sleep_quality_score: 7,
  weekend_extra_hours: 1.5,
  late_night_usage: true,
  primary_platform: "Instagram",
  social_comparison_frequency: "Sometimes",
  device_type: "Smartphone",
  academic_level: "Undergraduate",
  gender: "Female",
  age: 20
};

let latestPrediction = null;
let debounceTimer = null;
let charts = {};
const STORAGE_KEY = "pulse_wellness_history";
const USER_KEY = "pulse_current_user";

// Initialize on DOM Ready
document.addEventListener("DOMContentLoaded", () => {
  lucide.createIcons();
  fetchOverviewData();
  fetchModelBenchmarks();
  triggerPrediction();
  loadHistory();
  updateUserUI();
});

// Tab Navigation
function switchTab(tabKey) {
  const tabs = ["simulator", "history", "analytics", "models"];
  tabs.forEach(t => {
    const section = document.getElementById(`section-${t}`);
    const btn = document.getElementById(`tab-btn-${t === "simulator" ? "sim" : t}`);
    if (t === tabKey) {
      section.classList.remove("hidden");
      btn.classList.add("active");
    } else {
      section.classList.add("hidden");
      btn.classList.remove("active");
    }
  });

  if (tabKey === "history") {
    renderHistoryTimeline();
  }

  setTimeout(() => {
    Object.values(charts).forEach(c => c && c.resize && c.resize());
  }, 100);
}

// Input Change Handler
function onInputChanged() {
  state.daily_usage_hours = parseFloat(document.getElementById("input-daily-usage").value);
  state.sleep_duration_hours = parseFloat(document.getElementById("input-sleep-duration").value);
  state.sleep_quality_score = parseInt(document.getElementById("input-sleep-quality").value);
  state.weekend_extra_hours = parseFloat(document.getElementById("input-weekend-extra").value);
  state.late_night_usage = document.getElementById("input-late-night").checked;

  document.getElementById("label-daily-usage").textContent = `${state.daily_usage_hours.toFixed(1)} hrs`;
  document.getElementById("label-sleep-duration").textContent = `${state.sleep_duration_hours.toFixed(1)} hrs`;
  document.getElementById("label-sleep-quality").textContent = `${state.sleep_quality_score} / 10`;
  document.getElementById("label-weekend-extra").textContent = `+${state.weekend_extra_hours.toFixed(1)} hrs`;

  debouncedPredict();
}

// Segment Selectors
function selectSegment(group, element) {
  const container = element.parentElement;
  Array.from(container.children).forEach(btn => btn.classList.remove("active"));
  element.classList.add("active");

  const val = element.getAttribute("data-val");
  if (group === "platform") {
    state.primary_platform = val;
  } else if (group === "comparison") {
    state.social_comparison_frequency = val;
  }
  debouncedPredict();
}

function resetDefaults() {
  document.getElementById("input-daily-usage").value = 4.5;
  document.getElementById("input-sleep-duration").value = 7.0;
  document.getElementById("input-sleep-quality").value = 7;
  document.getElementById("input-weekend-extra").value = 1.5;
  document.getElementById("input-late-night").checked = true;

  const platButtons = document.getElementById("group-platform").children;
  Array.from(platButtons).forEach(b => {
    b.classList.toggle("active", b.getAttribute("data-val") === "Instagram");
  });

  const compButtons = document.getElementById("group-comparison").children;
  Array.from(compButtons).forEach(b => {
    b.classList.toggle("active", b.getAttribute("data-val") === "Sometimes");
  });

  onInputChanged();
}

function debouncedPredict() {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    triggerPrediction();
  }, 60);
}

// Machine Learning API Call
async function triggerPrediction() {
  try {
    const res = await fetch("/api/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(state)
    });

    if (!res.ok) throw new Error("Inference failed");
    const data = await res.json();
    if (data.success) {
      latestPrediction = data;
      renderPredictions(data.predictions, data.guidance);
    }
  } catch (err) {
    console.error("Prediction Error:", err);
  }
}

// Render Results on Cockpit
function renderPredictions(pred, guidance) {
  // 1. GPA
  const gpaEl = document.getElementById("res-gpa");
  const gpaTierEl = document.getElementById("res-gpa-tier");
  const gpaBarEl = document.getElementById("gpa-gauge-bar");
  const ratioEl = document.getElementById("res-screen-sleep-ratio");

  gpaEl.textContent = pred.gpa.toFixed(2);
  gpaTierEl.textContent = pred.gpa_status;
  ratioEl.textContent = `Ratio: ${pred.screen_to_sleep_ratio}`;

  const gpaPct = Math.min(100, Math.max(0, ((pred.gpa - 1.0) / 3.0) * 100));
  gpaBarEl.style.width = `${gpaPct}%`;

  if (pred.gpa >= 3.5) {
    gpaBarEl.className = "gauge-fill bg-emerald-500";
    gpaTierEl.className = "font-medium text-emerald-400";
  } else if (pred.gpa >= 3.0) {
    gpaBarEl.className = "gauge-fill bg-sky-500";
    gpaTierEl.className = "font-medium text-sky-400";
  } else {
    gpaBarEl.className = "gauge-fill bg-rose-500";
    gpaTierEl.className = "font-medium text-rose-400";
  }

  // 2. Mental Health
  const mentalEl = document.getElementById("res-mental");
  const mentalStatusEl = document.getElementById("res-mental-status");
  const mentalBarEl = document.getElementById("mental-gauge-bar");

  mentalEl.textContent = pred.mental_health_index.toFixed(1);
  mentalBarEl.style.width = `${Math.min(100, pred.mental_health_index)}%`;

  if (pred.mental_health_index >= 75) {
    mentalStatusEl.textContent = "Resilient & Stable";
    mentalStatusEl.className = "font-medium text-emerald-400";
    mentalBarEl.className = "gauge-fill bg-emerald-500";
  } else if (pred.mental_health_index >= 60) {
    mentalStatusEl.textContent = "Moderate Equilibrium";
    mentalStatusEl.className = "font-medium text-sky-400";
    mentalBarEl.className = "gauge-fill bg-sky-500";
  } else {
    mentalStatusEl.textContent = "Elevated Distress Risk";
    mentalStatusEl.className = "font-medium text-rose-400";
    mentalBarEl.className = "gauge-fill bg-rose-500";
  }

  // 3. Archetype Persona
  const arch = pred.archetype;
  document.getElementById("res-archetype-name").textContent = arch.name;
  document.getElementById("res-archetype-desc").textContent = arch.description;
  document.getElementById("res-archetype-pct").textContent = `Cohort Representation: ${arch.percentage}%`;
  document.getElementById("res-archetype-stress").textContent = `Avg Stress: ${arch.avg_stress} / 40`;
  
  const tierBadge = document.getElementById("res-archetype-tier");
  tierBadge.textContent = arch.tier;
  tierBadge.style.color = arch.badge_color;
  tierBadge.style.borderColor = arch.badge_color;
  document.getElementById("archetype-card").style.borderTopColor = arch.badge_color;

  // 4. Probabilities
  const p = pred.probabilities;
  document.getElementById("prob-beneficial").textContent = `${p.Beneficial}%`;
  document.getElementById("bar-beneficial").style.width = `${p.Beneficial}%`;

  document.getElementById("prob-neutral").textContent = `${p.Neutral}%`;
  document.getElementById("bar-neutral").style.width = `${p.Neutral}%`;

  document.getElementById("prob-negative").textContent = `${p.Negative}%`;
  document.getElementById("bar-negative").style.width = `${p.Negative}%`;

  const impactBadge = document.getElementById("res-impact-badge");
  impactBadge.textContent = pred.overall_impact;
  if (pred.overall_impact === "Beneficial") {
    impactBadge.className = "px-2 py-0.5 rounded text-xs font-medium font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
  } else if (pred.overall_impact === "Neutral") {
    impactBadge.className = "px-2 py-0.5 rounded text-xs font-medium font-mono bg-sky-500/10 text-sky-400 border border-sky-500/20";
  } else {
    impactBadge.className = "px-2 py-0.5 rounded text-xs font-medium font-mono bg-rose-500/10 text-rose-400 border border-rose-500/20";
  }

  // 5. Guidance List
  const container = document.getElementById("guidance-container");
  container.innerHTML = "";

  guidance.forEach(item => {
    const card = document.createElement("div");
    let borderClass = "border-slate-800 text-slate-300";
    let iconName = "info";

    if (item.level === "critical") {
      borderClass = "border-rose-500/30 bg-rose-500/[0.04]";
      iconName = "alert-triangle";
    } else if (item.level === "warning") {
      borderClass = "border-amber-500/30 bg-amber-500/[0.04]";
      iconName = "clock";
    } else if (item.level === "advisory") {
      borderClass = "border-sky-500/30 bg-sky-500/[0.04]";
      iconName = "eye";
    } else if (item.level === "success") {
      borderClass = "border-emerald-500/30 bg-emerald-500/[0.04]";
      iconName = "check-circle";
    }

    card.className = `p-3.5 rounded-xl border ${borderClass} flex items-start space-x-3 text-xs`;
    card.innerHTML = `
      <i data-lucide="${iconName}" class="w-4 h-4 mt-0.5 shrink-0"></i>
      <div>
        <strong class="text-white block font-medium mb-0.5">${item.title}</strong>
        <p class="text-slate-400 leading-relaxed font-light">${item.message}</p>
      </div>
    `;
    container.appendChild(card);
  });

  lucide.createIcons();
}

// ==========================================================
// Dual-Mode Persistence & Assessment Saving
// ==========================================================
function getLocalHistory() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch (e) {
    return [];
  }
}

function saveLocalHistory(history) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY) || "null");
  } catch (e) {
    return null;
  }
}

async function saveCurrentAssessment() {
  if (!latestPrediction) return;

  const now = new Date();
  const entry = {
    id: "loc_" + Date.now(),
    timestamp: now.toISOString(),
    display_date: now.toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }),
    daily_usage_hours: state.daily_usage_hours,
    sleep_duration_hours: state.sleep_duration_hours,
    sleep_quality_score: state.sleep_quality_score,
    primary_platform: state.primary_platform,
    late_night_usage: state.late_night_usage,
    predicted_gpa: latestPrediction.predictions.gpa,
    predicted_mental_health: latestPrediction.predictions.mental_health_index,
    impact_class: latestPrediction.predictions.overall_impact,
    archetype: latestPrediction.predictions.archetype.name,
    archetype_tier: latestPrediction.predictions.archetype.tier
  };

  // 1. Commit to LocalStorage (Instant, Device-First)
  const history = getLocalHistory();
  history.push(entry);
  saveLocalHistory(history);

  // 2. If logged in, sync to SQLite backend
  const user = getCurrentUser();
  if (user && user.user_id) {
    try {
      await fetch("/api/assessments/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...entry,
          user_id: user.user_id,
          guidance: latestPrediction.guidance
        })
      });
    } catch (err) {
      console.warn("Cloud sync failed, preserved locally:", err);
    }
  }

  loadHistory();
  alert("Assessment saved to personal tracking history!");
}

function loadHistory() {
  const history = getLocalHistory();
  const badge = document.getElementById("history-count-badge");
  if (badge) badge.textContent = `${history.length} Saved Records`;

  const tbody = document.getElementById("history-table-body");
  if (!tbody) return;

  tbody.innerHTML = "";
  if (history.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" class="py-6 text-center text-slate-500 font-sans">No saved assessments yet. Use the Simulator to save your first check-in.</td></tr>`;
    return;
  }

  // Display reversed (newest first)
  [...history].reverse().forEach(item => {
    const tr = document.createElement("tr");
    const dateFormatted = new Date(item.timestamp).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
    tr.innerHTML = `
      <td class="py-2.5 text-white">${dateFormatted}</td>
      <td class="py-2.5 font-mono text-emerald-400">${item.daily_usage_hours}h</td>
      <td class="py-2.5 font-mono text-sky-400">${item.sleep_duration_hours}h</td>
      <td class="py-2.5 font-mono font-medium text-white">${item.predicted_gpa.toFixed(2)}</td>
      <td class="py-2.5 font-mono font-medium text-white">${item.predicted_mental_health.toFixed(1)}</td>
      <td class="py-2.5 text-slate-300 font-sans">${item.archetype}</td>
      <td class="py-2.5 text-right"><span class="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300">${item.archetype_tier}</span></td>
    `;
    tbody.appendChild(tr);
  });
}

function renderHistoryTimeline() {
  const history = getLocalHistory();
  const ctx = document.getElementById("chart-history-timeline");
  if (!ctx) return;

  const labels = history.map((h, i) => {
    const d = new Date(h.timestamp);
    return `${d.getMonth() + 1}/${d.getDate()} #${i + 1}`;
  });

  const mentalData = history.map(h => h.predicted_mental_health);
  const gpaData = history.map(h => h.predicted_gpa);

  if (charts.history) {
    charts.history.destroy();
  }

  charts.history = new Chart(ctx.getContext("2d"), {
    type: "line",
    data: {
      labels: labels.length ? labels : ["Initial"],
      datasets: [
        {
          label: "Mental Health Index (1-100)",
          data: mentalData.length ? mentalData : [75],
          borderColor: "#10B981",
          backgroundColor: "rgba(16, 185, 129, 0.08)",
          fill: true,
          tension: 0.3,
          yAxisID: "y"
        },
        {
          label: "Predicted GPA (1.0-4.0)",
          data: gpaData.length ? gpaData : [3.5],
          borderColor: "#38BDF8",
          backgroundColor: "rgba(56, 189, 248, 0.08)",
          fill: false,
          tension: 0.3,
          yAxisID: "y1"
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: "top", labels: { color: "#94A3B8", boxWidth: 12, font: { family: "Plus Jakarta Sans" } } }
      },
      scales: {
        x: { grid: { color: "rgba(255,255,255,0.03)" }, ticks: { color: "#94A3B8" } },
        y: {
          type: "linear",
          position: "left",
          min: 0,
          max: 100,
          grid: { color: "rgba(255,255,255,0.05)" },
          ticks: { color: "#10B981" }
        },
        y1: {
          type: "linear",
          position: "right",
          min: 1.0,
          max: 4.0,
          grid: { drawOnChartArea: false },
          ticks: { color: "#38BDF8" }
        }
      }
    }
  });
}

function exportHistoryJSON() {
  const history = getLocalHistory();
  const blob = new Blob([JSON.stringify(history, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `pulse_wellness_history_${new Date().toISOString().split("T")[0]}.json`;
  a.click();
}

function clearHistoryData() {
  if (confirm("Clear all locally saved assessment history on this device?")) {
    localStorage.removeItem(STORAGE_KEY);
    loadHistory();
    renderHistoryTimeline();
  }
}

// ==========================================================
// Authentication Modal Logic (Optional Cloud Sync)
// ==========================================================
function openAuthModal() {
  document.getElementById("modal-auth").classList.remove("hidden");
}

function closeAuthModal() {
  document.getElementById("modal-auth").classList.add("hidden");
  document.getElementById("auth-error-msg").classList.add("hidden");
}

function updateUserUI() {
  const user = getCurrentUser();
  const label = document.getElementById("label-user-status");
  if (user && user.email) {
    label.textContent = user.email;
  } else {
    label.textContent = "Private Mode (Local)";
  }
}

async function handleRegister() {
  const email = document.getElementById("auth-email").value;
  const password = document.getElementById("auth-password").value;
  const errEl = document.getElementById("auth-error-msg");

  try {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (data.success) {
      localStorage.setItem(USER_KEY, JSON.stringify(data));
      updateUserUI();
      closeAuthModal();
      alert("Account created and cloud sync enabled.");
    } else {
      errEl.textContent = data.error || "Registration failed.";
      errEl.classList.remove("hidden");
    }
  } catch (err) {
    errEl.textContent = "Server error. Try again.";
    errEl.classList.remove("hidden");
  }
}

async function handleLogin() {
  const email = document.getElementById("auth-email").value;
  const password = document.getElementById("auth-password").value;
  const errEl = document.getElementById("auth-error-msg");

  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (data.success) {
      localStorage.setItem(USER_KEY, JSON.stringify(data));
      updateUserUI();
      closeAuthModal();
      alert("Logged in successfully. Cloud sync enabled.");
    } else {
      errEl.textContent = data.error || "Login failed.";
      errEl.classList.remove("hidden");
    }
  } catch (err) {
    errEl.textContent = "Server connection error.";
    errEl.classList.remove("hidden");
  }
}

// ==========================================================
// Cohort Overview & Model Benchmarks Fetchers
// ==========================================================
async function fetchOverviewData() {
  try {
    const res = await fetch("/api/overview");
    const data = await res.json();

    document.getElementById("stat-avg-screen").textContent = `${data.avg_daily_screen} hrs`;
    document.getElementById("stat-avg-sleep").textContent = `${data.avg_sleep_hours} hrs`;
    document.getElementById("stat-late-night").textContent = `${data.late_night_pct}%`;

    // 1. Platform Comparison Bar Chart
    const plats = data.platform_breakdown;
    const ctxPlat = document.getElementById("chart-platform-screen").getContext("2d");
    charts.platform = new Chart(ctxPlat, {
      type: "bar",
      data: {
        labels: plats.map(d => d.Primary_Platform),
        datasets: [{
          label: "Daily Hours",
          data: plats.map(d => d.avg_screen),
          backgroundColor: "#10B981",
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false }, ticks: { color: "#94A3B8" } },
          y: { grid: { color: "rgba(255,255,255,0.05)" }, ticks: { color: "#94A3B8" } }
        }
      }
    });

    // 2. Comparison vs Stress Chart
    const comps = data.social_comparison_breakdown;
    const ctxComp = document.getElementById("chart-comparison-stress").getContext("2d");
    charts.comparison = new Chart(ctxComp, {
      type: "line",
      data: {
        labels: comps.map(d => d.Social_Comparison_Frequency),
        datasets: [{
          label: "Stress Score",
          data: comps.map(d => d.avg_stress),
          borderColor: "#38BDF8",
          backgroundColor: "rgba(56, 189, 248, 0.08)",
          fill: true,
          tension: 0.35,
          pointRadius: 4,
          pointBackgroundColor: "#38BDF8"
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false }, ticks: { color: "#94A3B8" } },
          y: { grid: { color: "rgba(255,255,255,0.05)" }, ticks: { color: "#94A3B8" } }
        }
      }
    });

    // 3. Impact Donut Chart
    const impacts = data.impact_distribution;
    const ctxImpact = document.getElementById("chart-impact-donut").getContext("2d");
    charts.impact = new Chart(ctxImpact, {
      type: "doughnut",
      data: {
        labels: Object.keys(impacts),
        datasets: [{
          data: Object.values(impacts),
          backgroundColor: ["#10B981", "#38BDF8", "#F43F5E"],
          borderColor: "#0B0F19",
          borderWidth: 3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: "bottom", labels: { color: "#94A3B8", boxWidth: 12 } }
        },
        cutout: "68%"
      }
    });

  } catch (err) {
    console.error("Overview error:", err);
  }
}

async function fetchModelBenchmarks() {
  try {
    const res = await fetch("/api/models");
    const data = await res.json();

    const featImp = data.regression_gpa.feature_importances;
    const topFeats = Object.entries(featImp).slice(0, 8);

    const ctxFeat = document.getElementById("chart-feature-importance").getContext("2d");
    charts.features = new Chart(ctxFeat, {
      type: "bar",
      data: {
        labels: topFeats.map(f => f[0].replace(/_/g, " ")),
        datasets: [{
          label: "Importance Weight",
          data: topFeats.map(f => f[1]),
          backgroundColor: "#10B981",
          borderRadius: 6
        }]
      },
      options: {
        indexAxis: "y",
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { color: "rgba(255,255,255,0.05)" }, ticks: { color: "#94A3B8" } },
          y: { grid: { display: false }, ticks: { color: "#94A3B8", font: { size: 10 } } }
        }
      }
    });
  } catch (err) {
    console.error("Models info error:", err);
  }
}
