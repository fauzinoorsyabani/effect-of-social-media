import React from 'react';
import { AlertCircle } from 'lucide-react';
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
        label: 'Feature Weight',
        data: topFeats.map((f) => f[1]),
        backgroundColor: '#2563eb',
        hoverBackgroundColor: '#1d4ed8',
        borderRadius: 4,
      },
    ],
  };

  const featChartOptions = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#0f172a',
        titleFont: { family: 'JetBrains Mono', size: 11 },
        bodyFont: { family: 'JetBrains Mono', size: 11 },
        padding: 8,
        cornerRadius: 6,
        callbacks: {
          label: (context) => ` Weight: ${(context.raw * 100).toFixed(2)}%`,
        },
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(148, 163, 184, 0.1)' },
        ticks: {
          color: '#64748b',
          font: { family: 'JetBrains Mono', size: 10 },
          callback: (value) => `${(value * 100).toFixed(0)}%`,
        },
      },
      y: {
        grid: { display: false },
        ticks: { color: '#0f172a', font: { family: 'JetBrains Mono', size: 10 } },
      },
    },
  };

  return (
    <section className="space-y-6">
      {/* Section Header */}
      <div>
        <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight text-slate-900">
          Model Architecture, Benchmarks & Feature Attribution
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
          Empirical cross-validation benchmarks, loss curves, and mathematical feature importance weights fit across 4,500 student records.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
        <div className="lg:col-span-7 space-y-4 sm:space-y-5">
          {/* Classifier Table */}
          <div className="clean-card p-4 sm:p-6 space-y-3">
            <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-1">
              <h3 className="font-semibold text-xs text-slate-800 uppercase tracking-wider">
                Multi-Class Impact Classifier (Test Set N = 450)
              </h3>
              <span className="font-mono-num text-[11px] text-slate-400">
                Stratified 80/10/10 Split
              </span>
            </div>
            <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
              <table className="w-full text-left text-xs min-w-[520px]">
                <thead className="text-slate-400 bg-slate-50/70 font-mono-num text-[11px]">
                  <tr>
                    <th className="py-2.5 px-3 rounded-l-lg">Candidate Algorithm</th>
                    <th className="py-2.5 px-2">Val Macro F1</th>
                    <th className="py-2.5 px-2">Test Macro F1</th>
                    <th className="py-2.5 px-2">Weighted F1</th>
                    <th className="py-2.5 px-3 text-right rounded-r-lg">Test Accuracy</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800 font-mono-num">
                  <tr className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-3 font-sans font-medium text-slate-900">
                      Logistic Regression (L2 Balanced)
                    </td>
                    <td className="px-2">0.9252</td>
                    <td className="px-2">0.9105</td>
                    <td className="px-2">0.9591</td>
                    <td className="px-3 text-right font-medium">95.78%</td>
                  </tr>
                  <tr className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-3 font-sans font-medium text-slate-900">
                      Random Forest (200 Trees)
                    </td>
                    <td className="px-2">0.9357</td>
                    <td className="px-2">0.8790</td>
                    <td className="px-2">0.9506</td>
                    <td className="px-3 text-right font-medium">94.89%</td>
                  </tr>
                  <tr className="bg-blue-50/60 text-blue-900 font-semibold">
                    <td className="py-3 px-3 font-sans font-semibold text-blue-700 flex items-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mr-2 shrink-0"></span>
                      XGBoost (Production Champion)
                    </td>
                    <td className="px-2">0.9328</td>
                    <td className="px-2 font-bold text-blue-700">0.9225</td>
                    <td className="px-2">0.9632</td>
                    <td className="px-3 text-right font-bold text-blue-700">96.22%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Regression Table */}
          <div className="clean-card p-4 sm:p-6 space-y-3">
            <h3 className="font-semibold text-xs text-slate-800 uppercase tracking-wider">
              Continuous Parameter Regressors (Test Set N = 450)
            </h3>
            <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
              <table className="w-full text-left text-xs min-w-[520px]">
                <thead className="text-slate-400 bg-slate-50/70 font-mono-num text-[11px]">
                  <tr>
                    <th className="py-2.5 px-3 rounded-l-lg">Target Phenotypic Metric</th>
                    <th className="py-2.5 px-2">Champion Architecture</th>
                    <th className="py-2.5 px-2">Test R²</th>
                    <th className="py-2.5 px-2">Test RMSE</th>
                    <th className="py-2.5 px-3 text-right rounded-r-lg">Test MAE</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800 font-mono-num">
                  <tr className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-3 font-sans font-medium text-slate-900">
                      Academic Performance GPA (1.0-4.0)
                    </td>
                    <td className="px-2 text-slate-500">Ridge Regression</td>
                    <td className="px-2 text-blue-600 font-bold">0.5033</td>
                    <td className="px-2">0.2684</td>
                    <td className="px-3 text-right">0.2141</td>
                  </tr>
                  <tr className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-3 font-sans font-medium text-slate-900">
                      Mental Health Resilience (0-100)
                    </td>
                    <td className="px-2 text-slate-500">Ridge Regression</td>
                    <td className="px-2 text-blue-600 font-bold">0.8173</td>
                    <td className="px-2">5.4712</td>
                    <td className="px-3 text-right">4.4572</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Mathematical Proof Card */}
          <div className="clean-card p-4 sm:p-5 space-y-2 bg-slate-50/70">
            <span className="text-[10px] font-mono-num uppercase tracking-wider text-slate-400 font-semibold">
              Mathematical Foundation
            </span>
            <div className="text-xs text-slate-800 flex flex-wrap items-center gap-1.5">
              <span className="font-mono-num font-semibold text-blue-600">Displacement Formulation: </span>
              <code className="font-mono-num bg-white px-2 py-0.5 rounded-md text-slate-800 shadow-2xs break-all">
                Screen_to_Sleep_Ratio = Daily_Usage_Hours / Sleep_Duration_Hours
              </code>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed pt-1">
              Engineered non-linear interaction features eliminate multicollinearity while maximizing gradient descent convergence across both continuous and ordinal loss functions.
            </p>
          </div>
        </div>

        {/* Feature Importance */}
        <div className="lg:col-span-5 clean-card p-4 sm:p-6 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-xs text-slate-800 uppercase tracking-wider">
              Empirical Feature Importance Weights
            </h3>
            <span className="font-mono-num text-[11px] text-slate-400">Tree Ensemble</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Attribution weights identifying primary drivers of student GPA variance.
          </p>
          <div className="h-64 sm:h-76 pt-2">
            <Bar data={featChartData} options={featChartOptions} />
          </div>
        </div>
      </div>

      {/* Methodological Limitations & Scientific Transparency */}
      <div className="clean-card p-4 sm:p-6 space-y-4 border border-slate-200/60">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="font-semibold text-xs text-slate-800 uppercase tracking-wider flex items-center">
            <AlertCircle className="w-4 h-4 text-amber-600 mr-2" />
            Methodological Scope & Scientific Limitations
          </h3>
          <span className="font-mono-num text-[11px] text-slate-400">Scientific Integrity</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50/80 space-y-1.5">
            <strong className="text-slate-900 font-semibold block">1. Association vs. Causal Directionality</strong>
            <p className="text-slate-600 leading-relaxed">
              Regression outputs demonstrate covariation across digital exposure and sleep duration. In observational behavioral research, causality is often bidirectional: screen scrolling may displace bedtime, or existing stress/insomnia may prompt late-night phone consumption.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50/80 space-y-1.5">
            <strong className="text-slate-900 font-semibold block">2. Benchmark Dataset Provenance</strong>
            <p className="text-slate-600 leading-relaxed">
              Models are trained on an open Kaggle benchmark dataset (N = 4,500). Regularized statistical distributions suggest synthetic/semi-synthetic curation. Results serve as an architectural proof-of-concept rather than verified clinical epidemiology.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50/80 space-y-1.5">
            <strong className="text-slate-900 font-semibold block">3. Prediction Uncertainty & Error Bounds</strong>
            <p className="text-slate-600 leading-relaxed">
              Continuous GPA regression demonstrates moderate predictive fit (R² = 0.503, RMSE ±0.268). Estimations must be interpreted as probabilistic intervals (e.g. 3.47 ± 0.27) rather than deterministic exact scores.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50/80 space-y-1.5">
            <strong className="text-slate-900 font-semibold block">4. Cultural & Regional Generalization</strong>
            <p className="text-slate-600 leading-relaxed">
              Academic grading scales and lifestyle patterns vary significantly across geographies. Future development focuses on opt-in empirical surveys with Indonesian university students to calibrate domain-specific weights.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
