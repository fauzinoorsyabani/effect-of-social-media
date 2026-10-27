import React from 'react';
import { Cpu } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function ModelArchitectureTab({ modelsData }) {
  const featImp = modelsData?.regression_gpa?.feature_importances || {
    Screen_to_Sleep_Ratio: 0.4858,
    Total_Weekly_Screen_Hours: 0.112,
    Daily_Usage_Hours: 0.0905,
    Perceived_Stress_Score: 0.0709,
    Sleep_Deficit_Impact: 0.0576,
    Mental_Health_Index: 0.0313,
    Weekend_Extra_Hours: 0.0309,
    Sleep_Duration_Hours: 0.0266,
  };

  const topFeats = Object.entries(featImp).slice(0, 8);

  const featChartData = {
    labels: topFeats.map((f) => f[0].replace(/_/g, ' ')),
    datasets: [
      {
        label: 'Importance Weight',
        data: topFeats.map((f) => f[1]),
        backgroundColor: '#10B981',
        borderRadius: 6,
      },
    ],
  };

  const featChartOptions = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { color: 'rgba(15, 23, 42, 0.05)' }, ticks: { color: '#64748B' } },
      y: { grid: { display: false }, ticks: { color: '#64748B', font: { size: 10 } } },
    },
  };

  return (
    <section className="space-y-8">
      <div>
        <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium uppercase tracking-wider mb-2">
          <Cpu className="w-3.5 h-3.5" />
          <span>Production AI Architecture</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900">
          Machine Learning Benchmarks & Attribution
        </h2>
        <p className="text-sm text-slate-600 mt-1">
          Cross-validation metrics, confusion matrices, and feature attribution across all models.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-6">
          {/* Classifier Table */}
          <div className="glass-card p-6 space-y-4">
            <h3 className="font-medium text-sm text-slate-900 tracking-wide uppercase">
              Classification Pipeline: Overall Impact (Test N = 450)
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="text-slate-500 bg-slate-50 border-b border-slate-200 font-mono">
                  <tr>
                    <th className="py-2.5 px-3">Algorithm</th>
                    <th className="py-2.5 px-2">Val Macro F1</th>
                    <th className="py-2.5 px-2">Test Macro F1</th>
                    <th className="py-2.5 px-2">Weighted F1</th>
                    <th className="py-2.5 px-3 text-right">Accuracy</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-mono">
                  <tr>
                    <td className="py-2.5 px-3 font-sans font-medium text-slate-900">
                      Logistic Regression (Balanced)
                    </td>
                    <td className="px-2">0.9252</td>
                    <td className="px-2">0.9105</td>
                    <td className="px-2">0.9591</td>
                    <td className="px-3 text-right">95.78%</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-sans font-medium text-slate-900">
                      Random Forest (200 Trees)
                    </td>
                    <td className="px-2">0.9357</td>
                    <td className="px-2">0.8790</td>
                    <td className="px-2">0.9506</td>
                    <td className="px-3 text-right">94.89%</td>
                  </tr>
                  <tr className="bg-emerald-50/70 text-emerald-800">
                    <td className="py-2.5 px-3 font-sans font-medium text-slate-900 flex items-center">
                      <span className="w-2 h-2 rounded-full bg-emerald-600 mr-2"></span>
                      XGBoost (Selected Champion)
                    </td>
                    <td className="px-2">0.9328</td>
                    <td className="px-2 font-semibold text-emerald-700">0.9225</td>
                    <td className="px-2">0.9632</td>
                    <td className="px-3 text-right font-semibold text-emerald-700">96.22%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Regression Table */}
          <div className="glass-card p-6 space-y-4">
            <h3 className="font-medium text-sm text-slate-900 tracking-wide uppercase">
              Continuous Regression Models
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="text-slate-500 bg-slate-50 border-b border-slate-200 font-mono">
                  <tr>
                    <th className="py-2.5 px-3">Target Metric</th>
                    <th className="py-2.5 px-2">Champion Model</th>
                    <th className="py-2.5 px-2">Test R²</th>
                    <th className="py-2.5 px-2">Test RMSE</th>
                    <th className="py-2.5 px-3 text-right">Test MAE</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-mono">
                  <tr>
                    <td className="py-2.5 px-3 font-sans font-medium text-slate-900">Academic Performance GPA</td>
                    <td className="px-2">Ridge Regression</td>
                    <td className="px-2 text-emerald-700 font-semibold">0.5033</td>
                    <td className="px-2">0.2684</td>
                    <td className="px-3 text-right">0.2141</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-sans font-medium text-slate-900">Mental Health Index (1-100)</td>
                    <td className="px-2">Ridge Regression</td>
                    <td className="px-2 text-emerald-700 font-semibold">0.8173</td>
                    <td className="px-2">5.4712</td>
                    <td className="px-3 text-right">4.4572</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Feature Importance */}
        <div className="lg:col-span-5 glass-card p-6 space-y-4">
          <h3 className="font-medium text-sm text-slate-900 tracking-wide uppercase">Top Predictive Drivers of GPA</h3>
          <p className="text-xs text-slate-500">Relative feature importance weights extracted from tree ensembles.</p>
          <div className="h-80">
            <Bar data={featChartData} options={featChartOptions} />
          </div>
        </div>
      </div>
    </section>
  );
}
