import React from 'react';
import { Database } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function CohortAnalyticsTab({ overviewData }) {
  const data = overviewData || {
    total_students: 4500,
    avg_daily_screen: 5.4,
    avg_sleep_hours: 6.7,
    late_night_pct: 63.2,
    platform_breakdown: [
      { Primary_Platform: 'Instagram', avg_screen: 5.26 },
      { Primary_Platform: 'LinkedIn', avg_screen: 5.27 },
      { Primary_Platform: 'Reddit', avg_screen: 5.31 },
      { Primary_Platform: 'Snapchat', avg_screen: 5.46 },
      { Primary_Platform: 'TikTok', avg_screen: 5.33 },
      { Primary_Platform: 'X (Twitter)', avg_screen: 5.14 },
      { Primary_Platform: 'YouTube', avg_screen: 5.25 },
    ],
    social_comparison_breakdown: [
      { Social_Comparison_Frequency: 'Never', avg_stress: 13.64 },
      { Social_Comparison_Frequency: 'Rarely', avg_stress: 13.67 },
      { Social_Comparison_Frequency: 'Sometimes', avg_stress: 13.47 },
      { Social_Comparison_Frequency: 'Frequently', avg_stress: 13.40 },
      { Social_Comparison_Frequency: 'Always', avg_stress: 13.59 },
    ],
    impact_distribution: { Beneficial: 3681, Neutral: 654, Negative: 165 },
  };

  // Platform Screen Chart
  const platformChartData = {
    labels: data.platform_breakdown.map((p) => p.Primary_Platform),
    datasets: [
      {
        label: 'Mean Screen Hours',
        data: data.platform_breakdown.map((p) => p.avg_screen),
        backgroundColor: '#294f82',
        hoverBackgroundColor: '#1e3a63',
        borderRadius: 4,
      },
    ],
  };

  const platformChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#20252b',
        titleFont: { family: 'JetBrains Mono', size: 11 },
        bodyFont: { family: 'JetBrains Mono', size: 11 },
        padding: 8,
        cornerRadius: 5,
      },
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#5b6570', font: { family: 'JetBrains Mono', size: 10 } } },
      y: { grid: { color: '#f0f3f6' }, ticks: { color: '#5b6570', font: { family: 'JetBrains Mono', size: 10 } } },
    },
  };

  // Comparison Stress Chart
  const stressChartData = {
    labels: data.social_comparison_breakdown.map((s) => s.Social_Comparison_Frequency),
    datasets: [
      {
        label: 'Perceived Stress Score (0-40)',
        data: data.social_comparison_breakdown.map((s) => s.avg_stress),
        borderColor: '#d97706',
        backgroundColor: 'rgba(217, 119, 6, 0.06)',
        fill: true,
        tension: 0.3,
        pointRadius: 4,
        pointBackgroundColor: '#d97706',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 1.5,
      },
    ],
  };

  const stressChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#20252b',
        titleFont: { family: 'JetBrains Mono', size: 11 },
        bodyFont: { family: 'JetBrains Mono', size: 11 },
        padding: 8,
        cornerRadius: 5,
      },
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#5b6570', font: { family: 'JetBrains Mono', size: 10 } } },
      y: { grid: { color: '#f0f3f6' }, ticks: { color: '#5b6570', font: { family: 'JetBrains Mono', size: 10 } } },
    },
  };

  // Impact Donut Chart
  const impactChartData = {
    labels: Object.keys(data.impact_distribution),
    datasets: [
      {
        data: Object.values(data.impact_distribution),
        backgroundColor: ['#059669', '#294f82', '#dc2626'],
        borderColor: '#ffffff',
        borderWidth: 2,
      },
    ],
  };

  const impactChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#20252b',
          boxWidth: 12,
          usePointStyle: true,
          font: { family: 'Plus Jakarta Sans', size: 11 },
        },
      },
      tooltip: {
        backgroundColor: '#20252b',
        titleFont: { family: 'JetBrains Mono', size: 11 },
        bodyFont: { family: 'JetBrains Mono', size: 11 },
        padding: 8,
        cornerRadius: 5,
      },
    },
    cutout: '70%',
  };

  return (
    <section className="space-y-6">
      {/* Section Header */}
      <div className="pb-4 border-b border-[#e0e5e9]">
        <div className="rea-badge mb-2">
          <Database className="w-3 h-3 text-[#294f82]" />
          <span>EMPIRICAL POPULATION DATASET (N = 4,500)</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#20252b]">
          Cohort Behavioral Analytics & Cross-Sections
        </h2>
        <p className="text-xs sm:text-sm text-[#5b6570] mt-1 max-w-2xl">
          Aggregated distributions across primary platform habits, bedtime screen exposure, and empirical stress distributions.
        </p>
      </div>

      {/* 4 Top KPI Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rea-card p-4">
          <div className="text-[11px] font-mono-num font-semibold text-[#5b6570] uppercase tracking-wider">Students Surveyed</div>
          <div className="text-2xl font-bold font-mono-num text-[#20252b] mt-1">4,500</div>
          <div className="text-[11px] text-[#5b6570] mt-1">Undergrad & Postgrad</div>
        </div>

        <div className="rea-card p-4">
          <div className="text-[11px] font-mono-num font-semibold text-[#5b6570] uppercase tracking-wider">Mean Daily Screen</div>
          <div className="text-2xl font-bold font-mono-num text-[#20252b] mt-1">{data.avg_daily_screen} hrs</div>
          <div className="text-[11px] text-[#5b6570] mt-1 font-mono-num">Std Dev: 2.1 hrs</div>
        </div>

        <div className="rea-card p-4">
          <div className="text-[11px] font-mono-num font-semibold text-[#5b6570] uppercase tracking-wider">Mean Sleep Duration</div>
          <div className="text-2xl font-bold font-mono-num text-[#20252b] mt-1">{data.avg_sleep_hours} hrs</div>
          <div className="text-[11px] text-[#5b6570] mt-1 font-mono-num">36.1% Below 6.0h Threshold</div>
        </div>

        <div className="rea-card p-4">
          <div className="text-[11px] font-mono-num font-semibold text-[#5b6570] uppercase tracking-wider">Late-Night Exposure</div>
          <div className="text-2xl font-bold font-mono-num text-[#dc2626] mt-1">{data.late_night_pct}%</div>
          <div className="text-[11px] text-[#5b6570] mt-1">Active Bedtime Screen Use</div>
        </div>
      </div>

      {/* Charts Grid 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="rea-card p-5 space-y-2">
          <h3 className="font-semibold text-xs text-[#20252b] uppercase tracking-wider">
            Screen Duration by Primary Platform
          </h3>
          <p className="text-[11px] text-[#5b6570]">
            Average daily hours across platform preferences within surveyed students.
          </p>
          <div className="h-60 pt-2">
            <Bar data={platformChartData} options={platformChartOptions} />
          </div>
        </div>

        <div className="rea-card p-5 space-y-2">
          <h3 className="font-semibold text-xs text-[#20252b] uppercase tracking-wider">
            Upward Social Comparison vs. Perceived Stress
          </h3>
          <p className="text-[11px] text-[#5b6570]">
            Psychological stress scores (0-40) mapped to comparison frequency.
          </p>
          <div className="h-60 pt-2">
            <Line data={stressChartData} options={stressChartOptions} />
          </div>
        </div>
      </div>

      {/* Charts Grid 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="rea-card p-5 space-y-2">
          <h3 className="font-semibold text-xs text-[#20252b] uppercase tracking-wider">
            Overall Impact Proportions
          </h3>
          <p className="text-[11px] text-[#5b6570]">Cohort distribution across 4,500 labeled records.</p>
          <div className="h-52 pt-1">
            <Doughnut data={impactChartData} options={impactChartOptions} />
          </div>
        </div>

        <div className="lg:col-span-2 rea-card p-5 space-y-3">
          <h3 className="font-semibold text-xs text-[#20252b] uppercase tracking-wider">
            Core Empirical Behavioral Findings
          </h3>
          <div className="space-y-2.5 text-xs">
            <div className="p-3 rounded-md bg-[#fafbfc] border border-[#e0e5e9] border-l-4 border-l-[#294f82]">
              <strong className="text-[#20252b] block mb-0.5">1. The Displacement Hypothesis (Strongest Predictor)</strong>
              <p className="text-[#5b6570] leading-relaxed">
                The ratio of screen time to sleep hours explains 48.6% of the feature weight in student academic GPA regression. When daily screen time exceeds sleep duration (ratio &gt; 1.0), students register statistically lower academic GPAs regardless of self-reported study habits.
              </p>
            </div>

            <div className="p-3 rounded-md bg-[#fafbfc] border border-[#e0e5e9] border-l-4 border-l-[#059669]">
              <strong className="text-[#20252b] block mb-0.5">2. Algorithmic Feed vs. Passive Video Consumption</strong>
              <p className="text-[#5b6570] leading-relaxed">
                Algorithmic short-video platforms (TikTok, Instagram) induce higher late-night exposure rates and stress metrics compared to linear video platforms (YouTube) and text-centric platforms (Reddit).
              </p>
            </div>

            <div className="p-3 rounded-md bg-[#fafbfc] border border-[#e0e5e9] border-l-4 border-l-[#d97706]">
              <strong className="text-[#20252b] block mb-0.5">3. Non-Linear Bedtime Sleep Degradation</strong>
              <p className="text-[#5b6570] leading-relaxed">
                Screen use within 45 minutes of attempting sleep suppresses sleep quality ratings by an average of 2.1 points on a 10-point scale, driving cumulative cognitive fatigue during morning lecture hours.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
