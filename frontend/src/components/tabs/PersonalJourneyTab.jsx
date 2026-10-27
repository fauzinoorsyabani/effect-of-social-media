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
    : ['Initial Target'];

  const mentalData = history.length ? history.map((h) => h.predicted_mental_health) : [78.4];
  const gpaData = history.length ? history.map((h) => h.predicted_gpa) : [3.48];

  const chartData = {
    labels: chartLabels,
    datasets: [
      {
        label: 'Mental Health Index (1-100)',
        data: mentalData,
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.08)',
        fill: true,
        tension: 0.35,
        yAxisID: 'y',
        pointRadius: 4,
        pointBackgroundColor: '#10B981',
      },
      {
        label: 'Predicted GPA (1.0-4.0)',
        data: gpaData,
        borderColor: '#0284C7',
        backgroundColor: 'rgba(2, 132, 199, 0.08)',
        fill: false,
        tension: 0.35,
        yAxisID: 'y1',
        pointRadius: 4,
        pointBackgroundColor: '#0284C7',
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
          color: '#475569',
          boxWidth: 12,
          font: { family: 'Plus Jakarta Sans', size: 12 },
        },
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(15, 23, 42, 0.05)' },
        ticks: { color: '#64748B' },
      },
      y: {
        type: 'linear',
        position: 'left',
        min: 0,
        max: 100,
        grid: { color: 'rgba(15, 23, 42, 0.06)' },
        ticks: { color: '#059669' },
      },
      y1: {
        type: 'linear',
        position: 'right',
        min: 1.0,
        max: 4.0,
        grid: { drawOnChartArea: false },
        ticks: { color: '#0284C7' },
      },
    },
  };

  return (
    <section className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-md bg-sky-50 border border-sky-200 text-sky-700 text-xs font-medium uppercase tracking-wider mb-2">
            <History className="w-3.5 h-3.5" />
            <span>Continuous Longitudinal Self-Tracking</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900">
            Personal Wellness & Academic Timeline
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Track your lifestyle adjustments over weeks to observe changes in mental resilience and projected GPA.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onExportHistory}
            className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 hover:text-slate-900 bg-white border border-slate-200 shadow-xs transition flex items-center space-x-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export History (JSON)</span>
          </button>
          <button
            onClick={onClearHistory}
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-rose-700 hover:text-rose-800 bg-rose-50 border border-rose-200 transition flex items-center space-x-1 cursor-pointer"
          >
            <Trash2 className="w-3 h-3" />
            <span>Clear History</span>
          </button>
        </div>
      </div>

      {/* History Progress Chart */}
      <div className="glass-card p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="font-medium text-sm text-slate-900 uppercase tracking-wider">
              Longitudinal Progression Chart
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Mental Health Index (Green) and Academic GPA (Blue) across saved assessments.
            </p>
          </div>
          <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
            {history.length} Saved Records
          </span>
        </div>
        <div className="h-72">
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>

      {/* History Table Log */}
      <div className="glass-card p-6 space-y-4">
        <h3 className="font-medium text-sm text-slate-900 uppercase tracking-wider">
          Assessment History Log
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-slate-500 bg-slate-50 border-b border-slate-200 font-mono">
              <tr>
                <th className="py-2.5 px-3">Date & Time</th>
                <th className="py-2.5 px-2">Screen Duration</th>
                <th className="py-2.5 px-2">Sleep Duration</th>
                <th className="py-2.5 px-2">Predicted GPA</th>
                <th className="py-2.5 px-2">Mental Health Index</th>
                <th className="py-2.5 px-2">Assigned Archetype</th>
                <th className="py-2.5 px-3 text-right">Risk Tier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-mono">
              {history.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-slate-500 font-sans">
                    No saved assessments yet. Use the Simulator to record your first lifestyle check-in.
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
                    <tr key={item.id || idx} className="hover:bg-slate-50/80 transition">
                      <td className="py-2.5 px-3 text-slate-900 font-medium">{dateFormatted}</td>
                      <td className="py-2.5 px-2 font-mono text-emerald-700 font-medium">{item.daily_usage_hours}h</td>
                      <td className="py-2.5 px-2 font-mono text-sky-700 font-medium">{item.sleep_duration_hours}h</td>
                      <td className="py-2.5 px-2 font-mono font-semibold text-slate-900">
                        {item.predicted_gpa.toFixed(2)}
                      </td>
                      <td className="py-2.5 px-2 font-mono font-semibold text-slate-900">
                        {item.predicted_mental_health.toFixed(1)}
                      </td>
                      <td className="py-2.5 px-2 text-slate-700 font-sans">{item.archetype}</td>
                      <td className="py-2.5 px-3 text-right">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-100 text-slate-700 border border-slate-200">
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
