/**
 * PulseAI - Interactive Frontend Application Logic
 * Modern, responsive, real-time prediction and dynamic Chart.js dashboards.
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

let debounceTimer = null;
let charts = {};

// Initialize application on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  lucide.createIcons();
  fetchOverviewData();
  fetchModelBenchmarks();
  triggerPrediction();
});

// Tab Switching
function switchTab(tabKey) {
  const tabs = ["simulator", "analytics", "models"];
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

  // Re-trigger layout adjustments for Chart.js canvases
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

  // Update labels
  document.getElementById("label-daily-usage").textContent = `${state.daily_usage_hours.toFixed(1)} hrs`;
  document.getElementById("label-sleep-duration").textContent = `${state.sleep_duration_hours.toFixed(1)} hrs`;
  document.getElementById("label-sleep-quality").textContent = `${state.sleep_quality_score} / 10`;
  document.getElementById("label-weekend-extra").textContent = `+${state.weekend_extra_hours.toFixed(1)} hrs`;

  debouncedPredict();
}

// Segment Button Selector (Platform & Comparison)
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

// Reset Controls to Defaults
function resetDefaults() {
  document.getElementById("input-daily-usage").value = 4.5;
  document.getElementById("input-sleep-duration").value = 7.0;
  document.getElementById("input-sleep-quality").value = 7;
  document.getElementById("input-weekend-extra").value = 1.5;
  document.getElementById("input-late-night").checked = true;

  // Select default platform segment (Instagram)
  const platButtons = document.getElementById("group-platform").children;
  Array.from(platButtons).forEach(b => {
    b.classList.toggle("active", b.getAttribute("data-val") === "Instagram");
  });

  // Select default comparison segment (Sometimes)
  const compButtons = document.getElementById("group-comparison").children;
  Array.from(compButtons).forEach(b => {
    b.classList.toggle("active", b.getAttribute("data-val") === "Sometimes");
  });

  onInputChanged();
}

// Debounce Utility
function debouncedPredict() {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    triggerPrediction();
  }, 60);
}

// API Call: Live Machine Learning Inference
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
      renderPredictions(data.predictions, data.guidance);
    }
  } catch (err) {
    console.error("Prediction Error:", err);
  }
}

// Render Prediction Outputs
function renderPredictions(pred, guidance) {
  // 1. GPA Rendering
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
    gpaBarEl.className = "gauge-fill bg-indigo-500";
    gpaTierEl.className = "font-medium text-indigo-400";
  } else {
    gpaBarEl.className = "gauge-fill bg-rose-500";
    gpaTierEl.className = "font-medium text-rose-400";
  }

  // 2. Mental Health Rendering
  const mentalEl = document.getElementById("res-mental");
  const mentalStatusEl = document.getElementById("res-mental-status");
  const mentalBarEl = document.getElementById("mental-gauge-bar");

  mentalEl.textContent = pred.mental_health_index.toFixed(1);
  mentalBarEl.style.width = `${Math.min(100, pred.mental_health_index)}%`;

  if (pred.mental_health_index >= 75) {
    mentalStatusEl.textContent = "Resilient & Stable";
    mentalStatusEl.className = "font-medium text-cyan-400";
    mentalBarEl.className = "gauge-fill bg-cyan-400";
  } else if (pred.mental_health_index >= 60) {
    mentalStatusEl.textContent = "Moderate Equilibrium";
    mentalStatusEl.className = "font-medium text-amber-400";
    mentalBarEl.className = "gauge-fill bg-amber-400";
  } else {
    mentalStatusEl.textContent = "Elevated Distress Risk";
    mentalStatusEl.className = "font-medium text-rose-400";
    mentalBarEl.className = "gauge-fill bg-rose-500";
  }

  // 3. Digital Phenotype Archetype Card
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

  // 4. Probability Bars
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
    impactBadge.className = "px-2 py-0.5 rounded text-xs font-bold font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
  } else if (pred.overall_impact === "Neutral") {
    impactBadge.className = "px-2 py-0.5 rounded text-xs font-bold font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/20";
  } else {
    impactBadge.className = "px-2 py-0.5 rounded text-xs font-bold font-mono bg-rose-500/10 text-rose-400 border border-rose-500/20";
  }

  // 5. Actionable Guidance List
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
      borderClass = "border-cyan-500/30 bg-cyan-500/[0.04]";
      iconName = "eye";
    } else if (item.level === "success") {
      borderClass = "border-emerald-500/30 bg-emerald-500/[0.04]";
      iconName = "check-circle";
    }

    card.className = `p-3 rounded-xl border ${borderClass} flex items-start space-x-3 text-xs`;
    card.innerHTML = `
      <i data-lucide="${iconName}" class="w-4 h-4 mt-0.5 shrink-0"></i>
      <div>
        <strong class="text-white block font-semibold mb-0.5">${item.title}</strong>
        <p class="text-slate-400 leading-relaxed">${item.message}</p>
      </div>
    `;
    container.appendChild(card);
  });

  lucide.createIcons();
}

// Fetch Cohort Overview Data & Populate Charts
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
          backgroundColor: "#6366F1",
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
          borderColor: "#06B6D4",
          backgroundColor: "rgba(6, 182, 212, 0.1)",
          fill: true,
          tension: 0.35,
          pointRadius: 4,
          pointBackgroundColor: "#06B6D4"
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
          backgroundColor: ["#10B981", "#06B6D4", "#EF4444"],
          borderColor: "#080B13",
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

// Fetch Model Benchmarks & Feature Importance
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
