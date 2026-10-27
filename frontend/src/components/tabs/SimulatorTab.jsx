import React from 'react';
import { Zap, Save, RotateCcw, SlidersHorizontal, ShieldCheck, AlertTriangle, Clock, Eye, CheckCircle } from 'lucide-react';

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
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[#e0e5e9]">
        <div>
          <div className="rea-badge mb-2">
            <Zap className="w-3 h-3 text-[#294f82]" />
            <span>REAL-TIME INFERENCE ENGINE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#20252b]">
            Digital Phenotype & Academic Simulator
          </h1>
          <p className="text-xs sm:text-sm text-[#5b6570] mt-1 max-w-2xl">
            Simulate digital exposure intervals and late-night habits to compute mathematical ML projections across academic and psychological metrics.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onSaveAssessment}
            className="px-3.5 py-1.5 rounded-md text-xs font-medium text-white bg-[#294f82] hover:bg-[#1e3a63] transition flex items-center space-x-1.5 cursor-pointer shadow-xs"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Assessment</span>
          </button>
          <button
            onClick={onResetDefaults}
            className="px-3 py-1.5 rounded-md text-xs font-medium text-[#20252b] bg-white hover:bg-[#f4f6f8] border border-[#e0e5e9] transition flex items-center space-x-1 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3 text-[#5b6570]" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Simulator Interactive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Input Parameter Controls (5 cols) */}
        <div className="lg:col-span-5 rea-card p-5 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#e0e5e9]">
            <h2 className="font-semibold text-xs tracking-wider text-[#20252b] uppercase flex items-center">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#294f82] mr-2" />
              Behavioral & Sleep Parameters
            </h2>
            <span className="text-[11px] text-[#5b6570] font-mono-num">Continuous Eval</span>
          </div>

          {/* Slider 1: Daily Screen Hours */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-[#20252b] font-medium">Daily Screen Time</span>
              <span className="font-mono-num text-xs font-semibold px-2 py-0.5 rounded border border-[#e0e5e9] bg-[#f4f6f8] text-[#20252b]">
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
            <div className="flex justify-between text-[10px] text-[#5b6570] font-mono-num">
              <span>0.5h (Low)</span>
              <span>7.0h (Cohort Median)</span>
              <span>14.0h (Critical)</span>
            </div>
          </div>

          {/* Slider 2: Sleep Duration Hours */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-[#20252b] font-medium">Sleep Duration</span>
              <span className="font-mono-num text-xs font-semibold px-2 py-0.5 rounded border border-[#e0e5e9] bg-[#f4f6f8] text-[#20252b]">
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
            <div className="flex justify-between text-[10px] text-[#5b6570] font-mono-num">
              <span>3.0h (Deprivation)</span>
              <span>7.0h (Target)</span>
              <span>11.0h</span>
            </div>
          </div>

          {/* Slider 3: Sleep Quality Score */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-[#20252b] font-medium">Subjective Sleep Quality</span>
              <span className="font-mono-num text-xs font-semibold px-2 py-0.5 rounded border border-[#e0e5e9] bg-[#f4f6f8] text-[#20252b]">
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
              <span className="text-[#20252b] font-medium">Weekend Screen Surge</span>
              <span className="font-mono-num text-xs font-semibold px-2 py-0.5 rounded border border-[#e0e5e9] bg-[#f4f6f8] text-[#20252b]">
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
          <div className="pt-3 pb-1 border-t border-[#e0e5e9] flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-[#20252b]">Late-Night Screen Use</div>
              <div className="text-[11px] text-[#5b6570]">Active within 45 minutes of bedtime</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={params.late_night_usage}
                onChange={(e) => setParams({ ...params, late_night_usage: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-10 h-5.5 bg-[#e0e5e9] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[#cbd5e1] after:border after:rounded-full after:h-4.5 after:w-4.5 after:transition-all peer-checked:bg-[#294f82]"></div>
            </label>
          </div>

          {/* Selector: Primary Platform */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-[#20252b]">Primary Platform</label>
            <div className="grid grid-cols-4 gap-1.5">
              {platforms.map((p) => {
                const isSelected = params.primary_platform === p;
                return (
                  <button
                    key={p}
                    onClick={() => setParams({ ...params, primary_platform: p })}
                    className={`py-1.5 px-2 rounded-md text-xs font-medium transition cursor-pointer truncate ${
                      isSelected
                        ? 'bg-[#20252b] text-white border border-[#20252b]'
                        : 'bg-white text-[#5b6570] hover:text-[#20252b] hover:bg-[#f4f6f8] border border-[#e0e5e9]'
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
            <label className="block text-xs font-semibold text-[#20252b]">Upward Social Comparison Frequency</label>
            <div className="grid grid-cols-5 gap-1">
              {comparisons.map((c) => {
                const isSelected = params.social_comparison_frequency === c.val;
                return (
                  <button
                    key={c.val}
                    onClick={() => setParams({ ...params, social_comparison_frequency: c.val })}
                    className={`py-1.5 px-1.5 rounded-md text-xs font-medium transition cursor-pointer text-center ${
                      isSelected
                        ? 'bg-[#20252b] text-white border border-[#20252b]'
                        : 'bg-white text-[#5b6570] hover:text-[#20252b] hover:bg-[#f4f6f8] border border-[#e0e5e9]'
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
        <div className="lg:col-span-7 space-y-5">
          {/* Primary Metric Cards (2 Grid) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* GPA Card */}
            <div className="rea-card p-5 border-l-4 border-l-[#294f82]">
              <div className="text-[11px] font-mono-num font-semibold text-[#5b6570] uppercase tracking-wider">
                Predicted Academic GPA
              </div>
              <div className="flex items-baseline space-x-2 mt-2">
                <span className="text-3xl font-bold text-[#20252b] tracking-tight font-mono-num">
                  {gpa.toFixed(2)}
                </span>
                <span className="text-xs font-mono-num text-[#5b6570]">/ 4.00 Max</span>
              </div>
              <div className="mt-3">
                <div className="gauge-track">
                  <div
                    className="gauge-fill bg-[#294f82]"
                    style={{ width: `${Math.min(100, Math.max(0, (gpa / 4.0) * 100))}%` }}
                  ></div>
                </div>
              </div>
              <div className="flex justify-between items-center mt-2.5 text-xs">
                <span className="font-medium text-[#20252b]">{gpaTier}</span>
                <span className="text-[#5b6570] font-mono-num text-[11px]">Ratio: {ratio.toFixed(2)}</span>
              </div>
            </div>

            {/* Mental Health Card */}
            <div className="rea-card p-5 border-l-4 border-l-[#059669]">
              <div className="text-[11px] font-mono-num font-semibold text-[#5b6570] uppercase tracking-wider">
                Mental Health Resilience
              </div>
              <div className="flex items-baseline space-x-2 mt-2">
                <span className="text-3xl font-bold text-[#20252b] tracking-tight font-mono-num">
                  {mental.toFixed(1)}
                </span>
                <span className="text-xs font-mono-num text-[#5b6570]">/ 100 Scale</span>
              </div>
              <div className="mt-3">
                <div className="gauge-track">
                  <div
                    className="gauge-fill bg-[#059669]"
                    style={{ width: `${Math.min(100, Math.max(0, mental))}%` }}
                  ></div>
                </div>
              </div>
              <div className="flex justify-between items-center mt-2.5 text-xs">
                <span className="font-medium text-[#20252b]">Empirical Ridge R² = 0.82</span>
                <span className="text-[#5b6570] font-mono-num text-[11px]">RMSE ±5.47</span>
              </div>
            </div>
          </div>

          {/* Archetype Persona Card */}
          <div className="rea-card p-5">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono-num uppercase tracking-wider text-[#5b6570]">
                  Identified Behavioral Archetype
                </span>
                <h3 className="text-base font-semibold text-[#20252b] mt-0.5">{archetype.name}</h3>
              </div>
              <span className={`px-2 py-0.5 rounded text-[11px] font-mono-num font-semibold uppercase tracking-wide border ${
                archetype.tier === 'Low Risk'
                  ? 'bg-[#ecfdf5] text-[#059669] border-[#a7f3d0]'
                  : archetype.tier === 'Moderate Risk'
                  ? 'bg-[#fffbeb] text-[#d97706] border-[#fde68a]'
                  : 'bg-[#fef2f2] text-[#dc2626] border-[#fecaca]'
              }`}>
                {archetype.tier}
              </span>
            </div>
            <p className="text-xs text-[#5b6570] mt-2 leading-relaxed">{archetype.description}</p>
            <div className="mt-3.5 pt-3 border-t border-[#e0e5e9] flex items-center justify-between text-xs text-[#5b6570] font-mono-num">
              <span>Cohort Cluster Representation: {archetype.percentage}%</span>
              <span>Mean Stress Index: {archetype.avg_stress} / 40</span>
            </div>
          </div>

          {/* Overall Impact Classification */}
          <div className="rea-card p-5 space-y-3.5">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-xs tracking-wider uppercase text-[#20252b]">
                Multi-Class Impact Probabilities (XGBoost)
              </h4>
              <span className="px-2 py-0.5 rounded text-xs font-mono-num font-semibold bg-[#f4f6f8] text-[#20252b] border border-[#e0e5e9]">
                Prediction: {preds.overall_impact || 'Beneficial'}
              </span>
            </div>

            <div className="space-y-2.5">
              <div>
                <div className="flex justify-between text-xs mb-1 font-mono-num">
                  <span className="text-[#20252b]">Beneficial Profile</span>
                  <span className="text-[#059669] font-medium">{probabilities.Beneficial.toFixed(1)}%</span>
                </div>
                <div className="gauge-track">
                  <div className="gauge-fill bg-[#059669]" style={{ width: `${probabilities.Beneficial}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1 font-mono-num">
                  <span className="text-[#20252b]">Neutral Equilibrium</span>
                  <span className="text-[#294f82] font-medium">{probabilities.Neutral.toFixed(1)}%</span>
                </div>
                <div className="gauge-track">
                  <div className="gauge-fill bg-[#294f82]" style={{ width: `${probabilities.Neutral}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1 font-mono-num">
                  <span className="text-[#20252b]">Detrimental / Negative</span>
                  <span className="text-[#dc2626] font-medium">{probabilities.Negative.toFixed(1)}%</span>
                </div>
                <div className="gauge-track">
                  <div className="gauge-fill bg-[#dc2626]" style={{ width: `${probabilities.Negative}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Actionable Directives */}
          <div className="rea-card p-5 space-y-3">
            <h4 className="font-semibold text-xs tracking-wider uppercase text-[#20252b] flex items-center">
              <ShieldCheck className="w-4 h-4 text-[#294f82] mr-2" />
              Actionable Scientific Directives
            </h4>
            <div className="space-y-2">
              {guidance.map((item, idx) => {
                let borderStyle = 'border-l-4 border-l-[#d97706] bg-[#fafbfc] border border-[#e0e5e9]';
                let Icon = Clock;
                let iconColor = 'text-[#d97706]';

                if (item.level === 'critical') {
                  borderStyle = 'border-l-4 border-l-[#dc2626] bg-[#fafbfc] border border-[#e0e5e9]';
                  Icon = AlertTriangle;
                  iconColor = 'text-[#dc2626]';
                } else if (item.level === 'advisory' || item.level === 'info') {
                  borderStyle = 'border-l-4 border-l-[#294f82] bg-[#fafbfc] border border-[#e0e5e9]';
                  Icon = Eye;
                  iconColor = 'text-[#294f82]';
                } else if (item.level === 'success') {
                  borderStyle = 'border-l-4 border-l-[#059669] bg-[#fafbfc] border border-[#e0e5e9]';
                  Icon = CheckCircle;
                  iconColor = 'text-[#059669]';
                }

                return (
                  <div key={idx} className={`p-3 rounded-md ${borderStyle} flex items-start space-x-3 text-xs`}>
                    <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${iconColor}`} />
                    <div>
                      <strong className="text-[#20252b] block font-semibold mb-0.5">{item.title}</strong>
                      <p className="text-[#5b6570] leading-relaxed font-normal">{item.message}</p>
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
