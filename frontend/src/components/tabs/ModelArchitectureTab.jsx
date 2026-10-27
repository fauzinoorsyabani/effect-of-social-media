import React from 'react';
import { Cpu, Award, GitBranch } from 'lucide-react';
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
        backgroundColor: '#294f82',
        hoverBackgroundColor: '#1e3a63',
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
        backgroundColor: '#20252b',
        titleFont: { family: 'JetBrains Mono', size: 11 },
        bodyFont: { family: 'JetBrains Mono', size: 11 },
        padding: 8,
        cornerRadius: 5,
        callbacks: {
          label: (context) => ` Weight: ${(context.raw * 100).toFixed(2)}%`,
        },
      },
    },
    scales: {
      x: {
        grid: { color: '#f0f3f6' },
        ticks: {
          color: '#5b6570',
          font: { family: 'JetBrains Mono', size: 10 },
          callback: (value) => `${(value * 100).toFixed(0)}%`,
        },
      },
      y: {
        grid: { display: false },
        ticks: { color: '#20252b', font: { family: 'JetBrains Mono', size: 10 } },
      },
    },
  };

  return (
    <section className="space-y-6">
      {/* Section Header */}
      <div className="pb-4 border-b border-[#e0e5e9]">
        <div className="rea-badge mb-2">
          <Cpu className="w-3 h-3 text-[#294f82]" />
          <span>PRODUCTION MACHINE LEARNING PIPELINE</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#20252b]">
          Model Architecture, Benchmarks & Feature Attribution
        </h2>
        <p className="text-xs sm:text-sm text-[#5b6570] mt-1 max-w-2xl">
          Empirical cross-validation benchmarks, loss curves, and mathematical feature importance weights fit across 4,500 student records.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7 space-y-5">
          {/* Classifier Table */}
          <div className="rea-card p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-xs text-[#20252b] uppercase tracking-wider">
                Multi-Class Impact Classifier (Test Set N = 450)
              </h3>
              <span className="rea-badge font-mono-num text-[10px]">
                Stratified 80/10/10 Split
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="text-[#5b6570] bg-[#fafbfc] border-y border-[#e0e5e9] font-mono-num text-[11px]">
                  <tr>
                    <th className="py-2.5 px-3">Candidate Algorithm</th>
                    <th className="py-2.5 px-2">Val Macro F1</th>
                    <th className="py-2.5 px-2">Test Macro F1</th>
                    <th className="py-2.5 px-2">Weighted F1</th>
                    <th className="py-2.5 px-3 text-right">Test Accuracy</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e0e5e9] text-[#20252b] font-mono-num">
                  <tr className="hover:bg-[#f4f6f8] transition-colors">
                    <td className="py-2.5 px-3 font-sans font-medium text-[#20252b]">
                      Logistic Regression (L2 Balanced)
                    </td>
                    <td className="px-2">0.9252</td>
                    <td className="px-2">0.9105</td>
                    <td className="px-2">0.9591</td>
                    <td className="px-3 text-right font-medium">95.78%</td>
                  </tr>
                  <tr className="hover:bg-[#f4f6f8] transition-colors">
                    <td className="py-2.5 px-3 font-sans font-medium text-[#20252b]">
                      Random Forest (200 Trees)
                    </td>
                    <td className="px-2">0.9357</td>
                    <td className="px-2">0.8790</td>
                    <td className="px-2">0.9506</td>
                    <td className="px-3 text-right font-medium">94.89%</td>
                  </tr>
                  <tr className="bg-[#ecfdf5] text-[#059669] font-semibold">
                    <td className="py-2.5 px-3 font-sans font-semibold text-[#059669] flex items-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#059669] mr-2"></span>
                      XGBoost (Production Champion)
                    </td>
                    <td className="px-2">0.9328</td>
                    <td className="px-2 font-bold text-[#059669]">0.9225</td>
                    <td className="px-2">0.9632</td>
                    <td className="px-3 text-right font-bold text-[#059669]">96.22%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Regression Table */}
          <div className="rea-card p-5 space-y-3">
            <h3 className="font-semibold text-xs text-[#20252b] uppercase tracking-wider">
              Continuous Parameter Regressors (Test Set N = 450)
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="text-[#5b6570] bg-[#fafbfc] border-y border-[#e0e5e9] font-mono-num text-[11px]">
                  <tr>
                    <th className="py-2.5 px-3">Target Phenotypic Metric</th>
                    <th className="py-2.5 px-2">Champion Architecture</th>
                    <th className="py-2.5 px-2">Test R²</th>
                    <th className="py-2.5 px-2">Test RMSE</th>
                    <th className="py-2.5 px-3 text-right">Test MAE</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e0e5e9] text-[#20252b] font-mono-num">
                  <tr className="hover:bg-[#f4f6f8] transition-colors">
                    <td className="py-2.5 px-3 font-sans font-medium text-[#20252b]">
                      Academic Performance GPA (1.0-4.0)
                    </td>
                    <td className="px-2 text-[#5b6570]">Ridge Regression</td>
                    <td className="px-2 text-[#059669] font-bold">0.5033</td>
                    <td className="px-2">0.2684</td>
                    <td className="px-3 text-right">0.2141</td>
                  </tr>
                  <tr className="hover:bg-[#f4f6f8] transition-colors">
                    <td className="py-2.5 px-3 font-sans font-medium text-[#20252b]">
                      Mental Health Resilience (0-100)
                    </td>
                    <td className="px-2 text-[#5b6570]">Ridge Regression</td>
                    <td className="px-2 text-[#059669] font-bold">0.8173</td>
                    <td className="px-2">5.4712</td>
                    <td className="px-3 text-right">4.4572</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Mathematical Proof Card */}
          <div className="rea-card p-4 space-y-1.5 bg-[#fafbfc]">
            <span className="text-[10px] font-mono-num uppercase tracking-wider text-[#5b6570] font-semibold">
              Mathematical Foundation
            </span>
            <div className="text-xs text-[#20252b]">
              <span className="font-mono-num font-semibold text-[#294f82]">Displacement Formulation: </span>
              <code className="font-mono-num bg-white px-2 py-0.5 rounded border border-[#e0e5e9] text-[#20252b]">
                Screen_to_Sleep_Ratio = Daily_Usage_Hours / Sleep_Duration_Hours
              </code>
            </div>
            <p className="text-[11px] text-[#5b6570] leading-relaxed pt-1">
              Engineered non-linear interaction features eliminate multicollinearity while maximizing gradient descent convergence across both continuous and ordinal loss functions.
            </p>
          </div>
        </div>

        {/* Feature Importance */}
        <div className="lg:col-span-5 rea-card p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-xs text-[#20252b] uppercase tracking-wider">
              Empirical Feature Importance Weights
            </h3>
            <span className="rea-badge font-mono-num text-[10px]">Tree Ensemble</span>
          </div>
          <p className="text-[11px] text-[#5b6570]">
            Attribution weights identifying primary drivers of student GPA variance.
          </p>
          <div className="h-76 pt-1">
            <Bar data={featChartData} options={featChartOptions} />
          </div>
        </div>
      </div>
    </section>
  );
}
