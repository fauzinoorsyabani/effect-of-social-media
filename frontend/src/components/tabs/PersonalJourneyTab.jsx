import React from 'react';
import { History, Download, Trash2 } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function PersonalJourneyTab({ history, onClearHistory, onExportHistory }) {
  const chartLabels = history.length
    ? history.map((h, i) => {
        const d = new Date(h.timestamp);
        return `${d.getMonth() + 1}/${d.getDate()} #${i + 1}`;
      })
    : ['Baseline'];

  const mentalData = history.length ? history.map((h) => h.predicted_mental_health) : [78.4];
  const gpaData = history.length ? history.map((h) => h.predicted_gpa) : [3.48];

  const chartData = {
    labels: chartLabels,
    datasets: [
      {
        label: 'Mental Health Index (0-100)',
        data: mentalData,
        borderColor: '#059669',
        backgroundColor: 'rgba(5, 150, 105, 0.06)',
        fill: true,
        tension: 0.3,
        yAxisID: 'y',
        pointRadius: 4,
        pointBackgroundColor: '#059669',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 1.5,
      },
      {
        label: 'Predicted Academic GPA (1.0-4.0)',
        data: gpaData,
        borderColor: '#294f82',
        backgroundColor: 'rgba(41, 79, 130, 0.06)',
        fill: false,
        tension: 0.3,
        yAxisID: 'y1',
        pointRadius: 4,
        pointBackgroundColor: '#294f82',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 1.5,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#20252b',
          boxWidth: 12,
          usePointStyle: true,
          pointStyle: 'circle',
          font: { family: 'Plus Jakarta Sans', size: 11, weight: '500' },
        },
      },
      tooltip: {
        backgroundColor: '#20252b',
        titleFont: { family: 'JetBrains Mono', size: 11 },
        bodyFont: { family: 'JetBrains Mono', size: 11 },
        padding: 10,
        cornerRadius: 6,
      },
    },
    scales: {
      x: {
        grid: { color: '#f0f3f6' },
        ticks: { color: '#5b6570', font: { family: 'JetBrains Mono', size: 10 } },
      },
      y: {
        type: 'linear',
        position: 'left',
        min: 0,
        max: 100,
        grid: { color: '#f0f3f6' },
        ticks: { color: '#059669', font: { family: 'JetBrains Mono', size: 10 } },
      },
      y1: {
        type: 'linear',
        position: 'right',
        min: 1.0,
        max: 4.0,
        grid: { drawOnChartArea: false },
        ticks: { color: '#294f82', font: { family: 'JetBrains Mono', size: 10 } },
      },
    },
  };

  return (
    <section className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[#e0e5e9]">
        <div>
          <div className="rea-badge mb-2">
            <History className="w-3 h-3 text-[#294f82]" />
            <span>LONGITUDINAL COHORT TRACKING</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#20252b]">
            Personal Wellness & Academic Timeline
          </h2>
          <p className="text-xs sm:text-sm text-[#5b6570] mt-1 max-w-2xl">
            Evaluate your iterative behavioral adjustments over time to monitor trend shifts in mental resilience and projected GPA.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onExportHistory}
            className="px-3.5 py-1.5 rounded-md text-xs font-medium text-[#20252b] bg-white hover:bg-[#f4f6f8] border border-[#e0e5e9] transition flex items-center space-x-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#5b6570]" />
            <span>Export JSON</span>
          </button>
          <button
            onClick={onClearHistory}
            className="px-3 py-1.5 rounded-md text-xs font-medium text-[#dc2626] bg-[#fef2f2] hover:bg-[#fee2e2] border border-[#fecaca] transition flex items-center space-x-1 cursor-pointer"
          >
            <Trash2 className="w-3 h-3 text-[#dc2626]" />
            <span>Clear History</span>
          </button>
        </div>
      </div>

      {/* History Progress Chart */}
      <div className="rea-card p-5 space-y-3">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-semibold text-xs text-[#20252b] uppercase tracking-wider">
              Longitudinal Dual-Axis Trajectory
            </h3>
            <p className="text-[11px] text-[#5b6570] mt-0.5">
              Empirical resilience index (Green, left axis) against GPA regression projection (Navy, right axis).
            </p>
          </div>
          <span className="rea-badge font-mono-num">
            {history.length} Assessments Stored
          </span>
        </div>
        <div className="h-68">
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>

      {/* History Table Log */}
      <div className="rea-card p-5 space-y-3">
        <h3 className="font-semibold text-xs text-[#20252b] uppercase tracking-wider">
          Assessment History Ledger
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="text-[#5b6570] bg-[#fafbfc] border-y border-[#e0e5e9] font-mono-num text-[11px]">
              <tr>
                <th className="py-2.5 px-3">Date & Time</th>
                <th className="py-2.5 px-2">Screen Hours</th>
                <th className="py-2.5 px-2">Sleep Hours</th>
                <th className="py-2.5 px-2">Predicted GPA</th>
                <th className="py-2.5 px-2">Mental Index</th>
                <th className="py-2.5 px-2">Behavioral Archetype</th>
                <th className="py-2.5 px-3 text-right">Risk Assessment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e0e5e9] text-[#20252b] font-mono-num">
              {history.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-10 text-center text-[#5b6570] font-sans text-xs">
                    No assessments recorded in current session. Run a simulation and click "Save Assessment" to establish your trajectory.
                  </td>
                </tr>
              ) : (
                [...history].reverse().map((item, idx) => {
                  const dateFormatted = new Date(item.timestamp).toLocaleString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  });
                  return (
                    <tr key={item.id || idx} className="hover:bg-[#f4f6f8] transition-colors">
                      <td className="py-2.5 px-3 font-medium text-[#20252b]">{dateFormatted}</td>
                      <td className="py-2.5 px-2 text-[#059669] font-medium">{item.daily_usage_hours}h</td>
                      <td className="py-2.5 px-2 text-[#294f82] font-medium">{item.sleep_duration_hours}h</td>
                      <td className="py-2.5 px-2 font-bold text-[#20252b]">
                        {item.predicted_gpa.toFixed(2)}
                      </td>
                      <td className="py-2.5 px-2 font-bold text-[#20252b]">
                        {item.predicted_mental_health.toFixed(1)}
                      </td>
                      <td className="py-2.5 px-2 text-[#5b6570] font-sans">{item.archetype}</td>
                      <td className="py-2.5 px-3 text-right">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono-num font-medium border ${
                          item.archetype_tier === 'Low Risk'
                            ? 'bg-[#ecfdf5] text-[#059669] border-[#a7f3d0]'
                            : item.archetype_tier === 'Moderate Risk'
                            ? 'bg-[#fffbeb] text-[#d97706] border-[#fde68a]'
                            : 'bg-[#fef2f2] text-[#dc2626] border-[#fecaca]'
                        }`}>
                          {item.archetype_tier}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
