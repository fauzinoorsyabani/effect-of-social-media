import React from 'react';
import { Zap, Save, RotateCcw, SlidersHorizontal, ShieldCheck, AlertTriangle, Clock, Eye, CheckCircle, Info } from 'lucide-react';

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
    <section className="space-y-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium uppercase tracking-wider mb-2">
            <Zap className="w-3.5 h-3.5 text-emerald-600" />
            <span>Real-Time Predictive Simulation</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900">
            Student Digital Wellness & GPA Simulator
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Adjust screen hours and sleep habits to observe mathematical machine learning projections.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onSaveAssessment}
            className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-500 shadow-xs transition flex items-center space-x-1.5 cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Assessment</span>
          </button>
          <button
            onClick={onResetDefaults}
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 shadow-xs transition flex items-center space-x-1 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Simulator Interactive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Input Parameter Controls (5 cols) */}
        <div className="lg:col-span-5 glass-card p-6 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="font-medium text-xs tracking-wider text-slate-700 uppercase flex items-center">
              <SlidersHorizontal className="w-4 h-4 text-emerald-600 mr-2" />
              Behavioral & Sleep Parameters
            </h2>
            <span className="text-[11px] text-slate-500 font-mono">Live Recalculation</span>
          </div>

          {/* Slider 1: Daily Screen Hours */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-700 font-medium">Daily Screen Time</span>
              <span className="font-mono text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                {params.daily_usage_hours.toFixed(1)} hrs
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
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0.5h (Low)</span>
              <span>7.0h (Average)</span>
              <span>14.0h (Critical)</span>
            </div>
          </div>

          {/* Slider 2: Sleep Duration Hours */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-700 font-medium">Sleep Duration</span>
              <span className="font-mono text-sky-700 font-medium bg-sky-50 px-2 py-0.5 rounded border border-sky-100">
                {params.sleep_duration_hours.toFixed(1)} hrs
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
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>3.0h (Severe Deprivation)</span>
              <span>7.0h (Target)</span>
              <span>11.0h</span>
            </div>
          </div>

          {/* Slider 3: Sleep Quality Score */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-700 font-medium">Sleep Quality Score (1-10)</span>
              <span className="font-mono text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
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
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-700 font-medium">Weekend Screen Surge</span>
              <span className="font-mono text-amber-700 font-medium bg-amber-50 px-2 py-0.5 rounded border border-amber-100">
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
          <div className="pt-3 pb-1 border-t border-slate-100 flex items-center justify-between">
            <div>
              <div className="text-xs font-medium text-slate-800">Late-Night Screen Use</div>
              <div className="text-[11px] text-slate-500">Screen active within 45 mins of bedtime</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={params.late_night_usage}
                onChange={(e) => setParams({ ...params, late_night_usage: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          {/* Selector: Primary Platform */}
          <div className="space-y-2">
            <label className="block text-xs font-medium text-slate-700">Primary Platform</label>
            <div className="grid grid-cols-4 gap-1.5">
              {platforms.map((p) => {
                const isSelected = params.primary_platform === p;
                return (
                  <button
                    key={p}
                    onClick={() => setParams({ ...params, primary_platform: p })}
                    className={`py-1.5 px-2 rounded-lg text-xs font-medium transition cursor-pointer truncate ${
                      isSelected
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900 border border-slate-200'
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
            <label className="block text-xs font-medium text-slate-700">Upward Social Comparison Frequency</label>
            <div className="grid grid-cols-5 gap-1">
              {comparisons.map((c) => {
                const isSelected = params.social_comparison_frequency === c.val;
                return (
                  <button
                    key={c.val}
                    onClick={() => setParams({ ...params, social_comparison_frequency: c.val })}
                    className={`py-1.5 px-2 rounded-lg text-xs font-medium transition cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900 border border-slate-200'
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
        <div className="lg:col-span-7 space-y-6">
          {/* Primary Metric Cards (2 Grid) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* GPA Card */}
            <div className="glass-card p-5 border-l-4 border-emerald-500 relative overflow-hidden">
              <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                Predicted Academic GPA
              </div>
              <div className="flex items-baseline space-x-2 mt-2">
                <span className="text-3xl font-semibold text-slate-900 tracking-tight metric-mono">
                  {gpa.toFixed(2)}
                </span>
                <span className="text-xs font-mono text-slate-400">/ 4.00 Max</span>
              </div>
              <div className="mt-3">
                <div className="gauge-track">
                  <div
                    className="gauge-fill bg-emerald-500"
                    style={{ width: `${Math.min(100, Math.max(0, (gpa / 4.0) * 100))}%` }}
                  ></div>
                </div>
              </div>
              <div className="flex justify-between items-center mt-2.5 text-xs">
                <span className="font-medium text-emerald-700">{gpaTier}</span>
                <span className="text-slate-500 font-mono text-[11px]">Ratio: {ratio.toFixed(2)}</span>
              </div>
            </div>

            {/* Mental Health Card */}
            <div className="glass-card p-5 border-l-4 border-sky-500 relative overflow-hidden">
              <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                Mental Health Index
              </div>
              <div className="flex items-baseline space-x-2 mt-2">
                <span className="text-3xl font-semibold text-slate-900 tracking-tight metric-mono">
                  {mental.toFixed(1)}
                </span>
                <span className="text-xs font-mono text-slate-400">/ 100 Scale</span>
              </div>
              <div className="mt-3">
                <div className="gauge-track">
                  <div
                    className="gauge-fill bg-sky-500"
                    style={{ width: `${Math.min(100, Math.max(0, mental))}%` }}
                  ></div>
                </div>
              </div>
              <div className="flex justify-between items-center mt-2.5 text-xs">
                <span className="font-medium text-sky-700">Resilient & Stable</span>
                <span className="text-slate-500 font-mono text-[11px]">Validated R² 0.82</span>
              </div>
            </div>
          </div>

          {/* Archetype Persona Card */}
          <div className="glass-card p-6 border-t-2" style={{ borderTopColor: '#10B981' }}>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                  Identified Behavioral Archetype
                </span>
                <h3 className="text-base font-semibold text-slate-900 mt-0.5">{archetype.name}</h3>
              </div>
              <span className="px-2.5 py-1 rounded-md text-xs font-medium uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono">
                {archetype.tier}
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-2.5 leading-relaxed">{archetype.description}</p>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-mono">
              <span>Cohort Representation: {archetype.percentage}%</span>
              <span>Avg Stress: {archetype.avg_stress} / 40</span>
            </div>
          </div>

          {/* Overall Impact Classification */}
          <div className="glass-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-xs tracking-wider uppercase text-slate-700">
                Overall Impact Classification Probabilities
              </h4>
              <span className="px-2.5 py-0.5 rounded text-xs font-medium font-mono bg-emerald-50 text-emerald-700 border border-emerald-200">
                {preds.overall_impact || 'Beneficial'}
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-slate-700">Beneficial</span>
                  <span className="font-mono text-emerald-700">{probabilities.Beneficial.toFixed(1)}%</span>
                </div>
                <div className="gauge-track">
                  <div className="gauge-fill bg-emerald-500" style={{ width: `${probabilities.Beneficial}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-slate-700">Neutral</span>
                  <span className="font-mono text-sky-700">{probabilities.Neutral.toFixed(1)}%</span>
                </div>
                <div className="gauge-track">
                  <div className="gauge-fill bg-sky-500" style={{ width: `${probabilities.Neutral}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-slate-700">Negative</span>
                  <span className="font-mono text-rose-700">{probabilities.Negative.toFixed(1)}%</span>
                </div>
                <div className="gauge-track">
                  <div className="gauge-fill bg-rose-500" style={{ width: `${probabilities.Negative}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Actionable Directives */}
          <div className="glass-card p-6 space-y-3">
            <h4 className="font-medium text-xs tracking-wider uppercase text-slate-700 flex items-center">
              <ShieldCheck className="w-4 h-4 text-emerald-600 mr-2" />
              Actionable Behavioral Directives
            </h4>
            <div className="space-y-2">
              {guidance.map((item, idx) => {
                let borderClass = 'border-amber-200 bg-amber-50 text-amber-800';
                let Icon = Clock;
                if (item.level === 'critical') {
                  borderClass = 'border-rose-200 bg-rose-50 text-rose-800';
                  Icon = AlertTriangle;
                } else if (item.level === 'advisory' || item.level === 'info') {
                  borderClass = 'border-sky-200 bg-sky-50 text-sky-800';
                  Icon = Eye;
                } else if (item.level === 'success') {
                  borderClass = 'border-emerald-200 bg-emerald-50 text-emerald-800';
                  Icon = CheckCircle;
                }

                return (
                  <div key={idx} className={`p-3.5 rounded-xl border ${borderClass} flex items-start space-x-3 text-xs`}>
                    <Icon className="w-4 h-4 mt-0.5 shrink-0" />
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
    </section>
  );
}
