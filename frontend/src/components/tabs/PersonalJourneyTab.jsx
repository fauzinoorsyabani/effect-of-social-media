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
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37, 99, 235, 0.05)',
        fill: true,
        tension: 0.3,
        yAxisID: 'y',
        pointRadius: 4,
        pointBackgroundColor: '#2563eb',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 1.5,
      },
      {
        label: 'Predicted Academic GPA (1.0-4.0)',
        data: gpaData,
        borderColor: '#475569',
        backgroundColor: 'rgba(71, 85, 105, 0.05)',
        fill: false,
        tension: 0.3,
        yAxisID: 'y1',
        pointRadius: 4,
        pointBackgroundColor: '#475569',
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
          color: '#0f172a',
          boxWidth: 12,
          usePointStyle: true,
          pointStyle: 'circle',
          font: { family: 'Plus Jakarta Sans', size: 11, weight: '500' },
        },
      },
      tooltip: {
        backgroundColor: '#0f172a',
        titleFont: { family: 'JetBrains Mono', size: 11 },
        bodyFont: { family: 'JetBrains Mono', size: 11 },
        padding: 10,
        cornerRadius: 8,
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(148, 163, 184, 0.1)' },
        ticks: { color: '#64748b', font: { family: 'JetBrains Mono', size: 10 } },
      },
      y: {
        type: 'linear',
        position: 'left',
        min: 0,
        max: 100,
        grid: { color: 'rgba(148, 163, 184, 0.1)' },
        ticks: { color: '#2563eb', font: { family: 'JetBrains Mono', size: 10 } },
      },
      y1: {
        type: 'linear',
        position: 'right',
        min: 1.0,
        max: 4.0,
        grid: { drawOnChartArea: false },
        ticks: { color: '#475569', font: { family: 'JetBrains Mono', size: 10 } },
      },
    },
  };

  return (
    <section className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight text-slate-900">
            Personal Wellness & Academic Timeline
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Evaluate your iterative behavioral adjustments over time to monitor trajectory shifts in resilience and projected GPA.
          </p>
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <button
            onClick={onExportHistory}
            className="flex-1 sm:flex-initial justify-center px-4 py-2 rounded-xl text-xs font-medium text-slate-800 bg-white hover:bg-slate-100 transition flex items-center space-x-1.5 cursor-pointer shadow-xs border border-slate-200/60"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export JSON</span>
          </button>
          <button
            onClick={onClearHistory}
            className="flex-1 sm:flex-initial justify-center px-4 py-2 rounded-xl text-xs font-medium text-rose-600 bg-rose-50 hover:bg-rose-100 transition flex items-center space-x-1 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-600" />
            <span>Clear History</span>
          </button>
        </div>
      </div>

      {/* History Progress Chart */}
      <div className="clean-card p-4 sm:p-6 space-y-3">
        <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-2">
          <div>
            <h3 className="font-semibold text-xs text-slate-800 uppercase tracking-wider">
              Longitudinal Dual-Axis Trajectory
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Empirical resilience index (Blue, left axis) against GPA regression projection (Slate, right axis).
            </p>
          </div>
          <span className="font-mono-num text-xs px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 self-start xs:self-auto">
            {history.length} Assessments
          </span>
        </div>
        <div className="h-56 sm:h-68">
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>

      {/* History Table Log */}
      <div className="clean-card p-4 sm:p-6 space-y-4">
        <h3 className="font-semibold text-xs text-slate-800 uppercase tracking-wider">
          Assessment History Ledger
        </h3>
        <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
          <table className="w-full text-left text-xs min-w-[600px]">
            <thead className="text-slate-400 bg-slate-50/70 font-mono-num text-[11px]">
              <tr>
                <th className="py-2.5 px-3 rounded-l-lg">Date & Time</th>
                <th className="py-2.5 px-2">Screen Hours</th>
                <th className="py-2.5 px-2">Sleep Hours</th>
                <th className="py-2.5 px-2">Predicted GPA</th>
                <th className="py-2.5 px-2">Mental Index</th>
                <th className="py-2.5 px-2">Behavioral Archetype</th>
                <th className="py-2.5 px-3 text-right rounded-r-lg">Risk Assessment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800 font-mono-num">
              {history.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-400 font-sans text-xs">
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
                    <tr key={item.id || idx} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-3 font-medium text-slate-900">{dateFormatted}</td>
                      <td className="py-3 px-2 text-blue-600 font-medium">{item.daily_usage_hours}h</td>
                      <td className="py-3 px-2 text-slate-600 font-medium">{item.sleep_duration_hours}h</td>
                      <td className="py-3 px-2 font-bold text-slate-900">
                        {item.predicted_gpa.toFixed(2)}
                      </td>
                      <td className="py-3 px-2 font-bold text-slate-900">
                        {item.predicted_mental_health.toFixed(1)}
                      </td>
                      <td className="py-3 px-2 text-slate-600 font-sans">{item.archetype}</td>
                      <td className="py-3 px-3 text-right">
                        <span className="px-2 py-0.5 rounded-lg text-[10px] font-mono-num font-medium bg-slate-100 text-slate-600">
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
