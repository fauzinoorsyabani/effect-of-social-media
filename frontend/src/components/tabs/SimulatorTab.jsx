import React from 'react';
import { Save, RotateCcw, SlidersHorizontal, ShieldCheck, CheckCircle2, Info, AlertCircle } from 'lucide-react';

export default function SimulatorTab({
  params,
  setParams,
  prediction,
  loading,
  onSaveAssessment,
  onResetDefaults,
}) {
  const platforms = ['Instagram', 'TikTok', 'YouTube', 'Snapchat', 'Reddit', 'X (Twitter)', 'LinkedIn'];
  const comparisons = [
    { label: 'Never', val: 'Never' },
    { label: 'Rarely', val: 'Rarely' },
    { label: 'Some', val: 'Sometimes' },
    { label: 'Freq', val: 'Frequently' },
    { label: 'Always', val: 'Always' },
  ];

  const preds = prediction?.predictions || {};
  const gpa = preds.gpa ?? 3.48;
  const mental = preds.mental_health_index ?? 78.4;
  const ratio = preds.screen_to_sleep_ratio ?? 0.64;
  const gpaTier = preds.gpa_status ?? 'High Standing';
  const archetype = preds.archetype || {
    name: 'Disciplined & High-Achieving Healthy Users',
    description: 'Lowest screen time (avg ~3.5h), optimal sleep (~7.5h), lowest stress, and highest average GPA (~3.66).',
    tier: 'Low Risk',
    percentage: 50.2,
    avg_stress: 9.1,
  };
  const probabilities = preds.probabilities || { Beneficial: 92.4, Neutral: 6.8, Negative: 0.8 };
  const guidance = prediction?.guidance || [];

  return (
    <section className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight text-slate-900">
            Digital Lifestyle & Academic Simulator
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Simulate daily screen exposure intervals and sleep habits to compute predictive projections across academic GPA and mental resilience.
          </p>
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <button
            onClick={onSaveAssessment}
            className="flex-1 sm:flex-initial justify-center px-4 py-2 rounded-xl text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 transition flex items-center space-x-1.5 cursor-pointer shadow-xs"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Assessment</span>
          </button>
          <button
            onClick={onResetDefaults}
            className="px-3.5 py-2 rounded-xl text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 transition flex items-center justify-center space-x-1 cursor-pointer shadow-xs border border-slate-200/60"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Simulator Interactive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
        {/* Left: Input Parameter Controls (5 cols) */}
        <div className="lg:col-span-5 clean-card p-4 sm:p-6 space-y-5">
          <div className="flex items-center justify-between pb-3">
            <h2 className="font-semibold text-xs tracking-wider text-slate-800 uppercase flex items-center">
              <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600 mr-2" />
              Behavioral & Sleep Parameters
            </h2>
            <span className="text-[11px] text-slate-400 font-mono-num">Real-Time</span>
          </div>

          {/* Slider 1: Daily Screen Hours */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-800 font-medium">Daily Screen Time</span>
              <span className="font-mono-num text-xs font-semibold px-2 py-0.5 rounded-lg bg-slate-100 text-slate-800">
                {params.daily_usage_hours.toFixed(1)} hrs/day
              </span>
            </div>
            <input
              type="range"
              min="0.5"
              max="14.0"
              step="0.25"
              value={params.daily_usage_hours}
              onChange={(e) => setParams({ ...params, daily_usage_hours: parseFloat(e.target.value) })}
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono-num">
              <span>0.5h (Low)</span>
              <span>7.0h (Median)</span>
              <span>14.0h</span>
            </div>
          </div>

          {/* Slider 2: Sleep Duration Hours */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-800 font-medium">Sleep Duration</span>
              <span className="font-mono-num text-xs font-semibold px-2 py-0.5 rounded-lg bg-slate-100 text-slate-800">
                {params.sleep_duration_hours.toFixed(1)} hrs/night
              </span>
            </div>
            <input
              type="range"
              min="3.0"
              max="11.0"
              step="0.25"
              value={params.sleep_duration_hours}
              onChange={(e) => setParams({ ...params, sleep_duration_hours: parseFloat(e.target.value) })}
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono-num">
              <span>3.0h</span>
              <span>7.0h (Optimal)</span>
              <span>11.0h</span>
            </div>
          </div>

          {/* Slider 3: Sleep Quality Score */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-800 font-medium">Subjective Sleep Quality</span>
              <span className="font-mono-num text-xs font-semibold px-2 py-0.5 rounded-lg bg-slate-100 text-slate-800">
                {params.sleep_quality_score} / 10
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              step="1"
              value={params.sleep_quality_score}
              onChange={(e) => setParams({ ...params, sleep_quality_score: parseInt(e.target.value) })}
            />
          </div>

          {/* Slider 4: Weekend Extra Hours */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-800 font-medium">Weekend Screen Surge</span>
              <span className="font-mono-num text-xs font-semibold px-2 py-0.5 rounded-lg bg-slate-100 text-slate-800">
                +{params.weekend_extra_hours.toFixed(1)} hrs
              </span>
            </div>
            <input
              type="range"
              min="0.0"
              max="8.0"
              step="0.5"
              value={params.weekend_extra_hours}
              onChange={(e) => setParams({ ...params, weekend_extra_hours: parseFloat(e.target.value) })}
            />
          </div>

          {/* Toggle: Late Night Usage */}
          <div className="pt-3 pb-1 flex items-center justify-between">
            <div>
              <div className="text-xs font-medium text-slate-800">Late-Night Screen Use</div>
              <div className="text-[11px] text-slate-400">Active within 45 minutes of bedtime</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={params.late_night_usage}
                onChange={(e) => setParams({ ...params, late_night_usage: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-10 h-5.5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4.5 after:w-4.5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* Selector: Primary Platform */}
          <div className="space-y-2">
            <label className="block text-xs font-medium text-slate-800">Primary Platform</label>
            <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 gap-1.5">
              {platforms.map((p) => {
                const isSelected = params.primary_platform === p;
                return (
                  <button
                    key={p}
                    onClick={() => setParams({ ...params, primary_platform: p })}
                    className={`py-2 px-2 rounded-lg text-xs font-medium transition-all cursor-pointer truncate text-center ${
                      isSelected
                        ? 'bg-slate-900 text-white shadow-xs font-semibold'
                        : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
                    }`}
                  >
                    {p.replace(' (Twitter)', '')}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selector: Social Comparison Frequency */}
          <div className="space-y-2">
            <label className="block text-xs font-medium text-slate-800">Upward Social Comparison Frequency</label>
            <div className="grid grid-cols-3 xs:grid-cols-5 gap-1.5">
              {comparisons.map((c) => {
                const isSelected = params.social_comparison_frequency === c.val;
                return (
                  <button
                    key={c.val}
                    onClick={() => setParams({ ...params, social_comparison_frequency: c.val })}
                    className={`py-2 px-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer text-center ${
                      isSelected
                        ? 'bg-slate-900 text-white shadow-xs font-semibold'
                        : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
                    }`}
                  >
                    {c.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Real-Time Prediction Cockpit (7 cols) */}
        <div className="lg:col-span-7 space-y-4 sm:space-y-5">
          {/* Primary Metric Cards (2 Grid) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {/* GPA Card */}
            <div className="clean-card p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono-num font-semibold text-slate-400 uppercase tracking-wider">
                  Predicted Academic GPA
                </span>
                <span className="text-[10px] font-mono-num font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                  ±0.27 RMSE
                </span>
              </div>
              <div className="flex items-baseline space-x-2 mt-2">
                <span className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight font-mono-num">
                  {gpa.toFixed(2)}
                </span>
                <span className="text-xs font-mono-num text-slate-400">/ 4.00</span>
              </div>
              <div className="text-[11px] text-slate-500 font-mono-num mt-1">
                Estimated Band: {Math.max(1.0, gpa - 0.27).toFixed(2)} – {Math.min(4.0, gpa + 0.27).toFixed(2)} (68% CI)
              </div>
              <div className="mt-3">
                <div className="gauge-track">
                  <div
                    className="gauge-fill bg-blue-600"
                    style={{ width: `${Math.min(100, Math.max(0, (gpa / 4.0) * 100))}%` }}
                  ></div>
                </div>
              </div>
              <div className="flex justify-between items-center mt-3 text-xs">
                <span className="font-medium text-slate-800">{gpaTier}</span>
                <span className="text-slate-400 font-mono-num text-[11px]">Ratio: {ratio.toFixed(2)}</span>
              </div>
            </div>

            {/* Mental Health Card */}
            <div className="clean-card p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono-num font-semibold text-slate-400 uppercase tracking-wider">
                  Mental Resilience Score
                </span>
                <span className="text-[10px] font-mono-num font-medium text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
                  ±5.5 RMSE
                </span>
              </div>
              <div className="flex items-baseline space-x-2 mt-2">
                <span className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight font-mono-num">
                  {mental.toFixed(1)}
                </span>
                <span className="text-xs font-mono-num text-slate-400">/ 100</span>
              </div>
              <div className="text-[11px] text-slate-500 font-mono-num mt-1">
                Estimated Band: {Math.max(0, mental - 5.5).toFixed(0)} – {Math.min(100, mental + 5.5).toFixed(0)} / 100
              </div>
              <div className="mt-3">
                <div className="gauge-track">
                  <div
                    className="gauge-fill bg-indigo-600"
                    style={{ width: `${Math.min(100, Math.max(0, mental))}%` }}
                  ></div>
                </div>
              </div>
              <div className="flex justify-between items-center mt-3 text-xs">
                <span className="font-medium text-slate-800">Ridge R² = 0.82</span>
                <span className="text-slate-400 font-mono-num text-[11px]">Linear Assoc</span>
              </div>
            </div>
          </div>

          {/* Archetype Persona Card */}
          <div className="clean-card p-4 sm:p-6">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono-num uppercase tracking-wider text-slate-400">
                  Identified Behavioral Archetype
                </span>
                <h3 className="text-base font-semibold text-slate-900 mt-0.5">{archetype.name}</h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-lg text-xs font-mono-num font-semibold bg-slate-100 text-slate-700">
                {archetype.tier}
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">{archetype.description}</p>
            <div className="mt-4 pt-3 flex items-center justify-between text-xs text-slate-400 font-mono-num">
              <span>Cohort Representation: {archetype.percentage}%</span>
              <span>Mean Stress Index: {archetype.avg_stress} / 40</span>
            </div>
          </div>

          {/* Overall Impact Classification */}
          <div className="clean-card p-4 sm:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-xs tracking-wider uppercase text-slate-800">
                Impact Class Probabilities (XGBoost)
              </h4>
              <span className="px-2.5 py-0.5 rounded-lg text-xs font-mono-num font-semibold bg-slate-100 text-slate-800">
                {preds.overall_impact || 'Beneficial'}
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1 font-mono-num">
                  <span className="text-slate-700">Beneficial Profile</span>
                  <span className="text-blue-600 font-medium">{probabilities.Beneficial.toFixed(1)}%</span>
                </div>
                <div className="gauge-track">
                  <div className="gauge-fill bg-blue-600" style={{ width: `${probabilities.Beneficial}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1 font-mono-num">
                  <span className="text-slate-700">Neutral Equilibrium</span>
                  <span className="text-slate-600 font-medium">{probabilities.Neutral.toFixed(1)}%</span>
                </div>
                <div className="gauge-track">
                  <div className="gauge-fill bg-slate-400" style={{ width: `${probabilities.Neutral}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1 font-mono-num">
                  <span className="text-slate-700">Detrimental</span>
                  <span className="text-rose-600 font-medium">{probabilities.Negative.toFixed(1)}%</span>
                </div>
                <div className="gauge-track">
                  <div className="gauge-fill bg-rose-500" style={{ width: `${probabilities.Negative}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Actionable Directives */}
          <div className="clean-card p-4 sm:p-6 space-y-3">
            <h4 className="font-semibold text-xs tracking-wider uppercase text-slate-800 flex items-center">
              <ShieldCheck className="w-4 h-4 text-blue-600 mr-2" />
              Actionable Behavioral Directives
            </h4>
            <div className="space-y-2">
              {guidance.map((item, idx) => {
                let Icon = CheckCircle2;
                let iconColor = 'text-blue-600';
                if (item.level === 'critical') {
                  Icon = AlertCircle;
                  iconColor = 'text-rose-600';
                } else if (item.level === 'advisory' || item.level === 'info') {
                  Icon = Info;
                  iconColor = 'text-slate-600';
                }

                return (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-50 flex items-start space-x-3 text-xs">
                    <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${iconColor}`} />
                    <div>
                      <strong className="text-slate-900 block font-semibold mb-0.5">{item.title}</strong>
                      <p className="text-slate-600 leading-relaxed font-normal">{item.message}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Educational & Methodological Disclaimer */}
      <div className="p-4 rounded-xl bg-slate-50/90 border border-slate-200/60 flex items-start space-x-3 text-xs text-slate-600">
        <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="text-slate-800 font-semibold block mb-0.5">Educational Simulation Notice:</strong>
          Projections reflect statistical covariations modeled on a benchmark dataset (GPA regressor R² = 0.50, RMSE ±0.27). These outputs represent observational associations rather than deterministic causal proof or clinical diagnoses. Individual academic outcomes are mediated by multifactorial variables including study methodology, course difficulty, and personal circumstances.
        </div>
      </div>
    </section>
  );
}
